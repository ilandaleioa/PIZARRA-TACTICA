// Exponer funciones globales para el HTML

window.switchTab = switchTab;
window.applyFormation = applyFormation;

// --- Servidor Express para servir la app ---
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos (index.html, styles.css, etc.)
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
window.exportImage = exportImage;
window.exportVideo = exportVideo;
window.toggleFullscreen = toggleFullscreen;
window.toggleTheme = toggleTheme;
window.setLang = setLang;
window.toggleTeamVisibility = toggleTeamVisibility;
window.loadNavLogo = loadNavLogo;
window.setModalPos = setModalPos;
window.savePlayerModal = savePlayerModal;
// Exponer funciones globales para el HTML
window.switchTab = switchTab;
window.applyFormation = applyFormation;
// Quitar todos los jugadores de la pizarra
function quitarJugadores() {
  // Borra solo los nombres de los jugadores en el campo, pero mantiene los círculos
  if (window.state && Array.isArray(window.state.players)) {
    window.state.players.forEach(p => {
      p.name = '';
      p.abbr = '';
      // Si quieres mantener dorsal y posición, no los toques
    });
  }
  // Actualiza la UI
  if (typeof renderPlayers === 'function') {
    renderPlayers();
  } else if (typeof renderPitchPlayers === 'function') {
    renderPitchPlayers();
  }
}
/* ═══════════════════════════════════════════════
   AC CENTER – PIZARRA TÁCTICA  |  app.js
═══════════════════════════════════════════════ */

'use strict';

// ─── I18N ────────────────────────────────────
const LANGS = {
  es: {
    plantilla:'PLANTILLA', pizarra:'PIZARRA TÁCTICA', mi_equipo:'MI EQUIPO',
    equipo_rival:'EQUIPO RIVAL', imagen:'IMAGEN', video:'VIDEO',
    deshacer:'DESHACER', compartir:'COMPARTIR', resetear:'RESETEAR',
    asignar:'ASIGNAR JUGADORES A PIZARRA', plantilla_desc:'Gestiona tu plantilla de jugadores.',
    portero:'PORTERO', defensa:'DEFENSA', medio:'MEDIO', delantero:'DELANTERO',
  },
  eu: {
    plantilla:'PLANTILA', pizarra:'ARBEL TAKTIKOA', mi_equipo:'NIRE TALDEA',
    equipo_rival:'AURKARIKO TALDEA', imagen:'IRUDIA', video:'BIDEOA',
    deshacer:'DESEGIN', compartir:'PARTEKATU', resetear:'BERREZARRI',
    asignar:'JOKALARIAK ARBELA ESLEITU', plantilla_desc:'Kudeatu zure jokalari-zerrenda.',
    portero:'ATEZAINA', defensa:'DEFENTSA', medio:'ERDIKO', delantero:'AURRELARIA',
  },
  fr: {
    plantilla:'EFFECTIF', pizarra:'TABLEAU TACTIQUE', mi_equipo:'MON ÉQUIPE',
    equipo_rival:'ÉQUIPE RIVALE', imagen:'IMAGE', video:'VIDÉO',
    deshacer:'ANNULER', compartir:'PARTAGER', resetear:'RÉINITIALISER',
    asignar:'ASSIGNER DES JOUEURS', plantilla_desc:'Gérez votre effectif.',
    portero:'GARDIEN', defensa:'DÉFENSE', medio:'MILIEU', delantero:'ATTAQUE',
  },
  en: {
    plantilla:'SQUAD', pizarra:'TACTICAL BOARD', mi_equipo:'MY TEAM',
    equipo_rival:'RIVAL TEAM', imagen:'IMAGE', video:'VIDEO',
    deshacer:'UNDO', compartir:'SHARE', resetear:'RESET',
    asignar:'ASSIGN PLAYERS TO BOARD', plantilla_desc:'Manage your squad.',
    portero:'GOALKEEPER', defensa:'DEFENCE', medio:'MIDFIELD', delantero:'FORWARD',
  },
};

let currentLang = 'es';

// ─── THEME ───────────────────────────────────
function toggleTheme() {
  const isLight = document.body.classList.toggle('light');
  const btn = document.getElementById('theme-btn');
  btn.innerHTML = isLight ? '&#9790;' : '&#9728;';
  btn.title = isLight ? 'Modo oscuro' : 'Modo claro';
  localStorage.setItem('ac-theme', isLight ? 'light' : 'dark');
}

(function applyStoredTheme() {
  const stored = localStorage.getItem('ac-theme');
  if (stored === 'light') {
    document.body.classList.add('light');
    const btn = document.getElementById('theme-btn');
    if (btn) { btn.innerHTML = '&#9790;'; btn.title = 'Modo oscuro'; }
  }
})();

function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang').forEach(b => b.classList.toggle('active', b.textContent === lang.toUpperCase()));
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (LANGS[lang][key]) el.textContent = LANGS[lang][key];
  });
  renderPlayerList();
  if (!document.getElementById('plantilla-view').classList.contains('hidden')) renderPlantillaView();
}

// ─── SQUAD DATA ──────────────────────────────
const CDN = 'https://cdn.athletic-club.eus/imagenes/player_images/medium/';
const SQUAD = {
  portero: [
    { id: 'US', name: 'Unai Simón',  abbr: 'U.S', dorsal: 1,  edad: 27, photo: CDN+'unai-simon-mendibil_L.png' },
    { id: 'PA', name: 'Padilla',     abbr: 'PAD', dorsal: 27, edad: 23, photo: CDN+'alex-padilla-perez_L.png' },
  ],
  defensa: [
    { id: 'GO', name: 'Gorosabel',  abbr: 'GOR', dorsal: 2,  edad: 28, photo: CDN+'andoni-gorosabel-espinosa_L.png' },
    { id: 'VI', name: 'Vivian',     abbr: 'VIV', dorsal: 3,  edad: 25, photo: CDN+'daniel-vivian-moreno_L.png' },
    { id: 'PR', name: 'Paredes',    abbr: 'PAR', dorsal: 4,  edad: 23, photo: CDN+'aitor-paredes-casamichana_L.png' },
    { id: 'YE', name: 'Yeray',      abbr: 'YER', dorsal: 5,  edad: 30, photo: CDN+'yeray-alvarez-lopez.png' },
    { id: 'AR', name: 'Areso',      abbr: 'ARE', dorsal: 12, edad: 26, photo: CDN+'jesus-areso-blanco_L.png' },
    { id: 'EG', name: 'Egiluz',     abbr: 'EGI', dorsal: 13, edad: 22, photo: CDN+'unai-egiluz-arroyo_L.png' },
    { id: 'LA', name: 'Laporte',    abbr: 'LAP', dorsal: 14, edad: 31, photo: CDN+'aymeric-laporte.png' },
    { id: 'IL', name: 'I. Lekue',   abbr: 'LEK', dorsal: 15, edad: 32, photo: CDN+'inigo-lekue-martinez_L.png' },
    { id: 'YU', name: 'Yuri',       abbr: 'YUR', dorsal: 17, edad: 34, photo: CDN+'yuri-berchiche-izeta_L.png' },
    { id: 'AD', name: 'Adama',      abbr: 'ADA', dorsal: 19, edad: 25, photo: CDN+'adama-boiro-boiro_L.png' },
    { id: 'KM', name: 'Monreal',    abbr: 'MON', dorsal: 47, edad: 20, photo: CDN+'iker-monreal-agundez.png' },
  ],
  medio: [
    { id: 'VE', name: 'Vesga',          abbr: 'VES', dorsal: 6,  edad: 32, photo: CDN+'mikel-vesga-arruti_L.png' },
    { id: 'SA', name: 'O. Sancet',       abbr: 'SAN', dorsal: 8,  edad: 23, photo: CDN+'oihan-sancet-tirapu_L.png' },
    { id: 'RG', name: 'R. de Galarreta', abbr: 'GAL', dorsal: 16, edad: 31, photo: CDN+'inigo-ruiz-de-galarreta-etxeberria_L.png' },
    { id: 'JZ', name: 'Jauregizar',      abbr: 'JAU', dorsal: 18, edad: 24, photo: CDN+'mikel-jauregizar-alboniga_L.png' },
    { id: 'UG', name: 'Unai Gómez',      abbr: 'U.G', dorsal: 20, edad: 26, photo: CDN+'unai-gomez-etxebarria_L.png' },
    { id: 'PD', name: 'Prados',          abbr: 'PRA', dorsal: 24, edad: 24, photo: CDN+'benat-prados-diaz_L.png' },
    { id: 'RE', name: 'Rego',            abbr: 'REG', dorsal: 30, edad: 22, photo: CDN+'alejandro-rego-mora_L.png' },
    { id: 'IS', name: 'Ibon Sánchez',    abbr: 'IBN', dorsal: 35, edad: 21, photo: CDN+'ibon-sanchez-ocen.png' },
    { id: 'SE', name: 'Selton',          abbr: 'SEL', dorsal: 44, edad: 22, photo: CDN+'selton-sued-sanchez-camilo.png' },
  ],
  delantero: [
    { id: 'BE', name: 'Berenguer',    abbr: 'BER', dorsal: 7,  edad: 30, photo: CDN+'alejandro-berenguer-remiro_L.png' },
    { id: 'IW', name: 'I. Williams',  abbr: 'I.W', dorsal: 9,  edad: 31, photo: CDN+'inaki-williams-arthuer_L.png' },
    { id: 'NW', name: 'Nico Williams',abbr: 'N.W', dorsal: 10, edad: 23, photo: CDN+'nico-williams-arthuer_L.png' },
    { id: 'GU', name: 'Guruzeta',     abbr: 'GUR', dorsal: 11, edad: 28, photo: CDN+'gorka-guruzeta-rodriguez_L.png' },
    { id: 'MA', name: 'Maroan',       abbr: 'MAR', dorsal: 21, edad: 22, photo: CDN+'maroan-sannadi-harrouch_L.png' },
    { id: 'NS', name: 'Nico Serrano', abbr: 'N.S', dorsal: 22, edad: 22, photo: CDN+'nico-serrano-galdeano_L.png' },
    { id: 'NA', name: 'Navarro',      abbr: 'NAV', dorsal: 23, edad: 24, photo: CDN+'robert-navarro-munoz_L.png' },
    { id: 'IZ', name: 'Izeta',        abbr: 'IZE', dorsal: 25, edad: 21, photo: CDN+'urko-iruretagoiena-lertxundi_L.png' },
    { id: 'HI', name: 'Hierro',       abbr: 'HIE', dorsal: 31, edad: 21, photo: CDN+'asier-hierro-campo.png' },
  ],
};

// ─── FORMATIONS ──────────────────────────────
// Positions as % [left, top] relative to the pitch.
// "My team" plays bottom half (top ~50%–95%), rival top half (~5%–50%).
const FORMATIONS = {
  // Área grande superior: 0–20% | Área grande inferior: 80–100%
  // mi equipo: GK=93%, DEF=80%, MED=57%, FWD=34%  → step ~23% igual entre líneas
  // rival:     GK=7%,  DEF=20%, MED=43%, FWD=66%  → step ~23% igual entre líneas
  // Laterales/extremos adelantados 3% respecto a sus compañeros de línea
  '1-4-4-2': {
    my: [
      [50,  93],  // 1 GK
      [82,  77],  // 2 Lat Der  (adelantado)
      [13,  77],  // 3 Lat Izq  (adelantado)
      [35,  80],  // 4 Central Izq
      [60,  80],  // 5 Central Der
      [34,  57],  // 6 Medio centro
      [82,  54],  // 7 Extremo Der  (adelantado)
      [58,  57],  // 8 Medio centro
      [37,  34],  // 9 Delantero Izq
      [58,  34],  // 10 Delantero Der
      [10,  54],  // 11 Extremo Izq  (adelantado)
    ],
    rival: [
      [50,   7],  // 1 GK
      [82,  23],  // 2 Lat Der  (adelantado)
      [13,  23],  // 3 Lat Izq  (adelantado)
      [35,  20],  // 4 Central Izq
      [60,  20],  // 5 Central Der
      [34,  43],  // 6 Medio centro
      [82,  46],  // 7 Extremo Der  (adelantado)
      [58,  43],  // 8 Medio centro
      [37,  66],  // 9 Delantero Izq
      [58,  66],  // 10 Delantero Der
      [10,  46],  // 11 Extremo Izq  (adelantado)
    ]
  },
  '1-4-3-3': {
    my: [
      [50,  93],  // 1 GK
      [83,  77],  // 2 Lat Der  (adelantado)
      [8,   77],  // 3 Lat Izq  (adelantado)
      [36,  80],  // 4 Central Izq
      [60,  80],  // 5 Central Der
      [50,  62],  // 6 Medio pivote (más profundo)
      [68,  49],  // 7 Interior Der (más avanzado)
      [27,  49],  // 8 Interior Izq (más avanzado)
      [83,  34],  // 9 Extremo Der
      [50,  34],  // 10 Delantero Centro
      [8,   34],  // 11 Extremo Izq
    ],
    rival: [
      [50,   7],  // 1 GK
      [83,  23],  // 2 Lat Der  (adelantado)
      [8,   23],  // 3 Lat Izq  (adelantado)
      [36,  20],  // 4 Central Izq
      [60,  20],  // 5 Central Der
      [50,  38],  // 6 Medio pivote (más profundo)
      [68,  51],  // 7 Interior Der (más avanzado)
      [27,  51],  // 8 Interior Izq (más avanzado)
      [83,  66],  // 9 Extremo Der
      [50,  66],  // 10 Delantero Centro
      [8,   66],  // 11 Extremo Izq
    ]
  },
  '1-4-2-3-1': {
    my: [
      [50,  93],  // 1 GK
      [18,  77], [38, 80], [62, 80], [82, 77],  // DEF: laterales adelantados
      [36,  57], [64, 57],                       // doble pivote
      [15,  41], [50, 44], [85, 41],             // mediapuntas: extremos adelantados
      [50,  31],                                 // delantero
    ],
    rival: [
      [50,   7],  // 1 GK
      [18,  23], [38, 20], [62, 20], [82, 23],  // DEF: laterales adelantados
      [36,  43], [64, 43],                       // doble pivote
      [15,  59], [50, 56], [85, 59],             // mediapuntas: extremos adelantados
      [50,  69],                                 // delantero
    ]
  },
  '1-3-5-2': {
    my: [
      [50,  93],  // 1 GK
      [25,  80], [50, 80], [75, 80],             // 3 DEF
      [8,   54], [28, 57], [50, 57], [72, 57], [92, 54],  // 5 MED: carrileros adelantados
      [34,  34], [66, 34],                       // 2 DEL
    ],
    rival: [
      [50,   7],  // 1 GK
      [25,  20], [50, 20], [75, 20],             // 3 DEF
      [8,   46], [28, 43], [50, 43], [72, 43], [92, 46],  // 5 MED: carrileros adelantados
      [34,  66], [66, 66],                       // 2 DEL
    ]
  },
  '1-3-4-3': {
    my: [
      [50,  93],  // 1 GK
      [25,  80], [50, 80], [75, 80],             // 3 DEF
      [15,  54], [38, 57], [62, 57], [85, 54],   // 4 MED: extremos adelantados
      [15,  34], [50, 34], [85, 34],             // 3 DEL
    ],
    rival: [
      [50,   7],  // 1 GK
      [25,  20], [50, 20], [75, 20],             // 3 DEF
      [15,  46], [38, 43], [62, 43], [85, 46],   // 4 MED: extremos adelantados
      [15,  66], [50, 66], [85, 66],             // 3 DEL
    ]
  },
  '1-5-3-2': {
    my: [
      [50,  93],  // 1 GK
      [8,   77], [26, 80], [50, 80], [74, 80], [92, 77],  // 5 DEF: carrileros adelantados
      [25,  57], [50, 57], [75, 57],             // 3 MED
      [34,  34], [66, 34],                       // 2 DEL
    ],
    rival: [
      [50,   7],  // 1 GK
      [8,   23], [26, 20], [50, 20], [74, 20], [92, 23],  // 5 DEF: carrileros adelantados
      [25,  43], [50, 43], [75, 43],             // 3 MED
      [34,  66], [66, 66],                       // 2 DEL
    ]
  },
  '1-5-4-1': {
    my: [
      [50,  93],  // 1 GK
      [8,   77], [26, 80], [50, 80], [74, 80], [92, 77],  // 5 DEF: carrileros adelantados
      [15,  54], [38, 57], [62, 57], [85, 54],  // 4 MED: extremos adelantados
      [50,  34],                                 // 1 DEL
    ],
    rival: [
      [50,   7],  // 1 GK
      [8,   23], [26, 20], [50, 20], [74, 20], [92, 23],  // 5 DEF: carrileros adelantados
      [15,  46], [38, 43], [62, 43], [85, 46],  // 4 MED: extremos adelantados
      [50,  66],                                 // 1 DEL
    ]
  },
};

// ─── STATE ───────────────────────────────────
const GK_COLOR      = '#E91E8C';   // portero mi equipo rosa
const RIVAL_GK_COLOR = '#FDD835';  // portero rival siempre amarillo
const MY_COLOR    = '#C62828';   // mi equipo rojo por defecto
const RIVAL_COLOR = '#1565C0';   // rival azul por defecto

let state = {
  myColor:    MY_COLOR,
  rivalColor: RIVAL_COLOR,
  myFormation:    '1-4-4-2',
  rivalFormation: '1-4-4-2',
  slides: [null],   // will be populated
  currentSlide: 0,
  players: [],      // { id, team, jersey, x, y, name, abbr, photo }
  assignedPlayers: {},  // jerseyKey -> squad player id
    ball: { x: 50, y: 50 },     // balón (centro)
  photoMode: false, // mostrar fotos de jugadores en los tokens
};

let history = [];   // undo stack

// ─── INIT ────────────────────────────────────
// Player photos (base64) stored per player id
const playerPhotos = {};

function loadPhotos() {
  try {
    const stored = localStorage.getItem('acPlayerPhotos');
    if (stored) Object.assign(playerPhotos, JSON.parse(stored));
  } catch(e) {}
}

function savePhotos() {
  try { localStorage.setItem('acPlayerPhotos', JSON.stringify(playerPhotos)); } catch(e) {}
}

document.addEventListener('DOMContentLoaded', () => {
  loadPhotos();
  initNavLogo();
  initState();
  renderPlayers();
  renderPlayerList();
  renderSlideChips();
  setupCanvas();
  setupBall();
  // Forzar escudo por defecto si no hay imagen
  const img = document.getElementById('nav-logo-img');
  if (img && (!img.src || img.src.endsWith('ACFC Blanco Cuadrado.png.png'))) {
    img.src = DEFAULT_LOGO;
    img.style.display = 'block';
  }
  // Mostrar por defecto la vista de MI EQUIPO (pizarra)
  if (typeof switchTab === 'function') {
    switchTab('pizarra');
    if (typeof renderPlayers === 'function') {
      renderPlayers();
    }
  }
});

const DEFAULT_LOGO = 'https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Athletic_Club_crest.svg/100px-Athletic_Club_crest.svg.png';

function initNavLogo() {
  const img         = document.getElementById('nav-logo-img');
  const placeholder = document.getElementById('nav-logo-placeholder');
  const wrap        = img ? img.closest('.nav-logo-wrap') : null;
  if (!img || !wrap) return;
  const saved = localStorage.getItem('ac-nav-logo') || DEFAULT_LOGO;
  img.src = saved;
  img.style.display = 'block';
  if (placeholder) placeholder.style.display = 'none';
  wrap.classList.add('has-logo');
}

function loadNavLogo(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img         = document.getElementById('nav-logo-img');
    const placeholder = document.getElementById('nav-logo-placeholder');
    const wrap        = img.closest('.nav-logo-wrap');
    img.src = e.target.result;
    img.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';
    wrap.classList.add('has-logo');
    try { localStorage.setItem('ac-nav-logo', e.target.result); } catch(err) {}
  };
  reader.readAsDataURL(file);
}

function initState() {
  const myPos    = FORMATIONS['1-4-4-2'].my;
  const rivalPos = FORMATIONS['1-4-4-2'].rival;

  state.players = [];
  // Poblar equipo propio con datos reales
  const squadList = [].concat(SQUAD.portero, SQUAD.defensa, SQUAD.medio, SQUAD.delantero);
  for (let i = 0; i < 11; i++) {
    const jugador = squadList[i] || { name: '', abbr: '', dorsal: i + 1, photo: '', edad: '', id: `my-${i}` };
    state.players.push({
      id: `my-${i}`,
      team: 'my',
      jersey: jugador.dorsal || i + 1,
      x: myPos[i][0],
      y: myPos[i][1],
      name: jugador.name || '',
      abbr: jugador.abbr || '',
      photo: jugador.photo || '',
      edad: jugador.edad || '',
    });
    // Rival sigue vacío
    state.players.push({ id: `rival-${i}`, team: 'rival', jersey: i + 1, x: rivalPos[i][0], y: rivalPos[i][1], name: '', abbr: '' });
  }
  // Balón en el centro del campo
  state.ball = { x: 50, y: 50 };
  // Populate slide 0 with initial positions
  state.slides[0] = {
    players: JSON.parse(JSON.stringify(state.players)),
    ball: { ...state.ball },
  };
  saveHistory();
}

// ─── SELECTED TOKEN ─────────────────────────
let selectedTokenId = null;

function selectToken(id) {
  // Deselect previous
  if (selectedTokenId) {
    const prev = document.getElementById('token-' + selectedTokenId);
    if (prev) prev.classList.remove('selected');
  }
  if (selectedTokenId === id) {
    // Second click on same token → deselect
    selectedTokenId = null;
    updateAssignHint();
    return;
  }
  selectedTokenId = id;
  const el = document.getElementById('token-' + id);
  if (el) el.classList.add('selected');
  updateAssignHint();

  // En móvil abrir el panel de asignación automáticamente
  if (window.innerWidth <= 768) {
    openMobileAssignModal();
  }
}

function updateAssignHint() {
  const hint = document.getElementById('assign-hint');
  if (!hint) return;
  if (selectedTokenId) {
    const p = state.players.find(pl => pl.id === selectedTokenId);
    hint.textContent = `Círculo ${p ? p.jersey : ''} seleccionado — ahora elige un jugador`;
    hint.classList.add('active');
  } else {
    hint.textContent = 'Pulsa un círculo del campo para asignar jugador';
    hint.classList.remove('active');
  }
}

// ─── RENDER PLAYERS ──────────────────────────
function renderPlayers() {
  const container = document.getElementById('players-container');
  container.innerHTML = '';
  state.players.forEach(p => {
    const el = document.createElement('div');
    const usePhoto = state.photoMode && p.name && p.photo;
    el.className = 'player-token' + (p.name ? ' has-player' : '') + (usePhoto ? ' photo-mode' : '');
    el.id = 'token-' + p.id;
    el.style.left = p.x + '%';
    el.style.top  = p.y + '%';
    // Portero mi equipo = negro, portero rival = amarillo
    const isMyGK    = p.team === 'my'    && p.jersey === 1;
    const isRivalGK = p.team === 'rival' && p.jersey === 1;
    const color = isMyGK ? GK_COLOR : isRivalGK ? RIVAL_GK_COLOR : (p.team === 'my' ? state.myColor : state.rivalColor);
    el.style.background = usePhoto ? 'transparent' : color;
    el.style.border = `2px solid ${usePhoto ? lighten(color, 40) : (isMyGK || isRivalGK) ? '#555' : p.name ? '#000' : lighten(color, 40)}`;
    el.style.color = isLight(color) ? '#111' : '#fff';

    if (usePhoto) {
      el.innerHTML = `<div class="token-photo-wrap"><img class="token-photo" src="${p.photo}" onerror="this.parentElement.style.display='none'"></div><span class="dorsal-badge">${p.dorsal || p.jersey}</span><span class="token-name-label">${p.name}</span>`;
    } else if (p.name) {
      el.innerHTML = `<span class="jersey-num">${p.dorsal || p.jersey}</span><span class="token-initials">${p.name}</span>`;
    } else {
      el.textContent = p.jersey;
    }

    // Respect current visibility state
    if (!teamVisible[p.team]) el.style.visibility = 'hidden';

    // Click to select (only my team tokens)
    if (p.team === 'my') {
      el.addEventListener('click', e => {
        if (el.classList.contains('dragging')) return;
        e.stopPropagation();
        selectToken(p.id);
      });
    }

    makeDraggable(el, p);
    container.appendChild(el);
  });
}

// ─── DRAG ────────────────────────────────────

// Sin restricciones de orden: cada jugador puede moverse libremente por el campo.
function computeYLimits(playerData) {
  return { yMin: 1, yMax: 99 };
}

function makeDraggable(el, playerData) {
  let offsetX, offsetY, pitchRect, yMin, yMax;

  el.addEventListener('mousedown', e => {
    e.preventDefault();
    saveHistory();
    const limits = computeYLimits(playerData);
    yMin = limits.yMin;
    yMax = limits.yMax;
    pitchRect = document.getElementById('pitch').getBoundingClientRect();
    const elRect  = el.getBoundingClientRect();
    const elCenterX = elRect.left + elRect.width  / 2;
    const elCenterY = elRect.top  + elRect.height / 2;
    offsetX = e.clientX - elCenterX;
    offsetY = e.clientY - elCenterY;
    el.classList.add('dragging');

    document.onmousemove = mv => {
      const x = ((mv.clientX - offsetX - pitchRect.left) / pitchRect.width)  * 100;
      const y = ((mv.clientY - offsetY - pitchRect.top)  / pitchRect.height) * 100;
      playerData.x = Math.min(Math.max(x, 1), 99);
      playerData.y = Math.min(Math.max(y, yMin), yMax);
      el.style.left = playerData.x + '%';
      el.style.top  = playerData.y + '%';
    };

    document.onmouseup = () => {
      el.classList.remove('dragging');
      document.onmousemove = null;
      document.onmouseup   = null;
    };
  });

  // Touch support
  el.addEventListener('touchstart', e => {
    e.preventDefault();
    saveHistory();
    const limits = computeYLimits(playerData);
    yMin = limits.yMin;
    yMax = limits.yMax;
    pitchRect = document.getElementById('pitch').getBoundingClientRect();
    const t = e.touches[0];
    const elRect    = el.getBoundingClientRect();
    const elCenterX = elRect.left + elRect.width  / 2;
    const elCenterY = elRect.top  + elRect.height / 2;
    offsetX = t.clientX - elCenterX;
    offsetY = t.clientY - elCenterY;
    el.classList.add('dragging');

    el.ontouchmove = mv => {
      mv.preventDefault();
      const tc = mv.touches[0];
      const x = ((tc.clientX - offsetX - pitchRect.left) / pitchRect.width)  * 100;
      const y = ((tc.clientY - offsetY - pitchRect.top)  / pitchRect.height) * 100;
      playerData.x = Math.min(Math.max(x, 1), 99);
      playerData.y = Math.min(Math.max(y, yMin), yMax);
      el.style.left = playerData.x + '%';
      el.style.top  = playerData.y + '%';
    };
    el.ontouchend = () => {
      el.classList.remove('dragging');
      el.ontouchmove = null;
      el.ontouchend  = null;
    };
  }, { passive: false });
}

// ─── FORMATION ───────────────────────────────
function applyFormation(team) {
  const sel = document.getElementById(team === 'my' ? 'my-formation' : 'rival-formation');
  const name = sel.value;
  if (team === 'my')    state.myFormation    = name;
  else                  state.rivalFormation = name;

  const def = FORMATIONS[name];
  if (!def) return;

  saveHistory();
  const positions = team === 'my' ? def.my : def.rival;
  state.players.filter(p => p.team === team).forEach((p, i) => {
    if (positions[i]) { p.x = positions[i][0]; p.y = positions[i][1]; }
    const el = document.getElementById('token-' + p.id);
    if (el) { el.style.left = p.x + '%'; el.style.top = p.y + '%'; }
  });
}

// ─── COLORS ──────────────────────────────────
function setTeamColor(team, color) {
  if (team === 'my') state.myColor    = color;
  else               state.rivalColor = color;

  // Update swatch selection
  const palette = document.getElementById(team + '-colors');
  palette.querySelectorAll('.color-swatch').forEach(sw => {
    sw.classList.toggle('selected', sw.style.background === color ||
      rgbToHex(sw.style.background) === color.toLowerCase());
  });

  // Re-render tokens for that team (skip GKs – they have fixed colors)
  state.players.filter(p => p.team === team).forEach(p => {
    if (p.jersey === 1) return; // GK keeps its fixed color
    const el = document.getElementById('token-' + p.id);
    if (!el) return;
    el.style.background = color;
    el.style.border = `2px solid ${p.name ? '#000' : lighten(color, 40)}`;
    el.style.color = isLight(color) ? '#111' : '#fff';
  });
}

// ─── RIGHT PANEL: PLAYER LIST ─────────────────
function renderPlayerList() {
  const lang = LANGS[currentLang];
  const container = document.getElementById('player-list');
  container.innerHTML = '';

  // Hint bar
  const hint = document.createElement('div');
  hint.id = 'assign-hint';
  hint.className = 'assign-hint';
  hint.textContent = 'Pulsa un círculo del campo para asignar jugador';
  container.appendChild(hint);
  updateAssignHint();

  const positions = [
    { key: 'portero',   label: lang.portero,   cls: 'assigned-gk'  },
    { key: 'defensa',   label: lang.defensa,   cls: 'assigned-def' },
    { key: 'medio',     label: lang.medio,     cls: 'assigned-mid' },
    { key: 'delantero', label: lang.delantero, cls: 'assigned-fwd' },
  ];

  positions.forEach(pos => {
    const group = document.createElement('div');
    group.className = 'position-group';
    const lbl = document.createElement('div');
    lbl.className = 'position-label';
    lbl.textContent = pos.label;
    group.appendChild(lbl);

    SQUAD[pos.key].forEach(player => {
      const isAssigned = Object.values(state.assignedPlayers).includes(player.id);
      const row = document.createElement('div');
      row.className = 'player-row' + (isAssigned ? ' assigned' : '');
      row.title = player.name;

      const avatar = document.createElement('div');
      avatar.className = 'player-avatar' + (isAssigned ? ` ${pos.cls}` : '');
      avatar.textContent = player.dorsal;

      const name = document.createElement('div');
      name.className = 'player-name';
      name.textContent = player.name;

      row.appendChild(avatar);
      row.appendChild(name);

      if (!isAssigned) {
        row.addEventListener('click', () => assignPlayer(player, pos.key));
      }
      group.appendChild(row);
    });
    container.appendChild(group);
  });
}

// Assign a squad player to a selected token, or next free slot
function assignPlayer(player, posKey) {
  let slot;

  if (selectedTokenId) {
    // Assign to the specifically selected token
    slot = state.players.find(p => p.id === selectedTokenId && p.team === 'my');
  }

  if (!slot) {
    // Fallback: portero al slot 1, resto al siguiente libre en orden
    if (posKey === 'portero') {
      slot = state.players.find(p => p.team === 'my' && p.jersey === 1 && !p.name);
    } else {
      slot = state.players
        .filter(p => p.team === 'my' && p.jersey > 1 && !p.name)
        .sort((a, b) => a.jersey - b.jersey)[0];
    }
  }
  if (!slot) return;

  saveHistory();
  slot.name   = player.name;
  slot.abbr   = player.abbr;
  slot.dorsal = player.dorsal;
  slot.photo  = player.photo;
  state.assignedPlayers[slot.id] = player.id;

  const el = document.getElementById('token-' + slot.id);
  if (el) {
    el.classList.add('has-player');
    el.classList.remove('selected');
    const usePhotoNow = state.photoMode && !!player.photo;
    el.classList.toggle('photo-mode', usePhotoNow);
    if (usePhotoNow) {
      el.style.background = 'transparent';
      el.innerHTML = `<div class="token-photo-wrap"><img class="token-photo" src="${player.photo}" onerror="this.parentElement.style.display='none'"></div><span class="dorsal-badge">${player.dorsal}</span><span class="token-name-label">${slot.name}</span>`;
    } else {
      el.style.background = state.myColor;
      el.style.border = '2px solid #000';
      el.innerHTML = `<span class="jersey-num">${player.dorsal}</span><span class="token-initials">${slot.name}</span>`;
    }
    el.style.color = isLight(state.myColor) ? '#111' : '#fff';
  }

  // Clear selection
  selectedTokenId = null;
  updateAssignHint();
  renderPlayerList();

  // En móvil: cerrar la vista plantilla y volver al campo
  if (window.innerWidth <= 768) {
    const pv = document.getElementById('plantilla-view');
    if (pv && !pv.classList.contains('hidden')) {
      closeMobilePanels();
    }
  }
}

// ─── PHOTO MODE ──────────────────────────────
function togglePhotoMode() {
  state.photoMode = !state.photoMode;
  const btn = document.getElementById('btn-photo-mode');
  if (btn) {
    btn.classList.toggle('active', state.photoMode);
    btn.title = state.photoMode ? 'Ocultar fotos de jugadores' : 'Mostrar fotos de jugadores';
  }
  renderPlayers();
}

// ─── TAB SWITCH ──────────────────────────────
function switchTab(tab) {
  document.getElementById('tab-plantilla').classList.toggle('active', tab === 'plantilla');
  document.getElementById('tab-pizarra').classList.toggle('active', tab === 'pizarra');
  document.getElementById('section-pizarra').classList.toggle('hidden', tab !== 'pizarra');
  document.getElementById('section-plantilla').classList.toggle('hidden', tab !== 'plantilla');

  // Mostrar/ocultar la pizarra y la plantilla correctamente
  const centerArea = document.querySelector('.center-area');
  const sidebarRight = document.querySelector('.sidebar-right');
  const pv = document.getElementById('plantilla-view');
  if (tab === 'plantilla') {
    centerArea.classList.add('hidden');
    sidebarRight.classList.add('hidden');
    pv.classList.remove('hidden');
    renderPlantillaView();
  } else {
    centerArea.classList.remove('hidden');
    sidebarRight.classList.remove('hidden');
    pv.classList.add('hidden');
    // Siempre renderizar jugadores al volver a la pizarra
    if (typeof renderPlayers === 'function') renderPlayers();
  }
}

// ─── PLANTILLA VIEW ──────────────────────────
function avatarColor(posKey) {
  return { portero: '#4e342e', defensa: '#1565c0', medio: '#2e7d32', delantero: '#C62828' }[posKey] || '#444';
}

function renderPlantillaView() {
  const lang = LANGS[currentLang];
  const container = document.getElementById('plantilla-content');
  container.innerHTML = '';

  const positions = [
    { key: 'portero',   label: lang.portero },
    { key: 'defensa',   label: lang.defensa },
    { key: 'medio',     label: lang.medio },
    { key: 'delantero', label: lang.delantero },
  ];

  positions.forEach(pos => {
    const section = document.createElement('div');
    section.className = 'plantilla-pos-section';

    const heading = document.createElement('div');
    heading.className = 'plantilla-pos-label';
    heading.textContent = pos.label;
    section.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'player-cards-grid';

    SQUAD[pos.key].forEach(player => {
      const photoSrc = playerPhotos[player.id] || player.photo || null;
      const card = document.createElement('div');
      card.className = 'player-card';
      card.title = 'Editar jugador';
      card.onclick = () => openPlayerModal(player.id, pos.key);

      card.innerHTML = `
        <div class="pc-dorsal">${player.dorsal}</div>
        <div class="pc-avatar" style="${photoSrc ? '' : 'background:' + avatarColor(pos.key)}">
          ${ photoSrc ? `<img src="${photoSrc}" alt="${player.name}">` : player.id }
        </div>
        <div class="pc-info">
          <div class="pc-name">${player.name}</div>
          <div class="pc-meta">
            <span class="pc-pos">${pos.label}</span>
            <span class="pc-edad">${player.edad} años</span>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    section.appendChild(grid);
    container.appendChild(section);
  });
}

// ─── PLAYER MODAL ────────────────────────────
let _editId  = null;
let _editPos = null;

function openPlayerModal(playerId, posKey) {
  _editId  = playerId;
  _editPos = posKey;
  const player = SQUAD[posKey].find(p => p.id === playerId);
  if (!player) return;

  document.getElementById('modal-dorsal').value = player.dorsal;
  document.getElementById('modal-nombre').value = player.name;
  document.getElementById('modal-edad').value   = player.edad;

  document.querySelectorAll('.modal-pos-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.pos === posKey)
  );

  const preview     = document.getElementById('modal-photo-preview');
  const placeholder = document.getElementById('modal-photo-placeholder');
  const photo       = playerPhotos[playerId] || player.photo || null;
  if (photo) {
    preview.src          = photo;
    preview.style.display    = 'block';
    placeholder.style.display = 'none';
  } else {
    preview.src          = '';
    preview.style.display    = 'none';
    placeholder.style.display = 'flex';
  }

  document.getElementById('modal-photo-input').value = '';
  document.getElementById('player-modal-overlay').classList.remove('hidden');
}

function closePlayerModal() {
  document.getElementById('player-modal-overlay').classList.add('hidden');
  _editId = null; _editPos = null;
}

function handleModalOverlayClick(e) {
  if (e.target === document.getElementById('player-modal-overlay')) closePlayerModal();
}

function setModalPos(posKey) {
  document.querySelectorAll('.modal-pos-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.pos === posKey)
  );
}

function previewModalPhoto(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const preview     = document.getElementById('modal-photo-preview');
    const placeholder = document.getElementById('modal-photo-placeholder');
    preview.src           = ev.target.result;
    preview.style.display     = 'block';
    placeholder.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function savePlayerModal() {
  if (!_editId || !_editPos) return;
  const player = SQUAD[_editPos].find(p => p.id === _editId);
  if (!player) return;

  player.dorsal = parseInt(document.getElementById('modal-dorsal').value) || player.dorsal;
  player.name   = document.getElementById('modal-nombre').value.trim() || player.name;
  player.edad   = parseInt(document.getElementById('modal-edad').value)  || player.edad;

  // Handle position change
  const newPosBtn = document.querySelector('.modal-pos-btn.active');
  const newPos = newPosBtn ? newPosBtn.dataset.pos : _editPos;
  if (newPos !== _editPos) {
    SQUAD[_editPos] = SQUAD[_editPos].filter(p => p.id !== _editId);
    SQUAD[newPos].push(player);
  }

  // Handle photo
  const fileInput = document.getElementById('modal-photo-input');
  const doSave = () => { savePhotos(); closePlayerModal(); renderPlantillaView(); renderPlayerList(); };
  if (fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = ev => { playerPhotos[_editId] = ev.target.result; doSave(); };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    doSave();
  }
}

// ─── TOGGLE VISIBILITY ────────────────────────
const teamVisible = { my: true, rival: false };

function toggleTeamVisibility(team) {
  teamVisible[team] = !teamVisible[team];
  const visible = teamVisible[team];

  // Show/hide pitch tokens
  state.players
    .filter(p => p.team === team)
    .forEach(p => {
      const el = document.getElementById('token-' + p.id);
      if (el) el.style.visibility = visible ? 'visible' : 'hidden';
    });

  // Update toggle button
  const btn = document.getElementById('eye-' + team);
  if (btn) {
    btn.classList.toggle('active', visible);
    btn.querySelector('.vis-label').textContent = visible ? 'VISIBLE' : 'OCULTO';
  }
}

// ─── UNDO ────────────────────────────────────
function saveHistory() {
  history.push(JSON.stringify(state.players));
  if (history.length > 50) history.shift();
}

function undo() {
  if (history.length < 2) return;
  history.pop();
  state.players = JSON.parse(history[history.length - 1]);
  renderPlayers();
}

// ─── RESET ───────────────────────────────────
function resetBoard() {
  state.assignedPlayers = {};
  history = [];
  initState();
  // Siempre colocar el balón en el centro
  state.ball = { x: 50, y: 50 };
  renderPlayers();
  renderPlayerList();
  applyBallPosition();
}

// ─── SLIDES ──────────────────────────────────
let animInterval = null; // reference to current animation interval

function renderSlideChips() {
  const container = document.getElementById('slide-chips');
  container.innerHTML = '';
  state.slides.forEach((_, idx) => {
    const chip = document.createElement('div');
    chip.className = 'slide-chip' + (idx === state.currentSlide ? ' active' : '');
    chip.dataset.slide = idx;

    const num = document.createElement('span');
    num.className = 'chip-num';
    num.textContent = idx + 1;
    num.addEventListener('click', () => goToSlide(idx));
    chip.appendChild(num);

    if (state.slides.length > 1) {
      const del = document.createElement('span');
      del.className = 'chip-del';
      del.textContent = '\u00D7';
      del.title = 'Borrar fotograma';
      del.addEventListener('click', e => { e.stopPropagation(); deleteSlide(idx); });
      chip.appendChild(del);
    }

    container.appendChild(chip);
  });
}

function addSlide() {
  saveHistory();
  // Save current slide positions before adding new one
  state.slides[state.currentSlide] = {
    players: JSON.parse(JSON.stringify(state.players)),
    ball: { ...state.ball },
  };
  // Deep clone current positions for the new slide
  state.slides.push({
    players: JSON.parse(JSON.stringify(state.players)),
    ball: { ...state.ball },
  });
  state.currentSlide = state.slides.length - 1;
  renderSlideChips();
}

function deleteSlide(idx) {
  if (state.slides.length <= 1) return;
  saveHistory();
  state.slides.splice(idx, 1);
  // Adjust current index
  if (state.currentSlide >= state.slides.length) {
    state.currentSlide = state.slides.length - 1;
  }
  const sd = state.slides[state.currentSlide];
  state.players = JSON.parse(JSON.stringify(sd.players || sd));
  if (sd.ball) { state.ball = { ...sd.ball }; applyBallPosition(); }
  renderPlayers();
  renderSlideChips();
}

// Update only left/top of existing tokens (enables CSS transitions)
function updateTokenPositions(players, ball) {
  players.forEach(p => {
    const el = document.getElementById('token-' + p.id);
    if (el) {
      el.style.left = p.x + '%';
      el.style.top  = p.y + '%';
    }
  });
  if (ball) {
    state.ball = { ...ball };
    applyBallPosition();
  }
}

function goToSlide(idx, animate) {
  // Save current state before switching
  if (!animate) {
    state.slides[state.currentSlide] = {
      players: JSON.parse(JSON.stringify(state.players)),
      ball: { ...state.ball },
    };
  }
  state.currentSlide = idx;
  document.querySelectorAll('.slide-chip').forEach(c =>
    c.classList.toggle('active', +c.dataset.slide === idx));
  const sd = state.slides[idx];
  if (sd) {
    state.players = JSON.parse(JSON.stringify(sd.players || sd));
    // Siempre colocar el balón en el centro
    state.ball = { x: 50, y: 50 };
    applyBallPosition();
    renderPlayers();
  }
}

function playAnimation() {
  // Si ya está reproduciendo, detener
  if (animInterval) {
    clearInterval(animInterval);
    animInterval = null;
    const btn = document.getElementById('btn-play');
    if (btn) { btn.innerHTML = '&#9654;'; btn.title = 'Reproducir'; btn.style.background = '#2e7d32'; }
    return;
  }
  const total = state.slides.length;
  if (total < 2) return;
  // Guardar el slide actual antes de animar
  state.slides[state.currentSlide] = {
    players: JSON.parse(JSON.stringify(state.players)),
    ball: { ...state.ball },
  };
  const speed = parseInt(document.getElementById('anim-speed')?.value || '1000', 10);
  const dur = Math.round(speed * 0.75);
  document.documentElement.style.setProperty('--anim-dur', dur + 'ms');
  const btn = document.getElementById('btn-play');
  if (btn) { btn.innerHTML = '&#9646;&#9646;'; btn.title = 'Detener'; btn.style.background = '#b71c1c'; }

  // Ir al primer slide instantáneamente
  goToSlide(0, false);
  let i = 1;

  // Nueva animación progresiva
  function interpolate(a, b, t) {
    return a + (b - a) * t;
  }

  function animateStep(fromSlide, toSlide, duration, onComplete) {
    const start = performance.now();
    // Copias profundas para evitar mutaciones
    const fromPlayers = JSON.parse(JSON.stringify(fromSlide.players));
    const toPlayers = JSON.parse(JSON.stringify(toSlide.players));
    const fromBall = { ...fromSlide.ball };
    const toBall = { ...toSlide.ball };

    function step(now) {
      let t = (now - start) / duration;
      if (t > 1) t = 1;
      // Interpolar posiciones de jugadores
      const currPlayers = fromPlayers.map((p, idx) => {
        const dest = toPlayers[idx];
        return {
          ...p,
          x: interpolate(p.x, dest.x, t),
          y: interpolate(p.y, dest.y, t)
        };
      });
      // Interpolar balón
      const currBall = {
        x: interpolate(fromBall.x, toBall.x, t),
        y: interpolate(fromBall.y, toBall.y, t)
      };
      updateTokenPositions(currPlayers, currBall);
      if (t < 1) {
        animInterval = requestAnimationFrame(step);
      } else {
        if (onComplete) onComplete();
      }
    }
    animInterval = requestAnimationFrame(step);
  }

  function playNext() {
    if (i >= total) {
      animInterval = null;
      if (btn) { btn.innerHTML = '&#9654;'; btn.title = 'Reproducir'; btn.style.background = '#2e7d32'; }
      return;
    }
    const fromSlide = state.slides[i - 1];
    const toSlide = state.slides[i];
    animateStep(fromSlide, toSlide, speed, () => {
      i++;
      playNext();
    });
  }
  playNext();
}


// ─── EXPORT IMAGE ────────────────────────────
function exportImage() {
  html2canvasFallback();
}

function html2canvasFallback() {
  // Use native browser print-to-PDF or just open in new tab as fallback
  const pitch = document.getElementById('pitch');
  const dataUrl = canvasSnapshot(pitch);
  const link = document.createElement('a');
  link.download = 'pizarra-tactica.png';
  link.href = dataUrl;
  link.click();
}

// ─── EXPORT VIDEO ────────────────────────────
async function exportVideo() {
  const pitch = document.getElementById('pitch');
  if (!pitch) return alert('No se encontró el campo.');
  // Crear un canvas temporal para capturar cada frame
  const width = pitch.offsetWidth;
  const height = pitch.offsetHeight;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  // Capturar el stream del canvas
  const stream = canvas.captureStream(30); // 30 fps
  const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
  let chunks = [];
  recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'pizarra-tactica.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  // Reproducir la animación y capturar cada frame
  const total = state.slides.length;
  if (total < 2) return alert('Necesitas al menos 2 fotogramas para exportar el video.');
  // Guardar estado actual
  const prevSlide = state.currentSlide;
  const prevPlayers = JSON.parse(JSON.stringify(state.players));
  const prevBall = { ...state.ball };
  const speed = parseInt(document.getElementById('anim-speed')?.value || '1000', 10);
  let i = 0;
  recorder.start();
  for (; i < total; i++) {
    goToSlide(i, false);
    await new Promise(res => setTimeout(res, speed));
    // Renderizar el pitch en el canvas temporal
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(pitch, 0, 0, width, height);
  }
  recorder.stop();
  // Restaurar estado
  goToSlide(prevSlide, false);
  state.players = prevPlayers;
  state.ball = prevBall;
}

function canvasSnapshot(element) {
  // Simple SVG → canvas fallback
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${element.offsetWidth}' height='${element.offsetHeight}'>
    <foreignObject width='100%' height='100%'>
      <div xmlns='http://www.w3.org/1999/xhtml' style='width:${element.offsetWidth}px;height:${element.offsetHeight}px'>
      </div>
    </foreignObject></svg>`;
  const c = document.createElement('canvas');
  c.width = element.offsetWidth;
  c.height = element.offsetHeight;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#2e7d32';
  ctx.fillRect(0, 0, c.width, c.height);
  return c.toDataURL();
}

// ─── SHARE ───────────────────────────────────
function share() {
  const data = {
    myColor:    state.myColor,
    rivalColor: state.rivalColor,
    myFormation:    state.myFormation,
    rivalFormation: state.rivalFormation,
    players: state.players.map(p => ({ id: p.id, x: +p.x.toFixed(2), y: +p.y.toFixed(2), name: p.name, abbr: p.abbr })),
  };
  const json = JSON.stringify(data);
  const encoded = btoa(encodeURIComponent(json));
  const url = location.href.split('#')[0] + '#' + encoded;
  navigator.clipboard.writeText(url).then(() => {
    alert(currentLang === 'es' ? '¡Enlace copiado al portapapeles!' :
          currentLang === 'eu' ? 'Esteka arbelean kopiatua!' :
          currentLang === 'fr' ? 'Lien copié dans le presse-papier !' :
          'Link copied to clipboard!');
  }).catch(() => {
    prompt('Copia este enlace:', url);
  });
}

// Load shared state from URL hash
function loadFromHash() {
  if (!location.hash) return;
  try {
    const json = decodeURIComponent(atob(location.hash.slice(1)));
    const data = JSON.parse(json);
    state.myColor    = data.myColor;
    state.rivalColor = data.rivalColor;
    state.myFormation    = data.myFormation;
    state.rivalFormation = data.rivalFormation;
    data.players.forEach(p => {
      const found = state.players.find(sp => sp.id === p.id);
      if (found) { found.x = p.x; found.y = p.y; found.name = p.name; found.abbr = p.abbr; }
    });
    document.getElementById('my-formation').value    = state.myFormation;
    document.getElementById('rival-formation').value = state.rivalFormation;
    setTeamColor('my',    state.myColor);
    setTeamColor('rival', state.rivalColor);
    renderPlayers();
    renderPlayerList();
  } catch(e) { /* ignore bad hash */ }
}

// ─── BALL DRAG ───────────────────────────────
function applyBallPosition() {
  const ball = document.getElementById('ball-token');
  if (!ball) return;
  ball.style.left = '50%';
  ball.style.top  = '50%';
}

function setupBall() {
  const ball = document.getElementById('ball-token');
  if (!ball) return;

  // Apply initial position from state
  applyBallPosition();

  let offsetX, offsetY, pitchRect;

  ball.addEventListener('mousedown', e => {
    e.preventDefault();
    e.stopPropagation();
    pitchRect = document.getElementById('pitch').getBoundingClientRect();
    offsetX = e.clientX - (state.ball.x / 100 * pitchRect.width  + pitchRect.left);
    offsetY = e.clientY - (state.ball.y / 100 * pitchRect.height + pitchRect.top);
    ball.classList.add('dragging');

    function onMove(mv) {
      const x = ((mv.clientX - offsetX - pitchRect.left) / pitchRect.width)  * 100;
      const y = ((mv.clientY - offsetY - pitchRect.top)  / pitchRect.height) * 100;
      state.ball.x = Math.min(Math.max(x, 1), 99);
      state.ball.y = Math.min(Math.max(y, 1), 99);
      ball.style.left = state.ball.x + '%';
      ball.style.top  = state.ball.y + '%';
    }
    function onUp() {
      ball.classList.remove('dragging');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  ball.addEventListener('touchstart', e => {
    e.preventDefault();
    e.stopPropagation();
    pitchRect = document.getElementById('pitch').getBoundingClientRect();
    const t = e.touches[0];
    const elLeft = state.ball.x / 100 * pitchRect.width  + pitchRect.left;
    const elTop  = state.ball.y / 100 * pitchRect.height + pitchRect.top;
    offsetX = t.clientX - elLeft;
    offsetY = t.clientY - elTop;
    ball.classList.add('dragging');

    ball.ontouchmove = mv => {
      mv.preventDefault();
      const tc = mv.touches[0];
      const x = ((tc.clientX - offsetX - pitchRect.left) / pitchRect.width)  * 100;
      const y = ((tc.clientY - offsetY - pitchRect.top)  / pitchRect.height) * 100;
      state.ball.x = Math.min(Math.max(x, 1), 99);
      state.ball.y = Math.min(Math.max(y, 1), 99);
      ball.style.left = state.ball.x + '%';
      ball.style.top  = state.ball.y + '%';
    };
    ball.ontouchend = () => {
      ball.classList.remove('dragging');
      ball.ontouchmove = null;
      ball.ontouchend  = null;
    };
  }, { passive: false });
}

// ─── CANVAS DRAWING ──────────────────────────
function setupCanvas() {
  const pitch  = document.getElementById('pitch');
  const canvas = document.getElementById('draw-canvas');
  let drawing  = false;
  let lastX, lastY;

  function resize() {
    canvas.width  = pitch.clientWidth;
    canvas.height = pitch.clientHeight;
  }
  resize();
  new ResizeObserver(resize).observe(pitch);

  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = 'rgba(255, 230, 0, 0.85)';
  ctx.lineWidth   = 3;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';

  // Only draw when Shift key is held
  pitch.addEventListener('mousedown', e => {
    if (!e.shiftKey) return;
    drawing = true;
    canvas.style.pointerEvents = 'all';
    const r = canvas.getBoundingClientRect();
    lastX = e.clientX - r.left;
    lastY = e.clientY - r.top;
  });
  document.addEventListener('mousemove', e => {
    if (!drawing) return;
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    function exportVideo() {
      // Grabar el contenedor principal de la pizarra (incluye campo, jugadores y canvas)
      const boardContainer = document.getElementById('board-container') || document.getElementById('pitch').parentElement;
      if (!boardContainer) {
        alert('No se puede exportar el video: campo no encontrado');
        return;
      }

      // Usar captureStream sobre el contenedor
      let stream;
      if (boardContainer.captureStream) {
        stream = boardContainer.captureStream(30);
      } else {
        alert('Tu navegador no soporta grabación de este contenido. Usa Chrome o Edge.');
        return;
      }

      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      let chunks = [];

      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'pizarra-tactica.mp4';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      };

      // Reproducir animación mientras graba
      let slideIndex = 0;
      const totalSlides = state.slides.length;
      const interval = 1000; // 1 segundo por slide
      function nextSlide() {
        if (slideIndex < totalSlides) {
          goToSlide(slideIndex, false);
          slideIndex++;
          setTimeout(nextSlide, interval);
        } else {
          recorder.stop();
        }
      }

      recorder.start();
      nextSlide();
    }


// Run on load
window.addEventListener('load', loadFromHash);

// ── MOBILE ASSIGN MODAL ─────────────────────────────────────
let mobileAssignTab = 'portero';

function setMobileAssignTab(pos) {
  mobileAssignTab = pos;
  document.querySelectorAll('.mas-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.pos === pos);
  });
  renderMobileAssignList();
}

function openMobileAssignModal() {
  const p = state.players.find(pl => pl.id === selectedTokenId);
  const title = document.getElementById('mobile-assign-title');
  if (title) {
    title.textContent = p
      ? `Asignar al círculo ${p.jersey}`
      : 'Selecciona un jugador';
  }

  // Preseleccionar tab según número de camiseta del círculo
  if (p) {
    if (p.jersey === 1)          mobileAssignTab = 'portero';
    else if (p.jersey <= 5)      mobileAssignTab = 'defensa';
    else if (p.jersey <= 8)      mobileAssignTab = 'medio';
    else                         mobileAssignTab = 'delantero';
  }
  document.querySelectorAll('.mas-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.pos === mobileAssignTab);
  });

  renderMobileAssignList();
  const overlay = document.getElementById('mobile-assign-overlay');
  if (overlay) {
    overlay.classList.remove('hidden');
    void overlay.offsetWidth;
    overlay.classList.add('active');
  }
}

function closeMobileAssignModal() {
  const overlay = document.getElementById('mobile-assign-overlay');
  if (!overlay) return;
  overlay.classList.remove('active');
  // Esperar a que termine la animación antes de ocultar
  overlay.addEventListener('transitionend', () => overlay.classList.add('hidden'), { once: true });
  // Fallback por si no hay transitionend
  setTimeout(() => overlay.classList.add('hidden'), 320);
  // Deseleccionar token si se cierra sin asignar
  if (selectedTokenId) {
    const el = document.getElementById('token-' + selectedTokenId);
    if (el) el.classList.remove('selected');
    selectedTokenId = null;
    updateAssignHint();
  }
}

function renderMobileAssignList() {
  const container = document.getElementById('mobile-assign-list');
  if (!container) return;
  container.innerHTML = '';
  const positions = [
    { key: 'portero', label: 'Portero' },
    { key: 'defensa', label: 'Defensa' },
    { key: 'medio', label: 'Medio' },
    { key: 'delantero', label: 'Delantero' }
  ];
  positions.forEach(pos => {
    const group = document.createElement('div');
    group.className = 'mas-player-group';
    const groupLabel = document.createElement('div');
    groupLabel.className = 'mas-group-label';
    groupLabel.textContent = pos.label;
    group.appendChild(groupLabel);
    SQUAD[pos.key].forEach(player => {
      const isAssigned = Object.values(state.assignedPlayers).includes(player.id);
      const card = document.createElement('div');
      card.className = 'mas-player-card' + (isAssigned ? ' assigned' : '');
      const photoWrap = document.createElement('div');
      photoWrap.className = 'mas-photo-wrap';
      if (player.photo) {
        const img = document.createElement('img');
        img.className = 'mas-photo';
        img.src = player.photo;
        img.onerror = () => { img.style.display = 'none'; };
        photoWrap.appendChild(img);
      }
      const badge = document.createElement('span');
      badge.className = 'mas-dorsal';
      badge.textContent = player.dorsal;
      photoWrap.appendChild(badge);
      if (isAssigned) {
        const chk = document.createElement('div');
        chk.className = 'mas-check';
        chk.textContent = '✓';
        photoWrap.appendChild(chk);
      }
      const name = document.createElement('div');
      name.className = 'mas-player-name';
      name.textContent = player.name;
      card.appendChild(photoWrap);
      card.appendChild(name);
      if (!isAssigned) {
        card.addEventListener('click', () => {
          const overlay = document.getElementById('mobile-assign-overlay');
          if (overlay) { overlay.classList.remove('active'); overlay.classList.add('hidden'); }
          assignPlayer(player, pos.key);
        });
      }
      group.appendChild(card);
    });
    container.appendChild(group);
  });
}

// ── MOBILE PANEL TOGGLE ──────────────────────────────────────
function toggleMobilePanel(side) {
  if (window.innerWidth > 768) return;

  const leftSidebar  = document.querySelector('.sidebar-left');
  const rightSidebar = document.querySelector('.sidebar-right');
  const overlay      = document.getElementById('mobile-overlay');
  const btnLeft      = document.getElementById('mbn-left');
  const btnRight     = document.getElementById('mbn-right');
  const btnPitch     = document.getElementById('mbn-pitch');

  if (side === 'left') {
    const isOpen = leftSidebar.classList.contains('mobile-open');
    if (isOpen) {
      closeMobilePanels();
    } else {
      leftSidebar.classList.add('mobile-open');
      rightSidebar.classList.remove('mobile-open');
      overlay.classList.add('active');
      btnLeft.classList.add('active');
      btnRight.classList.remove('active');
      btnPitch.classList.remove('active');
    }
  } else if (side === 'right') {
    const isOpen = rightSidebar.classList.contains('mobile-open');
    if (isOpen) {
      closeMobilePanels();
    } else {
      rightSidebar.classList.add('mobile-open');
      leftSidebar.classList.remove('mobile-open');
      overlay.classList.add('active');
      btnRight.classList.add('active');
      btnLeft.classList.remove('active');
      btnPitch.classList.remove('active');
    }
  }
}

function toggleMobilePlantilla() {
  if (window.innerWidth > 768) return;
  const pv = document.getElementById('plantilla-view');
  const isOpen = !pv.classList.contains('hidden');
  if (isOpen) {
    closeMobilePanels();
  } else {
    // Cerrar drawers laterales
    document.querySelector('.sidebar-left').classList.remove('mobile-open');
    document.querySelector('.sidebar-right').classList.remove('mobile-open');
    document.getElementById('mobile-overlay').classList.remove('active');
    // Activar botón plantillas
    const btnLeft       = document.getElementById('mbn-left');
    const btnRight      = document.getElementById('mbn-right');
    const btnPitch      = document.getElementById('mbn-pitch');
    const btnPlantillas = document.getElementById('mbn-plantillas');
    if (btnLeft)       btnLeft.classList.remove('active');
    if (btnRight)      btnRight.classList.remove('active');
    if (btnPitch)      btnPitch.classList.remove('active');
    if (btnPlantillas) btnPlantillas.classList.add('active');
    // Mostrar vista plantilla
    document.querySelector('.center-area').classList.add('hidden');
    pv.classList.remove('hidden');
    renderPlantillaView();
  }
}

function closeMobilePanels() {
  document.querySelector('.sidebar-left').classList.remove('mobile-open');
  document.querySelector('.sidebar-right').classList.remove('mobile-open');
  const overlay = document.getElementById('mobile-overlay');
  if (overlay) overlay.classList.remove('active');
  const btnLeft       = document.getElementById('mbn-left');
  const btnRight      = document.getElementById('mbn-right');
  const btnPitch      = document.getElementById('mbn-pitch');
  const btnPlantillas = document.getElementById('mbn-plantillas');
  if (btnLeft)       btnLeft.classList.remove('active');
  if (btnRight)      btnRight.classList.remove('active');
  if (btnPlantillas) btnPlantillas.classList.remove('active');
  if (btnPitch)      btnPitch.classList.add('active');
  // Restaurar pizarra si estaba en vista plantilla
  const pv = document.getElementById('plantilla-view');
  if (pv && !pv.classList.contains('hidden')) {
    pv.classList.add('hidden');
    document.querySelector('.center-area').classList.remove('hidden');
  }
}

// Close mobile panels when resizing to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) closeMobilePanels();
});

// ── SWIPE-TO-CLOSE DRAWERS ───────────────────────────────────
(function initDrawerSwipe() {
  const drawers = [
    document.querySelector('.sidebar-left'),
    document.querySelector('.sidebar-right')
  ];
  drawers.forEach(drawer => {
    if (!drawer) return;
    let startX = 0, startY = 0;
    drawer.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });


    drawer.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      const landscape = window.innerHeight < 500 && window.innerWidth > window.innerHeight;
      if (landscape) {
        // En landscape los paneles se deslizan horizontalmente
        const isLeft  = drawer.classList.contains('sidebar-left');
        const isRight = drawer.classList.contains('sidebar-right');
        if (isLeft  && dx < -80 && Math.abs(dy) < 80) closeMobilePanels();
        if (isRight && dx >  80 && Math.abs(dy) < 80) closeMobilePanels();
      } else {
        // En portrait los paneles se deslizan verticalmente hacia abajo
        if (dy > 80 && Math.abs(dx) < 80) closeMobilePanels();
      }
    }, { passive: true });
  });

})(); // Cierre correcto de la IIFE

// ── ORIENTACIÓN: reajustar paneles al girar ──────────────────
window.addEventListener('orientationchange', () => {
  setTimeout(closeMobilePanels, 100);
});

// ─── PLACEHOLDERS PARA FUNCIONES FALTANTES ─────────────
function undo() {
  // TODO: Implementar función de deshacer
  alert('Función "Deshacer" no implementada.');
}

function exportImage() {
  // TODO: Implementar exportación de imagen
  alert('Función "Exportar Imagen" no implementada.');
}

function exportVideo() {
  // TODO: Implementar exportación de video
  alert('Función "Exportar Video" no implementada.');
}

function applyFormation() {
  // TODO: Implementar aplicación de formación
  alert('Función "Aplicar Formación" no implementada.');
}
// Exponer funciones globales para el HTML
window.switchTab = switchTab;
window.applyFormation = applyFormation;
