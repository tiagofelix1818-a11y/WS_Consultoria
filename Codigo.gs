/**
 * ============================================================================
 *  WS Consultoria — Receptor de Avaliações de Perfil Comportamental (My Blue)
 *  Backend Google Apps Script · grava 1 envio por linha numa planilha Google.
 * ============================================================================
 *
 *  COMO USAR (resumo — passo a passo completo no arquivo INSTRUCOES.md):
 *   1. Crie uma planilha Google em branco.
 *   2. Menu  Extensões > Apps Script.
 *   3. Cole este código, substitua SHEET_ID abaixo pelo ID da sua planilha.
 *   4. Implantar > Nova implantação > Tipo "App da Web".
 *        - Executar como: Eu mesmo
 *        - Quem tem acesso: Qualquer pessoa
 *   5. Copie a URL gerada e cole na constante ENDPOINT_URL do arquivo HTML.
 *
 *  Cada pessoa que envia o formulário vira UMA LINHA na aba "Respostas",
 *  com cabeçalhos legíveis (o texto de cada pergunta).
 */

// >>> COLE AQUI O ID DA SUA PLANILHA (o trecho entre /d/ e /edit na URL) <<<
const SHEET_ID  = "COLE_O_ID_DA_PLANILHA_AQUI";
const SHEET_TAB = "Respostas";

/** Recebe o POST do formulário. */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000); // evita corrida quando 2 pessoas enviam juntas
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_TAB) || ss.insertSheet(SHEET_TAB);

    // Usa a versão LEGÍVEL (texto das perguntas + respostas por extenso).
    const legivel = data.legivel || {};
    const colunas = Object.keys(legivel);

    // 1ª vez: escreve o cabeçalho (Data/Hora + perguntas).
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Data/Hora", "Avaliado"].concat(colunas));
      sheet.getRange(1, 1, 1, sheet.getLastColumn())
           .setFontWeight("bold")
           .setBackground("#173B45")
           .setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    // Garante a mesma ordem do cabeçalho já existente.
    const header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const carimbo = Utilities.formatDate(new Date(), "America/Fortaleza", "dd/MM/yyyy HH:mm");
    const linha = header.map(function (h) {
      if (h === "Data/Hora") return carimbo;
      if (h === "Avaliado")  return data.avaliado || "";
      return legivel[h] != null ? legivel[h] : "";
    });
    sheet.appendRow(linha);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, erro: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Resposta de teste ao abrir a URL no navegador (GET). */
function doGet() {
  return json({ ok: true, servico: "WS · receptor de avaliacoes ativo" });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
