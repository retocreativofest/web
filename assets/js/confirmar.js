/* Reto Creativo Fest · confirma la autorización de un representante.
   El correo trae un botón a confirmar.html?c=CLAVE. Esta página le pide a la Apps Script que la marque como confirmada.
   Se hace sin cookies de Google (credentials: 'omit') para evitar el error de «varias cuentas abiertas». */
(function () {
  var caja = document.getElementById('confirmar-estado');
  if (!caja) return;
  function mostrar(titulo, texto) {
    caja.querySelector('h1').textContent = titulo;
    caja.querySelector('p').textContent = texto;
  }
  var clave = new URLSearchParams(location.search).get('c') || '';
  if (!/^[0-9a-f-]{36}$/i.test(clave)) {
    mostrar('Enlace no válido', 'Abre el botón del correo otra vez. Si sigue fallando, escríbenos a retocreativofest@gmail.com.');
    return;
  }
  var base = (typeof CONFIG !== 'undefined' && CONFIG.formularios) || '';
  if (!base) { mostrar('Intenta más tarde', 'No pudimos conectar. Escríbenos a retocreativofest@gmail.com.'); return; }
  fetch(base + '?formato=json&confirmar=' + encodeURIComponent(clave), { credentials: 'omit', cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (d && d.ok) mostrar('¡Gracias!', 'La autorización quedó confirmada. Ya puede participar por los premios del #RetoMenteMilenial.');
      else if (d && d.motivo === 'ocupado') mostrar('Intenta de nuevo', 'Hubo mucha actividad. Vuelve a tocar el botón del correo en un minuto.');
      else mostrar('Enlace no válido', 'No encontramos esta autorización. Escríbenos a retocreativofest@gmail.com.');
    })
    .catch(function () {
      mostrar('No pudimos confirmar', 'Revisa tu conexión y vuelve a tocar el botón del correo. Si sigue fallando, escríbenos a retocreativofest@gmail.com.');
    });
})();
