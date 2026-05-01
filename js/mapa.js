/* ═══════════════════════════════════════════════════════════════
   mapa.js — Lógica del mapa interactivo de regiones
   Guía Turística Multimedia de Costa Rica
   IF7102 Multimedios | I Ciclo 2026 | UCR Sede Guanacaste
   ═══════════════════════════════════════════════════════════════ */

'use strict';

const REGIONES = {
  'guanacaste': {
    etiqueta:    'Pacífico Norte',
    nombre:      'Guanacaste',
    color:       '#445a14',
    descripcion: 'Tierra de playas doradas, volcanes activos y bosque seco tropical. Hogar del Parque Nacional Rincón de la Vieja, Tamarindo y las tortugas baulas del Pacífico.',
    provincias:  ['Guanacaste'],
  },
  'puntarenas': {
    etiqueta:    'Pacífico Central',
    nombre:      'Puntarenas',
    color:       '#3b5110',
    descripcion: 'Desde Manuel Antonio hasta la Península de Osa, esta región concentra la mayor biodiversidad del planeta. Ballenas jorobadas, delfines y selva húmeda virgen.',
    provincias:  ['Puntarenas'],
  },
  'limon': {
    etiqueta:    'Huetar Atlántica',
    nombre:      'Limón',
    color:       '#b7cd7f',
    descripcion: 'El Caribe costarricense: canales fluviales, arrecifes de coral en Cahuita, cultura afrocaribeña vibrante y el sabor único del pati y el rice and beans.',
    provincias:  ['Limón'],
  },
  'central-sur': {
    etiqueta:    'Central Sur',
    nombre:      'San José & Cartago',
    color:       '#96ac60',
    descripcion: 'El corazón cultural e histórico del país. Valle de Orosi, volcán Irazú, la Basílica de los Ángeles y la vida urbana más vibrante de Costa Rica.',
    provincias:  ['San José', 'Cartago'],
  },
  'huetar-norte': {
    etiqueta:    'Huetar Norte',
    nombre:      'Heredia & Alajuela',
    color:       '#778c43',
    descripcion: 'Volcán Poás, La Fortuna con el Arenal, la Laguna de Arenal y los mejores cafetales del país. Aventura geotérmica y naturaleza exuberante en cada rincón.',
    provincias:  ['Heredia', 'Alajuela'],
  },
};

const provincias      = document.querySelectorAll('.provincia:not(.agua)');
const tooltip         = document.getElementById('mapaTooltip');
const tooltipNombre   = document.getElementById('tooltipNombre');
const tooltipRegion   = document.getElementById('tooltipRegion');
const panelEl         = document.getElementById('mapaPanel');
const panelInicial    = document.getElementById('panelInicial');
const panelInfo       = document.getElementById('panelInfo');
const panelBarra      = document.getElementById('panelBarra');
const panelEtiqueta   = document.getElementById('panelEtiqueta');
const panelNombre     = document.getElementById('panelNombre');
const panelProvincias = document.getElementById('panelProvincias');
const panelBtn        = document.getElementById('panelBtnExplorar');
const mapaContenedor  = document.getElementById('mapaContenedor');

let panelDescEl = document.getElementById('panelDesc');
if (!panelDescEl && panelInfo) {
  panelDescEl = document.createElement('p');
  panelDescEl.id = 'panelDesc';
  panelDescEl.className = 'mapa-panel__descripcion';
  const divisor = panelInfo.querySelector('.mapa-panel__divisor');
  if (divisor) divisor.insertAdjacentElement('afterend', panelDescEl);
  else panelInfo.appendChild(panelDescEl);
}

let regionActiva = null;

function mostrarPanel(regionId) {
  const datos = REGIONES[regionId];
  if (!datos) return;
  if (panelBarra) panelBarra.style.background = datos.color;
  if (panelEtiqueta) {
    panelEtiqueta.textContent = datos.etiqueta;
    panelEtiqueta.style.color = datos.color;
    panelEtiqueta.style.background = datos.color + '18';
    panelEtiqueta.style.border = `1px solid ${datos.color}40`;
  }
  if (panelNombre) panelNombre.textContent = datos.nombre;
  const divisorEl = panelInfo?.querySelector('.mapa-panel__divisor');
  if (divisorEl) divisorEl.style.background = datos.color;
  if (panelDescEl) panelDescEl.textContent = datos.descripcion;
  if (panelProvincias) {
    panelProvincias.innerHTML = datos.provincias.map(p => `<li>${p}</li>`).join('');
  }
  if (panelBtn) panelBtn.dataset.region = regionId;
  panelEl?.classList.add('tiene-region');
  panelInicial.style.display = 'none';
  panelInfo.setAttribute('aria-hidden', 'false');
  void panelInfo.offsetWidth;
  panelInfo.classList.add('visible');
}

function ocultarPanel() {
  panelInfo.classList.remove('visible');
  panelEl?.classList.remove('tiene-region');
  setTimeout(() => {
    panelInfo.setAttribute('aria-hidden', 'true');
    panelInicial.style.display = '';
  }, 300);
}

function activarRegion(regionId) {
  provincias.forEach(el => {
    el.classList.remove('region-activa', 'inactiva');
    if (el.dataset.region === regionId) el.classList.add('region-activa');
    else el.classList.add('inactiva');
  });
}

function desactivarTodas() {
  provincias.forEach(el => el.classList.remove('region-activa', 'inactiva'));
}

function mostrarTooltip(e, regionId, nombreProv) {
  const datos = REGIONES[regionId];
  if (!datos) return;
  tooltipNombre.textContent = nombreProv;
  tooltipRegion.textContent = datos.etiqueta;
  tooltip.classList.add('visible');
  moverTooltip(e);
}

function moverTooltip(e) {
  const rect = mapaContenedor.getBoundingClientRect();
  const x = e.clientX - rect.left + 16;
  const y = e.clientY - rect.top  - 16;
  const maxX = rect.width  - (tooltip.offsetWidth  || 170) - 8;
  const maxY = rect.height - (tooltip.offsetHeight || 56)  - 8;
  tooltip.style.left = `${Math.min(x, maxX)}px`;
  tooltip.style.top  = `${Math.max(4, Math.min(y, maxY))}px`;
}

function ocultarTooltip() {
  tooltip.classList.remove('visible');
}

provincias.forEach(prov => {
  const regionId   = prov.dataset.region;
  const ariaParts  = (prov.getAttribute('aria-label') || '').split(' - ');
  const nombreProv = ariaParts[0] || regionId;

  prov.addEventListener('click', () => {
    if (regionActiva === regionId) {
      regionActiva = null;
      desactivarTodas();
      ocultarPanel();
    } else {
      regionActiva = regionId;
      activarRegion(regionId);
      mostrarPanel(regionId);
    }
    ocultarTooltip();
  });

  prov.addEventListener('mouseenter', (e) => mostrarTooltip(e, regionId, nombreProv));
  prov.addEventListener('mousemove',  (e) => moverTooltip(e));
  prov.addEventListener('mouseleave', ()  => ocultarTooltip());

  prov.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); prov.click(); }
  });
});

/* Botón "Ver destinos" — dispara evento que destinos.js escucha */
if (panelBtn) {
  panelBtn.addEventListener('click', () => {
    if (!regionActiva) return;
    const datos = REGIONES[regionActiva];
    if (!datos) return;
    document.dispatchEvent(new CustomEvent('verDestinos', {
      detail: { region: datos.etiqueta }
    }));
  });
}

/* Botón "Explorar Mapa" navbar */
const btnNavMapa = document.getElementById('btnMapa');
if (btnNavMapa) {
  btnNavMapa.addEventListener('click', () => {
    document.getElementById('mapa-seccion')?.scrollIntoView({ behavior: 'smooth' });
  });
}