const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const statusDir = path.join(rootDir, 'status');
const maxFileSize = 100 * 1024; // 100 KB por arquivo

if (!fs.existsSync(statusDir)) {
  fs.mkdirSync(statusDir);
}

function listFiles(dir, prefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let structure = '';

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.name === 'node_modules' || entry.name === 'status') continue;

    if (entry.isDirectory()) {
      structure += `${prefix}- 📁 **${entry.name}**\n`;
      structure += listFiles(fullPath, prefix + '  ');
    } else {
      structure += `${prefix}- 📄 ${entry.name}\n`;
    }
  }

  return structure;
}

function readFileCompact(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content
      .split('\n')
      .filter(line => line.trim() !== '' && !line.trim().startsWith('//'))
      .join('\n');

    if (content.length > maxFileSize) {
      return `// [Arquivo muito grande, conteúdo truncado]\n` + content.slice(0, maxFileSize) + '\n...';
    }

    return content;
  } catch (err) {
    return `// Erro ao ler ${filePath}: ${err.message}`;
  }
}

function categorizeFile(filePath) {
  const ext = path.extname(filePath);
  if (ext === '.js') return 'javascript';
  if (ext === '.ejs' || ext === '.html') return 'views';
  if (ext === '.css') return 'estilos';
  if (ext === '.json' || ext === '.env') return 'outros';
  return 'outros';
}

function getLanguageTag(filePath) {
  const ext = path.extname(filePath);
  if (ext === '.js') return 'js';
  if (ext === '.ejs' || ext === '.html') return 'html';
  if (ext === '.css') return 'css';
  if (ext === '.json') return 'json';
  return '';
}

function generateStatus() {
  const filesByCategory = {
    estrutura: listFiles(rootDir),
    javascript: '',
    views: '',
    estilos: '',
    outros: ''
  };

  function processFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.name === 'node_modules' || entry.name === 'status') continue;

      if (entry.isDirectory()) {
        processFiles(fullPath);
      } else {
        const category = categorizeFile(fullPath);
        const content = readFileCompact(fullPath);
        const relativePath = path.relative(rootDir, fullPath);
        const lang = getLanguageTag(fullPath);

        filesByCategory[category] += `\n## 📄 ${relativePath}\n\n\`\`\`${lang}\n${content}\n\`\`\`\n`;
      }
    }
  }

  processFiles(rootDir);

  // Escreve os arquivos Markdown
  for (const [category, content] of Object.entries(filesByCategory)) {
    const filePath = path.join(statusDir, `${category}.md`);
    const title = `# 📦 ${category.toUpperCase()} - ${new Date().toLocaleString()}\n\n`;
    fs.writeFileSync(filePath, title + content);
  }

  console.log('✅ Relatórios Markdown gerados na pasta /status');
}

module.exports = generateStatus;
