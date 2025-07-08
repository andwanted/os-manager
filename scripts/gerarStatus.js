// generateStatus.js
const fs = require('fs')
const path = require('path')

// Onde estão suas ordens
const ordensPath  = path.join(__dirname, 'data', 'ordens.json')
// Onde salvar o relatório (pasta será criada automaticamente)
const reportDir   = path.join(__dirname, 'reports')
const reportPath  = path.join(reportDir, 'status-report.json')

function generateStatus() {
  // 1) lê as ordens
  if (!fs.existsSync(ordensPath)) {
    console.warn('Nenhum ordens.json encontrado em', ordensPath)
    return
  }
  const ordens = JSON.parse(fs.readFileSync(ordensPath, 'utf-8'))

  // 2) monta o resumo
  const resumoMap = ordens.reduce((acc, { status }) => {
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  const resumo = Object.entries(resumoMap).map(([status, total]) => ({ status, total }))

  // 3) garante pasta de saída
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true })
  }

  // 4) grava o JSON do relatório
  fs.writeFileSync(reportPath, JSON.stringify(resumo, null, 2), 'utf-8')
  console.log(`📊 Relatório gerado em ${reportPath}`)
}

module.exports = generateStatus
