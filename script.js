// Configurações da aplicação
const CONFIG = {
    sheetsUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSNMZw_fZj10NQOvxSEDJUlSc4UdcmHvRzX4m6slpq6f-saYglDYFs0pbg9uk8FKgl5nK_ZLhijHLRk/pub?gid=0&single=true&output=csv',
    delimiter: ',',
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
    settingsBtn: document.getElementById('settingsBtn'),
    settingsModal: document.getElementById('settingsModal'),
    closeSettings: document.getElementById('closeSettings'),
    sheetsUrl: document.getElementById('sheetsUrl'),
    saveSettings: document.getElementById('saveSettings'),
    loadSample: document.getElementById('loadSample'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage')
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    loadConfig();
    setupEventListeners();
    loadData();
});

// Carregar configurações salvas
function loadConfig() {
    const savedConfig = localStorage.getItem(CONFIG.storageKey);
    if (savedConfig) {
        const config = JSON.parse(savedConfig);
        CONFIG.sheetsUrl = config.sheetsUrl || CONFIG.sheetsUrl;
        elements.sheetsUrl.value = CONFIG.sheetsUrl;
    }
}

// Salvar configurações
function saveConfig() {
    const config = {
        sheetsUrl: CONFIG.sheetsUrl
    };
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(config));
}

// Configurar event listeners
function setupEventListeners() {
    // Busca em tempo real
    elements.searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Modal de configurações
    elements.settingsBtn.addEventListener('click', openSettings);
    elements.closeSettings.addEventListener('click', closeSettings);
    elements.saveSettings.addEventListener('click', saveSettingsHandler);
    elements.loadSample.addEventListener('click', loadSampleData);
    
    // Fechar modal clicando fora
    elements.settingsModal.addEventListener('click', function(e) {
        if (e.target === elements.settingsModal) {
            closeSettings();
        }
    });
    
    // Tecla ESC para fechar modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !elements.settingsModal.classList.contains('hidden')) {
            closeSettings();
        }
    });
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

// Carregar dados do Google Sheets
async function loadData() {
    showLoading();
    
    try {
        // Tentar carregar do Google Sheets primeiro
        const response = await fetch(CONFIG.sheetsUrl, {
            mode: 'cors',
            headers: {
                'Accept': 'text/csv,text/plain,*/*'
            }
        });
        
        let csvText;
        if (response.ok) {
            csvText = await response.text();
        } else {
            throw new Error('Erro CORS - usando dados locais');
        }
        
        const data = parseCSV(csvText);
        
        if (data.length === 0) {
            throw new Error('Nenhum dado encontrado - usando dados locais');
        }
        
        allResponses = data;
        filteredResponses = [...allResponses];
        renderResponses();
        hideLoading();
        
    } catch (error) {
        console.log('Carregando dados locais devido a:', error.message);
        
        // Usar dados locais como fallback
        const data = parseCSV(localData);
        allResponses = data;
        filteredResponses = [...allResponses];
        renderResponses();
        hideLoading();
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
                // Aspas duplas escapadas
                current += '"';
                i++; // Pular próxima aspa
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
            
            <div class="text-gray-700 leading-relaxed mb-4">
                ${formatResponseText(response.resposta)}
            </div>
            
            <div class="text-sm text-gray-500 flex items-center">
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

// Modal de configurações
function openSettings() {
    elements.settingsModal.classList.remove('hidden');
    elements.sheetsUrl.focus();
}

function closeSettings() {
    elements.settingsModal.classList.add('hidden');
}

function saveSettingsHandler() {
    const newUrl = elements.sheetsUrl.value.trim();
    
    if (!newUrl) {
        showToast('Por favor, insira um URL válido', 'error');
        return;
    }
    
    CONFIG.sheetsUrl = newUrl;
    saveConfig();
    closeSettings();
    showToast('Configurações salvas! Recarregando dados...');
    
    // Recarregar dados com nova URL
    setTimeout(() => {
        loadData();
    }, 1000);
}

function loadSampleData() {
    // Dados de exemplo para demonstração
    const sampleData = [
        {
            titulo: 'Moldagem e Dentista',
            categoria: 'Informação',
            resposta: 'Olá 😊, poderia informar quando fez a moldagem? Qual seu dentista? 🦷',
            emoji: '📝',
            caracteres: 69
        },
        {
            titulo: 'Valor e Procedimento',
            categoria: 'Financeiro',
            resposta: 'Informação sobre valor e procedimento: O valor é R$150,00 💰, demora cerca de 10 a 15 dias para ficar pronto.',
            emoji: '💰',
            caracteres: 115
        },
        {
            titulo: 'Lembrete de Pagamento',
            categoria: 'Financeiro',
            resposta: 'Lembrete amigável: o pagamento é só quando eu avisar que o trabalho está pronto 📋. Qualquer dúvida, me chame!',
            emoji: '📋',
            caracteres: 114
        }
    ];
    
    allResponses = sampleData;
    filteredResponses = [...allResponses];
    renderResponses();
    hideLoading();
    closeSettings();
    showToast('Dados de exemplo carregados!');
}

// Mostrar toast
function showToast(message, type = 'success') {
    elements.toastMessage.textContent = message;
    
    if (type === 'error') {
        elements.toast.className = elements.toast.className.replace('bg-green-600', 'bg-red-600');
    } else {
        elements.toast.className = elements.toast.className.replace('bg-red-600', 'bg-green-600');
    }
    
    elements.toast.classList.remove('hidden');
    
    setTimeout(() => {
        elements.toast.classList.add('hidden');
    }, 3000);
}

