/* Mi recorrido creativo · 12 nov 2026 (pedido de Stefany)
   Resumen de la fase (Fase I o Fase II) que se pasa tocando, como las historias, y termina en una tarjeta para compartir.
   Los datos los calcula el servidor una vez por semana (archivo «recorrido» del Apps Script); aquí solo se dibujan.
   Nunca muestra votos recibidos (voto secreto) ni nada que revele la edad. */

const NEGRO = '#0B0B0F', AMARILLO = '#FFD60A', ROSADO = '#F0479B', CIAN = '#84D7DF', VIOLETA = '#6B3FA0', LILA = '#EFE4F7';
const IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const LOGO = new Image(); LOGO.src = 'img/icon-lila-192.png';

const destello = (x, y, r, color) => {
  const p = [];
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, rr = i % 2 ? r * .34 : r; p.push((50 + rr * Math.cos(a)).toFixed(1) + ',' + (50 + rr * Math.sin(a)).toFixed(1)); }
  return `<svg class="rc-dz" style="left:${x}%;top:${y}%;width:${r}px;height:${r}px" viewBox="0 0 100 100" aria-hidden="true"><polygon points="${p.join(' ')}" fill="${color}" stroke="${NEGRO}" stroke-width="5" stroke-linejoin="round"/></svg>`;
};
const FUEGO = '<svg width="64" height="64" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c.6 3.2 3.1 4.9 4.6 7.3 1.4 2.2 1.9 4.4 1.2 6.6-.9 3.1-3.2 5.1-5.8 5.1s-5-2-5.8-5.1c-.6-2.4.1-4.6 1.6-6.4.2 1.5.9 2.6 2.1 3.2-.4-3.6.5-7.1 2.1-10.7z" fill="#FF8A1F" stroke="#0B0B0F" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 12.2c1.3 1.4 2.4 2.6 2.3 4.4-.1 1.6-1.1 2.7-2.3 2.7s-2.3-1.1-2.3-2.6c0-1.6.9-2.9 2.3-4.5z" fill="#FFD60A" stroke="#0B0B0F" stroke-width="1.2" stroke-linejoin="round"/></svg>';
const ICO_GUARDAR = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/></svg>';
const ICO_COMPARTIR = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';

const plural = (n, uno, varios) => n + ' ' + (n === 1 ? uno : varios);
/* Fase I se premia en el festival de julio; Fase II, en el de diciembre. */
export function festival(fase) {
  const hoy = new Date(), dic = /II/.test(fase || '');
  const anio = dic ? hoy.getFullYear() : (hoy.getMonth() >= 7 ? hoy.getFullYear() + 1 : hoy.getFullYear());
  return (dic ? 'diciembre ' : 'julio ') + anio;
}

export function abrirRecorrido(ctx) {
  const { r, esc } = ctx, d = r.d || {}, fase = r.fase || '';
  const firma = (r.nombre ? r.nombre + ' · ' : '') + '@' + String(r.usuario || '').replace(/^@+/, '');
  const pod = d.pod || { p1: 0, p23: 0, rel: 0 }, cons = d.cons || {}, tec = d.tec || { d: 0, t: 0 };
  const podios = (pod.p1 || 0) + (pod.p23 || 0);
  const total = Math.max(d.total || 0, d.semanas || 0);
  const puntos = Array.from({ length: total }, (_, i) => `<i class="${i < d.semanas ? 'on' : ''}"></i>`).join('');

  const pantallas = [
    // 1 · portada
    `<div class="rc-st" style="background:${VIOLETA};color:#fff">${destello(8, 10, 46, AMARILLO)}${destello(80, 16, 30, ROSADO)}${destello(80, 82, 40, CIAN)}
      <span class="rc-pill">${esc(fase.toUpperCase())} · 3.ª TEMPORADA</span>
      <h2 class="rc-h" style="color:${AMARILLO};font-size:34px">Mi recorrido creativo</h2>
      <div class="rc-masc"><img src="img/tradi.webp" alt=""><img src="img/digi.webp" alt=""></div>
      <p>${esc(firma)}</p><span class="rc-toca">Toca para empezar</span></div>`,
    // 2 · semanas
    `<div class="rc-st" style="background:${AMARILLO}">${destello(80, 8, 36, ROSADO)}
      <p>Dibujaste en</p><div class="rc-num">${d.semanas || 0}</div><h2 class="rc-h">de ${plural(total, 'semana', 'semanas')}</h2>
      <div class="rc-sem">${puntos}</div>
      <p>${d.semanas >= total && total > 1 ? '¡No faltaste ni una semana!' : (d.gente >= 10 && d.pct >= 50 ? 'Eso es más que el ' + d.pct + '&nbsp;% de la&nbsp;comunidad' : 'Cada dibujo cuenta para tu&nbsp;recorrido')}</p></div>`,
    // 3 · racha y técnica
    `<div class="rc-st" style="background:${ROSADO};color:#fff">${destello(6, 9, 34, AMARILLO)}
      ${FUEGO}<p>Tu mejor racha</p><div class="rc-num" style="font-size:80px">${d.mejor || 0}</div><h2 class="rc-h">${(d.mejor || 0) === 1 ? 'semana' : 'semanas seguidas'}</h2>
      ${tec.d + tec.t ? `<p style="margin-top:8px">Tu técnica favorita: <b>${tec.d >= tec.t ? 'Digital' : 'Tradicional'}</b></p>
      <div class="rc-barra"><b style="width:${Math.round(100 * Math.max(tec.d, tec.t) / (tec.d + tec.t))}%"></b></div>
      <p style="font-size:13px">Digital ${tec.d} · Tradicional ${tec.t}</p>` : ''}</div>`,
    // 4 · dibujo más querido y podios
    `<div class="rc-st" style="background:${CIAN}">${destello(78, 74, 40, AMARILLO)}
      ${d.fav ? `<p>Tu dibujo más querido</p><figure class="rc-dib"><img src="https://lh3.googleusercontent.com/d/${esc(d.fav.drive)}=w600" alt="Tu dibujo de la semana ${esc(d.fav.semana)}"><figcaption>Semana ${esc(d.fav.semana)} · ♥ ${esc(d.fav.mg)}</figcaption></figure>` : '<p>Tus dibujos de esta fase</p>'}
      <h2 class="rc-h" style="margin-top:8px">${podios ? 'Subiste al podio ' + plural(podios, 'vez', 'veces') : d.fin ? 'Fuiste finalista ' + plural(d.fin, 'vez', 'veces') : '¡Tu podio está por llegar!'}</h2>
      <p>${pod.p1 ? plural(pod.p1, 'primer lugar', 'primeros lugares') + (pod.rel ? ' · ' : '') : ''}${pod.rel ? plural(pod.rel, 'Relámpago', 'Relámpagos') : ''}${!pod.p1 && !pod.rel ? (podios || d.fin ? 'Sigue así la próxima fase' : 'Cada semana es una nueva oportunidad') : ''}</p></div>`,
    // 5 · Premio a la constancia (desempate de las bases del 12 nov 2026)
    `<div class="rc-st" style="background:${LILA}">${destello(82, 8, 34, AMARILLO)}
      <span class="rc-pill">PREMIO A LA CONSTANCIA</span><h2 class="rc-h">Así llegas al festival de&nbsp;${esc(festival(fase).split(' ')[0])}</h2>
      <div class="rc-cons">
        <div><span>1 · Semanas con dibujo</span><b>${cons.semanas || 0}</b></div>
        <div><span>2 · Racha más larga</span><b>${cons.racha || 0}</b></div>
        <div><span>3 · Semanas votando</span><b>${cons.votando || 0}</b></div></div>
      <p style="font-size:14px">${cons.puesto ? 'Vas en el puesto <b>' + cons.puesto + '</b> de ' + cons.de + '. Si hay empate, cuenta cada número en ese&nbsp;orden.' : 'Compiten por los premios quienes viven en&nbsp;Venezuela.'}</p>
      <p class="rc-mini">Puesto provisional: la organización lo confirma. Los protectores cuidan tu racha, pero no suman semanas para este&nbsp;premio.</p></div>`,
    // 6 · tarjeta para compartir
    `<div class="rc-st rc-fin" style="background:var(--bg)">
      <img class="rc-tarjeta" id="rc-img" alt="Tu tarjeta de Mi recorrido creativo">
      <div class="rc-bot"><button type="button" class="btn blanco chico rc-ico" id="rc-comp" aria-label="Compartir">${ICO_COMPARTIR}</button>
        <button type="button" class="btn amarillo" id="rc-guardar">${ICO_GUARDAR}<span>GUARDAR EN MI TELÉFONO</span></button></div>
      <p class="rc-mini" id="rc-nota" role="status">Lleva el logo de la app, la web y la invitación al&nbsp;festival</p></div>`
  ];

  const velo = document.createElement('div');
  velo.className = 'rc-velo';
  velo.setAttribute('role', 'dialog'); velo.setAttribute('aria-modal', 'true'); velo.setAttribute('aria-label', 'Mi recorrido creativo');
  velo.innerHTML = `<div class="rc-marco"><div class="rc-pas">${pantallas.map(() => '<i></i>').join('')}</div>
    <button type="button" class="rc-x" aria-label="Cerrar">✕</button><div class="rc-pant"></div>
    <button type="button" class="rc-zona rc-atras" aria-label="Anterior"></button><button type="button" class="rc-zona rc-sig" aria-label="Siguiente"></button></div>`;
  document.body.appendChild(velo);
  document.documentElement.style.overflow = 'hidden';
  const pant = velo.querySelector('.rc-pant'), barras = [...velo.querySelectorAll('.rc-pas i')];
  let i = 0;
  const cerrar = () => { velo.remove(); document.documentElement.style.overflow = ''; document.removeEventListener('keydown', tecla); if (ctx.alCerrar) ctx.alCerrar(); };
  const pintar = () => {
    pant.innerHTML = pantallas[i];
    barras.forEach((b, k) => b.classList.toggle('on', k <= i));
    const fin = i === pantallas.length - 1;
    velo.querySelector('.rc-sig').hidden = fin;
    velo.querySelector('.rc-atras').classList.toggle('rc-media', fin);
    if (fin) prepararTarjeta();
  };
  const ir = n => { i = Math.max(0, Math.min(pantallas.length - 1, i + n)); pintar(); };
  function tecla(e) { if (e.key === 'Escape') cerrar(); else if (e.key === 'ArrowRight') ir(1); else if (e.key === 'ArrowLeft') ir(-1); }
  velo.querySelector('.rc-x').addEventListener('click', cerrar);
  velo.querySelector('.rc-sig').addEventListener('click', () => ir(1));
  velo.querySelector('.rc-atras').addEventListener('click', () => ir(-1));
  document.addEventListener('keydown', tecla);
  pintar();

  /* ---------- tarjeta (imagen 1080 × 1350, formato de publicación de Instagram) ---------- */
  async function tarjeta() {
    try { await document.fonts.ready; } catch (e) {}
    const W = 1080, H = 1350, o = document.createElement('canvas'); o.width = W; o.height = H;
    const y = o.getContext('2d');
    y.fillStyle = VIOLETA; y.fillRect(0, 0, W, H);
    const forma = (color, camino) => { y.beginPath(); camino(); y.closePath(); y.fillStyle = color; y.fill(); y.lineWidth = 6; y.lineJoin = 'round'; y.strokeStyle = NEGRO; y.stroke(); };
    const dest = (cx, cy, r, color) => forma(color, () => { for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4 - Math.PI / 2, rr = k % 2 ? r * .34 : r; y[k ? 'lineTo' : 'moveTo'](cx + rr * Math.cos(a), cy + rr * Math.sin(a)); } });
    const caja = (x, yy, w, h, r, fondo) => { y.beginPath(); if (y.roundRect) y.roundRect(x, yy, w, h, r); else y.rect(x, yy, w, h); y.fillStyle = NEGRO; y.save(); y.translate(8, 8); y.fill(); y.restore(); y.fillStyle = fondo; y.fill(); y.lineWidth = 6; y.strokeStyle = NEGRO; y.stroke(); };
    const texto = (t, fuente, tam, color, cx, yy, max) => { let f = tam; y.font = fuente.replace('#', f); while (max && y.measureText(t).width > max && f > 20) { f -= 2; y.font = fuente.replace('#', f); } y.fillStyle = color; y.textAlign = 'center'; y.fillText(t, cx, yy); };
    dest(110, 120, 70, AMARILLO); dest(960, 170, 44, ROSADO); dest(980, 1180, 56, CIAN); dest(90, 1230, 34, AMARILLO);
    // etiqueta
    y.font = '800 30px Poppins, sans-serif'; const et = '#RETOMENTEMILENIAL', ew = y.measureText(et).width + 64;
    y.beginPath(); if (y.roundRect) y.roundRect(W / 2 - ew / 2, 120, ew, 58, 29); else y.rect(W / 2 - ew / 2, 120, ew, 58);
    y.fillStyle = NEGRO; y.fill(); texto(et, '800 #px Poppins, sans-serif', 30, AMARILLO, W / 2, 160);
    texto('Mi recorrido creativo', '800 #px Poppins, sans-serif', 76, '#FFFFFF', W / 2, 290, W - 160);
    texto(firma, '800 #px Poppins, sans-serif', 50, AMARILLO, W / 2, 370, W - 160);
    texto(fase + ' · 3.ª temporada', '700 #px Quicksand, sans-serif', 34, '#FFFFFF', W / 2, 425, W - 160);
    // 4 números
    const datos = [[d.semanas || 0, 'semanas con dibujo'], [d.mejor || 0, 'mejor racha'], [podios, podios === 1 ? 'podio' : 'podios'], [d.fin || 0, d.fin === 1 ? 'vez finalista' : 'veces finalista']];
    datos.forEach((x, k) => {
      const cx = k % 2 ? 580 : 120, cy = k < 2 ? 500 : 780, w = 380, h = 240;
      caja(cx, cy, w, h, 34, k === 0 ? AMARILLO : '#FFFFFF');
      texto(String(x[0]), '800 #px Poppins, sans-serif', 120, NEGRO, cx + w / 2, cy + 140);
      texto(x[1], '700 #px Quicksand, sans-serif', 32, NEGRO, cx + w / 2, cy + 195, w - 40);
    });
    texto('Nos vemos en el Reto Creativo Fest · ' + festival(fase), '700 #px Quicksand, sans-serif', 36, '#FFFFFF', W / 2, 1120, W - 180);
    // cierre: logo de la app + web
    y.font = '700 32px Quicksand, sans-serif';
    const web = 'retocreativofest.com', L = 70, hay = LOGO.complete && LOGO.naturalWidth > 0, wt = y.measureText(web).width;
    const tot = (hay ? L + 18 : 0) + wt, x0 = W / 2 - tot / 2, yl = 1170;
    if (hay) { y.save(); y.beginPath(); if (y.roundRect) y.roundRect(x0, yl, L, L, 16); else y.rect(x0, yl, L, L); y.clip(); y.drawImage(LOGO, x0, yl, L, L); y.restore();
      y.beginPath(); if (y.roundRect) y.roundRect(x0, yl, L, L, 16); else y.rect(x0, yl, L, L); y.lineWidth = 4; y.strokeStyle = NEGRO; y.stroke(); }
    y.textAlign = 'left'; y.fillStyle = '#FFFFFF'; y.fillText(web, x0 + (hay ? L + 18 : 0), yl + L / 2 + 11);
    return o;
  }
  let blob = null;
  async function prepararTarjeta() {
    if (!LOGO.complete) await new Promise(ok => { LOGO.onload = LOGO.onerror = ok; });
    const o = await tarjeta();
    blob = await new Promise(ok => o.toBlob(ok, 'image/png'));
    const img = velo.querySelector('#rc-img'); if (img && blob) img.src = URL.createObjectURL(blob);
    const g = velo.querySelector('#rc-guardar'), c = velo.querySelector('#rc-comp');
    if (g) g.addEventListener('click', guardar);
    if (c) { if (navigator.canShare && navigator.share) c.addEventListener('click', compartir); else c.hidden = true; }
  }
  const nombre = () => 'mi-recorrido-creativo-' + fase.toLowerCase().replace(/\s+/g, '-') + '.png';
  const nota = t => { const n = velo.querySelector('#rc-nota'); if (n) n.textContent = t; };
  async function guardar() {
    if (!blob) return;
    if (IOS) {   // en iPhone y iPad la hoja del sistema trae «Guardar imagen» (va a Fotos)
      const f = new File([blob], nombre(), { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [f] })) { nota('Toca «Guardar imagen» para guardarla en Fotos.'); try { await navigator.share({ files: [f] }); } catch (e) {} return; }
    }
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = nombre(); document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    nota('✓ Guardada en tu teléfono, en la carpeta «Descargas» (también la ves en la Galería).');
  }
  async function compartir() {
    if (!blob) return;
    const f = new File([blob], nombre(), { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [f] })) {
      try { await navigator.share({ files: [f], text: 'Mi recorrido creativo en el #RetoMenteMilenial ✨' }); return; } catch (e) { if (e && e.name === 'AbortError') return; }
    }
    guardar();
  }
}
