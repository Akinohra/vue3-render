import express, { Request, Response, Express, RequestHandler } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs/promises';
import { Vue3Renderer } from './Vue3Render.js';
import { hostConfig } from './config/host.config.js';

const app: Express = express();
const port = hostConfig.port;

// 设置body-parser用于处理请求
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// 定义模板目录
const templatesDir = path.join(process.cwd(), 'src/templates');
const outputDir = path.join(process.cwd(), 'src/outputs');

// 确保目录存在
async function ensureDirsExist(): Promise<void> {
  try {
    await fs.mkdir(templatesDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });
    console.log('已创建必要的目录');
  } catch (err) {
    console.error('创建目录时出错:', err);
  }
}

// 截图选项接口
interface ScreenshotOptions {
  width?: number;
  height?: number;
  scale?: number;
  type?: 'png' | 'jpeg';
  fullPage?: boolean;
  transparent?: boolean;
  quality?: number;
}

// 渲染请求接口
interface RenderRequest {
  filename: string;
  props?: Record<string, any>;
}

// 截图请求接口
interface ScreenshotRequest extends RenderRequest, ScreenshotOptions {}

// 创建一个Vue3Renderer实例池
class RendererPool {
  private options: Record<string, any>;
  private pool: Vue3Renderer[];
  private maxSize: number;
  private busy: Set<Vue3Renderer>;

  constructor(options: Record<string, any>) {
    this.options = options;
    this.pool = [];
    this.maxSize = options.poolSize || 2;
    this.busy = new Set();
  }

  async getRenderer(): Promise<Vue3Renderer> {
    // 检查池中是否有可用的渲染器
    for (const renderer of this.pool) {
      if (!this.busy.has(renderer)) {
        this.busy.add(renderer);
        return renderer;
      }
    }

    // 如果池未满，创建新的渲染器
    if (this.pool.length < this.maxSize) {
      const renderer = new Vue3Renderer(this.options);
      this.pool.push(renderer);
      this.busy.add(renderer);
      console.log(`创建新的渲染器实例，当前池大小: ${this.pool.length}`);
      return renderer;
    }

    // 如果池已满，等待一个渲染器变为可用
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        for (const renderer of this.pool) {
          if (!this.busy.has(renderer)) {
            clearInterval(checkInterval);
            this.busy.add(renderer);
            resolve(renderer);
            return;
          }
        }
      }, 100);
    });
  }

  releaseRenderer(renderer: Vue3Renderer): void {
    this.busy.delete(renderer);
  }

  async closeAll(): Promise<void> {
    for (const renderer of this.pool) {
      if (renderer.browser) {
        await renderer.browser.close();
      }
    }
    this.pool = [];
    this.busy.clear();
    console.log('关闭所有渲染器实例');
  }
  
  getPoolSize(): number {
    return this.pool.length;
  }
}

// 创建渲染器池
const rendererPool = new RendererPool({
  chromePath: hostConfig.chromePath,
  poolSize: 2,
  launchOptions: {
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox'
    ]
  }
});

// API路由

// 1. 渲染Vue文件为HTML
const renderHtmlHandler: RequestHandler = async (req: Request, res: Response) => {
  const { filename, props } = req.body as RenderRequest;
  
  if (!filename) {
    return res.status(400).json({ error: '未提供Vue文件名' });
  }

  const vueFilePath = path.join(templatesDir, filename);
  
  // 检查文件是否存在
  try {
    await fs.access(vueFilePath);
  } catch (error) {
    return res.status(404).json({ error: `Vue文件不存在: ${filename}` });
  }

  const renderer = await rendererPool.getRenderer();
  try {
    const { html } = await renderer.renderToHTML(vueFilePath, props || {});
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error: any) {
    console.error('渲染HTML出错:', error);
    res.status(500).json({ error: `渲染失败: ${error.message}` });
  } finally {
    rendererPool.releaseRenderer(renderer);
  }
};

app.post('/api/render-html', renderHtmlHandler);

// 2. 从Vue文件生成截图
const screenshotHandler: RequestHandler = async (req: Request, res: Response) => {
  const { filename, props, ...options } = req.body as ScreenshotRequest;
  
  if (!filename) {
    return res.status(400).json({ error: '未提供Vue文件名' });
  }

  const vueFilePath = path.join(templatesDir, filename);
  
  // 检查文件是否存在
  try {
    await fs.access(vueFilePath);
  } catch (error) {
    return res.status(404).json({ error: `Vue文件不存在: ${filename}` });
  }

  const renderer = await rendererPool.getRenderer();
  try {
    // 解析截图选项
    const screenshotOptions: ScreenshotOptions = {
      width: parseInt(options.width as unknown as string) || 1280,
      height: parseInt(options.height as unknown as string) || 800,
      scale: parseInt(options.scale as unknown as string) || 2,
      type: options.type || 'png',
      fullPage: options.fullPage === true,
      transparent: options.transparent === true,
    };
    
    // 如果是JPEG格式，添加质量选项
    if (screenshotOptions.type && screenshotOptions.type.toLowerCase() === 'jpeg') {
      screenshotOptions.quality = parseInt(options.quality as unknown as string) || 95;
    }
    
    // 直接生成截图缓冲区，不创建临时文件
    const screenshotBuffer = await renderer.captureScreenshot(vueFilePath, screenshotOptions, props || {});
    
    // 设置正确的内容类型
    const contentType = screenshotOptions.type && screenshotOptions.type.toLowerCase() === 'jpeg' ? 'image/jpeg' : 'image/png';
    res.setHeader('Content-Type', contentType);
    res.send(screenshotBuffer);
  } catch (error: any) {
    console.error('截图出错:', error);
    res.status(500).json({ error: `截图失败: ${error.message}` });
  } finally {
    rendererPool.releaseRenderer(renderer);
  }
};

app.post('/api/screenshot', screenshotHandler);

// 3. 获取可用的Vue模板列表
const getTemplatesHandler: RequestHandler = async (_req: Request, res: Response) => {
  try {
    const files = await fs.readdir(templatesDir);
    const vueFiles = files.filter(file => file.endsWith('.vue'));
    res.json({ templates: vueFiles });
  } catch (error: any) {
    console.error('读取模板目录出错:', error);
    res.status(500).json({ error: `无法获取模板列表: ${error.message}` });
  }
};

app.get('/api/templates', getTemplatesHandler);

// 4. 健康检查接口
const healthCheckHandler: RequestHandler = (_req: Request, res: Response) => {
  res.json({ status: 'ok', poolSize: rendererPool.getPoolSize() });
};

app.get('/api/health', healthCheckHandler);

// 启动服务器
async function startServer(): Promise<void> {
  await ensureDirsExist();
  
  app.listen(port,'0.0.0.0', () => {
    console.log(`Vue3渲染服务已启动，监听端口: ${port}`);
    console.log(`健康检查: http://localhost:${port}/api/health`);
    console.log(`模板目录: ${templatesDir}`);
  });
  
  // 优雅关闭
  process.on('SIGTERM', async () => {
    console.log('收到 SIGTERM 信号，正在关闭服务...');
    await rendererPool.closeAll();
    process.exit(0);
  });
  
  process.on('SIGINT', async () => {
    console.log('收到 SIGINT 信号，正在关闭服务...');
    await rendererPool.closeAll();
    process.exit(0);
  });
}

startServer(); 