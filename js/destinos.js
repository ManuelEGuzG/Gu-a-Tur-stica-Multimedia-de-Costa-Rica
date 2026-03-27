/* ═══════════════════════════════════════════════════════════════
   destinos.js — Vista de destinos turísticos (SPA)
   Guía Turística Multimedia de Costa Rica
   IF7102 Multimedios | I Ciclo 2026 | UCR Sede Guanacaste
   ═══════════════════════════════════════════════════════════════ */

'use strict';

const grid        = document.getElementById('destinosGrid');
const contador    = document.getElementById('destinosContador');
const vacio       = document.getElementById('destinosVacio');
const filtrosWrap = document.getElementById('destinosFiltros');

let todosLosDestinos = [];
let regionActiva     = 'todas';

/* ══════════════════════════════════════════════════════════════
   CARGAR JSON UNA SOLA VEZ
══════════════════════════════════════════════════════════════ */
async function cargarJSON() {
  if (todosLosDestinos.length > 0) return; // ya cargado
  try {
    const res = await fetch('data/destinos.json');
    todosLosDestinos = await res.json();
    generarFiltros();
  } catch (err) {
    console.error('[destinos.js] Error cargando destinos.json:', err);
  }
}

/* ══════════════════════════════════════════════════════════════
   FUNCIÓN PÚBLICA — llamada desde router.js
══════════════════════════════════════════════════════════════ */
window.cargarDestinosPorRegion = async function(region) {
  await cargarJSON();
  regionActiva = region || 'todas';
  actualizarFiltroActivo();
  renderizarGrid(filtrar());
};

/* ══════════════════════════════════════════════════════════════
   FILTRAR
══════════════════════════════════════════════════════════════ */
function filtrar() {
  if (regionActiva === 'todas') return todosLosDestinos;
  return todosLosDestinos.filter(d => d.region === regionActiva);
}

/* ══════════════════════════════════════════════════════════════
   GENERAR FILTROS
══════════════════════════════════════════════════════════════ */
function generarFiltros() {
  if (!filtrosWrap) return;
  const regiones = ['todas', ...new Set(todosLosDestinos.map(d => d.region))];

  filtrosWrap.innerHTML = regiones.map(r => `
    <button class="filtro-btn ${r === regionActiva ? 'activo' : ''}" data-region="${r}">
      ${r === 'todas' ? 'Todos los destinos' : r}
    </button>
  `).join('');

  filtrosWrap.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      regionActiva = btn.dataset.region;
      actualizarFiltroActivo();
      renderizarGrid(filtrar());
    });
  });
}

function actualizarFiltroActivo() {
  filtrosWrap?.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.classList.toggle('activo', btn.dataset.region === regionActiva);
  });
}

/* ══════════════════════════════════════════════════════════════
   RENDERIZAR CARDS
══════════════════════════════════════════════════════════════ */
function renderizarGrid(destinos) {
  if (!grid) return;

  if (contador) {
    const total = destinos.length;
    contador.innerHTML = `Mostrando <span>${total}</span> destino${total !== 1 ? 's' : ''}`;
  }

  if (destinos.length === 0) {
    grid.innerHTML = '';
    vacio?.classList.add('visible');
    return;
  }
  vacio?.classList.remove('visible');

  grid.innerHTML = destinos.map((d, i) => `
    <article class="destino-card" style="animation-delay:${0.05 + i * 0.07}s">
      <div class="destino-card__img-wrap">
        <img class="destino-card__img" src="${d.imagen_portada}" alt="${d.nombre}"
             loading="lazy" onerror="this.style.opacity='0'" />
        <div class="destino-card__img-overlay"></div>
        <span class="destino-card__badge">${d.region}</span>
      </div>
      <div class="destino-card__body">
        <h2 class="destino-card__nombre">${d.nombre}</h2>
        <p class="destino-card__descripcion">${d.descripcion}</p>
        <div class="destino-card__actividades">
          ${d.actividades.slice(0, 3).map(a => `<span class="destino-card__tag">${a}</span>`).join('')}
          ${d.actividades.length > 3 ? `<span class="destino-card__tag">+${d.actividades.length - 3}</span>` : ''}
        </div>
      </div>
      <div class="destino-card__divisor"></div>
      <div class="destino-card__footer">
        <span class="destino-card__ver-mas">
          Explorar destino
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </span>
      </div>
    </article>
  `).join('');
}

/* ══════════════════════════════════════════════════════════════
   PRECARGAR el JSON en segundo plano al iniciar la app
══════════════════════════════════════════════════════════════ */
cargarJSON();