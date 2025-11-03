import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';
import { version } from 'os';
import axios from 'axios';

// 定义API响应的接口
interface HealthResponse {
  status: string;
  poolSize?: number;
}

interface TemplatesResponse {
  templates: string[];
}

interface ErrorResponse {
  error: string;
}

// 定义组件Props接口
interface ComponentProps {
  title?: string;
  username?: string;
  summaryCards?: Array<{
    icon: string;
    value: string;
    label: string;
    type: string;
    trend: string;
    trendValue: string;
  }>;
  tableHeaders?: string[];
  tableData?: string[][];
  [key: string]: any;
}

// 使用正确的路径指向src/outputs目录
const outputsDir = path.join(process.cwd(), 'src/outputs');
async function ensureOutputsDir() {
  try {
    await fs.access(outputsDir);
  } catch (error) {
    await fs.mkdir(outputsDir, { recursive: true });
    console.log(`创建输出目录: ${outputsDir}`);
  }
}

// API端点配置
const API_BASE_URL = 'http://127.0.0.1:65002/api';
const HEALTH_ENDPOINT = `${API_BASE_URL}/health`;
const RENDER_HTML_ENDPOINT = `${API_BASE_URL}/render-html`;
const SCREENSHOT_ENDPOINT = `${API_BASE_URL}/screenshot`;
const TEMPLATES_ENDPOINT = `${API_BASE_URL}/templates`;

// 测试Vue文件名 - 确保文件存在于src/templates目录
const VUE_FILENAME = '/niu-info.vue';

/**
 * 读取Vue文件并生成默认Props
 */
async function generateDefaultProps(filename: string): Promise<any> {
    try {
      // 为 niu-info.vue 组件准备数据
      const userInfo = {
        userId: 123456789,
        nickname: '测试用户',
        rank: 1,
        percent: 99.5,
        cooldownTime: '00:15:30',
        length: 25.6,
        injectedCount: 128,
        ejaculateCount: 89,
        charm: 95,
        injectedValue: 2560,
        ejaculatedValue: 1890
      };
  
      console.log('数据处理完成！');
      console.log('处理后的数据:', { userInfo });
      
      return {
        userInfo
      };
    } catch (error: any) {
      console.error(`读取Vue文件失败: ${error.message}`);
      // 如果读取失败，返回自定义props或空对象
      return  {};
    }
  }

/**
 * 检查服务健康状态
 */
async function checkHealth(): Promise<boolean> {
  try {
    console.log('正在检查服务健康状态...');
    const response = await fetch(HEALTH_ENDPOINT);
    const data = await response.json() as HealthResponse;
    console.log('健康检查结果:', data);
    return data.status === 'ok';
  } catch (error: any) {
    console.error('健康检查失败:', error.message);
    return false;
  }
}

/**
 * 测试HTML渲染API
 */
async function testRenderHTML(): Promise<boolean> {
  try {
    console.log('\n正在测试HTML渲染API...');
    
    // 生成默认Props
    const props = await generateDefaultProps(VUE_FILENAME);
    
    // 直接发送文件名而不是上传文件
    console.log('正在发送请求...');
    const response = await fetch(RENDER_HTML_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filename: VUE_FILENAME,
        props
      })
    });
    
    if (!response.ok) {
      const error = await response.json() as ErrorResponse;
      throw new Error(`请求失败: ${error.error}`);
    }
    
    const html = await response.text();
    console.log('HTML渲染成功！HTML长度:', html.length);
    
    // 保存HTML以便查看
    const outputPath = path.join(outputsDir, 'api-output.html');
    await fs.writeFile(outputPath, html);
    console.log(`HTML已保存到: ${outputPath}`);
    
    return true;
  } catch (error: any) {
    console.error('HTML渲染测试失败:', error.message);
    return false;
  }
}

/**
 * 测试截图API
 */
async function testScreenshot(): Promise<boolean> {
  try {
    console.log('\n正在测试截图API...');
    
    // 生成PNG截图的默认Props
    const pngProps = await generateDefaultProps(VUE_FILENAME);
    
    // PNG格式截图
    console.log('正在发送PNG截图请求...');
    const response = await fetch(SCREENSHOT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filename: VUE_FILENAME,
        width: 1000,
        height: 450,
        scale: 3,
        type: 'png',
        fullPage: true,
        props: pngProps
      })
    });
    
    if (!response.ok) {
      const error = await response.json() as ErrorResponse;
      throw new Error(`请求失败: ${error.error}`);
    }
    
    const imageBuffer = Buffer.from(await response.arrayBuffer());
    console.log('截图成功！图片大小:', imageBuffer.length, '字节');

    
    // 保存截图以便查看
    const outputPath = path.join(outputsDir, 'api-screenshot.png');
    await fs.writeFile(outputPath, imageBuffer);
    console.log(`截图已保存到: ${outputPath}`);
    
    return true;
  } catch (error: any) {
    console.error('截图测试失败:', error.message);
    return false;
  }
}

/**
 * 性能测试 - 连续多次请求测试性能
 */
async function performanceTest(iterations = 5): Promise<boolean> {
  try {
    console.log(`\n开始性能测试: ${iterations}次连续请求...`);
    
    const startTime = Date.now();
    const results: number[] = [];
    
    // 预先生成默认Props
    const defaultProps = await generateDefaultProps(VUE_FILENAME);
    
    for (let i = 0; i < iterations; i++) {
      console.log(`请求 ${i + 1}/${iterations}...`);
      const iterationStart = Date.now();
      
      // 为每次迭代创建自定义标题
      const props = {
        ...defaultProps,
        title: `性能测试 - 请求 ${i + 1}`
      };
      
      const response = await fetch(SCREENSHOT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filename: VUE_FILENAME,
          width: 800,
          height: 900,
          scale: 2,
          type: 'png',
          fullPage: true,
          props
        })
      });
      
      if (!response.ok) {
        const error = await response.json() as ErrorResponse;
        throw new Error(`请求 ${i + 1} 失败: ${error.error}`);
      }
      
      await Buffer.from(await response.arrayBuffer()); // 确保完全接收响应
      
      const iterationTime = Date.now() - iterationStart;
      results.push(iterationTime);
      
      console.log(`请求 ${i + 1} 完成，耗时: ${iterationTime}ms`);
    }
    
    const totalTime = Date.now() - startTime;
    const avgTime = results.reduce((a, b) => a + b, 0) / results.length;
    
    console.log('\n性能测试结果:');
    console.log(`总耗时: ${totalTime}ms`);
    console.log(`平均耗时: ${avgTime.toFixed(2)}ms`);
    console.log(`最短耗时: ${Math.min(...results)}ms`);
    console.log(`最长耗时: ${Math.max(...results)}ms`);
    
    // 查看性能提升
    console.log('\n浏览器实例复用带来的性能提升:');
    console.log(`第一次请求(冷启动): ${results[0]}ms`);
    const warmRequests = results.slice(1);
    const warmAvg = warmRequests.reduce((a, b) => a + b, 0) / warmRequests.length;
    console.log(`后续请求(热启动): ${warmAvg.toFixed(2)}ms`);
    const improvement = ((results[0] - warmAvg) / results[0] * 100).toFixed(2);
    console.log(`性能提升: ${improvement}%`);
    
    return true;
  } catch (error: any) {
    console.error('性能测试失败:', error.message);
    return false;
  }
}

/**
 * 运行所有测试
 */
async function runTests(): Promise<void> {
  console.log('======= Vue3渲染API测试 =======');
  
  // 确保输出目录存在
  await ensureOutputsDir();
  
  // 等待3秒，确保服务器已启动
  console.log('等待服务器启动...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // 健康检查
  const isHealthy = await checkHealth();
  if (!isHealthy) {
    console.error('服务器未准备好，请确保server.js已运行！');
    return;
  }
  
  // 测试HTML渲染
  await testRenderHTML();
  
  // 测试截图
  await testScreenshot();
  
  // 性能测试
  // await performanceTest();
  
  console.log('\n所有测试完成！');
}

// 运行测试
runTests();