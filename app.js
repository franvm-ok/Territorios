// app.js - Lógica de la app: Firebase (modular), territorios, manzanas, guardado local, WhatsApp, UI
// Reemplaza completamente tu app.js por este archivo.

// IMPORTS (usa tu firebase.js modular)
import { db, ref, push, set, onValue } from "./firebase.js";

/*******************************
 * TERRITORIOS MAP (manzanas por territorio - corregido)
 * (Usé la lista completa que venías usando antes)
 *******************************/
const territoryMap = {
  1:4,2:4,3:4,4:5,5:8,6:6,7:6,8:7,
  9:9,10:9,11:5,12:6,13:9,14:6,15:5,16:7,
  17:7,18:6,19:6,20:7,21:8,22:6,23:6,24:5,
  25:6,26:7,27:7,28:6,29:5,30:8,31:8,32:6
};

/*******************************
 * APP STATE
 *******************************/
let selectedTerritory = null;
let selectedManzanas = new Set();
let reports = {}; // cache local/in-memory

/*******************************
 * DOM helpers (guards)
 *******************************/
const $ = id => document.getElementById(id) || null;

function safeAddEvent(id, ev, fn){
  const el = $(id);
  if(el) el.addEventListener(ev, fn);
}

/*******************************
 * UI helpers
 *******************************/
function showToast(msg, time=2500){
  const t = $('toast');
  if(!t) {
    // fallback: console + alertless ephemeral
    console.log('toast:', msg);
    return;
  }
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
 * Cards Grid render
 *******************************/
const cardsGrid = $('cardsGrid');

function renderCards(){
  if(!cardsGrid) return;
  cardsGrid.innerHTML = '';

  // special action cards (placed first)
  const specials = [
    {title:'Mapa Interactivo', icon:'🗺️', action:()=> openNewScreenForTerritory(1)},
    {title:'Nuevo Reporte', icon:'✍️', action:()=> showToast('Elegí un territorio en Inicio y presioná +')},
    {title:'Tablero de Anuncios', icon:'📣', action:()=> navigateTo('reportsScreen')},
    {title:'Reportes', icon:'📓', action:()=> navigateTo('reportsScreen')},
    {title:'Sugerencia próximas salidas', icon:'📅', action:()=> navigateTo('reportsScreen')}
  ];

  for(const s of specials){
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `<div class="icon-wrap" style="background:#f3faf6; color:var(--green-500);">${s.icon}</div>
                    <div class="h">${s.title}</div>`;
    el.addEventListener('click', s.action);
    cardsGrid.appendChild(el);
  }

  // territories
  Object.keys(territoryMap).forEach(k=>{
    const n = Number(k);
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.territorio = String(n);
    const iconHtml = `<div class="icon-wrap" style="${n===1 ? 'background:linear-gradient(135deg,#9be7c7,#16a34a); color:white; font-size:22px;' : 'background:#f3faf6; color:var(--green-500); font-size:22px;'}">${n===1 ? '📍' : n}</div>`;
    card.innerHTML = `${iconHtml}<div class="h">${n===1 ? 'Mapa Interactivo' : 'Territorio ' + n}</div><div class="muted" style="margin-top:6px;">${territoryMap[n]} manzanas</div>`;
    cardsGrid.appendChild(card);
  });
}

/*******************************
 * Open new screen (manzanas)
 *******************************/
function openNewScreenForTerritory(n){
  selectedTerritory = n;
  selectedManzanas = new Set();
  const newTitle = $('newTitle');
  const wrap = $('manzanasWrap');
  if(newTitle) newTitle.innerText = `Territorio ${n}`;
  if(!wrap){ showToast('Interfaz parcial: falta manzanasWrap'); return; }
  wrap.innerHTML = '';

  const count = territoryMap[n] || 4;
  for(let i=0;i<count;i++){
    const letra = String.fromCharCode(65 + i);
    const btn = document.createElement('button');
    btn.className = 'manzana';
    btn.type = 'button';
    btn.innerText = letra;
    btn.addEventListener('click', ()=>{
      if(selectedManzanas.has(letra)){
        selectedManzanas.delete(letra);
        btn.classList.remove('selected');
      } else {
        selectedManzanas.add(letra);
        btn.classList.add('selected');
      }
    });
    wrap.appendChild(btn);
  }

  navigateTo('newScreen', {animation:'slideIn'});
}

/*******************************
 * Navigation helper
 *******************************/
function navigateTo(screenId, opts = {}){
  const screens = ['homeScreen','newScreen','reportsScreen','helpScreen','profileScreen'];
  for(const id of screens){
    const el = $(id);
    if(!el) continue;
    if(id === screenId){
      el.classList.remove('hidden');
      el.setAttribute('aria-hidden','false');
      el.style.transform = 'translateX(10px)';
      el.style.opacity = '0';
      requestAnimationFrame(()=>{
        el.style.transition = 'transform .28s cubic-bezier(.2,.9,.2,1), opacity .22s ease';
        el.style.transform = 'translateX(0)';
        el.style.opacity = '1';
      });
      setTimeout(()=>{ el.style.transition=''; el.style.transform=''; el.style.opacity=''; }, 320);
    } else {
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
  }
  const s = $('settingsMenu'); if(s) s.style.display = 'none';
  window.scrollTo({ top:0, behavior:'smooth' });
}

/* Back from New */
safeAddEvent('backFromNew','click', ()=>{
  navigateTo('homeScreen');
  selectedTerritory = null;
  selectedManzanas = new Set();
});

/*******************************
 * FAB wiring (guards)
 *******************************/
safeAddEvent('pcFab','click', ()=> {
  if(!selectedTerritory){ showToast('Elegí primero un territorio en Inicio'); return; }
  openNewScreenForTerritory(selectedTerritory);
});

const fabMobile = $('fabMobile');
if(fabMobile) fabMobile.addEventListener('click', ()=> {
  if(!selectedTerritory){ showToast('Elegí primero un territorio en Inicio'); return; }
  openNewScreenForTerritory(selectedTerritory);
});

/*******************************
 * Save report (firebase/local) + WhatsApp
 *******************************/
safeAddEvent('saveAndSend','click', async ()=>{
  if(!selectedTerritory){ showToast('No hay territorio seleccionado'); return; }
  if(selectedManzanas.size === 0){ showToast('Tildá al menos una manzana'); return; }
  const conductorInput = $('conductorInput');
  const obsInput = $('obsInput');
  const incompleteEl = $('incompleteFace');
  const conductor = conductorInput ? conductorInput.value.trim() : '';
  if(!conductor){ showToast('Ingresá el nombre del conductor'); return; }
  const obs = obsInput ? obsInput.value.trim() : '';
  const incomplete = !!(incompleteEl && incompleteEl.checked);

  const payload = {
    territory: selectedTerritory,
    manzanas: Array.from(selectedManzanas).sort(),
    conductor,
    observation: obs,
    incompleteFace: incomplete,
    timestamp: new Date().toISOString()
  };

  // try remote then local fallback
  try {
    if(db){
      const rRef = push(ref(db, 'reportes'));
      await set(rRef, payload);
      // also update pendientes summary
      const pendRef = ref(db, `pendientes/territorio_${payload.territory}`);
      await set(pendRef, { territorio: payload.territory, pendientes: payload.manzanas, conductor, ts: Date.now() });
      showToast('Reporte guardado (sincronizado)');
    } else {
      throw new Error('db not available');
    }
  } catch(e){
    console.warn('Remote save failed, saving local', e);
    localSave(payload);
    showToast('Guardado local (sin conexión)');
  }

  // always save local copy as well
  localSave(payload);

  // send whatsapp
  sendWhatsApp(payload);

  // reset form
  if(conductorInput) conductorInput.value = '';
  if(obsInput) obsInput.value = '';
  if(incompleteEl) incompleteEl.checked = false;
  selectedManzanas = new Set();

  navigateTo('reportsScreen'); // after sending, go to reports
});

/* Save local only */
safeAddEvent('saveLocal','click', ()=>{
  if(!selectedTerritory){ showToast('No hay territorio seleccionado'); return; }
  if(selectedManzanas.size === 0){ showToast('Tildá al menos una manzana'); return; }
  const conductorInput = $('conductorInput');
  const obsInput = $('obsInput');
  const incompleteEl = $('incompleteFace');
  const conductor = conductorInput ? conductorInput.value.trim() : '';
  if(!conductor){ showToast('Ingresá el nombre del conductor'); return; }
  const payload = {
    territory: selectedTerritory,
    manzanas: Array.from(selectedManzanas).sort(),
    conductor,
    observation: obsInput ? obsInput.value.trim() : '',
    incompleteFace: !!(incompleteEl && incompleteEl.checked),
    timestamp: new Date().toISOString()
  };
  localSave(payload);
  showToast('Guardado local');
  if(conductorInput) conductorInput.value = '';
  if(obsInput) obsInput.value = '';
  if(incompleteEl) incompleteEl.checked = false;
  selectedManzanas = new Set();
  navigateTo('homeScreen');
});

/*******************************
 * Local persistence
 *******************************/
const LOCAL_KEY = 'territorios_reports_v2';
function localSave(payload){
  let obj = {};
  try { obj = JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}'); } catch(e){ obj = {}; }
  const id = 'local_' + Date.now() + '_' + Math.floor(Math.random()*9999);
  obj[id] = payload;
  localStorage.setItem(LOCAL_KEY, JSON.stringify(obj));
  reports[id] = payload;
  renderReportsList();
  return id;
}
function localLoadAll(){
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}'); } catch(e){ return {}; }
}

/*******************************
 * Render reports list (realtime merged)
 *******************************/
function renderReportsList(){
  const listWrap = $('reportsList');
  if(!listWrap) return;
  listWrap.innerHTML = '';

  // merged remote + local
  const local = localLoadAll();
  const merged = Object.assign({}, reports || {}, local || {});
  const keys = Object.keys(merged).sort((a,b)=> new Date(merged[b].timestamp) - new Date(merged[a].timestamp));
  const countEl = $('reportsCount');
  if(countEl) countEl.innerText = keys.length;

  keys.forEach(k=>{
    const r = merged[k];
    const card = document.createElement('div');
    card.style.background = 'var(--card, #fff)';
    card.style.borderRadius = '12px';
    card.style.padding = '12px';
    card.style.display = 'flex';
    card.style.justifyContent = 'space-between';
    card.style.alignItems = 'flex-start';
    card.style.boxShadow = '0 6px 18px rgba(8,22,18,0.04)';

    const leftHtml = `<div>
        <div style="font-weight:700">Territorio ${r.territory} — ${Array.isArray(r.manzanas) ? r.manzanas.join(', ') : ''}</div>
        <div style="color:#475569; margin-top:6px">${r.conductor || ''} • ${new Date(r.timestamp).toLocaleString()}</div>
        <div style="margin-top:6px; color:#64748b">${r.observation || ''}</div>
      </div>`;

    const statusHtml = r.incompleteFace ? `<span style="color:#e11d48;font-weight:700">Cara incompleta</span>` : `<span style="color:#10b981;font-weight:700">Completo</span>`;
    const rightHtml = `<div style="text-align:right">
        <div>${statusHtml}</div>
        <div style="margin-top:8px"><button class="btn btn-ghost" data-report-id="${k}">Ver</button></div>
      </div>`;

    card.innerHTML = leftHtml + rightHtml;
    listWrap.appendChild(card);

    // attach view button
    const btn = card.querySelector('button[data-report-id]');
    if(btn) btn.addEventListener('click', ()=> openReportDetails(k));
  });
}

/*******************************
 * Open report details (new window)
 *******************************/
function openReportDetails(id){
  const merged = Object.assign({}, reports, localLoadAll());
  const r = merged[id];
  if(!r){ showToast('Reporte no encontrado'); return; }
  const w = window.open('', '_blank');
  if(!w) { showToast('Permitir ventanas emergentes para ver detalles'); return; }
  w.document.title = `Reporte Terr ${r.territory}`;
  w.document.body.style.fontFamily = '-apple-system, Inter, Arial, sans-serif';
  w.document.body.innerHTML = `<div style="padding:16px">
    <h2>Reporte — Territorio ${r.territory}</h2>
    <p><strong>Manzanas:</strong> ${Array.isArray(r.manzanas) ? r.manzanas.join(', ') : '-'}</p>
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
Manzanas: ${Array.isArray(payload.manzanas) ? payload.manzanas.join(', ') : ''}
Conductor: ${payload.conductor}
Observación: ${payload.observation || '-'}
Cara incompleta: ${payload.incompleteFace ? 'Sí' : 'No'}
Fecha: ${d.toLocaleString()}`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

/*******************************
 * Firebase realtime listeners (modular)
 *******************************/
if(db){
  try{
    const reportRef = ref(db, 'reportes');
    onValue(reportRef, snapshot=>{
      const val = snapshot.val() || {};
      reports = {};
      Object.keys(val).forEach(k => { reports[k] = val[k]; });
      renderReportsList();
    });
  }catch(e){
    console.warn('Firebase listener failed', e);
    // fallback to local
    const local = localLoadAll();
    Object.keys(local).forEach(k=> reports[k] = local[k]);
    renderReportsList();
  }
} else {
  // no db: load local
  const local = localLoadAll();
  Object.keys(local).forEach(k=> reports[k] = local[k]);
  renderReportsList();
}

/*******************************
 * Initial wiring
 *******************************/
(function init(){
  renderCards();
  renderReportsList();

  // settings button
  safeAddEvent('settingsBtn','click', ()=>{
    const m = $('settingsMenu');
    if(!m) return;
    m.style.display = (m.style.display === 'block') ? 'none' : 'block';
  });

  // dark toggle
  const darkToggle = $('darkToggle');
  if(darkToggle) darkToggle.addEventListener('change', (e)=>{
    document.body.classList.toggle('dark', e.target.checked);
  });

  // search input
  const searchInput = $('searchInput');
  if(searchInput){
    searchInput.addEventListener('input', (e)=>{
      const q = e.target.value.trim().toLowerCase();
      if(!q){ renderReportsList(); return; }
      const merged = Object.assign({}, reports, localLoadAll());
      const filteredKeys = Object.keys(merged).filter(k=>{
        const r = merged[k];
        return (String(r.territory).toLowerCase().includes(q) || (r.conductor||'').toLowerCase().includes(q) || (r.observation||'').toLowerCase().includes(q));
      });
      const listWrap = $('reportsList');
      if(!listWrap) return;
      listWrap.innerHTML = '';
      filteredKeys.sort((a,b)=> new Date(merged[b].timestamp) - new Date(merged[a].timestamp)).forEach(k=>{
        const r = merged[k];
        // create simplified card (reuse render logic minimal)
        const card = document.createElement('div');
        card.style.background = 'var(--card, #fff)'; card.style.borderRadius='12px'; card.style.padding='12px';
        card.style.display='flex'; card.style.justifyContent='space-between'; card.style.alignItems='flex-start';
        card.style.boxShadow='0 6px 18px rgba(8,22,18,0.04)';
        card.innerHTML = `<div>
            <div style="font-weight:700">Territorio ${r.territory} — ${Array.isArray(r.manzanas) ? r.manzanas.join(', ') : ''}</div>
            <div style="color:#475569; margin-top:6px">${r.conductor} • ${new Date(r.timestamp).toLocaleString()}</div>
            <div style="margin-top:6px; color:#64748b">${r.observation || ''}</div>
          </div>
          <div style="text-align:right">
            <div>${r.incompleteFace ? '<span style="color:#e11d48;font-weight:700">Cara incompleta</span>' : '<span style="color:#10b981;font-weight:700">Completo</span>'}</div>
            <div style="margin-top:8px"><button class="btn btn-ghost">Ver</button></div>
          </div>`;
        listWrap.appendChild(card);
      });
    });
  }

  // selection behavior on cards (single click select, double click open)
  if(cardsGrid){
    const cardClickState = {};
    cardsGrid.addEventListener('click', (ev)=>{
      let el = ev.target;
      while(el && !el.classList.contains('card')) el = el.parentElement;
      if(!el) return;
      const nAttr = el.dataset.territorio;
      const match = nAttr ? Number(nAttr) : null;
      if(!match) return;
      const n = match;
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
  }

  // mobile nav wiring (if exists)
  document.querySelectorAll('.mobile-bottom .nav-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const nav = btn.getAttribute('data-mobile');
      if(nav) navigateTo(nav + 'Screen');
    });
  });

  // brand click to home
  document.querySelectorAll('.brand').forEach(b=> b.addEventListener('click', ()=> navigateTo('homeScreen')));
})();

/*******************************
 * Highlight selected territory (visual)
 *******************************/
function highlightSelectedTerritory(n){
  if(!cardsGrid) return;
  Array.from(cardsGrid.children).forEach(child=>{
    child.style.border=''; child.style.boxShadow='';
  });
  for(const child of cardsGrid.children){
    const d = child.dataset && child.dataset.territorio ? Number(child.dataset.territorio) : null;
    if(d === n){
      child.style.boxShadow='0 18px 40px rgba(16,185,129,0.12)';
      child.style.border='2px solid rgba(16,185,129,0.12)';
      break;
    }
  }
}