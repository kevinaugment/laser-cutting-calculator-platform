#!/usr/bin/env node

/**
 * Cloudflare Pages API Deployment Script
 * 使用Cloudflare API直接部署激光切割计算器应用
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Cloudflare API 配置
const CLOUDFLARE_CONFIG = {
  email: 'yigetech@gmail.com',
  apiKey: 'd70a07155b7e29ba4c0fe1ac05e976fe6852f',
  accountId: null, // 将通过API获取
  projectName: 'laser-calc-app',
  domain: null // 将通过API获取
};

// API请求工具函数
function makeCloudflareRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.cloudflare.com',
      port: 443,
      path: `/client/v4${endpoint}`,
      method: method,
      headers: {
        'X-Auth-Email': CLOUDFLARE_CONFIG.email,
        'X-Auth-Key': CLOUDFLARE_CONFIG.apiKey,
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.success) {
            resolve(parsed);
          } else {
            reject(new Error(`API Error: ${JSON.stringify(parsed.errors)}`));
          }
        } catch (error) {
          reject(new Error(`Parse Error: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// 获取账户信息
async function getAccountInfo() {
  console.log('🔍 获取Cloudflare账户信息...');
  
  try {
    const response = await makeCloudflareRequest('GET', '/accounts');
    
    if (response.result && response.result.length > 0) {
      const account = response.result[0];
      CLOUDFLARE_CONFIG.accountId = account.id;
      console.log(`✅ 账户ID: ${account.id}`);
      console.log(`📧 账户名称: ${account.name}`);
      return account;
    } else {
      throw new Error('未找到Cloudflare账户');
    }
  } catch (error) {
    console.error('❌ 获取账户信息失败:', error.message);
    throw error;
  }
}

// 检查或创建Pages项目
async function ensurePagesProject() {
  console.log('🔍 检查Pages项目...');
  
  try {
    // 获取现有项目
    const response = await makeCloudflareRequest('GET', `/accounts/${CLOUDFLARE_CONFIG.accountId}/pages/projects`);
    
    const existingProject = response.result.find(project => project.name === CLOUDFLARE_CONFIG.projectName);
    
    if (existingProject) {
      console.log(`✅ 找到现有项目: ${existingProject.name}`);
      console.log(`🌐 项目域名: ${existingProject.domains[0]}`);
      CLOUDFLARE_CONFIG.domain = existingProject.domains[0];
      return existingProject;
    } else {
      console.log('📝 创建新的Pages项目...');
      
      const createResponse = await makeCloudflareRequest('POST', `/accounts/${CLOUDFLARE_CONFIG.accountId}/pages/projects`, {
        name: CLOUDFLARE_CONFIG.projectName,
        production_branch: 'main',
        build_config: {
          build_command: 'npm run build',
          destination_dir: 'dist',
          root_dir: ''
        }
      });
      
      const newProject = createResponse.result;
      console.log(`✅ 创建项目成功: ${newProject.name}`);
      console.log(`🌐 项目域名: ${newProject.domains[0]}`);
      CLOUDFLARE_CONFIG.domain = newProject.domains[0];
      return newProject;
    }
  } catch (error) {
    console.error('❌ Pages项目操作失败:', error.message);
    throw error;
  }
}

// 构建项目
async function buildProject() {
  console.log('🔨 构建项目...');
  
  try {
    // 清理之前的构建
    if (fs.existsSync('dist')) {
      execSync('rm -rf dist', { stdio: 'inherit' });
    }
    
    // 执行构建
    execSync('npm run build', { stdio: 'inherit' });
    
    if (!fs.existsSync('dist')) {
      throw new Error('构建失败：dist目录不存在');
    }
    
    console.log('✅ 项目构建完成');
    return true;
  } catch (error) {
    console.error('❌ 项目构建失败:', error.message);
    throw error;
  }
}

// 创建部署包
async function createDeploymentPackage() {
  console.log('📦 创建部署包...');
  
  try {
    const deploymentDir = path.join(process.cwd(), 'dist');
    
    if (!fs.existsSync(deploymentDir)) {
      throw new Error('dist目录不存在，请先构建项目');
    }
    
    // 检查构建文件
    const files = fs.readdirSync(deploymentDir);
    console.log(`📁 构建文件数量: ${files.length}`);
    
    // 检查关键文件
    const indexExists = fs.existsSync(path.join(deploymentDir, 'index.html'));
    if (!indexExists) {
      throw new Error('index.html文件不存在');
    }
    
    console.log('✅ 部署包准备完成');
    return deploymentDir;
  } catch (error) {
    console.error('❌ 创建部署包失败:', error.message);
    throw error;
  }
}

// 使用Wrangler进行部署
async function deployWithWrangler() {
  console.log('🚀 使用Wrangler部署到Cloudflare Pages...');
  
  try {
    // 设置环境变量
    process.env.CLOUDFLARE_API_TOKEN = CLOUDFLARE_CONFIG.apiKey;
    process.env.CLOUDFLARE_ACCOUNT_ID = CLOUDFLARE_CONFIG.accountId;
    
    // 使用wrangler pages deploy命令
    const deployCommand = `npx wrangler pages deploy dist --project-name=${CLOUDFLARE_CONFIG.projectName} --compatibility-date=2024-01-01`;
    
    console.log(`执行命令: ${deployCommand}`);
    execSync(deployCommand, { stdio: 'inherit' });
    
    console.log('✅ 部署完成！');
    return true;
  } catch (error) {
    console.error('❌ Wrangler部署失败:', error.message);
    throw error;
  }
}

// 主部署函数
async function deploy() {
  console.log('🚀 开始Cloudflare Pages部署...\n');
  
  try {
    // 1. 获取账户信息
    await getAccountInfo();
    
    // 2. 确保Pages项目存在
    await ensurePagesProject();
    
    // 3. 构建项目
    await buildProject();
    
    // 4. 创建部署包
    await createDeploymentPackage();
    
    // 5. 部署到Cloudflare Pages
    await deployWithWrangler();
    
    console.log('\n🎉 部署成功完成！');
    console.log(`🌐 访问地址: https://${CLOUDFLARE_CONFIG.domain}`);
    console.log(`📊 项目名称: ${CLOUDFLARE_CONFIG.projectName}`);
    console.log(`🔧 账户ID: ${CLOUDFLARE_CONFIG.accountId}`);
    
  } catch (error) {
    console.error('\n❌ 部署失败:', error.message);
    process.exit(1);
  }
}

// 运行部署
if (require.main === module) {
  deploy();
}

module.exports = { deploy };
