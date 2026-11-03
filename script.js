// ==========================================================================
// 1. GERENCIAMENTO DE ACESSIBILIDADE VISUAL (BOTÕES SUPERIORES)
// ==========================================================================
const contrastBtn = document.getElementById('toggle-contrast');
const dyslexiaBtn = document.getElementById('toggle-dyslexia');

if (contrastBtn) {
    contrastBtn.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
    });
}

if (dyslexiaBtn) {
    dyslexiaBtn.addEventListener('click', () => {
        document.body.classList.toggle('font-dyslexia');
    });
}

// ==========================================================================
// 2. CAPTURA DE COMPONENTES INTERATIVOS DO SIMULADOR (SENSORES E DISPLAYS)
// ==========================================================================
const sliderLdr = document.getElementById('slide-ldr');
const sliderTemp = document.getElementById('slide-temp');

const txtLdr = document.getElementById('txt-ldr');
const txtTemp = document.getElementById('txt-temp');

const outPotencia = document.getElementById('out-potencia');
const outStatus = document.getElementById('out-status');

// ==========================================================================
// 3. LÓGICA MATEMÁTICA DA FÍSICA E AUTOMAÇÃO DA MOTOBOMBA
// ==========================================================================
function recalcularDashboard() {
    // Evita erros se algum elemento não for carregado na DOM
    if (!sliderLdr || !sliderTemp || !outPotencia || !outStatus) return;

    // Converte os valores textuais dos Sliders para números inteiros
    const ldrValue = parseInt(sliderLdr.value, 10);
    const tempValue = parseInt(sliderTemp.value, 10);

    // Sincroniza os valores numéricos na tela em tempo real
    txtLdr.textContent = ldrValue;
    txtTemp.textContent = tempValue;

    // [PROFUNDIDADE CIENTÍFICA] Cálculo da Potência Gerada com Eficiência Quântica de 20%
    const calculoPotencia = ldrValue * 0.20;
    outPotencia.textContent = calculoPotencia.toFixed(0);

    // Reseta as classes CSS do indicador para não quebrar com o Alto Contraste
    outStatus.className = 'status-indicator';

    // [ROBÓTICA] Regras Lógicas de Tomada de Decisão do Microcontrolador
    if (ldrValue > 450 && tempValue < 29) {
        // Alta radiação e água fria: Aciona o aquecimento
        outStatus.textContent = "BOMBA OPERANDO";
        outStatus.classList.add('status-active');
    } else if (tempValue >= 29) {
        // Água já atingiu o patamar de conforto térmico ideal
        outStatus.textContent = "TEMPERATURA IDEAL";
        outStatus.classList.add('status-ideal');
    } else {
        // Baixa radiação (Noite ou Céu muito Nublado): Preserva o hardware
        outStatus.textContent = "STANDBY (NUVENS)";
        outStatus.classList.add('status-standby');
    }
}

// ==========================================================================
// 4. ATIVAÇÃO DOS EVENTOS E INICIALIZAÇÃO DA PÁGINA
// ==========================================================================
if (sliderLdr && sliderTemp) {
    // Ouve as alterações nos controles enquanto o usuário arrasta o slider
    sliderLdr.addEventListener('input', recalcularDashboard);
    sliderTemp.addEventListener('input', recalcularDashboard);
    
    // Executa a função uma primeira vez ao abrir a página para definir os valores iniciais
    recalcularDashboard();
}
