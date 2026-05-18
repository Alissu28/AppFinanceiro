### 1. README.md
Este arquivo serve como o cartão de visitas do seu projeto no GitHub. Ele explica o que é o sistema, os recursos instalados e como colocá-lo no ar de forma prática.

```markdown
# Finanças Pro - Comercial 🚀

O **Finanças Pro** é um aplicativo comercial de controle financeiro projetado para rodar diretamente no dispositivo do usuário (Web/PWA/Mobile). Ele utiliza o **Firebase Authentication** para isolamento e privacidade total dos dados por usuário e o **Firebase Firestore** como banco de dados em tempo real na nuvem.

## ✨ Funcionalidades
- 🔐 **Autenticação Segura:** Tela de login e cadastro integrada diretamente com o Firebase Auth.
- 👥 **Privacidade Multi-usuário:** Cada usuário visualiza e gerencia estritamente os seus próprios dados através do vínculo exclusivo com o seu `userId`.
- 📊 **Painel Visual Dinâmico:** Gráficos interativos (Chart.js) que mudam de cor e contexto dependendo do modo ativo (Gastos ou Entradas).
- 📉 **Modo de Operação Duplo:** Alternância rápida entre lançamentos de Despesas (Saídas) e Receitas (Entradas).
- 📅 **Histórico com Paginação:** Tabela inteligente de transações dividida por páginas para otimizar a performance e o visual em telas menores.
- 💰 **Máscara de Moeda Dinâmica:** Input de valor formatado em tempo real no padrão brasileiro (R$).

## 🛠️ Tecnologias Utilizadas
- **HTML5 & CSS3** (Customizações e Layout de Alta Performance)
- **Tailwind CSS** (Estilização Moderna e Responsiva)
- **Firebase v10 Compat** (Authentication & Firestore Cloud)
- **Chart.js** (Renderização Gráfica)
- **SweetAlert2** (Alertas Visuais Elegantes e Amigáveis)

## 🚀 Como Executar o Projeto

Como o navegador bloqueia requisições a servidores externos originadas diretamente de arquivos locais (`file:///`), este aplicativo precisa ser rodado a partir de um servidor web real. 

### Opção 1: GitHub Pages (Recomendado e Gratuito)
1. Crie um repositório **Público** no seu GitHub.
2. Faça o upload do arquivo `index.html` para a raiz do repositório.
3. Vá em **Settings** ⚙️ > **Pages**.
4. Em *Build and deployment*, mude a Branch de *None* para **main** (ou *master*) e clique em **Save**.
5. Aguarde 1 minuto e o GitHub fornecerá um link seguro (`https://`) para acessar o seu app de qualquer lugar!

### Opção 2: Servidor Local (Para Desenvolvedores)
Se você utiliza o VS Code, pode rodar o projeto localmente de forma instantânea:
1. Instale a extensão **Live Server**.
2. Abra a pasta do projeto no VS Code.
3. Clique com o botão direito no arquivo `index.html` e selecione **Open with Live Server**.

## ⚙️ Configuração do Banco de Dados (Firebase)
Se quiser usar a sua própria infraestrutura do Firebase:
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2. Ative o método **E-mail/senha** na aba *Authentication* > *Sign-in method*.
3. Crie um banco de dados **Firestore Database** em *Modo de Teste* ou ajuste as regras de segurança para:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /lancamentos/{document} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
         allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
       }
     }
   }
Substitua o objeto firebaseConfig no topo do arquivo index.html pelas chaves do seu aplicativo web.

Desenvolvido para fins comerciais e de gestão financeira simplificada. 🌟


---

### 2. .gitignore
Este arquivo diz ao Git para ignorar lixos do sistema operacional (como arquivos ocultos do Windows/Mac) ou pastas temporárias de editores de código (como as configurações locais do VS Code), mantendo seu repositório limpo.

Crie um arquivo chamado exatamente **`.gitignore`** (com o ponto na frente) e cole isso:

```text
# Arquivos de Sistema
.DS_Store
Thumbs.db
desktop.ini

# Pastas de IDEs e Editores
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.swp

# Logs e Cache
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.eslintcache

# Configurações de ambiente locais (Caso expanda o projeto futuramente)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local