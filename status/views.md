# 📦 VIEWS - 07/07/2025, 22:42:13


## 📄 views/adm.ejs

```html
<h2 class="mb-4">⚙️ Painel de Administração</h2>
<div class="row gy-4">
  <div class="col-6 col-md-3 text-center">
    <a href="/criar" class="text-decoration-none">
      <div class="card h-100">
        <div class="card-body">
          <i class="bi bi-plus-square-fill fs-1 text-primary"></i>
          <p class="mt-2 mb-0">Criar OS</p>
        </div>
      </div>
    </a>
  </div>
  <div class="col-6 col-md-3 text-center">
    <a href="/os" class="text-decoration-none">
      <div class="card h-100">
        <div class="card-body">
          <i class="bi bi-list-ul fs-1 text-secondary"></i>
          <p class="mt-2 mb-0">Listar OSs</p>
        </div>
      </div>
    </a>
  </div>
  <div class="col-6 col-md-3 text-center">
    <a href="/status" class="text-decoration-none">
      <div class="card h-100">
        <div class="card-body">
          <i class="bi bi-bar-chart-line fs-1 text-success"></i>
          <p class="mt-2 mb-0">Relatórios</p>
        </div>
      </div>
    </a>
  </div>
  <div class="col-6 col-md-3 text-center">
    <a href="/status/download" class="text-decoration-none">
      <div class="card h-100">
        <div class="card-body">
          <i class="bi bi-download fs-1 text-warning"></i>
          <p class="mt-2 mb-0">Download ZIP</p>
        </div>
      </div>
    </a>
  </div>
</div>
```

## 📄 views/create.ejs

```html
<!DOCTYPE html>
<html>
<head>
  <title>Criar OS</title>
</head>
<body>
  <h1>Criar Ordem de Serviço</h1>
  <form action="/criar" method="POST">
    <label>Título:</label><br>
    <input type="text" name="titulo" required><br><br>
    <label>Descrição:</label><br>
    <textarea name="descricao" required></textarea><br><br>
    <label>Endereço:</label><br>
    <input type="text" name="endereco" required><br><br>
    <label for="tecnico">Técnico responsável:</label>
    <select name="tecnico" required>
      <option value="">Selecione um técnico</option>
      <option value="Carlos">Carlos</option>
      <option value="Fernanda">Fernanda</option>
      <option value="João">João</option>
      <option value="Patrícia">Patrícia</option>
    </select>
    <label>Previsão:</label><br>
    <input type="date" name="previsao" required><br><br>
    <button type="submit">Criar OS</button>
  </form>
</body>
</html>
```

## 📄 views/finalizacao.ejs

```html
<a href="/os/<%= ordem.codigo %>/imprevistos" class="btn btn-outline-secondary mb-3">
  ⬅️ Voltar
</a>
<h2>📝 Dificuldades & Recomendações</h2>
<form action="/os/<%= ordem.codigo %>/finalizacao" method="POST">
  <div class="row g-4">
    <div class="col-12 col-md-6">
      <label for="dificuldades" class="form-label">Dificuldades encontradas</label>
      <textarea class="form-control" id="dificuldades" name="dificuldades" rows="4"><%= ordem.dificuldades || '' %></textarea>
    </div>
    <div class="col-12 col-md-6">
      <label for="recomendacoes" class="form-label">Recomendações ao cliente</label>
      <textarea class="form-control" id="recomendacoes" name="recomendacoes" rows="4"><%= ordem.recomendacoes || '' %></textarea>
    </div>
  </div>
  <button type="submit" class="btn btn-success mt-4 w-100">Salvar e continuar</button>
</form>
```

## 📄 views/imprevistos.ejs

```html
<a href="/os/<%= ordem.codigo %>" class="btn btn-outline-secondary mb-3 d-md-none">
  ⬅️ Minhas OSs
</a>
<h2>⚠️ Registro de Imprevistos</h2>
<form action="/os/<%= ordem.codigo %>/imprevistos" method="POST">
  <div class="mb-3">
    <label for="imprevistos" class="form-label">Descreva qualquer imprevisto encontrado</label>
    <textarea class="form-control" id="imprevistos" name="imprevistos" rows="5"><%= ordem.imprevistos || '' %></textarea>
  </div>
  <button type="submit" class="btn btn-warning mt-3 w-100">Salvar e continuar</button>
</form>
```

## 📄 views/index.ejs

```html

```

## 📄 views/inicio.ejs

```html
<a href="/os/<%= ordem.codigo %>/preparo" class="btn btn-outline-secondary mb-3">
  ⬅️ Voltar
</a>
<h2>📍 Chegada ao Local</h2>
<form action="/os/<%= ordem.codigo %>/inicio" method="POST">
  <div class="row g-4">
    <div class="col-12 col-md-6">
      <label class="form-label d-block">Local conforme?</label>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="conforme" id="conformeSim" value="sim"
          <%= ordem.observacoes_inicio?.conforme ? 'checked' : '' %> >
        <label class="form-check-label" for="conformeSim">Sim</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="conforme" id="conformeNao" value="nao"
          <%= ordem.observacoes_inicio?.conforme === false ? 'checked' : '' %> >
        <label class="form-check-label" for="conformeNao">Não</label>
      </div>
    </div>
    <div class="col-12 col-md-6">
      <label for="texto" class="form-label">Observações iniciais</label>
      <textarea class="form-control" name="texto" id="texto" rows="4"><%= ordem.observacoes_inicio?.texto || '' %></textarea>
    </div>
  </div>
  <button type="submit" class="btn btn-primary mt-4 w-100">Salvar e continuar</button>
</form>
```

## 📄 views/layout.ejs

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><%= typeof title !== 'undefined' ? title : 'OS Manager' %></title>
  <!-- Bootstrap 5 -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Ícones -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
  <style>
    body { padding-bottom: 80px; }
  </style>
</head>
<body>
  <div class="container mt-4">
    <%- body %>
  </div>
</body>
</html>
```

## 📄 views/lista.ejs

```html
<h2 class="mb-4">📋 Minhas Ordens de Serviço</h2>
<!-- MOBILE: Cards -->
<div class="d-md-none">
  <% ordens.forEach(ordem => { %>
    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">#<%= ordem.codigo %> - <%= ordem.titulo %></h5>
        <p class="card-text">
          <strong>Status:</strong> <%= ordem.status %><br>
          <strong>Técnico:</strong> <%= ordem.tecnico %>
        </p>
        <a href="/os/<%= ordem.codigo %>" class="btn btn-primary w-100">Ver OS</a>
      </div>
    </div>
  <% }) %>
</div>
<!-- DESKTOP: Tabela -->
<div class="d-none d-md-block">
  <table class="table table-striped table-hover">
    <thead class="table-light">
      <tr>
        <th>Código</th>
        <th>Título</th>
        <th>Técnico</th>
        <th>Status</th>
        <th>Data</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      <% ordens.forEach(ordem => { %>
        <tr>
          <td>#<%= ordem.codigo %></td>
          <td><%= ordem.titulo %></td>
          <td><%= ordem.tecnico %></td>
          <td>
            <% if (ordem.status === 'Pendente') { %>
              <span class="badge bg-secondary">Pendente</span>
            <% } else if (ordem.status === 'Em execução') { %>
              <span class="badge bg-primary">Em execução</span>
            <% } else { %>
              <span class="badge bg-success">Concluído</span>
            <% } %>
          </td>
          <td><%= ordem.previsao || '-' %></td>
          <td>
            <a href="/os/<%= ordem.codigo %>" class="btn btn-sm btn-outline-primary">Ver</a>
          </td>
        </tr>
      <% }) %>
    </tbody>
  </table>
</div>
```

## 📄 views/preparo.ejs

```html
<a href="/os/<%= ordem.codigo %>" class="btn btn-outline-secondary mb-3 d-md-none">
  ⬅️ Voltar
</a>
<h2>🧰 Checklist de Preparação</h2>
<form action="/os/<%= ordem.codigo %>/preparo" method="POST">
  <div class="row g-3">
    <div class="col-12 col-md-4 form-check">
      <input class="form-check-input" type="checkbox" name="combustivel" id="combustivel"
        <%= ordem.checklist_preparo?.combustivel ? 'checked' : '' %> >
      <label class="form-check-label" for="combustivel">Combustível OK</label>
    </div>
    <div class="col-12 col-md-4 form-check">
      <input class="form-check-input" type="checkbox" name="ferramentas" id="ferramentas"
        <%= ordem.checklist_preparo?.ferramentas ? 'checked' : '' %> >
      <label class="form-check-label" for="ferramentas">Ferramentas Separadas</label>
    </div>
    <div class="col-12 col-md-4 form-check">
      <input class="form-check-input" type="checkbox" name="epi" id="epi"
        <%= ordem.checklist_preparo?.epi ? 'checked' : '' %> >
      <label class="form-check-label" for="epi">EPI Pronto</label>
    </div>
  </div>
  <button type="submit" class="btn btn-success mt-4 w-100">Salvar e continuar</button>
</form>
```

## 📄 views/relatorios.ejs

```html
<h2 class="mb-4">📄 Relatórios de Ordens de Serviço</h2>
<!-- Formulário de Filtros -->
<form class="row g-3 mb-4" method="GET" action="/status">
  <div class="col-md-3">
    <label class="form-label">Técnico</label>
    <select name="tecnico" class="form-select">
      <option value="">Todos</option>
      <% tecnicos.forEach(t => { %>
        <option value="<%= t %>"
          <%= filtros.tecnico === t ? 'selected' : '' %>>
          <%= t %>
        </option>
      <% }) %>
    </select>
  </div>
  <div class="col-md-3">
    <label class="form-label">Status</label>
    <select name="status" class="form-select">
      <option value="">Todos</option>
      <% statuses.forEach(s => { %>
        <option value="<%= s %>"
          <%= filtros.status === s ? 'selected' : '' %>>
          <%= s %>
        </option>
      <% }) %>
    </select>
  </div>
  <div class="col-md-3">
    <label class="form-label">Previsão</label>
    <input type="date"
      name="data"
      class="form-control"
      value="<%= filtros.data || '' %>">
  </div>
  <div class="col-md-3 d-flex align-items-end">
    <button class="btn btn-primary w-100">Filtrar</button>
  </div>
</form>
<!-- Botão de Download .zip -->
<div class="mb-3 text-end">
  <a href="/status/download" class="btn btn-success">
    📥 Baixar ZIP
  </a>
</div>
<!-- Tabela de Relatórios (apenas desktop) -->
<div class="table-responsive d-none d-md-block">
  <table class="table table-striped table-hover">
    <thead class="table-light">
      <tr>
        <th>Código</th>
        <th>Título</th>
        <th>Técnico</th>
        <th>Status</th>
        <th>Previsão</th>
        <th>Criado Em</th>
      </tr>
    </thead>
    <tbody>
      <% ordens.forEach(os => { %>
        <tr>
          <td>#<%= os.codigo %></td>
          <td><%= os.titulo %></td>
          <td><%= os.tecnico %></td>
          <td>
            <span class="badge 
              <%= os.status === 'Pendente'    ? 'bg-secondary' :
                  os.status === 'Em execução' ? 'bg-primary' :
                                                'bg-success' %>">
              <%= os.status %>
            </span>
          </td>
          <td><%= os.previsao || '-' %></td>
          <td><%= new Date(os.criadoEm).toLocaleString() %></td>
        </tr>
      <% }) %>
    </tbody>
  </table>
</div>
<!-- Cards de Relatórios (mobile simplificado) -->
<div class="d-md-none">
  <% ordens.forEach(os => { %>
    <div class="card mb-2">
      <div class="card-body">
        <h5>#<%= os.codigo %> - <%= os.titulo %></h5>
        <p>
          <strong>Técnico:</strong> <%= os.tecnico %><br>
          <strong>Status:</strong> <%= os.status %><br>
          <strong>Previsão:</strong> <%= os.previsao || '-' %>
        </p>
      </div>
    </div>
  <% }) %>
</div>
```

## 📄 views/upload.ejs

```html
<a href="/os/<%= ordem.codigo %>" 
   class="btn btn-outline-secondary mb-3 d-md-none">
  ⬅️ Voltar
</a>
<h2>📷 Upload de Mídia</h2>
<p>Tipo de Mídia: <strong><%= tipo.charAt(0).toUpperCase() + tipo.slice(1) %></strong></p>
<form action="/os/<%= ordem.codigo %>/upload" 
      method="POST" 
      enctype="multipart/form-data">
  <input type="hidden" name="tipo" value="<%= tipo %>">
  <div class="mb-3">
    <label for="arquivo" class="form-label">Selecione o arquivo</label>
    <input class="form-control" 
           type="file" 
           name="arquivo" 
           id="arquivo" 
           accept="image/*,video/*" 
           required>
  </div>
  <button type="submit" class="btn btn-primary w-100">
    Enviar
  </button>
</form>
<% if (ordem.fotos[tipo] && ordem.fotos[tipo].length) { %>
  <hr>
  <h5>Arquivos já enviados:</h5>
  <ul class="list-group">
    <% ordem.fotos[tipo].forEach(file => { %>
      <li class="list-group-item">
        <a href="<%= file.url %>" target="_blank">
          <i class="bi bi-file-earmark-arrow-up"></i> 
          <%= file.nome %>
        </a>
      </li>
    <% }) %>
  </ul>
<% } %>
```

## 📄 views/view.ejs

```html
<% 
  const steps = [
    { key: 'preparo',           label: 'Preparo',       done: !!(
         ordem.checklist_preparo?.combustivel &&
         ordem.checklist_preparo?.ferramentas &&
         ordem.checklist_preparo?.epi) },
    { key: 'inicio',            label: 'Chegada',       done: !!ordem.observacoes_inicio },
    { key: 'upload?tipo=inicio',label: 'Mídia Início',  done: ordem.fotos.inicio?.length > 0 },
    { key: 'imprevistos',       label: 'Imprevistos',   done: !!ordem.imprevistos },
    { key: 'finalizacao',       label: 'Finalização',   done: !!(
         ordem.dificuldades?.trim() ||
         ordem.recomendacoes?.trim()) },
    { key: 'upload?tipo=final', label: 'Mídia Final',   done: ordem.fotos.final?.length > 0 }
  ];
  const doneCount = steps.filter(s => s.done).length;
  const nextIdx   = steps.findIndex(s => !s.done);
  const activeIdx = nextIdx < 0 ? steps.length - 1 : nextIdx;
  const pctDone   = Math.round(doneCount / steps.length * 100);
  const listLink = `/os?tecnico=${encodeURIComponent(ordem.tecnico)}`;
  const hasNext  = activeIdx < steps.length - 1;
  const nextKey  = hasNext ? steps[activeIdx + 1].key : null;
  const mapLabel = {
    preparo: 'Preparo',
    inicio: 'Chegada',
    'upload?tipo=inicio': 'Mídia Início',
    imprevistos: 'Imprevistos',
    finalizacao: 'Finalização',
    'upload?tipo=final': 'Mídia Final'
  };
%>
<!-- === CABEÇALHO DA OS === -->
<div class="card shadow-sm mb-4">
  <div class="card-header bg-white d-flex justify-content-between align-items-center">
    <div>
      <h3 class="mb-0">OS #<%= ordem.codigo %> – <%= ordem.titulo %></h3>
      <small class="text-muted">Técnico: <%= ordem.tecnico %></small>
    </div>
    <div>
      <% if (ordem.status === 'Pendente') { %>
        <span class="badge bg-secondary px-3">Pendente</span>
      <% } else if (ordem.status === 'Em execução') { %>
        <span class="badge bg-primary px-3">Em execução</span>
      <% } else { %>
        <span class="badge bg-success px-3">Concluído</span>
      <% } %>
    </div>
  </div>
  <div class="card-body">
    <!-- === CONTADOR DE ETAPAS === -->
    <div class="d-flex justify-content-end mb-2">
      <span class="fw-bold"><%= doneCount %> / <%= steps.length %> etapas concluídas</span>
    </div>
    <!-- === STEPPER VISUAL COM ÍCONES === -->
    <nav aria-label="Progress">
      <ol class="list-unstyled d-flex justify-content-between mb-3">
        <% steps.forEach((step, i) => { 
             const color = step.done ? 'bg-success text-white' :
                           i === activeIdx ? 'bg-primary text-white' :
                           'bg-light text-muted';
        %>
          <li class="text-center flex-fill position-relative">
            <div class="mx-auto mb-1 rounded-circle d-flex align-items-center justify-content-center <%= color %>" 
                 style="width:2.5rem;height:2.5rem">
              <i class="bi 
                <%= step.key==='preparo'            ? 'bi-tools' :
                    step.key==='inicio'             ? 'bi-pin-map' :
                    step.key==='upload?tipo=inicio' ? 'bi-camera' :
                    step.key==='imprevistos'        ? 'bi-exclamation-triangle' :
                    step.key==='finalizacao'        ? 'bi-pencil-square' :
                                                      'bi-camera-reels' %>">
              </i>
            </div>
            <small class="<%= i === activeIdx ? 'text-primary' : '' %>"><%= step.label %></small>
            <% if(i < steps.length - 1){ %>
              <div class="position-absolute top-50 end-0 bg-light" 
                   style="width:100%;height:2px;margin-left:1.3rem;z-index:-1">
              </div>
            <% } %>
          </li>
        <% }) %>
      </ol>
    </nav>
    <!-- === BARRA DE PROGRESSO === -->
    <div class="progress mb-4" style="height:1rem">
      <div class="progress-bar bg-primary" role="progressbar" style="width:<%= pctDone %>%;">
      </div>
    </div>
    <!-- === GRID DE AÇÕES COM BLOQUEIO === -->
    <div class="row row-cols-2 row-cols-md-3 g-3 mb-4">
      <% steps.forEach((step, i) => {
           const isDone = step.done;
           const isActive = i === activeIdx;
           const isLocked = i > activeIdx;
           const btnClass = isDone
             ? 'btn-success'
             : isActive
               ? 'btn-primary'
               : 'btn-outline-secondary';
      %>
        <div class="col">
          <a href="<%= isLocked ? '#' : `/os/${ordem.codigo}/${step.key}` %>"
             class="btn <%= btnClass %> w-100 h-100 py-4 d-flex flex-column align-items-center justify-content-center shadow-sm <%= isLocked ? 'disabled' : '' %>">
            <i class="bi bi-<%= 
              step.key==='preparo'            ? 'tools' :
              step.key==='inicio'             ? 'pin-map' :
              step.key==='upload?tipo=inicio' ? 'camera' :
              step.key==='imprevistos'        ? 'exclamation-triangle' :
              step.key==='finalizacao'        ? 'pencil-square' :
                                                'camera-reels'
            %> fs-2 mb-2"></i>
            <span><%= step.label %></span>
          </a>
        </div>
      <% }) %>
    </div>
  </div>
</div>
<!-- === NAVBAR FIXA COM VOLTAR E PRÓXIMO === -->
<nav class="navbar fixed-bottom bg-white border-top py-2 d-none d-md-flex">
  <div class="container d-flex justify-content-between">
    <a href="<%= listLink %>" class="btn btn-light shadow-sm">
      <i class="bi bi-list"></i> Minhas OSs
    </a>
    <% if (hasNext) { 
         const canAdvance = steps[activeIdx].done;
    %>
      <a href="<%= canAdvance ? `/os/${ordem.codigo}/${nextKey}` : '#' %>" 
         class="btn <%= canAdvance ? 'btn-primary' : 'btn-outline-secondary disabled' %> shadow-sm">
        Próximo: <%= mapLabel[nextKey] %> 
        <i class="bi bi-arrow-right-circle"></i>
      </a>
    <% } %>
  </div>
</nav>
<!-- === AJUSTE DE ESPAÇO PARA NAVBAR === -->
<style>
  body { padding-bottom: 80px; }
</style>
```
