// Inicialização do Recurso VLibras Governamental
if (window.VLibras) {
    new window.VLibras.Widget('https://vlibras.gov.br');
}

// Elementos de Acessibilidade
const btnContrast = document.getElementById('toggle-contrast');
const btnDyslexia = document.getElementById('toggle-dyslexia');

btnContrast.addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
});

btnDyslexia.addEventListener('click', () => {
    document.body.classList.toggle('font-dyslexia');
});

// Elementos e Lógica do Simulador Fotovoltaico & Robótico
const ldrSlider = document.getElementById('sensor-ldr');
const tempSlider = document.getElementById('temp-agua');
const valLdr = document.getElementById('val-ldr');
const valTemp = document.getElementById('val-temp');
const resPotencia = document.getElementById('res-potencia');
const resStatus = document.getElementById('res-status');

function rodarSimulacao() {
    const ldrValor = parseFloat(ldrSlider.value);
    const tempValor = parseFloat(tempSlider.value);

    valLdr.textContent = ldrValor;
    valTemp.textContent = tempValor;

    // Cálculo simplificado: potência depende da radiação captada pelo LDR (Eficiência de 20%)
    const potencia = ldrValor * 0.20;
    resPotencia.textContent = potencia.toFixed(1);

    // Regra de automação robótica para o aquecimento da piscina
    if (ldrValor > 400 && tempValor < 28) {
        resStatus.textContent = "Bomba de calor LIGADA (Sol forte e água fria)";
        resStatus.style.backgroundColor = "#4caf50";
        resStatus.style.color = "#fff";
    } else if (tempValor >= 28) {
        resStatus.textContent = "Sistema DESLIGADO (Temperatura ideal atingida)";
        resStatus.style.backgroundColor = "#2196f3";
        resStatus.style.color = "#fff";
    } else {
        resStatus.textContent = "Sistema em ESPERA (Radiação solar insuficiente)";
        resStatus.style.backgroundColor = "#ff9800";
        resStatus.style.color = "#000";
    }
}

ldrSlider.addEventListener('input', rodarSimulacao);
tempSlider.addEventListener('input', rodarSimulacao);

// Inicializa os dados na primeira execução
rodarSimulacao();

