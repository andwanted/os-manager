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
