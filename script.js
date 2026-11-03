// Manipulação dos Modos de Leitura e Acessibilidade Visual
const contrastBtn = document.getElementById('toggle-contrast');
const dyslexiaBtn = document.getElementById('toggle-dyslexia');

contrastBtn.addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
});

dyslexiaBtn.addEventListener('click', () => {
    document.body.classList.toggle('font-dyslexia');
});

// Captura de Elementos de Interface do Simulador Automatizado
const sliderLdr = document.getElementById('slide-ldr');
const sliderTemp = document.getElementById('slide-temp');

const txtLdr = document.getElementById('txt-ldr');
const txtTemp = document.getElementById('txt-temp');

const outPotencia = document.getElementById('out-potencia');
const outStatus = document.getElementById('out-status');

// Execução de Regras Matemáticas e Automação de Hardware (Sensores)
function recalcularDashboard() {
    const ldrValue = parseInt(sliderLdr.value, 10);
    const tempValue = parseInt(sliderTemp.value, 10);

    // Atualização de rótulos de texto reativos
    txtLdr.textContent = ldrValue;
    txtTemp.textContent = tempValue;

    // Cálculo físico da potência com rendimento quântico estático de 20%
    const calculoPotencia = ldrValue * 0.20;
    outPotencia.textContent = calculoPotencia.toFixed(0);

    // Limpa classes anteriores para não conflitar com o Alto Contraste do CSS
    outStatus.className = 'status-indicator';

    // Sistema Robótico de controle lógico do trocador de calor da piscina
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

// Escuta de mudanças nos controles dinâmicos
sliderLdr.addEventListener('input', recalcularDashboard);
sliderTemp.addEventListener('input', recalcularDashboard);

// Execução imediata no carregamento da DOM
recalcularDashboard();
