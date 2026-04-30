/**
 * <destino-detalle> — Vista completa de un destino turístico
 * Integra internamente <galeria-imagenes>, <audio-guia> y <video-destino>
 * Recibe el destino completo vía la propiedad .destino o el atributo data-destino (JSON)
 * Emite CustomEvent('detalle-cerrado') al cerrarse
 */
import './galeria-imagenes.js';
import './audio-guia.js';
import './video-destino.js';

class DestinoDetalle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._destino     = null;
    this._keyHandler  = this._onKeyDown.bind(this);
  }

  connectedCallback() {
    this._render();
    document.addEventListener('keydown', this._keyHandler);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._keyHandler);
  }

  /** Muestra el modal con los datos del destino */
  mostrar(destino) {
    this._destino = destino;
    this._render();
    this.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    this.shadowRoot.querySelector('.modal')?.focus();
  }

  /** Cierra el modal */
  cerrar() {
    this._cerrar();
  }

  _onKeyDown(e) {
    if (e.key === 'Escape' && !this.hasAttribute('hidden')) { this._cerrar(); }
  }

  _cerrar() {
    this.setAttribute('hidden', '');
    document.body.style.overflow = '';
    this.dispatchEvent(new CustomEvent('detalle-cerrado', {
      bubbles:  true,
      composed: true,
    }));
  }

  _render() {
    const d = this._destino;
    if (!d) {
      this.shadowRoot.innerHTML = '<style>:host,[hidden]{display:none!important}</style>';
      return;
    }

    const galeriaHTML = (d.galeria?.length)
      ? `<galeria-imagenes imagenes='${JSON.stringify(d.galeria)}'></galeria-imagenes>`
      : `<img class="img-portada" src="${d.imagen_portada}" alt="${d.nombre}" loading="eager" />`;

    const audioHTML = d.audio
      ? `<audio-guia src="${d.audio}" label="Audio guía: ${d.nombre}"></audio-guia>`
      : '';

    const videoHTML = d.video
      ? `<video-destino src="${d.video}" poster="${d.imagen_portada}"></video-destino>`
      : '';

    const actividadesHTML = (d.actividades || []).map(a => `<li>${a}</li>`).join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          position: fixed;
          inset: 0;
          z-index: 500;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.22s ease;
        }
        :host([hidden]) { display: none !important; }

        @keyframes fadeIn  { from { opacity: 0; }              to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(28px); opacity: 0; } to { transform: none; opacity: 1; } }

        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.76);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          cursor: pointer;
        }

        .modal {
          position: relative;
          background: #0f2018;
          border: 1px solid rgba(201, 168, 76, 0.2);
          border-radius: 16px;
          width: 100%;
          max-width: 800px;
          max-height: 90dvh;
          overflow-y: auto;
          padding: 2rem;
          animation: slideUp 0.3s var(--ease-salida, ease);
          scrollbar-width: thin;
          scrollbar-color: rgba(201, 168, 76, 0.3) transparent;
          outline: none;
        }

        .btn-cerrar {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.14);
          color: rgba(255, 255, 255, 0.65);
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, color 0.2s;
          z-index: 1;
        }
        .btn-cerrar:hover { background: rgba(255, 255, 255, 0.14); color: #fff; }

        .region-badge {
          display: inline-block;
          font-family: var(--sans, 'Montserrat', sans-serif);
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          color: var(--oro, #c9a84c);
          background: rgba(201, 168, 76, 0.1);
          border: 1px solid rgba(201, 168, 76, 0.28);
          padding: 3px 12px;
          border-radius: 20px;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }

        h1 {
          font-family: var(--serif, 'Cormorant Garamond', Georgia, serif);
          font-size: clamp(1.6rem, 4vw, 2.4rem);
          font-weight: 600;
          color: #fff;
          margin: 0 0 1.2rem;
          line-height: 1.1;
          padding-right: 2.5rem;
        }

        .img-portada {
          width: 100%;
          border-radius: 10px;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          display: block;
          background: #060f0a;
        }

        .descripcion {
          font-family: var(--sans, 'Montserrat', sans-serif);
          font-size: 0.9rem;
          font-weight: 300;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.72);
          margin: 1.1rem 0 0;
        }

        .divisor {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 1.3rem 0;
        }

        .actividades-titulo {
          font-family: var(--sans, 'Montserrat', sans-serif);
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: rgba(255, 255, 255, 0.38);
          text-transform: uppercase;
          margin-bottom: 0.65rem;
        }

        .actividades {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem;
        }
        .actividades li {
          font-family: var(--sans, 'Montserrat', sans-serif);
          font-size: 0.72rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.78);
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.11);
          padding: 5px 13px;
          border-radius: 20px;
        }

        .media {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
      </style>

      <div class="overlay" id="overlay" aria-hidden="true"></div>

      <div class="modal" role="dialog" aria-modal="true" aria-label="Detalle de ${d.nombre}" tabindex="-1">
        <button class="btn-cerrar" id="btnCerrar" aria-label="Cerrar detalle">&#10005;</button>
        <span class="region-badge">${d.region}</span>
        <h1>${d.nombre}</h1>

        ${galeriaHTML}

        <p class="descripcion">${d.descripcion}</p>

        <div class="divisor"></div>
        <p class="actividades-titulo">Actividades</p>
        <ul class="actividades">${actividadesHTML}</ul>

        <div class="media">
          ${audioHTML}
          ${videoHTML}
        </div>
      </div>
    `;

    this.shadowRoot.getElementById('btnCerrar')?.addEventListener('click', () => this._cerrar());
    this.shadowRoot.getElementById('overlay')?.addEventListener('click', () => this._cerrar());
  }
}

customElements.define('destino-detalle', DestinoDetalle);
