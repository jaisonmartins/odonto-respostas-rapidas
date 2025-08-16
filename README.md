# 🦷 Respostas Rápidas

Uma aplicação web moderna para gerenciar e compartilhar respostas rápidas categorizadas, integrada com Google Sheets.

## ✨ Funcionalidades

- **📊 Integração com Google Sheets**: Carrega dados automaticamente de planilhas públicas
- **🔍 Busca Inteligente**: Pesquise por título, categoria ou conteúdo das respostas
- **📋 Copiar com Um Clique**: Copie qualquer resposta para a área de transferência
- **📱 Integração WhatsApp**: Envie respostas diretamente pelo WhatsApp
- **🎨 Design Responsivo**: Interface moderna e adaptável para mobile e desktop
- **⚡ Carregamento Rápido**: Dados locais como fallback para máxima velocidade

## 🚀 Como Usar

### 1. Configuração Inicial
1. Abra o arquivo `index.html` em qualquer navegador web
2. A aplicação carregará automaticamente com os dados do Google Sheets configurado

### 2. Configurar Nova Planilha (Opcional)
1. Clique no botão de configurações (⚙️) no canto inferior direito
2. Cole o link público do seu Google Sheets no formato CSV
3. Clique em "Salvar" para aplicar as mudanças

### 3. Formato da Planilha
Sua planilha deve ter as seguintes colunas:
- **Coluna A**: `titulos` - Título da resposta
- **Coluna B**: `categoria` - Categoria (ex: Informação, Financeiro, Entrega, Orientação)
- **Coluna C**: `texto` - Conteúdo completo da resposta
- **Coluna D**: `Imagens` - (Opcional) Links para imagens

### 4. Funcionalidades Principais

#### 🔍 Buscar Respostas
- Digite qualquer palavra-chave na barra de pesquisa
- A busca funciona em tempo real nos títulos, categorias e conteúdo

#### 📋 Copiar Texto
- Clique no botão verde de copiar em qualquer card
- O texto será copiado automaticamente para sua área de transferência
- Uma notificação confirmará a ação

#### 📱 Enviar pelo WhatsApp
- Clique no botão verde do WhatsApp em qualquer card
- Será aberta uma nova aba com o WhatsApp Web
- O texto já estará preenchido, pronto para envio

## 🎨 Categorias e Cores

A aplicação organiza as respostas por categorias com cores distintas:

- **💰 Financeiro** - Laranja (pagamentos, valores, PIX)
- **ℹ️ Informação** - Azul (perguntas gerais, informações)
- **🎉 Entrega** - Verde (trabalhos finalizados, entregas)
- **🦷 Orientação** - Roxo (cuidados, instruções)

## 📁 Estrutura de Arquivos

```
respostas-rapidas/
├── index.html          # Página principal da aplicação
├── script.js           # Lógica JavaScript e funcionalidades
└── README.md           # Esta documentação
```

## 🔧 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **Tailwind CSS** - Framework CSS via CDN
- **JavaScript ES6+** - Funcionalidades modernas
- **Font Awesome** - Ícones vetoriais
- **Google Sheets API** - Integração com planilhas

## 📱 Compatibilidade

- ✅ Chrome/Edge (Recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Dispositivos móveis (iOS/Android)

## 🛠️ Personalização

### Alterar Cores das Categorias
Edite as classes CSS no arquivo `index.html`:

```css
.category-tag.financeiro {
    background: linear-gradient(45deg, #f59e0b, #d97706);
}
```

### Adicionar Novas Categorias
1. Adicione nova categoria na planilha
2. Inclua emoji correspondente na função `getEmojiForCategory()`
3. Adicione classe CSS se necessário

## 🔒 Privacidade e Segurança

- Todos os dados são carregados diretamente do Google Sheets
- Nenhuma informação é armazenada em servidores externos
- Funciona completamente offline após o primeiro carregamento
- Configurações salvas apenas no navegador local

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se a planilha está pública e no formato correto
2. Teste com os dados de exemplo clicando em "Exemplo" nas configurações
3. Verifique o console do navegador para mensagens de erro

---

**Desenvolvido com ❤️ para agilizar suas respostas!**

