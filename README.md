# 🦷 Respostas Rápidas - Aplicação HTML Pura

Uma aplicação web simples e eficiente para gerenciar respostas rápidas categorizadas, desenvolvida com HTML, CSS e JavaScript puro.

## ✨ Funcionalidades

- **🔍 Busca em tempo real** - Encontre respostas rapidamente digitando palavras-chave
- **📋 Copiar texto** - Botão para copiar respostas para a área de transferência
- **📱 Envio para WhatsApp** - Botão para enviar respostas diretamente pelo WhatsApp
- **⬇️ Cards com dropdown** - Interface limpa com conteúdo expansível
- **🎨 Categorias coloridas** - Visual organizado por tipo de resposta
- **⬆️ Botão voltar ao topo** - Navegação facilitada em listas longas
- **📱 Design responsivo** - Funciona perfeitamente em desktop e mobile

## 🎨 Categorias

- **💰 Financeiro** (laranja) - Valores, pagamentos, PIX
- **ℹ️ Informação** (azul) - Perguntas gerais, moldagem
- **🎉 Entrega** (verde) - Trabalhos finalizados
- **🦷 Orientação** (roxo) - Cuidados e instruções

## 📁 Estrutura dos Arquivos

```
respostas-rapidas/
├── index.html          # Página principal
├── script.js           # Lógica da aplicação
└── README.md           # Documentação
```

## 🚀 Como Usar

1. **Abrir a aplicação**: Abra o arquivo `index.html` em qualquer navegador web
2. **Buscar respostas**: Digite palavras-chave no campo de busca
3. **Expandir conteúdo**: Clique na seta para baixo para ver o texto completo
4. **Copiar texto**: Clique no botão verde de copiar
5. **Enviar pelo WhatsApp**: Clique no botão verde do WhatsApp

## 🔧 Personalização

### Adicionar Novas Respostas

Para adicionar novas respostas, edite a variável `localData` no arquivo `script.js`:

```javascript
const localData = `titulos,categoria,texto,Imagens
Novo Título,Categoria,"Texto da resposta aqui",
`;
```

### Formato dos Dados

- **titulos**: Título da resposta
- **categoria**: Categoria (Financeiro, Informação, Entrega, Orientação)
- **texto**: Conteúdo da resposta (pode conter quebras de linha)
- **Imagens**: Campo opcional (não utilizado atualmente)

### Personalizar Cores

As cores das categorias podem ser alteradas no arquivo `index.html` nas classes CSS:

```css
.financeiro { background-color: #f97316; }    /* Laranja */
.informacao { background-color: #3b82f6; }    /* Azul */
.entrega { background-color: #10b981; }       /* Verde */
.orientacao { background-color: #8b5cf6; }    /* Roxo */
```

## 🌐 Hospedagem

Esta aplicação pode ser hospedada em qualquer servidor web estático:

- **GitHub Pages** - Gratuito e fácil de usar
- **Netlify** - Deploy automático com Git
- **Vercel** - Hospedagem rápida e gratuita
- **Servidor próprio** - Qualquer servidor web (Apache, Nginx, etc.)

## 📱 Compatibilidade

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Dispositivos móveis (iOS/Android)

## 🔒 Privacidade

- **Sem coleta de dados** - Todos os dados ficam no seu navegador
- **Sem cookies** - Não utiliza cookies ou rastreamento
- **Offline-ready** - Funciona sem conexão com a internet após o primeiro carregamento

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura da página
- **CSS3** - Estilização e layout responsivo
- **JavaScript ES6+** - Lógica da aplicação
- **Tailwind CSS** - Framework CSS via CDN
- **Font Awesome** - Ícones

## 📄 Licença

Este projeto é de uso livre. Você pode modificar e distribuir conforme necessário.

---

**Desenvolvido com ❤️ para agilizar suas respostas!**

