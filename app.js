require('dotenv').config();
const express = require('express');
const path = require('path');

const expressLayouts = require('express-ejs-layouts');
const osRoutes = require('./routes/os');
const statusRoutes = require('./routes/status');
const app = express();


// 1) View engine + Layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// 2) Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 3) Rotas
app.use('/', osRoutes);
app.use('/', statusRoutes);

// 4) Geração de relatórios (se precisar)
// require('./generateStatus')();

// 5) Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
