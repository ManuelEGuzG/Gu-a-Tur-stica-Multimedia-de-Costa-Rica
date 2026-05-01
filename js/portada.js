/* ═══════════════════════════════════════════════════════════════
   portada.js — Lógica de la portada
   Guía Turística Multimedia de Costa Rica
   IF7102 Multimedios | I Ciclo 2026 | UCR Sede Guanacaste
   ═══════════════════════════════════════════════════════════════ */

'use strict';

const navbar       = document.getElementById('navbar');
const btnExplorar  = document.getElementById('btnExplorar');
const btnMapa      = document.getElementById('btnMapa');
const secDestinos  = document.getElementById('destinos');
const idiomasBtns  = document.querySelectorAll('.navbar__idioma-btn');
const numerosStats = document.querySelectorAll('.portada__stat-numero');

/* ══════════════════════════════════════════════════════════════
   NAVBAR — fondo al hacer scroll
══════════════════════════════════════════════════════════════ */
function actualizarNavbar() {
  if (window.scrollY > 60) navbar.classList.add('con-fondo');
  else navbar.classList.remove('con-fondo');
}
window.addEventListener('scroll', actualizarNavbar, { passive: true });

/* ══════════════════════════════════════════════════════════════
   BOTÓN EXPLORAR → scroll suave a destinos
══════════════════════════════════════════════════════════════ */
if (btnExplorar && secDestinos) {
  btnExplorar.addEventListener('click', () => {
    secDestinos.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════════════════════════════
   SELECTOR DE IDIOMA
══════════════════════════════════════════════════════════════ */
idiomasBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    idiomasBtns.forEach(b => { b.classList.remove('activo'); b.setAttribute('aria-pressed','false'); });
    btn.classList.add('activo');
    btn.setAttribute('aria-pressed','true');
  });
});

/* ══════════════════════════════════════════════════════════════
   CONTADORES ANIMADOS
══════════════════════════════════════════════════════════════ */
function animarContador(elemento, valorFinal, duracion = 1400) {
  if (isNaN(valorFinal)) return;
  let inicio = null;
  function paso(timestamp) {
    if (!inicio) inicio = timestamp;
    const progreso = Math.min((timestamp - inicio) / duracion, 1);
    const eased = 1 - Math.pow(1 - progreso, 3);
    elemento.textContent = Math.floor(eased * valorFinal);
    if (progreso < 1) requestAnimationFrame(paso);
    else elemento.textContent = valorFinal;
  }
  requestAnimationFrame(paso);
}

const observadorPortada = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      numerosStats.forEach(el => {
        const valor = parseInt(el.dataset.valor, 10);
        animarContador(el, valor, 1500);
      });
      observadorPortada.disconnect();
    }
  });
}, { threshold: 0.4 });

const portadaSection = document.getElementById('portada');
if (portadaSection) observadorPortada.observe(portadaSection);

/* ══════════════════════════════════════════════════════════════
   BOTÓN MAPA
══════════════════════════════════════════════════════════════ */
if (btnMapa) {
  btnMapa.addEventListener('click', () => {
    document.getElementById('mapa-seccion')?.scrollIntoView({ behavior: 'smooth' });
  });
}