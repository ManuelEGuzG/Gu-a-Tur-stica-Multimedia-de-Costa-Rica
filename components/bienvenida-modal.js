/* ═══════════════════════════════════════════════════════════════
   bienvenida-modal.js — Custom Element <bienvenida-modal>
   Pantalla de bienvenida con Shadow DOM encapsulado.
   Se muestra cada vez que el usuario entra o recarga la página.
   Guía Turística Multimedia de Costa Rica
   IF7102 Multimedios | I Ciclo 2026 | UCR Sede Guanacaste
   ═══════════════════════════════════════════════════════════════ */

class BienvenidaModal extends HTMLElement {

  constructor() {
    super();
   
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._render();
    this._animar();
  }

  
  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        /* ── Reset dentro del shadow ── */
        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        /* ── Overlay de fondo ── */
        .overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(4, 12, 8, 0.96);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .overlay.visible {
          opacity: 1;
        }

        .overlay.saliendo {
          opacity: 0;
          pointer-events: none;
        }

        /* ── Panel principal ── */
        .panel {
          background: linear-gradient(160deg, #0f2318 0%, #0b1a10 100%);
          border: 1px solid rgba(150, 172, 96, 0.25);
          border-radius: 24px;
          width: 100%;
          max-width: 520px;
          padding: 3rem 2.5rem 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          text-align: center;
          transform: translateY(24px) scale(0.96);
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
          overflow: hidden;
        }

        .panel.visible {
          transform: translateY(0) scale(1);
        }

        /* Decoración de fondo */
        .panel::before {
          content: '';
          position: absolute;
          top: -60px;
          right: -60px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(150,172,96,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ── Logo ── */
        .logo-wrap {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #1a3520;
          border: 2px solid rgba(150,172,96,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .logo-wrap img {
          width: 48px;
          height: 48px;
          object-fit: contain;
        }

        /* ── Eyebrow ── */
        .eyebrow {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .eyebrow-linea {
          display: block;
          width: 20px;
          height: 1px;
          background: #96ac60;
          opacity: 0.5;
        }

        .eyebrow-texto {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.58rem;
          font-weight: 600;
          letter-spacing: 0.26em;
          color: #96ac60;
          text-transform: uppercase;
        }

        /* ── Título ── */
        .titulo {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 2.4rem;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.1;
        }

        .titulo em {
          font-family: 'Cormorant Infant', Georgia, serif;
          font-style: italic;
          color: #b7cd7f;
        }

        /* ── Descripción ── */
        .descripcion {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.82rem;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.8;
          max-width: 380px;
        }

        /* ── Divisor ── */
        .divisor {
          width: 40px;
          height: 1.5px;
          background: linear-gradient(90deg, #445a14, #96ac60);
          border-radius: 2px;
        }

        /* ── Stats rápidos ── */
        .stats {
          display: flex;
          gap: 2rem;
          justify-content: center;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
        }

        .stat-numero {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.6rem;
          font-weight: 600;
          color: #ffffff;
          line-height: 1;
        }

        .stat-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.55rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
        }

        .stat-sep {
          width: 1px;
          height: 32px;
          background: rgba(150,172,96,0.2);
          align-self: center;
        }

        /* ── Botón entrar ── */
        .btn-entrar {
          width: 100%;
          padding: 1rem;
          border-radius: 12px;
          background: #96ac60;
          border: none;
          color: #0a1910;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          transition: background 0.25s ease, transform 0.2s ease, box-shadow 0.25s ease;
          margin-top: 0.5rem;
        }

        .btn-entrar:hover {
          background: #b7cd7f;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(150,172,96,0.3);
        }

        .btn-entrar:active {
          transform: translateY(0);
        }

        .btn-entrar svg {
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .btn-entrar:hover svg {
          transform: translateX(4px);
        }

        /* ── Nota inferior ── */
        .nota {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.6rem;
          font-weight: 300;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.04em;
        }

        /* ── Responsivo ── */
        @media (max-width: 480px) {
          .panel {
            padding: 2rem 1.5rem 2rem;
            gap: 1.2rem;
          }
          .titulo { font-size: 2rem; }
          .stats  { gap: 1.25rem; }
        }
      </style>

      <div class="overlay" id="overlay">
        <div class="panel" id="panel">

          <!-- Logo -->
          <div class="logo-wrap">
            <img src="assets/img/logo-turismo.png" alt="Logo Guía Turística" />
          </div>

          <!-- Eyebrow -->
          <div class="eyebrow">
            <span class="eyebrow-linea"></span>
            <span class="eyebrow-texto">Guía Turística Multimedia</span>
            <span class="eyebrow-linea"></span>
          </div>

          <!-- Título -->
          <h1 class="titulo">
            Bienvenido a<br>
            <em>Costa Rica</em>
          </h1>

          <!-- Divisor -->
          <div class="divisor"></div>

          <!-- Descripción -->
          <p class="descripcion">
            Explorá las 6 regiones de Costa Rica — volcanes, playas del
            Caribe, bosques nubosos y cultura viva. Seleccioná una
            región en el mapa interactivo para descubrir sus destinos.
          </p>

          <!-- Stats -->
          <div class="stats">
            <div class="stat">
              <span class="stat-numero">6</span>
              <span class="stat-label">Regiones</span>
            </div>
            <div class="stat-sep"></div>
            <div class="stat">
              <span class="stat-numero">22</span>
              <span class="stat-label">Destinos</span>
            </div>
            <div class="stat-sep"></div>
            <div class="stat">
              <span class="stat-numero">∞</span>
              <span class="stat-label">Aventuras</span>
            </div>
          </div>

          <!-- Botón -->
          <button class="btn-entrar" id="btnEntrar">
            Explorar Costa Rica
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>

          <!-- Nota -->
          <p class="nota">IF7102 Multimedios · UCR Sede Guanacaste · I Ciclo 2026</p>

        </div>
      </div>
    `;


    this.shadowRoot.getElementById('btnEntrar')
      .addEventListener('click', () => this._cerrar());
  }

  /* ══════════════════════════════════════════════════════════
     ANIMACIÓN DE ENTRADA
  ══════════════════════════════════════════════════════════ */
  _animar() {
    const overlay = this.shadowRoot.getElementById('overlay');
    const panel   = this.shadowRoot.getElementById('panel');

    /* Pequeño delay para que el CSS transition funcione */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add('visible');
        panel.classList.add('visible');
      });
    });


    document.body.style.overflow = 'hidden';
  }

  /* ══════════════════════════════════════════════════════════
     CERRAR CON ANIMACIÓN
  ══════════════════════════════════════════════════════════ */
  _cerrar() {
    const overlay = this.shadowRoot.getElementById('overlay');
    overlay.classList.add('saliendo');


    overlay.addEventListener('transitionend', () => {
      document.body.style.overflow = '';
      this.remove();


      document.dispatchEvent(new CustomEvent('bienvenida-cerrada', {
        bubbles: true
      }));
    }, { once: true });
  }
}


customElements.define('bienvenida-modal', BienvenidaModal);