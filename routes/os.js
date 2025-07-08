const express    = require('express');
const fs         = require('fs');
const path       = require('path');
const multer     = require('multer');
const cloudinary = require('../cloudinary');
const router     = express.Router();
const upload     = multer({ storage: multer.memoryStorage() });

const dataPath = path.join(__dirname, '../data/ordens.json');

// Gera um código de quatro dígitos
function gerarCodigo() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// =========================
// GET /criar
// =========================
router.get('/criar', (req, res) => {
  res.render('create', { title: 'Criar Nova OS' });
});

// =========================
// POST /criar
// =========================
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
    fotos: { final: [] },
    checklist_preparo: {},
    observacoes_inicio: null,
    imprevistos: '',
    dificuldades: '',
    recomendacoes: '',
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

// =========================
// GET /os — lista de OSs
// =========================
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

// =========================
// GET /os/:codigo — detalhes
// =========================
router.get('/os/:codigo', (req, res) => {
  const codigo = req.params.codigo;
  const dados  = JSON.parse(fs.readFileSync(dataPath));
  const ordem  = dados.ordens.find(os => os.codigo === codigo);
  if (!ordem) return res.status(404).send('Ordem de Serviço não encontrada.');

  res.render('view', { ordem, title: `OS #${codigo}` });
});

// =========================
// GET/POST /preparo
// =========================
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

// =========================
// GET/POST /inicio
// =========================
router.get('/os/:codigo/inicio', (req, res) => {
  const codigo = req.params.codigo;
  const dados  = JSON.parse(fs.readFileSync(dataPath));
  const ordem  = dados.ordens.find(os => os.codigo === codigo);
  if (!ordem) return res.status(404).send('OS não encontrada.');

  res.render('inicio', {
    ordem,
    title: `OS #${codigo} – Chegada`
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
    acao: 'Registrou chegada',
    codigo,
    data: new Date().toISOString()
  });

  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  res.redirect(`/os/${codigo}`);
});

// =========================
// GET/POST /imprevistos
// =========================
router.get('/os/:codigo/imprevistos', (req, res) => {
  const codigo = req.params.codigo;
  const dados  = JSON.parse(fs.readFileSync(dataPath));
  const ordem  = dados.ordens.find(os => os.codigo === codigo);
  if (!ordem) return res.status(404).send('OS não encontrada.');

  res.render('imprevistos', {
    ordem,
    title: `OS #${codigo} – Anotações`
  });
});

router.post('/os/:codigo/imprevistos', (req, res) => {
  const codigo = req.params.codigo;
  const dados  = JSON.parse(fs.readFileSync(dataPath));
  const ordem  = dados.ordens.find(os => os.codigo === codigo);
  if (!ordem) return res.status(404).send('OS não encontrada.');

  ordem.imprevistos  = req.body.imprevistos?.trim()  || '';
  ordem.dificuldades = req.body.dificuldades?.trim() || '';
  ordem.recomendacoes= req.body.recomendacoes?.trim()|| '';

  dados.logs.push({
    acao: 'Registrou anotações',
    codigo,
    data: new Date().toISOString()
  });

  fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
  res.redirect(`/os/${codigo}`);
});

// =========================
// GET/POST /upload (Mídia Finalização)
// =========================
router.get('/os/:codigo/upload', (req, res) => {
  const { codigo } = req.params;
  const { tipo }   = req.query; // 'final'
  const dados      = JSON.parse(fs.readFileSync(dataPath));
  const ordem      = dados.ordens.find(os => os.codigo === codigo);
  if (!ordem) return res.status(404).send('OS não encontrada.');

  res.render('upload', {
    ordem,
    tipo,
    title: `OS #${codigo} – Upload de Mídia`
  });
});

router.post('/os/:codigo/upload', upload.single('arquivo'), (req, res) => {
  const codigo = req.params.codigo;
  const tipo   = req.body.tipo; // sempre 'final'
  const file   = req.file;

  const dados = JSON.parse(fs.readFileSync(dataPath));
  const ordem = dados.ordens.find(os => os.codigo === codigo);
  if (!ordem) return res.status(404).send('OS não encontrada.');
  if (!file)  return res.status(400).send('Nenhum arquivo enviado.');

  const stream = cloudinary.uploader.upload_stream(
    { resource_type: 'auto', folder: `${codigo}/${tipo}` },
    (error, result) => {
      if (error) {
        console.error('Cloudinary error:', error);
        return res.status(500).send('Erro ao enviar arquivo.');
      }
      ordem.fotos.final.push({
        nome: file.originalname,
        url : result.secure_url
      });

      dados.logs.push({
        acao: 'Enviou mídia final',
        codigo,
        nome: file.originalname,
        data: new Date().toISOString()
      });

      fs.writeFileSync(dataPath, JSON.stringify(dados, null, 2));
      res.redirect(`/os/${codigo}`);
    }
  );
  stream.end(file.buffer);
});

// =========================
// POST /os/:codigo/status
// =========================
router.post('/os/:codigo/status', (req, res) => {
  const codigo     = req.params.codigo;
  const novoStatus = req.body.status;
  const dados      = JSON.parse(fs.readFileSync(dataPath));
  const ordem      = dados.ordens.find(os => os.codigo === codigo);

  if (!ordem) return res.status(404).send('OS não encontrada.');
  if (ordem.status === 'Concluído') {
    return res.status(400).send('Esta OS já está concluída.');
  }

  // Validação antes de iniciar execução
  if (novoStatus === 'Em execução') {
    const prep = ordem.checklist_preparo || {};
    if (!prep.combustivel || !prep.ferramentas || !prep.epi) {
      return res.status(400)
        .send('Checklist de preparo incompleto.');
    }
  }

  // Validação antes de concluir
  if (novoStatus === 'Concluído') {
    const prep      = ordem.checklist_preparo || {};
    const obsInicio = ordem.observacoes_inicio;
    const midiaFin  = ordem.fotos.final || [];
    const anotacoes = ordem.imprevistos?.trim() || ordem.dificuldades?.trim() || ordem.recomendacoes?.trim();

    if (!prep.combustivel || !prep.ferramentas || !prep.epi) {
      return res.status(400).send('Checklist de preparo incompleto.');
    }
    if (!obsInicio) {
      return res.status(400).send('Chegada não registrada.');
    }
    if (midiaFin.length === 0) {
      return res.status(400).send('Envie ao menos uma mídia final.');
    }
    if (!anotacoes) {
      return res.status(400).send('Registre ao menos uma anotação.');
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

module.exports = router;
