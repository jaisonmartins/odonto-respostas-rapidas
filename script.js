// Configurações da aplicação
const CONFIG = {
    sheetsUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSNMZw_fZj10NQOvxSEDJUlSc4UdcmHvRzX4m6slpq6f-saYglDYFs0pbg9uk8FKgl5nK_ZLhijHLRk/pub?gid=0&single=true&output=csv',
    delimiter: ",",
    storageKey: 'respostas-rapidas-config'
};

// Estado da aplicação
let allResponses = [];
let filteredResponses = [];

// Elementos DOM
const elements = {
    searchInput: document.getElementById('searchInput'),
    responsesContainer: document.getElementById('responsesContainer'),
    loadingState: document.getElementById('loadingState'),
    errorState: document.getElementById('errorState'),
    noResults: document.getElementById('noResults'),
    backToTop: document.getElementById('backToTop'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage')
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadData();
});

// Configurar event listeners
function setupEventListeners() {
    // Busca em tempo real
    elements.searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Botão voltar ao topo
    elements.backToTop.addEventListener('click', scrollToTop);
    
    // Mostrar/ocultar botão baseado na posição do scroll
    window.addEventListener('scroll', handleScroll);
}

// Debounce para otimizar a busca
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Dados locais (fallback)
const localData = `titulos,categoria,texto,Imagens
Moldagem e Dentista,Informação,"📝 Olá 😊, poderia informar quando fez a moldagem? Qual seu dentista? 🦷",
Valor e Procedimento,Financeiro,"Informação sobre valor e procedimento:
O valor é R$150,00 💵, demora cerca de 10 a 15 dias para ficar pronto! Pode ficar pronto antes! Recebo por Pix ou transferência no momento da entrega, aviso 2 dias antes!
PIX: 95991195913 - Jaison Jose Bastos Martins 🔒
OBS: Pagamento somente quando eu avisar que está pronto!",
Lembrete de Pagamento,Financeiro,"O pagamento é só quando eu avisar que o trabalho está pronto 💳. Qualquer dúvida, só chamar! 😊",
Trabalho Finalizado,Entrega,"Olá! 🎉 Seu trabalho está pronto! Agora fico aguardando seu pagamento. Assim que fizer o Pix, me avise para que eu deixe no Sest Senat, ok? ✔️
💸 PIX: 95991195913 - Jaison Jose Bastos Martins",
Guia de Cuidados,Orientação,"Esse é o seu aparelho, feito especialmente pra você! 🦷✨

E você pode ter alguns cuidados para manter ele lindo por mais tempo:
🪥 Escove o aparelho todos os dias com DETERGENTE NEUTRO, para não formar tártaro e mau cheiro.
⚠️ Não segure no arco (fio) para higienizá-lo.
💦 Enxágue bem para retirar toda saliva sempre que retirar da boca e guardar na caixinha.
📦 Guarde-o sempre na caixinha própria, evitando risco de quebra e perda.
👃 Lembre-se que o aparelho pega o cheiro da sua boca, então escove sempre os dentes.
🍽️ Retire o aparelho sempre para se alimentar.
🔥 Alimentos quentes podem danificá-lo.",`;

// Carregar dados locais (sem dependência de Google Sheets)
async function loadData() {
    showLoading();
    
    try {
        // Dados simples para teste
        const testData = [
            {
                id: 'response-1',
                titulo: 'Moldagem e Dentista',
                categoria: 'Informação',
                resposta: '📝 Olá 😊, poderia informar quando fez a moldagem? Qual seu dentista? 🦷',
                emoji: 'ℹ️',
                caracteres: 72
            },
            {
                id: 'response-2',
                titulo: 'Valor e Procedimento',
                categoria: 'Financeiro',
                resposta: 'Informação sobre valor e procedimento:\nO valor é R$150,00 💵, demora cerca de 10 a 15 dias para ficar pronto! Pode ficar pronto antes! Recebo por Pix ou transferência no momento da entrega, aviso 2 dias antes!\nPIX: 95991195913 - Jaison Jose Bastos Martins 🔒\nOBS: Pagamento somente quando eu avisar que está pronto!',
                emoji: '💰',
                caracteres: 315
            },
            {
                id: 'response-3',
                titulo: 'Lembrete de Pagamento',
                categoria: 'Financeiro',
                resposta: 'O pagamento é só quando eu avisar que o trabalho está pronto 💳. Qualquer dúvida, só chamar! 😊',
                emoji: '💰',
                caracteres: 95
            },
            {
                id: 'response-4',
                titulo: 'Trabalho Finalizado',
                categoria: 'Entrega',
                resposta: 'Olá! 🎉 Seu trabalho está pronto! Agora fico aguardando seu pagamento. Assim que fizer o Pix, me avise para que eu deixe no Sest Senat, ok? ✔️\n💸 PIX: 95991195913 - Jaison Jose Bastos Martins',
                emoji: '🎉',
                caracteres: 191
            },
            {
                id: 'response-5',
                titulo: 'Guia de Cuidados',
                categoria: 'Orientação',
                resposta: 'Esse é o seu aparelho, feito especialmente pra você! 🦷✨\n\nE você pode ter alguns cuidados para manter ele lindo por mais tempo:\n🪥 Escove o aparelho todos os dias com DETERGENTE NEUTRO, para não formar tártaro e mau cheiro.\n⚠️ Não segure no arco (fio) para higienizá-lo.\n💦 Enxágue bem para retirar toda saliva sempre que retirar da boca e guardar na caixinha.\n📦 Guarde-o sempre na caixinha própria, evitando risco de quebra e perda.\n👃 Lembre-se que o aparelho pega o cheiro da sua boca, então escove sempre os dentes.\n🍽️ Retire o aparelho sempre para se alimentar.\n🔥 Alimentos quentes podem danificá-lo.',
                emoji: '🦷',
                caracteres: 608
            }
        ];
        
        allResponses = testData;
        filteredResponses = [...allResponses];
        renderResponses();
        hideLoading();
        
    } catch (error) {
        console.log('Erro ao carregar dados:', error.message);
        showError();
    }
}

// Parser CSV robusto
function parseCSV(csvText) {
    const lines = csvText.trim().split("\n");
    const data = [];
    let currentLine = "";

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        currentLine += line;

        // Contar aspas para determinar se a linha está completa
        const quoteCount = (currentLine.match(/"/g) || []).length;

        if (quoteCount % 2 === 0) {
            // Número par de aspas = linha completa
            const values = parseCSVLine(currentLine);
            if (values.length >= 3) {
                const item = {
                    id: `response-${data.length + 1}`,
                    titulo: values[0] || '',
                    categoria: values[1] || '',
                    resposta: values[2] || '',
                    emoji: getEmojiForCategory(values[1] || ''),
                    caracteres: (values[2] || '').length
                };

                if (item.titulo && item.resposta) {
                    data.push(item);
                }
            }
            currentLine = "";
        } else {
            // Número ímpar de aspas = linha continua na próxima
            currentLine += "\n";
        }
    }

    return data;
}

// Parser para linha CSV individual
function parseCSVLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === CONFIG.delimiter && !inQuotes) {
            result.push(current.trim());
            current = "";
        } else if (char === '"') {
            if (i + 1 < line.length && line[i + 1] === '"') {
                // Handle escaped double quote (e.g., "" inside a quoted field)
                current += '"';
                i++; // Skip the next quote
            } else {
                inQuotes = !inQuotes;
            }
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}

// Obter emoji para categoria
function getEmojiForCategory(categoria) {
    const categoryEmojis = {
        'informacao': 'ℹ️',
        'informação': 'ℹ️',
        'financeiro': '💰',
        'entrega': '🎉',
        'orientacao': '🦷',
        'orientação': '🦷',
        'moldagem': '📝',
        'dentista': '🦷',
        'procedimento': '🔧',
        'pagamento': '💳',
        'valor': '💵',
        'lembrete': '📋',
        'default': '💬'
    };
    
    const key = categoria.toLowerCase();
    for (const [cat, emoji] of Object.entries(categoryEmojis)) {
        if (key.includes(cat)) {
            return emoji;
        }
    }
    
    return categoryEmojis.default;
}

// Renderizar respostas
function renderResponses() {
    if (filteredResponses.length === 0) {
        showNoResults();
        return;
    }
    
    hideNoResults();
    
    const html = filteredResponses.map(response => createResponseCard(response)).join('');
    elements.responsesContainer.innerHTML = html;
    elements.responsesContainer.classList.remove('hidden');
    
    // Adicionar event listeners para os botões
    setupCardEventListeners();
}

// Criar card de resposta
function createResponseCard(response) {
    const categoryClass = getCategoryClass(response.categoria);
    
    return `
        <div class="card-hover bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 fade-in">
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-3">
                    <div class="text-2xl">${response.emoji}</div>
                    <div>
                        <h3 class="text-xl font-bold text-gray-800 mb-1">${response.titulo}</h3>
                        <span class="category-tag ${categoryClass} text-white text-sm px-3 py-1 rounded-full font-medium">
                            ${response.categoria}
                        </span>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button class="btn-copy bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors shadow-md" 
                            data-text="${escapeHtml(response.resposta)}" 
                            title="Copiar texto">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="btn-whatsapp bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors shadow-md" 
                            data-text="${escapeHtml(response.resposta)}" 
                            title="Enviar pelo WhatsApp">
                        <i class="fab fa-whatsapp"></i>
                    </button>
                </div>
            </div>
            
            <div class="text-gray-700 leading-relaxed mb-4 overflow-hidden transition-all duration-300 ease-in-out max-h-0" id="response-text-${response.id}">
                ${formatResponseText(response.resposta)}
            </div>
            
            <div class="flex justify-center">
                <button class="btn-toggle-text text-gray-500 hover:text-gray-700 transition-colors" data-target="response-text-${response.id}">
                    <i class="fas fa-chevron-down text-xl"></i>
                </button>
            </div>
            
            <div class="text-sm text-gray-500 flex items-center mt-2">
                <i class="fas fa-info-circle mr-2"></i>
                ${response.caracteres} caracteres
            </div>
        </div>
    `;
}

// Obter classe CSS para categoria
function getCategoryClass(categoria) {
    const cat = categoria.toLowerCase();
    if (cat.includes('financeiro') || cat.includes('valor') || cat.includes('pagamento')) {
        return 'financeiro';
    } else if (cat.includes('informacao') || cat.includes('informação')) {
        return 'informacao';
    } else if (cat.includes('entrega')) {
        return 'entrega';
    } else if (cat.includes('orientacao') || cat.includes('orientação')) {
        return 'orientacao';
    }
    return '';
}

// Formatar texto da resposta
function formatResponseText(text) {
    return text
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

// Escapar HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Configurar event listeners dos cards
function setupCardEventListeners() {
    // Botões de copiar
    document.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.getAttribute('data-text');
            copyToClipboard(text);
        });
    });
    
    // Botões do WhatsApp
    document.querySelectorAll('.btn-whatsapp').forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.getAttribute('data-text');
            sendToWhatsApp(text);
        });
    });

    // Botões de toggle de texto
    document.querySelectorAll('.btn-toggle-text').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            const icon = this.querySelector('i');

            if (targetElement.classList.contains('max-h-0')) {
                targetElement.classList.remove('max-h-0');
                targetElement.classList.add('max-h-screen');
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                targetElement.classList.remove('max-h-screen');
                targetElement.classList.add('max-h-0');
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });
}

// Copiar para área de transferência
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copiado para a área de transferência!');
    } catch (err) {
        // Fallback para navegadores mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Copiado para a área de transferência!');
    }
}

// Enviar para WhatsApp
function sendToWhatsApp(text) {
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
    showToast('Abrindo WhatsApp...');
}

// Buscar respostas
function handleSearch() {
    const query = elements.searchInput.value.toLowerCase().trim();
    
    if (query === '') {
        filteredResponses = [...allResponses];
    } else {
        filteredResponses = allResponses.filter(response => 
            response.titulo.toLowerCase().includes(query) ||
            response.categoria.toLowerCase().includes(query) ||
            response.resposta.toLowerCase().includes(query)
        );
    }
    
    renderResponses();
}

// Mostrar/ocultar estados
function showLoading() {
    elements.loadingState.classList.remove('hidden');
    elements.responsesContainer.classList.add('hidden');
    elements.errorState.classList.add('hidden');
    elements.noResults.classList.add('hidden');
}

function hideLoading() {
    elements.loadingState.classList.add('hidden');
}

function showError() {
    elements.errorState.classList.remove('hidden');
    elements.loadingState.classList.add('hidden');
    elements.responsesContainer.classList.add('hidden');
    elements.noResults.classList.add('hidden');
}

function showNoResults() {
    elements.noResults.classList.remove('hidden');
    elements.responsesContainer.classList.add('hidden');
}

function hideNoResults() {
    elements.noResults.classList.add('hidden');
}

// Função para voltar ao topo
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Função para controlar a visibilidade do botão baseado no scroll
function handleScroll() {
    if (window.pageYOffset > 300) {
        elements.backToTop.style.opacity = '1';
        elements.backToTop.style.visibility = 'visible';
    } else {
        elements.backToTop.style.opacity = '0';
        elements.backToTop.style.visibility = 'hidden';
    }
}

// Mostrar toast
function showToast(message, type = 'success') {
    if (!elements.toastMessage) return;
    
    elements.toastMessage.textContent = message;
    
    if (type === 'error') {
        elements.toast.className = elements.toast.className.replace('bg-green-600', 'bg-red-600');
    } else {
        elements.toast.className = elements.toast.className.replace('bg-red-600', 'bg-green-600');
    }
    
    elements.toast.classList.remove('hidden');
    elements.toast.classList.add('show');
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
        elements.toast.classList.add('hidden');
    }, 3000);
}

