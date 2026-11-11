/* Animación de entrada (11 nov 2026): el logo se dibuja en ~0,9 s y la pantalla se desvanece.
   Corre encima de la app mientras esta carga, así no agrega espera. Una sola vez por apertura
   (sessionStorage), nunca con «reducir movimiento», y se salta con un toque. Máximo 2,5 s pase lo que pase. */
(function () {
  var el = document.getElementById('splash');
  if (!el) return;
  var quitar = function () {
    if (!el.parentNode || el.classList.contains('fuera')) return;
    el.classList.add('fuera');
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 320);
  };
  var visto = false;
  try { visto = sessionStorage.getItem('rcf.splash') === '1'; sessionStorage.setItem('rcf.splash', '1'); } catch (e) {}
  var reducir = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (visto || reducir) { el.parentNode.removeChild(el); return; }

  var v = el.querySelector('video');
  v.src = window.innerWidth >= 700 ? 'vid/inicio-tablet.mp4' : 'vid/inicio-telefono.mp4';
  v.addEventListener('ended', quitar);
  v.addEventListener('error', quitar);
  el.addEventListener('click', quitar);
  var p = v.play();
  if (p && p.catch) p.catch(quitar);              // iPhone en ahorro de energía no deja reproducir: se quita y listo
  setTimeout(function () { if (v.paused || v.readyState < 2) quitar(); }, 900);   // si a los 0,9 s no arrancó, no hacer esperar
  setTimeout(quitar, 2500);
})();
