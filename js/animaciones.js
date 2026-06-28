/* ═══════════════════════════════════════════════════════════════
   animaciones.js — Animación de entrada al hacer scroll
   Guía Turística Multimedia de Costa Rica
   IF7102 Multimedios | I Ciclo 2026 | UCR Sede Guanacaste
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* Animación de entrada de .datos-item al hacer scroll */
const datosItems = document.querySelectorAll('.datos-item');
const observadorDatos = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.2 });
datosItems.forEach(item => observadorDatos.observe(item));