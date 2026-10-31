/* Reto Creativo Fest · funciones compartidas por todas las páginas.
   Lo único que normalmente hay que editar está en CONFIG y PRODUCTOS. */
const CONFIG = {
  whatsapp: '584120390423',                 // número para pedidos y consultas (sin + ni espacios)
  canalWhatsApp: 'https://whatsapp.com/channel/0029Vb0wgM92P59bPnVm2E2I',
  formularios: 'https://script.google.com/macros/s/AKfycbz7iiWdZ0010hK6RzA7ue_bhtcc1WKcoP6n_zEM4pW_QX4Itfimn_A1wtxXtmu3VLVK/exec',                          // URL de la Apps Script que guarda los formularios en Google Sheets
  premiosCSV: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRoZ3sjeDuqzJDcDGxVUPK02-uyf00qhaPcX6RXMR8n_ZcGunndTPLGgq5SRBAPp3bQrXWn3fa0nwFd/pub?gid=1238618466&single=true&output=csv',                           // hoja «Así van los premios» publicada como CSV en Google Sheets
  inscripcion: 'https://forms.gle/i2NMCytXbv9Qxoen6',
  padlet: 'https://padlet.com/retocreativofest/retomentemilenial-de-ilustracion-semanal-fase-i-3ra-temporad-s024nmvzl4iygc78wdeu',
  autorizacion: 'https://docs.google.com/forms/d/e/1FAIpQLSeTf_vZNjg5LU_mMs1X9tqmrgBddUGMDKuzvqV9U7NuXeXW7A/viewform', // Google Forms «Autorización del representante»
  patreon: 'https://www.patreon.com/RetoMenteMilenial',
  app: ''                                   // enlace de la app (PWA). Vacío = «Llega en diciembre». Al lanzarla, pega aquí la URL y la web cambia sola a «Instálala».
};

const PRODUCTOS = [
  {id:'ruta', nombre:'Ruta creativa', desc:'Recorre el evento haciendo retos de dibujo y participa en un increíble sorteo con premios. Actividad apta para todo público.', precio:3, cat:'Actividades', modo:'disponible', color:'#FFFFFF', img:'assets/img/tienda-ruta-creativa-640.webp', imgStyle:'inset:auto;left:-4%;top:13%;width:92%;height:auto;object-fit:contain'},
  {id:'guante', nombre:'Guante y lápiz de dibujo', desc:'El combo perfecto para artistas digitales y tradicionales: evita las manchas de grasa en tus dibujos. Diferentes colores y tallas.', precio:8, cat:'Para dibujar', modo:'disponible', color:'#FFFFFF', img:'assets/img/tienda-guante-640.webp',
    opciones:{Color:['Lila','Verde menta','Negro'], Mano:['Diestro','Zurdo'], Talla:['Regular','Grande']}}
];
const ENCARGO = 'Bajo pedido · ~1 semana';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const money = n => '$' + (Math.round(n * 100) / 100).toLocaleString('es-VE', {minimumFractionDigits: n % 1 ? 1 : 0, maximumFractionDigits: 2});
const waLink = msg => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
const store = {
  get(k, d){ try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch(e){ return d; } },
  set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
};

/* ---------- enlaces configurables ---------- */
function wireLinks(){
  $$('[data-wa]').forEach(a => { a.href = waLink(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });
  $$('[data-link]').forEach(a => {
    const k = a.dataset.link;
    if (k === 'canal' && !CONFIG.canalWhatsApp){ a.href = waLink('¡Hola! Quiero unirme al canal de WhatsApp del #RetoMenteMilenial.'); }
    else a.href = ({canal:CONFIG.canalWhatsApp, inscripcion:CONFIG.inscripcion, padlet:CONFIG.padlet, patreon:CONFIG.patreon, app:CONFIG.app, autorizacion:CONFIG.autorizacion})[k] || '#';
    a.target = '_blank'; a.rel = 'noopener';
  });
}

/* ---------- app: «próximamente» o «instálala» según CONFIG.app ---------- */
function wireApp(){
  const live = !!CONFIG.app;
  $$('[data-app-soon]').forEach(el => el.hidden = live);
  $$('[data-app-live]').forEach(el => el.hidden = !live);
}

/* ---------- menú en celular ---------- */
function wireMenu(){
  const b = $('#menuBtn'), top = $('.top');
  if (!b) return;
  b.addEventListener('click', () => { const open = !top.classList.contains('open'); top.classList.toggle('open', open); b.setAttribute('aria-expanded', open); });
}

/* ---------- carrito ---------- */
let cart = store.get('rcf-cart2', []);          // [{id, q, op:{Talla:'M'}}]
if (!Array.isArray(cart)) cart = [];
/* Seguridad: solo se aceptan productos que existen, cantidades enteras y opciones válidas (el carrito guardado se puede manipular). */
cart = cart.filter(l => l && PRODUCTOS.some(p => p.id === l.id) && Number.isInteger(l.q) && l.q > 0 && l.q <= 99)
  .map(l => { const p = PRODUCTOS.find(x => x.id === l.id), op = {};
    Object.entries(p.opciones || {}).forEach(([k, vals]) => { op[k] = vals.includes(l.op && l.op[k]) ? l.op[k] : vals[0]; });
    return {id:l.id, q:l.q, op}; });
const byId = id => PRODUCTOS.find(p => p.id === id);
const defaults = p => Object.fromEntries(Object.entries(p.opciones || {}).map(([k, v]) => [k, v[0]]));
const qtyOf = id => cart.filter(l => l.id === id).reduce((s, l) => s + l.q, 0);
const save = () => store.set('rcf-cart2', cart);

function drawerHTML(){
  return `<div class="scrim" id="scrim" hidden></div>
  <aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-labelledby="cart-h" hidden>
    <div class="dh"><h2 id="cart-h">Tu pedido</h2><button class="x" id="closeCart" type="button" aria-label="Cerrar carrito">✕</button></div>
    <div class="db">
      <div id="items"></div>
      <fieldset id="ship"><legend>¿Cómo lo recibes?</legend>
        <label class="opt"><input type="radio" name="entrega" id="e1" value="Retiro en el evento (sábado 5 de diciembre, FACES-UCV)" checked><span>Retiro en el evento<small>Sábado 5 de diciembre, FACES-UCV</small></span></label>
        <label class="opt"><input type="radio" name="entrega" id="e2" value="Envío nacional por MRW (cobro a destino)"><span>Envío nacional por MRW<small>Cobro a destino. Te pedimos los datos por mensaje</small></span></label>
      </fieldset>
      <label class="fl" for="nombre">Tu nombre<input id="nombre" type="text" autocomplete="name" placeholder="María Pérez"></label>
      <span class="err" id="nerr" hidden>Escribe tu nombre para enviar el pedido.</span>
      <label class="fl" for="nota">Nota (opcional)<textarea id="nota" rows="2" placeholder="Algo que debamos saber de tu pedido"></textarea></label>
    </div>
    <div class="df">
      <div class="tot"><span>Total <small>USD a tasa BCV</small></span><b id="total">$0</b></div>
      <a class="send" id="send" href="#" target="_blank" rel="noopener" aria-disabled="true">${WA_ICON}Enviar pedido por WhatsApp</a>
      <p class="fine">Se abrirá WhatsApp con tu pedido listo. Todavía no has pagado nada: confirmamos disponibilidad y pago por mensaje.</p>
    </div>
  </aside>
  <div class="toast" id="toast" role="status" hidden></div>`;
}
const WA_ICON = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1.1 2.7 11.5 11.5 0 0 0 4.4 3.9c1.6.7 2.3.8 3.1.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>';

function addOne(id){
  const p = byId(id); if (!p) return;
  const line = cart.find(l => l.id === id);
  if (line) line.q++; else cart.push({id, q:1, op:defaults(p)});
  save(); renderAll();
  toast(`${p.nombre} agregado al carrito`);
}
function removeOne(id){
  for (let i = cart.length - 1; i >= 0; i--) if (cart[i].id === id){ cart[i].q--; if (!cart[i].q) cart.splice(i, 1); break; }
  save(); renderAll();
}

function productCard(p){
  const q = qtyOf(p.id);
  return `<article class="prod" data-cat="${esc(p.cat)}"><div class="pic" style="--pc:${p.color}"><img src="${p.img}" alt="${esc(p.nombre)}" loading="lazy" decoding="async" width="600" height="600"${p.imgStyle ? ` style="${p.imgStyle}"` : ''}><span class="badge ${p.modo==='encargo'?'enc':''}">${p.modo==='encargo'?ENCARGO:'Disponible'}</span></div>
    <div class="b"><h3>${esc(p.nombre)}</h3><p>${esc(p.desc)}</p>
    <div class="row"><span class="price">${money(p.precio)}<small>USD BCV</small></span>${q
      ? `<div class="qty" aria-label="Cantidad de ${esc(p.nombre)} en el carrito"><button type="button" data-a="-" data-id="${p.id}" aria-label="Quitar uno">−</button><span>${q}</span><button type="button" data-a="+" data-id="${p.id}" aria-label="Agregar uno">+</button></div>`
      : `<button class="add" type="button" data-a="+" data-id="${p.id}">Agregar</button>`}</div></div></article>`;
}
let filtro = 'Todo';
function renderProducts(){
  $$('[data-products]').forEach(g => {
    const withFilter = g.hasAttribute('data-filter');
    const list = PRODUCTOS.filter(p => !withFilter || filtro === 'Todo' || p.cat === filtro);
    g.innerHTML = list.map(productCard).join('');
    $$('[data-a]', g).forEach(b => b.onclick = () => b.dataset.a === '+' ? addOne(b.dataset.id) : removeOne(b.dataset.id));
  });
  const fl = $('#filters');
  if (fl){
    const cats = ['Todo', ...new Set(PRODUCTOS.map(p => p.cat))];
    fl.innerHTML = cats.map(c => `<button class="f" type="button" aria-pressed="${c===filtro}" data-c="${esc(c)}">${esc(c)}</button>`).join('');
    $$('.f', fl).forEach(b => b.onclick = () => { filtro = b.dataset.c; renderProducts(); });
  }
}
function message(){
  const ls = cart.filter(l => byId(l.id)); if (!ls.length) return '';
  const tot = ls.reduce((s, l) => s + byId(l.id).precio * l.q, 0);
  const nombre = $('#nombre').value.trim(), nota = $('#nota').value.trim();
  const entrega = $('input[name="entrega"]:checked').value;
  const enc = ls.some(l => byId(l.id).modo === 'encargo');
  return ['¡Hola! Quiero hacer este pedido en la tienda del Reto Creativo Fest:', '',
    ...ls.map(l => { const p = byId(l.id); const op = Object.entries(l.op || {}).map(([k, v]) => `${k}: ${v}`).join(', ');
      return `• ${l.q} × ${p.nombre}${op ? ` (${op})` : ''} · ${money(p.precio)} c/u = ${money(p.precio * l.q)}${p.modo==='encargo' ? ' · bajo pedido' : ''}`; }),
    '', `Total: ${money(tot)} USD (a tasa BCV)`, `Entrega: ${entrega}`, nombre && `Nombre: ${nombre}`, nota && `Nota: ${nota}`,
    enc && '\nEntiendo que los productos bajo pedido tardan aproximadamente 1 semana.'].filter(x => x !== '' && x !== false && x != null).join('\n');
}
function renderCart(){
  const n = cart.reduce((s, l) => s + l.q, 0);
  $$('.cartbtn .n').forEach(el => el.textContent = n);
  const box = $('#items'); if (!box) return;
  box.innerHTML = cart.length ? cart.map((l, i) => { const p = byId(l.id); if (!p) return '';
    const opts = Object.entries(p.opciones || {}).map(([k, vals]) => `<label><span class="sr">${esc(k)} de ${esc(p.nombre)}</span><select data-i="${i}" data-k="${esc(k)}" aria-label="${esc(k)}">${vals.map(v => `<option${l.op && l.op[k]===v?' selected':''}>${esc(v)}</option>`).join('')}</select></label>`).join('');
    return `<div class="item"><img class="thumb" src="${p.img}" alt="" loading="lazy" width="56" height="56" style="background:${p.color}"><div><h3>${esc(p.nombre)}</h3><small>${money(p.precio)} c/u${p.modo==='encargo' ? ' · ' + ENCARGO : ''}</small></div>
      <div class="r"><div class="qty"><button type="button" data-c="-" data-i="${i}" aria-label="Quitar uno">−</button><span>${l.q}</span><button type="button" data-c="+" data-i="${i}" aria-label="Agregar uno">+</button></div><button class="rm" type="button" data-rm="${i}">Eliminar</button></div>
      ${opts ? `<div class="opts">${opts}${p.opciones ? `<button class="rm" type="button" data-dup="${i}">+ Agregar otro con distintas opciones</button>` : ''}</div>` : ''}</div>`; }).join('')
    : '<p class="empty">Tu carrito está vacío.<br>Agrega productos para armar tu pedido.</p>';
  $$('[data-c]', box).forEach(b => b.onclick = () => { const l = cart[+b.dataset.i]; l.q += b.dataset.c === '+' ? 1 : -1; if (!l.q) cart.splice(+b.dataset.i, 1); save(); renderAll(); });
  $$('[data-rm]', box).forEach(b => b.onclick = () => { cart.splice(+b.dataset.rm, 1); save(); renderAll(); });
  $$('[data-dup]', box).forEach(b => b.onclick = () => { const l = cart[+b.dataset.dup]; cart.splice(+b.dataset.dup + 1, 0, {id:l.id, q:1, op:{...l.op}}); save(); renderAll(); });
  $$('select', box).forEach(s => s.onchange = () => { cart[+s.dataset.i].op[s.dataset.k] = s.value; save(); updateLink(); });
  $('#total').textContent = money(cart.reduce((s, l) => s + (byId(l.id)?.precio || 0) * l.q, 0));
  $('#ship').hidden = !cart.length;
  updateLink();
}
function updateLink(){
  const msg = message(), ok = !!msg && !!$('#nombre').value.trim(), a = $('#send');
  a.setAttribute('aria-disabled', String(!ok));
  a.href = ok ? waLink(msg) : '#';
}
function renderAll(){ renderProducts(); renderCart(); }

let lastFocus;
function openCart(){ lastFocus = document.activeElement; $('#drawer').hidden = false; $('#scrim').hidden = false; $('#closeCart').focus(); document.body.style.overflow = 'hidden'; }
function closeCart(){ $('#drawer').hidden = true; $('#scrim').hidden = true; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
let tt; function toast(t){ const el = $('#toast'); el.textContent = t; el.hidden = false; clearTimeout(tt); tt = setTimeout(() => el.hidden = true, 1800); }

function wireCart(){
  document.body.insertAdjacentHTML('beforeend', drawerHTML());
  $$('.cartbtn').forEach(b => b.onclick = openCart);
  $('#closeCart').onclick = closeCart; $('#scrim').onclick = closeCart;
  $('#drawer').addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });
  $('#nombre').addEventListener('input', () => { $('#nerr').hidden = true; updateLink(); });
  $('#nota').addEventListener('input', updateLink);
  $$('input[name="entrega"]').forEach(r => r.addEventListener('change', updateLink));
  $('#send').addEventListener('click', e => { if ($('#send').getAttribute('aria-disabled') === 'true'){ e.preventDefault(); if (cart.length) $('#nerr').hidden = false; } });
  if (location.hash === '#carrito') openCart();
}

/* ---------- botón flotante de WhatsApp ---------- */
function wireFloat(){
  const a = document.createElement('a');
  a.className = 'wafloat'; a.href = waLink('¡Hola! Tengo una pregunta sobre el Reto Creativo Fest.'); a.target = '_blank'; a.rel = 'noopener';
  a.setAttribute('aria-label', 'Escríbenos por WhatsApp'); a.innerHTML = WA_ICON.replace('width="22" height="22"', 'width="30" height="30"');
  document.body.appendChild(a);
}

/* ---------- seguidores del canal de WhatsApp ----------
   data/canal.json lo actualiza solo la tarea programada de GitHub (.github/workflows/canal.yml). */
function wireCanal(){
  const el = $('#canalCount'); if (!el) return;
  fetch('data/canal.json', {cache:'no-store'}).then(r => r.ok ? r.json() : Promise.reject()).then(d => {
    const n = Math.floor((+d.seguidores || 0) / 100) * 100;
    if (n >= 1000) el.textContent = '+' + n.toLocaleString('es-VE');
  }).catch(() => {});
}

/* ---------- formularios de captación ----------
   Envían los datos a CONFIG.formularios (Apps Script → Google Sheets).
   Mientras no exista esa URL, el envío abre WhatsApp con los datos escritos. */
function wireForms(){
  /* Formularios con fecha de cierre (data-cierre): después de esa fecha se ocultan y se muestra el aviso de cierre. */
  $$('form[data-cierre]').forEach(f => { if (Date.now() >= Date.parse(f.dataset.cierre)){ f.hidden = true; const c = f.parentElement.querySelector('.press-closed'); if (c) c.hidden = false; } });
  $$('form[data-form]').forEach(f => f.addEventListener('submit', async e => {
    e.preventDefault();
    const err = $('.ferr', f), ok = $('.fok', f), btn = $('button[type=submit]', f);
    err.hidden = true;
    if (f.website.value) return;                         // trampa para bots
    const bad = $$('[required]', f).find(i => i.type === 'checkbox' ? !i.checked : !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)));
    if (bad){ err.textContent = bad.type === 'checkbox' ? 'Marca la casilla de aceptación para enviar.' : bad.type === 'email' ? 'Revisa tu correo: parece incompleto.' : 'Completa los campos obligatorios.'; err.hidden = false; bad.focus(); return; }
    if (f.dataset.form === 'marcas' && !$$('input[name=interes]:checked', f).length){ err.textContent = 'Marca al menos una opción en «Me interesa».'; err.hidden = false; return; }
    const data = new URLSearchParams({formulario: f.dataset.form, pagina: location.pathname});
    new FormData(f).forEach((v, k) => { if (k !== 'website') data.set(k, data.has(k) ? data.get(k) + ', ' + v : v); });
    if (!CONFIG.formularios){
      const lines = [...data].filter(([k]) => !['formulario','pagina','consentimiento'].includes(k)).map(([k, v]) => `${k}: ${v}`);
      window.open(waLink((f.dataset.form === 'avisame' ? '¡Hola! Quiero que me avisen de la próxima edición del Reto Creativo Fest.' : '¡Hola! Soy una marca interesada en el Reto Creativo Fest.') + '\n' + lines.join('\n')), '_blank', 'noopener');
      return;
    }
    btn.disabled = true; btn.textContent = 'Enviando…';
    try {
      await fetch(CONFIG.formularios, {method:'POST', mode:'no-cors', body:data});
      f.reset(); $$('.fl, fieldset, .check, button[type=submit]', f).forEach(el => el.hidden = true); ok.hidden = false;
    } catch(x){
      err.textContent = 'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.'; err.hidden = false;
      btn.disabled = false; btn.textContent = f.dataset.form === 'avisame' ? 'Quiero que me avisen' : 'Enviar mis datos';
    }
  }));
}

/* ---------- seguidores de Instagram y TikTok (Bazar creativo) ----------
   data/redes.json: TikTok lo actualiza solo .github/workflows/redes.yml; Instagram se edita a mano si la lectura falla. */
function wireRedes(){
  if (!$('#igTotal')) return;
  const fmt = n => Math.floor(n / 100) * 100;
  const es = n => n.toLocaleString('es-VE');
  fetch('data/redes.json', {cache:'no-store'}).then(r => r.ok ? r.json() : Promise.reject()).then(d => {
    [['ig','instagram'],['tt','tiktok']].forEach(([k, red]) => {
      const rcf = +d[red]?.retocreativofest?.seguidores || 0, mm = +d[red]?.mentemilenial?.seguidores || 0;
      if (rcf) $('#' + k + 'Rcf').textContent = es(fmt(rcf));
      if (mm) $('#' + k + 'Mm').textContent = es(fmt(mm));
      if (rcf + mm) $('#' + k + 'Total').textContent = '+' + es(fmt(rcf + mm));
    });
  }).catch(() => {});
}

/* ---------- cuenta regresiva al Reto Creativo Fest ----------
   <div data-cuenta="2026-12-05T10:00:00-04:00" data-fin="2026-12-05T16:00:00-04:00">. Para la próxima edición solo se cambian esas fechas. */
function wireCuenta(){
  const el = $('[data-cuenta]'); if (!el) return;
  const inicio = Date.parse(el.dataset.cuenta), fin = Date.parse(el.dataset.fin || el.dataset.cuenta);
  const n = {d:$('[data-u="d"]', el), h:$('[data-u="h"]', el), m:$('[data-u="m"]', el), s:$('[data-u="s"]', el)};
  const dos = v => String(v).padStart(2, '0');
  let t = null;
  const tick = () => {
    const ahora = Date.now(), falta = inicio - ahora;
    if (falta <= 0){
      clearInterval(t);
      if (ahora < fin){ el.classList.add('envivo'); $('.cuenta-t', el).textContent = '¡Es hoy! Estamos en FACES-UCV hasta las 4:00 p. m.'; }
      else el.closest('section').hidden = true;
      return;
    }
    const seg = Math.floor(falta / 1000);
    n.d.textContent = Math.floor(seg / 86400); n.h.textContent = dos(Math.floor(seg % 86400 / 3600));
    n.m.textContent = dos(Math.floor(seg % 3600 / 60)); n.s.textContent = dos(seg % 60);
  };
  tick(); t = setInterval(tick, 1000);
}

/* ---------- contenido con fecha ----------
   data-hasta="FECHA": se quita desde esa fecha. data-desde="FECHA": solo aparece desde esa fecha.
   Así los precios de preventa cambian solos al regular sin tener que editar la web ese día. */
function wireFechas(){
  const aplicar = () => {
    const ahora = Date.now();
    $$('[data-hasta]').forEach(el => { if (ahora >= Date.parse(el.dataset.hasta)) el.remove(); });
    $$('[data-desde]').forEach(el => { el.hidden = ahora < Date.parse(el.dataset.desde); });
  };
  aplicar();
  const prox = [...$$('[data-hasta]'), ...$$('[data-desde]')].map(el => Date.parse(el.dataset.hasta || el.dataset.desde) - Date.now()).filter(t => t > 0 && t < 864e5);
  if (prox.length) setTimeout(aplicar, Math.min(...prox) + 500);   // por si alguien tiene la página abierta justo a medianoche
}

wireMenu(); wireLinks(); wireFechas(); wireCuenta(); wireApp(); wireForms(); wireCart(); wireFloat(); wireCanal(); wireRedes(); renderAll();
