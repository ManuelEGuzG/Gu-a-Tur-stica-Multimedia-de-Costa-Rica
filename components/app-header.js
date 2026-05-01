/**
 * <app-header> — Barra de navegación principal con menú de regiones
 * Emite CustomEvent('region-selected') al hacer clic en una región
 * Emite CustomEvent('audio-toggle') al hacer clic en el botón de audio
 * Atributo observado: active-region — resalta la región activa en el menú
 */

const REGIONES = [
  { id: 'guanacaste',   label: 'Pacífico Norte'   },
  { id: 'puntarenas',   label: 'Pacífico Central' },
  { id: 'limon',        label: 'Caribe'           },
  { id: 'central-sur',  label: 'Central Sur'      },
  { id: 'huetar-norte', label: 'Huetar Norte'     },
];

class AppHeader extends HTMLElement {
  static get observedAttributes() {
    return ['active-region'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._scrollHandler = this._onScroll.bind(this);
  }

  connectedCallback() {
    this._render();
    window.addEventListener('scroll', this._scrollHandler, { passive: true });
    this._onScroll();
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this._scrollHandler);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'active-region' && oldVal !== newVal) {
      this._actualizarRegionActiva(newVal);
    }
  }

  _onScroll() {
    const nav = this.shadowRoot.querySelector('.navbar');
    if (!nav) { return; }
    nav.classList.toggle('con-fondo', window.scrollY > 60);
  }

  _render() {
    const regionesHTML = REGIONES.map(r => `
      <li>
        <button class="region-btn" data-id="${r.id}" aria-label="Ver destinos de ${r.label}">
          ${r.label}
        </button>
      </li>
    `).join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }

        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2.5rem;
          background: transparent;
          transition: background 0.4s ease, backdrop-filter 0.4s ease;
        }
        .navbar.con-fondo {
          background: rgba(8, 20, 12, 0.84);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        .logo { display: flex; align-items: center; gap: 0.7rem; text-decoration: none; cursor: pointer; }
        .logo-icono {
          width: 46px; height: 46px; border-radius: 50%;
          background: #2d5a3d;
          border: 1.5px solid rgba(255,255,255,0.22);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; flex-shrink: 0;
        }
        .logo-icono img { width: 34px; height: 34px; object-fit: contain; }
        .logo-texto { display: flex; flex-direction: column; gap: 2px; }
        .logo-nombre {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: 1.1rem; font-weight: 600; color: #fff;
          letter-spacing: 0.02em; line-height: 1;
        }
        .logo-subtitulo {
          font-family: "Montserrat", sans-serif;
          font-size: 0.58rem; font-weight: 400;
          letter-spacing: 0.2em; color: var(--oro, #c9a84c); line-height: 1;
        }

        .acciones { display: flex; align-items: center; gap: 1.4rem; }

        .regiones { display: flex; align-items: center; gap: 2px; list-style: none; padding: 0; margin: 0; }
        .region-btn {
          background: none;
          border: none; border-bottom: 1.5px solid transparent;
          padding: 5px 9px;
          color: rgba(255,255,255,0.60);
          font-family: "Montserrat", sans-serif;
          font-size: 0.60rem; font-weight: 500;
          letter-spacing: 0.12em; text-transform: uppercase;
          cursor: pointer; border-radius: 4px 4px 0 0;
          transition: color 0.2s, background 0.2s, border-color 0.2s;
          white-space: nowrap;
        }
        .region-btn:hover { color: #fff; background: rgba(255,255,255,0.06); }
        .region-btn.activa { color: var(--oro, #c9a84c); border-bottom-color: var(--oro, #c9a84c); background: rgba(201,168,76,0.08); }

        .divisor-v { width: 1px; height: 18px; background: rgba(255,255,255,0.14); flex-shrink: 0; }

        .btn-mapa {
          display: flex; align-items: center; gap: 0.45rem;
          color: rgba(255,255,255,0.75);
          font-family: "Montserrat", sans-serif;
          font-size: 0.65rem; font-weight: 500; letter-spacing: 0.15em;
          cursor: pointer; transition: color 0.25s; border: none; background: none; padding: 0;
        }
        .btn-mapa:hover { color: #fff; }

        .btn-audio {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.78); cursor: pointer;
          transition: background 0.25s, color 0.25s; flex-shrink: 0;
        }
        .btn-audio:hover { background: rgba(255,255,255,0.14); color: #fff; }
        .btn-audio.silenciado { color: rgba(255,255,255,0.32); }

        .idioma { display: flex; gap: 2px; }
        .idioma-btn {
          background: none; border: none; padding: 3px 8px;
          color: rgba(255,255,255,0.38);
          font-family: "Montserrat", sans-serif;
          font-size: 0.6rem; font-weight: 500; letter-spacing: 0.1em;
          cursor: pointer; border-radius: 4px; transition: color 0.2s, background 0.2s;
        }
        .idioma-btn.activo { color: #fff; background: rgba(255,255,255,0.08); }
        .idioma-btn:hover  { color: rgba(255,255,255,0.78); }

        @media (max-width: 900px) { .regiones, .divisor-v { display: none; } }
        @media (max-width: 640px) { .navbar { padding: 0 1.2rem; } .btn-mapa { display: none; } }
      </style>

      <nav class="navbar" role="navigation" aria-label="Navegación principal">
        <a class="logo" href="index.html" aria-label="Inicio - Guía Turística Costa Rica">
          <div class="logo-icono">
            <img src="assets/img/logo-turismo.png" alt="" aria-hidden="true" width="34" height="34" />
          </div>
          <div class="logo-texto">
            <span class="logo-nombre">Costa Rica</span>
            <span class="logo-subtitulo">GUÍA TURÍSTICA</span>
          </div>
        </a>
        <div class="acciones">
          <nav aria-label="Regiones turísticas">
            <ul class="regiones">${regionesHTML}</ul>
          </nav>
          <div class="divisor-v" aria-hidden="true"></div>
          <button class="btn-mapa" id="btnMapa" aria-label="Ir al mapa interactivo">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
              <line x1="8" y1="2" x2="8" y2="18"/>
              <line x1="16" y1="6" x2="16" y2="22"/>
            </svg>
            MAPA
          </button>
          <button class="btn-audio" id="btnAudio" aria-label="Silenciar música de fondo" title="Música de fondo">
            <svg class="icono-on" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
            <svg class="icono-off" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" style="display:none">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <line x1="23" y1="9" x2="17" y2="15"/>
              <line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          </button>
          <div class="idioma" role="group" aria-label="Seleccionar idioma">
            <button class="idioma-btn activo" data-lang="es" aria-pressed="true">ES</button>
            <button class="idioma-btn"        data-lang="en" aria-pressed="false">EN</button>
          </div>
        </div>
      </nav>
    `;

    this._bindEvents();
  }

  _bindEvents() {
    const shadow = this.shadowRoot;

    shadow.querySelectorAll('.region-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const regionId = btn.dataset.id;
        this.setAttribute('active-region', regionId);
        this.dispatchEvent(new CustomEvent('region-selected', {
          bubbles: true, composed: true, detail: { regionId },
        }));
      });
    });

    shadow.getElementById('btnMapa')?.addEventListener('click', () => {
      document.getElementById('mapa-seccion')?.scrollIntoView({ behavior: 'smooth' });
    });

    const btnAudio = shadow.getElementById('btnAudio');
    const iconoOn  = shadow.querySelector('.icono-on');
    const iconoOff = shadow.querySelector('.icono-off');

    btnAudio?.addEventListener('click', (e) => {
      e.stopPropagation();
      const silenciado = btnAudio.classList.toggle('silenciado');
      if (iconoOn)  { iconoOn.style.display  = silenciado ? 'none'  : 'block'; }
      if (iconoOff) { iconoOff.style.display = silenciado ? 'block' : 'none';  }
      btnAudio.setAttribute('aria-label', silenciado ? 'Activar música de fondo' : 'Silenciar música de fondo');
      this.dispatchEvent(new CustomEvent('audio-toggle', {
        bubbles: true, composed: true, detail: { silenciado },
      }));
    });

    const idiomasBtns = shadow.querySelectorAll('.idioma-btn');
    idiomasBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        idiomasBtns.forEach(b => { b.classList.remove('activo'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('activo');
        btn.setAttribute('aria-pressed', 'true');
      });
    });
  }

  _actualizarRegionActiva(regionId) {
    this.shadowRoot.querySelectorAll('.region-btn').forEach(btn => {
      btn.classList.toggle('activa', btn.dataset.id === regionId);
    });
  }
}

customElements.define('app-header', AppHeader);