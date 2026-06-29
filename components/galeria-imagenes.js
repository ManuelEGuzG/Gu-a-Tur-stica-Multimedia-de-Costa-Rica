/**
 * <galeria-imagenes> — Galería con navegación anterior/siguiente
 * Atributo observado: imagenes (array JSON con rutas de imágenes)
 * Estilos encapsulados con Shadow DOM
 */
class GaleriaImagenes extends HTMLElement {
  static get observedAttributes() {
    return ['imagenes'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._imagenes = [];
    this._indice = 0;
  }

  connectedCallback() {
    const raw = this.getAttribute('imagenes');
    if (raw) {
      try { this._imagenes = JSON.parse(raw); } catch {}
    }
    this._render();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'imagenes' && newVal !== oldVal) {
      try { this._imagenes = JSON.parse(newVal); } catch { this._imagenes = []; }
      this._indice = 0;
      this._render();
    }
  }

  _render() {
    const imgs = this._imagenes;
    if (!imgs.length) {
      this.shadowRoot.innerHTML = '<style>:host { display: block; }</style>';
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .galeria { position: relative; width: 100%; background: #060f0a; border-radius: 10px; overflow: hidden; }
        .visor { position: relative; width: 100%; aspect-ratio: 16 / 9; overflow: hidden; background: #060f0a; }
        .galeria__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.4s ease; user-select: none; -webkit-user-drag: none; }
        .galeria__img.activa { opacity: 1; }
        .btn-nav { position: absolute; top: 50%; transform: translateY(-50%); z-index: 2; background: rgba(0,0,0,0.50); border: 1px solid rgba(255,255,255,0.18); color: #fff; width: 38px; height: 38px; border-radius: 50%; font-size: 1.3rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s ease; line-height: 1; }
        .btn-nav:hover { background: rgba(0,0,0,0.78); }
        .btn-nav:disabled { opacity: 0.25; cursor: default; pointer-events: none; }
        .btn-nav.prev { left: 10px; }
        .btn-nav.next { right: 10px; }
        .indicadores { display: flex; justify-content: center; align-items: center; gap: 6px; padding: 10px 0 6px; }
        .punto { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,0.28); border: none; cursor: pointer; transition: background 0.2s ease, transform 0.2s ease; padding: 0; flex-shrink: 0; }
        .punto.activo { background: var(--oro, #c9a84c); transform: scale(1.25); }
        .contador { text-align: center; font-family: var(--sans, 'Montserrat', sans-serif); font-size: 0.65rem; color: rgba(255,255,255,0.35); padding-bottom: 8px; letter-spacing: 0.1em; }
      </style>
      <div class="galeria">
        <div class="visor">
          ${imgs.map((src, i) => `<img class="galeria__img${i === 0 ? ' activa' : ''}" src="${src}" alt="Foto ${i + 1} de ${imgs.length}" loading="${i === 0 ? 'eager' : 'lazy'}" />`).join('')}
          <button class="btn-nav prev" aria-label="Foto anterior">&#8249;</button>
          <button class="btn-nav next" aria-label="Siguiente foto">&#8250;</button>
        </div>
        <div class="indicadores">
          ${imgs.map((_, i) => `<button class="punto${i === 0 ? ' activo' : ''}" aria-label="Ir a foto ${i + 1}"></button>`).join('')}
        </div>
        <p class="contador" aria-live="polite">1 / ${imgs.length}</p>
      </div>
    `;

    this._bindEvents();
    this._actualizarBotones();
  }

  _bindEvents() {
    const shadow = this.shadowRoot;
    shadow.querySelector('.prev')?.addEventListener('click', () => this._navegar(-1));
    shadow.querySelector('.next')?.addEventListener('click', () => this._navegar(1));
    shadow.querySelectorAll('.punto').forEach((btn, i) => {
      btn.addEventListener('click', () => this._irA(i));
    });

    let touchStartX = 0;
    const visor = shadow.querySelector('.visor');
    visor?.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    visor?.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { this._navegar(diff > 0 ? 1 : -1); }
    }, { passive: true });
  }

  _navegar(dir) { this._irA(this._indice + dir); }

  _irA(indice) {
    const imgs   = this.shadowRoot.querySelectorAll('.galeria__img');
    const puntos = this.shadowRoot.querySelectorAll('.punto');
    const cont   = this.shadowRoot.querySelector('.contador');
    if (!imgs.length) { return; }
    this._indice = Math.max(0, Math.min(indice, imgs.length - 1));
    imgs.forEach((img, i) => img.classList.toggle('activa', i === this._indice));
    puntos.forEach((p, i) => p.classList.toggle('activo',   i === this._indice));
    if (cont) { cont.textContent = `${this._indice + 1} / ${imgs.length}`; }
    this._actualizarBotones();
  }

  _actualizarBotones() {
    const imgs = this.shadowRoot.querySelectorAll('.galeria__img');
    const prev = this.shadowRoot.querySelector('.prev');
    const next = this.shadowRoot.querySelector('.next');
    if (prev) { prev.disabled = this._indice === 0; }
    if (next) { next.disabled = this._indice >= imgs.length - 1; }
  }
}

customElements.define('galeria-imagenes', GaleriaImagenes);
