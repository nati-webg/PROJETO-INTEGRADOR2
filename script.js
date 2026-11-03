// Logs de validação no console do desenvolvedor
console.log("Script de Automação e Acessibilidade Ativo com Sucesso!");

// Captura dos elementos manipuladores de Acessibilidade
const contrastBtn = document.getElementById('toggle-contrast');
const dyslexiaBtn = document.getElementById('toggle-dyslexia');

if (contrastBtn) {
    contrastBtn.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
        console.log("Estado de Alto Contraste Alternado.");
    });
}

if (dyslexiaBtn) {
    dyslexiaBtn.addEventListener('click', () => {
        document.body.classList.toggle('font-dyslexia');
        console.log("Estado da Fonte de Leitura Alternado.");
    });
}

// Captura das variáveis dinâmicas do simulador interativo LDR
const sliderLdr = document.getElementById('slide-ldr');
const sliderTemp = document.getElementById('slide-temp');

const txtLdr = document.getElementById('txt-ldr');
const txtTemp = document.getElementById('txt-temp');

const outPotencia = document.getElementById('out-potencia');
const outStatus = document.getElementById('out-status');

// Processamento lógico matemático e simulação de automação
function recalcularDashboard() {
    if (!sliderLdr || !sliderTemp || !outPotencia || !outStatus) return;

    const ldrValue = parseInt(sliderLdr.value, 10);
    const tempValue = parseInt(sliderTemp.value, 10);

    // Atualiza os indicadores de texto em tempo real
    txtLdr.textContent = ldrValue;
    txtTemp.textContent = tempValue;

    // Cálculo da física quântica (Efeito fotoelétrico estático a 20%)
    const calculoPotencia = ldrValue * 0.20;
    outPotencia.textContent = calculoPotencia.toFixed(0);

    // Reseta as classes de estado anteriores para evitar sobreposição
    outStatus.className = 'status-indicator';

    // Regras lógicas de acionamento do hardware robótico (Motobomba)
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

// Vincula os eventos de escuta para os sliders
if (sliderLdr && sliderTemp) {
    sliderLdr.addEventListener('input', recalcularDashboard);
    sliderTemp.addEventListener('input', recalcularDashboard);
    
    // Roda a função uma primeira vez no carregamento da tela
    recalcularDashboard();
}
