import fs from 'fs/promises';
import path from 'path';
import { chromium, Browser as PlaywrightBrowser, Page as PlaywrightPage, ViewportSize } from 'playwright-core';
import * as compilerSfc from '@vue/compiler-sfc';
import * as Vue from 'vue';
const { createSSRApp, ref } = Vue;
import * as serverRenderer from '@vue/server-renderer';
const { renderToString } = serverRenderer;
import { hostConfig } from './config/host.config.js';

/**
 * Vue3Renderer配置选项接口
 */
interface Vue3RendererOptions {
  chromePath?: string;
  launchOptions?: any; // Playwright的launch选项类型
}

/**
 * 截图选项接口
 */
interface ScreenshotOptions {
  width?: number;
  height?: number;
  scale?: number;
  type?: 'png' | 'jpeg';
  fullPage?: boolean;
  transparent?: boolean;
  quality?: number;
  deviceName?: string; // 添加设备名称选项
}

/**
 * 渲染结果接口
 */
interface RenderResult {
  html: string;
  css: string;
}

/**
 * 解析的Vue组件接口
 */
interface ParsedVueComponent {
  template: string;
  component: Record<string, any>;
  styles: string[];
  hasScriptSetup: boolean;
  scriptSetup: string;
}

/**
 * Vue3单文件组件渲染器
 * 高效地将Vue3单文件组件转换为HTML并支持高清晰度截图
 * 使用内存中处理技术，无需临时文件
 * 支持浏览器实例复用，减少资源开销
 */
export class Vue3Renderer {
  private chromePath: string;
  private launchOptions: any; // Playwright的launch选项类型
  public browser: PlaywrightBrowser | null;
  private isLaunching: boolean;
  private pendingLaunch: Promise<PlaywrightBrowser> | null;

  /**
   * 构造函数
   * @param options - 配置选项
   */
  constructor(options: Vue3RendererOptions = {}) {
    this.chromePath = options.chromePath || hostConfig.chromePath;
    this.launchOptions = options.launchOptions || {};
    this.browser = null;
    this.isLaunching = false;
    this.pendingLaunch = null;
  }

  /**
   * 获取浏览器实例，如果不存在则创建
   * @returns Playwright浏览器实例
   */
  async getBrowser(): Promise<PlaywrightBrowser> {
    // 如果浏览器已经存在且正常，直接返回
    if (this.browser) {
      try {
        // Playwright没有直接检查浏览器是否可用的方法，但我们可以通过创建页面来验证
        const context = await this.browser.newContext();
        await context.close();
        return this.browser;
      } catch (error) {
        console.log('浏览器实例不可用，将创建新实例');
        this.browser = null;
      }
    }

    // 如果已经有正在启动的进程，等待它完成
    if (this.isLaunching && this.pendingLaunch) {
      return this.pendingLaunch;
    }

    // 创建新的浏览器实例
    this.isLaunching = true;
    this.pendingLaunch = chromium.launch({
      executablePath: this.chromePath,
      headless: true, // Playwright中true相当于puppeteer的'new'
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
      ...this.launchOptions
    });

    try {
      this.browser = await this.pendingLaunch;
      console.log('已创建新的浏览器实例');
      
      // Playwright不需要监听断开连接事件，因为它会在进程结束时自动清理
      
      return this.browser;
    } catch (error) {
      console.error('启动浏览器时出错:', error);
      throw error;
    } finally {
      this.isLaunching = false;
      this.pendingLaunch = null;
    }
  }

  /**
   * 关闭浏览器实例
   */
  async closeBrowser(): Promise<void> {
    if (this.browser) {
      try {
        await this.browser.close();
        console.log('浏览器实例已关闭');
      } catch (error) {
        console.error('关闭浏览器时出错:', error);
      }
      this.browser = null;
    }
  }

  /**
   * 解析Vue单文件组件
   * @param filePath - Vue文件路径
   * @returns 解析后的组件定义
   */
  async parseVueFile(filePath: string): Promise<ParsedVueComponent> {
    const source = await fs.readFile(filePath, 'utf-8');
    const filename = path.basename(filePath);

    // 使用Vue编译器解析SFC
    const { descriptor } = compilerSfc.parse(source, { filename });
    
    // 提取模板、脚本和样式
    const template = descriptor.template?.content || '';
    const script = descriptor.script?.content || '';
    const scriptSetup = descriptor.scriptSetup?.content || '';
    const styles = descriptor.styles.map(style => style.content);
    
    // 检查是否使用了setup语法糖
    const hasScriptSetup = descriptor.scriptSetup != null;
    
    // 创建组件对象
    let component: Record<string, any> = {};
    
    if (!hasScriptSetup) {
      // 传统格式：处理普通script标签
      let componentScript = script.replace(/export\s+default\s+/, 'return ');
      const componentFn = new Function(componentScript);
      component = componentFn();
    }
    
    return { template, component, styles, hasScriptSetup, scriptSetup };
  }

  // 在 parseVueFile 方法中增强处理 scriptSetup

  /**
   * 从script setup内容中提取变量定义
   * @param scriptContent - script setup的内容
   * @returns 提取的变量对象
   */
  extractSetupVars(scriptContent: string): Record<string, any> {
    // 简单的变量提取，实际项目中可能需要更复杂的解析
    const result: Record<string, any> = {};
    
    try {
      // 查找所有const声明
      const constMatches = scriptContent.matchAll(/const\s+(\w+)\s*=\s*ref<.*>\(['"](.*)['"]\)/g);
      for (const match of constMatches) {
        const varName = match[1];
        const varValue = match[2];
        if (varName && varValue !== undefined) {
          // 创建响应式变量
          result[varName] = varValue;
        }
      }
      
      return result;
    } catch (error) {
      console.error('提取setup变量时出错:', error);
      return {};
    }
  }

  /**
   * 将Vue单文件组件渲染为HTML
   * @param filePath - Vue文件路径
   * @param props - 要注入到组件的属性/变量
   * @returns 渲染后的HTML和CSS
   */
  async renderToHTML(filePath: string, props: Record<string, any> = {}): Promise<RenderResult> {
    try {
      // 解析Vue文件，获取组件定义
      const { template, component, styles, hasScriptSetup } = await this.parseVueFile(filePath);
      
      // 创建应用实例 - 完全依赖外部传入的props
      const app = hasScriptSetup 
        ? this.createSetupApp(template, props)
        : this.createTraditionalApp(template, component, props);
      
      // 渲染为HTML
      const appContent = await renderToString(app);
      const css = styles.join('\n');
      
      // 构建完整HTML文档
      const html = this.wrapWithHtml(appContent, css);
      
      return { html, css };
    } catch (error) {
      console.error('渲染Vue组件时出错:', error);
      throw error;
    }
  }


  /**
   * 为使用setup语法糖的组件创建应用实例
   */
  private createSetupApp(template: string, props: Record<string, any>): any {
    // 直接使用外部传入的props，不再提取内部变量
    return createSSRApp({
      template: this.sanitizeTemplate(template),
      setup: () => {
        // 在setup中返回props，使其在模板中可访问
        return { ...props };
      }
    });
  }

  /**
   * 为传统组件创建应用实例
   */
  private createTraditionalApp(template: string, component: Record<string, any>, props: Record<string, any>): any {
    // 设置模板
    component.template = this.sanitizeTemplate(template);
    
    // 创建应用
    const app = createSSRApp(component);
    
    // 如果有props，注入到组件中
    if (Object.keys(props).length > 0) {
      // 在应用级别提供props
      app.provide('externalProps', props);
      
      // 增强setup函数
      this.enhanceSetup(component, app);
    }
    
    return app;
  }
  /**
   * 清理模板中的潜在问题表达式
   * 解决 "__name is not defined" 错误
   */
  private sanitizeTemplate(template: string): string {
    // 移除可能导致问题的表达式
    // 这里我们返回原始模板，但在需要时可以添加清理逻辑
    return template;
  }
  /**
   * 增强组件的setup函数以注入外部props
   */
  private enhanceSetup(component: Record<string, any>, app: any): void {
    // 保存原始setup
    const originalSetup = component.setup || (() => ({}));
    
    // 重写setup函数
    component.setup = function(componentProps: Record<string, any>, context: any) {
      // 获取外部props
      const externalProps = (app as any)._context.provides.externalProps || {};
      
      // 对于外部传入的props，我们优先使用它们，完全覆盖内部定义
      // 只有当某个属性在externalProps中不存在时，才使用组件内部的定义
      const setupResult = originalSetup.call(this, componentProps, context);
      
      // 处理渲染函数
      if (typeof setupResult === 'function') return setupResult;
      
      // 直接返回外部props，不再合并
      return externalProps;
    };
  }

  /**
   * 将组件内容包装为完整HTML
   */
  private wrapWithHtml(content: string, css: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rendered Vue Component</title>
        <style>${css}</style>
      </head>
      <body>
        <div id="app">${content}</div>
      </body>
      </html>
    `;
  }


  /**
   * 渲染Vue组件并生成截图
   * @param vueFilePath - Vue文件路径
   * @param outputPath - 输出文件路径，如果为null则直接返回缓冲区
   * @param options - 截图选项
   * @param props - 组件属性
   * @returns 如果outputPath为null，则返回截图缓冲区；否则返回void
   */
  async renderAndScreenshot(
    vueFilePath: string, 
    outputPath: string | null = null, 
    options: ScreenshotOptions = {}, 
    props: Record<string, any> = {}
  ): Promise<Buffer | void> {
    try {
      // 获取浏览器实例
      const browser = await this.getBrowser();
      
      // 创建新页面
      const context = await browser.newContext();
      const page: PlaywrightPage = await context.newPage();
      
      try {
        // 设置视口大小
        const viewport: ViewportSize = {
          width: options.width || 1280,
          height: options.height || 800
        };
        await page.setViewportSize(viewport);
        
        // 设置设备缩放因子（通过CSS zoom模拟）
        if (options.scale && options.scale !== 1) {
          await page.addStyleTag({ 
            content: `body { zoom: ${options.scale}; }` 
          });
        }
        
        // 渲染组件为HTML
        const { html } = await this.renderToHTML(vueFilePath, props);
        
        // 将HTML内容设置到页面
        await page.setContent(html, { waitUntil: 'domcontentloaded' });
        await page.waitForFunction(() => {
          const images = Array.from(document.querySelectorAll('img'));
          return images.every(img => img.complete);
        }, {}, { timeout: 10000 });
        
        // 准备截图选项
        const screenshotOptions: any = {
          fullPage: options.fullPage || false,
          type: options.type || 'png',
          omitBackground: options.transparent || false
        };
        
        // 如果提供了输出路径，则写入文件
        if (outputPath) {
          screenshotOptions.path = outputPath;
        }
        
        // 如果是JPEG格式，添加质量选项
        if (screenshotOptions.type === 'jpeg') {
          screenshotOptions.quality = options.quality || 95;
        }
        
        // 生成截图
        const buffer = await page.screenshot(screenshotOptions);
        
        // 关闭上下文
        await context.close();
        
        // 如果有输出路径，记录日志
        if (outputPath) {
          console.log(`已生成截图: ${outputPath}`);
          return;
        }
        
        // 否则返回缓冲区
        return buffer;
      } finally {
        // 关闭上下文（如果尚未关闭）
        try {
          await context.close();
        } catch (e) {
          // 忽略错误，因为上下文可能已被关闭
        }
      }
    } catch (error) {
      console.error('渲染和截图时出错:', error);
      throw error;
    }
  }

  /**
   * 从Vue文件生成截图并返回缓冲区
   * @param vueFilePath - Vue文件路径
   * @param options - 截图选项
   * @param props - 组件属性
   * @returns 截图缓冲区
   */
  async captureScreenshot(
    vueFilePath: string,
    options: ScreenshotOptions = {},
    props: Record<string, any> = {}
  ): Promise<Buffer> {
    return this.renderAndScreenshot(vueFilePath, null, options, props) as Promise<Buffer>;
  }

  /**
   * 从Vue文件生成截图并保存到文件
   * @param vueFilePath - Vue文件路径
   * @param outputPath - 输出文件路径
   * @param options - 截图选项
   * @param props - 组件属性
   */
  async screenshotFromVue(
    vueFilePath: string, 
    outputPath: string, 
    options: ScreenshotOptions = {}, 
    props: Record<string, any> = {}
  ): Promise<void> {
    await this.renderAndScreenshot(vueFilePath, outputPath, options, props);
  }
}