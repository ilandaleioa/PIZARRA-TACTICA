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
  // GK dentro del área. Todos los jugadores de campo: entre 22% y 78%
  // Mi equipo (ataca arriba): DEF=78, MID=58-65, FWD=22
  // Rival   (ataca abajo):   DEF=22, MID=35-42, FWD=78
  '1-4-4-2': {
    my: [
      [50,  90],  // 1 GK
      [82,  78],  // 2 Lat Der
      [13,  78],  // 3 Lat Izq
      [35,  78],  // 4 Central Izq
      [60,  78],  // 5 Central Der
      [34,  62],  // 6 Medio centro
      [82,  48],  // 7 Extremo Der
      [58,  62],  // 8 Medio centro
      [37,  22],  // 9 Delantero Izq
      [58,  22],  // 10 Delantero Der
      [10,  48],  // 11 Extremo Izq
    ],
    rival: [
      [50,  10],  // 1 GK
      [82,  22],  // 2 Lat Der
      [13,  22],  // 3 Lat Izq
      [35,  22],  // 4 Central Izq
      [60,  22],  // 5 Central Der
      [34,  38],  // 6 Medio centro
      [82,  52],  // 7 Extremo Der
      [58,  38],  // 8 Medio centro
      [37,  78],  // 9 Delantero Izq
      [58,  78],  // 10 Delantero Der
      [10,  52],  // 11 Extremo Izq
    ]
  },
  '1-4-3-3': {
    my: [
      [50,  90],  // 1 GK
      [83,  78],  // 2 Lat Der
      [8,   78],  // 3 Lat Izq
      [36,  78],  // 4 Central Izq
      [60,  78],  // 5 Central Der
      [50,  62],  // 6 Medio pivote
      [68,  48],  // 7 Interior Der
      [27,  48],  // 8 Interior Izq
      [83,  22],  // 9 Extremo Der
      [50,  22],  // 10 Delantero Centro
      [8,   22],  // 11 Extremo Izq
    ],
    rival: [
      [50,  10],  // 1 GK
      [83,  22],  // 2 Lat Der
      [8,   22],  // 3 Lat Izq
      [36,  22],  // 4 Central Izq
      [60,  22],  // 5 Central Der
      [50,  38],  // 6 Medio pivote
      [68,  52],  // 7 Interior Der
      [27,  52],  // 8 Interior Izq
      [83,  78],  // 9 Extremo Der
      [50,  78],  // 10 Delantero Centro
      [8,   78],  // 11 Extremo Izq
    ]
  },
  '1-4-2-3-1': {
    my: [
      [50,  90],  // 1 GK
      [18,  78], [38, 78], [62, 78], [82, 78],  // DEF
      [36,  65], [64, 65],                       // doble pivote
      [15,  50], [50, 50], [85, 50],             // mediapuntas
      [50,  22],                                 // delantero
    ],
    rival: [
      [50,  10],  // 1 GK
      [18,  22], [38, 22], [62, 22], [82, 22],  // DEF
      [36,  35], [64, 35],                       // doble pivote
      [15,  50], [50, 50], [85, 50],             // mediapuntas
      [50,  78],                                 // delantero
    ]
  },
  '1-3-5-2': {
    my: [
      [50,  90],  // 1 GK
      [25,  78], [50, 78], [75, 78],             // 3 DEF
      [8,   57], [28, 57], [50, 57], [72, 57], [92, 57],  // 5 MED
      [34,  22], [66, 22],                       // 2 DEL
    ],
    rival: [
      [50,  10],  // 1 GK
      [25,  22], [50, 22], [75, 22],             // 3 DEF
      [8,   43], [28, 43], [50, 43], [72, 43], [92, 43],  // 5 MED
      [34,  78], [66, 78],                       // 2 DEL
    ]
  },
  '1-3-4-3': {
    my: [
      [50,  90],  // 1 GK
      [25,  78], [50, 78], [75, 78],             // 3 DEF
      [15,  58], [38, 58], [62, 58], [85, 58],   // 4 MED
      [15,  22], [50, 22], [85, 22],             // 3 DEL
    ],
    rival: [
      [50,  10],  // 1 GK
      [25,  22], [50, 22], [75, 22],             // 3 DEF
      [15,  42], [38, 42], [62, 42], [85, 42],   // 4 MED
      [15,  78], [50, 78], [85, 78],             // 3 DEL
    ]
  },
  '1-5-3-2': {
    my: [
      [50,  90],  // 1 GK
      [8,   78], [26, 78], [50, 78], [74, 78], [92, 78],  // 5 DEF
      [25,  57], [50, 57], [75, 57],             // 3 MED
      [34,  22], [66, 22],                       // 2 DEL
    ],
    rival: [
      [50,  10],  // 1 GK
      [8,   22], [26, 22], [50, 22], [74, 22], [92, 22],  // 5 DEF
      [25,  43], [50, 43], [75, 43],             // 3 MED
      [34,  78], [66, 78],                       // 2 DEL
    ]
  },
  '1-5-4-1': {
    my: [
      [50,  90],  // 1 GK
      [8,   78], [26, 78], [50, 78], [74, 78], [92, 78],  // 5 DEF
      [15,  57], [38, 57], [62, 57], [85, 57],  // 4 MED
      [50,  22],                                 // 1 DEL
    ],
    rival: [
      [50,  10],  // 1 GK
      [8,   22], [26, 22], [50, 22], [74, 22], [92, 22],  // 5 DEF
      [15,  43], [38, 43], [62, 43], [85, 43],  // 4 MED
      [50,  78],                                 // 1 DEL
    ]
  },
};

// ─── STATE ───────────────────────────────────
const GK_COLOR      = '#111111';   // portero mi equipo siempre negro
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
  players: [],      // { id, team, jersey, x, y, name, abbr }
  assignedPlayers: {},  // jerseyKey -> squad player id
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
  setupCanvas();
  setupBall();
});

function initNavLogo() {
  const img  = document.getElementById('nav-logo-img');
  const wrap = img ? img.closest('.nav-logo-wrap') : null;
  if (!img || !wrap) return;
  const saved = localStorage.getItem('ac-nav-logo');
  const src = saved || 'escudo.png';
  img.src = src;
  img.classList.add('loaded');
  wrap.classList.add('has-logo');
}

function loadNavLogo(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img  = document.getElementById('nav-logo-img');
    const wrap = img.closest('.nav-logo-wrap');
    img.src = e.target.result;
    img.classList.add('loaded');
    wrap.classList.add('has-logo');
    try { localStorage.setItem('ac-nav-logo', e.target.result); } catch(err) {}
  };
  reader.readAsDataURL(file);
}

function initState() {
  const myPos    = FORMATIONS['1-4-4-2'].my;
  const rivalPos = FORMATIONS['1-4-4-2'].rival;

  state.players = [];
  for (let i = 0; i < 11; i++) {
    state.players.push({ id: `my-${i}`,    team: 'my',    jersey: i + 1, x: myPos[i][0],    y: myPos[i][1],    name: '', abbr: '' });
    state.players.push({ id: `rival-${i}`, team: 'rival', jersey: i + 1, x: rivalPos[i][0], y: rivalPos[i][1], name: '', abbr: '' });
  }
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
    el.className = 'player-token' + (p.name ? ' has-player' : '');
    el.id = 'token-' + p.id;
    el.style.left = p.x + '%';
    el.style.top  = p.y + '%';
    // Portero mi equipo = negro, portero rival = amarillo
    const isMyGK    = p.team === 'my'    && p.jersey === 1;
    const isRivalGK = p.team === 'rival' && p.jersey === 1;
    const color = isMyGK ? GK_COLOR : isRivalGK ? RIVAL_GK_COLOR : (p.team === 'my' ? state.myColor : state.rivalColor);
    el.style.background = color;
    el.style.border = `2px solid ${(isMyGK || isRivalGK) ? '#555' : lighten(color, 40)}`;
    el.style.color = isLight(color) ? '#111' : '#fff';

    if (p.name) {
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
function makeDraggable(el, playerData) {
  let offsetX, offsetY, pitchRect;

  el.addEventListener('mousedown', e => {
    e.preventDefault();
    saveHistory();
    pitchRect = document.getElementById('pitch').getBoundingClientRect();
    const elLeft  = playerData.x / 100 * pitchRect.width  + pitchRect.left;
    const elTop   = playerData.y / 100 * pitchRect.height + pitchRect.top;
    offsetX = e.clientX - elLeft;
    offsetY = e.clientY - elTop;
    el.classList.add('dragging');

    document.onmousemove = mv => {
      const x = ((mv.clientX - offsetX - pitchRect.left) / pitchRect.width)  * 100;
      const y = ((mv.clientY - offsetY - pitchRect.top)  / pitchRect.height) * 100;
      playerData.x = Math.min(Math.max(x, 1), 99);
      playerData.y = Math.min(Math.max(y, 1), 99);
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
    pitchRect = document.getElementById('pitch').getBoundingClientRect();
    const t = e.touches[0];
    const elLeft = playerData.x / 100 * pitchRect.width  + pitchRect.left;
    const elTop  = playerData.y / 100 * pitchRect.height + pitchRect.top;
    offsetX = t.clientX - elLeft;
    offsetY = t.clientY - elTop;
    el.classList.add('dragging');

    el.ontouchmove = mv => {
      mv.preventDefault();
      const tc = mv.touches[0];
      const x = ((tc.clientX - offsetX - pitchRect.left) / pitchRect.width)  * 100;
      const y = ((tc.clientY - offsetY - pitchRect.top)  / pitchRect.height) * 100;
      playerData.x = Math.min(Math.max(x, 1), 99);
      playerData.y = Math.min(Math.max(y, 1), 99);
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
    el.style.border = `2px solid ${lighten(color, 40)}`;
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
  state.assignedPlayers[slot.id] = player.id;

  const el = document.getElementById('token-' + slot.id);
  if (el) {
    el.classList.add('has-player');
    el.classList.remove('selected');
    el.innerHTML = `<span class="jersey-num">${player.dorsal}</span><span class="token-initials">${slot.name}</span>`;
    el.style.color = isLight(state.myColor) ? '#111' : '#fff';
  }

  // Clear selection
  selectedTokenId = null;
  updateAssignHint();
  renderPlayerList();
}

// ─── TAB SWITCH ──────────────────────────────
function switchTab(tab) {
  document.getElementById('tab-plantilla').classList.toggle('active', tab === 'plantilla');
  document.getElementById('tab-pizarra').classList.toggle('active', tab === 'pizarra');
  document.getElementById('section-pizarra').classList.toggle('hidden', tab !== 'pizarra');
  document.getElementById('section-plantilla').classList.toggle('hidden', tab !== 'plantilla');

  // Show/hide the main-area views
  document.querySelector('.center-area').classList.toggle('hidden', tab === 'plantilla');
  document.querySelector('.sidebar-right').classList.toggle('hidden', tab === 'plantilla');
  const pv = document.getElementById('plantilla-view');
  pv.classList.toggle('hidden', tab !== 'plantilla');
  if (tab === 'plantilla') renderPlantillaView();
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
  renderPlayers();
  renderPlayerList();
}

// ─── SLIDES ──────────────────────────────────
function addSlide() {
  saveHistory();
  // Deep clone current positions
  state.slides.push(JSON.parse(JSON.stringify(state.players)));
  const idx = state.slides.length - 1;
  const chip = document.createElement('div');
  chip.className = 'slide-chip';
  chip.textContent = idx + 1;
  chip.dataset.slide = idx;
  chip.addEventListener('click', () => goToSlide(idx));
  document.getElementById('slide-chips').appendChild(chip);
  goToSlide(idx);
}

function goToSlide(idx) {
  state.currentSlide = idx;
  document.querySelectorAll('.slide-chip').forEach(c =>
    c.classList.toggle('active', +c.dataset.slide === idx));
  if (state.slides[idx]) {
    state.players = JSON.parse(JSON.stringify(state.slides[idx]));
    renderPlayers();
  }
}

function playAnimation() {
  const total = state.slides.length;
  if (total < 2) return;
  let i = 0;
  const iv = setInterval(() => {
    if (i >= total) { clearInterval(iv); return; }
    goToSlide(i++);
  }, 800);
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
function setupBall() {
  const ball = document.getElementById('ball-token');
  if (!ball) return;

  const bData = { x: 50, y: 50 };
  let offsetX, offsetY, pitchRect;

  ball.addEventListener('mousedown', e => {
    e.preventDefault();
    e.stopPropagation();
    pitchRect = document.getElementById('pitch').getBoundingClientRect();
    offsetX = e.clientX - (bData.x / 100 * pitchRect.width  + pitchRect.left);
    offsetY = e.clientY - (bData.y / 100 * pitchRect.height + pitchRect.top);
    ball.classList.add('dragging');

    function onMove(mv) {
      const x = ((mv.clientX - offsetX - pitchRect.left) / pitchRect.width)  * 100;
      const y = ((mv.clientY - offsetY - pitchRect.top)  / pitchRect.height) * 100;
      bData.x = Math.min(Math.max(x, 1), 99);
      bData.y = Math.min(Math.max(y, 1), 99);
      ball.style.left = bData.x + '%';
      ball.style.top  = bData.y + '%';
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
    const elLeft = bData.x / 100 * pitchRect.width  + pitchRect.left;
    const elTop  = bData.y / 100 * pitchRect.height + pitchRect.top;
    offsetX = t.clientX - elLeft;
    offsetY = t.clientY - elTop;
    ball.classList.add('dragging');

    ball.ontouchmove = mv => {
      mv.preventDefault();
      const tc = mv.touches[0];
      const x = ((tc.clientX - offsetX - pitchRect.left) / pitchRect.width)  * 100;
      const y = ((tc.clientY - offsetY - pitchRect.top)  / pitchRect.height) * 100;
      bData.x = Math.min(Math.max(x, 1), 99);
      bData.y = Math.min(Math.max(y, 1), 99);
      ball.style.left = bData.x + '%';
      ball.style.top  = bData.y + '%';
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
    ctx.stroke();
    lastX = x; lastY = y;
  });
  document.addEventListener('mouseup', () => {
    drawing = false;
    canvas.style.pointerEvents = 'none';
  });
}

// ─── UTILS ───────────────────────────────────
function lighten(hex, amount) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  r = Math.min(255, r + amount);
  g = Math.min(255, g + amount);
  b = Math.min(255, b + amount);
  return `rgb(${r},${g},${b})`;
}

function isLight(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 0.299 + g * 0.587 + b * 0.114) > 160;
}

function rgbToHex(rgb) {
  const m = rgb.match(/\d+/g);
  if (!m || m.length < 3) return '';
  return '#' + m.slice(0, 3).map(n => (+n).toString(16).padStart(2, '0')).join('');
}

// ── PANTALLA COMPLETA ────────────────────────────────────────
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

document.addEventListener('fullscreenchange', () => {
  const btn = document.getElementById('fullscreen-btn');
  if (!btn) return;
  if (document.fullscreenElement) {
    btn.innerHTML = '&#x2715;';
    btn.title = 'Salir de pantalla completa';
  } else {
    btn.innerHTML = '&#x26F6;';
    btn.title = 'Pantalla completa';
  }
});

// Run on load
window.addEventListener('load', loadFromHash);
