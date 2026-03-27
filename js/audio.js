/* ═══════════════════════════════════════════════════════════════
   audio.js — Música de fondo
   Guía Turística Multimedia de Costa Rica
   IF7102 Multimedios | I Ciclo 2026 | UCR Sede Guanacaste
   ═══════════════════════════════════════════════════════════════ */

'use strict';

const audio    = document.getElementById('musicaFondo');
const btnAudio = document.getElementById('btnAudio');
const iconoOn  = btnAudio?.querySelector('.audio-icono--on');
const iconoOff = btnAudio?.querySelector('.audio-icono--off');

if (!audio || !btnAudio) {
  console.info('[audio.js] Elementos no encontrados.');
} else {
  let silenciado = false;

  /* ══════════════════════════════════════════════════════════════
     Intentar reproducir al primer click del usuario en la página
     (los navegadores bloquean autoplay sin interacción previa)
  ══════════════════════════════════════════════════════════════ */
  function intentarReproducir() {
    audio.volume = 0.35;  /* volumen suave: 35% */
    audio.play().catch(() => {
      /* Si el navegador bloquea el autoplay, simplemente espera */
    });
    document.removeEventListener('click', intentarReproducir);
    document.removeEventListener('keydown', intentarReproducir);
  }

  /* Arrancar en el primer gesto del usuario */
  document.addEventListener('click', intentarReproducir);
  document.addEventListener('keydown', intentarReproducir);

  /* ══════════════════════════════════════════════════════════════
     Botón silenciar / activar
  ══════════════════════════════════════════════════════════════ */
  function actualizarBoton() {
    if (silenciado) {
      iconoOn.style.display  = 'none';
      iconoOff.style.display = 'block';
      btnAudio.classList.add('silenciado');
      btnAudio.setAttribute('aria-label', 'Activar música de fondo');
      btnAudio.title = 'Activar música';
    } else {
      iconoOn.style.display  = 'block';
      iconoOff.style.display = 'none';
      btnAudio.classList.remove('silenciado');
      btnAudio.setAttribute('aria-label', 'Silenciar música de fondo');
      btnAudio.title = 'Silenciar música';
    }
  }

  btnAudio.addEventListener('click', (e) => {
    e.stopPropagation(); /* evitar que dispare intentarReproducir */
    silenciado = !silenciado;

    if (silenciado) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }

    actualizarBoton();
  });

  /* Estado inicial del botón */
  actualizarBoton();
}