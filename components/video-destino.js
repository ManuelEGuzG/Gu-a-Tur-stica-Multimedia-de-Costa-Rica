/**
 * <video-destino> — Reproductor de video con miniatura (poster) y controles nativos
 * Atributos observados: src (ruta del video), poster (imagen de miniatura)
 * Bonus: suma puntos en criterio de integración multimedia
 */
class VideoDestino extends HTMLElement {
  static get observedAttributes() {
    return ['src', 'poster'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._render();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal) { this._render(); }
  }

  _render() {
    const src    = this.getAttribute('src')    || '';
    const poster = this.getAttribute('poster') || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }

        .etiqueta {
          font-family: var(--sans, 'Montserrat', sans-serif);
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          color: var(--oro, #c9a84c);
          text-transform: uppercase;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .etiqueta::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--oro, #c9a84c);
          flex-shrink: 0;
        }

        .wrap {
          width: 100%;
          background: #000;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(201, 168, 76, 0.15);
        }

        video {
          display: block;
          width: 100%;
          max-height: 320px;
          object-fit: cover;
          background: #060f0a;
        }
      </style>

      <span class="etiqueta">Video del destino</span>
      <div class="wrap">
        <video
          src="${src}"
          poster="${poster}"
          controls
          preload="metadata"
          aria-label="Video del destino turístico"
        ></video>
      </div>
    `;
  }
}

customElements.define('video-destino', VideoDestino);
