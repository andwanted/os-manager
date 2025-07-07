// routes/status.js

const express   = require('express');
const fs        = require('fs');
const path      = require('path');
const archiver  = require('archiver');
const router    = express.Router();

const dataPath = path.join(__dirname, '../data/ordens.json');

// GET /status — exibe relatório com filtros
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

// GET /status/download — gera e retorna ZIP com MD e TXT
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
