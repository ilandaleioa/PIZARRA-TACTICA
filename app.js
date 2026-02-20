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
const SQUAD = {
  portero: [
    { id: 'US', name: 'Unai Simón',         abbr: 'U.S', dorsal: 1,  edad: 28 },
    { id: 'JA', name: 'Julen Agirrezabala', abbr: 'J.A', dorsal: 25, edad: 23 },
  ],
  defensa: [
    { id: 'AR', name: 'Areso',   abbr: 'ARE', dorsal: 12, edad: 25 },
    { id: 'VI', name: 'Vivian',  abbr: 'VIV', dorsal: 3,  edad: 26 },
    { id: 'YE', name: 'Yeray',   abbr: 'YER', dorsal: 4,  edad: 29 },
    { id: 'YU', name: 'Yuri B.', abbr: 'YUR', dorsal: 17, edad: 28 },
    { id: 'LI', name: 'Lekue',   abbr: 'LEK', dorsal: 22, edad: 33 },
    { id: 'OI', name: 'Oier',    abbr: 'OIE', dorsal: 15, edad: 27 },
  ],
  medio: [
    { id: 'VE', name: 'Vesga',      abbr: 'VEG', dorsal: 6,  edad: 30 },
    { id: 'SA', name: 'Sancet',     abbr: 'SAN', dorsal: 8,  edad: 25 },
    { id: 'BE', name: 'Berenguer',  abbr: 'BER', dorsal: 7,  edad: 32 },
    { id: 'DV', name: 'De Marcos',  abbr: 'D.M', dorsal: 19, edad: 35 },
    { id: 'UC', name: 'Unai López', abbr: 'U.L', dorsal: 16, edad: 30 },
    { id: 'ZU', name: 'Zarraga',    abbr: 'ZAR', dorsal: 14, edad: 25 },
    { id: 'MU', name: 'Muniain',    abbr: 'MUN', dorsal: 10, edad: 33 },
  ],
  delantero: [
    { id: 'NW', name: 'Nico Williams', abbr: 'N.W', dorsal: 11, edad: 22 },
    { id: 'IW', name: 'I. Williams',   abbr: 'I.W', dorsal: 9,  edad: 26 },
    { id: 'GU', name: 'Guruzeta',      abbr: 'GUR', dorsal: 21, edad: 27 },
    { id: 'RD', name: 'Raúl García',   abbr: 'R.G', dorsal: 5,  edad: 38 },
  ],
};

// ─── FORMATIONS ──────────────────────────────
// Positions as % [left, top] relative to the pitch.
// "My team" plays bottom half (top ~50%–95%), rival top half (~5%–50%).
const FORMATIONS = {
  '4-4-2': {
    my: [
      [50,  90],            // 1 GK
      [18,  72], [38, 72], [62, 72], [82, 72], // 2-5 DEF
      [18,  52], [38, 52], [62, 52], [82, 52], // 6-9 MID
      [35,  32], [65, 32],                      // 10-11 FWD
    ],
    rival: [
      [50,  10],
      [18,  28], [38, 28], [62, 28], [82, 28],
      [18,  48], [38, 48], [62, 48], [82, 48],
      [35,  68], [65, 68],
    ]
  },
  '4-3-3': {
    my: [
      [50,  90],
      [18,  72], [38, 72], [62, 72], [82, 72],
      [28,  52], [50, 52], [72, 52],
      [20,  30], [50, 28], [80, 30],
    ],
    rival: [
      [50, 10],
      [18, 28], [38, 28], [62, 28], [82, 28],
      [28, 48], [50, 48], [72, 48],
      [20, 70], [50, 72], [80, 70],
    ]
  },
  '4-2-3-1': {
    my: [
      [50, 90],
      [18, 74], [38, 74], [62, 74], [82, 74],
      [36, 60], [64, 60],
      [20, 46], [50, 44], [80, 46],
      [50, 30],
    ],
    rival: [
      [50, 10],
      [18, 26], [38, 26], [62, 26], [82, 26],
      [36, 40], [64, 40],
      [20, 54], [50, 56], [80, 54],
      [50, 70],
    ]
  },
  '3-5-2': {
    my: [
      [50, 90],
      [28, 74], [50, 74], [72, 74],
      [10, 55], [30, 55], [50, 56], [70, 55], [90, 55],
      [34, 32], [66, 32],
    ],
    rival: [
      [50, 10],
      [28, 26], [50, 26], [72, 26],
      [10, 45], [30, 45], [50, 44], [70, 45], [90, 45],
      [34, 68], [66, 68],
    ]
  },
  '3-4-3': {
    my: [
      [50, 90],
      [28, 74], [50, 74], [72, 74],
      [18, 54], [40, 54], [60, 54], [82, 54],
      [20, 32], [50, 30], [80, 32],
    ],
    rival: [
      [50, 10],
      [28, 26], [50, 26], [72, 26],
      [18, 46], [40, 46], [60, 46], [82, 46],
      [20, 68], [50, 70], [80, 68],
    ]
  },
  '5-3-2': {
    my: [
      [50, 90],
      [8, 70], [26, 74], [50, 74], [74, 74], [92, 70],
      [28, 52], [50, 52], [72, 52],
      [34, 32], [66, 32],
    ],
    rival: [
      [50, 10],
      [8, 30], [26, 26], [50, 26], [74, 26], [92, 30],
      [28, 48], [50, 48], [72, 48],
      [34, 68], [66, 68],
    ]
  },
  '5-4-1': {
    my: [
      [50, 90],
      [8, 70], [26, 74], [50, 74], [74, 74], [92, 70],
      [18, 52], [40, 52], [60, 52], [82, 52],
      [50, 32],
    ],
    rival: [
      [50, 10],
      [8, 30], [26, 26], [50, 26], [74, 26], [92, 30],
      [18, 48], [40, 48], [60, 48], [82, 48],
      [50, 68],
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
  myFormation:    '4-4-2',
  rivalFormation: '4-4-2',
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
  initState();
  renderPlayers();
  renderPlayerList();
  setupCanvas();
});

function initState() {
  const myPos    = FORMATIONS['4-4-2'].my;
  const rivalPos = FORMATIONS['4-4-2'].rival;

  state.players = [];
  for (let i = 0; i < 11; i++) {
    state.players.push({ id: `my-${i}`,    team: 'my',    jersey: i + 1, x: myPos[i][0],    y: myPos[i][1],    name: '', abbr: '' });
    state.players.push({ id: `rival-${i}`, team: 'rival', jersey: i + 1, x: rivalPos[i][0], y: rivalPos[i][1], name: '', abbr: '' });
  }
  saveHistory();
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
      el.innerHTML = `<span class="jersey-num">${p.jersey}</span><span class="token-initials">${p.name}</span>`;
    } else {
      el.textContent = p.jersey;
    }

    // Respect current visibility state
    if (!teamVisible[p.team]) el.style.visibility = 'hidden';

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
      avatar.textContent = player.id;

      const name = document.createElement('div');
      name.className = 'player-name';
      name.textContent = player.name;

      row.appendChild(avatar);
      row.appendChild(name);

      if (!isAssigned) {
        row.addEventListener('click', () => assignPlayer(player, pos.cls));
      }
      group.appendChild(row);
    });
    container.appendChild(group);
  });
}

// Assign a squad player to the correct positional slot in "my team"
function assignPlayer(player, posClass) {
  // Map position class to jersey ranges (based on standard 11-player layout)
  const jerseyRanges = {
    'assigned-gk':  [1, 1],
    'assigned-def': [2, 5],
    'assigned-mid': [6, 9],
    'assigned-fwd': [10, 11],
  };
  const range = jerseyRanges[posClass] || [1, 11];

  // Find first unassigned slot within the position range
  let slot = state.players.find(p =>
    p.team === 'my' && !p.name &&
    p.jersey >= range[0] && p.jersey <= range[1]
  );
  // Fallback: any unassigned slot
  if (!slot) slot = state.players.find(p => p.team === 'my' && !p.name);
  if (!slot) return;

  saveHistory();
  slot.name = player.name;
  slot.abbr = player.abbr;
  state.assignedPlayers[slot.id] = player.id;

  const el = document.getElementById('token-' + slot.id);
  if (el) {
    el.classList.add('has-player');
    el.innerHTML = `<span class="jersey-num">${slot.jersey}</span><span class="token-initials">${slot.name}</span>`;
    el.style.color = isLight(state.myColor) ? '#111' : '#fff';
  }
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
      const photoSrc = playerPhotos[player.id] || null;
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

  const preview = document.getElementById('modal-photo-preview');
  const photo   = playerPhotos[playerId];
  if (photo) { preview.src = photo; preview.style.display = 'block'; }
  else        { preview.src = '';    preview.style.display = 'none';  }

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
    const preview = document.getElementById('modal-photo-preview');
    preview.src = ev.target.result;
    preview.style.display = 'block';
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
const teamVisible = { my: true, rival: true };

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

  // Update eye button state
  const btn = document.getElementById('eye-' + team);
  if (btn) btn.classList.toggle('hidden-team', !visible);
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
  if (!confirm(currentLang === 'es' ? '¿Resetear la pizarra?' :
               currentLang === 'eu' ? 'Arbela berrezarri?' :
               currentLang === 'fr' ? 'Réinitialiser le tableau ?' :
               'Reset the board?')) return;
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
