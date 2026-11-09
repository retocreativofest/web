/* #RetoMenteMilenial · app: entrar, registro, Hoy, subir al Padlet, rachas, ranking, amigos, Chispa del día y Club Estrella */
import * as PJ from './personaje.js?v=1';
import { abrirChispa, chispaDeHoy, chispasDeLaSemana, chispaHechaHoy, adviento, navidadGanada, diasChispaSemana, fiestaDe, rachaChispas, ajustarHora, mostrarPromoClub, bannerClub } from './chispa.js?v=20';
const CONFIG = {
  api: 'https://script.google.com/macros/s/AKfycbz7iiWdZ0010hK6RzA7ue_bhtcc1WKcoP6n_zEM4pW_QX4Itfimn_A1wtxXtmu3VLVK/exec',
  padlet: 'https://padlet.com/retocreativofest/retomentemilenial-de-ilustracion-semanal-fase-i-3ra-temporad-s024nmvzl4iygc78wdeu',
  autorizacion: 'https://docs.google.com/forms/d/e/1FAIpQLSeTf_vZNjg5LU_mMs1X9tqmrgBddUGMDKuzvqV9U7NuXeXW7A/viewform',
  web: 'https://retocreativofest.com',
  whatsapp: '584120390423',   // pagos del Club por Pago Móvil, Binance o Zinli
  patreon: 'https://www.patreon.com/RetoMenteMilenial',
  extra: 'https://script.google.com/macros/s/AKfycbxk2KkAccQuJHmErsKb8VTIrJtKTaiN3jgsIlue3S3hgVabA_BjcD3j8qQZ36hyBKzh4g/exec',
  banner: 'https://script.google.com/macros/s/AKfycbxhkh2pzpAtBkoDXof1U7P5TT7p-m9F1S70eanz58PqVaKVKj3wOgxjYs2ZbipwyBnMcA/exec'   // URL /exec del Apps Script «Banner del patrocinador · app». Vacío = sin banner mientras se sube el dibujo.   // URL /exec del Apps Script «Reto de la semana · web» (reenviar el correo del representante y ver rebotes). Vacío = sin botón de reenviar.
};

/* ---------- utilidades ---------- */
const $app = document.getElementById('app');
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const guardar = (k, v) => { try { v == null ? localStorage.removeItem('rcf.' + k) : localStorage.setItem('rcf.' + k, JSON.stringify(v)); } catch (e) {} };
const leer = k => { try { const v = localStorage.getItem('rcf.' + k); return v == null ? null : JSON.parse(v); } catch (e) { return null; } };
/* ¿Se abrió desde la app de Google Play? (envoltorio Android, TWA). Google no permite vender beneficios digitales
   por fuera de su sistema de pagos dentro de una app de la tienda: ahí el Club solo se vincula, no se compra. */
const PLAY = (() => {
  const desdePlay = String(document.referrer || '').indexOf('android-app://com.retocreativofest.retomentemilenial') === 0;
  /* 8 nov 2026: se recordaba para siempre en el teléfono, y como la app de Play comparte datos con Chrome,
     en el navegador normal también salía sin candados. Ahora lo recordado solo vale en modo app (pantalla completa,
     como abre la de Play, también al tocar un aviso); en una pestaña del navegador manda solo el origen real. */
  const modoApp = window.matchMedia && matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches;
  try { if (desdePlay) localStorage.setItem('rcf.play', '1'); return desdePlay || (modoApp && localStorage.getItem('rcf.play') === '1'); } catch (e) { return desdePlay; }
})();
const fecha = iso => { const d = new Date(iso); return DIAS[d.getDay()] + ' ' + d.getDate() + ' de ' + MESES[d.getMonth()]; };
const hora = iso => { const d = new Date(iso); let h = d.getHours(); const m = String(d.getMinutes()).padStart(2, '0'); const pm = h >= 12; h = h % 12 || 12; return h + ':' + m + (pm ? ' p. m.' : ' a. m.'); };
const ICO = {
  volver: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  google: '<svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.8 6C12.3 13.6 17.6 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 7l7.4 5.7c4.3-4 6.9-9.9 6.9-17.2z"/><path fill="#FBBC05" d="M10.4 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6C.9 16.6 0 20.2 0 24s.9 7.4 2.6 10.7l7.8-6z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.4 0-11.7-4.1-13.6-9.8l-7.8 6C6.6 42.6 14.6 48 24 48z"/></svg>',
  hoy: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  ranking: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>',
  mas: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  amigos: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.3-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/><circle cx="17" cy="9" r="2.8"/><path d="M16.5 14.6c2.6.1 4.5 1.8 5 4.9"/></svg>',
  yo: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4.2 4-6.5 8-6.5s7.2 2.3 8 6.5"/></svg>',
  chispa: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B0B0F" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/></svg>',
  /* Fuego de la racha (7 nov 2026): dibujado con el mismo trazo negro que la estrella de la chispa, en vez del emoji. */
  fuego: '<svg class="ico-fuego" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c.6 3.2 3.1 4.9 4.6 7.3 1.4 2.2 1.9 4.4 1.2 6.6C16.9 19.5 14.6 21.5 12 21.5s-5-2-5.8-5.1c-.6-2.4.1-4.6 1.6-6.4.2 1.5.9 2.6 2.1 3.2-.4-3.6.5-7.1 2.1-10.7z" fill="#FF8A1F" stroke="#0B0B0F" stroke-width="2.1" stroke-linejoin="round"/><path d="M12 12.2c1.3 1.4 2.4 2.6 2.3 4.4-.1 1.6-1.1 2.7-2.3 2.7s-2.3-1.1-2.3-2.6c0-1.6.9-2.9 2.3-4.5z" fill="#FFD60A" stroke="#0B0B0F" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  chispaMini: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" fill="#FFD60A" stroke="#0B0B0F" stroke-width="2.2" stroke-linejoin="round"/></svg>',
  compartir: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>',
  copiar: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>',
  externo: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>'
};
/* Arriba a la derecha de las pantallas con barra (7 nov 2026): el personaje armado por la persona; si todavía no tiene, la cara de su guía. */
const caraBarra = () => E.pj ? `<span class="cara pj" aria-hidden="true">${PJ.svg(E.pj)}</span>` : `<img class="cara" src="${caraGuia(E.guia)}" alt="">`;
/* Versión visible en Yo (7 nov 2026): para saber si un teléfono ya tiene la app nueva. Cambiarla junto con la de sw.js. */
const VERSION_APP = '79 · 7 nov';
/* Une las dos últimas palabras con un espacio que no se corta: nunca queda una palabra sola en la última línea. */
const sinViuda = t => { const p = String(t).trim().split(' '); return p.length > 2 ? p.slice(0, -1).join(' ') + '\u00a0' + p[p.length - 1] : String(t); };

let toastT;
function aviso(texto) {
  const t = document.getElementById('toast');
  t.textContent = texto; t.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 3500);
}

/* Pedidos al servidor. Si Google está saturado (mucha gente a la vez), reintenta solo hasta 3 veces
   esperando cada vez más. Las acciones que solo leen también se reintentan si falla la conexión. */
const API_LEER = ['hoy', 'perfil', 'mi_semana', 'ranking', 'amigos', 'club', 'votacion'];
const espera = ms => new Promise(ok => setTimeout(ok, ms));
async function apiUnaVez(accion, datos, intento) {
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), accion === 'subir' ? 60000 : 25000);
  let r;
  try {
    r = await fetch(CONFIG.api, {
      method: 'POST', credentials: 'omit', signal: ctl.signal,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(Object.assign({ accion }, datos || {}, intento ? { reintento: intento } : {}))
    });
  } catch (e) {
    return { ok: false, error: 'red' };
  } finally {
    clearTimeout(t);
  }
  try { return await r.json(); }
  catch (e) { return { ok: false, error: 'saturado' }; }   // Google respondió con una página de error: no llegó a correr
}
async function api(accion, datos) {
  let r;
  for (let i = 0; i <= 3; i++) {
    if (i) {
      if (i === 1 && API_LEER.indexOf(accion) < 0) aviso('Hay mucha gente conectada. Seguimos intentando…');
      await espera(1500 * Math.pow(2, i - 1) + Math.random() * 1000);
    }
    r = await apiUnaVez(accion, datos, i);
    const reintentar = r.error === 'ocupado' || r.error === 'saturado' || (r.error === 'red' && API_LEER.indexOf(accion) >= 0 && navigator.onLine !== false);
    if (r.ok || !reintentar) break;
  }
  if (r.error === 'saturado') r.error = 'ocupado';
  return r;
}

const ERRORES = {
  red: 'No hay conexión. Revisa tu internet e intenta otra vez.',
  servidor: 'Algo falló de nuestro lado. Intenta en un minuto.',
  ocupado: 'Hay mucha gente entrando. Intenta en un minuto.',
  google: 'Google no confirmó tu cuenta. Intenta otra vez o entra con tu correo.',
  correo: 'Ese correo no parece válido.',
  codigo: 'El código no coincide. Revísalo e intenta otra vez.',
  vencido: 'El código venció. Pide uno nuevo.',
  espera: 'Ya pediste varios códigos. Espera 15 minutos.',
  limite: 'Hoy ya enviamos muchos códigos. Entra con Google o intenta mañana.',
  usuario_invalido: 'Tu usuario debe tener de 3 a 30 letras, números, puntos o guiones bajos.',
  usuario_ocupado: 'Ese usuario ya lo tiene otra persona en la app. Si es tuyo, escríbenos a retocreativofest@gmail.com.',
  nombre: 'Escribe tu nombre.',
  edad: 'Responde las dos preguntas.',
  cumple: 'Elige el día y el mes de tu cumpleaños, o deja los dos en blanco.',
  estado: 'Elige el estado de Venezuela donde vives.',
  pais: 'Elige el país donde vives.',
  autorizacion: 'Primero tu representante tiene que confirmar la autorización. Cuando lo haga, se desbloquea solo.',
  sesion: 'Tu sesión venció. Entra otra vez.',
  perfil: 'Completa tu cuenta antes de subir tu dibujo.',
  tecnica: 'Elige si tu dibujo es tradicional o digital.',
  descripcion: 'Escribe una descripción corta de tu dibujo.',
  propio: 'Confirma que el dibujo es 100 % tuyo.',
  foto: 'Elige la foto de tu dibujo.',
  imagen: 'No pudimos leer esa foto. Prueba con otra (JPG o PNG).',
  cerrado: 'El reto de esta semana ya cerró. ¡Te esperamos en el próximo!',
  tablero: 'El Padlet de esta temporada todavía no está listo. Avísanos por el DM de @mentemilenial.',
  seccion: 'La sección de esta semana todavía no aparece en el Padlet. Intenta en unos minutos.',
  congelado: 'El Padlet está cerrado en este momento. Intenta cuando abra el reto.',
  padlet: 'El Padlet no recibió tu dibujo. Intenta otra vez en un minuto.',
  ya_subiste: 'Ya subiste tu dibujo de esta semana. ¡Solo se permite uno!',
  subiendo: 'Tu dibujo se está subiendo. Espera un minuto y revisa el Padlet.',
  retirado: 'Los Guardianes retiraron tu dibujo de esta semana y ya no puedes subir otro. Te escribimos al correo con el motivo.',
  no_existe: 'No encontramos a nadie con ese usuario en la app. Pídele que se registre primero.',
  tu_mismo: 'Ese es tu propio usuario 😄',
  ya_amigos: 'Ya son amigos.',
  ya_enviada: 'Ya le mandaste una solicitud. Espera a que la acepte.',
  max_amigos: 'Llegaste al máximo de 50 amigos.',
  no_amigos: 'Solo puedes dar toques a tus amigos.',
  toque_hoy: 'Ya le diste un toque hoy. Mañana puedes darle otro.',
  sticker: 'Elige un sticker.',
  codigo_club: 'Ese código no es válido.',
  patreon: 'Patreon no confirmó tu cuenta. Intenta otra vez.',
  patreon_usado: 'Ese Patreon ya está vinculado con otra cuenta de la app.',
  patreon_vencido: 'El enlace de Patreon venció. Toca otra vez «Vincular mi Patreon».',
  club: 'Esto es del Club Estrella.',
  sin_protectores: 'Ya usaste tus 2 protectores de este mes.',
  voto_cerrado: 'La votación ya cerró. Mira el podio.',
  voto_finalista: 'Ese dibujo no está entre las finalistas.',
  reporte: 'Elige el motivo del reporte.',
  bloqueaste: 'Bloqueaste a esa persona. Si quieres agregarla, primero desbloquéala abajo, en «Bloqueados».',
  reporte_limite: 'Ya enviaste 5 reportes hoy. Si es urgente, escríbenos a retocreativofest@gmail.com.',
  voto_propio: 'No puedes votar por tu propio dibujo.',
  voto_participa: 'Para votar, sube al menos un dibujo esta temporada.',
  voto_ya: 'Ya votaste esta semana. El voto no se puede cambiar.',
  ya_protegida: 'Esta semana ya está protegida.',
  anio: 'Elige el año en que naciste.',
  anio_menor: 'Con ese año todavía no tienes 18. Si ya los cumpliste, agrega tu cumpleaños; si no, elige «Tengo menos de 18».',
  edad_cambio: 'Si te registraste como menor, la edad cambia sola el día que cumples 18. Si te equivocaste al registrarte, escríbenos a retocreativofest@gmail.com.',
  pronto: '¡Ya casi! La app abre el 1 de diciembre. Te esperamos ese día para registrarte y preparar tu racha. 🎨',
  avisos_bloqueados: 'Los avisos están bloqueados en este teléfono. Actívalos en los ajustes: Notificaciones → Reto MM (en Chrome, en el candadito junto a la dirección).',
  avisos_cancelados: 'No se activaron los avisos. Puedes activarlos cuando quieras desde Yo.',
  avisos_no: 'Este teléfono o navegador no permite avisos. En Android usa Chrome; en iPhone, instala la app y ábrela desde el ícono.'
};
const textoError = e => ERRORES[e] || ERRORES.servidor;

/* ---------- estado ---------- */
const E = {
  pj: leer('personaje'), pjs: {},
  sesion: leer('sesion'), correo: leer('correo'), perfil: leer('perfil'),
  guia: leer('guia') || 'digi', borrador: {}, hoy: leer('hoy'), semana: leer('semana'), progreso: leer('progreso'), novedades: null, amigos: null, ranking: null, club: leer('club'), subida: {}, instalar: null
};
const imgGuia = g => 'img/' + (g === 'tradi' ? 'tradi' : 'digi') + '.webp';
const caraGuia = g => 'img/' + (g === 'tradi' ? 'tradi' : 'digi') + '-cara.webp';
const nombreCorto = () => (E.perfil && E.perfil.nombre ? E.perfil.nombre.split(' ')[0] : '');

/* 7 nov 2026: Hoy se vuelve a pintar varias veces mientras llegan los datos (reto, patrocinio, tu semana, votación).
   Antes cada vez subía al inicio y no dejaba bajar a la Chispa. Ahora, si es la MISMA pantalla, se queda donde estabas,
   y si no cambió nada, ni siquiera se vuelve a pintar. */
let ultimaVista = '', ultimoHtml = '';
function pintar(html, alPintar, vista) {
  const misma = !!vista && vista === ultimaVista;
  if (misma && html === ultimoHtml) return;
  const y = window.scrollY, ya = $app.scrollTop;   // en tablets se desplaza la tarjeta (.app), no la página
  ultimaVista = vista || ''; ultimoHtml = html;
  $app.innerHTML = html;
  window.scrollTo(0, misma ? y : 0); $app.scrollTop = misma ? ya : 0;
  const h = $app.querySelector('h1, h2');
  if (h) h.setAttribute('tabindex', '-1');
  if (alPintar) alPintar($app);
  estadoAutorizacion();
}

/* ---------- patrocinio: logo del Reto Aliado y franja «Con el apoyo de» ----------
   Viene del Apps Script aparte (CONFIG.extra), pestañas «Retos» (columnas marca, logo, premio) y «aliados». */
async function cargarPatrocinio() {
  if (!CONFIG.extra || (E.patro && Date.now() - E.patro.t < 6e5)) return;
  let r;
  try {
    const res = await fetch(CONFIG.extra, { method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ accion: 'patrocinio' }) });
    r = await res.json();
  } catch (e) { return; }
  if (!r || !r.ok) return;
  const antes = JSON.stringify(E.patro && E.patro.r);
  E.patro = { t: Date.now(), r };
  if (antes !== JSON.stringify(r) && estaEn === 'hoy' && E.hoy) dibujarHoy(E.hoy);
}
function marcaReto(a) {
  const r = E.patro && E.patro.r && E.patro.r.reto;
  return r && a && r.marca && Number(r.semana) === Number(a.semana) && String(r.temporada) === String(a.temporada) ? r.marca : null;
}
/* ---------- banner del patrocinador mientras se sube el dibujo (6 nov 2026) ----------
   Va incluido en el Reto Aliado. Solo para mayores de edad, a pantalla completa, sin enlace.
   Se ve al menos 4 segundos; después aparece la X. La barra muestra que el dibujo se está subiendo. */
async function cargarBanner(a) {
  if (!CONFIG.banner || !E.perfil || E.perfil.mayor !== 'Sí') return;
  if (!(E.banner && Date.now() - E.banner.t < 6e5)) {
    try { const r = await (await fetch(CONFIG.banner, { credentials: 'omit' })).json(); E.banner = { t: Date.now(), b: r && r.ok ? r.banner : null }; }
    catch (e) { return; }
  }
  const b = E.banner.b;
  if (b && b.url && a && Number(b.semana) === Number(a.semana) && String(b.temporada) === String(a.temporada) && !E.banner.img) {
    const img = new Image(); img.src = b.url; E.banner.img = img;   // se descarga antes, así sale al instante
  }
}
function bannerListo(a) {
  const b = E.banner && E.banner.b, img = E.banner && E.banner.img;
  if (!b || !img || !img.complete || !img.naturalWidth || !E.perfil || E.perfil.mayor !== 'Sí') return null;
  return Number(b.semana) === Number(a.semana) && String(b.temporada) === String(a.temporada) ? b : null;
}
function mostrarBanner(b) {
  const MIN = 4000, t0 = Date.now();
  const ov = document.createElement('div');
  ov.className = 'ban-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Presentado por ' + (b.marca || 'nuestra marca aliada'));
  ov.innerHTML = `<img src="${esc(b.url)}" alt="${esc(b.descripcion || 'Banner de ' + (b.marca || 'la marca aliada'))}">
    <button type="button" class="ban-x" aria-label="Cerrar" hidden>✕</button>
    <div class="ban-pie"><span class="ban-txt" role="status">Subiendo tu dibujo…</span><div class="ban-barra"><i></i></div><small>Reto presentado por ${esc(b.marca || 'nuestra marca aliada')}</small></div>`;
  document.body.appendChild(ov);
  try { fetch(CONFIG.banner + '?visto=1&t=' + encodeURIComponent(b.temporada) + '&s=' + encodeURIComponent(b.semana), { credentials: 'omit', mode: 'no-cors' }).catch(() => {}); } catch (e) {}   // contador del informe para la marca
  let cerrado = false, avisar = null;
  const x = ov.querySelector('.ban-x');
  const cerrar = () => { if (cerrado) return; cerrado = true; ov.remove(); if (avisar) avisar(); };
  x.addEventListener('click', cerrar);
  setTimeout(() => { if (!cerrado) { x.hidden = false; x.focus(); } }, MIN);
  /* Al terminar la subida: si falló, se quita ya; si salió bien, llena la barra y espera la X (o 4 s más). */
  return ok => new Promise(listo => {
    if (cerrado) return listo();
    if (!ok) { cerrar(); return listo(); }
    avisar = listo;
    ov.querySelector('.ban-txt').textContent = '¡Listo! Tu dibujo ya está en el Padlet';
    ov.querySelector('.ban-barra').classList.add('llena');
    setTimeout(cerrar, Math.max(MIN - (Date.now() - t0), 0) + 4000);
  });
}
/* 8 nov 2026: pantalla «Subiendo tu dibujo…» cuando la semana NO tiene banner de marca.
   Con tu guía (Tradi o Digi) y, si corresponde, la promo del Club Estrella (mismas reglas: solo mayores,
   nunca miembros, nunca en Google Play, 1 vez al día). Mientras sube, la promo no tiene botón (para no salir a mitad). */
function mostrarCarga() {
  const promo = promoClub(), t0 = Date.now(), MIN = 2500;
  const ov = document.createElement('div');
  ov.className = 'carga-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Subiendo tu dibujo');
  ov.innerHTML = `<div class="carga-caja">
      <img class="carga-guia" src="${imgGuia(E.guia)}" alt="" width="130" height="125">
      <span class="ban-txt" role="status">Subiendo tu dibujo al Padlet…</span>
      <div class="ban-barra"><i></i></div>
      <small class="carga-nota">No cierres la app, tarda unos segundos.</small>
      ${promo ? `<div class="carga-promo">${bannerClub('Mientras sube… ¿conoces el Club&nbsp;Estrella?')}</div>` : ''}
      <div class="carga-btns" hidden>${promo ? '<button type="button" class="btn amarillo" id="cg-club">★ CONOCER EL CLUB ESTRELLA</button>' : ''}<button type="button" class="btn blanco" id="cg-seguir">CONTINUAR</button></div>
    </div>`;
  const cb = ov.querySelector('#ch-club-b'); if (cb) cb.remove();
  document.body.appendChild(ov);
  return ok => new Promise(listo => {
    const cerrar = club => { ov.remove(); listo(club); };
    if (!ok) return cerrar(false);
    ov.querySelector('.ban-txt').textContent = '¡Listo! Tu dibujo ya está en el Padlet 🎉';
    ov.querySelector('.ban-barra').classList.add('llena');
    ov.querySelector('.carga-nota').hidden = true;
    if (!promo) return setTimeout(() => cerrar(false), Math.max(MIN - (Date.now() - t0), 900));
    const bt = ov.querySelector('.carga-btns'); bt.hidden = false;
    ov.querySelector('#cg-club').addEventListener('click', () => cerrar(true));
    ov.querySelector('#cg-seguir').addEventListener('click', () => cerrar(false));
    ov.querySelector('#cg-seguir').focus();
  });
}
function franjaAliados() {
  const al = ((E.patro && E.patro.r && E.patro.r.aliados) || []).filter(x => x.codigo);
  if (!al.length) return '';
  return `<div class="codigos-app"><strong>🏷️ Descuentos para la comunidad</strong>${al.map(x => `<div class="codigo-app">${x.logo ? `<img src="${esc(x.logo)}" alt="${esc(x.nombre)}" height="30">` : ''}<span><b>${esc(x.nombre)}</b>${x.descuento ? ': ' + esc(x.descuento) : ''}</span><button type="button" class="codigo-btn" data-codigo="${esc(x.codigo)}" aria-label="Copiar el código ${esc(x.codigo)}">${esc(x.codigo)} <small>Copiar</small></button></div>`).join('')}</div>`;
}
/* Los dos contadores de arriba: al tocarlos explican qué cuentan (7 nov 2026). */
document.addEventListener('click', ev => {
  const b = ev.target.closest && ev.target.closest('[data-explica]');
  if (!b) return;
  aviso(b.dataset.explica === 'chispas'
    ? '✦ Chispas: días seguidos haciendo la Chispa del día. Es aparte de tu racha.'
    : '🔥 Racha del reto: semanas seguidas subiendo tu dibujo. Esta es la que cuenta para el reto.');
});
/* Copiar el código de descuento de un aliado (funciona en cualquier pantalla que lo muestre). */
document.addEventListener('click', async ev => {
  const b = ev.target.closest && ev.target.closest('[data-codigo]');
  if (!b) return;
  const c = b.dataset.codigo;
  try { await navigator.clipboard.writeText(c); aviso('Código ' + c + ' copiado. Úsalo al comprar.'); }
  catch (e) { aviso('Tu código es ' + c); }
});

/* ---------- autorización del representante: en qué va, reenviar el correo y rebotes ----------
   Usa el Apps Script aparte (CONFIG.extra). Se consulta como mucho una vez por minuto. */
let autCache = null, autPidiendo = false;
async function estadoAutorizacion(forzar) {
  const caja = $app.querySelector('[data-aut-estado]');
  if (!caja || !E.sesion) return;
  if (!CONFIG.extra) { caja.innerHTML = cajaAutTexto({ estado: 'sin_extra' }); return; }
  if (autCache && !forzar && Date.now() - autCache.t < 6e4) { caja.innerHTML = cajaAutTexto(autCache.r); conectarAut(caja); return; }
  caja.innerHTML = cajaAutTexto(autCache ? autCache.r : { estado: 'sin_extra' });
  if (autPidiendo) return;
  autPidiendo = true;
  let r;
  try {
    const res = await fetch(CONFIG.extra, { method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ accion: 'autorizacion_estado', sesion: E.sesion }) });
    r = await res.json();
  } catch (e) { r = null; }
  autPidiendo = false;
  if (!r || !r.ok) return;
  autCache = { t: Date.now(), r };
  const ahora = $app.querySelector('[data-aut-estado]');
  if (ahora) { ahora.innerHTML = cajaAutTexto(r); conectarAut(ahora); }
  if (r.estado === 'confirmada' && E.perfil && E.perfil.bloqueado) {   // ya confirmó: refresca el perfil para desbloquear
    const p = await api('perfil', { sesion: E.sesion });
    if (p.ok) { E.perfil = p.perfil; guardar('perfil', E.perfil); if (!bloqueado()) { aviso('🎉 ¡Tu representante confirmó! Ya puedes subir tus dibujos.'); ir(estaEn || 'hoy'); } }
  }
}
function cajaAutTexto(r) {
  const spam = 'Si no lo ve, que revise <b>spam</b> y <b>Promociones</b> y agregue retocreativofest@gmail.com a sus contactos.';
  if (r.estado === 'pendiente') return `<span class="aut-t">📬 Le enviamos el correo a <b>${esc(r.correo)}</b>. ${spam}</span>
    ${r.reenviosQuedan > 0 ? '<button type="button" class="btn blanco chico" data-reenviar>✉️ REENVIAR EL CORREO</button>' : '<span class="aut-t">Hoy ya reenviamos el correo varias veces. Mañana puedes reenviarlo otra vez.</span>'}`;
  if (r.estado === 'rebotado') return `<span class="aut-t aut-alerta">⚠️ El correo de tu representante (<b>${esc(r.correo)}</b>) no recibió nuestro mensaje: puede estar lleno o mal escrito. Pídele que llene el formulario otra vez con otro correo.</span>`;
  if (r.estado === 'sin_formulario') return '<span class="aut-t">Tu representante todavía no llena el formulario. Mándaselo por WhatsApp con el botón de abajo.</span>';
  if (r.estado === 'confirmada') return '<span class="aut-t">✅ Tu representante ya confirmó. Estamos desbloqueando tu cuenta…</span>';
  return `<span class="aut-t">Cuando tu representante llene el formulario, le llega un correo de retocreativofest@gmail.com para confirmar. ${spam}</span>`;
}
function conectarAut(caja) {
  const b = caja.querySelector('[data-reenviar]');
  if (!b) return;
  b.addEventListener('click', async () => {
    b.disabled = true; b.textContent = 'Reenviando…';
    let r;
    try {
      const res = await fetch(CONFIG.extra, { method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ accion: 'autorizacion_reenviar', sesion: E.sesion }) });
      r = await res.json();
    } catch (e) { r = { ok: false, error: 'red' }; }
    if (r.ok) { aviso('✉️ Listo: le reenviamos el correo a ' + r.correo + '.'); autCache = null; return estadoAutorizacion(true); }
    const msj = { limite_reenvio: 'Hoy ya reenviamos el correo 3 veces. Intenta mañana.', espera_reenvio: 'Acabamos de reenviarlo. Espera 10 minutos antes de pedirlo otra vez.', rebotado: 'Ese correo no recibe mensajes. Tu representante tiene que llenar el formulario con otro correo.', confirmada: '¡Tu representante ya confirmó!', limite: ERRORES.limite, sesion: ERRORES.sesion };
    aviso(msj[r.error] || textoError(r.error));
    autCache = null; estadoAutorizacion(true);
  });
}
const on = (sel, ev, fn) => { const el = $app.querySelector(sel); if (el) el.addEventListener(ev, fn); return el; };

/* ---------- bienvenida ---------- */
function vistaBienvenida(error) {
  const d = E.guia !== 'tradi';
  pintar(`
    <div class="hero">
      <span class="caja" style="background:var(--amarillo);border-width:2px;border-radius:999px;padding:3px 12px;font-size:12px">#RetoMenteMilenial · Temporada 2027</span>
      <h1>¡Dibuja cada semana con Tradi y Digi!</h1>
      <div class="guias">
        <img src="img/digi.webp" alt="Digi dibujando en su tableta" class="${d ? 'on' : 'off'}" width="120" height="116">
        <img src="img/tradi.webp" alt="Tradi dibujando en papel" class="${d ? 'off' : 'on'}" width="113" height="116">
      </div>
    </div>
    <div class="cont">
      ${leer('invitacion') ? `<div class="caja crema">👋 <b>@${esc(leer('invitacion'))}</b> te invitó al reto. Crea tu cuenta y te ayudamos a agregarlo.</div>` : ''}
      <div class="caja">Mira el reto de la semana, sube tu dibujo al <b>Padlet</b> y cuida tu racha con tus amigos.</div>
      <div class="fila-t"><strong>Elige tu guía</strong><span>Puedes cambiarla cuando quieras</span></div>
      <div class="par">
        <button type="button" class="guia-btn" data-guia="digi" aria-pressed="${d}"><strong>Digi${d ? ' ✓' : ''}</strong> <span>digital</span></button>
        <button type="button" class="guia-btn" data-guia="tradi" aria-pressed="${!d}"><strong>Tradi${d ? '' : ' ✓'}</strong> <span>tradicional</span></button>
      </div>
      ${error ? `<div class="error" role="alert">${esc(error)}</div>` : ''}
      <button type="button" class="btn google" id="g">${ICO.google} Continuar con Google</button>
      <button type="button" class="enlace" id="c">Entrar con mi correo (te mandamos un código)</button>
      <span class="nota">Usamos tu correo solo para tu cuenta del reto. Nunca vemos tu contraseña. <a href="${CONFIG.web}/privacidad.html" target="_blank" rel="noopener">Privacidad</a></span>
    </div>`, root => {
    root.querySelectorAll('[data-guia]').forEach(b => b.addEventListener('click', () => { E.guia = b.dataset.guia; guardar('guia', E.guia); vistaBienvenida(); }));
    on('#g', 'click', entrarGoogle);
    on('#c', 'click', () => vistaCorreo());
  });
}

async function entrarGoogle(ev) {
  const b = ev.currentTarget; b.disabled = true; b.lastChild.textContent = ' Abriendo Google…';
  let r;
  try {
    const { googleIdToken } = await import('./google.js?v=2');
    const g = await googleIdToken();
    b.lastChild.textContent = ' Entrando…';
    r = await api('entrar_google', { idToken: g.idToken });
  } catch (e) {
    const cancelado = e && /popup-closed|cancelled-popup/.test(e.code || '');
    return vistaBienvenida(cancelado ? '' : 'No se pudo abrir Google en este teléfono. Prueba «Entrar con mi correo».');
  }
  if (!r.ok) return vistaBienvenida(textoError(r.error));
  despuesDeEntrar(r);
}

function despuesDeEntrar(r) {
  E.sesion = r.sesion; E.correo = r.correo; E.perfil = r.perfil;
  guardar('sesion', E.sesion); guardar('correo', E.correo); guardar('perfil', E.perfil);
  if (r.perfil.completo) return ir('hoy');
  E.borrador = { nombre: r.perfil.nombre || r.perfil.sugerido || '', usuario: r.perfil.usuario || '' };
  vistaPerfil();
}

/* ---------- entrar con correo ---------- */
function vistaCorreo(estado) {
  estado = estado || {};
  const paso2 = !!estado.enviado;
  pintar(`
    <header class="barra">
      <button type="button" class="volver" id="v" aria-label="Volver">${ICO.volver}</button>
      <div style="flex:1"><h1>Entrar con tu correo</h1><span class="sub">${paso2 ? 'Revisa tu bandeja de entrada' : 'Te mandamos un código de 6 números'}</span></div>
      ${caraBarra()}
    </header>
    <form class="cont" id="f" novalidate>
      ${paso2 ? `
        <div class="caja agua">Te enviamos un código a <b>${esc(estado.correo)}</b>. Si no aparece en un minuto, revisa la carpeta de spam o promociones.</div>
        <label class="campo" for="cod">Código
          <input id="cod" class="codigo" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]*" required>
        </label>` : `
        <label class="campo" for="cor">Tu correo
          <input id="cor" type="email" inputmode="email" autocomplete="email" value="${esc(estado.correo || '')}" required>
          <span class="ayuda">Si eres menor de edad, usa tu correo o el de tu representante.</span>
        </label>`}
      ${estado.error ? `<div class="error" role="alert">${esc(estado.error)}</div>` : ''}
      <button type="submit" class="btn" id="ok">${paso2 ? 'ENTRAR' : 'MANDAR EL CÓDIGO'}</button>
      ${paso2 ? '<button type="button" class="enlace" id="otro">Usar otro correo o pedir otro código</button>' : ''}
    </form>`, root => {
    on('#v', 'click', () => paso2 ? vistaCorreo({ correo: estado.correo }) : vistaBienvenida());
    on('#otro', 'click', () => vistaCorreo({ correo: estado.correo }));
    const campo = root.querySelector(paso2 ? '#cod' : '#cor'); campo.focus();
    on('#f', 'submit', async ev => {
      ev.preventDefault();
      const ok = root.querySelector('#ok'); ok.disabled = true; ok.textContent = 'Un momento…';
      if (!paso2) {
        const correo = campo.value.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) return vistaCorreo({ correo, error: ERRORES.correo });
        const r = await api('codigo_pedir', { correo });
        if (!r.ok) return vistaCorreo({ correo, error: textoError(r.error) });
        return vistaCorreo({ correo, enviado: true });
      }
      const r = await api('codigo_entrar', { correo: estado.correo, codigo: campo.value });
      if (!r.ok) return vistaCorreo({ correo: estado.correo, enviado: r.error !== 'vencido', error: textoError(r.error) });
      despuesDeEntrar(r);
    });
  });
}

/* ---------- registro: nombre y usuario ---------- */
function vistaPerfil(error) {
  const completando = !!E.completando;   // 3 nov: menor que acaba de recibir el permiso de su representante
  const editando = !!(E.perfil && E.perfil.completo) && !completando;   // ya tenía cuenta: viene de «Editar mis datos»
  const b = E.borrador;
  pintar(`
    <header class="barra">
      ${editando ? `<button type="button" class="volver" id="v" aria-label="Volver">${ICO.volver}</button>` : ''}
      <div style="flex:1"><h1>Tu cuenta</h1><span class="sub">${completando ? '🎉 ¡Tu representante confirmó! Completa tus datos' : 'Así te verán en el Padlet'}</span></div>
      ${caraBarra()}
    </header>
    <form class="cont" id="f" novalidate>
      ${E.correo ? `<div class="caja agua" style="display:flex;align-items:center;gap:8px"><span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis">✓ ${esc(E.correo)}</span><button type="button" class="enlace" id="salir" style="min-height:0;padding:0 4px;font-size:12px">Cambiar</button></div>` : ''}
      <label class="campo" for="nom">Nombre y apellido
        <input id="nom" type="text" autocomplete="name" maxlength="60" value="${esc(b.nombre || '')}" required>
        <span class="ayuda">Si eres menor de edad, solo mostraremos tu nombre de pila, y lo guardamos cuando tu representante te autorice.</span>
      </label>
      <label class="campo" for="usr">Tu usuario en redes
        <input id="usr" type="text" autocapitalize="none" autocomplete="username" spellcheck="false" maxlength="31" value="${b.usuario ? '@' + esc(b.usuario) : ''}" placeholder="@tu.usuario" required>
        <span class="ayuda">El de Instagram o TikTok. Con él te encuentran tus amigos y se cuentan tus puntos.</span>
      </label>
      <div class="muestra" aria-hidden="true"><i></i><span><b id="prev">Nombre · @usuario</b><small>Así se verá el título en el Padlet</small></span></div>
      <div class="caja crema" id="cambio" role="note" hidden></div>
      ${error ? `<div class="error" role="alert">${esc(error)}</div>` : ''}
      ${editando ? '' : '<span class="pasos" aria-label="Paso 1 de 3"><i class="on"></i><i></i><i></i></span>'}
      <button type="submit" class="btn">SIGUIENTE</button>
    </form>`, root => {
    const nom = root.querySelector('#nom'), usr = root.querySelector('#usr'), prev = root.querySelector('#prev');
    const norm = u => u.trim().replace(/^@+/, '').toLowerCase();
    const antes = (E.perfil && E.perfil.usuario) || '', cambio = root.querySelector('#cambio');
    const act = () => {
      prev.textContent = (nom.value.trim().split(' ')[0] || 'Nombre') + ' · @' + (norm(usr.value) || 'usuario');
      const nuevo = norm(usr.value), avisa = !!(antes && nuevo && nuevo !== antes);
      cambio.hidden = !avisa;
      if (avisa) cambio.innerHTML = `<strong class="t">Vas a cambiar @${esc(antes)} por @${esc(nuevo)}</strong>Tus puntos, tu racha y tus dibujos anteriores no se pierden: van con tu cuenta, no con tu usuario. Tus próximos dibujos salen con el usuario nuevo; los que ya están en el Padlet conservan el título anterior.`;
    };
    nom.addEventListener('input', act); usr.addEventListener('input', act); act();
    on('#salir', 'click', cerrarSesion);
    on('#v', 'click', () => { E.borrador = {}; ir('yo'); });
    on('#f', 'submit', ev => {
      ev.preventDefault();
      const nombre = nom.value.trim().replace(/\s+/g, ' '), usuario = norm(usr.value);
      E.borrador.nombre = nombre; E.borrador.usuario = usuario;
      if (nombre.length < 2) return vistaPerfil(ERRORES.nombre);
      guardar('nombreLocal', nombre.split(' ')[0]);   // solo en este teléfono: sirve para completar los datos de un menor después del permiso
      if (!/^[a-z0-9._]{3,30}$/.test(usuario)) return vistaPerfil(ERRORES.usuario_invalido);
      vistaEdad();
    });
  });
}

/* Lista cerrada de países: así nadie escribe mal el nombre. Arriba, los más comunes en la comunidad. */
const PAISES_FRECUENTES = ['Colombia', 'España', 'Estados Unidos', 'Chile', 'Perú', 'Argentina', 'Panamá', 'México', 'Ecuador', 'Brasil', 'República Dominicana', 'Canadá', 'Italia', 'Portugal'];
const PAISES = ['Afganistán', 'Albania', 'Alemania', 'Andorra', 'Angola', 'Antigua y Barbuda', 'Arabia Saudita', 'Argelia', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaiyán', 'Bahamas', 'Bangladés', 'Barbados', 'Baréin', 'Bélgica', 'Belice', 'Benín', 'Bielorrusia', 'Bolivia', 'Bonaire', 'Bosnia y Herzegovina', 'Botsuana', 'Brasil', 'Brunéi', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Bután', 'Cabo Verde', 'Camboya', 'Camerún', 'Canadá', 'Catar', 'Chad', 'Chequia', 'Chile', 'China', 'Chipre', 'Colombia', 'Comoras', 'Congo', 'Corea del Norte', 'Corea del Sur', 'Costa de Marfil', 'Costa Rica', 'Croacia', 'Cuba', 'Curazao', 'Dinamarca', 'Dominica', 'Ecuador', 'Egipto', 'El Salvador', 'Emiratos Árabes Unidos', 'Eritrea', 'Eslovaquia', 'Eslovenia', 'España', 'Estados Unidos', 'Estonia', 'Esuatini', 'Etiopía', 'Filipinas', 'Finlandia', 'Fiyi', 'Francia', 'Gabón', 'Gambia', 'Georgia', 'Ghana', 'Granada', 'Grecia', 'Guatemala', 'Guayana Francesa', 'Guinea', 'Guinea Ecuatorial', 'Guinea-Bisáu', 'Guyana', 'Haití', 'Honduras', 'Hong Kong', 'Hungría', 'India', 'Indonesia', 'Irak', 'Irán', 'Irlanda', 'Islandia', 'Islas Marshall', 'Islas Salomón', 'Israel', 'Italia', 'Jamaica', 'Japón', 'Jordania', 'Kazajistán', 'Kenia', 'Kirguistán', 'Kiribati', 'Kuwait', 'Laos', 'Lesoto', 'Letonia', 'Líbano', 'Liberia', 'Libia', 'Liechtenstein', 'Lituania', 'Luxemburgo', 'Macedonia del Norte', 'Madagascar', 'Malasia', 'Malaui', 'Maldivas', 'Malí', 'Malta', 'Marruecos', 'Mauricio', 'Mauritania', 'México', 'Micronesia', 'Moldavia', 'Mónaco', 'Mongolia', 'Montenegro', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Nicaragua', 'Níger', 'Nigeria', 'Noruega', 'Nueva Zelanda', 'Omán', 'Países Bajos', 'Pakistán', 'Palaos', 'Palestina', 'Panamá', 'Papúa Nueva Guinea', 'Paraguay', 'Perú', 'Polonia', 'Portugal', 'Puerto Rico', 'Reino Unido', 'República Centroafricana', 'República Democrática del Congo', 'República Dominicana', 'Ruanda', 'Rumania', 'Rusia', 'Samoa', 'San Cristóbal y Nieves', 'San Marino', 'San Vicente y las Granadinas', 'Santa Lucía', 'Santo Tomé y Príncipe', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leona', 'Singapur', 'Siria', 'Somalia', 'Sri Lanka', 'Sudáfrica', 'Sudán', 'Sudán del Sur', 'Suecia', 'Suiza', 'Surinam', 'Tailandia', 'Tanzania', 'Tayikistán', 'Timor Oriental', 'Togo', 'Tonga', 'Trinidad y Tobago', 'Túnez', 'Turkmenistán', 'Turquía', 'Tuvalu', 'Ucrania', 'Uganda', 'Uruguay', 'Uzbekistán', 'Vanuatu', 'Vaticano', 'Vietnam', 'Yemen', 'Yibuti', 'Zambia', 'Zimbabue'].sort((a, b) => a.localeCompare(b, 'es'));
const OTRO_PAIS = 'Otro país';
const ESTADOS = ['Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar', 'Carabobo', 'Cojedes', 'Delta Amacuro', 'Distrito Capital', 'Falcón', 'Guárico', 'La Guaira', 'Lara', 'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre', 'Táchira', 'Trujillo', 'Yaracuy', 'Zulia'];
const fechaValida = mmdd => { const [m, d] = mmdd.split('-').map(Number); return d >= 1 && d <= [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1]; };

/* ---------- registro: edad y país ---------- */
function vistaEdad(error) {
  const b = E.borrador;
  const p = E.perfil || {};
  if (b.mayor == null && p.mayor) { b.mayor = p.mayor; b.venezuela = p.venezuela; b.whatsapp = p.whatsapp; b.ofertas = p.ofertas; }
  const conCumple = 'cumple' in p;   // el Apps Script ya guarda el cumpleaños y el estado
  if (b.cumple == null) b.cumple = p.cumple || '';
  if (b.estado == null) b.estado = p.estado || '';
  if (b.pais == null) b.pais = p.pais || '';
  if (b.anio == null) b.anio = p.anio || '';
  const menorFijo = p.mayor === 'No' && !!p.completo;   // 7 nov 2026: un menor ya registrado no puede pasarse a mayor (cambia solo a los 18)
  if (menorFijo) b.mayor = 'No';
  const anioHoy = new Date(ahora() - 4 * 36e5).getUTCFullYear();
  const [cm, cd] = String(b.cumple || '').split('-');
  const mayor = b.mayor === 'Sí', menor = b.mayor === 'No', vzla = b.venezuela === 'Sí', fuera = b.venezuela === 'No';
  /* 3 nov 2026 (COPPA y Google Play Familias): antes del permiso del representante, de un menor solo se guarda el usuario
     y si vive o no en Venezuela. El nombre de pila, el cumpleaños y el estado o país se piden cuando el representante confirma. */
  const previo = menor && !(p.mayor === 'No' && p.bloqueado === false && p.usuario);
  const conDatos = conCumple && !previo;
  const tel = String(b.whatsapp || '').replace(/^\+58/, '');
  const msj = encodeURIComponent('Hola. Quiero participar en el #RetoMenteMilenial, un reto semanal de dibujo, y como soy menor de edad necesito tu autorización. Es este formulario: ' + CONFIG.autorizacion);
  pintar(`
    <header class="barra">
      <button type="button" class="volver" id="v" aria-label="Volver">${ICO.volver}</button>
      <div style="flex:1"><h1>Edad y país</h1><span class="sub">Para aplicar las bases del reto</span></div>
      ${caraBarra()}
    </header>
    <div class="cont">
      <fieldset><legend>¿Cuántos años tienes?</legend>
        <div class="par"><button type="button" class="opcion" data-k="mayor" data-v="Sí" aria-pressed="${mayor}" ${menorFijo ? 'disabled' : ''}>Tengo 18 o más</button><button type="button" class="opcion" data-k="mayor" data-v="No" aria-pressed="${menor}">Tengo menos de 18</button></div>
        ${menorFijo ? '<span class="ayuda">El día que cumplas 18, la app te cambia sola, con el año que dio tu representante. Si te equivocaste al registrarte, escríbenos a retocreativofest@gmail.com.</span>' : ''}
      </fieldset>
      ${mayor ? `<label class="campo" for="anio">¿En qué año naciste?
        <select id="anio" required><option value="">Elige el año</option>${Array.from({ length: 83 }, (_, i) => anioHoy - 18 - i).map(y => `<option ${String(b.anio) === String(y) ? 'selected' : ''}>${y}</option>`).join('')}</select>
        <span class="ayuda">Nunca lo mostramos. Solo lo usamos en totales, por ejemplo cuántas personas tienen entre 18 y 24&nbsp;años.</span>
      </label>` : ''}
      ${conDatos ? `<fieldset><legend>Tu cumpleaños <span class="ayuda">(opcional)</span></legend>
        <div class="par"><select id="cd" aria-label="Día"><option value="">Día</option>${Array.from({ length: 31 }, (_, i) => `<option value="${String(i + 1).padStart(2, '0')}" ${cd === String(i + 1).padStart(2, '0') ? 'selected' : ''}>${i + 1}</option>`).join('')}</select><select id="cm" aria-label="Mes"><option value="">Mes</option>${MESES.map((m, i) => `<option value="${String(i + 1).padStart(2, '0')}" ${cm === String(i + 1).padStart(2, '0') ? 'selected' : ''}>${m}</option>`).join('')}</select></div>
        <span class="ayuda">Ese día te llega una sorpresa del Reto 🎂</span></fieldset>` : ''}
      <fieldset><legend>¿Dónde vives?</legend>
        <div class="par"><button type="button" class="opcion" data-k="venezuela" data-v="Sí" aria-pressed="${vzla}">Vivo en Venezuela</button><button type="button" class="opcion" data-k="venezuela" data-v="No" aria-pressed="${fuera}">Vivo en otro país</button></div>
      </fieldset>
      ${fuera ? `<div class="caja rosa" role="note"><strong class="t">Vives fuera de Venezuela</strong>Puedes participar, subir tus dibujos y tener racha con tus amigos. Pero tus puntos no cuentan para el ranking global ni para los premios: son para personas que viven en Venezuela.</div>` : ''}
      ${fuera && conDatos ? `<label class="campo" for="pais">¿En qué país vives?
        <select id="pais" required><option value="">Elige tu país</option>
          ${b.pais && PAISES.indexOf(b.pais) < 0 && b.pais !== OTRO_PAIS ? `<option selected>${esc(b.pais)}</option>` : ''}
          <optgroup label="Más frecuentes">${PAISES_FRECUENTES.map(x => `<option ${b.pais === x ? 'selected' : ''}>${x}</option>`).join('')}</optgroup>
          <optgroup label="Todos los países">${PAISES.filter(x => PAISES_FRECUENTES.indexOf(x) < 0).map(x => `<option ${b.pais === x ? 'selected' : ''}>${x}</option>`).join('')}<option ${b.pais === OTRO_PAIS ? 'selected' : ''}>${OTRO_PAIS}</option></optgroup>
        </select>
      </label>` : ''}
      ${vzla && conDatos ? `<label class="campo" for="est">¿En qué estado vives?
        <select id="est" required><option value="">Elige tu estado</option>${ESTADOS.map(e => `<option ${b.estado === e ? 'selected' : ''}>${e}</option>`).join('')}</select>
      </label>` : ''}
      ${vzla ? `<div class="caja agua">Vives en Venezuela: compites en el ranking global y por los premios.</div>` : ''}
      ${menor && !(p.completo && p.bloqueado === false) ? `<div class="caja crema"><strong class="t">Tu representante tiene que autorizarte</strong>
          <span style="display:block;font-weight:600;margin-bottom:8px">Mándale este formulario. Hasta que lo llene y confirme el correo que le llega, puedes ver el reto y hacer la Chispa del día, pero todavía no subir dibujos ni agregar amigos.</span>
          <span style="display:block;font-weight:600;margin-bottom:8px">📬 El correo llega de retocreativofest@gmail.com. Si no lo ve, que revise spam y Promociones.</span>
          ${previo ? '<span style="display:block;font-weight:600;margin-bottom:8px">🔒 Por ahora solo guardamos tu usuario. Cuando tu representante confirme, te pedimos tu nombre, tu estado o país y tu cumpleaños.</span>' : ''}
          <a class="btn turquesa chico" href="https://wa.me/?text=${msj}" target="_blank" rel="noopener">📲 MANDAR EL FORMULARIO POR WHATSAPP</a></div>` : ''}
      ${mayor ? `
        <label class="campo" for="tel">WhatsApp <span class="ayuda">(opcional)</span>
          <span class="tel">${vzla || !fuera ? '<span>+58</span>' : ''}<input id="tel" type="tel" inputmode="tel" autocomplete="tel" value="${esc(vzla || !fuera ? tel : b.whatsapp || '')}" placeholder="${fuera ? '+1 555 123 4567' : '412 123 4567'}"></span>
        </label>
        <label class="check" for="ofe"><input id="ofe" type="checkbox" ${b.ofertas === 'Sí' ? 'checked' : ''}><span>Quiero recibir ofertas y descuentos del Reto Creativo Fest por correo y WhatsApp. <span style="font-weight:600;color:var(--muted)">Puedes darte de baja cuando quieras.</span></span></label>` : ''}
      ${error ? `<div class="error" role="alert">${esc(error)}</div>` : ''}
      <span class="nota izq">Nunca mostramos tu edad, tu país, tu estado, tu cumpleaños ni tu contacto en la app. Para entregar premios verificamos la edad y el país en persona.</span>
      ${E.perfil && E.perfil.completo && !E.completando ? '' : '<span class="pasos" aria-label="Paso 2 de 3"><i></i><i class="on"></i><i></i></span>'}
      <button type="button" class="btn" id="ok">${E.perfil && E.perfil.completo && !E.completando ? 'GUARDAR' : 'SIGUIENTE'}</button>
    </div>`, root => {
    const leerCampos = () => {
      const t = root.querySelector('#tel'), o = root.querySelector('#ofe');
      if (t) b.whatsapp = (b.venezuela === 'No' ? '' : '+58') + t.value.trim();
      if (o) b.ofertas = o.checked ? 'Sí' : 'No';
      const d = root.querySelector('#cd'), m = root.querySelector('#cm');
      if (d && m) b.cumple = d.value && m.value ? m.value + '-' + d.value : '';
      const e = root.querySelector('#est');
      if (e) b.estado = e.value;
      const pa = root.querySelector('#pais');
      if (pa) b.pais = pa.value;
      const an = root.querySelector('#anio');
      if (an) b.anio = an.value;
    };
    root.querySelectorAll('[data-k]').forEach(btn => btn.addEventListener('click', () => { leerCampos(); b[btn.dataset.k] = btn.dataset.v; vistaEdad(); }));
    on('#v', 'click', () => { leerCampos(); vistaPerfil(); });
    on('#ok', 'click', async ev => {
      leerCampos();
      if (!b.mayor || !b.venezuela) return vistaEdad(ERRORES.edad);
      const d = root.querySelector('#cd'), m = root.querySelector('#cm');
      if (conDatos && b.venezuela === 'Sí' && !b.estado) return vistaEdad(ERRORES.estado);
      if (conDatos && b.venezuela === 'No' && (b.pais || '').length < 2) return vistaEdad(ERRORES.pais);
      if (d && m && (!!d.value !== !!m.value || (b.cumple && !fechaValida(b.cumple)))) return vistaEdad(ERRORES.cumple);
      if (b.mayor === 'Sí') {
        if (!b.anio) return vistaEdad(ERRORES.anio);
        const hoy = new Date(ahora() - 4 * 36e5).toISOString().slice(5, 10), md = b.cumple || '12-31';
        if (anioHoy - Number(b.anio) - (hoy < md ? 1 : 0) < 18) return vistaEdad(ERRORES.anio_menor);
      }
      ev.currentTarget.disabled = true; ev.currentTarget.textContent = 'Guardando…';
      const r = await api('perfil_guardar', {
        sesion: E.sesion, correo: E.correo, nombre: b.nombre, usuario: b.usuario,
        mayor: b.mayor, venezuela: b.venezuela, whatsapp: b.mayor === 'Sí' ? b.whatsapp : '', ofertas: b.mayor === 'Sí' ? b.ofertas : 'No',
        ...(b.mayor === 'Sí' ? { anio: b.anio } : {}),
        ...(conDatos ? { cumple: b.cumple || '', estado: b.venezuela === 'Sí' ? b.estado || '' : '', pais: b.venezuela === 'No' ? b.pais || '' : '' } : {})
      });
      if (!r.ok) {
        if (r.error === 'sesion') return cerrarSesion(true);
        if (/^usuario|nombre/.test(r.error)) return vistaPerfil(textoError(r.error));
        return vistaEdad(textoError(r.error));
      }
      const nuevo = !(E.perfil && E.perfil.completo) || E.completando;
      E.perfil = r.perfil; guardar('perfil', E.perfil); E.borrador = {};
      if (E.completando) { E.completando = false; guardar('nombreLocal', null); }
      if (nuevo) return vistaListo();   // 7 nov 2026: paso 3, personaje y avisos
      aviso('Guardado ✓');
      ir('yo');
    });
  });
}

/* ---------- registro: paso 3, tu personaje y tus avisos (7 nov 2026) ----------
   Las dos cosas son opcionales: se pueden cambiar después en «Yo». */
/* 7 nov 2026 (noche): el personaje es OBLIGATORIO. Sin personaje armado por la persona no se entra a la app.
   «Listo» = lo guardó con el editor, o ya tenía uno en el servidor. Uno al azar sin guardar (E.pjTemporal) no cuenta.
   Los avisos siguen siendo opcionales. */
const pjListo = () => !!E.pj && !E.pjTemporal;
function vistaListo() {
  E.enListo = true;
  if (!E.pj) {   // busca el suyo en el servidor; mientras tanto (o si no tiene) usa uno de muestra que NO se guarda
    pjRevisar();
    if (!E.pj) { E.pj = PJ.nuevo(); E.pjTemporal = true; }
  }
  const listo = pjListo();
  pintar(`
    <header class="barra">
      <div style="flex:1"><h1>¡Ya casi!</h1><span class="sub">Arma tu personaje para&nbsp;entrar</span></div>
      ${caraBarra()}
    </header>
    <div class="cont listo">
      <section class="listo-pj${listo ? '' : ' pendiente'}">
        <span class="avatar pj grande">${E.pj ? PJ.svg(E.pj) : '<span class="spin" aria-hidden="true"></span>'}</span>
        <div><strong>${listo ? '✓ Tu personaje está listo' : 'Arma tu personaje'}</strong><span>${listo ? 'Puedes cambiarlo cuando quieras en&nbsp;Yo.' : 'Es tu cara en la app: así te ven tus amigos y el Ranking. Nunca usamos&nbsp;fotos.'}</span></div>
        <button type="button" class="btn ${listo ? 'blanco' : 'amarillo'} chico" id="pj-editar" ${E.pj ? '' : 'disabled'}>${listo ? '✏️ Cambiar mi personaje' : '✏️ ARMAR MI PERSONAJE'}</button>
      </section>
      ${avisosListo()}
      <span class="pasos" aria-label="Paso 3 de 3"><i></i><i></i><i class="on"></i></span>
      <button type="button" class="btn" id="ok" ${listo ? '' : 'disabled'}>EMPEZAR</button>
      ${listo ? '' : '<p class="nota" style="margin:0">Para empezar, primero arma y guarda tu&nbsp;personaje.</p>'}
    </div>`, root => {
    on('#pj-editar', 'click', () => ventanaPersonaje(vistaListo));
    activarAvisosEn(root, vistaListo);
    on('#ok', 'click', () => { if (!pjListo()) return; E.enListo = false; aviso('¡Listo! Bienvenid@ al #RetoMenteMilenial'); ir('hoy'); });
  }, 'listo');
  // la primera vez, el editor se abre solo
  if (!listo && E.pj && !E.pjEditorAbierto && !document.querySelector('.velo')) { E.pjEditorAbierto = true; setTimeout(() => ventanaPersonaje(vistaListo), 500); }
}
function avisosListo() {
  const est = estadoAvisos();
  const caja = c => `<section class="listo-av"><strong>🔔 Avisos</strong>${c}</section>`;
  if (est === 'activo') return caja('<span>✓ Activados. Te avisamos del reto nuevo, si tu racha está en riesgo y de tus amigos. Puedes elegir cuáles en&nbsp;«Yo».</span>');
  if (est === 'pedir') return caja('<span>Te avisamos cuando sale el reto, si tu racha está en riesgo y cuando un amigo te da un toque. Nada de&nbsp;spam.</span><button type="button" class="btn turquesa chico" id="av-on">ACTIVAR AVISOS</button>');
  if (est === 'instalar') return caja('<span>En iPhone los avisos funcionan con la app instalada: botón <b>Compartir</b> → <b>«Agregar a inicio»</b>. Luego actívalos en&nbsp;«Yo».</span>');
  if (est === 'bloqueado') return caja(`<span>${esc(ERRORES.avisos_bloqueados)}</span>`);
  return '';
}

/* ---------- pantallas con barra inferior ---------- */
function nav(activa) {
  const b = (id, ico, txt) => `<button type="button" data-ir="${id}" ${activa === id ? 'aria-current="page"' : ''}>${ico}<span>${txt}</span></button>`;
  const sol = E.novedades && E.novedades.solicitudes ? `<i class="punto" aria-label="${E.novedades.solicitudes} solicitudes"></i>` : '';
  return `<nav class="nav" aria-label="Principal">${b('hoy', ICO.hoy, 'Hoy')}${b('ranking', ICO.ranking, 'Ranking')}<button type="button" class="mas" data-ir="subir" aria-label="Subir mi dibujo">${ICO.mas}</button>${b('amigos', ICO.amigos + sol, 'Amigos')}${b('yo', ICO.yo, 'Yo')}</nav>`;
}
function conNav(activa, cuerpo, alPintar) {
  pintar(cuerpo + nav(activa), root => {
    root.querySelectorAll('[data-ir]').forEach(x => x.addEventListener('click', () => ir(x.dataset.ir)));
    if (alPintar) alPintar(root);
  }, activa);
}
/* ---------- personaje (avatar armable, 6 nov 2026) ----------
   Se guarda en el teléfono («rcf.personaje») y en «Reto de la semana · web» (pestaña «personajes»).
   Los de los demás se piden por usuario y se guardan en E.pjs. Nunca fotos. */
const pjClub = () => !!(E.club && E.club.activo);
const pjTexto = x => [x.forma, x.ojos, x.pelo, x.acc, x.color].join('|');
const pjDeTexto = t => { const [forma, ojos, pelo, acc, color] = String(t || '').split('|'); return forma ? PJ.limpiar({ forma, ojos, pelo, acc, color }, true) : null; };
const pjUsuario = u => String(u || '').trim().toLowerCase().replace(/^@+/, '').replace(/\s+/g, '');
async function extra(accion, datos) {
  if (!CONFIG.extra) return { ok: false, error: 'red' };
  try {
    const res = await fetch(CONFIG.extra, { method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(Object.assign({ accion, sesion: E.sesion }, datos || {})) });
    return await res.json();
  } catch (e) { return { ok: false, error: 'red' }; }
}
function pjGuardar(x) {
  E.pj = x; guardar('personaje', x);
  if (E.perfil && E.perfil.usuario) E.pjs[pjUsuario(E.perfil.usuario)] = x;
  return extra('personaje_guardar', { p: x });
}
/* Pide los personajes que faltan (una vez por usuario) y vuelve a pintar la pantalla si llegan. */
async function pjPedir(usuarios, repintar) {
  const faltan = [...new Set(usuarios.map(pjUsuario).filter(u => u && !(u in E.pjs)))];
  if (!faltan.length || !E.sesion) return;
  faltan.forEach(u => { E.pjs[u] = null; });
  const r = await extra('personajes', { usuarios: faltan });
  if (!r.ok || !r.p) return;
  let hay = false;
  Object.keys(r.p).forEach(u => { const x = pjDeTexto(r.p[u]); if (x) { E.pjs[u] = x; hay = true; } });
  if (hay && repintar) repintar();
}
/* El mío: lo busca en el servidor la primera vez; si no tiene, le toca uno al azar. Si dejó el Club, lo pasa a opciones libres. */
let pjRevisando = false;
function pjRevisar() {
  if (!E.sesion || !E.perfil || !E.perfil.completo || pjRevisando) return;
  const yo = pjUsuario(E.perfil.usuario);
  if (!E.pj && !E.pjBuscado) {
    E.pjBuscado = true; pjRevisando = true;
    extra('personajes', { usuarios: [yo] }).then(r => {
      pjRevisando = false;
      const x = r.ok && r.p && pjDeTexto(r.p[yo]);
      if (x) { E.pj = x; E.pjTemporal = false; guardar('personaje', x); E.pjs[yo] = x; }
      else { E.pj = PJ.nuevo(); E.pjTemporal = true; }   // muestra para el editor: NO se guarda hasta que la persona lo arme
      if (E.enListo || E.pjTemporal) vistaListo(); else if (estaEn) mostrar(estaEn);
    });
    return;
  }
  /* 8 nov 2026: quien armó su personaje cuando el servidor todavía no lo guardaba lo tenía SOLO en su teléfono
     (Mentecita): nadie más lo veía. Una vez por sesión se revisa y, si falta en el servidor, se sube. */
  if (E.pj && !E.pjTemporal && !E.pjSync) {
    E.pjSync = true;
    extra('personajes', { usuarios: [yo] }).then(r => { if (r.ok && r.p && !r.p[yo] && E.pj) pjGuardar(E.pj); });
  }
  if (E.pj && E.club && !E.club.activo) {
    const libre = PJ.limpiar(E.pj, false);
    if (pjTexto(libre) !== pjTexto(E.pj)) pjGuardar(libre);
  }
}
const pjAvatar = (u, nombre) => { const x = E.pjs[pjUsuario(u)]; return x ? `<span class="avatar pj">${PJ.svg(x)}</span>` : `<span class="avatar">${esc((nombre || '?').charAt(0).toUpperCase())}</span>`; };
function ventanaPersonaje(alGuardar) {
  const club = pjClub();
  let sel = PJ.limpiar(E.pj || PJ.nuevo(), club);
  const pasos = [['forma', '1 · Forma'], ['ojos', '2 · Ojos'], ['pelo', '3 · Cabello'], ['acc', '4 · Accesorios <span style="color:var(--morado)">★ Club Estrella</span>']];
  ventana(`<h2 id="v-h" tabindex="-1">Tu personaje</h2>
    <div class="pj-prev"><span class="avatar pj grande" id="pj-prev"></span><span class="nota" style="margin:0;text-align:left">Así te ven tus amigos y el Ranking.${club ? '' : ' Lo marcado con ★ es del Club Estrella.'}</span></div>
    <div id="pj-ed"></div>
    <div class="pj-btns"><button type="button" class="btn blanco chico" id="pj-azar">🎲 Sorpréndeme</button><button type="button" class="btn amarillo chico" id="pj-ok">Guardar</button></div>`, (velo, cerrarV) => {
    velo.querySelector('.ventana').classList.add('larga');
    const pintarEd = () => {
      velo.querySelector('#pj-prev').innerHTML = PJ.svg(sel);
      velo.querySelector('#pj-ed').innerHTML = pasos.map(([k, t]) => `<span class="pj-lbl">${t}</span><div class="pj-grid">${PJ.OPCIONES[k].map(v => {
        const delClub = PJ.esDelClub(k, v), bloq = delClub && !club;
        return `<button type="button" class="pj-op${delClub ? ' club' : ''}${bloq ? ' bloq' : ''}" data-k="${k}" data-v="${v}" aria-pressed="${sel[k] === v}" aria-label="${v}${bloq ? ' (Club Estrella)' : ''}">${PJ.muestra(k, v, sel.color)}</button>`; }).join('')}</div>`).join('')
        + `<span class="pj-lbl">5 · Color</span><div class="pj-grid colores">${PJ.OPCIONES.color.map(c => `<button type="button" class="pj-col" data-k="color" data-v="${c}" aria-pressed="${sel.color === c}" aria-label="Color" style="background:${c}"></button>`).join('')}</div>`;
    };
    pintarEd();
    velo.addEventListener('click', e => {
      const b = e.target.closest('[data-k]');
      if (b) {
        if (!club && PJ.esDelClub(b.dataset.k, b.dataset.v)) { aviso('🔒 Solo para el Club Estrella ★'); return; }
        sel[b.dataset.k] = b.dataset.v; pintarEd(); return;
      }
      if (e.target.closest('#pj-azar')) { sel = PJ.nuevo(); pintarEd(); }
      if (e.target.closest('#pj-ok')) {
        pjGuardar(sel).then(r => { if (!r.ok) aviso('Se guardó en tu teléfono; tus amigos lo verán cuando haya conexión.'); });
        E.pjTemporal = false;
        cerrarV(); aviso('Guardado ✓'); if (alGuardar) alGuardar(); else mostrar(estaEn || 'yo');
      }
    });
  });
}

function cabecera(titulo) {
  pjRevisar();
  const ini = esc((nombreCorto() || '?').charAt(0).toUpperCase());
  const pr = E.progreso, racha = pr ? pr.racha : 0, ch = rachaChispas();
  /* 7 nov 2026: dos contadores distintos para que no se confundan:
     ✦ chispas = días seguidos haciendo la Chispa del día · 🔥 racha = semanas seguidas subiendo el dibujo del reto. */
  const chispas = `<button type="button" class="contador chispas" data-explica="chispas" aria-label="Chispas: ${ch} ${ch === 1 ? 'día seguido' : 'días seguidos'} haciendo la Chispa del día">${ICO.chispaMini}<b>${ch}</b></button>`;
  const fuego = `<button type="button" class="contador racha ${pr && pr.enRiesgo ? 'riesgo' : ''}" data-explica="racha" aria-label="Racha del reto: ${racha} ${racha === 1 ? 'semana seguida' : 'semanas seguidas'} subiendo tu dibujo">${ICO.fuego}<b>${racha}</b></button>`;
  return `<header class="top"><button type="button" class="avatar${E.pj ? ' pj' : ''}" data-ir="yo" aria-label="Mi perfil">${E.pj ? PJ.svg(E.pj) : ini}</button><h1>${esc(titulo)}</h1><span class="top-der">${chispas}${fuego}<a class="redondo" href="${CONFIG.web}/preguntas-frecuentes.html" target="_blank" rel="noopener" aria-label="Preguntas frecuentes">?</a></span></header>`;
}

let reloj, desfase = 0;   // diferencia entre la hora del servidor y la del teléfono
const ahora = () => Date.now() + desfase;
function cuenta(iso) {
  const ms = new Date(iso) - ahora();
  if (ms <= 0) return '0 min';
  const d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4);
  return (d ? d + ' d · ' : '') + String(h).padStart(2, '0') + ' h · ' + String(m).padStart(2, '0') + ' min';
}
function cuantoFalta(iso) {
  const ms = new Date(iso) - ahora(), d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5);
  return d >= 2 ? d + ' días' : h >= 2 ? h + ' horas' : 'menos de 2 horas';
}

async function vistaHoy() {
  clearInterval(reloj);
  dibujarHoy(E.hoy);
  const r = await api('hoy', { sesion: E.sesion });
  if (!r.ok) { if (!E.hoy) dibujarHoy(null, textoError(r.error)); return; }
  E.hoy = r; guardar('hoy', r);   // la próxima vez se muestra al instante
  cargarPatrocinio();
  /* 8 nov 2026: en MODO PRUEBA el servidor fingía la hora (siempre «miércoles 4 nov 9 p. m.») y la cuenta regresiva
     marcaba 4 días aunque faltara 1. La cuenta y la Chispa usan la hora REAL: «real» si el servidor la manda; si no,
     en modo prueba la del teléfono. */
  desfase = r.real ? new Date(r.real) - Date.now() : r.prueba ? 0 : new Date(r.ahora) - Date.now(); ajustarHora(desfase);
  if (estaEn === 'hoy') dibujarHoy(r);
  const m = await api('mi_semana', { sesion: E.sesion });
  if (m.ok) {
    if (r.actual) { E.semana = { id: semanaId(r.actual), subido: !!m.subido, padlet: m.padlet || '' }; guardar('semana', E.semana); }
    if (m.progreso) { E.progreso = m.progreso; guardar('progreso', E.progreso); }
    E.novedades = m.novedades || null;
    if (m.club) { E.club = m.club; guardar('club', E.club); }
    if (estaEn === 'hoy') {
      dibujarHoy(E.hoy);
      if (toqueNuevo()) api('toques_vistos', { sesion: E.sesion });   // se muestra una vez; luego desaparece
      setTimeout(ventanaMolesto, 900);
    }
  } else if (m.error === 'sesion') cerrarSesion(true);
  if (r.votacion && r.votacion.estado === 'abierta') {   // para las miniaturas y saber si ya votó
    const v = await api('votacion', { sesion: E.sesion });
    if (v.ok) { E.votacion = v; if (estaEn === 'hoy') dibujarHoy(E.hoy); }
  }
}
/* Tradi o Digi molestos (7 nov 2026): si tu racha está en riesgo y todavía no subes tu dibujo, tu guía te lo reclama.
   Sale una vez al día por teléfono y solo si tienes racha que perder (1 semana o más) y el reto sigue abierto.
   Si Stefany sube img/tradi-molesto.webp y img/digi-molesto.webp, se usan esas; mientras tanto, la ilustración normal con 💢. */
function ventanaMolesto() {
  const pr = E.progreso, a = E.hoy && E.hoy.actual;
  if (estaEn !== 'hoy' || !pr || !pr.enRiesgo || !(pr.racha > 0) || !a || yaSubio() || bloqueado() || document.querySelector('.velo')) return;
  const dia = new Date(ahora() - 4 * 36e5).toISOString().slice(0, 10);
  if (leer('molesto') === dia) return;
  guardar('molesto', dia);
  const g = E.guia === 'tradi' ? 'tradi' : 'digi', G = g === 'tradi' ? 'Tradi' : 'Digi', nom = esc(nombreCorto());
  ventana(`<div class="molesto">
      <div class="molesto-img"><img src="img/${g}-molesto.webp" data-normal="${imgGuia(g)}" alt="${G} molesto" width="150" height="145"><span class="molesto-ira" aria-hidden="true">💢</span></div>
      <h2 id="v-h" tabindex="-1">${sinViuda('¡Oye' + (nom ? ', ' + nom : '') + '! ¿Me vas a dejar así? 😤')}</h2>
      <p>Tu racha de <b>${pr.racha} ${pr.racha === 1 ? 'semana' : 'semanas'}</b> se apaga si no subes tu dibujo. El reto cierra en <b>${cuantoFalta(a.cierre)}</b>.</p>
      <button type="button" class="btn amarillo" id="mol-subir">SUBIR MI DIBUJO</button>
    </div>`, (velo, cerrar) => {
    const im = velo.querySelector('.molesto-img img');
    im.addEventListener('error', () => { if (im.dataset.normal) { im.src = im.dataset.normal; im.dataset.normal = ''; } }, { once: false });
    velo.querySelector('#mol-subir').addEventListener('click', () => { cerrar(); ir('subir'); });
    velo.querySelector('[data-cerrar]').textContent = 'Ahorita no';
  });
}
const STICKERS = [['img/sticker-1.webp', '¡Tú puedes!'], ['img/sticker-2.webp', '¡Qué dibujo!'], ['img/sticker-3.webp', '¡Hola, soy yo!']];
/* 7 nov 2026: el 3.er toque es el PERSONAJE de quien lo manda (reemplaza a «¡No la pierdas!»).
   Si esa persona todavía no armó su personaje, sale la imagen de siempre. */
const TOQUE_PJ = 2;
function usuarioDelToque(tq) {
  if (tq.usuario) return pjUsuario(tq.usuario);
  const a = E.amigos && (E.amigos.amigos || []).find(x => x.nombre === tq.nombre);
  return a ? pjUsuario(a.usuario) : '';
}
function imgToque(tq, tam) {
  const st = STICKERS[tq.sticker] || STICKERS[0];
  if (tq.sticker === TOQUE_PJ) {
    const u = usuarioDelToque(tq), pj = u && E.pjs[u];
    if (pj) return `<span class="toque-pj" style="width:${tam}px;height:${tam}px" role="img" aria-label="Personaje de ${esc(tq.nombre)}">${PJ.svg(pj)}</span>`;
    if (u) pjPedir([u], () => { if (estaEn === 'hoy') dibujarHoy(E.hoy); });
    /* 8 nov 2026: en Hoy la lista de amigos todavía no estaba cargada, así que no se sabía quién mandó el toque
       y salía la imagen vieja «¡No la pierdas!». Ahora se pide la lista y se vuelve a pintar. */
    else if (!E.amigos && !E.amigosPidiendo && E.sesion) {
      E.amigosPidiendo = true;
      api('amigos', { sesion: E.sesion }).then(r => { E.amigosPidiendo = false; if (r.ok) { E.amigos = r; if (estaEn === 'hoy') dibujarHoy(E.hoy); } });
    }
    // Mientras llega (o si esa persona no armó su personaje): su inicial en el círculo, nunca la imagen vieja.
    return `<span class="toque-pj toque-ini" style="width:${tam}px;height:${tam}px;font-size:${Math.round(tam * .45)}px" role="img" aria-label="Toque de ${esc(tq.nombre)}">${esc(String(tq.nombre || '?').charAt(0).toUpperCase())}</span>`;
  }
  return `<img src="${st[0]}" alt="Sticker de ${esc(tq.nombre)}" width="${tam}" height="${tam}">`;
}
const toqueNuevo = () => E.novedades && E.novedades.toques && E.novedades.toques.length ? E.novedades.toques[E.novedades.toques.length - 1] : null;
function burbujaHoy(nom, a) {
  const pr = E.progreso, hola = '¡Hola' + (nom ? ', ' + nom : '') + '! ', tq = toqueNuevo();
  if (tq) return hola + `👋 <b>${esc(tq.nombre)}</b> te dio un toque: «${esc((STICKERS[tq.sticker] || STICKERS[0])[1])}».${a ? ' El reto cierra en <b>' + cuantoFalta(a.cierre) + '</b>.' : ''}`;
  if (yaSubio()) return hola + (pr && pr.racha > 1 ? `🔥 Tu racha va en <b>${pr.racha} semanas</b>. ¡Sigue así!` : '🎉 Ya subiste tu dibujo de esta semana.');
  if (pr && pr.enRiesgo) return hola + `😱 Tu racha de <b>${pr.racha} ${pr.racha === 1 ? 'semana' : 'semanas'}</b> está en riesgo. El reto cierra en <b>${cuantoFalta(a.cierre)}</b>.`;
  return hola + `👋 El reto cierra en <b>${cuantoFalta(a.cierre)}</b>.`;
}
const semanaId = a => a.temporada + '|' + a.semana;
/* Tarjeta de la Chispa del día debajo del reto (7 nov 2026): rejilla fija ícono · texto · botón, con los círculos debajo del texto.
   En pantallas angostas el botón baja a su propia fila: nunca se monta sobre los círculos. */
function tarjetaChispa() {
  const hecha = chispaHechaHoy(), adv = adviento();
  const titulo = adv ? '🎄 Adviento de Chispas · día ' + adv.dia : fiestaDe() ? fiestaDe().aviso : 'Chispa del día';
  return `<section class="chispa-card${hecha ? ' hecha' : ''}" aria-label="Chispa del día">
    <span class="cc-ico">${ICO.chispa}</span>
    <div class="cc-txt"><h3>${esc(sinViuda(titulo))}</h3><p>${hecha ? '¡Hecho! Vuelve mañana por&nbsp;otra.' : '¿Qué te tocará&nbsp;hoy?'}</p></div>
    ${adv ? '' : `<div class="cc-dias">${circulosChispa()}</div>`}
    <button type="button" class="btn ${hecha ? 'blanco' : 'turquesa'} chico cc-btn" data-ir="chispa">${hecha ? 'REPETIR' : '¡Hacerla!<small>3 min</small>'}</button>
  </section>`;
}
/* Contador de chispas de la semana con círculos, igual que el progreso de «Yo» (6 nov 2026):
   naranja = hecha, borde punteado = hoy sin hacer, lila = sin hacer. No afecta la racha. */
function circulosChispa() {
  const d = diasChispaSemana(), n = d.filter(x => x.hecha).length;
  return `<div class="hist ch-hist" role="img" aria-label="Chispas de esta semana: ${n} de 7. No afecta tu racha.">${d.map(x =>
    `<span class="dia ${x.hecha ? 'si' : x.hoy ? 'abierta' : ''}" aria-hidden="true"><i></i>${x.letra}</span>`).join('')}</div>`;
}
/* Calendario del Adviento de Chispas: un cuadrito por día; ✓ hecho, borde grueso hoy. */
function calendarioAdviento(adv) {
  const hechos = {}; adv.hechas.forEach(d => { hechos[d] = true; });
  const base = Date.parse(adv.desde);
  const dias = Array.from({ length: adv.total }, (_, i) => {
    const iso = new Date(base + i * 864e5).toISOString().slice(0, 10), n = i + 1;
    const estado = hechos[iso] ? 'hecho' : n === adv.dia ? 'hoy' : n < adv.dia ? 'paso' : '';
    return `<li class="${estado}" aria-label="Día ${n}${hechos[iso] ? ', hecho' : n === adv.dia ? ', hoy' : ''}">${hechos[iso] ? '✓' : n}</li>`;
  }).join('');
  const faltan = Math.max(0, adv.meta - adv.hechas.length);
  return `<ol class="adv-cal" aria-label="Adviento de Chispas">${dias}</ol>
    <small class="sem-ch">${adv.marco ? '🎄 ¡Ganaste la insignia del Adviento! Tus chispas ahora salen con marco verde navideño.' : 'Llevas ' + adv.hechas.length + ' de ' + adv.total + ' · con ' + adv.meta + ' ganas la insignia del Adviento y el marco verde' + (faltan ? ' (te faltan ' + faltan + ')' : '')}</small>`;
}
/* Menores de 18 sin autorización confirmada (LOPNNA): ven el reto y la Chispa, pero no publican ni tienen amigos. */
const bloqueado = () => !!(E.perfil && E.perfil.bloqueado);
const MSJ_AUTORIZACION = () => encodeURIComponent('Hola. Quiero participar en el #RetoMenteMilenial, un reto semanal de dibujo, y como soy menor de edad necesito tu autorización. Es este formulario: ' + CONFIG.autorizacion + '\n\nAl enviarlo te llega un correo de retocreativofest@gmail.com con el botón «Confirmar la autorización». Si no lo ves, revisa spam y Promociones.');
const cajaAutorizacion = () => `<div class="caja crema"><strong class="t">🔒 Falta la autorización de tu representante</strong>
  <div data-aut-estado></div>
  <span style="display:block;font-weight:600;margin-bottom:8px">Mientras tanto puedes ver el reto y hacer la Chispa del día. Cuando tu representante llene el formulario y confirme el correo que le llega, se desbloquea solo: podrás subir tus dibujos y agregar amigos.</span>
  <a class="btn turquesa chico" href="https://wa.me/?text=${MSJ_AUTORIZACION()}" target="_blank" rel="noopener">📲 MANDARLE EL FORMULARIO POR WHATSAPP</a></div>`;
const yaSubio = () => !!(E.hoy && E.hoy.actual && E.semana && E.semana.id === semanaId(E.hoy.actual) && E.semana.subido);

function dibujarHoy(h, error) {
  const nom = esc(nombreCorto());
  const votando = !!(h && h.votacion && (h.votacion.estado === 'abierta' || h.votacion.estado === 'pronto'));
  let cuerpo;
  if (!h) {
    cuerpo = error
      ? `<div class="error" role="alert">${esc(error)}</div><button type="button" class="btn blanco" id="re">Intentar otra vez</button>`
      : '<div class="cargando" role="status"><span class="spin" aria-hidden="true"></span>Buscando el reto de la semana…</div>';
  } else if (votando && !h.clubAnticipado) {
    // Lunes 9:00 p. m. a martes 9:00 p. m.: la votación ocupa el lugar del reto (que ya cerró).
    cuerpo = `
      ${h.prueba ? '<div class="prueba">MODO PRUEBA · las fechas son de ejemplo</div>' : ''}
      <div class="saludo"><img src="${imgGuia(E.guia)}" alt="" width="112" height="108"><div class="burbuja">${burbujaVoto(nom, h.votacion)}</div></div>
      ${tarjetaVoto(h.votacion)}`;
  } else if (h.actual) {
    const a = h.actual, total = h.total || 1, pct = Math.max(4, Math.round((a.semana + 1) / total * 100));
    const premio = a.temporada === 'Fase II' ? 'diciembre' : 'julio';
    cuerpo = `
      ${h.prueba ? '<div class="prueba">MODO PRUEBA · las fechas son de ejemplo</div>' : ''}
      <div class="progreso"><div class="t"><span>${esc(a.temporada)} · semana ${a.semana} de ${total - 1}</span><span>Premiación: ${premio}</span></div><div class="b"><i style="width:${pct}%"></i></div></div>
      <div class="saludo">${toqueNuevo() ? imgToque(toqueNuevo(), 112) : `<img src="${imgGuia(E.guia)}" alt="${E.guia === 'tradi' ? 'Tradi' : 'Digi'} dibujando" width="112" height="108">`}<div class="burbuja">${burbujaHoy(nom, a)}</div></div>
      ${tarjetaVoto(h.votacion)}
      <section class="reto${marcaReto(a) && marcaReto(a).logo ? ' con-logo' : ''}" aria-labelledby="reto-h">
        <span class="pill">Reto de la semana ${a.semana}</span>${h.clubAnticipado ? '<span class="pill-club">★ Club: lo ves 24 h antes que todos</span>' : ''}
        ${marcaReto(a) && marcaReto(a).logo ? `<img class="reto-logo" src="${esc(marcaReto(a).logo)}" alt="${esc(marcaReto(a).nombre || 'Marca aliada')}" width="64" height="64">` : ''}
        <h2 id="reto-h">${esc(a.tema || 'Reto de la semana')}</h2>
        ${a.descripcion ? `<p>${esc(a.descripcion)}</p>` : ''}
        ${marcaReto(a) && marcaReto(a).nombre ? `<p class="reto-premio">🎁 Premio de <b>${esc(marcaReto(a).nombre)}</b>${marcaReto(a).premio ? ': ' + esc(marcaReto(a).premio) : ''} al dibujo que elija la marca</p>` : ''}
        <div class="tiempo"><span id="cd">${cuenta(a.cierre)}</span><span>Cierra el ${fecha(a.cierre)}, ${hora(a.cierre)}</span></div>
        ${yaSubio()
          ? `<div class="caja" style="text-align:center;background:var(--white)">✓ Ya subiste tu dibujo de esta semana</div>${botonesCompartir(E.semana.padlet || CONFIG.padlet)}`
          : bloqueado() ? cajaAutorizacion() : '<button type="button" class="btn amarillo" id="subir">SUBIR MI DIBUJO</button>'}
        ${!yaSubio() && E.progreso && E.progreso.enRiesgo ? (E.club && E.club.cumple && E.club.cumple.disponible
          ? `<button type="button" class="btn blanco chico" id="proteger">🎂 Usar tu protector de cumpleaños (vence el ${fechaCorta(E.club.cumple.hasta)})</button>`
          : E.club && E.club.activo
          ? (E.club.protectores > 0 ? `<button type="button" class="btn blanco chico" id="proteger">🛡️ Usar un protector de racha (te quedan ${E.club.protectores})</button>` : '<p class="nota">Ya usaste tus 2 protectores de este mes.</p>')
          : PLAY ? '' : '<button type="button" class="enlace" data-ir="club" style="font-size:13px">🛡️ Con el Club Estrella tienes 2 protectores al mes para que tu racha no se&nbsp;apague</button>') : ''}
      </section>
      ${franjaAliados()}`;
  } else {
    // Sin reto abierto (por ejemplo, del 1 al 22 de diciembre): la Chispa del día es lo principal y el reto dice «Próximamente».
    const p = h.proximo, hecha = chispaHechaHoy(), adv = adviento();
    cuerpo = `
      <div class="saludo"><img src="${imgGuia(E.guia)}" alt="" width="112" height="108"><div class="burbuja">¡Hola${nom ? ', ' + nom : ''}! ✨ ${hecha ? '¡Ya hiciste la chispa de hoy! Mañana sale otra.' : (adv ? 'Mientras llega el reto, calienta la mano con el <b>Adviento de Chispas</b> 🎄' : 'Mientras llega el reto, calienta la mano con la <b>Chispa del día</b>.')}</div></div>
      ${tarjetaVoto(h.votacion)}
      <section class="reto chispa-hero${adv ? ' adviento' : ''}" aria-labelledby="chispa-h">
        <span class="pill">${adv ? '🎄 Adviento de Chispas' : '✨ Chispa del día'}</span>
        <h2 id="chispa-h">${hecha ? '¡Hecho!' : adv ? 'Día ' + adv.dia + ' de ' + adv.total : fiestaDe() ? esc(fiestaDe().aviso) : 'Un mini reto de 3 minutos'}</h2>
        <p>${hecha ? 'Vuelve mañana por otra. Si quieres, puedes repetir la de&nbsp;hoy.' : adv ? 'Cada día hasta el ' + adv.total + ' de diciembre, un mini dibujo navideño de 3 minutos. Toca el botón y descubre el de hoy.' : 'Toca el botón y descubre qué te toca dibujar hoy. No suma puntos ni racha: es para practicar y divertirte.'}</p>
        ${adv ? calendarioAdviento(adv) : circulosChispa()}
        <button type="button" class="btn ${hecha ? 'blanco' : 'turquesa'}" data-ir="chispa">${hecha ? 'REPETIR' : '¡HACER LA CHISPA DE HOY!'}</button>
      </section>
      <section class="reto espera" aria-labelledby="reto-h">
        <span class="pill">Reto de la semana${p ? ' · ' + esc(p.temporada) : ''}</span>
        <h2 id="reto-h">Próximamente</h2>
        ${p ? `<p>Disponible a partir del <b>${fecha(p.publica)}</b> a las <b>${hora(p.publica)}</b></p>
        <div class="tiempo"><span id="cd">${cuenta(p.publica)}</span><span>para el próximo reto</span></div>
        ${p.club ? `<p class="nota izq">★ El Club Estrella lo recibe el ${fecha(p.club)} a las ${hora(p.club)}</p>` : ''}` : '<p>Pronto anunciamos la fecha de la próxima temporada.</p>'}
        <a class="enlace" href="${CONFIG.padlet}" target="_blank" rel="noopener" style="align-self:flex-start;font-size:13px">Mientras tanto, mira los dibujos de la comunidad en el Padlet ↗</a>
      </section>`;
  }
  const chispaAbajo = !h || !!(h.actual || votando);
  /* 8 nov 2026: recordatorio en Hoy de las solicitudes de amistad sin responder (además del aviso al teléfono). */
  const nSol = E.novedades && E.novedades.solicitudes;
  const solHtml = nSol ? `<div class="caja crema sol-rec"><span>👋 Tienes <b>${nSol} ${nSol === 1 ? 'solicitud' : 'solicitudes'} de amistad</b> sin responder.</span><button type="button" class="btn blanco chico mini" data-ir="amigos">VER</button></div>` : '';
  conNav('hoy', cabecera('Hoy') + `<main class="cont con-nav">${solHtml}${cuerpo}
      ${chispaAbajo ? tarjetaChispa() : ''}
    </main>`, root => {
    on('#re', 'click', vistaHoy);
    on('#subir', 'click', () => ir('subir'));
    on('#proteger', 'click', async ev => {
      ev.currentTarget.disabled = true;
      const r = await api('protector', { sesion: E.sesion });
      if (!r.ok) return aviso(textoError(r.error));
      E.club = r.club; E.progreso = r.progreso; guardar('club', E.club); guardar('progreso', E.progreso);
      aviso('🛡️ ¡Racha protegida esta semana!'); dibujarHoy(E.hoy);
    });
    activarCompartir(root);
    const cd = root.querySelector('#cd');
    if (cd && h) {
      const fin = h.actual ? h.actual.cierre : h.proximo && h.proximo.publica;
      reloj = setInterval(() => { if (new Date(fin) <= ahora()) { clearInterval(reloj); vistaHoy(); } else cd.textContent = cuenta(fin); }, 30000);
    }
  });
}

/* ---------- Votación (lunes 9:00 p. m. a martes 9:00 p. m.) ---------- */
const nombreFin = f => esc(String(f.titulo || '').split(' · ')[0] || f.usuario);
function burbujaVoto(nom, v) {
  const hola = '¡Hola' + (nom ? ', ' + nom : '') + '! ', d = E.votacion && E.votacion.semana === v.semana ? E.votacion : null;
  if (v.estado === 'pronto') return hola + `🗳️ El reto ya cerró. Las <b>5 finalistas</b> salen a las <b>${hora(v.abre)}</b>.`;
  if (d && d.miVoto) return hola + '💜 ¡Gracias por votar! El podio sale el <b>' + DIAS[new Date(v.cierra).getDay()] + ' a las ' + hora(v.cierra) + '</b>.';
  if (d && !d.puede) return hola + `🗳️ Ya salieron las <b>5 finalistas</b> de la semana ${v.semana}. Mira cómo va la votación.`;
  return hola + `🗳️ Ya salieron las <b>5 finalistas</b> de la semana ${v.semana}. ¡Elige tu favorita!`;
}
function minisVoto(v) {
  const d = E.votacion && E.votacion.semana === v.semana && E.votacion.finalistas;
  return d && d.length ? `<div class="minis">${d.map(f => `<img src="${esc(f.img)}" alt="" loading="lazy">`).join('')}</div>` : '';
}
function tarjetaVoto(v) {
  if (!v) return '';
  const pill = `<span class="pill">${v.prueba ? 'PRUEBA · ' : ''}Votación · semana ${v.semana}</span>`;
  if (v.estado === 'pronto') return `<section class="vota">${pill}<h2>Las finalistas salen a las ${hora(v.abre)}</h2><p>Las 5 con más «Me gusta» pasan a la final. Luego deciden los participantes.</p></section>`;
  if (v.estado === 'abierta') return `<section class="vota">${pill}<h2>¿Cuál merece el 1.er lugar?</h2>
    <p>Las 5 con más «Me gusta» pasaron a la final. Ahora deciden los participantes.</p>
    ${minisVoto(v)}
    <div class="tiempo"><span>Cierra en ${cuantoFalta(v.cierra)}</span></div>
    <button type="button" class="btn amarillo" data-ir="votar">${E.votacion && E.votacion.semana === v.semana && (E.votacion.miVoto || !E.votacion.puede) ? 'VER LA VOTACIÓN' : 'VOTAR AHORA'}</button></section>`;
  return `<section class="prox"><span class="ico">🏆</span><div style="flex:1;min-width:0"><h3>¡Ya salió el podio!</h3><span>Semana&nbsp;${v.semana}: mira quién ganó.</span></div><button type="button" class="btn turquesa chico mini" data-ir="votar">Ver</button></section>`;
}

async function vistaVotar() {
  dibujarVotar(E.votacion);
  const r = await api('votacion', { sesion: E.sesion });
  if (r.ok) { E.votacion = r; if (estaEn === 'votar') dibujarVotar(r); }
  else if (r.error === 'sesion') cerrarSesion(true);
  else if (estaEn === 'votar') dibujarVotar(E.votacion, textoError(r.error));
}

function dibujarVotar(v, error) {
  let cuerpo = error ? `<div class="error" role="alert">${esc(error)}</div>` : '';
  if (!v) cuerpo += error ? '' : '<div class="cargando" role="status"><span class="spin" aria-hidden="true"></span>Buscando la votación…</div>';
  else if (v.estado === 'nada') cuerpo += '<div class="caja agua"><strong class="t">No hay ninguna votación abierta</strong>La votación abre los lunes a las 9:00 p. m., cuando cierra el reto, y dura 24 horas.</div>';
  else if (v.estado === 'pronto') cuerpo += `<div class="caja agua"><strong class="t">Semana ${v.semana}</strong>Las finalistas salen el ${fecha(v.abre)} a las ${hora(v.abre)}.</div>`;
  else {
    const abierta = v.estado === 'abierta', fins = v.finalistas || [];
    const elegido = fins.find(f => f.id === v.miVoto);
    if (v.prueba) cuerpo += '<div class="prueba">VOTACIÓN DE PRUEBA</div>';
    if (abierta) {
      cuerpo += `<div class="caja agua"><strong class="t">Semana ${v.semana} · cierra el ${fecha(v.cierra)} a las ${hora(v.cierra)}</strong>Toca un dibujo para verlo grande. Tienes <b>un solo voto</b> y no se puede cambiar.${v.total ? ` Van <b>${v.total}</b> ${v.total === 1 ? 'voto' : 'votos'} en total.` : ''} Los votos de cada dibujo no se muestran: al cierre solo se publican los del podio.</div>`;
      if (elegido) cuerpo += `<div class="caja crema" style="text-align:center">✓ Votaste por <b>${nombreFin(elegido)}</b>. El podio sale el ${fecha(v.cierra)} a las ${hora(v.cierra)}</div>`;
      else if (!v.puede) cuerpo += '<div class="caja rosa"><strong class="t">Para votar, participa primero</strong>Votan quienes ya subieron al menos un dibujo esta temporada. Sube tu dibujo de esta semana y la próxima votación es tuya.</div>';
    } else {
      const medalla = n => n === 1 ? '🔴 1.º' : '🔵 ' + n + '.º';
      cuerpo += `<section class="cat-app podio"><h2>🏆 Podio de la semana ${v.semana}</h2><p>${v.votantes ? 'Votaron ' + v.votantes + (v.votantes === 1 ? ' persona.' : ' personas.') : 'Nadie votó: decidieron los «Me gusta».'}</p><ol>
        ${(v.podio || []).map(p => `<li class="${p.puesto === 1 ? 'gana' : ''}"><span><b>${medalla(p.puesto)} · ${esc(String(p.titulo).split(' · ')[0])}</b><small>${esc(p.titulo)} · ${p.votos} ${p.votos === 1 ? 'voto' : 'votos'}</small></span><em>${p.puesto === 1 ? '+3 puntos' : '+1 punto'}</em></li>`).join('')}</ol></section>
        ${v.relampago ? `<section class="cat-app"><h2>⚡ Relámpago creativo</h2><ol><li class="gana"><span><b>${esc(v.relampago.titulo)}</b><small>Primera en publicar esta semana</small></span></li></ol></section>` : ''}
        <div class="caja agua">Los puntos ya cuentan para el ranking. El anuncio completo es en el stream del miércoles.</div>`;
    }
    cuerpo += fins.map((f, i) => {
      const puedeVotar = abierta && v.puede && !v.miVoto && !f.mio;
      const etiqueta = f.mio ? '<span class="votar ok">Tu dibujo</span>' : f.id === v.miVoto ? '<span class="votar ok">✓ Tu voto</span>' : puedeVotar ? `<button type="button" class="votar" data-votar="${esc(f.id)}">VOTAR</button>` : '';
      return `<div class="fin ${f.id === v.miVoto ? 'elegido' : ''}"><button type="button" class="art" data-ver="${i}" aria-label="Ver grande el dibujo de ${nombreFin(f)}"><img src="${esc(f.img)}" alt="" loading="lazy"><b>Finalista ${i + 1}</b><span class="mg">❤️ ${f.meGusta}</span></button>
        <div class="pie"><div><strong>${nombreFin(f)}</strong><small>@${esc(f.usuario)}${f.tecnica ? ' · ' + esc(f.tecnica) : ''}</small></div>${etiqueta}</div></div>`;
    }).join('') || '<div class="caja crema">Todavía no hay finalistas. Si la votación ya abrió, intenta en unos minutos.</div>';
  }
  conNav('hoy', cabecera('Votación') + `<main class="cont con-nav">${cuerpo}</main>`, root => {
    if (!v || !v.finalistas) return;
    root.querySelectorAll('[data-ver]').forEach(b => b.addEventListener('click', () => {
      const f = v.finalistas[Number(b.dataset.ver)];
      ventana(`<h2 id="v-h" tabindex="-1" style="margin:0;font-family:var(--display)">${nombreFin(f)}</h2><img class="grande" src="${esc(f.img)}" alt="Dibujo de ${nombreFin(f)}">${f.mio ? '' : '<button type="button" class="enlace" id="reportar" style="font-size:13px">🚩 Reportar este dibujo</button>'}`,
        (velo, cerrar) => { const r = velo.querySelector('#reportar'); if (r) r.addEventListener('click', () => { cerrar(); ventanaReportar(f); }); });
    }));
    root.querySelectorAll('[data-votar]').forEach(b => b.addEventListener('click', () => {
      const f = v.finalistas.find(x => x.id === b.dataset.votar);
      ventana(`<h2 id="v-h" tabindex="-1" style="margin:0;font-family:var(--display)">¿Votar por ${nombreFin(f)}?</h2>
        <img class="grande chica" src="${esc(f.img)}" alt="">
        <p style="margin:0;font-size:14px">Tu voto es secreto: nadie del público ve por quién votaste. No se puede cambiar.</p>
        <button type="button" class="btn amarillo" id="si">SÍ, VOTAR</button>`, (velo, cerrar) => {
        velo.querySelector('#si').addEventListener('click', async ev => {
          ev.currentTarget.disabled = true; ev.currentTarget.textContent = 'Votando…';
          const r = await api('votar', { sesion: E.sesion, post: f.id });
          cerrar();
          if (!r.ok) { aviso(textoError(r.error)); return vistaVotar(); }
          aviso('🗳️ ¡Voto registrado! Gracias por votar.');
          E.votacion.miVoto = r.miVoto; vistaVotar();
        });
      });
    }));
  });
}

function ventana(html, alPintar, sinCerrar) {
  const velo = document.createElement('div');
  velo.className = 'velo';
  velo.innerHTML = `<div class="ventana" role="dialog" aria-modal="true" aria-labelledby="v-h">${html}${sinCerrar ? '' : '<button type="button" class="enlace" data-cerrar>Cerrar</button>'}</div>`;
  const cerrar = () => velo.remove();
  velo.addEventListener('click', e => { if (e.target === velo || e.target.hasAttribute('data-cerrar')) cerrar(); });
  document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { cerrar(); document.removeEventListener('keydown', k); } });
  document.body.appendChild(velo);
  velo.querySelector('h2').focus();
  if (alPintar) alPintar(velo, cerrar);
}

/* ---------- reportar un dibujo de la votación ----------
   Llega a la organización y lo revisan los Guardianes del arte. Nadie más sabe quién reportó. */
const MOTIVOS_REPORTE = [['Copia o plagio', 'Es copia de otro artista o de otra publicación'], ['Hecho con IA', 'Lo generó una inteligencia artificial'], ['Contenido inapropiado', 'Violento, sexual, ofensivo o que no es para todo público'], ['Otro', 'Otra razón: cuéntanos abajo']];
function ventanaReportar(f) {
  let motivo = '';
  ventana(`<h2 id="v-h" tabindex="-1" style="margin:0;font-family:var(--display)">Reportar el dibujo de ${nombreFin(f)}</h2>
    <p style="margin:0;font-size:14px">Los Guardianes del arte lo revisan. Nadie más sabe que fuiste tú.</p>
    <div class="motivos" role="radiogroup" aria-label="Motivo">${MOTIVOS_REPORTE.map(m => `<button type="button" class="opcion" role="radio" aria-checked="false" aria-pressed="false" data-m="${esc(m[0])}" style="text-align:left;display:flex;flex-direction:column;gap:2px;padding:10px 12px"><b>${esc(m[0])}</b><small style="font-weight:600">${esc(m[1])}</small></button>`).join('')}</div>
    <label class="campo" for="rep-det">Detalle <span class="ayuda">(opcional)</span><textarea id="rep-det" maxlength="300" rows="3" placeholder="Por ejemplo, el enlace del dibujo original" style="border:3px solid var(--ink);border-radius:12px;padding:10px 12px;font:600 15px var(--texto);width:100%"></textarea></label>
    <div class="error" role="alert" id="rep-err" hidden></div>
    <button type="button" class="btn" id="rep-ok">ENVIAR REPORTE</button>`, (velo, cerrar) => {
    velo.querySelectorAll('[data-m]').forEach(b => b.addEventListener('click', () => {
      motivo = b.dataset.m;
      velo.querySelectorAll('[data-m]').forEach(x => { const on = x === b; x.setAttribute('aria-pressed', on); x.setAttribute('aria-checked', on); });
    }));
    velo.querySelector('#rep-ok').addEventListener('click', async ev => {
      const err = velo.querySelector('#rep-err');
      if (!motivo) { err.textContent = ERRORES.reporte; err.hidden = false; return; }
      ev.currentTarget.disabled = true; ev.currentTarget.textContent = 'Enviando…';
      const r = await api('reportar', { sesion: E.sesion, post: f.id, motivo, detalle: velo.querySelector('#rep-det').value.trim() });
      if (!r.ok) { err.textContent = textoError(r.error); err.hidden = false; ev.currentTarget.disabled = false; ev.currentTarget.textContent = 'ENVIAR REPORTE'; return; }
      cerrar(); aviso('🚩 Gracias. Los Guardianes del arte lo van a revisar.');
    });
  });
}

/* ---------- compartir el dibujo ---------- */
const mensajeCompartir = url => '¡Dale me gusta a mi dibujo del #RetoMenteMilenial! 💜 ' + url;
async function copiarEnlace(url) {
  const texto = mensajeCompartir(url);
  try { await navigator.clipboard.writeText(texto); aviso('¡Enlace copiado! Pégalo en WhatsApp o en tus redes'); }
  catch (e) {
    ventana(`<h2 id="v-h" tabindex="-1">Copia tu enlace</h2><p>Mantén presionado el texto y elige «Copiar».</p><textarea readonly rows="3" style="width:100%;font:inherit;font-size:15px;border:3px solid var(--ink);border-radius:12px;padding:10px">${esc(texto)}</textarea>`,
      v => { const t = v.querySelector('textarea'); t.focus(); t.select(); });
  }
}
async function compartirEnlace(url) {
  if (!navigator.share) return copiarEnlace(url);
  try { await navigator.share({ text: mensajeCompartir(url) }); } catch (e) { if (e && e.name !== 'AbortError') copiarEnlace(url); }
}
/* 7 nov 2026: tres botones con ícono, estilo RCF. El grande es «Compartir en redes»; debajo, «Copiar enlace» y «Ver en el Padlet».
   Si el teléfono no tiene el menú de compartir, el botón grande copia el enlace. */
const botonesCompartir = url => `<div class="compartir">
  <button type="button" class="btn amarillo cp-grande" data-compartir="${esc(url)}">${ICO.compartir}<span>COMPARTIR EN REDES</span></button>
  <button type="button" class="btn blanco chico cp-chico" data-copiar="${esc(url)}">${ICO.copiar}<span>Copiar enlace</span></button>
  <a class="btn blanco chico cp-chico" href="${esc(url)}" target="_blank" rel="noopener">${ICO.externo}<span>Ver en el Padlet</span></a>
</div>`;
function activarCompartir(root) {
  root.querySelectorAll('[data-copiar]').forEach(b => b.addEventListener('click', () => copiarEnlace(b.dataset.copiar)));
  root.querySelectorAll('[data-compartir]').forEach(b => b.addEventListener('click', () => compartirEnlace(b.dataset.compartir)));
}

/* ---------- subir el dibujo ---------- */
/* 7 nov 2026: en algunas tablets (Samsung) img.decode() fallaba con fotos JPG o PNG normales y salía «No pudimos leer esa foto».
   Ahora prueba tres maneras de abrir la foto, una tras otra; si ninguna sirve y es un JPG liviano, lo manda tal cual. */
const cargarImg = src => new Promise((ok, mal) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => mal(new Error('img')); i.src = src; });
const leerDataUrl = f => new Promise((ok, mal) => { const fr = new FileReader(); fr.onload = () => ok(String(fr.result)); fr.onerror = () => mal(new Error('lector')); fr.readAsDataURL(f); });
async function abrirFoto(archivo) {
  if (window.createImageBitmap) {
    try { const b = await createImageBitmap(archivo, { imageOrientation: 'from-image' }); return { fuente: b, ancho: b.width, alto: b.height }; } catch (e) {}
    try { const b = await createImageBitmap(archivo); return { fuente: b, ancho: b.width, alto: b.height }; } catch (e) {}
  }
  const url = URL.createObjectURL(archivo);
  try { const i = await cargarImg(url); return { fuente: i, ancho: i.naturalWidth, alto: i.naturalHeight }; }
  catch (e) { const i = await cargarImg(await leerDataUrl(archivo)); return { fuente: i, ancho: i.naturalWidth, alto: i.naturalHeight }; }
  finally { setTimeout(() => URL.revokeObjectURL(url), 1000); }
}
async function comprimir(archivo) {
  if (!archivo) throw new Error('imagen');
  const nombre = String(archivo.name || '').toLowerCase();
  if (archivo.type && !/^image\//.test(archivo.type) && !/\.(jpe?g|png|webp)$/.test(nombre)) throw new Error('imagen');
  if (archivo.size > 40 * 1024 * 1024) throw new Error('imagen');
  let foto;
  try { foto = await abrirFoto(archivo); }
  catch (e) {
    const jpg = /jpe?g/.test(archivo.type) || /\.jpe?g$/.test(nombre);
    if (jpg && archivo.size <= 3.5 * 1024 * 1024) {   // último recurso: el JPG sin tocar
      const d = await leerDataUrl(archivo);
      return { base64: d.split(',')[1], vista: URL.createObjectURL(archivo), ancho: 0, alto: 0 };
    }
    throw e;
  }
  {
    const max = 1600, esc_ = Math.min(1, max / Math.max(foto.ancho, foto.alto));
    if (!foto.ancho || !foto.alto) throw new Error('imagen');
    const c = document.createElement('canvas');
    c.width = Math.round(foto.ancho * esc_); c.height = Math.round(foto.alto * esc_);
    const x = c.getContext('2d');
    x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, c.width, c.height);   // fondo blanco para PNG transparentes
    x.drawImage(foto.fuente, 0, 0, c.width, c.height);
    if (foto.fuente.close) foto.fuente.close();
    let calidad = 0.84, blob;
    do {
      blob = await new Promise(ok => c.toBlob(ok, 'image/jpeg', calidad));
      calidad -= 0.12;
    } while (blob && blob.size > 3.5 * 1024 * 1024 && calidad > 0.4);
    if (!blob) throw new Error('imagen');
    const datos = await new Promise((ok, mal) => { const fr = new FileReader(); fr.onload = () => ok(fr.result); fr.onerror = mal; fr.readAsDataURL(blob); });
    return { base64: String(datos).split(',')[1], vista: URL.createObjectURL(blob), ancho: c.width, alto: c.height };
  }
}

function vistaSubir(error) {
  const h = E.hoy, a = h && h.actual;
  if (!a) return ir('hoy');
  const S = E.subida, p = E.perfil || {};
  if (S.id !== semanaId(a)) { Object.keys(S).forEach(k => delete S[k]); S.id = semanaId(a); S.tecnica = E.guia === 'tradi' ? 'Tradicional' : ''; }
  const titulo = (p.nombre || '').split(' ')[0] + ' · @' + (p.usuario || '');
  cargarBanner(a);
  pintar(`
    <header class="barra">
      <button type="button" class="volver" id="v" aria-label="Volver">${ICO.volver}</button>
      <div style="flex:1;min-width:0"><h1>Subir mi dibujo</h1><span class="sub">Semana ${a.semana} · ${esc(a.tema)}</span></div>
      ${caraBarra()}
    </header>
    <form class="cont" id="f" novalidate>
      ${h.prueba ? '<div class="prueba">MODO PRUEBA · se publica de verdad en el Padlet</div>' : ''}
      <label class="foto ${S.vista ? 'lista' : ''}" for="archivo">
        ${S.vista ? `<img src="${S.vista}" alt="Vista previa de tu dibujo">` : `<span class="foto-ico" aria-hidden="true">📷</span><b>Toca para elegir la foto de tu dibujo</b><small>Desde tu galería o con la cámara</small>`}
        <input id="archivo" type="file" accept="image/*,.jpg,.jpeg,.png">
      </label>
      ${S.vista ? '<button type="button" class="enlace" id="cambiar" style="margin-top:-6px">Cambiar la foto</button>' : ''}
      <fieldset><legend>Tipo de técnica</legend>
        <div class="par"><button type="button" class="opcion" data-t="Tradicional" aria-pressed="${S.tecnica === 'Tradicional'}">Tradicional</button><button type="button" class="opcion" data-t="Digital" aria-pressed="${S.tecnica === 'Digital'}">Digital</button></div>
      </fieldset>
      <label class="campo" for="des">Descripción
        <textarea id="des" rows="3" maxlength="500" placeholder="Cuéntanos por qué lo dibujaste así. ¡Una buena descripción consigue más me gusta!">${esc(S.descripcion || '')}</textarea>
        <span class="ayuda" id="cnt">${(S.descripcion || '').length} / 500</span>
      </label>
      <label class="check" for="pro"><input id="pro" type="checkbox" ${S.propio ? 'checked' : ''}><span>Mi dibujo es 100 % mío: sin inteligencia artificial, sin calcar y sin fanart.</span></label>
      ${p.mayor === 'No' ? '<span class="nota izq">Puedes participar. Para quedar entre las finalistas, tu representante tiene que haber confirmado la autorización.</span>' : ''}
      <div class="muestra" aria-hidden="true"><i></i><span><b>${esc(titulo)}</b><small>Así saldrá el título en el Padlet</small></span></div>
      ${error ? `<div class="error" role="alert">${esc(error)}</div>` : ''}
      <button type="submit" class="btn amarillo" id="ok">PUBLICAR EN EL PADLET</button>
      <span class="nota">Cierra el ${fecha(a.cierre)}, ${hora(a.cierre)}. Una participación por semana.</span>
    </form>`, root => {
    const des = root.querySelector('#des'), pro = root.querySelector('#pro'), cnt = root.querySelector('#cnt');
    const leerCampos = () => { S.descripcion = des.value; S.propio = pro.checked; };
    des.addEventListener('input', () => { cnt.textContent = des.value.length + ' / 500'; });
    on('#v', 'click', () => { leerCampos(); ir('hoy'); });
    on('#cambiar', 'click', () => root.querySelector('#archivo').click());
    root.querySelectorAll('[data-t]').forEach(b => b.addEventListener('click', () => { leerCampos(); S.tecnica = b.dataset.t; vistaSubir(); }));
    on('#archivo', 'change', async ev => {
      leerCampos();
      const f = ev.target.files && ev.target.files[0];
      if (!f) return;
      const caja = root.querySelector('.foto'); caja.innerHTML = '<span class="spin" aria-hidden="true"></span><b>Preparando la foto…</b>';
      try { const c = await comprimir(f); S.base64 = c.base64; S.vista = c.vista; vistaSubir(); }
      catch (e) { S.base64 = S.vista = null; vistaSubir(ERRORES.imagen + (h.prueba ? ' (detalle para Claude: ' + (f.type || 'sin tipo') + ', ' + Math.round(f.size / 1024) + ' KB, ' + ((e && e.message) || e) + ')' : '')); }
    });
    on('#f', 'submit', async ev => {
      ev.preventDefault();
      leerCampos();
      const falta = !S.base64 ? 'foto' : !S.tecnica ? 'tecnica' : S.descripcion.trim().length < 3 ? 'descripcion' : !S.propio ? 'propio' : '';
      if (falta) return vistaSubir(ERRORES[falta]);
      const confirmado = await new Promise(listo => ventana(`
        <h2 id="v-h" tabindex="-1">¿Así está bien?</h2>
        <p style="font-size:14px">Revísalo bien: <b>después de publicar no se puede cambiar ni subir otro dibujo esta semana</b>.</p>
        <div class="tarjeta-prev"><img src="${S.vista}" alt="Tu dibujo"><div><b>${esc(titulo)}</b><p>${esc(S.descripcion.trim())}</p><span class="tag">${esc(S.tecnica)}</span></div></div>
        <button type="button" class="btn amarillo" id="si">SÍ, PUBLICAR</button>
        <button type="button" class="btn blanco chico" data-cerrar id="no">Corregir</button>`,
        (v, cerrar) => {
          v.querySelector('#si').addEventListener('click', () => { cerrar(); listo(true); });
          v.addEventListener('click', e => { if (e.target === v || e.target.hasAttribute('data-cerrar')) listo(false); });
        }, true));
      if (!confirmado) return;
      const ok = root.querySelector('#ok'); ok.disabled = true; ok.textContent = 'Publicando… no cierres la app';
      const ban = bannerListo(a), finBanner = ban ? mostrarBanner(ban) : mostrarCarga();
      const r = await api('subir', { sesion: E.sesion, imagen: S.base64, tecnica: S.tecnica, descripcion: S.descripcion.trim(), propio: true });
      const alClub = await finBanner(r.ok);
      if (alClub === true && r.ok) { E.semana = { id: semanaId(a), subido: true, padlet: r.padlet || '' }; guardar('semana', E.semana); if (S.vista) URL.revokeObjectURL(S.vista); Object.keys(S).forEach(k => delete S[k]); return ir('club'); }
      if (r.ok || r.error === 'ya_subiste') {
        E.semana = { id: semanaId(a), subido: true, padlet: r.padlet || '' }; guardar('semana', E.semana);
        if (S.vista) URL.revokeObjectURL(S.vista);
        Object.keys(S).forEach(k => delete S[k]);
        return r.ok ? vistaCelebracion(r) : (aviso(ERRORES.ya_subiste), ir('hoy'));
      }
      if (r.error === 'sesion') return cerrarSesion(true);
      vistaSubir(textoError(r.error));
    });
  });
}

function vistaCelebracion(r, repintado) {
  pintar(`
    <div class="cont celebra">
      <img class="celebra-img" src="${imgGuia(E.guia)}" alt="" width="170" height="164">
      <h1>¡Dibujo publicado! 🎉</h1>
      <p>Ya está en el Padlet, en la sección <b>Semana&nbsp;${r.semana}</b>, con este&nbsp;título:<br><b class="titulo-padlet">${esc(r.titulo)}</b></p>
      <div class="caja agua">Manda el enlace a tus amigos para que te den «Me gusta». Los 5 dibujos con más «Me gusta» pasan a la final, y los participantes votan aquí en la app del lunes 9:00 p. m. al martes 9:00&nbsp;p.&nbsp;m.</div>
      ${botonesCompartir(r.padlet || CONFIG.padlet)}
      ${avisosHtml(true)}
      <button type="button" class="enlace" id="hoy">Volver a Hoy</button>
    </div>`, root => { activarCompartir(root); activarAvisosEn(root, () => vistaCelebracion(r, true)); on('#hoy', 'click', () => ir('hoy')); });
  /* 7 nov 2026: después de subir también sale la ventana del Club Estrella (mismas reglas que en la Chispa:
     solo mayores, nunca miembros, nunca en la app de Google Play y máximo una vez al día). */
  if (!repintado) setTimeout(() => { if (document.querySelector('.celebra') && !document.querySelector('.velo')) mostrarPromoClub({ promoClub, irClub: () => ir('club'), titulo: '¡Qué dibujo! ¿Quieres llegar más&nbsp;lejos?' }); }, 1800);
}

async function vistaRanking() {
  dibujarRanking(E.ranking);
  const r = await api('ranking', { sesion: E.sesion });
  if (r.ok) { E.ranking = r; if (estaEn === 'ranking') dibujarRanking(r); }
  else if (r.error === 'sesion') cerrarSesion(true);
  else if (!E.ranking && estaEn === 'ranking') dibujarRanking(null, textoError(r.error));
}

/* 8 nov 2026: si la red viene sin «@» (ej. «Milkarts»), se usa tal cual como usuario. */
const rkUsuario = it => { const t = String(it.red || '').trim(), m = t.match(/@([\w.]+)/); return m ? m[1] : (/^[\w.]{3,30}$/.test(t) ? t : ''); };
/* 8 nov 2026: el círculo del ranking tiene su propia clase (antes usaba «mini», que es la de los botones y lo estiraba en óvalo).
   Todas las filas llevan círculo: el personaje si lo armó; si no, su inicial. Así nombre, usuario y puntaje quedan alineados. */
const rkPj = it => it.yo && E.pj ? E.pj : E.pjs[pjUsuario(rkUsuario(it))];
const rkAvatar = it => { const pj = rkPj(it); return pj ? `<span class="rk-av pj" aria-hidden="true">${PJ.svg(pj)}</span>` : `<span class="rk-av" aria-hidden="true">${esc(String(it.nombre || '?').trim().charAt(0).toUpperCase() || '?')}</span>`; };
const rkRed = it => { const u = rkUsuario(it); return u ? '@' + u : String(it.red || '').trim(); };
function dibujarRanking(r, error) {
  let cuerpo;
  if (!r) cuerpo = error ? `<div class="error" role="alert">${esc(error)}</div>` : '<div class="cargando" role="status"><span class="spin" aria-hidden="true"></span>Buscando los puntajes…</div>';
  else {
    const mios = r.mios && r.mios.length
      ? `<div class="caja crema"><strong class="t">¡Estás en la tabla! 🎉</strong>${r.mios.map(m => esc(m.estado) + ' en <b>' + esc(m.categoria) + '</b> (' + esc(m.valor) + ')').join('<br>')}</div>`
      : `<div class="caja agua">Todavía no apareces entre los primeros. Cada semana que subes tu dibujo suma para la constancia, y los me gusta suman para las demás categorías.</div>`;
    cuerpo = `${r.lead ? `<p class="nota izq" style="margin:0">${esc(r.lead)}</p>` : ''}${mios}
      ${r.cats.map(c => `<section class="cat-app"><h2>${esc(c.nombre)}</h2>${c.def ? `<p>${esc(c.def)}</p>` : ''}<ol>${c.items.map(it =>
        `<li class="rk-fila${it.yo ? ' yo' : ''}${it.estado === 'Va ganando' ? ' gana' : ''}">${rkAvatar(it)}<span class="rk-txt"><b class="rk-nom"><span>${esc(it.nombre)}</span>${it.estrella ? `<img class="estrella-mini" src="img/estrella-${it.estrella}.webp" alt="Club Estrella">` : ''}${it.yo ? '<i>(tú)</i>' : ''}</b>${rkRed(it) ? `<small>${esc(rkRed(it))}</small>` : ''}</span><em class="rk-pts">${esc(it.valor)}</em></li>`).join('')}</ol></section>`).join('')}
      ${r.legal ? `<p class="nota izq">${esc(r.legal)}</p>` : ''}
      <a class="btn blanco chico" href="${CONFIG.web}/reto-semanal.html" target="_blank" rel="noopener">Ver la tabla completa en la web</a>`;
  }
  conNav('ranking', cabecera('Ranking') + `<main class="cont con-nav">${cuerpo}</main>`);
  if (r && r.cats) pjPedir(r.cats.flatMap(c => c.items.map(rkUsuario)).filter(Boolean), () => { if (estaEn === 'ranking') dibujarRanking(E.ranking); });
}

/* ---------- Amigos ---------- */
async function vistaAmigos(mensaje) {
  dibujarAmigos(E.amigos, mensaje);
  const r = await api('amigos', { sesion: E.sesion });
  if (r.ok) {
    E.amigos = r;
    if (E.novedades) E.novedades.solicitudes = r.solicitudes.length;
    if (estaEn === 'amigos') dibujarAmigos(r, mensaje);
    const us = ['amigos', 'solicitudes', 'enviadas', 'bloqueados'].flatMap(k => Array.isArray(r[k]) ? r[k].map(x => x.usuario) : []);
    pjPedir(us, () => { if (estaEn === 'amigos') dibujarAmigos(E.amigos, mensaje); });
  } else if (r.error === 'sesion') cerrarSesion(true);
  else if (!E.amigos && estaEn === 'amigos') dibujarAmigos(null, null, textoError(r.error));
}

function dibujarAmigos(d, mensaje, error) {
  const inicial = n => esc((n || '?').charAt(0).toUpperCase());
  let cuerpo = bloqueado() ? cajaAutorizacion() : `
    <form class="agregar" id="fa" novalidate>
      <label class="campo" for="nu">Agrega a un amigo por su usuario
        <span class="fila-ag"><input id="nu" type="text" autocapitalize="none" autocomplete="off" spellcheck="false" placeholder="@usuario" maxlength="31" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="sug"><button type="submit" class="btn amarillo chico" style="width:auto;padding:8px 16px">AGREGAR</button></span>
      </label>
      <div class="sugeridas" id="sug" role="listbox" aria-label="Personas en la app" hidden></div>
      <span class="ayuda-sug">Escribe las primeras letras y elige a tu amigo de la lista: así no se escribe&nbsp;mal.</span>
    </form>
    ${E.perfil && E.perfil.mayor === 'Sí' ? '<button type="button" class="btn turquesa chico" id="invitar">🔗 INVITAR AMIGOS CON MI ENLACE</button>' : ''}`;
  cuerpo += `
    ${mensaje ? `<div class="caja agua" role="status">${esc(mensaje)}</div>` : ''}
    ${error ? `<div class="error" role="alert">${esc(error)}</div>` : ''}`;
  if (!d) cuerpo += '<div class="cargando" role="status"><span class="spin" aria-hidden="true"></span>Buscando a tus amigos…</div>';
  else {
    if (d.solicitudes.length) cuerpo += `<h2 class="sub-t">Te quieren agregar</h2>` + d.solicitudes.map(x => `
      <div class="amigo">${pjAvatar(x.usuario, x.nombre)}<div class="info"><b>${esc(x.nombre)}</b><small>@${esc(x.usuario)}</small></div>
        <button type="button" class="btn turquesa chico mini" data-aceptar="${esc(x.usuario)}">Aceptar</button><button type="button" class="enlace mini" data-rechazar="${esc(x.usuario)}">No</button>${botonMas(x, false)}</div>`).join('');
    cuerpo += `<h2 class="sub-t">Tus amigos${d.amigos.length ? ' (' + d.amigos.length + ')' : ''}</h2>`;
    cuerpo += d.amigos.length ? d.amigos.map(x => `
      <div class="amigo">${pjAvatar(x.usuario, x.nombre)}
        <div class="info"><b>${esc(x.nombre)}</b><small>@${esc(x.usuario)}</small>
          <span class="chips"><span class="chip fuego">${ICO.fuego} ${x.rachaJuntos} ${x.rachaJuntos === 1 ? 'semana' : 'semanas'} juntos</span>${d.semanaAbierta ? `<span class="chip ${x.subio ? 'ok' : ''}">${x.subio ? '✓ Ya subió' : '⏳ Aún no sube'}</span>` : ''}</span></div>
        <button type="button" class="btn ${x.toqueHoy ? 'blanco' : 'amarillo'} chico mini" data-toque="${esc(x.usuario)}" data-nombre="${esc(x.nombre)}" ${x.toqueHoy ? 'disabled' : ''}>${x.toqueHoy ? 'Toque ✓' : '👆 Toque'}</button>${botonMas(x, true)}</div>`).join('')
      : `<div class="caja">Todavía no tienes amigos en la app. Agrégalos con el usuario que usan en el reto (el de Instagram o TikTok). Cuando los dos suben su dibujo la misma semana, crece su racha juntos 🔥</div>`;
    if (d.enviadas.length) cuerpo += `<p class="nota izq">Esperando respuesta: ${d.enviadas.map(x => '@' + esc(x.usuario)).join(', ')}</p>`;
    if (d.bloqueados && d.bloqueados.length) cuerpo += `<h2 class="sub-t">Bloqueados (${d.bloqueados.length})</h2>
      <p class="nota izq">No pueden mandarte solicitudes ni toques. No les avisamos que los bloqueaste.</p>` + d.bloqueados.map(x => `
      <div class="amigo">${pjAvatar(x.usuario, x.nombre)}<div class="info"><b>${esc(x.nombre)}</b><small>@${esc(x.usuario)}</small></div>
        <button type="button" class="btn blanco chico mini" data-desbloquear="${esc(x.usuario)}">Desbloquear</button></div>`).join('');
    cuerpo += `<p class="nota">Los toques son stickers dentro de la app: sin chat. Uno por amigo al día.</p>`;
  }
  conNav('amigos', cabecera('Amigos') + `<main class="cont con-nav">${cuerpo}</main>`, root => {
    sugerencias(root, d);
    on('#invitar', 'click', compartirInvitacion);
    on('#fa', 'submit', async ev => {
      ev.preventDefault();
      const inp = root.querySelector('#nu'), u = inp.value.trim().replace(/^@+/, '').toLowerCase();
      if (!/^[a-z0-9._]{3,30}$/.test(u)) return dibujarAmigos(d, null, ERRORES.usuario_invalido);
      const b = root.querySelector('#fa button'); b.disabled = true;
      const r = await api('amigo_agregar', { sesion: E.sesion, usuario: u });
      if (!r.ok) return dibujarAmigos(d, null, textoError(r.error));
      vistaAmigos(r.aceptado ? '¡Ahora son amigos! 🎉' : 'Solicitud enviada a @' + u + '. Cuando la acepte, aparecerá aquí.');
    });
    root.querySelectorAll('[data-aceptar]').forEach(b => b.addEventListener('click', async () => { b.disabled = true; await api('amigo_responder', { sesion: E.sesion, usuario: b.dataset.aceptar, accionAmigo: 'aceptar' }); vistaAmigos('¡Ahora son amigos! 🎉'); }));
    root.querySelectorAll('[data-rechazar]').forEach(b => b.addEventListener('click', async () => { b.disabled = true; await api('amigo_responder', { sesion: E.sesion, usuario: b.dataset.rechazar, accionAmigo: 'rechazar' }); vistaAmigos(); }));
    root.querySelectorAll('[data-toque]').forEach(b => b.addEventListener('click', () => ventanaToque(b.dataset.toque, b.dataset.nombre)));
    root.querySelectorAll('[data-mas]').forEach(b => b.addEventListener('click', () => ventanaUsuario(b.dataset.mas, b.dataset.nombre, b.dataset.amigo === '1')));
    root.querySelectorAll('[data-desbloquear]').forEach(b => b.addEventListener('click', async () => {
      b.disabled = true;
      const r = await api('amigo_responder', { sesion: E.sesion, usuario: b.dataset.desbloquear, accionAmigo: 'desbloquear' });
      if (!r.ok) { b.disabled = false; return aviso(textoError(r.error)); }
      vistaAmigos('Desbloqueaste a @' + b.dataset.desbloquear + '. Si quieren ser amigos otra vez, uno tiene que mandar la solicitud.');
    }));
  });
}

/* ---------- enlace para invitar amigos (7 nov 2026) ----------
   Solo mayores de edad (decisión de Stefany: los menores agregan por usuario). El enlace NO los hace amigos:
   quien lo abre ve una ventana y decide si manda la solicitud; la otra persona igual tiene que aceptarla. */
const enlaceInvitacion = () => CONFIG.web + '/app/?amigo=' + encodeURIComponent(pjUsuario(E.perfil.usuario));
async function compartirInvitacion() {
  const url = enlaceInvitacion(), texto = '¡Dibujemos juntos en el #RetoMenteMilenial! 🎨 Agrégame en la app y cuidemos nuestra racha: ' + url;
  if (navigator.share) { try { await navigator.share({ text: texto }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
  try { await navigator.clipboard.writeText(texto); aviso('¡Enlace copiado! Pégalo en WhatsApp o en tus redes'); }
  catch (e) { ventana(`<h2 id="v-h" tabindex="-1">Tu enlace</h2><p>Mantén presionado el texto y elige «Copiar».</p><textarea readonly rows="3" style="width:100%;font:inherit;font-size:15px;border:3px solid var(--ink);border-radius:12px;padding:10px">${esc(texto)}</textarea>`); }
}
/* Alguien abrió un enlace de invitación: se guarda hasta que tenga la cuenta lista y luego se le pregunta. */
function ventanaInvitacion() {
  const u = pjUsuario(leer('invitacion'));
  if (!u || !E.perfil || !E.perfil.completo || estaEn !== 'hoy') return;
  if (document.querySelector('.velo')) return setTimeout(ventanaInvitacion, 2500);
  guardar('invitacion', null);
  if (u === pjUsuario(E.perfil.usuario)) return;
  if (bloqueado()) return aviso('@' + u + ' te invitó a ser su amigo. Cuando tu representante confirme la autorización, podrás agregarlo.');
  const avatar = () => E.pjs[u] ? `<span class="avatar pj grande">${PJ.svg(E.pjs[u])}</span>` : `<span class="avatar grande" style="width:76px;height:76px;font-size:30px">${esc(u.charAt(0).toUpperCase())}</span>`;
  ventana(`<div class="invita"><span id="inv-av">${avatar()}</span>
      <h2 id="v-h" tabindex="-1">@${esc(u)} te invitó a ser su&nbsp;amigo</h2>
      <p>Si los dos suben su dibujo la misma semana, crece su racha juntos 🔥. Solo agrégalo si lo&nbsp;conoces.</p>
      <button type="button" class="btn amarillo" id="inv-si">MANDAR SOLICITUD</button></div>`, (velo, cerrar) => {
    pjPedir([u], () => { const a = velo.querySelector('#inv-av'); if (a) a.innerHTML = avatar(); });
    velo.querySelector('[data-cerrar]').textContent = 'No, gracias';
    velo.querySelector('#inv-si').addEventListener('click', async ev => {
      ev.currentTarget.disabled = true; ev.currentTarget.textContent = 'Enviando…';
      const r = await api('amigo_agregar', { sesion: E.sesion, usuario: u });
      cerrar();
      if (!r.ok) return aviso(textoError(r.error));
      aviso(r.aceptado ? '¡Ahora son amigos! 🎉' : 'Solicitud enviada a @' + u + '. Cuando la acepte, aparecerá en Amigos.');
    });
  });
}

/* Sugerencias al agregar un amigo (7 nov 2026): mientras escribe, la app muestra hasta 6 personas registradas
   cuyo usuario empieza (o contiene) lo escrito. Lo responde «Reto de la semana · web» (acción buscar_usuarios):
   no muestra menores sin autorización, ni a quien te bloqueó o bloqueaste, ni a ti. */
function sugerencias(root, d) {
  const inp = root.querySelector('#nu'), caja = root.querySelector('#sug');
  if (!inp || !caja) return;
  const ya = {}; if (d) ['amigos', 'enviadas', 'solicitudes'].forEach(k => (d[k] || []).forEach(x => { ya[pjUsuario(x.usuario)] = k; }));
  let t = null, pedido = 0;
  const memo = E.sugMemo || (E.sugMemo = {});   // 7 nov 2026: lo ya buscado se reutiliza (y con 2 letras, la app filtra sola)
  const cerrar = () => { caja.hidden = true; caja.innerHTML = ''; inp.setAttribute('aria-expanded', 'false'); };
  const pintarLista = (u, buscando) => {
    caja.innerHTML = u.length ? u.map(x => {
      const est = ya[pjUsuario(x.usuario)];
      return `<button type="button" class="sug" role="option" data-sug="${esc(x.usuario)}" ${est ? 'disabled' : ''}>${pjAvatar(x.usuario, x.nombre)}<span><b>${esc(x.nombre || '@' + x.usuario)}</b><small>@${esc(x.usuario)}</small></span>${est ? `<em>${est === 'amigos' ? 'Ya son amigos' : est === 'enviadas' ? 'Solicitud enviada' : 'Te quiere agregar'}</em>` : '<em class="sug-mas">＋</em>'}</button>`;
    }).join('') : buscando ? '<p class="nota izq sug-buscando" style="margin:4px 2px"><span class="spin" aria-hidden="true"></span> Buscando…</p>'
      : '<p class="nota izq" style="margin:4px 2px">Nadie con ese usuario todavía. Revisa cómo se escribe o pídele que se&nbsp;registre.</p>';
    caja.hidden = false; inp.setAttribute('aria-expanded', 'true');
  };
  const local = q => {
    if (memo[q]) return memo[q].u;
    const base = memo[q.slice(0, 2)];
    return base && base.completa ? base.u.filter(x => pjUsuario(x.usuario).indexOf(q) === 0).slice(0, 6) : null;
  };
  inp.addEventListener('input', () => {
    clearTimeout(t);
    const q = pjUsuario(inp.value).replace(/[^a-z0-9._]/g, '');
    if (q.length < 2) return cerrar();
    const l = local(q);
    pintarLista(l ? l.slice(0, 6) : [], !l);   // al instante: lo que ya sabemos o «Buscando…»
    if (memo[q] || (l && q.length > 2 && l.length >= 6)) return;
    t = setTimeout(async () => {
      const n = ++pedido;
      const r = await extra('buscar_usuarios', { q });
      if (r.ok && Array.isArray(r.u)) {
        memo[q] = r;
        (r.u || []).forEach(x => { const pj = pjDeTexto(x.p); if (pj) E.pjs[pjUsuario(x.usuario)] = pj; });
      }
      if (n !== pedido || pjUsuario(inp.value).replace(/[^a-z0-9._]/g, '') !== q) return;   // ya escribió otra cosa
      if (!r.ok || !Array.isArray(r.u)) {
        caja.innerHTML = `<p class="nota izq" style="margin:4px 2px">No pudimos buscar en este momento. Escribe el usuario completo y toca Agregar. <small>(código: ${esc(r.error || 'respuesta')})</small></p>`;
        caja.hidden = false; return;
      }
      pintarLista(r.u.slice(0, 6), false);
    }, 150);
  });
  caja.addEventListener('click', e => {
    const b = e.target.closest('[data-sug]');
    if (!b || b.disabled) return;
    inp.value = '@' + b.dataset.sug; cerrar();
    root.querySelector('#fa').requestSubmit ? root.querySelector('#fa').requestSubmit() : root.querySelector('#fa button').click();
  });
}

/* ---------- 3 nov 2026: quitar, bloquear o reportar a un usuario (lo pide Google Play para apps con contenido de usuarios) ---------- */
const botonMas = (x, amigo) => `<button type="button" class="btn blanco chico mini" data-mas="${esc(x.usuario)}" data-nombre="${esc(x.nombre)}" data-amigo="${amigo ? 1 : 0}" aria-label="Más opciones para @${esc(x.usuario)}: bloquear o reportar" title="Bloquear o reportar">⋯</button>`;
function ventanaUsuario(usuario, nombre, esAmigo) {
  ventana(`<h2 id="v-h" tabindex="-1">${esc(nombre)} <small style="font-weight:600;font-size:14px">@${esc(usuario)}</small></h2>
    ${esAmigo ? '<button type="button" class="btn blanco chico" id="u-quitar">Quitar de mis amigos</button>' : ''}
    <button type="button" class="btn blanco chico" id="u-bloquear">🚫 Bloquear</button>
    <p class="nota izq" style="margin:-4px 0 4px">No podrá mandarte solicitudes ni toques, y dejarán de ser amigos. No le avisamos.</p>
    <button type="button" class="btn blanco chico" id="u-reportar">🚩 Reportar</button>
    <p class="nota izq" style="margin:-4px 0 4px">Si te molesta o te hace sentir mal, repórtalo: lo revisa el equipo del reto. Si eres menor de edad, cuéntale también a tu representante.</p>`, (v, cerrar) => {
    const q = v.querySelector('#u-quitar');
    if (q) q.addEventListener('click', async () => { cerrar(); await api('amigo_responder', { sesion: E.sesion, usuario, accionAmigo: 'quitar' }); vistaAmigos(); });
    v.querySelector('#u-bloquear').addEventListener('click', async ev => {
      ev.currentTarget.disabled = true;
      const r = await api('amigo_responder', { sesion: E.sesion, usuario, accionAmigo: 'bloquear' });
      cerrar();
      if (!r.ok) return aviso(textoError(r.error));
      vistaAmigos('Bloqueaste a @' + usuario + '. Puedes desbloquearlo abajo, en «Bloqueados».');
    });
    v.querySelector('#u-reportar').addEventListener('click', () => { cerrar(); ventanaReportarUsuario(usuario, nombre); });
  });
}
const MOTIVOS_USUARIO = [['Me molesta o me hace sentir mal', 'Toques o solicitudes que no quieres, burlas o acoso'], ['Contenido inapropiado', 'Su nombre o usuario es ofensivo o no es para todo público'], ['Se hace pasar por otra persona', 'Usa el nombre o el usuario de otro artista'], ['Otro', 'Otra razón: cuéntanos abajo']];
function ventanaReportarUsuario(usuario, nombre) {
  let motivo = '';
  ventana(`<h2 id="v-h" tabindex="-1" style="margin:0;font-family:var(--display)">Reportar a ${esc(nombre)} (@${esc(usuario)})</h2>
    <p style="margin:0;font-size:14px">Lo revisa el equipo del reto. Nadie más sabe que fuiste tú.</p>
    <div class="motivos" role="radiogroup" aria-label="Motivo">${MOTIVOS_USUARIO.map(m => `<button type="button" class="opcion" role="radio" aria-checked="false" aria-pressed="false" data-m="${esc(m[0])}" style="text-align:left;display:flex;flex-direction:column;gap:2px;padding:10px 12px"><b>${esc(m[0])}</b><small style="font-weight:600">${esc(m[1])}</small></button>`).join('')}</div>
    <label class="campo" for="rep-det">Detalle <span class="ayuda">(opcional)</span><textarea id="rep-det" maxlength="300" rows="3" style="border:3px solid var(--ink);border-radius:12px;padding:10px 12px;font:600 15px var(--texto);width:100%"></textarea></label>
    <label style="display:flex;gap:8px;align-items:center;font-weight:700;font-size:14px"><input type="checkbox" id="rep-bloq" checked style="width:20px;height:20px"> Bloquearlo también</label>
    <div class="error" role="alert" id="rep-err" hidden></div>
    <button type="button" class="btn" id="rep-ok">ENVIAR REPORTE</button>`, (velo, cerrar) => {
    velo.querySelectorAll('[data-m]').forEach(b => b.addEventListener('click', () => {
      motivo = b.dataset.m;
      velo.querySelectorAll('[data-m]').forEach(x => { const on = x === b; x.setAttribute('aria-pressed', on); x.setAttribute('aria-checked', on); });
    }));
    velo.querySelector('#rep-ok').addEventListener('click', async ev => {
      const err = velo.querySelector('#rep-err');
      if (!motivo) { err.textContent = ERRORES.reporte; err.hidden = false; return; }
      const bloquear = velo.querySelector('#rep-bloq').checked;
      ev.currentTarget.disabled = true; ev.currentTarget.textContent = 'Enviando…';
      const r = await api('reportar_usuario', { sesion: E.sesion, usuario, motivo, detalle: velo.querySelector('#rep-det').value.trim(), bloquear });
      if (!r.ok) { err.textContent = textoError(r.error); err.hidden = false; ev.currentTarget.disabled = false; ev.currentTarget.textContent = 'ENVIAR REPORTE'; return; }
      cerrar(); aviso('🚩 Gracias. El equipo del reto lo va a revisar.'); vistaAmigos(bloquear ? 'Bloqueaste a @' + usuario + '. Puedes desbloquearlo abajo, en «Bloqueados».' : null);
    });
  });
}

function ventanaToque(usuario, nombre) {
  let elegido = 2;
  ventana(`
    <h2 id="v-h" tabindex="-1">Dale un toque a ${esc(nombre)}</h2>
    <p style="font-size:14px">Le aparecerá en su app con el sticker que elijas.</p>
    <div class="stickers">${STICKERS.map((st, i) => `<button type="button" class="sticker" data-st="${i}" aria-pressed="${i === elegido}">${i === TOQUE_PJ && E.pj ? `<span class="toque-pj" style="width:80px;height:80px">${PJ.svg(E.pj)}</span>` : `<img src="${st[0]}" alt="" width="80" height="80">`}<span>${esc(st[1])}</span></button>`).join('')}</div>
    <button type="button" class="btn amarillo" id="dar">DAR TOQUE</button>
    <button type="button" class="enlace" id="quitar" style="font-size:12px;color:var(--muted)">Quitar, bloquear o reportar a @${esc(usuario)}</button>`, (v, cerrar) => {
    v.querySelectorAll('[data-st]').forEach(b => b.addEventListener('click', () => { elegido = +b.dataset.st; v.querySelectorAll('[data-st]').forEach(x => x.setAttribute('aria-pressed', String(+x.dataset.st === elegido))); }));
    v.querySelector('#dar').addEventListener('click', async ev => {
      ev.currentTarget.disabled = true; ev.currentTarget.textContent = 'Enviando…';
      const r = await api('toque', { sesion: E.sesion, usuario, sticker: elegido });
      cerrar();
      if (r.ok) { aviso('¡Toque enviado a ' + nombre + '!'); vistaAmigos(); } else aviso(textoError(r.error));
    });
    v.querySelector('#quitar').addEventListener('click', () => { cerrar(); ventanaUsuario(usuario, nombre, true); });
  });
}

/* ---------- Club Estrella ---------- */
const ADV_META = 15;
const fechaCorta = iso => { if (!iso) return ''; const [y, m, d] = iso.split('-').map(Number); return d + ' de ' + MESES[m - 1]; };
/* 7 nov 2026: beneficios del Club (aprobados por Stefany). Se quitaron preventas, masterclass y el podcast «próximamente»
   porque hoy no se entregan de forma constante. La Chispa Pro no se muestra en la app de Google Play. */
const PERKS = [
  ['Reto 24 h antes', 'Más tiempo para dibujar y publicas primero: ventaja en el Relámpago'], ['2 protectores al mes', 'Tu fuego no se apaga'],
  ['Chispa del día Pro', 'Cubeta, pincel en 3 tamaños, cambiar la chispa 1 vez al día y video acelerado', 'ancho'],
  ['Personaje exclusivo', 'Formas, ojos, cabellos y accesorios que solo tiene el Club'], ['Tu estrella en el ranking', 'Junto a tu nombre: crece con los meses que sumas'],
  ['Discord privado', 'Comunidad y opiniones de otros artistas', 'ancho']
];
function vistaClub(error, escribiendo) {
  const c = E.club || {};
  const pago = encodeURIComponent('Hola. Quiero unirme al Club Estrella del #RetoMenteMilenial pagando con Pago Móvil, Binance o Zinli.');
  pintar(`
    <header class="barra club-barra">
      <button type="button" class="volver" id="v" aria-label="Volver">${ICO.volver}</button>
      <div style="flex:1"><h1>Club Estrella</h1><span class="sub">${PLAY ? 'Para miembros del Club' : 'Apoya el reto y desbloquea más · 5,50 $ al mes'}</span></div>
    </header>
    <main class="cont">
      <div class="estrellas" aria-label="Tu estrella crece con tus meses en el Club">
        <span><img src="img/estrella-1.webp" alt="" width="64" height="56">Menos de 3 meses</span>
        <span><img src="img/estrella-3.webp" alt="" width="56" height="56">De 3 a 5 meses</span>
        <span><img src="img/estrella-6.webp" alt="" width="58" height="56">6 meses o más</span>
      </div>
      ${c.activo ? `<div class="club-yo"><img src="img/estrella-${c.estrella}.webp" alt="" width="54" height="54"><div><b>✓ Club activo hasta el ${fechaCorta(c.hasta)}</b><span>Llevas ${c.meses} ${c.meses === 1 ? 'mes' : 'meses'} · ${c.protectores} protectores este mes</span></div></div>` : ''}
      <ul class="perks">${PERKS.map((p, i) => `<li class="perk p${i} ${p[2] || ''}">${p[2] === 'pronto' ? '<span class="pronto-tag">PRÓXIMAMENTE</span>' : ''}<strong>${esc(p[0])}</strong><span>${esc(p[1])}</span></li>`).join('')}</ul>
      ${c.activo ? (c.patreon ? '<span class="nota">✓ Vinculado con Patreon. Se revisa solo cada día.</span>' : '') : PLAY ? `
        <span class="nota">¿Ya eres miembro del Club Estrella? Vincula tu cuenta para activar tus ventajas en la app.</span>
        <button type="button" class="btn turquesa chico" id="vincular">${c.patreon ? 'Vincular otra cuenta de Patreon' : 'Ya soy miembro: vincular mi Patreon'}</button>
        ${c.patreon ? '<button type="button" class="enlace" id="revisar">Revisar mi membresía</button>' : ''}` : `
        <a class="btn amarillo" href="${CONFIG.patreon}" target="_blank" rel="noopener">UNIRME POR PATREON</a>
        <button type="button" class="btn turquesa chico" id="vincular">${c.patreon ? 'Vincular otra cuenta de Patreon' : 'Ya soy miembro: vincular mi Patreon'}</button>
        ${c.patreon ? '<button type="button" class="enlace" id="revisar">Revisar mi membresía</button>' : ''}
        <a class="btn blanco chico" href="https://wa.me/${CONFIG.whatsapp}?text=${pago}" target="_blank" rel="noopener">Pagar con Pago Móvil, Binance o Zinli</a>
        <span class="nota">Si pagaste por Pago Móvil, Binance o Zinli, te activamos el Club en menos de 24 horas. Luego toca «Revisar mi membresía» o vuelve a abrir la app.</span>
        ${escribiendo ? `<form class="fila-ag" id="fc"><input id="cod-club" type="text" autocapitalize="characters" autocomplete="off" placeholder="Código" aria-label="Código del Club" style="border:3px solid var(--ink);border-radius:12px;padding:10px;font-size:16px;font-weight:700"><button type="submit" class="btn turquesa chico mini">Desbloquear</button></form>`
        : '<button type="button" class="enlace" id="ya" style="font-size:12px">Tengo un código del Club</button>'}`}
      ${error ? `<div class="error" role="alert">${esc(error)}</div>` : ''}
      <span class="nota">Participar es gratis siempre. El Club ve el reto 24 horas antes y puede publicar desde ese momento: tiene más tiempo para dibujar y sus «Me gusta» empiezan a sumar antes. Eso ayuda sobre todo en el Relámpago creativo.</span>
    </main>`, root => {
    on('#v', 'click', () => ir(E.volverA && E.volverA !== 'club' ? E.volverA : 'hoy'));
    on('#ya', 'click', () => vistaClub('', true));
    on('#vincular', 'click', async () => {
      const b = root.querySelector('#vincular'); b.disabled = true; b.textContent = 'Abriendo Patreon…';
      const r = await api('club_codigo', { sesion: E.sesion, patreon: 'inicio' });
      if (!r.ok || !r.url) { if (r.error === 'sesion') return cerrarSesion(true); return vistaClub(textoError(r.error)); }
      location.href = r.url;   // Patreon vuelve a /app/patreon.html
    });
    on('#revisar', 'click', async () => {
      const b = root.querySelector('#revisar'); b.disabled = true; b.textContent = 'Revisando…';
      const m = await api('mi_semana', { sesion: E.sesion });
      if (m.ok && m.club) { E.club = m.club; guardar('club', E.club); E.hoy = null; }
      if (E.club && E.club.activo) aviso('★ ¡Tu Club Estrella está activo!');
      vistaClub(m.ok ? (E.club && E.club.activo ? '' : 'Todavía no vemos una membresía activa. Si acabas de unirte, intenta en unos minutos.') : textoError(m.error));
    });
    const inp = root.querySelector('#cod-club'); if (inp) inp.focus();
    on('#fc', 'submit', async ev => {
      ev.preventDefault();
      const b = root.querySelector('#fc button'); b.disabled = true;
      const r = await api('club_codigo', { sesion: E.sesion, codigo: inp.value });
      if (!r.ok) return vistaClub(textoError(r.error), true);
      E.club = r.club; guardar('club', E.club); E.hoy = null;
      aviso('★ ¡Bienvenid@ al Club Estrella!'); vistaClub();
    });
  });
}

let cerrarChispa = null;
/* Banner del Club al terminar la chispa (6 nov 2026): solo mayores de edad (los menores nunca reciben ofertas),
   nunca a miembros, nunca en la versión de Google Play (política de pagos) y máximo una vez al día por teléfono. */
function promoClub() {
  if (PLAY || (E.club && E.club.activo) || !E.perfil || E.perfil.mayor !== 'Sí') return false;
  const dia = new Date(Date.now() - 4 * 36e5).toISOString().slice(0, 10);
  if (leer('promoClub') === dia) return false;
  guardar('promoClub', dia); return true;
}
function vistaChispa() {
  pintar('<div id="chispa"></div>', root => {
    cerrarChispa = abrirChispa({ root: root.querySelector('#chispa'), esc, autor: { nombre: nombreCorto(), usuario: (E.perfil && E.perfil.usuario) || '' }, club: !!(E.club && E.club.activo),   /* 8 nov 2026: candados también en Google Play; el botón solo lleva a «Conocer el Club» (sin precios ni pagos) */ icoVolver: ICO.volver,
      volver: () => ir('hoy'), irClub: () => ir('club'), promoClub });
  });
}

function vistaPronto(cual) {
  const T = {
    ranking: ['Ranking', 'Tu posición en cada categoría, tus puntos y las estrellas del Club.'],
    amigos: ['Amigos', 'Agrega a tus amigos por su usuario, cuiden su racha juntos y mándense toques con stickers.']
  }[cual];
  conNav(cual, cabecera(T[0]) + `<main class="cont con-nav"><div class="pronto"><img src="${imgGuia(E.guia)}" alt="" width="150" height="145"><h2>Muy pronto</h2><p>${esc(T[1])}</p></div></main>`);
}

/* ---------- avisos ---------- */
const TIPOS_AVISO = [['reto', 'Reto nuevo', 'cuando sale el reto de la semana'], ['racha', 'Racha en riesgo', 'domingo 6:00 p. m., si aún no subes'], ['amigos', 'Amigos', 'toques y solicitudes de amistad'], ['chispa', 'Chispa del día', 'todos los días a las 4:00 p. m.']];
const esIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const instalada = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
function estadoAvisos() {
  if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) return esIOS() && !instalada() ? 'instalar' : 'no';
  if (Notification.permission === 'denied') return 'bloqueado';
  const A = leer('avisos');
  return A && A.token && Notification.permission === 'granted' ? 'activo' : 'pedir';
}
async function activarAvisos(tipos) {
  let permiso;
  try { permiso = await Notification.requestPermission(); } catch (e) { permiso = 'default'; }   // primero, sin esperar nada (Safari)
  if (permiso !== 'granted') return { ok: false, error: permiso === 'denied' ? 'avisos_bloqueados' : 'avisos_cancelados' };
  let token;
  try {
    const espera = new Promise((_, no) => setTimeout(() => no(new Error('tiempo')), 20000));
    token = await Promise.race([import('./avisos.js?v=1').then(m => m.tokenAvisos()), espera]);
  } catch (e) { return { ok: false, error: 'avisos_no' }; }
  const r = await api('avisos', { sesion: E.sesion, token, tipos: tipos || TIPOS_AVISO.map(t => t[0]) });
  if (r.ok) guardar('avisos', { token, tipos: r.tipos, fecha: Date.now() });
  return r;
}
async function desactivarAvisos(sinServidor) {
  const A = leer('avisos');
  guardar('avisos', null);
  if (A && A.token && !sinServidor) await api('avisos', { sesion: E.sesion, token: A.token, quitar: true });
  try { const reg = await navigator.serviceWorker.getRegistration(), sus = reg && await reg.pushManager.getSubscription(); if (sus) await sus.unsubscribe(); } catch (e) {}
}
async function refrescarAvisos() {   // una vez por semana: el token del teléfono puede cambiar
  const A = leer('avisos');
  if (estadoAvisos() !== 'activo' || Date.now() - (A.fecha || 0) < 7 * 864e5) return;
  try {
    const token = await (await import('./avisos.js?v=1')).tokenAvisos();
    if (token !== A.token) await api('avisos', { sesion: E.sesion, token: A.token, quitar: true });
    const r = await api('avisos', { sesion: E.sesion, token, tipos: A.tipos });
    if (r.ok) guardar('avisos', { token, tipos: r.tipos, fecha: Date.now() });
  } catch (e) {}
}
/* Bloque de avisos para Yo (completo) y para la Celebración (solo invitación). */
function avisosHtml(enCelebracion) {
  const est = estadoAvisos(), A = leer('avisos') || {};
  if (enCelebracion) {
    if (est === 'pedir') return `<div class="caja crema avisos-inv" style="text-align:left"><strong class="t">🔔 ¿Te avisamos del próximo reto?</strong>También si tu racha está en riesgo o un amigo te da un toque. Nada de spam.<button type="button" class="btn turquesa chico" id="av-on" style="margin-top:8px;width:100%">ACTIVAR AVISOS</button></div>`;
    if (est === 'instalar') return '<div class="caja crema" style="text-align:left">🔔 En iPhone, para recibir el aviso del próximo reto, instala la app: botón <b>Compartir</b> → <b>«Agregar a inicio»</b>. Luego actívalos en <b>Yo</b>.</div>';
    return '';
  }
  const cuerpo = {
    activo: `<div class="lista avisos-op">${TIPOS_AVISO.map(([id, t, d]) => `<label><span><b>${t}</b><small>${d}</small></span><input type="checkbox" data-aviso="${id}" ${(A.tipos || []).indexOf(id) >= 0 ? 'checked' : ''}></label>`).join('')}</div>
      <button type="button" class="enlace" id="av-off" style="font-size:13px">Desactivar avisos en este teléfono</button>`,
    pedir: '<button type="button" class="btn turquesa chico" id="av-on">🔔 Activar avisos</button>',
    instalar: '<div class="caja crema">En iPhone los avisos solo funcionan con la app instalada. Toca <b>«Instalar la app en mi teléfono»</b> y luego ábrela desde el ícono.</div>',
    bloqueado: `<div class="caja crema">${esc(ERRORES.avisos_bloqueados)}</div>`,
    no: `<p class="nota izq" style="margin:0">${esc(ERRORES.avisos_no)}</p>`
  }[est];
  return `<div class="fila-t"><strong>Avisos</strong><span>Solo lo importante</span></div>${cuerpo}`;
}
function activarAvisosEn(root, despues) {
  const b = root.querySelector('#av-on');
  if (b) b.addEventListener('click', async () => {
    b.disabled = true; b.textContent = 'Activando…';
    const r = await activarAvisos();
    if (r.ok) aviso('🔔 ¡Listo! Te avisaremos.'); else aviso(textoError(r.error));
    despues();
  });
  const off = root.querySelector('#av-off');
  if (off) off.addEventListener('click', async () => { off.disabled = true; await desactivarAvisos(); aviso('Avisos desactivados en este teléfono.'); despues(); });
  root.querySelectorAll('[data-aviso]').forEach(c => c.addEventListener('change', async () => {
    const A = leer('avisos'); if (!A) return;
    const tipos = [...root.querySelectorAll('[data-aviso]')].filter(x => x.checked).map(x => x.dataset.aviso);
    const r = await api('avisos', { sesion: E.sesion, token: A.token, tipos });
    if (r.ok) { guardar('avisos', Object.assign(A, { tipos: r.tipos })); aviso('Guardado ✓'); } else { aviso(textoError(r.error)); despues(); }
  }));
}

/* ---------- Yo ---------- */
function progresoHtml() {
  const pr = E.progreso;
  if (!pr) return '';
  return `<section class="progreso-yo" aria-label="Tu progreso">
    <div class="stats"><div><b>${ICO.fuego} ${pr.racha}</b><span>racha actual</span></div><div><b>${pr.mejor}</b><span>mejor racha</span></div><div><b>${pr.semanas}</b><span>semanas con dibujo</span></div></div>
  </section>`;
}
function vistaYo() {
  const p = E.perfil || {}, ini = esc((nombreCorto() || '?').charAt(0).toUpperCase());
  const esIOS = /iphone|ipad|ipod/i.test(navigator.userAgent), instalada = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  conNav('yo', cabecera('Yo') + `<main class="cont con-nav">
      <div class="perfil"><span class="avatar${E.pj ? ' pj' : ''}">${E.pj ? PJ.svg(E.pj) : ini}</span><div style="min-width:0;flex:1"><h2>${esc(p.nombre || '')}</h2><span>@${esc(p.usuario || '')}</span></div><button type="button" class="btn blanco chico mini" id="pj-editar">✏️ Mi personaje</button></div>
      ${progresoHtml()}
      <div class="lista">
        ${p.correo ? `<div><span>Correo</span><span>${esc(p.correo)}</span></div>` : ''}
        <div><span>Edad</span><span>${p.mayor === 'Sí' ? '18 años o más' : 'Menor de edad'}</span></div>
        <div><span>Vives en Venezuela</span><span>${p.venezuela === 'Sí' ? (p.estado ? 'Sí · ' + esc(p.estado) : 'Sí') : (p.pais ? 'No · ' + esc(p.pais) : 'No')}</span></div>
        ${p.mayor === 'Sí' && p.anio ? `<div><span>Año de nacimiento</span><span>${esc(p.anio)}</span></div>` : ''}
        ${p.cumple ? `<div><span>Cumpleaños</span><span>${Number(p.cumple.split('-')[1])} de ${MESES[Number(p.cumple.split('-')[0]) - 1] || ''}</span></div>` : ''}
        ${p.mayor === 'Sí' ? `<div><span>Ofertas</span><span>${p.ofertas === 'Sí' ? 'Sí' : 'No'}</span></div>` : ''}
      </div>
      <button type="button" class="btn blanco chico" id="editar">Editar mis datos</button>
      <div class="fila-t"><strong>Tu guía</strong><span>Te acompaña en la app</span></div>
      <div class="par">
        <button type="button" class="guia-btn" data-guia="digi" aria-pressed="${E.guia !== 'tradi'}"><strong>Digi</strong> <span>digital</span></button>
        <button type="button" class="guia-btn" data-guia="tradi" aria-pressed="${E.guia === 'tradi'}"><strong>Tradi</strong> <span>tradicional</span></button>
      </div>
      ${E.club && E.club.activo
        ? `<div class="club-yo"><img src="img/estrella-${E.club.estrella}.webp" alt="" width="54" height="54"><div><b>Club Estrella activo</b><span>Hasta el ${fechaCorta(E.club.hasta)} · llevas ${E.club.meses} ${E.club.meses === 1 ? 'mes' : 'meses'}${E.club.protectores ? ' · ' + E.club.protectores + ' protectores' : ''}</span></div></div>`
        : `<button type="button" class="btn blanco chico" data-ir="club">${PLAY ? '★ Club Estrella: vincular mi cuenta' : '★ Conocer el Club Estrella'}</button>`}
      ${navidadGanada() ? '<div class="club-yo adv-ins"><span class="adv-ins-ico" aria-hidden="true">🎄</span><div><b>Insignia del Adviento de Chispas</b><span>Hiciste ' + ADV_META + ' chispas navideñas o más · tus chispas salen con marco verde</span></div></div>' : ''}
      ${E.club && E.club.cumple && E.club.cumple.disponible ? `<div class="caja crema"><strong class="t">🎂 Tu regalo de cumpleaños</strong>Tienes un protector de racha hasta el ${fechaCorta(E.club.cumple.hasta)}. Úsalo en «Hoy» si tu racha está en riesgo.</div>` : ''}
      ${avisosHtml()}
      ${instalada ? '' : `<button type="button" class="btn amarillo chico" id="instalar">📲 Instalar la app en mi teléfono</button>`}
      <button type="button" class="btn blanco chico" id="tuto">👋 Ver el tutorial otra vez</button>
      <a class="btn blanco chico" href="${CONFIG.web}/preguntas-frecuentes.html" target="_blank" rel="noopener">Preguntas frecuentes</a>
      <button type="button" class="enlace" id="salir">Cerrar sesión</button>
      <p class="nota" style="margin:0;text-align:center;font-size:12px">Versión de la app: ${VERSION_APP}</p>
      <button type="button" class="enlace" id="borrar" style="font-size:12px;color:var(--muted)">Borrar mi cuenta</button>
      <span class="nota"><a href="${CONFIG.web}/bases.html#reto" target="_blank" rel="noopener">Bases del reto</a> · <a href="${CONFIG.web}/terminos.html" target="_blank" rel="noopener">Términos</a> · <a href="${CONFIG.web}/privacidad.html" target="_blank" rel="noopener">Privacidad</a></span>
    </main>`, root => {
    root.querySelectorAll('[data-guia]').forEach(b => b.addEventListener('click', () => { E.guia = b.dataset.guia; guardar('guia', E.guia); vistaYo(); }));
    on('#editar', 'click', () => { E.borrador = { nombre: p.nombre, usuario: p.usuario }; vistaPerfil(); });
    on('#salir', 'click', () => cerrarSesion());
    on('#pj-editar', 'click', () => ventanaPersonaje());
    on('#borrar', 'click', () => {
      // Automático desde el 6 nov 2026: lo hace el Apps Script «Reto de la semana · web» (archivo «Borrar cuenta»).
      ventana(`<h2 id="v-h" tabindex="-1">Borrar mi cuenta</h2>
        <div style="background:#FFE3EF;border:3px solid var(--ink);border-radius:14px;padding:12px 14px;box-shadow:4px 4px 0 var(--ink)">
          <b style="display:block;font-family:var(--display);font-size:19px;line-height:1.2;margin-bottom:6px">⚠️ Esto es permanente y no tiene vuelta atrás</b>
          <span style="font-size:14px;line-height:1.45">Se borran <b>ya mismo</b> tu perfil, tu racha, tus puntos, tus amigos, tus avisos y tu vínculo con el Club Estrella. <b>Tus dibujos dejan de contar al instante</b>: si quedaste en un podio o una categoría, pierdes ese lugar. En el Padlet pueden verse unos días más hasta que los quitamos (7 días o menos). <b>Nadie puede recuperarlo, ni nosotros.</b></span>
        </div>
        <label style="font-size:14px">Si de verdad quieres borrarla, escribe <b>BORRAR</b>:<input id="bc-txt" autocomplete="off" autocapitalize="characters" style="display:block;width:100%;margin-top:6px;padding:10px;border:3px solid var(--ink);border-radius:12px;font:inherit"></label>
        <button type="button" class="btn blanco" id="bc-ok" disabled>Borrar mi cuenta para siempre</button>
        <p class="nota" id="bc-msg" role="status" style="margin:0"></p>`, (velo, cerrarV) => {
        const txt = velo.querySelector('#bc-txt'), ok = velo.querySelector('#bc-ok'), msg = velo.querySelector('#bc-msg');
        txt.addEventListener('input', () => { ok.disabled = txt.value.trim().toUpperCase() !== 'BORRAR'; });
        ok.addEventListener('click', async () => {
          if (!CONFIG.extra) { msg.textContent = 'No se pudo conectar. Escríbenos a retocreativofest@gmail.com.'; return; }
          ok.disabled = true; msg.textContent = 'Borrando…';
          try {
            const res = await fetch(CONFIG.extra, { method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({ accion: 'borrar_cuenta', sesion: E.sesion, dibujos: true }) });
            const r = await res.json();
            if (!r.ok) throw new Error(r.error || 'servidor');
            cerrarV();
            const A = leer('avisos'); if (A && A.token) desactivarAvisos(true);
            E.sesion = E.correo = E.perfil = E.hoy = E.semana = E.progreso = E.ranking = E.amigos = E.novedades = E.club = null; E.borrador = {}; E.subida = {};
            ['sesion', 'correo', 'perfil', 'hoy', 'semana', 'progreso', 'club', 'autorizacion', 'personaje'].forEach(k => guardar(k, null)); E.pj = null; E.pjs = {}; E.pjBuscado = false; E.pjSync = false;
            vistaBienvenida('Tu cuenta se borró. ¡Gracias por dibujar con nosotros! 💛');
          } catch (e) {
            ok.disabled = false;
            msg.innerHTML = 'No se pudo borrar ahora. Intenta en unos minutos o escríbenos a <b>retocreativofest@gmail.com</b> con el asunto «Borrar mi cuenta de la app».';
          }
        });
      });
    });
    on('#tuto', 'click', () => { guardar('tuto', null); ir('hoy'); });
    activarAvisosEn(root, vistaYo);
    on('#instalar', 'click', async () => {
      if (E.instalar) { E.instalar.prompt(); await E.instalar.userChoice; E.instalar = null; return vistaYo(); }
      ventana(esIOS
        ? `<h2 id="v-h" tabindex="-1">Instálala en tu iPhone</h2><ol><li>Abre esta página en <b>Safari</b>.</li><li>Toca el botón <b>Compartir</b> (el cuadrito con la flecha).</li><li>Elige <b>«Agregar a inicio»</b>.</li></ol><p>Si llegaste desde Instagram o WhatsApp, primero ábrela en Safari.</p>`
        : `<h2 id="v-h" tabindex="-1">Instálala en tu teléfono</h2><ol><li>Abre esta página en <b>Chrome</b>.</li><li>Toca los <b>tres puntos</b> de arriba a la derecha.</li><li>Elige <b>«Instalar app»</b> o <b>«Agregar a la pantalla principal»</b>.</li></ol>`);
    });
  });
}

async function cerrarSesion(vencida) {
  const s = E.sesion;
  E.sesion = E.correo = E.perfil = E.hoy = E.semana = E.progreso = E.ranking = E.amigos = E.novedades = E.club = null; E.borrador = {}; E.subida = {};
  ['sesion', 'correo', 'perfil', 'hoy', 'semana', 'progreso', 'club', 'personaje'].forEach(k => guardar(k, null)); E.pj = null; E.pjs = {}; E.pjBuscado = false; E.pjSync = false;
  const A = leer('avisos');
  if (A && A.token) { if (s && vencida !== true) api('avisos', { sesion: s, token: A.token, quitar: true }); desactivarAvisos(true); }
  if (s && vencida !== true) api('salir', { sesion: s });
  vistaBienvenida(vencida === true ? ERRORES.sesion : '');
}

/* ---------- mini tutorial con tu guía ----------
   La primera vez que se abre la app (Hoy) y la primera vez que se entra a cada sección,
   el guía elegido (Tradi o Digi) explica en pocas palabras cómo se usa. Se guarda en el teléfono
   lo que ya se vio; desde «Yo» se puede ver otra vez. */
const TUTO = {
  hoy: [
    ['¡Hola! Soy {g} {e}', 'Te voy a acompañar en la app. Te explico rapidito cómo funciona y, la primera vez que entres a cada sección, te cuento qué hay ahí.'],
    ['El reto de la semana', 'Aquí en <b>Hoy</b> ves el reto de la semana y cuánto falta para que cierre. Sale el miércoles a las 8:00 p. m. y cierra el lunes a las 8:00 p. m.'],
    ['Sube tu dibujo', 'Toca el botón <b>+</b> de abajo para subir tu dibujo. Se publica solo en el Padlet con tu nombre y tu usuario. Uno por semana.'],
    ['Tu racha 🔥', 'Cada semana que subes tu dibujo, tu racha crece. ¡No dejes pasar una semana sin dibujar!'],
    ['Mientras esperas', 'Haz la <b>Chispa del día</b>, un ejercicio corto para calentar la mano. Abajo tienes también <b>Ranking</b>, <b>Amigos</b> y <b>Yo</b>.']
  ],
  subir: [['Subir tu dibujo', 'Toma la foto de tu dibujo o elígela de tu galería, ponle título y una descripción corta, y marca si es tradicional o digital. Solo dibujos 100 % tuyos: sin IA, calcos ni copias.']],
  ranking: [['El ranking', 'Aquí ves cómo vas en cada categoría de premios y tus semanas para el Premio a la constancia. Compiten por los premios quienes viven en Venezuela.']],
  amigos: [
    ['Tus amigos', 'Busca a tus amigos por su usuario y mándales una solicitud.'],
    ['Rachas con amigos', 'Cuando los dos suben su dibujo la misma semana, crece la racha de los dos. Puedes darles un toque con un sticker una vez al día para animarlos.'],
    ['Tú decides', 'Con el botón ⋯ puedes quitar, bloquear o reportar a alguien. Si algo te hace sentir mal, cuéntaselo también a un adulto de confianza.']
  ],
  yo: [['Tu perfil', 'Aquí están tus datos, tu progreso y los avisos. Activa los avisos para que te recordemos antes del cierre. También puedes cambiar de guía o ver este tutorial otra vez.']],
  votar: [['La votación', 'Los 5 dibujos con más «Me gusta» en el Padlet son las finalistas. Tienes un voto, no se puede cambiar y no puedes votar por tu propio dibujo. Cierra el martes a las 9:00 p. m.']],
  club: [['El Club Estrella', PLAY ? 'Aquí ves las ventajas del Club Estrella: el reto 24 horas antes, protectores para tu racha y tu estrella según los meses que llevas. Si ya eres miembro, vincula tu cuenta.' : 'Es la membresía de Patreon del reto: ves el reto 24 horas antes, tienes protectores para tu racha y tu estrella cambia según los meses que llevas.']],
  chispa: [['La Chispa del día', 'Es un mini reto para calentar la mano. Sale una nueva cada día: hazla cuando quieras.']]
};
function tutorial(clave, intento) {
  const pasos = TUTO[clave];
  if (!pasos || estaEn !== clave) return;
  const vistos = leer('tuto') || {};
  if (vistos[clave]) return;
  if (document.querySelector('.velo')) { if (!intento) setTimeout(() => tutorial(clave, 1), 4000); return; }   // hay otra ventana abierta
  vistos[clave] = true; guardar('tuto', vistos);
  const g = E.guia === 'tradi' ? 'Tradi' : 'Digi', emoji = E.guia === 'tradi' ? '✏️' : '💻';
  let i = 0;
  const html = () => {
    const [t, p] = pasos[i], ultimo = i === pasos.length - 1;
    return `<div class="tuto-guia"><img src="${imgGuia(E.guia)}" alt="${g}" width="96" height="92"><div class="tuto-b"><h2 id="v-h" tabindex="-1">${t.replace('{g}', g).replace('{e}', emoji)}</h2><p>${p}</p></div></div>
      ${pasos.length > 1 ? `<span class="pasos" aria-label="Paso ${i + 1} de ${pasos.length}">${pasos.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</span>` : ''}
      <button type="button" class="btn amarillo" data-sig>${ultimo ? '¡Entendido!' : 'Siguiente'}</button>
      ${!ultimo ? '<button type="button" class="enlace" data-saltar>Saltar</button>' : ''}`;
  };
  ventana(`<div class="tuto">${html()}</div>`, (velo, cerrar) => {
    const caja = velo.querySelector('.tuto');
    const conectar = () => {
      caja.querySelector('[data-sig]').addEventListener('click', () => {
        if (i === pasos.length - 1) return cerrar();
        i++; caja.innerHTML = html(); conectar(); caja.querySelector('h2').focus();
      });
      const sal = caja.querySelector('[data-saltar]'); if (sal) sal.addEventListener('click', cerrar);
    };
    conectar();
  }, true);
}

/* ---------- navegación ---------- */
let estaEn = '';
function ir(donde) {
  if (E.recargar && (donde === 'hoy' || donde === 'yo')) { E.recargar = false; location.reload(); return; }
  if (!E.sesion) return vistaBienvenida();
  if (!E.perfil || !E.perfil.completo) { E.borrador = { nombre: (E.perfil || {}).nombre || '', usuario: (E.perfil || {}).usuario || '' }; return vistaPerfil(); }
  if (E.perfil.mayor === 'No' && E.perfil.bloqueado === false && !E.perfil.nombre && !E.completando) {   // menor con permiso nuevo: completa sus datos
    E.completando = true; E.borrador = { nombre: leer('nombreLocal') || '', usuario: E.perfil.usuario || '', mayor: 'No', venezuela: E.perfil.venezuela };
    return vistaPerfil();
  }
  if (E.pjTemporal) return vistaListo();   // personaje obligatorio (7 nov 2026)
  if ((donde === 'club' || donde === 'chispa') && estaEn !== donde) E.volverA = estaEn || 'hoy';
  estaEn = donde;
  if (donde === 'subir' && bloqueado()) { aviso(ERRORES.autorizacion); estaEn = 'hoy'; donde = 'hoy'; }
  if (donde === 'subir' && !(E.hoy && E.hoy.actual && !yaSubio())) { if (yaSubio()) aviso(ERRORES.ya_subiste); estaEn = 'hoy'; donde = 'hoy'; }
  /* 8 nov 2026: la sección queda en la dirección (#ranking, #amigos…) para que al recargar no vuelva a Hoy. */
  if (RUTAS.indexOf(donde) >= 0) { try { history.replaceState(null, '', location.pathname + location.search + (donde === 'hoy' ? '' : '#' + donde)); } catch (x) {} }
  mostrar(donde);
  setTimeout(() => tutorial(donde), 700);
  if (donde === 'hoy' && leer('invitacion')) setTimeout(ventanaInvitacion, 1400);   // la primera vez en cada sección, el guía la explica
}
function mostrar(donde) {
  if (donde === 'subir') return vistaSubir();
  if (donde === 'hoy') return vistaHoy();
  if (donde === 'yo') return vistaYo();
  if (cerrarChispa) { cerrarChispa(); cerrarChispa = null; }
  if (donde === 'club') return vistaClub();
  if (donde === 'chispa') return vistaChispa();
  if (donde === 'ranking') return vistaRanking();
  if (donde === 'amigos') return vistaAmigos();
  if (donde === 'votar') return vistaVotar();
  return vistaPronto(donde);
}

const IR_AVISO = ['hoy', 'amigos', 'ranking', 'yo', 'club', 'votar'];
const RUTAS = IR_AVISO.concat('chispa');   // secciones que se recuerdan al recargar
async function iniciar() {
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); E.instalar = e; });
  if ('serviceWorker' in navigator) {
    /* 7 nov 2026: los teléfonos que dejaban la app abierta seguían con la versión vieja (por eso unos veían otra chispa).
       Ahora busca la versión nueva al volver a la app y, si llega, recarga sola cuando no estás dibujando ni subiendo. */
    navigator.serviceWorker.register('sw.js').then(reg => {
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}); });
    }).catch(() => {});
    const habia = !!navigator.serviceWorker.controller;
    let recargando = false;
    const recargar = () => { if (recargando) return; recargando = true; location.reload(); };
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!habia) return;
      if (['subir', 'chispa', 'club'].indexOf(estaEn) < 0 && !document.querySelector('.velo, .ban-ov, .club-modal')) recargar();
      else E.recargar = true;   // recarga en cuanto vuelva a Hoy
    });
  }
  if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('message', e => { if (e.data && RUTAS.indexOf(e.data.ir) >= 0 && E.sesion) ir(e.data.ir); });   // 9 nov: también el aviso de la Chispa
  const params = new URLSearchParams(location.search), pedido = params.get('ir');   // al tocar un aviso
  const invita = pjUsuario(params.get('amigo') || '');   // enlace de invitación de un amigo
  if (/^[a-z0-9._]{3,30}$/.test(invita)) guardar('invitacion', invita);
  if (pedido || params.has('amigo')) history.replaceState(null, '', location.pathname);
  if (!E.sesion) return vistaBienvenida();
  const enHash = location.hash.slice(1);
  ir(RUTAS.indexOf(pedido) >= 0 ? pedido : RUTAS.indexOf(enHash) >= 0 ? enHash : 'hoy');
  refrescarAvisos();
  const r = await api('perfil', { sesion: E.sesion });   // refresca los datos guardados en el teléfono
  if (r.ok) {
    E.perfil = r.perfil; guardar('perfil', E.perfil);
    if (!r.perfil.completo) ir('hoy');
    else if (r.recienMayor) ventana(`<h2 id="v-h" tabindex="-1">🎉 ¡Feliz cumpleaños número&nbsp;18!</h2><p>Desde hoy la app te trata como mayor de edad: puedes invitar amigos con tu enlace y, si quieres, agregar tu WhatsApp en Yo → Editar mis&nbsp;datos.</p>`);
  }
  else if (r.error === 'sesion') cerrarSesion(true);
}
iniciar();
