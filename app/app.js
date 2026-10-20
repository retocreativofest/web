/* #RetoMenteMilenial · app (bloque 1: entrar, registro, edad y país, Hoy y Yo) */
const CONFIG = {
  api: 'https://script.google.com/macros/s/AKfycbz7iiWdZ0010hK6RzA7ue_bhtcc1WKcoP6n_zEM4pW_QX4Itfimn_A1wtxXtmu3VLVK/exec',
  padlet: 'https://padlet.com/retocreativofest/retomentemilenial-de-ilustracion-semanal-fase-i-3ra-temporad-s024nmvzl4iygc78wdeu',
  autorizacion: 'https://docs.google.com/forms/d/e/1FAIpQLSeTf_vZNjg5LU_mMs1X9tqmrgBddUGMDKuzvqV9U7NuXeXW7A/viewform',
  web: 'https://retocreativofest.com',
  whatsapp: '584120390423'   // para pedir correcciones
};

/* ---------- utilidades ---------- */
const $app = document.getElementById('app');
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const guardar = (k, v) => { try { v == null ? localStorage.removeItem('rcf.' + k) : localStorage.setItem('rcf.' + k, JSON.stringify(v)); } catch (e) {} };
const leer = k => { try { const v = localStorage.getItem('rcf.' + k); return v == null ? null : JSON.parse(v); } catch (e) { return null; } };
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
  chispa: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B0B0F" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/></svg>'
};

let toastT;
function aviso(texto) {
  const t = document.getElementById('toast');
  t.textContent = texto; t.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 3500);
}

async function api(accion, datos) {
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 25000);
  try {
    const r = await fetch(CONFIG.api, {
      method: 'POST', credentials: 'omit', signal: ctl.signal,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(Object.assign({ accion }, datos || {}))
    });
    return await r.json();
  } catch (e) {
    return { ok: false, error: 'red' };
  } finally {
    clearTimeout(t);
  }
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
  no_existe: 'No encontramos a nadie con ese usuario en la app. Pídele que se registre primero.',
  tu_mismo: 'Ese es tu propio usuario 😄',
  ya_amigos: 'Ya son amigos.',
  ya_enviada: 'Ya le mandaste una solicitud. Espera a que la acepte.',
  max_amigos: 'Llegaste al máximo de 50 amigos.',
  no_amigos: 'Solo puedes dar toques a tus amigos.',
  toque_hoy: 'Ya le diste un toque hoy. Mañana puedes darle otro.',
  sticker: 'Elige un sticker.'
};
const textoError = e => ERRORES[e] || ERRORES.servidor;

/* ---------- estado ---------- */
const E = {
  sesion: leer('sesion'), correo: leer('correo'), perfil: leer('perfil'),
  guia: leer('guia') || 'digi', borrador: {}, hoy: leer('hoy'), semana: leer('semana'), progreso: leer('progreso'), novedades: null, amigos: null, ranking: null, subida: {}, instalar: null
};
const imgGuia = g => 'img/' + (g === 'tradi' ? 'tradi' : 'digi') + '.webp';
const caraGuia = g => 'img/' + (g === 'tradi' ? 'tradi' : 'digi') + '-cara.webp';
const nombreCorto = () => (E.perfil && E.perfil.nombre ? E.perfil.nombre.split(' ')[0] : '');

function pintar(html, alPintar) {
  $app.innerHTML = html;
  window.scrollTo(0, 0);
  const h = $app.querySelector('h1, h2');
  if (h) h.setAttribute('tabindex', '-1');
  if (alPintar) alPintar($app);
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
    const { googleIdToken } = await import('./google.js?v=1');
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
      <img class="cara" src="${caraGuia(E.guia)}" alt="">
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
  const b = E.borrador;
  pintar(`
    <header class="barra">
      <div style="flex:1"><h1>Tu cuenta</h1><span class="sub">Así te verán en el Padlet</span></div>
      <img class="cara" src="${caraGuia(E.guia)}" alt="">
    </header>
    <form class="cont" id="f" novalidate>
      ${E.correo ? `<div class="caja agua" style="display:flex;align-items:center;gap:8px"><span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis">✓ ${esc(E.correo)}</span><button type="button" class="enlace" id="salir" style="min-height:0;padding:0 4px;font-size:12px">Cambiar</button></div>` : ''}
      <label class="campo" for="nom">Nombre y apellido
        <input id="nom" type="text" autocomplete="name" maxlength="60" value="${esc(b.nombre || '')}" required>
        <span class="ayuda">Si eres menor de edad, solo mostraremos tu nombre de pila.</span>
      </label>
      <label class="campo" for="usr">Tu usuario en redes
        <input id="usr" type="text" autocapitalize="none" autocomplete="username" spellcheck="false" maxlength="31" value="${b.usuario ? '@' + esc(b.usuario) : ''}" placeholder="@tu.usuario" required>
        <span class="ayuda">El de Instagram o TikTok. Con él te encuentran tus amigos y se cuentan tus puntos.</span>
      </label>
      <div class="muestra" aria-hidden="true"><i></i><span><b id="prev">Nombre · @usuario</b><small>Así se verá el título en el Padlet</small></span></div>
      ${error ? `<div class="error" role="alert">${esc(error)}</div>` : ''}
      <span class="pasos" aria-label="Paso 1 de 2"><i class="on"></i><i></i></span>
      <button type="submit" class="btn">SIGUIENTE</button>
    </form>`, root => {
    const nom = root.querySelector('#nom'), usr = root.querySelector('#usr'), prev = root.querySelector('#prev');
    const norm = u => u.trim().replace(/^@+/, '').toLowerCase();
    const act = () => { prev.textContent = (nom.value.trim().split(' ')[0] || 'Nombre') + ' · @' + (norm(usr.value) || 'usuario'); };
    nom.addEventListener('input', act); usr.addEventListener('input', act); act();
    on('#salir', 'click', cerrarSesion);
    on('#f', 'submit', ev => {
      ev.preventDefault();
      const nombre = nom.value.trim().replace(/\s+/g, ' '), usuario = norm(usr.value);
      E.borrador.nombre = nombre; E.borrador.usuario = usuario;
      if (nombre.length < 2) return vistaPerfil(ERRORES.nombre);
      if (!/^[a-z0-9._]{3,30}$/.test(usuario)) return vistaPerfil(ERRORES.usuario_invalido);
      vistaEdad();
    });
  });
}

/* ---------- registro: edad y país ---------- */
function vistaEdad(error) {
  const b = E.borrador;
  const p = E.perfil || {};
  if (b.mayor == null && p.mayor) { b.mayor = p.mayor; b.venezuela = p.venezuela; b.whatsapp = p.whatsapp; b.ofertas = p.ofertas; }
  const mayor = b.mayor === 'Sí', menor = b.mayor === 'No', vzla = b.venezuela === 'Sí', fuera = b.venezuela === 'No';
  const tel = String(b.whatsapp || '').replace(/^\+58/, '');
  const msj = encodeURIComponent('Hola. Quiero participar en el #RetoMenteMilenial, un reto semanal de dibujo, y como soy menor de edad necesito tu autorización. Es este formulario: ' + CONFIG.autorizacion);
  pintar(`
    <header class="barra">
      <button type="button" class="volver" id="v" aria-label="Volver">${ICO.volver}</button>
      <div style="flex:1"><h1>Edad y país</h1><span class="sub">Para aplicar las bases del reto</span></div>
      <img class="cara" src="${caraGuia(E.guia)}" alt="">
    </header>
    <div class="cont">
      <fieldset><legend>¿Tienes 18 años o más?</legend>
        <div class="par"><button type="button" class="opcion" data-k="mayor" data-v="Sí" aria-pressed="${mayor}">Sí</button><button type="button" class="opcion" data-k="mayor" data-v="No" aria-pressed="${menor}">No, soy menor</button></div>
      </fieldset>
      <fieldset><legend>¿Vives en Venezuela?</legend>
        <div class="par"><button type="button" class="opcion" data-k="venezuela" data-v="Sí" aria-pressed="${vzla}">Sí</button><button type="button" class="opcion" data-k="venezuela" data-v="No" aria-pressed="${fuera}">No, vivo afuera</button></div>
      </fieldset>
      ${fuera ? `<div class="caja rosa" role="note"><strong class="t">Vives fuera de Venezuela</strong>Puedes participar, subir tus dibujos y tener racha con tus amigos. Pero tus puntos no cuentan para el ranking global ni para los premios: son para personas que viven en Venezuela.</div>` : ''}
      ${vzla ? `<div class="caja agua">Vives en Venezuela: compites en el ranking global y por los premios.</div>` : ''}
      ${menor ? `<div class="caja crema"><strong class="t">Tu representante tiene que autorizarte</strong>
          <span style="display:block;font-weight:600;margin-bottom:8px">Mándale este formulario. Cuando lo llene y confirme el correo que le llega, puedes ganar premios y quedar entre las finalistas. Mientras tanto, igual puedes participar.</span>
          <a class="btn turquesa chico" href="https://wa.me/?text=${msj}" target="_blank" rel="noopener">📲 MANDAR EL FORMULARIO POR WHATSAPP</a></div>` : ''}
      ${mayor ? `
        <label class="campo" for="tel">WhatsApp <span class="ayuda">(opcional)</span>
          <span class="tel">${vzla || !fuera ? '<span>+58</span>' : ''}<input id="tel" type="tel" inputmode="tel" autocomplete="tel" value="${esc(vzla || !fuera ? tel : b.whatsapp || '')}" placeholder="${fuera ? '+1 555 123 4567' : '412 123 4567'}"></span>
        </label>
        <label class="check" for="ofe"><input id="ofe" type="checkbox" ${b.ofertas === 'Sí' ? 'checked' : ''}><span>Quiero recibir ofertas y descuentos del Reto Creativo Fest por correo y WhatsApp. <span style="font-weight:600;color:var(--muted)">Puedes darte de baja cuando quieras.</span></span></label>` : ''}
      ${error ? `<div class="error" role="alert">${esc(error)}</div>` : ''}
      <span class="nota izq">Nunca mostramos tu edad, tu país ni tu contacto en la app. Para entregar premios verificamos la edad y el país en persona.</span>
      <span class="pasos" aria-label="Paso 2 de 2"><i></i><i class="on"></i></span>
      <button type="button" class="btn" id="ok">EMPEZAR</button>
    </div>`, root => {
    const leerCampos = () => {
      const t = root.querySelector('#tel'), o = root.querySelector('#ofe');
      if (t) b.whatsapp = (b.venezuela === 'No' ? '' : '+58') + t.value.trim();
      if (o) b.ofertas = o.checked ? 'Sí' : 'No';
    };
    root.querySelectorAll('[data-k]').forEach(btn => btn.addEventListener('click', () => { leerCampos(); b[btn.dataset.k] = btn.dataset.v; vistaEdad(); }));
    on('#v', 'click', () => { leerCampos(); vistaPerfil(); });
    on('#ok', 'click', async ev => {
      leerCampos();
      if (!b.mayor || !b.venezuela) return vistaEdad(ERRORES.edad);
      ev.currentTarget.disabled = true; ev.currentTarget.textContent = 'Guardando…';
      const r = await api('perfil_guardar', {
        sesion: E.sesion, correo: E.correo, nombre: b.nombre, usuario: b.usuario,
        mayor: b.mayor, venezuela: b.venezuela, whatsapp: b.mayor === 'Sí' ? b.whatsapp : '', ofertas: b.mayor === 'Sí' ? b.ofertas : 'No'
      });
      if (!r.ok) {
        if (r.error === 'sesion') return cerrarSesion(true);
        if (/^usuario|nombre/.test(r.error)) return vistaPerfil(textoError(r.error));
        return vistaEdad(textoError(r.error));
      }
      E.perfil = r.perfil; guardar('perfil', E.perfil); E.borrador = {};
      aviso('¡Listo! Bienvenid@ al #RetoMenteMilenial');
      ir('hoy');
    });
  });
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
  });
}
function cabecera(titulo) {
  const ini = esc((nombreCorto() || '?').charAt(0).toUpperCase());
  const pr = E.progreso, racha = pr ? pr.racha : 0;
  const fuego = pr ? `<span class="racha ${pr.enRiesgo ? 'riesgo' : ''}" aria-label="Racha de ${racha} ${racha === 1 ? 'semana' : 'semanas'}">🔥 ${racha}</span>` : '';
  return `<header class="top"><button type="button" class="avatar" data-ir="yo" aria-label="Mi perfil">${ini}</button><h1>${esc(titulo)}</h1><span class="top-der">${fuego}<a class="redondo" href="${CONFIG.web}/preguntas-frecuentes.html" target="_blank" rel="noopener" aria-label="Preguntas frecuentes">?</a></span></header>`;
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
  const r = await api('hoy');
  if (!r.ok) { if (!E.hoy) dibujarHoy(null, textoError(r.error)); return; }
  E.hoy = r; guardar('hoy', r);   // la próxima vez se muestra al instante
  desfase = new Date(r.ahora) - Date.now();
  if (estaEn === 'hoy') dibujarHoy(r);
  const m = await api('mi_semana', { sesion: E.sesion });
  if (m.ok) {
    if (r.actual) { E.semana = { id: semanaId(r.actual), subido: !!m.subido, padlet: m.padlet || '' }; guardar('semana', E.semana); }
    if (m.progreso) { E.progreso = m.progreso; guardar('progreso', E.progreso); }
    E.novedades = m.novedades || null;
    if (estaEn === 'hoy') {
      dibujarHoy(E.hoy);
      if (toqueNuevo()) api('toques_vistos', { sesion: E.sesion });   // se muestra una vez; luego desaparece
    }
  } else if (m.error === 'sesion') cerrarSesion(true);
}
const STICKERS = [['img/sticker-1.webp', '¡Tú puedes!'], ['img/sticker-2.webp', '¡Qué dibujo!'], ['img/sticker-3.webp', '¡No la pierdas!']];
const toqueNuevo = () => E.novedades && E.novedades.toques && E.novedades.toques.length ? E.novedades.toques[E.novedades.toques.length - 1] : null;
function burbujaHoy(nom, a) {
  const pr = E.progreso, hola = '¡Hola' + (nom ? ', ' + nom : '') + '! ', tq = toqueNuevo();
  if (tq) return hola + `👋 <b>${esc(tq.nombre)}</b> te dio un toque: «${esc((STICKERS[tq.sticker] || STICKERS[0])[1])}».${a ? ' El reto cierra en <b>' + cuantoFalta(a.cierre) + '</b>.' : ''}`;
  if (yaSubio()) return hola + (pr && pr.racha > 1 ? `🔥 Tu racha va en <b>${pr.racha} semanas</b>. ¡Sigue así!` : '🎉 Ya subiste tu dibujo de esta semana.');
  if (pr && pr.enRiesgo) return hola + `😱 Tu racha de <b>${pr.racha} ${pr.racha === 1 ? 'semana' : 'semanas'}</b> está en riesgo. El reto cierra en <b>${cuantoFalta(a.cierre)}</b>.`;
  return hola + `👋 El reto cierra en <b>${cuantoFalta(a.cierre)}</b>.`;
}
const semanaId = a => a.temporada + '|' + a.semana;
const yaSubio = () => !!(E.hoy && E.hoy.actual && E.semana && E.semana.id === semanaId(E.hoy.actual) && E.semana.subido);

function dibujarHoy(h, error) {
  const nom = esc(nombreCorto());
  let cuerpo;
  if (!h) {
    cuerpo = error
      ? `<div class="error" role="alert">${esc(error)}</div><button type="button" class="btn blanco" id="re">Intentar otra vez</button>`
      : '<div class="cargando" role="status"><span class="spin" aria-hidden="true"></span>Buscando el reto de la semana…</div>';
  } else if (h.actual) {
    const a = h.actual, total = h.total || 1, pct = Math.max(4, Math.round((a.semana + 1) / total * 100));
    const premio = a.temporada === 'Fase II' ? 'diciembre' : 'julio';
    cuerpo = `
      ${h.prueba ? '<div class="prueba">MODO PRUEBA · las fechas son de ejemplo</div>' : ''}
      <div class="progreso"><div class="t"><span>${esc(a.temporada)} · semana ${a.semana} de ${total - 1}</span><span>Premiación: ${premio}</span></div><div class="b"><i style="width:${pct}%"></i></div></div>
      <div class="saludo">${toqueNuevo() ? `<img src="${(STICKERS[toqueNuevo().sticker] || STICKERS[0])[0]}" alt="Sticker de ${esc(toqueNuevo().nombre)}" width="112" height="112">` : `<img src="${imgGuia(E.guia)}" alt="${E.guia === 'tradi' ? 'Tradi' : 'Digi'} dibujando" width="112" height="108">`}<div class="burbuja">${burbujaHoy(nom, a)}</div></div>
      <section class="reto" aria-labelledby="reto-h">
        <span class="pill">Reto de la semana ${a.semana}</span>
        <h2 id="reto-h">${esc(a.tema || 'Reto de la semana')}</h2>
        ${a.descripcion ? `<p>${esc(a.descripcion)}</p>` : ''}
        <div class="tiempo"><span id="cd">${cuenta(a.cierre)}</span><span>Cierra el ${fecha(a.cierre)}, ${hora(a.cierre)}</span></div>
        ${yaSubio()
          ? `<div class="caja" style="text-align:center;background:var(--white)">✓ Ya subiste tu dibujo de esta semana</div>${botonesCompartir(E.semana.padlet || CONFIG.padlet)}`
          : '<button type="button" class="btn amarillo" id="subir">SUBIR MI DIBUJO</button>'}
      </section>`;
  } else {
    const p = h.proximo;
    cuerpo = `
      <div class="saludo"><img src="${imgGuia(E.guia)}" alt="" width="112" height="108"><div class="burbuja">¡Hola${nom ? ', ' + nom : ''}! 👋 ${p ? 'Ya casi empieza el próximo reto.' : 'Por ahora no hay retos abiertos.'}</div></div>
      <section class="reto espera" aria-labelledby="reto-h">
        <span class="pill">${p ? esc(p.temporada) + ' · semana ' + p.semana : 'En pausa'}</span>
        <h2 id="reto-h">${p ? 'El reto se revela el ' + fecha(p.publica) : 'Nos vemos en la próxima temporada'}</h2>
        ${p ? `<div class="tiempo"><span id="cd">${cuenta(p.publica)}</span><span>a las ${hora(p.publica)}</span></div>` : ''}
        <p>Mientras tanto, revisa los dibujos de la comunidad en el Padlet.</p>
        <a class="btn blanco chico" href="${CONFIG.padlet}" target="_blank" rel="noopener">VER EL PADLET</a>
      </section>`;
  }
  conNav('hoy', cabecera('Hoy') + `<main class="cont con-nav">${cuerpo}
      <section class="prox" aria-label="Chispa del día"><span class="ico">${ICO.chispa}</span><div style="flex:1;min-width:0"><h3>Chispa del día</h3><span>Un mini reto de 3 minutos</span></div><span class="tag">Muy pronto</span></section>
    </main>`, root => {
    on('#re', 'click', vistaHoy);
    on('#subir', 'click', () => ir('subir'));
    activarCompartir(root);
    const cd = root.querySelector('#cd');
    if (cd && h) {
      const fin = h.actual ? h.actual.cierre : h.proximo && h.proximo.publica;
      reloj = setInterval(() => { if (new Date(fin) <= ahora()) { clearInterval(reloj); vistaHoy(); } else cd.textContent = cuenta(fin); }, 30000);
    }
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
  try { await navigator.share({ text: mensajeCompartir(url) }); } catch (e) { if (e && e.name !== 'AbortError') copiarEnlace(url); }
}
const botonesCompartir = url => `
  <button type="button" class="btn amarillo" data-copiar="${esc(url)}">📋 COPIAR MI ENLACE</button>
  ${navigator.share ? `<button type="button" class="btn turquesa chico" data-compartir="${esc(url)}">📲 Compartir por WhatsApp o redes</button>` : ''}
  <a class="enlace" style="text-align:center" href="${esc(url)}" target="_blank" rel="noopener">Ver mi dibujo en el Padlet ↗</a>`;
function activarCompartir(root) {
  root.querySelectorAll('[data-copiar]').forEach(b => b.addEventListener('click', () => copiarEnlace(b.dataset.copiar)));
  root.querySelectorAll('[data-compartir]').forEach(b => b.addEventListener('click', () => compartirEnlace(b.dataset.compartir)));
}

/* ---------- subir el dibujo ---------- */
async function comprimir(archivo) {
  if (!archivo || !/^image\//.test(archivo.type || 'image/')) throw new Error('imagen');
  if (archivo.size > 40 * 1024 * 1024) throw new Error('imagen');
  const url = URL.createObjectURL(archivo);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const max = 2048, esc_ = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth * esc_); c.height = Math.round(img.naturalHeight * esc_);
    const x = c.getContext('2d');
    x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, c.width, c.height);   // fondo blanco para PNG transparentes
    x.drawImage(img, 0, 0, c.width, c.height);
    let calidad = 0.86, blob;
    do {
      blob = await new Promise(ok => c.toBlob(ok, 'image/jpeg', calidad));
      calidad -= 0.12;
    } while (blob && blob.size > 3.5 * 1024 * 1024 && calidad > 0.4);
    if (!blob) throw new Error('imagen');
    const datos = await new Promise((ok, mal) => { const fr = new FileReader(); fr.onload = () => ok(fr.result); fr.onerror = mal; fr.readAsDataURL(blob); });
    return { base64: String(datos).split(',')[1], vista: URL.createObjectURL(blob), ancho: c.width, alto: c.height };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function vistaSubir(error) {
  const h = E.hoy, a = h && h.actual;
  if (!a) return ir('hoy');
  const S = E.subida, p = E.perfil || {};
  if (S.id !== semanaId(a)) { Object.keys(S).forEach(k => delete S[k]); S.id = semanaId(a); S.tecnica = E.guia === 'tradi' ? 'Tradicional' : ''; }
  const titulo = (p.nombre || '').split(' ')[0] + ' · @' + (p.usuario || '');
  pintar(`
    <header class="barra">
      <button type="button" class="volver" id="v" aria-label="Volver">${ICO.volver}</button>
      <div style="flex:1;min-width:0"><h1>Subir mi dibujo</h1><span class="sub">Semana ${a.semana} · ${esc(a.tema)}</span></div>
      <img class="cara" src="${caraGuia(E.guia)}" alt="">
    </header>
    <form class="cont" id="f" novalidate>
      ${h.prueba ? '<div class="prueba">MODO PRUEBA · se publica de verdad en el Padlet</div>' : ''}
      <label class="foto ${S.vista ? 'lista' : ''}" for="archivo">
        ${S.vista ? `<img src="${S.vista}" alt="Vista previa de tu dibujo">` : `<span class="foto-ico" aria-hidden="true">📷</span><b>Toca para elegir la foto de tu dibujo</b><small>Desde tu galería o con la cámara</small>`}
        <input id="archivo" type="file" accept="image/*">
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
      catch (e) { S.base64 = S.vista = null; vistaSubir(ERRORES.imagen); }
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
      const r = await api('subir', { sesion: E.sesion, imagen: S.base64, tecnica: S.tecnica, descripcion: S.descripcion.trim(), propio: true });
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

function vistaCelebracion(r) {
  pintar(`
    <div class="cont" style="justify-content:center;text-align:center;align-items:center">
      <img src="${imgGuia(E.guia)}" alt="" width="170" height="164" style="animation:bob 2.6s ease-in-out infinite">
      <h1 style="margin:0;font-family:var(--display);font-size:28px">¡Dibujo publicado! 🎉</h1>
      <p style="margin:0;font-size:16px;line-height:1.45">Ya está en el Padlet, en la sección <b>Semana ${r.semana}</b>, con el título <b>${esc(r.titulo)}</b>.</p>
      <div class="caja agua" style="text-align:left">Manda el enlace a tus amigos para que te den me gusta. Los 5 dibujos con más me gusta van a la votación del canal de WhatsApp.</div>
      ${botonesCompartir(r.padlet || CONFIG.padlet)}
      <button type="button" class="btn blanco chico" id="hoy">Volver a Hoy</button>
    </div>`, root => { activarCompartir(root); on('#hoy', 'click', () => ir('hoy')); });
}

async function vistaRanking() {
  dibujarRanking(E.ranking);
  const r = await api('ranking', { sesion: E.sesion });
  if (r.ok) { E.ranking = r; if (estaEn === 'ranking') dibujarRanking(r); }
  else if (r.error === 'sesion') cerrarSesion(true);
  else if (!E.ranking && estaEn === 'ranking') dibujarRanking(null, textoError(r.error));
}

function dibujarRanking(r, error) {
  let cuerpo;
  if (!r) cuerpo = error ? `<div class="error" role="alert">${esc(error)}</div>` : '<div class="cargando" role="status"><span class="spin" aria-hidden="true"></span>Buscando los puntajes…</div>';
  else {
    const mios = r.mios && r.mios.length
      ? `<div class="caja crema"><strong class="t">¡Estás en la tabla! 🎉</strong>${r.mios.map(m => esc(m.estado) + ' en <b>' + esc(m.categoria) + '</b> (' + esc(m.valor) + ')').join('<br>')}</div>`
      : `<div class="caja agua">Todavía no apareces entre los primeros. Cada semana que subes tu dibujo suma para la constancia, y los me gusta suman para las demás categorías.</div>`;
    cuerpo = `${r.lead ? `<p class="nota izq" style="margin:0">${esc(r.lead)}</p>` : ''}${mios}
      ${r.cats.map(c => `<section class="cat-app"><h2>${esc(c.nombre)}</h2>${c.def ? `<p>${esc(c.def)}</p>` : ''}<ol>${c.items.map(it =>
        `<li class="${it.yo ? 'yo' : ''} ${it.estado === 'Va ganando' ? 'gana' : ''}"><span><b>${esc(it.nombre)}${it.yo ? ' (tú)' : ''}</b>${it.red ? `<small>${esc(it.red)}</small>` : ''}</span><em>${esc(it.valor)}</em></li>`).join('')}</ol></section>`).join('')}
      ${r.legal ? `<p class="nota izq">${esc(r.legal)}</p>` : ''}
      <a class="btn blanco chico" href="${CONFIG.web}/reto-semanal.html" target="_blank" rel="noopener">Ver la tabla completa en la web</a>`;
  }
  conNav('ranking', cabecera('Ranking') + `<main class="cont con-nav">${cuerpo}</main>`);
}

/* ---------- Amigos ---------- */
async function vistaAmigos(mensaje) {
  dibujarAmigos(E.amigos, mensaje);
  const r = await api('amigos', { sesion: E.sesion });
  if (r.ok) {
    E.amigos = r;
    if (E.novedades) E.novedades.solicitudes = r.solicitudes.length;
    if (estaEn === 'amigos') dibujarAmigos(r, mensaje);
  } else if (r.error === 'sesion') cerrarSesion(true);
  else if (!E.amigos && estaEn === 'amigos') dibujarAmigos(null, null, textoError(r.error));
}

function dibujarAmigos(d, mensaje, error) {
  const inicial = n => esc((n || '?').charAt(0).toUpperCase());
  let cuerpo = `
    <form class="agregar" id="fa" novalidate>
      <label class="campo" for="nu">Agrega a un amigo por su usuario
        <span class="fila-ag"><input id="nu" type="text" autocapitalize="none" spellcheck="false" placeholder="@usuario" maxlength="31"><button type="submit" class="btn amarillo chico" style="width:auto;padding:8px 16px">AGREGAR</button></span>
      </label>
    </form>
    ${mensaje ? `<div class="caja agua" role="status">${esc(mensaje)}</div>` : ''}
    ${error ? `<div class="error" role="alert">${esc(error)}</div>` : ''}`;
  if (!d) cuerpo += '<div class="cargando" role="status"><span class="spin" aria-hidden="true"></span>Buscando a tus amigos…</div>';
  else {
    if (d.solicitudes.length) cuerpo += `<h2 class="sub-t">Te quieren agregar</h2>` + d.solicitudes.map(x => `
      <div class="amigo"><span class="avatar">${inicial(x.nombre)}</span><div class="info"><b>${esc(x.nombre)}</b><small>@${esc(x.usuario)}</small></div>
        <button type="button" class="btn turquesa chico mini" data-aceptar="${esc(x.usuario)}">Aceptar</button><button type="button" class="enlace mini" data-rechazar="${esc(x.usuario)}">No</button></div>`).join('');
    cuerpo += `<h2 class="sub-t">Tus amigos${d.amigos.length ? ' (' + d.amigos.length + ')' : ''}</h2>`;
    cuerpo += d.amigos.length ? d.amigos.map(x => `
      <div class="amigo"><span class="avatar">${inicial(x.nombre)}</span>
        <div class="info"><b>${esc(x.nombre)}</b><small>@${esc(x.usuario)}</small>
          <span class="chips"><span class="chip fuego">🔥 ${x.rachaJuntos} ${x.rachaJuntos === 1 ? 'semana' : 'semanas'} juntos</span>${d.semanaAbierta ? `<span class="chip ${x.subio ? 'ok' : ''}">${x.subio ? '✓ Ya subió' : '⏳ Aún no sube'}</span>` : ''}</span></div>
        <button type="button" class="btn ${x.toqueHoy ? 'blanco' : 'amarillo'} chico mini" data-toque="${esc(x.usuario)}" data-nombre="${esc(x.nombre)}" ${x.toqueHoy ? 'disabled' : ''}>${x.toqueHoy ? 'Toque ✓' : '👆 Toque'}</button></div>`).join('')
      : `<div class="caja">Todavía no tienes amigos en la app. Agrégalos con el usuario que usan en el reto (el de Instagram o TikTok). Cuando los dos suben su dibujo la misma semana, crece su racha juntos 🔥</div>`;
    if (d.enviadas.length) cuerpo += `<p class="nota izq">Esperando respuesta: ${d.enviadas.map(x => '@' + esc(x.usuario)).join(', ')}</p>`;
    cuerpo += `<p class="nota">Los toques son stickers dentro de la app: sin chat. Uno por amigo al día.</p>`;
  }
  conNav('amigos', cabecera('Amigos') + `<main class="cont con-nav">${cuerpo}</main>`, root => {
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
  });
}

function ventanaToque(usuario, nombre) {
  let elegido = 2;
  ventana(`
    <h2 id="v-h" tabindex="-1">Dale un toque a ${esc(nombre)}</h2>
    <p style="font-size:14px">Le aparecerá en su app con el sticker que elijas.</p>
    <div class="stickers">${STICKERS.map((st, i) => `<button type="button" class="sticker" data-st="${i}" aria-pressed="${i === elegido}"><img src="${st[0]}" alt="" width="80" height="80"><span>${esc(st[1])}</span></button>`).join('')}</div>
    <button type="button" class="btn amarillo" id="dar">DAR TOQUE</button>
    <button type="button" class="enlace" id="quitar" style="font-size:12px;color:var(--muted)">Quitar a @${esc(usuario)} de mis amigos</button>`, (v, cerrar) => {
    v.querySelectorAll('[data-st]').forEach(b => b.addEventListener('click', () => { elegido = +b.dataset.st; v.querySelectorAll('[data-st]').forEach(x => x.setAttribute('aria-pressed', String(+x.dataset.st === elegido))); }));
    v.querySelector('#dar').addEventListener('click', async ev => {
      ev.currentTarget.disabled = true; ev.currentTarget.textContent = 'Enviando…';
      const r = await api('toque', { sesion: E.sesion, usuario, sticker: elegido });
      cerrar();
      if (r.ok) { aviso('¡Toque enviado a ' + nombre + '!'); vistaAmigos(); } else aviso(textoError(r.error));
    });
    v.querySelector('#quitar').addEventListener('click', async () => { cerrar(); await api('amigo_responder', { sesion: E.sesion, usuario, accionAmigo: 'quitar' }); vistaAmigos(); });
  });
}

function vistaPronto(cual) {
  const T = {
    ranking: ['Ranking', 'Tu posición en cada categoría, tus puntos y las estrellas del Club.'],
    amigos: ['Amigos', 'Agrega a tus amigos por su usuario, cuiden su racha juntos y mándense toques con stickers.']
  }[cual];
  conNav(cual, cabecera(T[0]) + `<main class="cont con-nav"><div class="pronto"><img src="${imgGuia(E.guia)}" alt="" width="150" height="145"><h2>Muy pronto</h2><p>${esc(T[1])}</p></div></main>`);
}

/* ---------- Yo ---------- */
function progresoHtml() {
  const pr = E.progreso;
  if (!pr) return '';
  const punto = w => `<span class="dia ${w.estado}" title="${esc(w.temporada)} · semana ${w.semana}"><i></i>${w.semana}</span>`;
  return `<section class="progreso-yo" aria-label="Tu progreso">
    <div class="stats"><div><b>🔥 ${pr.racha}</b><span>racha actual</span></div><div><b>${pr.mejor}</b><span>mejor racha</span></div><div><b>${pr.semanas}</b><span>semanas con dibujo</span></div></div>
    ${pr.historial.length ? `<div class="hist" aria-label="Últimas semanas">${pr.historial.map(punto).join('')}</div>` : '<p class="nota" style="margin:0">Tu racha empieza con tu primer dibujo de la temporada.</p>'}
  </section>`;
}
function vistaYo() {
  const p = E.perfil || {}, ini = esc((nombreCorto() || '?').charAt(0).toUpperCase());
  const esIOS = /iphone|ipad|ipod/i.test(navigator.userAgent), instalada = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  conNav('yo', cabecera('Yo') + `<main class="cont con-nav">
      <div class="perfil"><span class="avatar">${ini}</span><div style="min-width:0"><h2>${esc(p.nombre || '')}</h2><span>@${esc(p.usuario || '')}</span></div></div>
      ${progresoHtml()}
      <div class="lista">
        ${p.correo ? `<div><span>Correo</span><span>${esc(p.correo)}</span></div>` : ''}
        <div><span>Edad</span><span>${p.mayor === 'Sí' ? '18 años o más' : 'Menor de edad'}</span></div>
        <div><span>Vives en Venezuela</span><span>${p.venezuela === 'Sí' ? 'Sí' : 'No'}</span></div>
        ${p.mayor === 'Sí' ? `<div><span>Ofertas</span><span>${p.ofertas === 'Sí' ? 'Sí' : 'No'}</span></div>` : ''}
      </div>
      <button type="button" class="btn blanco chico" id="editar">Editar mis datos</button>
      <div class="fila-t"><strong>Tu guía</strong><span>Te acompaña en la app</span></div>
      <div class="par">
        <button type="button" class="guia-btn" data-guia="digi" aria-pressed="${E.guia !== 'tradi'}"><strong>Digi</strong> <span>digital</span></button>
        <button type="button" class="guia-btn" data-guia="tradi" aria-pressed="${E.guia === 'tradi'}"><strong>Tradi</strong> <span>tradicional</span></button>
      </div>
      ${instalada ? '' : `<button type="button" class="btn amarillo chico" id="instalar">📲 Instalar la app en mi teléfono</button>`}
      <a class="btn blanco chico" href="${CONFIG.web}/preguntas-frecuentes.html" target="_blank" rel="noopener">Preguntas frecuentes</a>
      <button type="button" class="enlace" id="salir">Cerrar sesión</button>
      <span class="nota"><a href="${CONFIG.web}/bases.html#reto" target="_blank" rel="noopener">Bases del reto</a> · <a href="${CONFIG.web}/privacidad.html" target="_blank" rel="noopener">Privacidad</a></span>
    </main>`, root => {
    root.querySelectorAll('[data-guia]').forEach(b => b.addEventListener('click', () => { E.guia = b.dataset.guia; guardar('guia', E.guia); vistaYo(); }));
    on('#editar', 'click', () => { E.borrador = { nombre: p.nombre, usuario: p.usuario }; vistaPerfil(); });
    on('#salir', 'click', () => cerrarSesion());
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
  E.sesion = E.correo = E.perfil = E.hoy = E.semana = E.progreso = E.ranking = E.amigos = E.novedades = null; E.borrador = {}; E.subida = {};
  ['sesion', 'correo', 'perfil', 'hoy', 'semana', 'progreso'].forEach(k => guardar(k, null));
  if (s && vencida !== true) api('salir', { sesion: s });
  vistaBienvenida(vencida === true ? ERRORES.sesion : '');
}

/* ---------- navegación ---------- */
let estaEn = '';
function ir(donde) {
  if (!E.sesion) return vistaBienvenida();
  if (!E.perfil || !E.perfil.completo) { E.borrador = { nombre: (E.perfil || {}).nombre || '', usuario: (E.perfil || {}).usuario || '' }; return vistaPerfil(); }
  estaEn = donde;
  if (donde === 'subir') { if (E.hoy && E.hoy.actual && !yaSubio()) return vistaSubir(); if (yaSubio()) aviso(ERRORES.ya_subiste); estaEn = 'hoy'; donde = 'hoy'; }
  if (donde === 'hoy') return vistaHoy();
  if (donde === 'yo') return vistaYo();
  if (donde === 'ranking') return vistaRanking();
  if (donde === 'amigos') return vistaAmigos();
  return vistaPronto(donde);
}

async function iniciar() {
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); E.instalar = e; });
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  if (!E.sesion) return vistaBienvenida();
  ir('hoy');
  const r = await api('perfil', { sesion: E.sesion });   // refresca los datos guardados en el teléfono
  if (r.ok) { E.perfil = r.perfil; guardar('perfil', E.perfil); if (!r.perfil.completo) ir('hoy'); }
  else if (r.error === 'sesion') cerrarSesion(true);
}
iniciar();
