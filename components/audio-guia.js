/**
 * <audio-guia> — Reproductor de audio personalizado
 * Atributos observados: src (ruta del audio), label (texto descriptivo)
 * Utiliza <audio> nativo dentro del Shadow DOM
 */
class AudioGuia extends HTMLElement {
  static get observedAttributes() {
    return ['src', 'label'];
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
    const src   = this.getAttribute('src')   || '';
    const label = this.getAttribute('label') || 'Audio guía';

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }

        .player {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(201, 168, 76, 0.28);
          border-radius: 10px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .label {
          font-family: var(--sans, 'Montserrat', sans-serif);
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          color: var(--oro, #c9a84c);
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .label::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--oro, #c9a84c);
          flex-shrink: 0;
        }

        .controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-play {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--oro, #c9a84c);
          border: none;
          color: var(--verde-oscuro, #0a1910);
          font-size: 0.82rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .btn-play:hover { background: var(--oro-claro, #e8c97a); transform: scale(1.06); }

        .progress-wrap {
          flex: 1;
          height: 4px;
          background: rgba(255, 255, 255, 0.14);
          border-radius: 2px;
          cursor: pointer;
          position: relative;
        }
        .progress-bar {
          height: 100%;
          background: var(--oro, #c9a84c);
          border-radius: 2px;
          width: 0%;
          transition: width 0.1s linear;
          pointer-events: none;
        }

        .tiempo {
          font-family: var(--sans, 'Montserrat', sans-serif);
          font-size: 0.68rem;
          color: rgba(255, 255, 255, 0.45);
          min-width: 36px;
          text-align: right;
          letter-spacing: 0.04em;
        }
      </style>

      <div class="player">
        <span class="label">${label}</span>
        <audio id="audio" src="${src}" preload="metadata"></audio>
        <div class="controls">
          <button class="btn-play" id="btnPlay" aria-label="Reproducir audio">
            &#9654;
          </button>
          <div class="progress-wrap" id="progressWrap" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
            <div class="progress-bar" id="progressBar"></div>
          </div>
          <span class="tiempo" id="tiempo" aria-label="Tiempo reproducido">0:00</span>
        </div>
      </div>
    `;

    this._bindEvents();
  }

  _bindEvents() {
    const shadow       = this.shadowRoot;
    const audio        = shadow.getElementById('audio');
    const btnPlay      = shadow.getElementById('btnPlay');
    const progressBar  = shadow.getElementById('progressBar');
    const progressWrap = shadow.getElementById('progressWrap');
    const tiempo       = shadow.getElementById('tiempo');

    if (!audio || !btnPlay) { return; }

    btnPlay.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().catch(() => {});
        btnPlay.innerHTML = '&#9646;&#9646;';
        btnPlay.setAttribute('aria-label', 'Pausar audio');
      } else {
        audio.pause();
        btnPlay.innerHTML = '&#9654;';
        btnPlay.setAttribute('aria-label', 'Reproducir audio');
      }
    });

    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) { return; }
      const pct = (audio.currentTime / audio.duration) * 100;
      if (progressBar) { progressBar.style.width = `${pct}%`; }
      if (progressWrap) { progressWrap.setAttribute('aria-valuenow', Math.round(pct)); }
      const min = Math.floor(audio.currentTime / 60);
      const sec = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
      if (tiempo) { tiempo.textContent = `${min}:${sec}`; }
    });

    audio.addEventListener('ended', () => {
      btnPlay.innerHTML = '&#9654;';
      btnPlay.setAttribute('aria-label', 'Reproducir audio');
      if (progressBar) { progressBar.style.width = '0%'; }
    });

    progressWrap?.addEventListener('click', (e) => {
      if (!audio.duration) { return; }
      const rect = progressWrap.getBoundingClientRect();
      const pct  = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1));
      audio.currentTime = pct * audio.duration;
    });
  }
}

customElements.define('audio-guia', AudioGuia);
