const fs = require('fs');
const path = require('path');

// 读取 V2Ray 目录中的所有 md 文件
const v2rayDir = path.join(__dirname, '1 V2Ray');
const v2rayFiles = fs.readdirSync(v2rayDir)
  .filter(f => f.endsWith('.md'))
  .map(f => f.replace(/\.md$/, ''))
  .sort((a, b) => {
    const numA = parseInt(a.match(/^\d+/)[0]);
    const numB = parseInt(b.match(/^\d+/)[0]);
    return numA - numB;
  });

// 构建显示文本映射（按编号）
const displayMap = {};
v2rayFiles.forEach(file => {
  const num = file.match(/^\d+/)[0];
  displayMap[num] = file;
});

// 构建 HTML 路径映射（根据现有的 docs/guide 文件）
const guideDir = path.join(__dirname, 'docs', 'guide');
const guideFiles = fs.readdirSync(guideDir)
  .filter(f => f.endsWith('.md') && f !== 'README.md')
  .sort();

const htmlPathMap = {};
guideFiles.forEach(file => {
  const num = file.match(/^\d+/)[0];
  if (num) {
    htmlPathMap[num] = file.replace(/\.md$/, '');
  }
});

// 分组侧边栏配置
const sidebarConfig = [
  {
    title: '介绍和安装',
    collapsible: true,
    children: []
  },
  {
    title: '基础配置',
    collapsible: true,
    children: []
  },
  {
    title: 'TLS 和传输',
    collapsible: true,
    children: []
  },
  {
    title: '高级协议',
    collapsible: true,
    children: []
  },
  {
    title: '高级功能',
    collapsible: true,
    children: []
  }
];

v2rayFiles.forEach(file => {
  const num = parseInt(file.match(/^\d+/)[0]);
  const htmlPath = htmlPathMap[num];
  
  if (htmlPath) {
    const entry = [`/guide/${htmlPath}.md`, displayMap[num]];
    
    if (num <= 7) {
      sidebarConfig[0].children.push(entry);
    } else if (num <= 18) {
      sidebarConfig[1].children.push(entry);
    } else if (num <= 27) {
      sidebarConfig[2].children.push(entry);
    } else if (num <= 36) {
      sidebarConfig[3].children.push(entry);
    } else {
      sidebarConfig[4].children.push(entry);
    }
  }
});

// 生成新的 config.js 内容
const configTemplate = `module.exports = {
  lang: 'zh-CN',
  title: 'V2Ray 配置指南',
  description: 'V2Ray 配置指南 - 详细的配置教程和案例',
  base: '/',
  
  themeConfig: {
    logo: '/logo.png',
    repo: 'martlet121/martlet121.github.io',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: '编辑此页',
    lastUpdated: '最后更新时间',
    
    nav: [
      {
        text: '首页',
        link: '/',
      },
      {
        text: '配置指南',
        link: '/guide/',
      },
      {
        text: 'GitHub',
        link: 'https://github.com/martlet121/martlet121.github.io',
      },
    ],
    
    sidebar: {
      '/guide/': [
${sidebarConfig.map((section, idx) => {
  const childrenStr = section.children.map(child => 
    `            [${JSON.stringify(child[0])}, ${JSON.stringify(child[1])}]`
  ).join(',\n');
  
  return `        {
          title: ${JSON.stringify(section.title)},
          collapsible: true,
          children: [
${childrenStr}
          ],
        }`;
}).join(',\n')}
      ],
    },
  },
  
  plugins: [
    '@vuepress/plugin-search',
  ],
}
`;

// 写入新的 config.js
const configPath = path.join(__dirname, 'docs', '.vuepress', 'config.js');
fs.writeFileSync(configPath, configTemplate);

console.log('✓ config.js 已更新');
console.log('\n侧边栏配置预览：');
sidebarConfig.forEach((section, idx) => {
  console.log(`\n${section.title}：`);
  section.children.forEach(child => {
    console.log(`  ${child[0]} -> "${child[1]}"`);
  });
});
