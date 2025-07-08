# 📦 JAVASCRIPT - 07/07/2025, 22:42:13


## 📄 app.js

```js
require('dotenv').config();
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const osRoutes = require('./routes/os');
const statusRoutes = require('./routes/status');
const app = express();
const generateStatus = require('./generateStatus')
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', osRoutes);
app.use('/', statusRoutes);
require('./generateStatus')();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

## 📄 cloudinary.js

```js
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'devjlsmtj',
  api_key: '294715196823732',
  api_secret: '8y4VaFZP-G0Zf0yySsm6S__IkYM'
});
module.exports = cloudinary;
```

## 📄 generateStatus.js

```js
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
  for (const [category, content] of Object.entries(filesByCategory)) {
    const filePath = path.join(statusDir, `${category}.md`);
    const title = `# 📦 ${category.toUpperCase()} - ${new Date().toLocaleString()}\n\n`;
    fs.writeFileSync(filePath, title + content);
  }
  console.log('✅ Relatórios Markdown gerados na pasta /status');
}
module.exports = generateStatus;
```

## 📄 routes/os.js

```js
const express       = require('express');
const fs            = require('fs');
const path          = require('path');
const multer        = require('multer');
const cloudinary    = require('../cloudinary');
const router        = express.Router();
const upload        = multer({ storage: multer.memoryStorage() });
const dataPath = path.join(__dirname, '../data/ordens.json');
function gerarCodigo() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
router.get('/criar', (req, res) => {
  res.render('create', { title: 'Criar Nova OS' });
});
router.post('/criar', (req, res) => {
  const { titulo, descricao, endereco, previsao, tecnico } = req.body;
  const codigo = gerarCodigo();
  const novaOS = {
    id: Date.now(),
    codigo,
    titulo,
    descricao,
    endereco,
    previsao,
    tecnico,
    status: 'Pendente',
    fotos: { inicio: [], final: [] },
    checklist_preparo: {},
    observacoes_inicio: null,
    imprevistos: '',
    dificuldades: '',
    recomendacoes: '',
    checklist: {},
    criadoEm: new Date().toISOString()
  };
  const dados = JSON.parse(fs.readFileSync(dataPath));
  dados.ordens.push(novaOS);
  dados.logs.push({
    acao: 'Criou OS',
    codigo,
    tecnico,
    data: new Date().toISOString()
  });
  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  res.redirect(`/os/${codigo}`);
});
router.get('/os', (req, res) => {
  const { tecnico, data } = req.query;
  const dados = JSON.parse(fs.readFileSync(dataPath));
  let ordens = dados.ordens;
  if (tecnico) {
    ordens = ordens.filter(os => os.tecnico?.toLowerCase() === tecnico.toLowerCase());
  }
  if (data) {
    ordens = ordens.filter(os => os.previsao?.startsWith(data));
  }
  res.render('lista', { ordens, title: 'Minhas OSs' });
});
router.get('/os/:codigo', (req, res) => {
  const codigo = req.params.codigo;
  const dados  = JSON.parse(fs.readFileSync(dataPath));
  const ordem  = dados.ordens.find(os => os.codigo === codigo);
  if (!ordem) return res.status(404).send('Ordem de Serviço não encontrada.');
  res.render('view', { ordem, title: `OS #${codigo}` });
});
router.get('/os/:codigo/preparo', (req, res) => {
  const codigo = req.params.codigo;
  const dados  = JSON.parse(fs.readFileSync(dataPath));
  const ordem  = dados.ordens.find(os => os.codigo === codigo);
  if (!ordem) return res.status(404).send('OS não encontrada.');
  res.render('preparo', {
    ordem,
    title: `OS #${codigo} – Checklist de Preparo`
  });
});
router.post('/os/:codigo/preparo', (req, res) => {
  const codigo = req.params.codigo;
  const dados  = JSON.parse(fs.readFileSync(dataPath));
  const ordem  = dados.ordens.find(os => os.codigo === codigo);
  if (!ordem) return res.status(404).send('OS não encontrada.');
  ordem.checklist_preparo = {
    combustivel : !!req.body.combustivel,
    ferramentas : !!req.body.ferramentas,
    epi         : !!req.body.epi
  };
  dados.logs.push({
    acao: 'Preencheu checklist de preparo',
    codigo,
    data: new Date().toISOString()
  });
  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  res.redirect(`/os/${codigo}`);
});
router.get('/os/:codigo/inicio', (req, res) => {
  const codigo = req.params.codigo;
  const dados  = JSON.parse(fs.readFileSync(dataPath));
  const ordem  = dados.ordens.find(os => os.codigo === codigo);
  if (!ordem) return res.status(404).send('OS não encontrada.');
  res.render('inicio', {
    ordem,
    title: `OS #${codigo} – Observações Iniciais`
  });
});
router.post('/os/:codigo/inicio', (req, res) => {
  const codigo = req.params.codigo;
  const dados  = JSON.parse(fs.readFileSync(dataPath));
  const ordem  = dados.ordens.find(os => os.codigo === codigo);
  if (!ordem) return res.status(404).send('OS não encontrada.');
  ordem.observacoes_inicio = {
    conforme: req.body.conforme === 'sim',
    texto   : req.body.texto?.trim() || ''
  };
  dados.logs.push({
    acao: 'Registrou observações iniciais',
    codigo,
    data: new Date().toISOString()
  });
  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  res.redirect(`/os/${codigo}`);
});
router.get('/os/:codigo/upload', (req, res) => {
  const { codigo } = req.params;
  const { tipo }   = req.query; // 'inicio' ou 'final'
  const dados      = JSON.parse(fs.readFileSync(dataPath));
  const ordem      = dados.ordens.find(os => os.codigo === codigo);
  if (!ordem) return res.status(404).send('OS não encontrada.');
  res.render('upload', {
    ordem,
    tipo,
    title: `OS #${codigo} – Upload de Mídia (${tipo})`
  });
});
router.post('/os/:codigo/upload', upload.single('arquivo'), (req, res) => {
  const codigo = req.params.codigo;
  const tipo   = req.body.tipo;    // 'inicio' ou 'final'
  const file   = req.file;
  const dados = JSON.parse(fs.readFileSync(dataPath));
  const ordem = dados.ordens.find(os => os.codigo === codigo);
  if (!ordem) return res.status(404).send('OS não encontrada.');
  if (!file)  return res.status(400).send('Nenhum arquivo enviado.');
  if (tipo === 'inicio' && ordem.fotos.inicio.length > 0) {
    return res.status(400).send('Mídia de início já enviada.');
  }
  const stream = cloudinary.uploader.upload_stream(
    { resource_type: 'auto', folder: `${codigo}/${tipo}` },
    (error, result) => {
      if (error) {
        console.error('Cloudinary error:', error);
        return res.status(500).send('Erro ao enviar arquivo.');
      }
      ordem.fotos[tipo].push({
        nome: file.originalname,
        url : result.secure_url
      });
      dados.logs.push({
        acao: 'Enviou arquivo',
        codigo,
        tipo,
        nome: file.originalname,
        data: new Date().toISOString()
      });
      fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
      res.redirect(`/os/${codigo}`);
    }
  );
  stream.end(file.buffer);
});
router.get('/os/:codigo/imprevistos', (req, res) => {
  const codigo = req.params.codigo;
  const dados  = JSON.parse(fs.readFileSync(dataPath));
  const ordem  = dados.ordens.find(os => os.codigo === codigo);
  if (!ordem) return res.status(404).send('OS não encontrada.');
  res.render('imprevistos', {
    ordem,
    title: `OS #${codigo} – Imprevistos`
  });
});
router.post('/os/:codigo/imprevistos', (req, res) => {
  const codigo = req.params.codigo;
  const dados  = JSON.parse(fs.readFileSync(dataPath));
  const ordem  = dados.ordens.find(os => os.codigo === codigo);
  if (!ordem) return res.status(404).send('OS não encontrada.');
  ordem.imprevistos = req.body.imprevistos?.trim() || '';
  dados.logs.push({
    acao: 'Registrou imprevistos',
    codigo,
    data: new Date().toISOString()
  });
  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  res.redirect(`/os/${codigo}`);
});
router.get('/os/:codigo/finalizacao', (req, res) => {
  const codigo = req.params.codigo;
  const dados  = JSON.parse(fs.readFileSync(dataPath));
  const ordem  = dados.ordens.find(os => os.codigo === codigo);
  if (!ordem) return res.status(404).send('OS não encontrada.');
  res.render('finalizacao', {
    ordem,
    title: `OS #${codigo} – Finalização`
  });
});
router.post('/os/:codigo/finalizacao', (req, res) => {
  const codigo = req.params.codigo;
  const dados  = JSON.parse(fs.readFileSync(dataPath));
  const ordem  = dados.ordens.find(os => os.codigo === codigo);
  if (!ordem) return res.status(404).send('OS não encontrada.');
  ordem.dificuldades    = req.body.dificuldades?.trim()    || '';
  ordem.recomendacoes   = req.body.recomendacoes?.trim()   || '';
  dados.logs.push({
    acao: 'Registrou finalização',
    codigo,
    data: new Date().toISOString()
  });
  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  res.redirect(`/os/${codigo}`);
});
router.post('/os/:codigo/checklist', (req, res) => {
  const codigo = req.params.codigo;
  const dados  = JSON.parse(fs.readFileSync(dataPath));
  const ordem  = dados.ordens.find(os => os.codigo === codigo);
  if (!ordem) return res.status(404).send('OS não encontrada.');
  ordem.checklist = {
    teste_funcionamento: !!req.body.teste_funcionamento,
    limpeza_local       : !!req.body.limpeza_local,
    entrega_controle    : !!req.body.entrega_controle
  };
  dados.logs.push({
    acao: 'Preencheu checklist de saída',
    codigo,
    data: new Date().toISOString()
  });
  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  res.redirect(`/os/${codigo}`);
});
router.post('/os/:codigo/status', (req, res) => {
  const codigo    = req.params.codigo;
  const novoStatus= req.body.status;
  const dados     = JSON.parse(fs.readFileSync(dataPath));
  const ordem     = dados.ordens.find(os => os.codigo === codigo);
  if (!ordem) return res.status(404).send('OS não encontrada.');
  if (ordem.status === 'Concluído') {
    return res.status(400).send('Esta OS já está concluída.');
  }
  if (novoStatus === 'Em execução') {
    const prep = ordem.checklist_preparo || {};
    if (!prep.combustivel || !prep.ferramentas || !prep.epi) {
      return res.status(400)
        .send('Checklist de preparo incompleto. Não é possível iniciar execução.');
    }
  }
  if (novoStatus === 'Concluído') {
    const prep      = ordem.checklist_preparo || {};
    const obsInicio = ordem.observacoes_inicio;
    const checkOut  = ordem.checklist || {};
    const midiaIni  = ordem.fotos.inicio || [];
    const midiaFin  = ordem.fotos.final  || [];
    const finaliz   = ordem.dificuldades?.trim() || ordem.recomendacoes?.trim();
    if (!prep.combustivel || !prep.ferramentas || !prep.epi) {
      return res.status(400)
        .send('Checklist de preparo incompleto. Não é possível concluir.');
    }
    if (!obsInicio) {
      return res.status(400)
        .send('Observações iniciais não registradas.');
    }
    if (midiaIni.length === 0) {
      return res.status(400)
        .send('Envie ao menos uma mídia de início antes de concluir.');
    }
    if (!checkOut.teste_funcionamento || !checkOut.limpeza_local || !checkOut.entrega_controle) {
      return res.status(400)
        .send('Checklist de saída incompleto.');
    }
    if (midiaFin.length === 0) {
      return res.status(400)
        .send('Envie ao menos uma mídia final antes de concluir.');
    }
    if (!finaliz) {
      return res.status(400)
        .send('Preencha dificuldades ou recomendações antes de concluir.');
    }
  }
  const anterior = ordem.status;
  ordem.status = novoStatus;
  dados.logs.push({
    acao: 'Alterou status',
    codigo,
    de   : anterior,
    para : novoStatus,
    data : new Date().toISOString()
  });
  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  res.redirect(`/os/${codigo}`);
});
router.get('/adm', (req, res) => {
  res.render('adm', {
    title: 'Painel de Administração'
  });
});
module.exports = router;
```

## 📄 routes/status.js

```js
const express   = require('express');
const fs        = require('fs');
const path      = require('path');
const archiver  = require('archiver');
const router    = express.Router();
const dataPath = path.join(__dirname, '../data/ordens.json');
router.get('/status', (req, res) => {
  const { tecnico, status, data } = req.query;
  const dados  = JSON.parse(fs.readFileSync(dataPath));
  let ordens   = dados.ordens;
  if (tecnico) {
    ordens = ordens.filter(o =>
      o.tecnico?.toLowerCase() === tecnico.toLowerCase()
    );
  }
  if (status) {
    ordens = ordens.filter(o => o.status === status);
  }
  if (data) {
    ordens = ordens.filter(o => o.previsao?.startsWith(data));
  }
  const tecnicos = [...new Set(dados.ordens.map(o => o.tecnico))];
  const statuses = ['Pendente', 'Em execução', 'Concluído'];
  res.render('relatorios', {
    ordens,
    filtros: { tecnico, status, data },
    tecnicos,
    statuses,
    title: 'Relatórios de OS'
  });
});
router.get('/status/download', (req, res) => {
  const dados      = JSON.parse(fs.readFileSync(dataPath));
  const ordens     = dados.ordens;
  const zipName    = `relatorios_${Date.now()}.zip`;
  const archive    = archiver('zip', { zlib: { level: 9 }});
  res.attachment(zipName);
  archive.pipe(res);
  ordens.forEach(os => {
    const md  = `# OS #${os.codigo}\n\n` +
                `**Título:** ${os.titulo}\n\n` +
                `**Técnico:** ${os.tecnico}\n\n` +
                `**Status:** ${os.status}\n\n` +
                `**Previsão:** ${os.previsao || '-'}\n\n` +
                `**Criado Em:** ${new Date(os.criadoEm).toLocaleString()}\n\n`;
    const txt = md.replace(/\*\*(.*?)\*\*/g, '$1');
    archive.append(md, { name: `${os.codigo}.md` });
    archive.append(txt, { name: `${os.codigo}.txt` });
  });
  archive.finalize();
});
module.exports = router;
```

## 📄 routes/upload.js

```js
router.post('/upload/:codigo', upload.single('arquivo'), async (req, res) => {
  const codigo = req.params.codigo;
  const tipo = req.body.tipo;
  const file = req.file;
  if (!file) return res.status(400).send('Nenhum arquivo enviado.');
  const dados = JSON.parse(fs.readFileSync(dataPath));
  const ordem = dados.ordens.find(os => os.codigo === codigo);
  if (!ordem) return res.status(404).send('OS não encontrada.');
  try {
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: `${codigo}/${tipo}`
      },
      async (error, result) => {
        if (error) {
          console.error('Erro no Cloudinary:', error);
          return res.status(500).send('Erro ao enviar arquivo.');
        }
        if (!ordem.fotos) ordem.fotos = { inicio: [], final: [] };
        ordem.fotos[tipo].push({
          nome: file.originalname,
          url: result.secure_url
        });
        dados.logs.push({
          acao: 'Enviou arquivo',
          codigo,
          tipo,
          nome: file.originalname,
          data: new Date().toISOString()
        });
        fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
        res.redirect(`/os/${codigo}`);
      }
    );
    result.end(file.buffer);
  } catch (err) {
    console.error('Erro geral no upload:', err);
    res.status(500).send('Erro ao enviar arquivo.');
  }
});
```

## 📄 scripts/gerarStatus.js

```js
const fs = require('fs')
const path = require('path')
const ordensPath  = path.join(__dirname, 'data', 'ordens.json')
const reportDir   = path.join(__dirname, 'reports')
const reportPath  = path.join(reportDir, 'status-report.json')
function generateStatus() {
  if (!fs.existsSync(ordensPath)) {
    console.warn('Nenhum ordens.json encontrado em', ordensPath)
    return
  }
  const ordens = JSON.parse(fs.readFileSync(ordensPath, 'utf-8'))
  const resumoMap = ordens.reduce((acc, { status }) => {
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})
  const resumo = Object.entries(resumoMap).map(([status, total]) => ({ status, total }))
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true })
  }
  fs.writeFileSync(reportPath, JSON.stringify(resumo, null, 2), 'utf-8')
  console.log(`📊 Relatório gerado em ${reportPath}`)
}
module.exports = generateStatus
```
