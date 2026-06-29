/**
 * <destino-card> — Tarjeta resumen de un destino turístico
 * Atributos observados: destino-id, nombre, imagen, region
 * Al hacer clic emite CustomEvent('destino-selected') con el ID del destino
 * Estilos completamente encapsulados con Shadow DOM
 */
class DestinoCard extends HTMLElement {
  static get observedAttributes() {
    return ['destino-id', 'nombre', 'imagen', 'region'];
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
    const id     = this.getAttribute('destino-id') || '';
    const nombre = this.getAttribute('nombre')     || '';
    const imagen = this.getAttribute('imagen')     || '';
    const region = this.getAttribute('region')     || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; height: 100%; }

        .card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s var(--ease-salida, ease), box-shadow 0.3s ease, border-color 0.3s ease;
          outline: none;
        }
        .card:hover, .card:focus {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
          border-color: rgba(201, 168, 76, 0.32);
        }
        .card:focus { box-shadow: 0 0 0 2px var(--oro, #c9a84c); }

        .img-wrap {
          position: relative;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: #060f0a;
          flex-shrink: 0;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
          display: block;
        }
        .card:hover img, .card:focus img { transform: scale(1.05); }

        .badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(10, 25, 16, 0.76);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(201, 168, 76, 0.35);
          color: var(--oro, #c9a84c);
          font-family: var(--sans, 'Montserrat', sans-serif);
          font-size: 0.58rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          padding: 4px 10px;
          border-radius: 20px;
          text-transform: uppercase;
        }

        .body {
          padding: 1.2rem 1.4rem 0.8rem;
          flex: 1;
        }
        h2 {
          font-family: var(--serif, 'Cormorant Garamond', Georgia, serif);
          font-size: 1.35rem;
          font-weight: 600;
          color: #fff;
          margin: 0;
          line-height: 1.2;
        }

        .footer {
          padding: 0.8rem 1.4rem 1.1rem;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .ver-mas {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--sans, 'Montserrat', sans-serif);
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: var(--oro, #c9a84c);
          text-transform: uppercase;
          transition: gap 0.2s ease;
          pointer-events: none;
        }
        .card:hover .ver-mas, .card:focus .ver-mas { gap: 10px; }
      </style>

      <article
        class="card"
        role="button"
        tabindex="0"
        aria-label="Explorar destino: ${nombre}, ${region}"
      >
        <div class="img-wrap">
          <img src="${imagen}" alt="${nombre}" loading="lazy" />
          <span class="badge">${region}</span>
        </div>
        <div class="body">
          <h2>${nombre}</h2>
        </div>
        <div class="footer">
          <span class="ver-mas">
            Explorar
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </span>
        </div>
      </article>
    `;

    const card    = this.shadowRoot.querySelector('.card');
    const emitir  = () => {
      this.dispatchEvent(new CustomEvent('destino-selected', {
        bubbles:  true,
        composed: true,
        detail:   { id },
      }));
    };

    card?.addEventListener('click', emitir);
    card?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        emitir();
      }
    });
  }
}

customElements.define('destino-card', DestinoCard);
