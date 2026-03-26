/* ═══════════════════════════════════════════════════════════════
   mapa.js — Lógica del mapa interactivo de regiones
   Guía Turística Multimedia de Costa Rica
   IF7102 Multimedios | I Ciclo 2026 | UCR Sede Guanacaste
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════════════════════════
   DATOS DE REGIONES
   Cada región tiene: etiqueta, nombre, color, descripcion, provincias[]
══════════════════════════════════════════════════════════════ */
const REGIONES = {
  'guanacaste': {
    etiqueta:    'Pacífico Norte',
    nombre:      'Guanacaste',
    color:       '#445a14',   /* verde más oscuro */
    descripcion: 'Tierra de playas doradas, volcanes activos y bosque seco tropical. Hogar del Parque Nacional Rincón de la Vieja, Tamarindo y las tortugas baulas del Pacífico.',
    provincias:  ['Guanacaste'],
  },
  'puntarenas': {
    etiqueta:    'Pacífico Central',
    nombre:      'Puntarenas',
    color:       '#3b5110',   /* verde bosque */
    descripcion: 'Desde Manuel Antonio hasta la Península de Osa, esta región concentra la mayor biodiversidad del planeta. Ballenas jorobadas, delfines y selva húmeda virgen.',
    provincias:  ['Puntarenas'],
  },
  'limon': {
    etiqueta:    'Huetar Atlántica',
    nombre:      'Limón',
    color:       '#b7cd7f',   /* verde medio claro */
    descripcion: 'El Caribe costarricense: canales fluviales, arrecifes de coral en Cahuita, cultura afrocaribeña vibrante y el sabor único del pati y el rice and beans.',
    provincias:  ['Limón'],
  },
  'central-sur': {
    etiqueta:    'Central Sur',
    nombre:      'San José & Cartago',
    color:       '#96ac60',   /* verde medio */
    descripcion: 'El corazón cultural e histórico del país. Valle de Orosi, volcán Irazú, la Basílica de los Ángeles y la vida urbana más vibrante de Costa Rica.',
    provincias:  ['San José', 'Cartago'],
  },
  'huetar-norte': {
    etiqueta:    'Huetar Norte',
    nombre:      'Heredia & Alajuela',
    color:       '#778c43',   /* verde medio */
    descripcion: 'Volcán Poás, La Fortuna con el Arenal, la Laguna de Arenal y los mejores cafetales del país. Aventura geotérmica y naturaleza exuberante en cada rincón.',
    provincias:  ['Heredia', 'Alajuela'],
  },
};

/* ══════════════════════════════════════════════════════════════
   REFERENCIAS AL DOM
══════════════════════════════════════════════════════════════ */
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
const panelDivisor    = panelInfo?.querySelector('.mapa-panel__divisor');
const panelDesc       = document.getElementById('panelDesc');
const panelProvincias = document.getElementById('panelProvincias');
const panelBtn        = document.getElementById('panelBtnExplorar');
const mapaContenedor  = document.getElementById('mapaContenedor');

// Crear elemento descripcion si no existe
let panelDescEl = document.getElementById('panelDesc');
if (!panelDescEl && panelInfo) {
  panelDescEl = document.createElement('p');
  panelDescEl.id = 'panelDesc';
  panelDescEl.className = 'mapa-panel__descripcion';
  // Insertar después del divisor
  const divisor = panelInfo.querySelector('.mapa-panel__divisor');
  if (divisor) {
    divisor.insertAdjacentElement('afterend', panelDescEl);
  } else {
    panelInfo.appendChild(panelDescEl);
  }
}

let regionActiva = null;

/* ══════════════════════════════════════════════════════════════
   FUNCIONES DEL PANEL
══════════════════════════════════════════════════════════════ */
function mostrarPanel(regionId) {
  const datos = REGIONES[regionId];
  if (!datos) return;

  // Barra de color
  if (panelBarra) panelBarra.style.background = datos.color;

  // Etiqueta coloreada
  if (panelEtiqueta) {
    panelEtiqueta.textContent = datos.etiqueta;
    panelEtiqueta.style.color = datos.color;
    panelEtiqueta.style.background = datos.color + '18';
    panelEtiqueta.style.border = `1px solid ${datos.color}40`;
  }

  // Nombre
  if (panelNombre) panelNombre.textContent = datos.nombre;

  // Divisor del color de la región
  const divisorEl = panelInfo?.querySelector('.mapa-panel__divisor');
  if (divisorEl) divisorEl.style.background = datos.color;

  // Descripción
  if (panelDescEl) panelDescEl.textContent = datos.descripcion;

  // Provincias
  if (panelProvincias) {
    panelProvincias.innerHTML = datos.provincias
      .map(p => `<li style="--c:${datos.color}">${p}</li>`)
      .join('');
    panelProvincias.querySelectorAll('li').forEach(li => {
      li.style.setProperty('color', 'rgba(255,255,255,0.85)');
    });
    // Colorear los bullets via inline style en el pseudo-elemento (workaround)
    panelProvincias.querySelectorAll('li').forEach(li => {
      li.setAttribute('data-color', datos.color);
    });
  }

  // Botón
  if (panelBtn) panelBtn.dataset.region = regionId;

  // Mostrar panel
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

/* ══════════════════════════════════════════════════════════════
   FUNCIONES DEL MAPA
══════════════════════════════════════════════════════════════ */
function activarRegion(regionId) {
  provincias.forEach(el => {
    el.classList.remove('region-activa', 'inactiva');
    if (el.dataset.region === regionId) {
      el.classList.add('region-activa');
    } else {
      el.classList.add('inactiva');
    }
  });
}

function desactivarTodas() {
  provincias.forEach(el => el.classList.remove('region-activa', 'inactiva'));
}

/* ══════════════════════════════════════════════════════════════
   TOOLTIP
══════════════════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════════════════
   EVENTOS DE CADA PROVINCIA
══════════════════════════════════════════════════════════════ */
provincias.forEach(prov => {
  const regionId   = prov.dataset.region;
  // Nombre de la provincia desde aria-label
  const ariaParts  = (prov.getAttribute('aria-label') || '').split(' - ');
  const nombreProv = ariaParts[0] || regionId;

  // Clic: seleccionar / deseleccionar región
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

  // Hover
  prov.addEventListener('mouseenter', (e) => mostrarTooltip(e, regionId, nombreProv));
  prov.addEventListener('mousemove',  (e) => moverTooltip(e));
  prov.addEventListener('mouseleave', ()  => ocultarTooltip());

  // Teclado
  prov.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      prov.click();
    }
  });
});

/* ══════════════════════════════════════════════════════════════
   BOTÓN "VER DESTINOS"
══════════════════════════════════════════════════════════════ */
if (panelBtn) {
  panelBtn.addEventListener('click', () => {
    const id = panelBtn.dataset.region;
    if (!id) return;
    document.dispatchEvent(new CustomEvent('region-selected', {
      detail: { region: REGIONES[id]?.etiqueta || id },
      bubbles: true,
    }));
    document.getElementById('destinos')?.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════════════════════════════
   BOTÓN "EXPLORAR MAPA" DE LA NAVBAR
══════════════════════════════════════════════════════════════ */
const btnNavMapa = document.getElementById('btnMapa');
if (btnNavMapa) {
  btnNavMapa.addEventListener('click', () => {
    document.getElementById('mapa-seccion')?.scrollIntoView({ behavior: 'smooth' });
  });
}