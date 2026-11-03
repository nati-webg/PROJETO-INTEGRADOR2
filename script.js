// Controle dos Modos Globais de Acessibilidade Visual
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

// Captura de Variáveis Interativas (Simulador)
const sliderLdr = document.getElementById('slide-ldr');
const sliderTemp = document.getElementById('slide-temp');

const txtLdr = document.getElementById('txt-ldr');
const txtTemp = document.getElementById('txt-temp');

const outPotencia = document.getElementById('out-potencia');
const outStatus = document.getElementById('out-status');

// Execução Lógica e Processamento Matemático em Tempo Real
function recalcularDashboard() {
    if (!sliderLdr || !sliderTemp || !outPotencia || !outStatus) return;

    const ldrValue = parseInt(sliderLdr.value, 10);
    const tempValue = parseInt(sliderTemp.value, 10);

    // Sincroniza labels em tempo real
    txtLdr.textContent = ldrValue;
    txtTemp.textContent = tempValue;

    // Cálculo Físico: Potência calculada sob Eficiência Quântica Média de 20%
    const calculoPotencia = ldrValue * 0.20;
    outPotencia.textContent = calculoPotencia.toFixed(0);

    // Reseta classes do indicador para evitar quebra com o Alto Contraste
    outStatus.className = 'status-indicator';

    // Regras de Hardware Robótico de Automação para a Piscina
    if (ldrValue > 450 && tempValue < 29) {
        outStatus.textContent = "BOMBA LIGADA";
        outStatus.classList.add('status-active');
    } else if (tempValue >= 29) {
        outStatus.textContent = "TEMPERATURA IDEAL";
        outStatus.classList.add('status-ideal');
    } else {
        outStatus.textContent = "MODO STANDBY (NUVENS)";
        outStatus.classList.add('status-standby');
    }
}

// Vincula ouvidores aos controles deslizantes
if (sliderLdr && sliderTemp) {
    sliderLdr.addEventListener('input', recalcularDashboard);
    sliderTemp.addEventListener('input', recalcularDashboard);
    
    // Executa a primeira carga inicial na renderização da DOM
    recalcularDashboard();
}
