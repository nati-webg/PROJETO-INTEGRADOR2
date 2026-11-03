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

const sliderLdr = document.getElementById('slide-ldr');
const sliderTemp = document.getElementById('slide-temp');
const txtLdr = document.getElementById('txt-ldr');
const txtTemp = document.getElementById('txt-temp');
const outPotencia = document.getElementById('out-potencia');
const outStatus = document.getElementById('out-status');

function recalcularDashboard() {
    if (!sliderLdr || !sliderTemp || !outPotencia || !outStatus) return;

    const ldrValue = parseInt(sliderLdr.value, 10);
    const tempValue = parseInt(sliderTemp.value, 10);

    txtLdr.textContent = ldrValue;
    txtTemp.textContent = tempValue;

    const calculoPotencia = ldrValue * 0.20;
    outPotencia.textContent = calculoPotencia.toFixed(0);

    outStatus.className = 'status-indicator';

    if (ldrValue > 450 && tempValue < 29) {
        outStatus.textContent = "BOMBA OPERANDO";
        outStatus.classList.add('status-active');
    } else if (tempValue >= 29) {
        outStatus.textContent = "TEMPERATURA IDEAL";
        outStatus.classList.add('status-ideal');
    } else {
        outStatus.textContent = "STANDBY (NUVENS)";
        outStatus.classList.add('status-standby');
    }
}

if (sliderLdr && sliderTemp) {
    sliderLdr.addEventListener('input', recalcularDashboard);
    sliderTemp.addEventListener('input', recalcularDashboard);
    recalcularDashboard();
}
