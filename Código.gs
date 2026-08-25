/**
 * Função executada ao abrir a Web App.
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Premium Finance Dashboard Pro')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Obtém ou cria a folha de cálculo e abas necessárias.
 */
function obterPlanilha() {
  var idPlanilha = "COLE_AQUI_O_ID_DA_SUA_PLANILHA"; // Mantenha o seu ID aqui
  return SpreadsheetApp.openById(idPlanilha);
}

function obterAbaLancamentos() {
  var ss = obterPlanilha();
  var aba = ss.getSheetByName("Lançamentos");
  
  if (!aba) {
    aba = ss.insertSheet("Lançamentos");
    aba.appendRow(["ID", "Data", "Descrição", "Categoria", "Tipo", "Valor"]);
    aba.getRange("A1:F1").setFontWeight("bold").setBackground("#111625").setFontColor("#ffffff");
  }
  return aba;
}

/**
 * Obtém ou cria a aba Configurações com a estrutura organizada por colunas
 */
function obterAbaConfiguracoes() {
  var ss = obterPlanilha();
  var aba = ss.getSheetByName("Configurações");
  
  if (!aba) {
    aba = ss.insertSheet("Configurações");
    
    // Cabeçalho claro e separado em 3 colunas dedicadas
    aba.appendRow(["Categorias", "Limite da Categoria", "Tipos de Fluxo"]);
    
    // Configurações Padrão
    var categoriasPadrao = [
      ["Alimentação", 600],
      ["Transporte", 350],
      ["Lazer", 400],
      ["Moradia", 1500],
      ["Salário/Renda", 0],
      ["Outros", 500]
    ];
    
    var fluxosPadrao = ["Saída", "Entrada"];
    
    var maxLinhas = Math.max(categoriasPadrao.length, fluxosPadrao.length);
    
    for (var i = 0; i < maxLinhas; i++) {
      var cat = categoriasPadrao[i] ? categoriasPadrao[i][0] : "";
      var lim = categoriasPadrao[i] ? categoriasPadrao[i][1] : "";
      var fluxo = fluxosPadrao[i] || "";
      
      aba.appendRow([cat, lim, fluxo]);
    }
    
    // Formata o cabeçalho
    aba.getRange("A1:C1").setFontWeight("bold").setBackground("#111625").setFontColor("#ffffff");
  }
  return aba;
}

/**
 * Busca os dados de Lançamentos e de Configurações
 */
/**
 * Busca os dados de Lançamentos e de Configurações calculando métricas e alertas
 */
function buscarDados() {
  var abaLanc = obterAbaLancamentos();
  var dados = abaLanc.getDataRange().getValues();
  
  var resultado = [];
  var mudouPlanilha = false;

  if (dados.length > 1) {
    for (var i = 1; i < dados.length; i++) {
      var idExistente = dados[i][0];
      var linhaPlanilha = i + 1;
      
      if (!idExistente || idExistente === "") {
        idExistente = Utilities.getUuid();
        abaLanc.getRange(linhaPlanilha, 1).setValue(idExistente);
        mudouPlanilha = true;
      }

      var dataFormatada = "";
      var dataISO = "";
      if (dados[i][1] instanceof Date) {
        dataFormatada = Utilities.formatDate(dados[i][1], Session.getScriptTimeZone(), "dd/MM/yyyy");
        dataISO = Utilities.formatDate(dados[i][1], Session.getScriptTimeZone(), "yyyy-MM-dd");
      } else if (dados[i][1] !== "") {
        try {
          var d = new Date(dados[i][1]);
          dataFormatada = Utilities.formatDate(d, Session.getScriptTimeZone(), "dd/MM/yyyy");
          dataISO = Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyy-MM-dd");
        } catch(e) {
          dataFormatada = dados[i][1].toString();
        }
      }

      resultado.push({
        id: idExistente,
        data: dataFormatada,
        dataISO: dataISO,
        descricao: dados[i][2],
        categoria: dados[i][3],
        tipo: dados[i][4],
        valor: parseFloat(dados[i][5]) || 0
      });
    }
  }

  if (mudouPlanilha) {
    SpreadsheetApp.flush();
  }

  var config = buscarConfiguracoes();

  return {
    transacoes: resultado.reverse(),
    categorias: config.categorias,
    tiposFluxo: config.tiposFluxo
  };
}

/**
 * Lê as colunas A, B e C de forma independente e sem repetir opções vazias
 */
function buscarConfiguracoes() {
  var abaConfig = obterAbaConfiguracoes();
  var dados = abaConfig.getDataRange().getValues();
  
  var categorias = [];
  var tiposFluxo = [];
  
  for (var i = 1; i < dados.length; i++) {
    // Coluna A (Nome da Categoria) e Coluna B (Limite)
    var nomeCat = dados[i][0] ? dados[i][0].toString().trim() : "";
    if (nomeCat !== "") {
      categorias.push({
        nome: nomeCat,
        limite: parseFloat(dados[i][1]) || 0
      });
    }
    
    // Coluna C (Tipos de Fluxo)
    var nomeFluxo = dados[i][2] ? dados[i][2].toString().trim() : "";
    if (nomeFluxo !== "" && !tiposFluxo.includes(nomeFluxo)) {
      tiposFluxo.push(nomeFluxo);
    }
  }
  
  return {
    categorias: categorias,
    tiposFluxo: tiposFluxo
  };
}

/**
 * Salva na coluna exata sem bagunçar a estrutura da planilha
 */
function adicionarOpcaoConfig(tipo, valor, limite) {
  try {
    var abaConfig = obterAbaConfiguracoes();
    var dados = abaConfig.getDataRange().getValues();
    
    if (tipo === 'categoria') {
      // Procura a primeira linha vaga na Coluna A
      var linhaParaInserir = dados.length + 1;
      for (var i = 1; i < dados.length; i++) {
        if (!dados[i][0] || dados[i][0] === "") {
          linhaParaInserir = i + 1;
          break;
        }
      }
      // Escreve na Coluna A (Categoria) e Coluna B (Limite)
      abaConfig.getRange(linhaParaInserir, 1).setValue(valor);
      abaConfig.getRange(linhaParaInserir, 2).setValue(parseFloat(limite) || 0);
      return "Sucesso: Categoria '" + valor + "' adicionada com limite de R$ " + parseFloat(limite || 0).toFixed(2);
      
    } else {
      // Procura a primeira linha vaga na Coluna C (Tipo de Fluxo)
      var linhaParaInserir = dados.length + 1;
      for (var j = 1; j < dados.length; j++) {
        if (!dados[j][2] || dados[j][2] === "") {
          linhaParaInserir = j + 1;
          break;
        }
      }
      // Escreve na Coluna C
      abaConfig.getRange(linhaParaInserir, 3).setValue(valor);
      return "Sucesso: Tipo de fluxo '" + valor + "' adicionado!";
    }
  } catch (e) {
    return "Erro ao salvar configuração: " + e.toString();
  }
}

/**
 * Funções de CRUD de Transações
 */
function salvarTransacao(dados) {
  try {
    var aba = obterAbaLancamentos();
    var partesData = dados.data.split("-");
    var ano = parseInt(partesData[0]);
    var mes = parseInt(partesData[1]) - 1;
    var dia = parseInt(partesData[2]);
    
    var numIteracoes = 1;
    if (dados.recorrente) {
      if (dados.recTipo === "Parcelada") {
        numIteracoes = parseInt(dados.recParcelas) || 1;
      } else if (dados.recTipo === "Fixa") {
        numIteracoes = 12;
      }
    }
    
    for (var i = 0; i < numIteracoes; i++) {
      var dataLancamento = new Date(ano, mes + i, dia, 12, 0, 0);
      var descFinal = dados.descricao;
      
      if (dados.recorrente && dados.recTipo === "Parcelada") {
        descFinal += " (" + (i + 1) + "/" + numIteracoes + ")";
      }
      
      var novoId = Utilities.getUuid();
      aba.appendRow([novoId, dataLancamento, descFinal, dados.categoria, dados.tipo, parseFloat(dados.valor)]);
    }
    return "Sucesso: Lançamento(s) efetuado(s) com sucesso!";
  } catch (erro) {
    return "Erro ao salvar transação: " + erro.toString();
  }
}

function atualizarTransacao(dados) {
  try {
    var aba = obterAbaLancamentos();
    var valores = aba.getDataRange().getValues();
    
    for (var i = 1; i < valores.length; i++) {
      if (valores[i][0].toString() === dados.id.toString()) {
        var linha = i + 1;
        var partesData = dados.data.split("-");
        var dataLancamento = new Date(parseInt(partesData[0]), parseInt(partesData[1]) - 1, parseInt(partesData[2]), 12, 0, 0);
        
        aba.getRange(linha, 2).setValue(dataLancamento);
        aba.getRange(linha, 3).setValue(dados.descricao);
        aba.getRange(linha, 4).setValue(dados.categoria);
        aba.getRange(linha, 5).setValue(dados.tipo);
        aba.getRange(linha, 6).setValue(parseFloat(dados.valor));
        return "Sucesso: Lançamento atualizado com sucesso!";
      }
    }
    return "Erro: Registro não encontrado.";
  } catch (erro) {
    return "Erro ao atualizar: " + erro.toString();
  }
}

function excluirTransacao(id) {
  try {
    var aba = obterAbaLancamentos();
    var valores = aba.getDataRange().getValues();
    
    for (var i = 1; i < valores.length; i++) {
      if (valores[i][0].toString() === id.toString()) {
        aba.deleteRow(i + 1);
        return "Sucesso: Lançamento removido com sucesso!";
      }
    }
    return "Erro: Lançamento não encontrado.";
  } catch (erro) {
    return "Erro ao excluir: " + erro.toString();
  }
}