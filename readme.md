# 📋 OS Manager – Gerenciador de Ordens de Serviço

Este é um sistema web simples e funcional para gerenciamento de ordens de serviço (OS), ideal para equipes técnicas que realizam instalações, manutenções ou atendimentos em campo.

---

## 🧠 Visão Geral

O OS Manager permite:

- Criar e listar ordens de serviço
- Acompanhar o progresso de cada OS por etapas
- Registrar checklist de preparo, observações, imprevistos e finalização
- Fazer upload de fotos e vídeos (início e final)
- Visualizar relatórios filtrados por técnico, status e data
- Navegar por etapas de forma intuitiva com barra de progresso e botões de avanço

---

## 👤 Para Leigos

Imagine que você tem uma equipe técnica que realiza visitas. Com este sistema, você pode:

- Cadastrar uma nova ordem de serviço (ex: “Instalar ar-condicionado”)
- Atribuir um técnico e uma data prevista
- Acompanhar o andamento da OS em tempo real
- Ver fotos do antes e depois
- Registrar imprevistos e recomendações
- Gerar relatórios para controle e histórico

Tudo isso de forma simples, visual e acessível de qualquer lugar.

---

## 🛠️ Para Desenvolvedores

### Tecnologias Utilizadas

- Node.js + Express
- EJS (template engine)
- Bootstrap 5 (interface responsiva)
- Multer (upload de arquivos)
- Cloudinary (armazenamento de mídia)
- File System (JSON como banco de dados local)
- Glitch (hospedagem gratuita do app)
- GitHub (controle de versão)

### Estrutura de Pastas

/routes → rotas Express (os.js) /views → templates EJS /public → arquivos estáticos (CSS, ícones) /data/ordens.json → banco de dados local app.js → ponto de entrada


---

## 🚀 Funcionalidades Implementadas

- [x] Criação de OS com técnico, título e previsão
- [x] Visualização detalhada com progresso e etapas
- [x] Checklist de preparo e saída
- [x] Upload de mídia (início e final) via Cloudinary
- [x] Registro de imprevistos e recomendações
- [x] Relatórios com filtros por técnico, status e data
- [x] Painel de administração com atalhos
- [x] Barra de navegação fixa com “Voltar” e “Próximo”
- [x] Interface responsiva para mobile e desktop

---

## 🔄 Mudanças Significativas

- Interface redesenhada com cards, ícones e stepper visual
- Navegação orientada por etapas (sem forçar bloqueios)
- Barra de progresso percentual e contador de etapas
- Separação clara entre ações do técnico e visão do gestor
- Upload de arquivos com validação e feedback visual

---

## 🌐 Hospedagem

- 🖥️ Aplicação hospedada em: [Glitch](https://glitch.com)
- ☁️ Mídias (fotos e vídeos) hospedadas via: [Cloudinary](https://cloudinary.com)

---

## 📦 Como Rodar Localmente

```bash
git clone https://github.com/seu-usuario/os-manager.git
cd os-manager
npm install
npm start

Acesse em: http://localhost:3000

📌 Implementações Futuras
[ ] Autenticação de técnicos (login)

[ ] Kanban interativo para status das OSs

[ ] Timeline visual com datas e rota

[ ] Integração com banco de dados real (MongoDB ou PostgreSQL)

[ ] Exportação de relatórios em PDF

[ ] Notificações por e-mail ou WhatsApp

🤝 Contribuição
Pull requests são bem-vindos! Se quiser sugerir melhorias ou reportar bugs, abra uma issue.

📄 Licença
Este projeto é open-source e está sob a licença MIT.
