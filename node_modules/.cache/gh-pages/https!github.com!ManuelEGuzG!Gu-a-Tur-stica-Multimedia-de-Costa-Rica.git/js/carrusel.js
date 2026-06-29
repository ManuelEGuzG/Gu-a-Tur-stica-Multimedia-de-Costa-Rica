/* ═══════════════════════════════════════════════════════════════
   carrusel.js — Galería fotográfica de Costa Rica
   Guía Turística Multimedia de Costa Rica
   IF7102 Multimedios | I Ciclo 2026 | UCR Sede Guanacaste
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════════════════════════
   REFERENCIAS AL DOM
══════════════════════════════════════════════════════════════ */
const track       = document.getElementById('carruselTrack');
const wrapper     = track?.parentElement;
const btnPrev     = document.getElementById('carruselPrev');
const btnNext     = document.getElementById('carruselNext');
const indicadores = document.getElementById('carruselIndicadores');
const items       = track ? Array.from(track.querySelectorAll('.carrusel__item')) : [];

if (!track || items.length === 0) {
  // Si no hay elementos, no inicializar
  console.info('[carrusel.js] No se encontraron items del carrusel.');
} else {
  iniciarCarrusel();
}

function iniciarCarrusel() {

  /* ══════════════════════════════════════════════════════════════
     ESTADO
  ══════════════════════════════════════════════════════════════ */
  let indiceActual  = 0;
  let itemsVisibles = calcularVisibles();
  let maxIndice     = items.length - itemsVisibles;

  /* ══════════════════════════════════════════════════════════════
     CALCULAR CUÁNTOS ITEMS CABEN EN PANTALLA
  ══════════════════════════════════════════════════════════════ */
  function calcularVisibles() {
    const ancho = window.innerWidth;
    if (ancho <= 560) return 1;
    if (ancho <= 900) return 2;
    return 3;
  }

  /* ══════════════════════════════════════════════════════════════
     MOVER EL TRACK
  ══════════════════════════════════════════════════════════════ */
  function moverA(indice) {
    // Clampear índice
    indiceActual = Math.max(0, Math.min(indice, maxIndice));

    const item        = items[0];
    const anchoItem   = item.getBoundingClientRect().width;
    const gap         = 16; // 1rem en px
    const desplazamiento = indiceActual * (anchoItem + gap);

    track.style.transform = `translateX(-${desplazamiento}px)`;

    actualizarBotones();
    actualizarIndicadores();
  }

  /* ══════════════════════════════════════════════════════════════
     BOTONES PREV / NEXT
  ══════════════════════════════════════════════════════════════ */
  function actualizarBotones() {
    if (btnPrev) btnPrev.disabled = indiceActual === 0;
    if (btnNext) btnNext.disabled = indiceActual >= maxIndice;
  }

  btnPrev?.addEventListener('click', () => moverA(indiceActual - 1));
  btnNext?.addEventListener('click', () => moverA(indiceActual + 1));

  /* ══════════════════════════════════════════════════════════════
     INDICADORES (puntos)
  ══════════════════════════════════════════════════════════════ */
  function generarIndicadores() {
    if (!indicadores) return;
    indicadores.innerHTML = '';
    const total = maxIndice + 1;

    for (let i = 0; i < total; i++) {
      const punto = document.createElement('button');
      punto.className   = 'carrusel__punto' + (i === 0 ? ' activo' : '');
      punto.setAttribute('aria-label', `Ir a foto ${i + 1}`);
      punto.addEventListener('click', () => moverA(i));
      indicadores.appendChild(punto);
    }
  }

  function actualizarIndicadores() {
    const puntos = indicadores?.querySelectorAll('.carrusel__punto');
    puntos?.forEach((p, i) => {
      p.classList.toggle('activo', i === indiceActual);
    });
  }

  /* ══════════════════════════════════════════════════════════════
     DRAG / SWIPE con el mouse
  ══════════════════════════════════════════════════════════════ */
  let arrastrando    = false;
  let inicioX        = 0;
  let desplazamientoX = 0;

  wrapper?.addEventListener('mousedown', (e) => {
    arrastrando = true;
    inicioX     = e.clientX;
    track.style.transition = 'none';
  });

  window.addEventListener('mousemove', (e) => {
    if (!arrastrando) return;
    desplazamientoX = e.clientX - inicioX;
  });

  window.addEventListener('mouseup', () => {
    if (!arrastrando) return;
    arrastrando = false;
    track.style.transition = '';

    const umbral = 60; // px mínimos para cambiar
    if (desplazamientoX < -umbral) {
      moverA(indiceActual + 1);
    } else if (desplazamientoX > umbral) {
      moverA(indiceActual - 1);
    } else {
      moverA(indiceActual); // volver al lugar
    }
    desplazamientoX = 0;
  });

  /* ══════════════════════════════════════════════════════════════
     TOUCH / SWIPE en móvil
  ══════════════════════════════════════════════════════════════ */
  let touchInicioX = 0;

  wrapper?.addEventListener('touchstart', (e) => {
    touchInicioX = e.touches[0].clientX;
  }, { passive: true });

  wrapper?.addEventListener('touchend', (e) => {
    const diff = touchInicioX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      moverA(indiceActual + (diff > 0 ? 1 : -1));
    }
  }, { passive: true });

  /* ══════════════════════════════════════════════════════════════
     TECLADO
  ══════════════════════════════════════════════════════════════ */
  document.addEventListener('keydown', (e) => {
    const secCarrusel = document.getElementById('carrusel');
    if (!secCarrusel) return;
    const rect = secCarrusel.getBoundingClientRect();
    const enVista = rect.top < window.innerHeight && rect.bottom > 0;
    if (!enVista) return;

    if (e.key === 'ArrowRight') moverA(indiceActual + 1);
    if (e.key === 'ArrowLeft')  moverA(indiceActual - 1);
  });

  /* ══════════════════════════════════════════════════════════════
     RESIZE — recalcular visibles
  ══════════════════════════════════════════════════════════════ */
  window.addEventListener('resize', () => {
    const nuevosVisibles = calcularVisibles();
    if (nuevosVisibles !== itemsVisibles) {
      itemsVisibles = nuevosVisibles;
      maxIndice     = items.length - itemsVisibles;
      indiceActual  = Math.min(indiceActual, maxIndice);
      generarIndicadores();
      moverA(indiceActual);
    }
  });

  /* ══════════════════════════════════════════════════════════════
     INICIALIZACIÓN
  ══════════════════════════════════════════════════════════════ */
  generarIndicadores();
  moverA(0);
}