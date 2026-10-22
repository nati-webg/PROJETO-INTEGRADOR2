// Inicialização do widget VLibras obrigatório
new window.VLibras.Widget('https://vlibras.gov.br');

// Seleção de elementos do DOM para acessibilidade e simulação
const toggleContrastBtn = document.getElementById('toggle-accessibility');
const toggleDyslexiaBtn = document.getElementById('toggle-dyslexia');

const radiSlider = document.getElementById('radisolar');
const efiSlider = document.getElementById('eficiencia');

const valRad = document.getElementById('val-rad');
const valEfi = document.getElementById('val-efi');
const resPotencia = document.getElementById('res-potencia');
const resStatus = document.getElementById('res-status');

// Funções de Toggles de Acessibilidade
toggleContrastBtn.addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
});

toggleDyslexiaBtn.addEventListener('click', () => {
    document.body.classList.toggle('font-dyslexia');
});

// Lógica de cálculo em tempo real do Simulador Fotovoltaico
function calcularResultados() {
    const radiação = parseFloat(radiSlider.value);
    const eficiencia = parseFloat(efiSlider.value) / 100;

    // Atualiza os valores visuais dos sliders
    valRad.textContent = radiação;
    valEfi.textContent = efiSlider.value;

    // P = Radiação * Eficiência
    const potenciaGerada = radiação * eficiencia;
    resPotencia.textContent = potenciaGerada.toFixed(1);

    // Ajusta dinamicamente a badge de status de acordo com o rendimento
    if (potenciaGerada < 80) {
        resStatus.textContent = 'Baixa Geração (Nublado/Fim do dia)';
        resStatus.style.backgroundColor = '#f44336';
        resStatus.style.color = '#fff';
    } else if (potenciaGerada >= 80 && potenciaGerada < 160) {
        resStatus.textContent = 'Produção Moderada';
        resStatus.style.backgroundColor = '#ff9800';
        resStatus.style.color = '#000';
    } else {
        resStatus.textContent = 'Produção Excelente (Ideal para Trocador de Calor)';
        resStatus.style.backgroundColor = '#4caf50';
        resStatus.style.color = '#fff';
    }
}

// Ouvintes de eventos para recalcular ao arrastar os controles
radiSlider.addEventListener('input', calcularResultados);
efiSlider.addEventListener('input', calcularResultados);

// Executa uma vez no início para popular os campos
calcularResultados();

