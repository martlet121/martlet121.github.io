const fs = require('fs');
const path = require('path');

// 读取 V2Ray 目录中的所有 md 文件
const v2rayDir = path.join(__dirname, '1 V2Ray');
const files = fs.readdirSync(v2rayDir)
  .filter(f => f.endsWith('.md'))
  .sort();

// 建立映射关系：文件名 -> 中文名
const fileNameMap = {};
files.forEach(file => {
  const nameWithoutExt = file.replace(/\.md$/, '');
  const number = nameWithoutExt.match(/^\d+/)[0];
  fileNameMap[number] = nameWithoutExt;
});

// 生成对应的 config 条目
const sidebarEntries = files.map(file => {
  const nameWithoutExt = file.replace(/\.md$/, '');
  const number = nameWithoutExt.match(/^\d+/)[0];
  const htmlFileName = `${number}-${nameWithoutExt.substring(number.length).trim().toLowerCase().replace(/\s+/g, '-').replace(/[（）]/g, c => c === '（' ? '-' : '')}.md`;
  
  return {
    file,
    number,
    nameWithoutExt,
    htmlPath: htmlFileName
  };
});

// 分组
const categories = {
  '介绍和安装': [],
  '基础配置': [],
  'TLS 和传输': [],
  '高级协议': [],
  '高级功能': []
};

sidebarEntries.forEach(entry => {
  const num = parseInt(entry.number);
  if (num <= 7) {
    categories['介绍和安装'].push(entry);
  } else if (num <= 18) {
    categories['基础配置'].push(entry);
  } else if (num <= 27) {
    categories['TLS 和传输'].push(entry);
  } else if (num <= 36) {
    categories['高级协议'].push(entry);
  } else {
    categories['高级功能'].push(entry);
  }
});

// 读取现有的 config.js
const configPath = path.join(__dirname, 'docs', '.vuepress', 'config.js');
const configContent = fs.readFileSync(configPath, 'utf-8');

// 输出映射关系到控制台以供验证
console.log('Generated sidebar structure:');
console.log(JSON.stringify(categories, null, 2));
console.log('\n文件映射：');
Object.entries(fileNameMap).forEach(([num, name]) => {
  console.log(`${num}: ${name}`);
});
