const express       = require('express');
const fs            = require('fs');
const path          = require('path');
const multer        = require('multer');
const cloudinary    = require('../cloudinary');
const router        = express.Router();
const upload        = multer({ storage: multer.memoryStorage() });

const dataPath = path.join(__dirname, '../data/ordens.json');

// Gera um código de quatro dígitos
function gerarCodigo() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// =========================
// GET /criar — formulário de criação de OS
// =========================
router.get('/criar', (req, res) => {
  res.render('create', { title: 'Criar Nova OS' });
});

// =========================
// POST /criar — cria uma nova OS
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

// =========================
// GET /os — lista de OSs (filtro por técnico e/ou data)
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
// GET /os/:codigo — exibe detalhes da OS
// =========================
router.get('/os/:codigo', (req, res) => {
  const codigo = req.params.codigo;
  const dados  = JSON.parse(fs.readFileSync(dataPath));
  const ordem  = dados.ordens.find(os => os.codigo === codigo);
  if (!ordem) return res.status(404).send('Ordem de Serviço não encontrada.');

  res.render('view', { ordem, title: `OS #${codigo}` });
});

// =========================
// GET /os/:codigo/preparo — formulário de checklist de preparo
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

// =========================
// POST /os/:codigo/preparo — salva checklist de preparo
// =========================
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
// GET /os/:codigo/inicio — formulário de observações iniciais
// =========================
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

// =========================
// POST /os/:codigo/inicio — salva observações iniciais
// =========================
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

// =========================
// GET /os/:codigo/upload — formulário de upload de mídia
// =========================
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

// =========================
// POST /os/:codigo/upload — salva foto/vídeo no Cloudinary
// =========================
router.post('/os/:codigo/upload', upload.single('arquivo'), (req, res) => {
  const codigo = req.params.codigo;
  const tipo   = req.body.tipo;    // 'inicio' ou 'final'
  const file   = req.file;

  const dados = JSON.parse(fs.readFileSync(dataPath));
  const ordem = dados.ordens.find(os => os.codigo === codigo);
  if (!ordem) return res.status(404).send('OS não encontrada.');
  if (!file)  return res.status(400).send('Nenhum arquivo enviado.');

  // Bloqueia reenvio de mídias de início
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

// =========================
// GET /os/:codigo/imprevistos — formulário de imprevistos
// =========================
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

// =========================
// POST /os/:codigo/imprevistos — salva imprevistos
// =========================
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

// =========================
// GET /os/:codigo/finalizacao — formulário de dificuldades e recomendações
// =========================
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

// =========================
// POST /os/:codigo/finalizacao — salva dificuldades e recomendações
// =========================
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

// =========================
// POST /os/:codigo/checklist — salva checklist de saída
// =========================
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

// =========================
// POST /os/:codigo/status — altera status com todas as validações
// =========================
router.post('/os/:codigo/status', (req, res) => {
  const codigo    = req.params.codigo;
  const novoStatus= req.body.status;
  const dados     = JSON.parse(fs.readFileSync(dataPath));
  const ordem     = dados.ordens.find(os => os.codigo === codigo);

  if (!ordem) return res.status(404).send('OS não encontrada.');
  if (ordem.status === 'Concluído') {
    return res.status(400).send('Esta OS já está concluída.');
  }

  // Validação antes de iniciar execução
  if (novoStatus === 'Em execução') {
    const prep = ordem.checklist_preparo || {};
    if (!prep.combustivel || !prep.ferramentas || !prep.epi) {
      return res.status(400)
        .send('Checklist de preparo incompleto. Não é possível iniciar execução.');
    }
  }

  // Validação antes de concluir
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


// GET /adm — Admin Dashboard
router.get('/adm', (req, res) => {
  res.render('adm', {
    title: 'Painel de Administração'
  });
});


module.exports = router;
