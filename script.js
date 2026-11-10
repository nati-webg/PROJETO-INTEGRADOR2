/* ============================================
   PROJETO INTEGRADOR CEP - SCRIPT PRINCIPAL
   Simuladores, Acessibilidade e Interatividade
   Autoras: Natalia, Nicoli, Melissa, Rafaela
   ============================================ */

// ==========================================
// 1. UTILITÁRIOS E CONFIGURAÇÕES INICIAIS
// ==========================================

const CONSTANTES = {
  PLANCK: 6.626e-34,          // J·s
  PLANCK_EV: 4.136e-15,       // eV·s
  BOLTZMANN: 1.381e-23,       // J/K
  LUZ: 3e8,                   // m/s
  CALOR_ESP_AGUA: 4186,       // J/(kg·°C)
  DENSIDADE_AGUA: 1           // kg/L
};

// Estado global
const estado = {
  fonteBase: 16,
  fonteAtual: 16,
  altoContraste: false,
  dislexia: false,
  leitorAtivo: false,
  synth: window.speechSynthesis
};

// ==========================================
// 2. ACESSIBILIDADE
// ==========================================

document.getElementById('btnAumentarFonte').addEventListener('click', () => {
  if (estado.fonteAtual < 24) {
    estado.fonteAtual += 2;
    document.documentElement.style.fontSize = estado.fonteAtual + 'px';
    announce('Fonte aumentada para ' + estado.fonteAtual + ' pixels');
  }
});

document.getElementById('btnDiminuirFonte').addEventListener('click', () => {
  if (estado.fonteAtual > 12) {
    estado.fonteAtual -= 2;
    document.documentElement.style.fontSize = estado.fonteAtual + 'px';
    announce('Fonte diminuída para ' + estado.fonteAtual + ' pixels');
  }
});

document.getElementById('btnAltoContraste').addEventListener('click', () => {
  document.body.classList.toggle('alto-contraste');
  estado.altoContraste = !estado.altoContraste;
  announce(estado.altoContraste ? 'Alto contraste ativado' : 'Alto contraste desativado');
});

document.getElementById('btnDislexia').addEventListener('click', () => {
  document.body.classList.toggle('dislexia');
  estado.dislexia = !estado.dislexia;
  announce(estado.dislexia ? 'Fonte para dislexia ativada' : 'Fonte padrão ativada');
});

document.getElementById('btnLeitor').addEventListener('click', () => {
  estado.leitorAtivo = !estado.leitorAtivo;
  announce(estado.leitorAtivo ? 'Leitor de texto ativado. Clique em qualquer parágrafo para ouvir.' : 'Leitor desativado');

  if (estado.leitorAtivo) {
    document.querySelectorAll('p, h1, h2, h3, h4, li').forEach(el => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', lerTexto);
    });
  } else {
    estado.synth.cancel();
    document.querySelectorAll('p, h1, h2, h3, h4, li').forEach(el => {
      el.style.cursor = '';
      el.removeEventListener('click', lerTexto);
    });
  }
});

function lerTexto(e) {
  if (!estado.leitorAtivo) return;
  estado.synth.cancel();
  const utter = new SpeechSynthesisUtterance(e.currentTarget.textContent);
  utter.lang = 'pt-BR';
  utter.rate = 0.95;
  estado.synth.speak(utter);
}

function announce(msg) {
  let div = document.getElementById('liveRegion');
  if (!div) {
    div = document.createElement('div');
    div.id = 'liveRegion';
    div.setAttribute('role', 'status');
    div.setAttribute('aria-live', 'polite');
    div.style.position = 'absolute';
    div.style.left = '-9999px';
    document.body.appendChild(div);
  }
  div.textContent = msg;
}

// ==========================================
// 3. MENU MOBILE
// ==========================================

const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  const exp = navMenu.classList.contains('active');
  menuToggle.setAttribute('aria-expanded', exp);
  menuToggle.textContent = exp ? '✕' : '☰';
});

document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 968) {
      navMenu.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = '☰';
    }
  });
});

// ==========================================
// 4. NAVEGAÇÃO POR TECLADO
// ==========================================

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('active')) {
    navMenu.classList.remove('active');
    menuToggle.focus();
  }
});

const secoes = document.querySelectorAll('section[id]');
const linksNav = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
  let atual = '';
  secoes.forEach(secao => {
    const topo = secao.offsetTop - 120;
    if (window.scrollY >= topo) atual = secao.id;
  });
  linksNav.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + atual) link.classList.add('active');
  });
});

// ==========================================
// 5. ANIMAÇÃO DE ENTRADA (FADE-IN)
// ==========================================

const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });

fadeEls.forEach(el => observer.observe(el));

// ==========================================
// 6. SIMULADOR: EFEITO FOTOELÉTRICO
// ==========================================

const canvasFE = document.getElementById('canvasFotoeletrico');
const ctxFE = canvasFE.getContext('2d');
const freqInput = document.getElementById('frequencia');
const intInput = document.getElementById('intensidade');
const materialInput = document.getElementById('material');
const freqValor = document.getElementById('freqValor');
const intValor = document.getElementById('intValor');
const statusFE = document.getElementById('statusFotoeletrico');
const resultadoFE = document.getElementById('resultadoFotoeletrico');

let fotons = [];
let eletrons = [];

function redimensionarCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}
redimensionarCanvas(canvasFE);
window.addEventListener('resize', () => redimensionarCanvas(canvasFE));

function freqParaCor(f14) {
  const f = f14 * 1e14;
  const lambda = CONSTANTES.LUZ / f * 1e9;
  if (lambda > 700) return '#ff0000';
  if (lambda > 620) return '#ff4500';
  if (lambda > 590) return '#ffa500';
  if (lambda > 570) return '#ffff00';
  if (lambda > 495) return '#00ff00';
  if (lambda > 450) return '#0000ff';
  if (lambda > 380) return '#8a2be2';
  return '#9400d3';
}

function criarFoton() {
  const freq = parseFloat(freqInput.value);
  return {
    x: 0,
    y: canvasFE.height / 2 + (Math.random() - 0.5) * 80,
    vx: 3 + Math.random() * 2,
    cor: freqParaCor(freq),
    freq: freq,
    vivo: true
  };
}

function criarEletron(x, y, energia) {
  const ang = Math.random() * Math.PI * 2;
  const vel = 2 + energia * 0.5;
  return {
    x: x, y: y,
    vx: Math.cos(ang) * vel,
    vy: Math.sin(ang) * vel,
    vida: 60, vivo: true
  };
}

function atualizarFotoeletrico() {
  ctxFE.clearRect(0, 0, canvasFE.width, canvasFE.height);

  const grad = ctxFE.createLinearGradient(0, 0, canvasFE.width, canvasFE.height);
  grad.addColorStop(0, '#0a3d62');
  grad.addColorStop(1, '#0652a8');
  ctxFE.fillStyle = grad;
  ctxFE.fillRect(0, 0, canvasFE.width, canvasFE.height);

  // Placa de silício (célula fotovoltaica)
  const placaX = canvasFE.width * 0.6;
  ctxFE.fillStyle = '#2d3436';
  ctxFE.fillRect(placaX, 50, 30, canvasFE.height - 100);
  ctxFE.fillStyle = '#636e72';
  ctxFE.fillRect(placaX + 5, 55, 20, canvasFE.height - 110);

  // Junção P-N
  ctxFE.strokeStyle = '#55efc4';
  ctxFE.lineWidth = 2;
  ctxFE.setLineDash([5, 5]);
  ctxFE.beginPath();
  ctxFE.moveTo(placaX + 15, 50);
  ctxFE.lineTo(placaX + 15, canvasFE.height - 50);
  ctxFE.stroke();
  ctxFE.setLineDash([]);

  ctxFE.fillStyle = 'white';
  ctxFE.font = 'bold 12px Poppins';
  ctxFE.fillText('SILÍCIO', placaX - 5, 35);
  ctxFE.fillText('P', placaX - 20, canvasFE.height / 2);
  ctxFE.fillText('N', placaX + 40, canvasFE.height / 2);

  // Fonte de luz
  const freq = parseFloat(freqInput.value);
  const cor = freqParaCor(freq);
  ctxFE.fillStyle = cor;
  ctxFE.beginPath();
  ctxFE.arc(30, canvasFE.height / 2, 20, 0, Math.PI * 2);
  ctxFE.fill();
  ctxFE.shadowBlur = 30;
  ctxFE.shadowColor = cor;
  ctxFE.fill();
  ctxFE.shadowBlur = 0;

  const intensidade = parseInt(intInput.value);
  if (Math.random() < intensidade / 10) {
    fotons.push(criarFoton());
  }

  const funcaoTrabalho = parseFloat(materialInput.value);
  fotons.forEach(f => {
    if (!f.vivo) return;
    f.x += f.vx;

    ctxFE.fillStyle = f.cor;
    ctxFE.beginPath();
    ctxFE.arc(f.x, f.y, 5, 0, Math.PI * 2);
    ctxFE.fill();
    ctxFE.shadowBlur = 15;
    ctxFE.shadowColor = f.cor;
    ctxFE.fill();
    ctxFE.shadowBlur = 0;

    if (f.x >= placaX) {
      f.vivo = false;
      const E_foton_ev = CONSTANTES.PLANCK_EV * f.freq * 1e14;
      if (E_foton_ev > funcaoTrabalho) {
        const E_cin = E_foton_ev - funcaoTrabalho;
        eletrons.push(criarEletron(placaX + 35, f.y, E_cin));
      }
    }
  });

  eletrons.forEach(e => {
    if (!e.vivo) return;
    e.x += e.vx;
    e.y += e.vy;
    e.vida--;
    if (e.vida <= 0 || e.x > canvasFE.width || e.y < 0 || e.y > canvasFE.height) {
      e.vivo = false;
      return;
    }
    ctxFE.fillStyle = `rgba(85, 239, 196, ${e.vida / 60})`;
    ctxFE.beginPath();
    ctxFE.arc(e.x, e.y, 4, 0, Math.PI * 2);
    ctxFE.fill();
    ctxFE.fillStyle = 'white';
    ctxFE.font = 'bold 10px Poppins';
    ctxFE.fillText('e⁻', e.x - 5, e.y - 8);
  });

  fotons = fotons.filter(f => f.vivo);
  eletrons = eletrons.filter(e => e.vivo);

  const E_foton = CONSTANTES.PLANCK_EV * freq * 1e14;
  if (E_foton > funcaoTrabalho) {
    statusFE.textContent = '⚡ Elétrons ejetados!';
    statusFE.style.color = '#55efc4';
  } else {
    statusFE.textContent = '❌ Energia insuficiente';
    statusFE.style.color = '#ff7675';
  }

  requestAnimationFrame(atualizarFotoeletrico);
}

freqInput.addEventListener('input', () => {
  freqValor.textContent = parseFloat(freqInput.value).toFixed(1) + ' × 10¹⁴ Hz';
  atualizarResultadoFE();
});
intInput.addEventListener('input', () => {
  intValor.textContent = intInput.value + ' fótons/s';
});
materialInput.addEventListener('change', atualizarResultadoFE);

function atualizarResultadoFE() {
  const freq = parseFloat(freqInput.value);
  const E_foton = CONSTANTES.PLANCK_EV * freq * 1e14;
  const phi = parseFloat(materialInput.value);
  const lambda = (CONSTANTES.LUZ / (freq * 1e14) * 1e9).toFixed(0);

  let html = `<strong>Energia do fóton:</strong> ${E_foton.toFixed(2)} eV | `;
  html += `<strong>Função trabalho:</strong> ${phi.toFixed(2)} eV | `;
  html += `<strong>λ:</strong> ${lambda} nm<br>`;

  if (E_foton > phi) {
    const E_cin = (E_foton - phi).toFixed(2);
    html += `✅ <strong>Efeito fotoelétrico OCORRE!</strong> E<sub>cinética</sub> = ${E_cin} eV`;
  } else {
    html += `❌ <strong>Efeito fotoelétrico NÃO ocorre.</strong> Energia insuficiente.`;
  }
  resultadoFE.innerHTML = html;
}

atualizarResultadoFE();
atualizarFotoeletrico();

// ==========================================
// 7. SIMULADOR: PRODUÇÃO FOTOVOLTAICA AO LONGO DO DIA
// ==========================================

const canvasProd = document.getElementById('canvasProducao');
const ctxProd = canvasProd.getContext('2d');
const potInput = document.getElementById('potenciaPlaca');
const nubladoInput = document.getElementById('nublado');
const horaInput = document.getElementById('hora');
const potValor = document.getElementById('potValor');
const horaValor = document.getElementById('horaValor');
const statusProd = document.getElementById('statusProducao');
const resultadoProd = document.getElementById('resultadoProducao');

redimensionarCanvas(canvasProd);
window.addEventListener('resize', () => redimensionarCanvas(canvasProd));

function curvaSolar(hora) {
  // Curva em forma de sino entre 6h e 18h
  if (hora < 6 || hora > 18) return 0;
  const pico = 12;
  const desvio = 2.5;
  return Math.exp(-Math.pow(hora - pico, 2) / (2 * desvio * desvio));
}

function desenharProducao() {
  const potencia = parseFloat(potInput.value);
  const fatorNublado = parseFloat(nubladoInput.value);
  const horaAtual = parseFloat(horaInput.value);

  const W = canvasProd.width;
  const H = canvasProd.height;

  ctxProd.clearRect(0, 0, W, H);

  const grad = ctxProd.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#0a3d62');
  grad.addColorStop(1, '#0652a8');
  ctxProd.fillStyle = grad;
  ctxProd.fillRect(0, 0, W, H);

  // Eixos
  ctxProd.strokeStyle = 'rgba(255,255,255,0.4)';
  ctxProd.lineWidth = 2;
  ctxProd.beginPath();
  ctxProd.moveTo(60, H - 50);
  ctxProd.lineTo(W - 20, H - 50);
  ctxProd.moveTo(60, H - 50);
  ctxProd.lineTo(60, 30);
  ctxProd.stroke();

  ctxProd.fillStyle = 'white';
  ctxProd.font = 'bold 12px Poppins';
  ctxProd.fillText('Potência (W)', 10, 20);
  ctxProd.fillText('Hora do dia', W - 100, H - 30);

  // Desenhar curva de produção
  const pontos = [];
  let maxP = 0;
  for (let h = 6; h <= 18; h += 0.5) {
    const p = potencia * curvaSolar(h) * fatorNublado;
    pontos.push({ h, p });
    if (p > maxP) maxP = p;
  }

  // Preenchimento
  ctxProd.beginPath();
  pontos.forEach((pt, i) => {
    const x = 60 + (W - 80) * ((pt.h - 6) / 12);
    const y = (H - 50) - (H - 80) * (pt.p / (maxP || 1));
    if (i === 0) ctxProd.moveTo(x, y);
    else ctxProd.lineTo(x, y);
  });
  ctxProd.strokeStyle = '#fdcb6e';
  ctxProd.lineWidth = 3;
  ctxProd.stroke();

  ctxProd.lineTo(60 + (W - 80), H - 50);
  ctxProd.lineTo(60, H - 50);
  ctxProd.closePath();
  const gradCurva = ctxProd.createLinearGradient(0, 30, 0, H - 50);
  gradCurva.addColorStop(0, 'rgba(253, 203, 110, 0.6)');
  gradCurva.addColorStop(1, 'rgba(253, 203, 110, 0.05)');
  ctxProd.fillStyle = gradCurva;
  ctxProd.fill();

  // Marcadores de hora
  ctxProd.fillStyle = 'white';
  ctxProd.font = '10px Poppins';
  for (let h = 6; h <= 18; h += 2) {
    const x = 60 + (W - 80) * ((h - 6) / 12);
    ctxProd.fillText(h + 'h', x - 8, H - 30);
  }

  // Linha da hora atual
  const xAtual = 60 + (W - 80) * ((horaAtual - 6) / 12);
  const pAtual = potencia * curvaSolar(horaAtual) * fatorNublado;
  const yAtual = (H - 50) - (H - 80) * (pAtual / (maxP || 1));

  ctxProd.strokeStyle = '#ff7675';
  ctxProd.setLineDash([5, 5]);
  ctxProd.beginPath();
  ctxProd.moveTo(xAtual, H - 50);
  ctxProd.lineTo(xAtual, yAtual);
  ctxProd.stroke();
  ctxProd.setLineDash([]);

  ctxProd.fillStyle = '#ff7675';
  ctxProd.beginPath();
  ctxProd.arc(xAtual, yAtual, 7, 0, Math.PI * 2);
  ctxProd.fill();

  ctxProd.fillStyle = 'white';
  ctxProd.font = 'bold 12px Poppins';
  ctxProd.fillText(`${horaAtual.toFixed(1)}h → ${pAtual.toFixed(0)} W`, xAtual + 10, yAtual - 10);

  statusProd.textContent = `☀️ ${potencia} W | ${fatorNublado * 100}% de irradiância`;
  statusProd.style.color = '#fdcb6e';

  // Energia total do dia (integração simples)
  let energiaDia = 0;
  for (let h = 6; h <= 18; h += 0.5) {
    energiaDia += potencia * curvaSolar(h) * fatorNublado * 0.5; // 0.5h em kWh
  }
  energiaDia /= 1000;

  resultadoProd.innerHTML = `
    <strong>Potência agora:</strong> ${pAtual.toFixed(0)} W |
    <strong>Energia total do dia:</strong> ${energiaDia.toFixed(2)} kWh<br>
    ${horaAtual >= 10 && horaAtual <= 14 ? '🌞 Horário de pico solar — máxima produção!' : ''}
    ${fatorNublado < 0.5 ? '☁️ Produção reduzida pelas nuvens.' : ''}
  `;
}

potInput.addEventListener('input', () => {
  potValor.textContent = potInput.value + ' W';
  desenharProducao();
});
nubladoInput.addEventListener('change', desenharProducao);
horaInput.addEventListener('input', () => {
  const h = parseFloat(horaInput.value);
  horaValor.textContent = (h < 10 ? '0' : '') + Math.floor(h) + ':' + (h % 1 === 0 ? '00' : '30');
  desenharProducao();
});

desenharProducao();

// ==========================================
// 8. CALCULADORA FOTOVOLTAICA
// ==========================================

const formCalc = document.getElementById('formCalculadora');
formCalc.addEventListener('submit', (e) => {
  e.preventDefault();

  const V = parseFloat(document.getElementById('volume').value);
  const Ti = parseFloat(document.getElementById('tempInicial').value);
  const Tf = parseFloat(document.getElementById('tempFinal').value);
  const irr = parseFloat(document.getElementById('irradiacao').value);
  const potPlaca = parseFloat(document.getElementById('potenciaPlacaCalc').value);

  const massa = V * 1; // kg
  const deltaT = Tf - Ti;
  const Q = massa * CONSTANTES.CALOR_ESP_AGUA * deltaT;
  const Q_kWh = Q / 3.6e6;

  // Energia diária com perdas (20%)
  const Q_diario = Q_kWh * 1.2;

  // Produção por placa por dia (5h de sol pleno equivalente)
  const prodPlaca = (potPlaca / 1000) * 5; // kWh/dia

  // Número de placas
  const numPlacas = Math.ceil(Q_diario / prodPlaca);

  // Área estimada (cada placa ~1,7 m²)
  const areaTotal = numPlacas * 1.7;

  // Economia mensal
  const economia = Q_diario * 30 * 0.80;

  document.getElementById('energiaNecessaria').textContent = Q_kWh.toFixed(1) + ' kWh';
  document.getElementById('energiaDiaria').textContent = Q_diario.toFixed(1) + ' kWh';
  document.getElementById('producaoPlaca').textContent = prodPlaca.toFixed(2) + ' kWh/dia';
  document.getElementById('placasFV').textContent = numPlacas + ' placas';
  document.getElementById('areaTotal').textContent = areaTotal.toFixed(1) + ' m²';
  document.getElementById('economia').textContent = 'R$ ' + economia.toFixed(2);

  const resDiv = document.getElementById('resultadoCalculadora');
  resDiv.hidden = false;
  resDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// ==========================================
// 9. PREFERÊNCIAS DO USUÁRIO
// ==========================================

function salvarPreferencias() {
  localStorage.setItem('pic_fonte', estado.fonteAtual);
  localStorage.setItem('pic_contraste', estado.altoContraste);
  localStorage.setItem('pic_dislexia', estado.dislexia);
}

function carregarPreferencias() {
  const f = localStorage.getItem('pic_fonte');
  const c = localStorage.getItem('pic_contraste');
  const d = localStorage.getItem('pic_dislexia');
  if (f) {
    estado.fonteAtual = parseInt(f);
    document.documentElement.style.fontSize = estado.fonteAtual + 'px';
  }
  if (c === 'true') {
    document.body.classList.add('alto-contraste');
    estado.altoContraste = true;
  }
  if (d === 'true') {
    document.body.classList.add('dislexia');
    estado.dislexia = true;
  }
}

window.addEventListener('beforeunload', salvarPreferencias);
carregarPreferencias();

// ==========================================
// 10. ANIMAÇÕES E INTERAÇÕES
// ==========================================

window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (hero) {
    const scroll = window.scrollY;
    hero.style.backgroundPositionY = scroll * 0.3 + 'px';
  }
});

document.querySelectorAll('.card, .fisica-card').forEach(card => {
  card.setAttribute('tabindex', '0');
});

console.log('%c☀️⚡ Projeto Integrador CEP - Fotovoltaico', 'font-size: 24px; color: #0a3d62; font-weight: bold;');
console.log('%cDesenvolvido por Natalia, Nicoli, Melissa e Rafaela 💙💚', 'font-size: 14px; color: #006266;');
