/* ═══════════════════════════════════════════════════════════════
   mapa.js — Lógica del mapa interactivo de regiones
   Guía Turística Multimedia de Costa Rica
   IF7102 Multimedios | I Ciclo 2026 | UCR Sede Guanacaste
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── DATOS DE REGIONES ─────────────────────────────────────── */
const REGIONES = {
  'chorotega':        { etiqueta: 'Chorotega',        nombre: 'Región Chorotega',    color: '#445a14', descripcion: 'Tierra de playas doradas, volcanes activos y bosque seco tropical. Hogar del Parque Nacional Rincón de la Vieja, Tamarindo y las tortugas baulas del Pacífico.', provincias: ['Guanacaste'] },
  'pacifico_central': { etiqueta: 'Pacífico Central', nombre: 'Pacífico Central',    color: '#778c43', descripcion: 'Desde Manuel Antonio hasta Quepos, bellísimas playas y bosques tropicales. Parque Nacional Manuel Antonio y los mejores avistamientos de fauna marina.', provincias: ['Puntarenas (zona central)'] },
  'brunca':           { etiqueta: 'Brunca',           nombre: 'Región Brunca',       color: '#3b5110', descripcion: 'Desde la Península de Osa hasta la frontera sur. Alberga el Parque Nacional Corcovado, considerado el lugar de mayor biodiversidad del planeta.', provincias: ['Puntarenas (sur)', 'San José (sur)'] },
  'huetar_caribe':    { etiqueta: 'Huetar Caribe',   nombre: 'Huetar Caribe',       color: '#b7cd7f', descripcion: 'El Caribe costarricense: canales fluviales, arrecifes de coral en Cahuita, cultura afrocaribeña vibrante y el sabor único del pati y el rice and beans.', provincias: ['Limón'] },
  'central':          { etiqueta: 'Central',          nombre: 'Región Central',      color: '#96ac60', descripcion: 'El corazón histórico y cultural del país. Volcán Irazú, Valle de Orosi, la Basílica de los Ángeles y la mayor concentración urbana de Costa Rica.', provincias: ['San José', 'Cartago', 'Heredia', 'Alajuela'] },
  'huetar_norte':     { etiqueta: 'Huetar Norte',    nombre: 'Huetar Norte',        color: '#778c43', descripcion: 'Volcán Poás, La Fortuna con el imponente Arenal, la Laguna de Arenal y los mejores cafetales del país. Aventura geotérmica y naturaleza exuberante en cada rincón.', provincias: ['Alajuela (norte)', 'Heredia (norte)'] },
};

/* ── MAPA ─────────────────────────────────────────────────── */
const provincias      = document.querySelectorAll('.provincia');
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

// Crear elemento descripción
let panelDescEl = document.getElementById('panelDesc');
if (!panelDescEl && panelInfo) {
  panelDescEl = document.createElement('p');
  panelDescEl.id = 'panelDesc';
  panelDescEl.className = 'mapa-panel__descripcion';
  const div = panelInfo.querySelector('.mapa-panel__divisor');
  if (div) div.insertAdjacentElement('afterend', panelDescEl);
  else panelInfo.appendChild(panelDescEl);
}

let regionActivaMapa = null;

function mostrarPanelMapa(rid) {
  const d = REGIONES[rid]; if (!d) return;
  if (panelBarra) panelBarra.style.background = d.color;
  if (panelEtiqueta) { panelEtiqueta.textContent = d.etiqueta; panelEtiqueta.style.color = d.color; panelEtiqueta.style.background = d.color+'18'; panelEtiqueta.style.border = `1px solid ${d.color}40`; }
  if (panelNombre) panelNombre.textContent = d.nombre;
  const div = panelInfo?.querySelector('.mapa-panel__divisor');
  if (div) div.style.background = d.color;
  if (panelDescEl) panelDescEl.textContent = d.descripcion;
  if (panelProvincias) panelProvincias.innerHTML = d.provincias.map(p=>`<li>${p}</li>`).join('');
  panelEl?.classList.add('tiene-region');
  panelInicial.style.display = 'none';
  panelInfo.setAttribute('aria-hidden','false');
  void panelInfo.offsetWidth;
  panelInfo.classList.add('visible');
}

function ocultarPanelMapa() {
  panelInfo.classList.remove('visible');
  panelEl?.classList.remove('tiene-region');
  setTimeout(() => { panelInfo.setAttribute('aria-hidden','true'); panelInicial.style.display = ''; }, 300);
}

function activarRegionMapa(rid) {
  provincias.forEach(el => { el.classList.remove('region-activa','inactiva'); el.classList.add(el.dataset.region === rid ? 'region-activa' : 'inactiva'); });
}

function desactivarTodasMapa() {
  provincias.forEach(el => el.classList.remove('region-activa','inactiva'));
}

// Tooltip
function mostrarTooltip(e, rid, nombre) {
  const d = REGIONES[rid]; if (!d) return;
  tooltipNombre.textContent = nombre; tooltipRegion.textContent = d.etiqueta;
  tooltip.classList.add('visible'); moverTooltip(e);
}
function moverTooltip(e) {
  const r = mapaContenedor.getBoundingClientRect();
  const x = e.clientX - r.left + 18;
  const y = e.clientY - r.top  + 18;
  const maxX = r.width  - (tooltip.offsetWidth  || 170) - 8;
  const maxY = r.height - (tooltip.offsetHeight || 56)  - 8;
  tooltip.style.left = `${Math.min(x, maxX)}px`;
  tooltip.style.top  = `${Math.max(0, Math.min(y, maxY))}px`;
}
function ocultarTooltip() { tooltip.classList.remove('visible'); }

// Eventos de provincias
provincias.forEach(prov => {
  const rid  = prov.dataset.region;
  const nom  = (prov.getAttribute('aria-label')||'').split(' - ')[0] || rid;
  prov.addEventListener('click', () => {
    if (regionActivaMapa === rid) { regionActivaMapa = null; desactivarTodasMapa(); ocultarPanelMapa(); }
    else { regionActivaMapa = rid; activarRegionMapa(rid); mostrarPanelMapa(rid); }
    ocultarTooltip();
  });
  prov.addEventListener('mouseenter', e => mostrarTooltip(e, rid, nom));
  prov.addEventListener('mousemove',  e => moverTooltip(e));
  prov.addEventListener('mouseleave', () => ocultarTooltip());
  prov.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){e.preventDefault();prov.click();} });
});

// Navbar botón mapa
document.getElementById('btnMapa')?.addEventListener('click', () => {
  document.getElementById('mapa-seccion')?.scrollIntoView({ behavior: 'smooth' });
});

/* ── DESTINOS ─────────────────────────────────────────────── */
let destinosData    = [];
let destinosCargados = false;
let regionDestinosActiva = 'todas';

async function cargarDestinos() {
  if (destinosCargados) return;
  const res = await fetch('data/destinos.json');
  destinosData = await res.json();
  destinosCargados = true;
  generarFiltrosDestinos();
}

function generarFiltrosDestinos() {
  const fw = document.getElementById('destinosFiltros'); if (!fw) return;
  const regs = ['todas', ...new Set(destinosData.map(d=>d.region_id))];
  fw.innerHTML = regs.map(r=>{
    const nombre = r === 'todas' ? 'Todos' : (REGIONES[r]?.etiqueta || r);
    return `<button class="filtro-btn" data-region="${r}">${nombre}</button>`;
  }).join('');
  fw.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      regionDestinosActiva = btn.dataset.region;
      const rt = document.getElementById('destinosRegionTexto');
      if (rt) rt.textContent = regionDestinosActiva !== 'todas' ? regionDestinosActiva : 'Costa Rica';
      actualizarFiltroDestinos();
      renderDestinos(filtrarDestinos());
    });
  });
}

function actualizarFiltroDestinos() {
  document.querySelectorAll('#destinosFiltros .filtro-btn').forEach(btn => {
    btn.classList.toggle('activo', btn.dataset.region === regionDestinosActiva);
  });
}

function filtrarDestinos() {
  if (regionDestinosActiva === 'todas') return destinosData;
  return destinosData.filter(d => d.region_id === regionDestinosActiva);
}

function renderDestinos(lista) {
  const g = document.getElementById('destinosGrid'); if (!g) return;
  const c = document.getElementById('destinosContador');
  const lang = window.idiomaActual ? window.idiomaActual() : 'es';
  const t = window.TRADUCCIONES || {};
  const txtMostrando = t['destinos.mostrando']?.[lang] || 'Mostrando';
  const txtDest1     = t['destinos.destino']?.[lang]   || 'destino';
  const txtDestN     = t['destinos.destinos']?.[lang]  || 'destinos';
  const txtExplorar  = t['destinos.explorar']?.[lang]  || 'Explorar destino';
  const txtActs      = t['destinos.actividades']?.[lang] || 'ACTIVIDADES';
  if (c) c.innerHTML = `${txtMostrando} <span>${lista.length}</span> ${lista.length!==1?txtDestN:txtDest1}`;
  if (lista.length === 0) { g.innerHTML = ''; document.getElementById('destinosVacio')?.classList.add('visible'); return; }
  document.getElementById('destinosVacio')?.classList.remove('visible');
  g.innerHTML = lista.map((d,i) => `
    <article class="destino-card" style="animation-delay:${0.05+i*0.07}s" data-id="${d.id}">
      <div class="destino-card__img-wrap">
        <img class="destino-card__img" src="${d.imagen_portada}" alt="${d.nombre}" loading="lazy" onerror="this.parentElement.style.background='rgba(150,172,96,0.08)'"/>
        <div class="destino-card__img-overlay"></div>
        <span class="destino-card__badge">${d.region}</span>
      </div>
      <div class="destino-card__body">
        <h2 class="destino-card__nombre">${d.nombre}</h2>
        <p class="destino-card__descripcion">${d.descripcion}</p>
        <div class="destino-card__actividades">
          ${d.actividades.slice(0,3).map(a=>`<span class="destino-card__tag">${a}</span>`).join('')}
          ${d.actividades.length>3?`<span class="destino-card__tag">+${d.actividades.length-3}</span>`:''}
        </div>
      </div>
      <div class="destino-card__divisor"></div>
      <div class="destino-card__footer">
        <button class="destino-card__ver-mas" onclick="abrirModal('${d.id}')">
          Explorar destino
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
    </article>`).join('');
}

/* ── MODAL DE DETALLE ─────────────────────────────────────── */
const modalEl      = document.getElementById('modalDestino');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalCerrar  = document.getElementById('modalCerrar');

window.abrirModal = function(id) {
  const d = destinosData.find(x => x.id === id);
  if (!d || !modalEl) return;

  document.getElementById('modalImg').src         = d.imagen_portada;
  document.getElementById('modalImg').alt         = d.nombre;
  document.getElementById('modalBadge').textContent = d.region;
  document.getElementById('modalNombre').textContent = d.nombre;
  document.getElementById('modalDescripcion').textContent = d.descripcion;
  document.getElementById('modalActividades').innerHTML =
    d.actividades.map(a => `<span class="destino-card__tag">${a}</span>`).join('');

  modalEl.classList.add('abierto');
  modalEl.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

function cerrarModal() {
  modalEl?.classList.remove('abierto');
  modalEl?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

modalCerrar?.addEventListener('click', cerrarModal);
modalBackdrop?.addEventListener('click', cerrarModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarModal(); });

// ── Botón "Ver destinos" ────────────────────────────────────
panelBtn?.addEventListener('click', async () => {
  if (!regionActivaMapa) return;
  const datos = REGIONES[regionActivaMapa];
  if (!datos) return;

  await cargarDestinos();

  regionDestinosActiva = panelBtn.dataset.region;

  const rt = document.getElementById('destinosRegionTexto');
  if (rt) rt.textContent = datos.etiqueta;
  regionDestinosActiva = regionActivaMapa; // usar region_id del mapa

  const hdr = document.getElementById('destinosHeader');
  if (hdr) hdr.style.display = '';

  actualizarFiltroDestinos();
  renderDestinos(filtrarDestinos());

  setTimeout(() => {
    document.getElementById('destinos')?.scrollIntoView({ behavior: 'smooth' });
  }, 100);
});

// Precargar JSON
cargarDestinos();