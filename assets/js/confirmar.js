/* Reto Creativo Fest · confirma la autorización de un representante.
   El correo trae un botón a confirmar.html?c=CLAVE. Esta página pide el AÑO DE NACIMIENTO del menor (7 nov 2026)
   y luego le pide a la Apps Script que marque la autorización como confirmada (o que solo agregue el año, si ya estaba confirmada).
   El año lo da el representante: así la app pasa al menor a mayor de edad sola el día que cumple 18, sin que él pueda cambiarlo.
   Se hace sin cookies de Google (credentials: 'omit') para evitar el error de «varias cuentas abiertas». */
(function () {
  var caja = document.getElementById('confirmar-estado');
  if (!caja) return;
  function mostrar(titulo, texto) {
    caja.innerHTML = '<h1></h1><p></p><p><a href="index.html">Ir a retocreativofest.com</a></p>';
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

  var hoy = new Date().getFullYear(), opciones = '<option value="">Elige el año</option>';
  for (var y = hoy - 3; y >= hoy - 18; y--) opciones += '<option>' + y + '</option>';
  caja.innerHTML =
    '<h1>Confirma la autorización</h1>' +
    '<p>Antes de confirmar, dinos en qué año nació el menor. Lo usamos solo para que la app le quite las protecciones de menor el día que cumpla 18, sin que él o ella pueda cambiarlo. Nunca lo mostramos.</p>' +
    '<form id="conf-f" class="lform" novalidate style="display:grid;gap:14px;max-width:420px">' +
    '<label class="fl" for="conf-anio" style="display:grid;gap:6px;font-weight:700">Año de nacimiento del menor<select id="conf-anio" required>' + opciones + '</select></label>' +
    '<p id="conf-err" role="alert" style="color:#BE185D;font-weight:700;margin:0" hidden></p>' +
    '<button type="submit" class="btn" style="background:#AA57F7">CONFIRMAR LA AUTORIZACIÓN</button></form>';
  document.getElementById('conf-f').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var anio = document.getElementById('conf-anio').value, err = document.getElementById('conf-err');
    if (!anio) { err.textContent = 'Elige el año de nacimiento del menor.'; err.hidden = false; return; }
    var b = ev.target.querySelector('button'); b.disabled = true; b.textContent = 'Confirmando…';
    fetch(base + '?formato=json&confirmar=' + encodeURIComponent(clave) + '&anio=' + encodeURIComponent(anio), { credentials: 'omit', cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.ok) mostrar('¡Gracias!', 'La autorización quedó confirmada. Ya puede participar por los premios del #RetoMenteMilenial.');
        else if (d && d.motivo === 'ocupado') mostrar('Intenta de nuevo', 'Hubo mucha actividad. Vuelve a tocar el botón del correo en un minuto.');
        else if (d && d.motivo === 'anio') { b.disabled = false; b.textContent = 'CONFIRMAR LA AUTORIZACIÓN'; err.textContent = 'Ese año no corresponde a un menor de 18. Revísalo.'; err.hidden = false; }
        else mostrar('Enlace no válido', 'No encontramos esta autorización. Escríbenos a retocreativofest@gmail.com.');
      })
      .catch(function () {
        mostrar('No pudimos confirmar', 'Revisa tu conexión y vuelve a tocar el botón del correo. Si sigue fallando, escríbenos a retocreativofest@gmail.com.');
      });
  });
})();
