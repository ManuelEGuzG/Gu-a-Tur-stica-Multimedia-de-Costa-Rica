/* ═══════════════════════════════════════════════════════════════
   app-header.js — Custom Element <app-header>
   Barra de navegación principal con logo, botón de audio,
   botón de mapa y selector de idioma.
   Guía Turística Multimedia de Costa Rica
   IF7102 Multimedios | I Ciclo 2026 | UCR Sede Guanacaste
   ═══════════════════════════════════════════════════════════════ */

class AppHeader extends HTMLElement {

  static get observedAttributes() {
    return ['active-region'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._silenciado = false;
  }

  connectedCallback() {
    this.render();
    this._setupEventos();
    this._setupScroll();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'active-region') {
      // Resaltar la región activa si se implementa menú de regiones
    }
  }

  /* ── Renderizar la navbar ──────────────────────────────────── */
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
        }

        nav {
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2.5rem;
          background: transparent;
          transition: background 0.4s ease, backdrop-filter 0.4s ease;
        }

        nav.con-fondo {
          background: rgba(8, 20, 12, 0.85);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        /* ── Logo ─────────────────────────────────────── */
        .logo {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          cursor: default;
        }

        .logo-icono {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #2d5a3d;
          border: 1.5px solid rgba(255,255,255,0.22);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }

        .logo-icono img {
          width: 34px;
          height: 34px;
          object-fit: contain;
        }

        .logo-texto {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .logo-nombre {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: 0.02em;
          line-height: 1;
        }

        .logo-subtitulo {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.58rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          color: #c9a84c;
          line-height: 1;
        }

        /* ── Acciones ─────────────────────────────────── */
        .acciones {
          display: flex;
          align-items: center;
          gap: 1.6rem;
        }

        /* ── Botón audio ──────────────────────────────── */
        .btn-audio {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.8);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.25s, color 0.25s, border-color 0.25s;
          flex-shrink: 0;
        }

        .btn-audio:hover {
          background: rgba(255,255,255,0.15);
          color: #fff;
          border-color: rgba(255,255,255,0.3);
        }

        .btn-audio.silenciado {
          background: rgba(192,57,43,0.15);
          border-color: rgba(192,57,43,0.35);
          color: rgba(255,120,100,0.85);
        }

        .btn-audio svg { display: block; }
        .icono-off { display: none; }

        /* ── Botón mapa ───────────────────────────────── */
        .btn-mapa {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: none;
          border: none;
          padding: 0;
          color: rgba(255,255,255,0.8);
          font-family: 'Montserrat', sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          cursor: pointer;
          transition: color 0.25s;
        }

        .btn-mapa:hover { color: #fff; }

        .btn-mapa svg {
          opacity: 0.65;
          transition: opacity 0.25s;
        }

        .btn-mapa:hover svg { opacity: 1; }

        /* ── Idioma ───────────────────────────────────── */
        .idioma {
          display: flex;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 2px;
          overflow: hidden;
        }

        .idioma-btn {
          background: none;
          border: none;
          padding: 0.32rem 0.6rem;
          color: rgba(255,255,255,0.5);
          font-family: 'Montserrat', sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }

        .idioma-btn.activo {
          background: #c9a84c;
          color: #0a1910;
        }

        .idioma-btn:not(.activo):hover {
          background: rgba(255,255,255,0.15);
          color: #fff;
        }

        /* ── Responsivo ───────────────────────────────── */
        @media (max-width: 768px) {
          nav { padding: 0 1.25rem; }
          .btn-mapa { display: none; }
        }
      </style>

      <nav id="navbar">
        <div class="logo">
          <div class="logo-icono">
            <img src="assets/img/logo-turismo.png" alt="Logo Guía Turística Costa Rica" />
          </div>
          <div class="logo-texto">
            <span class="logo-nombre">Costa Rica</span>
            <span class="logo-subtitulo">GUÍA TURÍSTICA</span>
          </div>
        </div>

        <div class="acciones">

          <!-- Botón silenciar música -->
          <button class="btn-audio" id="btnAudio" title="Música de fondo" aria-label="Silenciar música de fondo">
            <svg class="icono-on" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
            <svg class="icono-off" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <line x1="23" y1="9" x2="17" y2="15"/>
              <line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          </button>

          <!-- Botón explorar mapa -->
          <button class="btn-mapa" id="btnMapa" aria-label="Explorar mapa interactivo">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
              <line x1="8" y1="2" x2="8" y2="18"/>
              <line x1="16" y1="6" x2="16" y2="22"/>
            </svg>
            EXPLORAR MAPA
          </button>

          <!-- Selector de idioma -->
          <div class="idioma" role="group" aria-label="Seleccionar idioma">
            <button class="idioma-btn activo" data-lang="es" aria-pressed="true">ES</button>
            <button class="idioma-btn" data-lang="en" aria-pressed="false">EN</button>
          </div>

        </div>
      </nav>
    `;
  }

  /* ── Configurar eventos ──────────────────────────────────── */
  _setupEventos() {
    const navbar    = this.shadowRoot.getElementById('navbar');
    const btnAudio  = this.shadowRoot.getElementById('btnAudio');
    const btnMapa   = this.shadowRoot.getElementById('btnMapa');
    const idiomasBtns = this.shadowRoot.querySelectorAll('.idioma-btn');

    // Botón mapa → scroll a la sección
    btnMapa?.addEventListener('click', () => {
      document.getElementById('mapa-seccion')?.scrollIntoView({ behavior: 'smooth' });
      this.dispatchEvent(new CustomEvent('mapa-click', { bubbles: true, composed: true }));
    });

    // Botón audio → silenciar/activar
    btnAudio?.addEventListener('click', (e) => {
      e.stopPropagation();
      this._silenciado = !this._silenciado;
      this._actualizarBtnAudio();

      // Comunicar al audio externo
      const audio = document.getElementById('musicaFondo');
      if (audio) {
        if (this._silenciado) audio.pause();
        else audio.play().catch(() => {});
      }

      this.dispatchEvent(new CustomEvent('audio-toggle', {
        detail: { silenciado: this._silenciado },
        bubbles: true,
        composed: true
      }));
    });

    // Selector de idioma
    idiomasBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        idiomasBtns.forEach(b => { b.classList.remove('activo'); b.setAttribute('aria-pressed','false'); });
        btn.classList.add('activo');
        btn.setAttribute('aria-pressed','true');
        this.dispatchEvent(new CustomEvent('idioma-change', {
          detail: { lang: btn.dataset.lang },
          bubbles: true,
          composed: true
        }));
      });
    });
  }

  /* ── Scroll → fondo de navbar ────────────────────────────── */
  _setupScroll() {
    const navbar = this.shadowRoot.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) navbar.classList.add('con-fondo');
      else navbar.classList.remove('con-fondo');
    }, { passive: true });
  }

  /* ── Actualizar ícono del botón de audio ─────────────────── */
  _actualizarBtnAudio() {
    const btn     = this.shadowRoot.getElementById('btnAudio');
    const iconOn  = this.shadowRoot.querySelector('.icono-on');
    const iconOff = this.shadowRoot.querySelector('.icono-off');
    if (!btn) return;

    if (this._silenciado) {
      iconOn.style.display  = 'none';
      iconOff.style.display = 'block';
      btn.classList.add('silenciado');
      btn.setAttribute('aria-label', 'Activar música de fondo');
      btn.title = 'Activar música';
    } else {
      iconOn.style.display  = 'block';
      iconOff.style.display = 'none';
      btn.classList.remove('silenciado');
      btn.setAttribute('aria-label', 'Silenciar música de fondo');
      btn.title = 'Silenciar música';
    }
  }

  /* ── Método público para sincronizar estado audio ────────── */
  setSilenciado(val) {
    this._silenciado = val;
    this._actualizarBtnAudio();
  }
}

customElements.define('app-header', AppHeader);