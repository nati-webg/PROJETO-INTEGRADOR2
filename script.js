// ==========================================================================
// 1. GERENCIAMENTO DE ACESSIBILIDADE VISUAL (BOTOES SUPERIORES)
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
// 3. LOGICA MATEMATICA DA FISICA E AUTOMACAO DA MOTOBOMBA
// ==========================================================================
function recalcularDashboard() {
    // Evita erros se algum elemento nao for carregado na DOM
    if (!sliderLdr || !sliderTemp || !outPotencia || !outStatus) return;

    // Converte os valores textuais dos Sliders para numeros inteiros
    const ldrValue = parseInt(sliderLdr.value, 10);
    const tempValue = parseInt(sliderTemp.value, 10);

    // Sincroniza os valores numericos na tela em tempo real
    txtLdr.textContent = ldrValue;
    txtTemp.textContent = tempValue;

    // [PROFUNDIDADE CIENTIFICA] Calculo da Potencia Gerada com Eficiencia Quântica de 20%
    const calculoPotencia = ldrValue * 0.20;
    outPotencia.textContent = calculoPotencia.toFixed(0);

    // Reseta as classes css do indicador para nao bugar no Alto Contraste
    outStatus.className = 'status-indicator';

    // [ROBOTICA] Regras Lógicas de Tomada de Decisao do Microcontrolador
    if (ldrValue > 450 && tempValue < 29) {
        // Alta radiacao e agua fria: Aciona o aquecimento
        outStatus.textContent = "BOMBA OPERANDO";
        outStatus.classList.add('status-active');
    } else if (tempValue >= 29) {
        // Agua ja atingiu o patamar de conforto termico ideal
        outStatus.textContent = "TEMPERATURA IDEAL";
        outStatus.classList.add('status-ideal');
    } else {
        // Baixa radiacao (Noite ou Céu muito Nublado): Preserva o hardware
        outStatus.textContent = "STANDBY (NUVENS)";
        outStatus.classList.add('status-standby');
    }
}

// ==========================================================================
// 4. ATIVACAO DOS EVENTOS E INICIALIZACAO DA PAGINA
// ==========================================================================
if (sliderLdr && sliderTemp) {
    // Ouve as alteracoes nos controles enquanto o usuario arrasta o slider
    sliderLdr.addEventListener('input', recalcularDashboard);
    sliderTemp.addEventListener('input', recalcularDashboard);
    
    // Executa a funcao uma primeira vez ao abrir a pagina para definir os valores iniciais
    recalcularDashboard();
}
