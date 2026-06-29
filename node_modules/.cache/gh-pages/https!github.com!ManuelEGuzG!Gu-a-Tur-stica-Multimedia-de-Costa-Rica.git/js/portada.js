/* ═══════════════════════════════════════════════════════════════
   portada.js — Lógica interactiva de la portada
   Guía Turística Multimedia de Costa Rica
   IF7102 Multimedios | I Ciclo 2026 | UCR Sede Guanacaste
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ── Referencias al DOM ──────────────────────────────────────────
const navbar       = document.getElementById('navbar');
const btnExplorar  = document.getElementById('btnExplorar');
const btnMapa      = document.getElementById('btnMapa');
const secDestinos  = document.getElementById('destinos');
const idiomasBtns  = document.querySelectorAll('.navbar__idioma-btn');
const numerosStats = document.querySelectorAll('.portada__stat-numero');

/* ══════════════════════════════════════════════════════════════
   1. NAVBAR — fondo al hacer scroll
══════════════════════════════════════════════════════════════ */
function actualizarNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.add('con-fondo');
  } else {
    navbar.classList.remove('con-fondo');
  }
}

window.addEventListener('scroll', actualizarNavbar, { passive: true });

/* ══════════════════════════════════════════════════════════════
   2. BOTÓN EXPLORAR — scroll suave hacia destinos
══════════════════════════════════════════════════════════════ */
if (btnExplorar && secDestinos) {
  btnExplorar.addEventListener('click', () => {
    secDestinos.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════════════════════════════
   3. SELECTOR DE IDIOMA — activar botón seleccionado
══════════════════════════════════════════════════════════════ */
idiomasBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    idiomasBtns.forEach(b => {
      b.classList.remove('activo');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('activo');
    btn.setAttribute('aria-pressed', 'true');
  });
});

/* ══════════════════════════════════════════════════════════════
   4. CONTADORES ANIMADOS DE ESTADÍSTICAS
   Anima cada número de 0 → valor final al cargar
══════════════════════════════════════════════════════════════ */
function animarContador(elemento, valorFinal, duracion) {
  // Si no es número (ej: "inf" / "∞"), no animar
  if (isNaN(valorFinal)) return;

  let inicio = null;

  function paso(timestamp) {
    if (!inicio) inicio = timestamp;
    const progreso = Math.min((timestamp - inicio) / duracion, 1);
    // Easing ease-out cúbico
    const suavizado = 1 - Math.pow(1 - progreso, 3);
    elemento.textContent = Math.floor(suavizado * valorFinal);

    if (progreso < 1) {
      requestAnimationFrame(paso);
    } else {
      elemento.textContent = valorFinal;
    }
  }

  requestAnimationFrame(paso);
}

// Disparar contadores cuando la portada sea visible
const observadorPortada = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      numerosStats.forEach(el => {
        const atributo = el.dataset.valor;
        const valor    = parseInt(atributo, 10);
        animarContador(el, valor, 1500);
      });
      observadorPortada.disconnect(); // Solo se ejecuta una vez
    }
  });
}, { threshold: 0.4 });

const portadaSection = document.getElementById('portada');
if (portadaSection) observadorPortada.observe(portadaSection);

/* ══════════════════════════════════════════════════════════════
   5. BOTÓN MAPA — placeholder para vista de mapa
══════════════════════════════════════════════════════════════ */
if (btnMapa) {
  btnMapa.addEventListener('click', () => {
    // TODO: conectar con la vista del mapa interactivo
    console.info('[portada.js] Botón mapa presionado — funcionalidad en desarrollo.');
  });
}