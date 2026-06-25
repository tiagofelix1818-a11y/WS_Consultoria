# Avaliação de Perfil Comportamental — My Blue · WS Consultoria

Sistema em 2 partes: um **formulário HTML** (o link que as 8 pessoas vão preencher) e um **backend em Apps Script** que grava cada envio numa planilha Google — **uma linha por pessoa**. O Walyson abre a planilha e vê João numa linha, Maria na outra, prontas para a análise individual.

---

## Arquivos

| Arquivo | O que é |
|---|---|
| `avaliacao-comportamental-myblue.html` | O formulário. É o que você publica e envia o link. |
| `Codigo.gs` | O backend (cola no Apps Script da planilha). |
| `INSTRUCOES.md` | Este guia. |

---

## Teste imediato (sem configurar nada)

Abra o `.html` direto no navegador, preencha e clique em **Enviar avaliação**. Como o backend ainda não está plugado, ele **baixa um arquivo `.json`** com todas as respostas. Serve para você validar o formulário antes de publicar.

---

## Configurando o recebimento das respostas (10 minutos)

### 1. Crie a planilha
- Vá em [sheets.new](https://sheets.new) e crie uma planilha em branco.
- Dê um nome (ex.: *Avaliações My Blue*).
- Copie o **ID** da planilha — é o trecho da URL entre `/d/` e `/edit`:
  `https://docs.google.com/spreadsheets/d/`**`ESTE_TRECHO_É_O_ID`**`/edit`

### 2. Cole o backend
- Na planilha: menu **Extensões → Apps Script**.
- Apague o conteúdo padrão, cole todo o `Codigo.gs`.
- Na linha `const SHEET_ID = "..."`, substitua pelo **ID** que você copiou.
- Salve (ícone de disquete).

### 3. Publique como App da Web
- No Apps Script: **Implantar → Nova implantação**.
- Em "Selecionar tipo" (engrenagem), escolha **App da Web**.
- Configure:
  - **Executar como:** Eu mesmo
  - **Quem tem acesso:** **Qualquer pessoa**
- Clique **Implantar** e autorize (vai pedir login Google — é normal, é a sua própria conta).
- Copie a **URL do app da Web** que aparece (termina em `/exec`).

### 4. Conecte o formulário ao backend
- Abra o `.html` num editor de texto.
- Lá no início do `<script>`, troque:
  ```js
  const ENDPOINT_URL = "";
  ```
  por:
  ```js
  const ENDPOINT_URL = "https://script.google.com/macros/s/SUA_URL_AQUI/exec";
  ```
- Salve.

Pronto. A partir daí, todo envio cai direto na aba **Respostas** da planilha.

---

## Publicando o link (escolha uma)

**Vercel (recomendado, seu fluxo de sempre):**
- Suba o `.html` (renomeie para `index.html`) num repositório e conecte ao Vercel, ou arraste a pasta em [vercel.com/new](https://vercel.com/new).
- Você recebe um link `https://...vercel.app` para mandar no WhatsApp.

**Alternativa rápida:** Netlify Drop ([app.netlify.com/drop](https://app.netlify.com/drop)) — arrasta o arquivo e ganha o link na hora.

---

## Como o Walyson lê os resultados

- Cada pessoa = **uma linha**. Colunas = data/hora, nome e o texto de cada pergunta com a resposta por extenso (ex.: *"Concordo totalmente"*, *"B) Me afastar por um tempo…"*).
- Para análise individual, ele filtra/ordena pela coluna **Avaliado**.
- Nada de histórico circulando: o documento Word some, tudo vira dado estruturado.

---

## Detalhes técnicos (caso precise mexer)

- O formulário tem **validação**: não envia com questões em branco e leva a pessoa direto para a primeira pendência. Barra de progresso no topo mostra o % preenchido.
- A **escolha forçada** (MAIS/MENOS) impede marcar a mesma linha nas duas colunas.
- O POST usa `Content-Type: text/plain` de propósito — é o truque para o Apps Script aceitar sem esbarrar no CORS (sem preflight).
- Para **editar perguntas**, mexa só no objeto `SECTIONS` dentro do `<script>`. A planilha se ajusta sozinha ao novo cabeçalho (use uma aba nova se mudar perguntas no meio de uma rodada).
- Se publicar uma nova versão do backend, gere **Nova implantação** (ou *Gerenciar implantações → editar*) e atualize a URL se ela mudar.

---

*WS Gestão, Consultoria e Treinamentos LTDA — uso confidencial para fins de desenvolvimento profissional.*
