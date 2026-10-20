/* #RetoMenteMilenial · regreso desde Patreon: confirma la vinculación del Club Estrella.
   Esta página puede abrirse fuera de la app (en iPhone, en Safari), así que no usa la sesión:
   el Apps Script reconoce a la persona por el «state» de un solo uso que creó al empezar. */
(function () {
  var API = 'https://script.google.com/macros/s/AKfycbz7iiWdZ0010hK6RzA7ue_bhtcc1WKcoP6n_zEM4pW_QX4Itfimn_A1wtxXtmu3VLVK/exec';
  var $ = document.getElementById('estado');
  var q = new URLSearchParams(location.search);
  var code = q.get('code'), state = q.get('state'), negado = q.get('error');
  history.replaceState(null, '', location.pathname);   // el código no queda en el historial

  var VOLVER = '<a class="btn amarillo" href="./?ir=club">VOLVER A LA APP</a>' +
    '<span class="nota">Si instalaste la app en tu iPhone, cierra esta pestaña y ábrela desde su ícono. Tu Club ya aparece ahí.</span>';
  var ERRORES = {
    patreon_vencido: 'El enlace venció o ya se usó. Vuelve a la app y toca otra vez «Vincular mi Patreon».',
    patreon_usado: 'Ese Patreon ya está vinculado con otra cuenta de la app. Cada membresía es para una sola persona. Si es un error, escríbenos a retocreativofest@gmail.com.',
    patreon: 'Patreon no confirmó tu cuenta. Vuelve a la app e intenta otra vez.',
    ocupado: 'Hay mucha gente entrando. Espera un minuto y vuelve a intentarlo desde la app.',
    red: 'No hay conexión. Revisa tu internet y vuelve a intentarlo desde la app.'
  };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pintar(html) { $.innerHTML = html; }
  function error(clave) {
    pintar('<div class="error" role="alert">' + esc(ERRORES[clave] || 'Algo falló de nuestro lado. Intenta en un minuto desde la app.') + '</div>' + VOLVER);
  }
  function fecha(iso) {
    var M = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    var p = String(iso || '').split('-'); return p.length === 3 ? Number(p[2]) + ' de ' + M[Number(p[1]) - 1] : '';
  }

  if (negado) {
    pintar('<div class="caja crema">No se vinculó tu Patreon porque no lo autorizaste. Puedes hacerlo cuando quieras desde la app, en Club Estrella.</div>' + VOLVER);
    return;
  }
  if (!code || !state) { error('patreon_vencido'); return; }

  var ctl = new AbortController(), t = setTimeout(function () { ctl.abort(); }, 30000);
  fetch(API, {
    method: 'POST', credentials: 'omit', signal: ctl.signal,
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ accion: 'patreon_vincular', code: code, state: state })
  }).then(function (r) { return r.json(); }).then(function (r) {
    clearTimeout(t);
    if (!r.ok) { error(r.error); return; }
    var c = r.club || {};
    try { localStorage.setItem('rcf.club', JSON.stringify(c)); } catch (e) {}
    if (c.activo) {
      pintar('<div class="club-yo"><img src="img/estrella-' + (Number(c.estrella) || 1) + '.webp" alt="" width="54" height="54"><div>' +
        '<b>✓ ¡Listo! Tu Club Estrella está activo</b><span>Hasta el ' + esc(fecha(c.hasta)) + ' · llevas ' + esc(c.meses) + ' ' + (c.meses === 1 ? 'mes' : 'meses') + '</span></div></div>' + VOLVER);
    } else {
      pintar('<div class="caja crema"><strong class="t">Tu Patreon quedó vinculado</strong>' +
        'Pero todavía no vemos una membresía activa del Club Estrella. Si acabas de unirte, Patreon puede tardar unos minutos: ' +
        'vuelve a la app y toca «Revisar mi membresía».</div>' + VOLVER);
    }
  }).catch(function () { clearTimeout(t); error('red'); });
})();
