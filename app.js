/* app.js - Lógica de la app: Firebase, territorios, manzanas, guardado local, WhatsApp, UI */

/*******************************
 * CONFIG - Firebase (User's)
 *******************************/
const firebaseConfig = {
  apiKey: "AIzaSyAbAnz0hAHwttGtoDPjSzSgiJ9HP1wz-YY",
  authDomain: "territorio-3c28d.firebaseapp.com",
  databaseURL: "https://territorio-3c28d-default-rtdb.firebaseio.com/",
  projectId: "territorio-3c28d",
  storageBucket: "territorio-3c28d.appspot.com",
  messagingSenderId: "369901367983",
  appId: "1:369901367983:web:33237b1b5661b82023a763"
};

let dbRef = null;
try {
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  dbRef = database.ref('reportes');
  document.getElementById('connectionState').innerText = 'Conexión: conectado';
  showToast('Firebase conectado');
} catch (e) {
  console.warn('Firebase init failed:', e);
  document.getElementById('connectionState').innerText = 'Conexión: error';
  showToast('Modo local (sin Firebase)');
}

/*******************************
 * TERRITORIOS MAP (manzanas per territory)
 *******************************/
const territoryMap = {
  1:4,2:4,3:4,4:5,5:8,6:4,7:4,8:4,
  9:4,10:5,11:4,12:4,13:4,14:4,15:4,16:4,
  17:4,18:4,19:4,20:4,21:4,22:4,23:4,24:4,
  25:4,26:4,27:4,28:4,29:4,30:4,31:4,32:4
};

/*******************************
 * APP STATE
 *******************************/
let selectedTerritory = null;
let selectedManzanas = new Set();
let reports = {}; // in-memory

/*******************************
 * UI helpers
 *******************************/
function showToast(msg, time=2500){
  const t = document.getElementById('toast');
  t.innerText = msg;
  t.style.display = 'block';
  clearTimeout(t._hideTimer);
  t._hideTimer = setTimeout(()=> t.style.display = 'none', time);
}

function formatDateISO(ts){
  const d = new Date(ts);
  return d.toLocaleString();
}

/*******************************
 * Render cards grid
 *******************************/
const cardsGrid = document.getElementById('cardsGrid');
function renderCards(){
  cardsGrid.innerHTML = '';
  // Insert special cards first
  const specials = [
    {title:'Mapa Interactivo', icon:'🗺️', action:()=> openNewScreenForTerritory(1)},
    {title:'Nuevo Reporte', icon:'✍️', action:()=> { showToast('Elegí un territorio en Inicio'); }},
    {title:'Tablero de Anuncios', icon:'📣', action:()=> navigateTo('reportsScreen')},
    {title:'Reportes', icon:'📓', action:()=> navigateTo('reportsScreen')},
    {title:'Sugerencia próximas salidas', icon:'📅', action:()=> navigateTo('reportsScreen')}
  ];
  for(let i=specials.length-1;i>=0;i--){
    const s = specials[i];
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `<div class="icon-wrap" style="background:#f3faf6; color:var(--green-500);">${s.icon}</div><div class="h">${s.title}</div>`;
    el.addEventListener('click', s.action);
    cardsGrid.insertBefore(el, cardsGrid.firstChild);
  }

  Object.keys(territoryMap).forEach(k=>{
    const n = Number(k);
    const card = document.createElement('div');
    card.className = 'card';
    if(n===1) card.innerHTML = `<div class="icon-wrap" style="background:linear-gradient(135deg,var(--green-400),var(--green-500)); color:white; font-size:22px;">📍</div><div class="h">Mapa Interactivo</div>`;
    else card.innerHTML = `<div class="icon-wrap" style="background:#f3faf6; color:var(--green-500); font-size:22px;">${n}</div><div class="h">Territorio ${n}</div><div class="muted" style="margin-top:6px;">${territoryMap[n]} manzanas</div>`;
    card.addEventListener('click', ()=> {
      // single click selects; double click opens the form - implemented in attachSelectionBehavior
      // also opening directly (for simplicity) will open form for this territory:
      // openNewScreenForTerritory(n);
      // (we rely on selection behavior below)
    });
    cardsGrid.appendChild(card);
  });
}

/*******************************
 * OPEN NEW SCREEN (manzanas)
 *******************************/
const newScreen = document.getElementById('newScreen');
const homeScreen = document.getElementById('homeScreen');
function openNewScreenForTerritory(n){
  selectedTerritory = n;
  selectedManzanas = new Set();
  document.getElementById('newTitle').innerText = `Territorio ${n}`;
  const wrap = document.getElementById('manzanasWrap');
  wrap.innerHTML = '';
  const count = territoryMap[n] || 4;
  for(let i=0;i<count;i++){
    const label = String.fromCharCode(65+i);
    const b = document.createElement('button');
    b.className = 'manzana';
    b.innerText = label;
    b.addEventListener('click', ()=>{
      if(selectedManzanas.has(label)){ selectedManzanas.delete(label); b.classList.remove('selected'); }
      else { selectedManzanas.add(label); b.classList.add('selected'); }
    });
    wrap.appendChild(b);
  }
  navigateTo('newScreen', { animation: 'slideIn' });
}

/*******************************
 * Navigation with iOS animations (option A)
 *******************************/
function navigateTo(screenId, opts = {}){
  const screens = ['homeScreen','newScreen','reportsScreen','helpScreen','profileScreen'];
  screens.forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    if(id === screenId){
      el.classList.remove('hidden');
      el.setAttribute('aria-hidden','false');
      // animation: slide in from right
      el.style.transform = 'translateX(10px)';
      el.style.opacity = '0';
      requestAnimationFrame(()=>{
        el.style.transition = 'transform .28s cubic-bezier(.2,.9,.2,1), opacity .22s ease';
        el.style.transform = 'translateX(0)';
        el.style.opacity = '1';
      });
      setTimeout(()=>{ el.style.transition = ''; el.style.transform=''; el.style.opacity=''; }, 320);
    } else {
      // animate out
      if(!el.classList.contains('hidden')){
        el.style.transition = 'transform .22s ease, opacity .18s ease';
        el.style.transform = 'translateX(-8px)';
        el.style.opacity = '0';
        setTimeout(()=>{ el.classList.add('hidden'); el.setAttribute('aria-hidden','true'); el.style.transition=''; el.style.transform=''; el.style.opacity=''; }, 240);
      } else {
        el.classList.add('hidden');
        el.setAttribute('aria-hidden','true');
      }
    }
  });
  const s = document.getElementById('settingsMenu'); if(s) s.style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Back from new */
document.getElementById('backFromNew').addEventListener('click', ()=>{
  navigateTo('homeScreen');
  selectedTerritory = null;
  selectedManzanas = new Set();
});

/* nav click wiring */
document.querySelectorAll('.nav').forEach(btn=>{
  btn.addEventListener('click', ()=> {
    const nav = btn.getAttribute('data-nav');
    if(nav) navigateTo(nav + 'Screen');
  });
});
document.querySelectorAll('.pc-nav').forEach(btn=>{
  btn.addEventListener('click', ()=> {
    const nav = btn.getAttribute('data-nav');
    if(nav) navigateTo(nav + 'Screen');
  });
});
document.querySelectorAll('[data-mobile]').forEach(btn=>{
  btn.addEventListener('click', ()=> {
    const t = btn.getAttribute('data-mobile');
    if(t) navigateTo(t + 'Screen');
  });
});

/* fab */
document.getElementById('pcFab').addEventListener('click', ()=> {
  if(!selectedTerritory) { showToast('Elegí primero un territorio en Inicio'); return; }
  openNewScreenForTerritory(selectedTerritory);
});
const fabMobile = document.getElementById('fabMobile');
if(fabMobile) fabMobile.addEventListener('click', ()=> {
  if(!selectedTerritory) { showToast('Elegí primero un territorio en Inicio'); return; }
  openNewScreenForTerritory(selectedTerritory);
});

/*******************************
 * Save report (firebase/local) + WhatsApp
 *******************************/
document.getElementById('saveAndSend').addEventListener('click', async ()=>{
  if(!selectedTerritory){ showToast('No hay territorio seleccionado'); return; }
  if(selectedManzanas.size === 0){ showToast('Tildá al menos una manzana'); return; }
  const conductor = document.getElementById('conductorInput').value.trim();
  if(!conductor){ showToast('Ingresá el nombre del conductor'); return; }
  const obs = document.getElementById('obsInput').value.trim();
  const incomplete = document.getElementById('incompleteFace').checked;
  const payload = {
    territory: selectedTerritory,
    manzanas: Array.from(selectedManzanas).sort(),
    conductor,
    observation: obs,
    incompleteFace: incomplete,
    timestamp: new Date().toISOString()
  };

  try {
    if(dbRef) {
      await dbRef.push(payload);
    } else throw new Error('db not initialized');
    showToast('Reporte guardado (sincronizado)');
  } catch(e){
    localSave(payload);
    showToast('Guardado local (sin conexión)');
    console.warn(e);
  }

  localSave(payload);
  sendWhatsApp(payload);

  document.getElementById('conductorInput').value = '';
  document.getElementById('obsInput').value = '';
  document.getElementById('incompleteFace').checked = false;
  selectedManzanas = new Set();
  navigateTo('homeScreen');
});

document.getElementById('saveLocal').addEventListener('click', ()=>{
  if(!selectedTerritory){ showToast('No hay territorio seleccionado'); return; }
  if(selectedManzanas.size === 0){ showToast('Tildá al menos una manzana'); return; }
  const conductor = document.getElementById('conductorInput').value.trim();
  if(!conductor){ showToast('Ingresá el nombre del conductor'); return; }
  const obs = document.getElementById('obsInput').value.trim();
  const incomplete = document.getElementById('incompleteFace').checked;
  const payload = {
    territory: selectedTerritory,
    manzanas: Array.from(selectedManzanas).sort(),
    conductor,
    observation: obs,
    incompleteFace: incomplete,
    timestamp: new Date().toISOString()
  };
  localSave(payload);
  showToast('Guardado local');
  document.getElementById('conductorInput').value = '';
  document.getElementById('obsInput').value = '';
  document.getElementById('incompleteFace').checked = false;
  selectedManzanas = new Set();
  navigateTo('homeScreen');
});

/*******************************
 * Local persistence
 *******************************/
function localSave(payload){
  const key = 'territorios_reports_v2';
  const raw = localStorage.getItem(key);
  const obj = raw ? JSON.parse(raw) : {};
  const id = 'local_' + Date.now() + '_' + Math.floor(Math.random()*9999);
  obj[id] = payload;
  localStorage.setItem(key, JSON.stringify(obj));
  reports[id] = payload;
  renderReportsList();
  return id;
}
function localLoadAll(){
  const raw = localStorage.getItem('territorios_reports_v2');
  if(!raw) return {};
  try{ return JSON.parse(raw); }catch(e){ return {}; }
}

/*******************************
 * Render reports list (realtime merged)
 *******************************/
function renderReportsList(){
  const listWrap = document.getElementById('reportsList');
  listWrap.innerHTML = '';
  const merged = Object.assign({}, reports, localLoadAll());
  const keys = Object.keys(merged).sort((a,b)=> new Date(merged[b].timestamp) - new Date(merged[a].timestamp));
  document.getElementById('reportsCount').innerText = keys.length;
  keys.forEach(k=>{
    const r = merged[k];
    const card = document.createElement('div');
    card.style.background = 'var(--card)';
    card.style.borderRadius = '12px';
    card.style.padding = '12px';
    card.style.display = 'flex';
    card.style.justifyContent = 'space-between';
    card.style.alignItems = 'flex-start';
    card.style.boxShadow = '0 6px 18px rgba(8,22,18,0.04)';
    card.innerHTML = `<div>
        <div style="font-weight:700">Territorio ${r.territory} — ${r.manzanas.join(', ')}</div>
        <div style="color:#475569; margin-top:6px">${r.conductor} • ${new Date(r.timestamp).toLocaleString()}</div>
        <div style="margin-top:6px; color:#64748b">${r.observation || ''}</div>
      </div>
      <div style="text-align:right">
        <div>${r.incompleteFace ? '<span style="color:#e11d48;font-weight:700">Cara incompleta</span>' : '<span style="color:#10b981;font-weight:700">Completo</span>'}</div>
        <div style="margin-top:8px"><button class="btn btn-ghost" onclick='openReportDetails("${k}")'>Ver</button></div>
      </div>`;
    listWrap.appendChild(card);
  });
}
function openReportDetails(id){
  const merged = Object.assign({}, reports, localLoadAll());
  const r = merged[id];
  if(!r){ showToast('Reporte no encontrado'); return; }
  const w = window.open('', '_blank');
  w.document.body.style.fontFamily = '-apple-system, Inter, Arial, sans-serif';
  w.document.body.innerHTML = `<div style="padding:16px">
    <h2>Reporte — Territorio ${r.territory}</h2>
    <p><strong>Manzanas:</strong> ${r.manzanas.join(', ')}</p>
    <p><strong>Conductor:</strong> ${r.conductor}</p>
    <p><strong>Observación:</strong> ${r.observation || '—'}</p>
    <p><strong>Cara incompleta:</strong> ${r.incompleteFace ? 'Sí' : 'No'}</p>
    <p><strong>Fecha:</strong> ${new Date(r.timestamp).toLocaleString()}</p>
  </div>`;
}

/*******************************
 * WhatsApp helper
 *******************************/
function sendWhatsApp(payload){
  const phone = '5493416715020';
  const d = new Date(payload.timestamp);
  const text = `Nuevo reporte de predicación:
Territorio: ${payload.territory}
Manzanas: ${payload.manzanas.join(', ')}
Conductor: ${payload.conductor}
Observación: ${payload.observation || '-'}
Cara incompleta: ${payload.incompleteFace ? 'Sí' : 'No'}
Fecha: ${d.toLocaleString()}`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

/*******************************
 * Firebase realtime listeners
 *******************************/
if(dbRef){
  dbRef.on('value', snapshot=>{
    const val = snapshot.val() || {};
    reports = {};
    Object.keys(val).forEach(k=> reports[k] = val[k]);
    renderReportsList();
  });
} else {
  const local = localLoadAll();
  Object.keys(local).forEach(k=> reports[k] = local[k]);
  renderReportsList();
}

/*******************************
 * Initial UI wiring + selection behavior
 *******************************/
renderCards();
renderReportsList();

document.getElementById('settingsBtn').addEventListener('click', ()=>{
  const m = document.getElementById('settingsMenu');
  if(!m) return;
  m.style.display = (m.style.display === 'block') ? 'none' : 'block';
});
document.getElementById('darkToggle').addEventListener('change', (e)=>{
  if(e.target.checked) document.body.classList.add('dark');
  else document.body.classList.remove('dark');
});
document.getElementById('searchInput').addEventListener('input', (e)=>{
  const q = e.target.value.trim().toLowerCase();
  if(!q){ renderReportsList(); return; }
  const merged = Object.assign({}, reports, localLoadAll());
  const filteredKeys = Object.keys(merged).filter(k=>{
    const r = merged[k];
    return (String(r.territory).toLowerCase().includes(q) || (r.conductor||'').toLowerCase().includes(q) || (r.observation||'').toLowerCase().includes(q));
  });
  const listWrap = document.getElementById('reportsList');
  listWrap.innerHTML = '';
  filteredKeys.sort((a,b)=> new Date(merged[b].timestamp) - new Date(merged[a].timestamp)).forEach(k=>{
    const r = merged[k];
    const card = document.createElement('div');
    card.style.background = 'var(--card)'; card.style.borderRadius='12px'; card.style.padding='12px';
    card.style.display='flex'; card.style.justifyContent='space-between'; card.style.alignItems='flex-start';
    card.style.boxShadow='0 6px 18px rgba(8,22,18,0.04)';
    card.innerHTML = `<div>
        <div style="font-weight:700">Territorio ${r.territory} — ${r.manzanas.join(', ')}</div>
        <div style="color:#475569; margin-top:6px">${r.conductor} • ${new Date(r.timestamp).toLocaleString()}</div>
        <div style="margin-top:6px; color:#64748b">${r.observation || ''}</div>
      </div>
      <div style="text-align:right">
        <div>${r.incompleteFace ? '<span style="color:#e11d48;font-weight:700">Cara incompleta</span>' : '<span style="color:#10b981;font-weight:700">Completo</span>'}</div>
        <div style="margin-top:8px"><button class="btn btn-ghost" onclick='openReportDetails("${k}")'>Ver</button></div>
      </div>`;
    listWrap.appendChild(card);
  });
});

/* mobile nav wiring */
document.querySelectorAll('.mobile-bottom .nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const nav = btn.getAttribute('data-mobile');
    if(nav) navigateTo(nav + 'Screen');
  });
});

/* clicking brand to home */
document.querySelectorAll('.brand').forEach(b=> b.addEventListener('click', ()=> navigateTo('homeScreen')));

/* selection behavior: single click selects, double click opens form */
(function attachSelectionBehavior(){
  const cardClickState = {};
  cardsGrid.addEventListener('click', (ev)=>{
    let el = ev.target;
    while(el && !el.classList.contains('card')) el = el.parentElement;
    if(!el) return;
    const txt = el.innerText || '';
    const match = txt.match(/Territorio\s*(\d+)/i) || txt.match(/^(\d+)/);
    let n = null;
    if(match) n = Number(match[1]);
    if(!n) return;
    const now = Date.now();
    if(cardClickState[n] && (now - cardClickState[n] < 420)){
      openNewScreenForTerritory(n);
      cardClickState[n] = 0;
    } else {
      selectedTerritory = n;
      highlightSelectedTerritory(n);
      showToast(`Territorio ${n} seleccionado. Presioná + para reportar.`);
      cardClickState[n] = now;
    }
  });
})();

function highlightSelectedTerritory(n){
  Array.from(cardsGrid.children).forEach(child=>{
    child.style.border=''; child.style.boxShadow='';
  });
  for(const child of cardsGrid.children){
    if(child.innerText && child.innerText.indexOf(String(n)) !== -1){
      child.style.boxShadow='0 18px 40px rgba(16,185,129,0.12)'; child.style.border='2px solid rgba(16,185,129,0.12)';
      break;
    }
  }
}

/* initial load */
(function initialLoad(){
  if(!dbRef){
    const local = localLoadAll();
    reports = Object.assign({}, reports, local);
    renderReportsList();
    showToast('Trabajando en modo local (sin Firebase)');
  } else {
    dbRef.once('value').then(snap=>{
      const val = snap.val() || {};
      reports = {};
      Object.keys(val).forEach(k=> reports[k] = val[k]);
      renderReportsList();
    }).catch(e=> console.warn('db read once failed', e));
  }
})();
