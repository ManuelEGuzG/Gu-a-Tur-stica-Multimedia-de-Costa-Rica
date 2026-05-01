# Guía Turística Multimedia de Costa Rica

Aplicación web interactiva que permite explorar destinos turísticos de Costa Rica a través de imágenes, audio, video y datos estructurados. Desarrollada íntegramente con tecnologías nativas del navegador: **HTML5, CSS3, JavaScript ES6+ y la API de Web Components**.

> Proyecto Final — IF7102 Multimedios | I Ciclo 2026  
> Universidad de Costa Rica — Sede Regional de Guanacaste, Recinto de Liberia

---

## Requisitos previos

- **Node.js** v18 o superior (para el servidor de desarrollo)
- **pnpm** v8 o superior — [instalar pnpm](https://pnpm.io/installation)

> Los ES Modules (`import`/`export` y `<script type="module">`) **no funcionan abriendo el archivo HTML directamente** (`file://`). Es obligatorio servir el proyecto desde un servidor HTTP local.

---

## Cómo ejecutar el proyecto

### Opción 1 — Servidor incluido con `pnpm` (recomendado)

```bash
# 1. Instalar dependencias de desarrollo
pnpm install

# 2. Iniciar el servidor con recarga automática
pnpm dev
```

Abre el navegador en: **http://localhost:1234**

El servidor `servor` ya está configurado en `package.json` y sirve los archivos con soporte completo para ES Modules y recarga automática al guardar cambios.

---

### Opción 2 — Live Server (extensión de VS Code)

1. Instala la extensión **Live Server** de Ritwick Dey en VS Code.
2. Abre la carpeta del proyecto en VS Code.
3. Clic derecho sobre `index.html` → **"Open with Live Server"**.
4. El navegador abre en `http://127.0.0.1:5500`.

---

### Opción 3 — Python (sin instalación adicional)

```bash
# Python 3
python3 -m http.server 8080

# Luego abrir: http://localhost:8080
```

---

### Opción 4 — Despliegue en GitHub Pages

```bash
pnpm run deploy
```

Esto publica el proyecto en GitHub Pages usando `gh-pages`.

---

## Estructura del proyecto

```
Guía-Turística-Multimedia-de-Costa-Rica/
│
├── index.html              ← Punto de entrada principal
├── destinos.html           ← Vista de destinos (página secundaria)
│
├── components/             ← Un archivo .js por Custom Element
│   ├── app-header.js       ← Navbar con menú de regiones
│   ├── destino-card.js     ← Tarjeta resumen de un destino
│   ├── destino-detalle.js  ← Vista completa con galería, audio y video
│   ├── galeria-imagenes.js ← Galería con navegación anterior/siguiente
│   ├── audio-guia.js       ← Reproductor de audio personalizado
│   └── video-destino.js    ← Reproductor de video con poster (bonus)
│
├── data/
│   └── destinos.json       ← Base de datos de destinos turísticos
│
├── assets/
│   ├── img/
│   │   ├── destinos/       ← Imágenes de portada por destino
│   │   ├── carrucel/       ← Galería fotográfica general (20 fotos)
│   │   └── iconos/         ← Íconos de sección "Costa Rica en Cifras"
│   ├── audio/
│   │   └── musica-fondo.mp3
│   └── video/
│       └── hero.mp4
│
├── css/
│   ├── global.css          ← Reset, variables CSS y estilos base (único archivo global)
│   ├── portada.css         ← Estilos de la sección hero y portada
│   ├── mapa.css            ← Estilos del mapa SVG interactivo
│   ├── carrusel.css        ← Estilos del carrusel de fotos
│   ├── datos.css           ← Estilos de la sección "Costa Rica en Cifras"
│   └── destinos.css        ← Estilos del grid de destinos
│
├── docs/                   ← Documentación técnica del proyecto
│   └── documentacion-tecnica.md
│
├── package.json
├── pnpm-lock.yaml
├── README.md               ← Este archivo
└── CREDITOS.md             ← Fuentes y licencias de recursos multimedia
```

---

## Tecnologías utilizadas

### Núcleo

| Tecnología | Versión | Uso |
|---|---|---|
| HTML5 | — | Estructura semántica, elementos multimedia nativos |
| CSS3 | — | Estilos, variables, Grid, Flexbox, animaciones |
| JavaScript | ES2022+ | Lógica de componentes, fetch, eventos, DOM |

### API de Web Components

La aplicación implementa la API nativa de Web Components compuesta por cuatro estándares:

| API | Descripción | Uso en el proyecto |
|---|---|---|
| **Custom Elements v1** | Define elementos HTML propios con ciclo de vida | `<app-header>`, `<destino-card>`, `<destino-detalle>`, `<galeria-imagenes>`, `<audio-guia>`, `<video-destino>` |
| **Shadow DOM v1** | Encapsula estilos y DOM dentro del componente | Todos los componentes usan `attachShadow({ mode: 'open' })` |
| **HTML Templates** | Definición declarativa de plantillas reutilizables | Usado dentro del `innerHTML` del Shadow DOM en cada componente |
| **ES Modules** | Sistema de módulos nativo del navegador | `import`/`export` entre componentes; `<script type="module">` en HTML |

### APIs multimedia nativas

| API | Uso |
|---|---|
| `HTMLMediaElement` (`<audio>`) | Música de fondo y audio guía por destino dentro del Shadow DOM |
| `HTMLMediaElement` (`<video>`) | Video hero en la portada y reproductor por destino |
| `IntersectionObserver` | Animaciones de entrada al hacer scroll |
| `CustomEvent` | Comunicación entre componentes (`region-selected`, `destino-selected`, `audio-toggle`, `detalle-cerrado`) |
| `fetch()` | Carga dinámica de `destinos.json` |

---

## Custom Elements implementados

### `<app-header>`

Barra de navegación fija con logo, menú de regiones turísticas, control de audio e idioma.

```html
<app-header id="appHeader" active-region="guanacaste"></app-header>
```

| Atributo observado | Descripción |
|---|---|
| `active-region` | Resalta la región activa en el menú |

| Evento emitido | Descripción |
|---|---|
| `region-selected` | `{ detail: { regionId } }` — al hacer clic en una región |
| `audio-toggle` | `{ detail: { silenciado } }` — al alternar el audio de fondo |

---

### `<destino-card>`

Tarjeta resumen con imagen de portada, nombre y región. Estilos completamente encapsulados con Shadow DOM.

```html
<destino-card
  destino-id="guanacaste-001"
  nombre="Tamarindo"
  imagen="assets/img/destinos/tamarindo.jpg"
  region="Pacífico Norte"
></destino-card>
```

| Atributo observado | Descripción |
|---|---|
| `destino-id` | Identificador único del destino |
| `nombre` | Nombre del destino |
| `imagen` | Ruta de la imagen de portada |
| `region` | Nombre de la región turística |

| Evento emitido | Descripción |
|---|---|
| `destino-selected` | `{ detail: { id } }` — al hacer clic en la tarjeta |

---

### `<destino-detalle>`

Modal con la vista completa del destino. Integra internamente `<galeria-imagenes>`, `<audio-guia>` y `<video-destino>`.

```js
// Uso por propiedad (recomendado)
document.getElementById('destinoDetalle').mostrar(objetoDestino);
```

| Método | Descripción |
|---|---|
| `mostrar(destino)` | Recibe el objeto destino completo y despliega el modal |
| `cerrar()` | Cierra el modal programáticamente |

| Evento emitido | Descripción |
|---|---|
| `detalle-cerrado` | Emitido al cerrar el modal (botón o tecla Escape) |

---

### `<galeria-imagenes>`

Galería con navegación anterior/siguiente, puntos indicadores y soporte para swipe táctil. Shadow DOM.

```html
<galeria-imagenes imagenes='["foto1.jpg","foto2.jpg","foto3.jpg"]'></galeria-imagenes>
```

| Atributo observado | Descripción |
|---|---|
| `imagenes` | Array JSON serializado con las rutas de las imágenes |

---

### `<audio-guia>`

Reproductor de audio personalizado con botón play/pause y barra de progreso interactiva. Usa `<audio>` nativo dentro del Shadow DOM.

```html
<audio-guia src="assets/audio/guia.mp3" label="Audio guía: Tamarindo"></audio-guia>
```

| Atributo observado | Descripción |
|---|---|
| `src` | Ruta del archivo de audio |
| `label` | Texto descriptivo mostrado sobre el reproductor |

---

### `<video-destino>` *(bono)*

Reproductor de video con imagen miniatura (poster) y controles nativos del navegador. Shadow DOM.

```html
<video-destino src="assets/video/destino.mp4" poster="assets/img/portada.jpg"></video-destino>
```

| Atributo observado | Descripción |
|---|---|
| `src` | Ruta del archivo de video |
| `poster` | Ruta de la imagen miniatura |

---

## Flujo de eventos entre componentes

```
Usuario hace clic en región del menú
        │
        ▼
<app-header> emite CustomEvent('region-selected', { regionId })
        │
        ▼
Script inline en index.html escucha 'region-selected'
→ llama mostrar(region) → fetch('data/destinos.json')
→ renderiza elementos <destino-card> en el grid
        │
Usuario hace clic en una <destino-card>
        ▼
<destino-card> emite CustomEvent('destino-selected', { id })
        │
        ▼
Script inline escucha 'destino-selected'
→ busca destino en JSON → llama destinoDetalle.mostrar(destino)
        │
        ▼
<destino-detalle> renderiza modal con:
  ├── <galeria-imagenes imagenes='[...]'>
  ├── <audio-guia src="..." label="...">
  └── <video-destino src="..." poster="...">  (si hay video)
        │
Usuario cierra el modal (botón ✕ o tecla Escape)
        ▼
<destino-detalle> emite CustomEvent('detalle-cerrado')
```

---

## Datos de los destinos (`destinos.json`)

Cada entrada del JSON sigue la estructura definida en el enunciado del curso:

```json
{
  "id": "guanacaste-001",
  "nombre": "Tamarindo",
  "region": "Pacífico Norte",
  "region_id": "guanacaste",
  "descripcion": "...",
  "imagen_portada": "assets/img/destinos/tamarindo.jpg",
  "galeria": ["assets/img/carrucel/foto-1.jpg", "..."],
  "audio": "assets/audio/musica-fondo.mp3",
  "video": "assets/video/hero.mp4",
  "actividades": ["Surf", "Snorkel", "..."],
  "lat": 10.2993,
  "lng": -85.8367
}
```

### Cobertura de regiones

| Región | Destinos |
|---|---|
| Pacífico Norte | Tamarindo, Rincón de la Vieja |
| Pacífico Central | Manuel Antonio, Uvita y Marino Ballena |
| Huetar Atlántica (Caribe) | Cahuita, Puerto Viejo de Talamanca |
| Huetar Norte | Volcán Poás |
| Central Sur | Valle de Orosi |

---

## Créditos y licencias

Ver archivo [CREDITOS.md](CREDITOS.md) para las fuentes y licencias de todos los recursos multimedia utilizados (imágenes, audio, video y SVG).

---

## Integrantes del grupo

| Nombre | Rol |
|---|---|
| — | Líder / Arquitecto de componentes |
| — | Desarrollador de componentes de navegación |
| — | Desarrollador de componentes de destino |
| — | Productor multimedia |
| — | Diseñador UI/UX |

---

*IF7102 Multimedios | I Ciclo 2026 | UCR Sede Regional de Guanacaste, Recinto de Liberia*  
*Docente: Lic. Alonso Chavarría Cubero*
