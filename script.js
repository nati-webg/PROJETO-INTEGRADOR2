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
  DENSIDADE_AGUA: 1,          // kg/L
  WIEN: 2.898e-3              // m·K
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

// Aumentar fonte
document.getElementById('btnAumentarFonte').addEventListener('click', () => {
  if (estado.fonteAtual < 24) {
    estado.fonteAtual += 2;
    document.documentElement.style.fontSize = estado.fonteAtual + 'px';
    announce('Fonte aumentada para ' + estado.fonteAtual + ' pixels');
  }
});

// Diminuir fonte
document.getElementById('btnDiminuirFonte').addEventListener('click', () => {
  if (estado.fonteAtual > 12) {
    estado.fonteAtual -= 2;
    document.documentElement.style.fontSize = estado.fonteAtual + 'px';
    announce('Fonte diminuída para ' + estado.fonteAtual + ' pixels');
  }
});

// Alto contraste
document.getElementById('btnAltoContraste').addEventListener('click', () => {
  document.body.classList.toggle('alto-contraste');
  estado.altoContraste = !estado.altoContraste;
  announce(estado.altoContraste ? 'Alto contraste ativado' : 'Alto contraste desativado');
});

// Fonte para dislexia
document.getElementById('btnDislexia').addEventListener('click', () => {
  document.body.classList.toggle('dislexia');
  estado.dislexia = !estado.dislexia;
  announce(estado.dislexia ? 'Fonte para dislexia ativada' : 'Fonte padrão ativada');
});

// Leitor de texto
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

// Fechar menu ao clicar em link
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
  // ESC fecha menu mobile
  if (e.key === 'Escape' && navMenu.classList.contains('active')) {
    navMenu.classList.remove('active');
    menuToggle.focus();
  }
});

// Atualizar link ativo conforme scroll
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

// Converte frequência (×10¹⁴ Hz) em cor visível
function freqParaCor(f14) {
  // f em Hz = f14 × 10¹⁴
  const f = f14 * 1e14;
  const lambda = CONSTANTES.LUZ / f * 1e9; // nm
  if (lambda > 700) return '#ff0000';
  if (lambda > 620) return '#ff4500';
  if (lambda > 590) return '#ffa500';
  if (lambda > 570) return '#ffff00';
  if (lambda > 495) return '#00ff00';
  if (lambda > 450) return '#0000ff';
  if (lambda > 380) return '#8a2be2';
  return '#9400d3'; // UV
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
    x: x,
    y: y,
    vx: Math.cos(ang) * vel,
    vy: Math.sin(ang) * vel,
    vida: 60,
    vivo: true
  };
}

function atualizarFotoeletrico() {
  ctxFE.clearRect(0, 0, canvasFE.width, canvasFE.height);

  // Fundo - placa de metal
  const grad = ctxFE.createLinearGradient(0, 0, canvasFE.width, canvasFE.height);
  grad.addColorStop(0, '#0c2461');
  grad.addColorStop(1, '#1e3799');
  ctxFE.fillStyle = grad;
  ctxFE.fillRect(0, 0, canvasFE.width, canvasFE.height);

  // Placa metálica (alvo)
  const placaX = canvasFE.width * 0.6;
  ctxFE.fillStyle = '#636e72';
  ctxFE.fillRect(placaX, 50, 30, canvasFE.height - 100);
  ctxFE.fillStyle = '#b2bec3';
  ctxFE.fillRect(placaX + 5, 55, 20, canvasFE.height - 110);

  // Label
  ctxFE.fillStyle = 'white';
  ctxFE.font = 'bold 14px Poppins';
  ctxFE.fillText('METAL', placaX - 5, 35);

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

  // Adicionar novos fótons
  const intensidade = parseInt(intInput.value);
  if (Math.random() < intensidade / 10) {
    fotons.push(criarFoton());
  }

  // Atualizar fótons
  const funcaoTrabalho = parseFloat(materialInput.value);
  fotons.forEach(f => {
    if (!f.vivo) return;
    f.x += f.vx;

    // Desenhar fóton
    ctxFE.fillStyle = f.cor;
    ctxFE.beginPath();
    ctxFE.arc(f.x, f.y, 5, 0, Math.PI * 2);
    ctxFE.fill();
    ctxFE.shadowBlur = 15;
    ctxFE.shadowColor = f.cor;
    ctxFE.fill();
    ctxFE.shadowBlur = 0;

    // Colisão com placa
    if (f.x >= placaX) {
      f.vivo = false;
      // Calcular energia
      const E_foton_ev = CONSTANTES.PLANCK_EV * f.freq * 1e14;
      if (E_foton_ev > funcaoTrabalho) {
        const E_cin = E_foton_ev - funcaoTrabalho;
        eletrons.push(criarEletron(placaX + 35, f.y, E_cin));
      }
    }
  });

  // Atualizar elétrons
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

  // Limpar arrays
  fotons = fotons.filter(f => f.vivo);
  eletrons = eletrons.filter(e => e.vivo);

  // Atualizar status
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

// Atualizar valores mostrados
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
// 7. SIMULADOR: CORPO NEGRO (CURVA DE PLANCK)
// ==========================================

const canvasCN = document.getElementById('canvasCorpoNegro');
const ctxCN = canvasCN.getContext('2d');
const tempInput = document.getElementById('temperatura');
const tempValor = document.getElementById('tempValor');
const statusCN = document.getElementById('statusCorpoNegro');
const resultadoCN = document.getElementById('resultadoCorpoNegro');

redimensionarCanvas(canvasCN);
window.addEventListener('resize', () => redimensionarCanvas(canvasCN));

function planck(lambda_m, T) {
  const h = CONSTANTES.PLANCK;
  const c = CONSTANTES.LUZ;
  const k = CONSTANTES.BOLTZMANN;
  const num = 2 * h * c * c;
  const den = Math.pow(lambda_m, 5) * (Math.exp((h * c) / (lambda_m * k * T)) - 1);
  return num / den;
}

function desenharCorpoNegro() {
  const T = parseFloat(tempInput.value);
  const W = canvasCN.width;
  const H = canvasCN.height;

  ctxCN.clearRect(0, 0, W, H);

  // Fundo
  const grad = ctxCN.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#0c2461');
  grad.addColorStop(1, '#1e3799');
  ctxCN.fillStyle = grad;
  ctxCN.fillRect(0, 0, W, H);

  // Eixos
  ctxCN.strokeStyle = 'rgba(255,255,255,0.3)';
  ctxCN.lineWidth = 2;
  ctxCN.beginPath();
  ctxCN.moveTo(60, H - 50);
  ctxCN.lineTo(W - 20, H - 50);
  ctxCN.moveTo(60, H - 50);
  ctxCN.lineTo(60, 30);
  ctxCN.stroke();

  // Labels
  ctxCN.fillStyle = 'white';
  ctxCN.font = 'bold 12px Poppins';
  ctxCN.fillText('Intensidade', 10, 20);
  ctxCN.fillText('λ (nm)', W - 60, H - 30);

  // Calcular curva
  const lambdaMin = 100e-9;
  const lambdaMax = 3000e-9;
  const pontos = [];
  let maxI = 0;

  for (let i = 0; i <= 200; i++) {
    const lambda = lambdaMin + (lambdaMax - lambdaMin) * (i / 200);
    const I = planck(lambda, T);
    pontos.push({ lambda, I });
    if (I > maxI) maxI = I;
  }

  // Desenhar curva preenchida
  ctxCN.beginPath();
  pontos.forEach((p, i) => {
    const x = 60 + (W - 80) * (i / 200);
    const y = (H - 50) - (H - 80) * (p.I / maxI);
    if (i === 0) ctxCN.moveTo(x, y);
    else ctxCN.lineTo(x, y);
  });
  ctxCN.strokeStyle = '#fdcb6e';
  ctxCN.lineWidth = 3;
  ctxCN.stroke();

  // Preencher
  ctxCN.lineTo(W - 20, H - 50);
  ctxCN.lineTo(60, H - 50);
  ctxCN.closePath();
  const gradCurva = ctxCN.createLinearGradient(0, 30, 0, H - 50);
  gradCurva.addColorStop(0, 'rgba(253, 203, 110, 0.6)');
  gradCurva.addColorStop(1, 'rgba(253, 203, 110, 0.05)');
  ctxCN.fillStyle = gradCurva;
  ctxCN.fill();

  // Marcar pico (Wien)
  const lambdaPico = CONSTANTES.WIEN / T;
  const idxPico = Math.round(((lambdaPico - lambdaMin) / (lambdaMax - lambdaMin)) * 200);
  if (idxPico >= 0 && idxPico <= 200) {
    const xPico = 60 + (W - 80) * (idxPico / 200);
    const yPico = (H - 50) - (H - 80) * (pontos[idxPico].I / maxI);
    ctxCN.strokeStyle = '#ff7675';
    ctxCN.setLineDash([5, 5]);
    ctxCN.beginPath();
    ctxCN.moveTo(xPico, H - 50);
    ctxCN.lineTo(xPico, yPico);
    ctxCN.stroke();
    ctxCN.setLineDash([]);

    ctxCN.fillStyle = '#ff7675';
    ctxCN.beginPath();
    ctxCN.arc(xPico, yPico, 6, 0, Math.PI * 2);
    ctxCN.fill();

    ctxCN.fillStyle = 'white';
    ctxCN.font = 'bold 12px Poppins';
    ctxCN.fillText(`λ máx = ${(lambdaPico * 1e9).toFixed(0)} nm`, xPico + 10, yPico - 10);
  }

  // Escala de cores do espectro visível
  const visMin = 380e-9;
  const visMax = 700e-9;
  const x1 = 60 + (W - 80) * ((visMin - lambdaMin) / (lambdaMax - lambdaMin));
  const x2 = 60 + (W - 80) * ((visMax - lambdaMin) / (lambdaMax - lambdaMin));
  const gradVis = ctxCN.createLinearGradient(x1, 0, x2, 0);
  gradVis.addColorStop(0, '#8a2be2');
  gradVis.addColorStop(0.2, '#0000ff');
  gradVis.addColorStop(0.4, '#00ff00');
  gradVis.addColorStop(0.6, '#ffff00');
  gradVis.addColorStop(0.8, '#ffa500');
  gradVis.addColorStop(1, '#ff0000');
  ctxCN.fillStyle = gradVis;
  ctxCN.fillRect(x1, H - 40, x2 - x1, 15);
  ctxCN.fillStyle = 'white';
  ctxCN.font = '10px Poppins';
  ctxCN.fillText('UV', x1 - 20, H - 30);
  ctxCN.fillText('IV', x2 + 5, H - 30);
  ctxCN.fillText('Visível', (x1 + x2) / 2 - 25, H - 30);

  // Atualizar status
  const lambdaPicoNm = (lambdaPico * 1e9).toFixed(0);
  let corPico = 'infravermelho';
  if (lambdaPico < 380e-9) corPico = 'ultravioleta';
  else if (lambdaPico < 450e-9) corPico = 'violeta';
  else if (lambdaPico < 495e-9) corPico = 'azul';
  else if (lambdaPico < 570e-9) corPico = 'verde';
  else if (lambdaPico < 590e-9) corPico = 'amarelo';
  else if (lambdaPico < 620e-9) corPico = 'laranja';
  else if (lambdaPico < 700e-9) corPico = 'vermelho';

  statusCN.textContent = `🌡️ ${T} K`;
  statusCN.style.color = '#fdcb6e';

  resultadoCN.innerHTML = `
    <strong>Temperatura:</strong> ${T} K |
    <strong>Pico de emissão:</strong> ${lambdaPicoNm} nm (${corPico})<br>
    ${T >= 5500 && T <= 6200 ? '☀️ Similar ao Sol! Coleta ótima de energia visível.' : ''}
    ${T < 1000 ? '🔥 Similar a um coletor solar aquecido.' : ''}
  `;
}

tempInput.addEventListener('input', () => {
  const T = parseFloat(tempInput.value);
  let label = T + ' K';
  if (T >= 5500 && T <= 6200) label += ' (Sol)';
  else if (T >= 2800 && T <= 3200) label += ' (Lâmpada)';
  else if (T < 500) label += ' (Corpo morno)';
  tempValor.textContent = label;
  desenharCorpoNegro();
});

desenharCorpoNegro();

// ==========================================
// 8. CALCULADORA DE ENERGIA SOLAR
// ==========================================

const formCalc = document.getElementById('formCalculadora');
formCalc.addEventListener('submit', (e) => {
  e.preventDefault();

  const V = parseFloat(document.getElementById('volume').value);
  const Ti = parseFloat(document.getElementById('tempInicial').value);
  const Tf = parseFloat(document.getElementById('tempFinal').value);
  const irr = parseFloat(document.getElementById('irradiacao').value);
  const eff = parseFloat(document.getElementById('eficiencia').value) / 100;

  // Energia para aquecer (J)
  const massa = V * CONSTANTES.DENSIDADE_AGUA;
  const deltaT = Tf - Ti;
  const Q = massa * CONSTANTES.CALOR_ESP_AGUA * deltaT;
  const Q_kWh = Q / 3.6e6;

  // Energia diária necessária considerando perdas (20%)
  const Q_diario = Q_kWh * 1.2;

  // Área de coletores térmicos (m²)
  const area_termica = Q_diario / (irr * eff);

  // Placas fotovoltaicas (350W cada, 5h de sol pleno)
  const energia_por_placa = 0.35 * 5; // kWh/dia
  const num_placas = Math.ceil(Q_diario / energia_por_placa);

  // Economia mensal (R$ 0,80/kWh)
  const economia = Q_diario * 30 * 0.80;

  // Exibir resultados
  document.getElementById('energiaNecessaria').textContent = Q_diario.toFixed(1) + ' kWh/dia';
  document.getElementById('areaColetores').textContent = area_termica.toFixed(1) + ' m²';
  document.getElementById('placasFV').textContent = num_placas + ' placas';
  document.getElementById('economia').textContent = 'R$ ' + economia.toFixed(2);

  const resDiv = document.getElementById('resultadoCalculadora');
  resDiv.hidden = false;
  resDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// ==========================================
// 9. PREFERÊNCIAS DO USUÁRIO (localStorage)
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
// 10. ANIMAÇÕES SUAVES E INTERAÇÕES
// ==========================================

// Efeito parallax no hero
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (hero) {
    const scroll = window.scrollY;
    hero.style.backgroundPositionY = scroll * 0.3 + 'px';
  }
});

// Tooltips em cards
document.querySelectorAll('.card, .fisica-card').forEach(card => {
  card.setAttribute('tabindex', '0');
});

console.log('%c☀️🌊 Projeto Integrador CEP', 'font-size: 24px; color: #0984e3; font-weight: bold;');
console.log('%cDesenvolvido por Natalia, Nicoli, Melissa e Rafaela 💙💚', 'font-size: 14px; color: #00b894;');
