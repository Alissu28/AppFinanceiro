# 💰 PremiumFi — Dashboard de Fluxo de Caixa

Aplicação web para **gestão financeira pessoal / fluxo de caixa**, desenvolvida em **Google Apps Script** com **Google Sheets** como banco de dados. Permite registrar receitas e despesas, acompanhar o saldo, organizar gastos por categoria com limites e visualizar tudo em um dashboard com gráficos.

> ⚠️ **Projeto anonimizado para portfólio.** O ID da planilha (banco de dados) foi substituído por um placeholder. É um sistema real, em uso.

---

## ✨ Funcionalidades

- 💸 **Lançamentos** — cadastro, edição e exclusão de receitas e despesas.
- 📊 **Dashboard** — resumo de receita, despesa e saldo, com gráficos de **evolução do fluxo de caixa** e **despesas por categoria** (Chart.js).
- 🏷️ **Categorias e limites** — organização dos gastos por categoria, com definição de limites/metas.
- ⚡ **Interface responsiva** — visual moderno com Font Awesome e a fonte Plus Jakarta Sans.

---

## 🛠️ Tecnologias utilizadas

| Camada | Tecnologias |
|---|---|
| **Back-end** | Google Apps Script (JavaScript / runtime V8) |
| **Front-end** | HTML5, CSS3, JavaScript |
| **Banco de dados** | Google Sheets |
| **Bibliotecas** | Chart.js (gráficos), Font Awesome (ícones), Google Fonts |

---

## 🏗️ Arquitetura

Aplicação **Single Page Application (SPA)** servida pelo Google Apps Script:

- **`Código.gs`** — back-end: funções que leem e gravam na planilha (transações e configurações), como `salvarTransacao`, `atualizarTransacao`, `excluirTransacao`, `buscarDados` e `buscarConfiguracoes`. Usa as abas **Lançamentos** e **Configurações** da planilha.
- **`index.html`** — todo o front-end (interface + JavaScript do cliente + gráficos).
- **`appsscript.json`** — manifesto do projeto (fuso horário, permissões e configuração de web app).

---

## 🚀 Como executar / implantar

1. Crie uma **planilha no Google Sheets** que servirá de banco de dados (o sistema cria as abas `Lançamentos` e `Configurações` automaticamente).
2. Na planilha, vá em **Extensões → Apps Script** e cole os arquivos deste repositório.
3. No arquivo `Código.gs`, substitua `COLE_AQUI_O_ID_DA_SUA_PLANILHA` pelo **ID da sua planilha** (encontrado na URL dela).
4. Clique em **Implantar → Nova implantação → Aplicativo da Web**.
5. Acesse pela URL gerada.

---

## 📌 Destaques técnicos

- Desenvolvimento **full-stack** em uma única plataforma (back-end + front-end).
- **CRUD completo** de transações integrado ao Google Sheets.
- **Visualização de dados** com gráficos dinâmicos (Chart.js).
- Controle de **orçamento por categoria** com limites.

---

## 👨‍💻 Autor

**Alisson Miranda** — Desenvolvedor de Software | Analista de Sistemas
Formado em Análise e Desenvolvimento de Sistemas.

🔗 [LinkedIn](https://www.linkedin.com/in/alisson-miranda-9742862a8)
