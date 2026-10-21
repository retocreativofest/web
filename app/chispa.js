/* #RetoMenteMilenial · Chispa del día: un mini reto de 3 minutos (opcional, no suma puntos ni racha).
   Gratis: pincel mediano, borrador, deshacer, 22 colores y marco Clásico.
   Club Estrella (Chispa Pro): 3 tamaños, cubeta, cambiar la chispa 1 vez al día, marcos Sol y Mar, video acelerado. */
const POOL = ['3 gatos azules', '2 bomberos verdes', '1 taza rosada', '2 perros amarillos', '3 peces naranja', '1 sombrero morado',
  '2 zapatos rojos', '1 cara feliz amarilla', '3 pájaros rojos', '2 doctoras moradas', '1 elefante rosado', '3 camisas verdes',
  '2 caras tristes azules', '1 tortuga marrón', '3 manzanas moradas', '2 cocineros naranja', '1 vaca azul', '3 medias rosadas',
  '2 caras sorprendidas verdes', '1 caracol amarillo', '3 estrellas marrones', '2 casas moradas', '1 jirafa verde', '3 sombrillas naranja',
  '2 pintores rojos', '1 bufanda azul', '3 nubes rosadas', '2 conejos marrones', '1 cara enojada morada', '2 árboles azules',
  '3 globos verdes', '1 maestra amarilla', '2 gorras rosadas', '1 pulpo rojo', '3 flores naranja'];
const GAMAS = [['Rojo', '#FF5A5A', '#B30000'], ['Naranja', '#FFB04D', '#E06A00'], ['Amarillo', '#FFF35C', '#E0B400'],
  ['Verde', '#7EDC6A', '#1E7A1E'], ['Azul', '#6FB6FF', '#0B3D91'], ['Rosado', '#FFB3D1', '#E0408A'], ['Morado', '#C79BF2', '#5B2A86'],
  ['Marrón', '#C68B59', '#6B3E1E'], ['Piel', '#F6D3B3', '#A86B3C'], ['Negro', '#FFFFFF', '#000000'], ['Gris', '#C8C8C8', '#6E6E6E']];
const PALETA = GAMAS.map(g => [g[0] === 'Negro' ? 'Blanco' : g[0] + ' claro', g[1]]).concat(GAMAS.map(g => [g[0] === 'Negro' ? 'Negro' : g[0] + ' oscuro', g[2]]));
const SIZES = [['Fino', 6, 20], ['Mediano', 12, 36], ['Grueso', 26, 64]];
const MARCOS = [['clasico', 'Clásico', '#6B3FA0', '#FFFFFF', '#FFD60A', false], ['sol', 'Sol', '#FFD60A', '#0B0B0F', '#F0479B', true], ['mar', 'Mar', '#84D7DF', '#0B0B0F', '#6B3FA0', true]];
const LIMITE = 180, ANCHO = 648, ALTO = 700;

const leerLS = k => { try { return JSON.parse(localStorage.getItem('rcf.' + k)); } catch (e) { return null; } };
const guardarLS = (k, v) => { try { localStorage.setItem('rcf.' + k, JSON.stringify(v)); } catch (e) {} };
export function diaCaracas(d) { return new Date((d || new Date()).getTime() - 4 * 36e5).toISOString().slice(0, 10); }
export function chispaDeHoy() {
  const dia = diaCaracas(), guardada = leerLS('chispa.' + dia);
  if (guardada && guardada.chispa) return guardada;
  const n = Math.floor((Date.parse(dia) - Date.parse('2026-01-01')) / 864e5);
  return { chispa: POOL[((n % POOL.length) + POOL.length) % POOL.length], cambiada: false };
}
export function chispasDeLaSemana() {   // cuántas hiciste desde el lunes
  const hechas = leerLS('chispas') || [], hoy = new Date(Date.now() - 4 * 36e5);
  const lunes = new Date(hoy); lunes.setUTCDate(hoy.getUTCDate() - ((hoy.getUTCDay() + 6) % 7));
  const desde = lunes.toISOString().slice(0, 10);
  return hechas.filter(d => d >= desde).length;
}
export function chispaHechaHoy() { return (leerLS('chispas') || []).indexOf(diaCaracas()) >= 0; }
function marcarHecha() {
  const dia = diaCaracas(), hechas = (leerLS('chispas') || []).filter(d => d !== dia);
  hechas.push(dia); guardarLS('chispas', hechas.slice(-21));
}
const hexRgb = h => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };

/* ctx: { root, esc, club (bool), volver(), irClub() } */
export function abrirChispa(ctx) {
  const { root, esc } = ctx, club = !!ctx.club;
  const hoy = chispaDeHoy();
  const S = { fase: 'lista', quedan: LIMITE, herramienta: 'pincel', color: '#000000', tam: 1, marco: 'clasico', ops: 0, video: false, chispa: hoy.chispa, cambiada: hoy.cambiada };
  let hist = [], cuadros = [], foto = null, reloj = null, dibujando = false, ultimo = null, bloqueoT = null;
  const candado = club ? '' : ' 🔒';

  root.innerHTML = `
    <header class="barra" style="padding-bottom:10px">
      <button type="button" class="volver" id="ch-v" aria-label="Volver">${ctx.icoVolver || '‹'}</button>
      <div style="flex:1;min-width:0"><h1 style="font-size:19px">Chispa del día</h1><span class="sub">3 minutos · no suma puntos ni racha</span></div>
      <span class="reloj-ch" id="ch-reloj" role="timer" aria-live="off">3:00</span>
    </header>
    <main class="cont ch">
      <div class="ch-tit"><span class="pill-ch">TU CHISPA DE HOY ES…</span><h2 id="ch-t">Dibuja ${esc(S.chispa)}</h2></div>
      <div class="lienzo"><canvas id="ch-c" width="${ANCHO}" height="${ALTO}" aria-label="Lienzo para dibujar"></canvas><div class="ch-empezar" id="ch-emp">Toca el lienzo para empezar ✏️</div></div>
      <div class="ch-tools" id="ch-tools">
        <button type="button" class="tool" data-tool="pincel" aria-pressed="true">🖌️ Pincel</button>
        <button type="button" class="tool" data-tool="borrador" aria-pressed="false">🧽 Borrar</button>
        <button type="button" class="tool" data-tool="cubeta" aria-pressed="false">🪣 Cubeta${candado}</button>
        <button type="button" class="tool" id="ch-undo" aria-label="Deshacer">↩︎</button>
        <span class="tams">${SIZES.map((z, i) => `<button type="button" class="tam" data-tam="${i}" aria-pressed="${i === 1}" aria-label="Tamaño ${z[0].toLowerCase()}${club || i === 1 ? '' : ' (Club Estrella)'}"><i style="width:${[6, 10, 15][i]}px;height:${[6, 10, 15][i]}px;${club || i === 1 ? '' : 'background:#B9AECB'}"></i></button>`).join('')}</span>
      </div>
      <div class="paleta" role="group" aria-label="Colores">${PALETA.map(c => `<button type="button" class="col" data-col="${c[1]}" aria-label="${esc(c[0])}" aria-pressed="${c[1] === S.color}" style="background:${c[1]}"></button>`).join('')}</div>
      <div id="ch-lock" class="ch-lock" hidden></div>
      <div id="ch-abajo"></div>
    </main>`;
  const c = root.querySelector('#ch-c'), x = c.getContext('2d');
  const blanco = () => { x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, ANCHO, ALTO); };
  blanco();
  const $ = s => root.querySelector(s);

  function bloqueado(que) {
    const l = $('#ch-lock');
    l.innerHTML = `🔒 <b>${esc(que)}</b> es del Club Estrella. <button type="button" class="enlace" id="ch-club" style="min-height:0;padding:0 4px;font-size:13px">Conocer el Club</button>`;
    l.hidden = false;
    $('#ch-club').addEventListener('click', () => { parar(); ctx.irClub(); });
    clearTimeout(bloqueoT); bloqueoT = setTimeout(() => { l.hidden = true; }, 3500);
  }
  function pintarReloj() {
    const m = Math.floor(S.quedan / 60), s = S.quedan % 60, r = $('#ch-reloj');
    r.textContent = m + ':' + String(s).padStart(2, '0');
    r.classList.toggle('poco', S.fase === 'dibujando' && S.quedan <= 30);
  }
  function parar() { clearInterval(reloj); reloj = null; }
  function guardarFoto() { try { foto = c.toDataURL('image/png'); } catch (e) {} }
  function empezar() {
    S.fase = 'dibujando'; S.quedan = LIMITE; $('#ch-emp').hidden = true;
    reloj = setInterval(() => { S.quedan--; if (S.quedan <= 0) { S.quedan = 0; terminar(); } pintarReloj(); }, 1000);
    pintarAbajo();
  }
  function terminar() {
    if (S.fase === 'hecha') return;
    parar(); dibujando = false; S.fase = 'hecha'; guardarFoto();
    if (S.ops > 0) marcarHecha();
    pintarAbajo();
  }
  function pos(e) { const r = c.getBoundingClientRect(), t = e.touches ? e.touches[0] : e; return { x: (t.clientX - r.left) * ANCHO / r.width, y: (t.clientY - r.top) * ALTO / r.height }; }
  function tam() { const z = SIZES[club ? S.tam : 1]; return { pincel: z[1], borrador: z[2] }; }
  function guardarHist() { hist.push(x.getImageData(0, 0, ANCHO, ALTO)); if (hist.length > 20) hist.shift(); }
  function cuadro() { guardarFoto(); if (foto && cuadros.length < 400) cuadros.push(foto); }
  function cubeta(px, py, hex) {
    const img = x.getImageData(0, 0, ANCHO, ALTO), d = img.data;
    px = Math.max(0, Math.min(ANCHO - 1, px | 0)); py = Math.max(0, Math.min(ALTO - 1, py | 0));
    const i0 = (py * ANCHO + px) * 4, r0 = d[i0], g0 = d[i0 + 1], b0 = d[i0 + 2], t = hexRgb(hex);
    if (Math.abs(r0 - t[0]) + Math.abs(g0 - t[1]) + Math.abs(b0 - t[2]) < 6) return false;
    const visto = new Uint8Array(ANCHO * ALTO), pila = [px, py], TOL = 90;
    while (pila.length) {
      const yy = pila.pop(), xx = pila.pop(), k = yy * ANCHO + xx;
      if (visto[k]) continue; visto[k] = 1;
      const i = k * 4;
      if (Math.abs(d[i] - r0) + Math.abs(d[i + 1] - g0) + Math.abs(d[i + 2] - b0) > TOL) continue;
      d[i] = t[0]; d[i + 1] = t[1]; d[i + 2] = t[2]; d[i + 3] = 255;
      if (xx > 0) pila.push(xx - 1, yy); if (xx < ANCHO - 1) pila.push(xx + 1, yy);
      if (yy > 0) pila.push(xx, yy - 1); if (yy < ALTO - 1) pila.push(xx, yy + 1);
    }
    x.putImageData(img, 0, 0); return true;
  }
  function abajo(e) {
    if (S.fase === 'hecha' || S.video) return;
    if (S.fase === 'lista') empezar();
    if (e.cancelable) e.preventDefault();
    const p = pos(e);
    if (S.herramienta === 'cubeta') {
      guardarHist();
      if (cubeta(p.x, p.y, S.color)) { S.ops++; cuadro(); pintarAbajo(); } else hist.pop();
      return;
    }
    guardarHist(); dibujando = true; ultimo = p;
    if (c.setPointerCapture && e.pointerId != null) { try { c.setPointerCapture(e.pointerId); } catch (err) {} }
    const w = S.herramienta === 'borrador' ? tam().borrador : tam().pincel;
    x.beginPath(); x.fillStyle = S.herramienta === 'borrador' ? '#FFFFFF' : S.color; x.arc(p.x, p.y, w / 2, 0, Math.PI * 2); x.fill();
  }
  function mover(e) {
    if (!dibujando || S.fase !== 'dibujando') return;
    if (e.cancelable) e.preventDefault();
    const p = pos(e), w = S.herramienta === 'borrador' ? tam().borrador : tam().pincel;
    x.strokeStyle = S.herramienta === 'borrador' ? '#FFFFFF' : S.color; x.lineWidth = w; x.lineCap = 'round'; x.lineJoin = 'round';
    x.beginPath(); x.moveTo(ultimo.x, ultimo.y); x.lineTo(p.x, p.y); x.stroke(); ultimo = p;
  }
  function arriba() { if (!dibujando) return; dibujando = false; S.ops++; cuadro(); pintarAbajo(); }
  c.addEventListener('pointerdown', abajo); c.addEventListener('pointermove', mover);
  ['touchstart', 'touchmove', 'touchend'].forEach(t => c.addEventListener(t, e => { if (e.cancelable) e.preventDefault(); }, { passive: false }));   // sin zoom ni lupa al dibujar
  c.addEventListener('dblclick', e => e.preventDefault());
  c.addEventListener('pointerup', arriba); c.addEventListener('pointercancel', arriba); c.addEventListener('pointerleave', arriba);

  root.querySelectorAll('[data-tool]').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.tool === 'cubeta' && !club) return bloqueado('La cubeta');
    S.herramienta = b.dataset.tool;
    root.querySelectorAll('[data-tool]').forEach(t => t.setAttribute('aria-pressed', String(t === b)));
  }));
  root.querySelectorAll('[data-tam]').forEach(b => b.addEventListener('click', () => {
    if (!club && b.dataset.tam !== '1') return bloqueado('Cambiar el tamaño');
    S.tam = +b.dataset.tam; root.querySelectorAll('[data-tam]').forEach(t => t.setAttribute('aria-pressed', String(t === b)));
  }));
  root.querySelectorAll('[data-col]').forEach(b => b.addEventListener('click', () => {
    S.color = b.dataset.col; if (S.herramienta === 'borrador') { S.herramienta = 'pincel'; root.querySelectorAll('[data-tool]').forEach(t => t.setAttribute('aria-pressed', String(t.dataset.tool === 'pincel'))); }
    root.querySelectorAll('[data-col]').forEach(t => t.setAttribute('aria-pressed', String(t === b)));
  }));
  $('#ch-undo').addEventListener('click', () => {
    if (S.fase !== 'dibujando' || !hist.length) return;
    x.putImageData(hist.pop(), 0, 0); S.ops = Math.max(0, S.ops - 1); cuadro(); pintarAbajo();
  });
  $('#ch-v').addEventListener('click', () => { parar(); ctx.volver(); });

  function conMarco() {
    const m = MARCOS.find(f => f[0] === S.marco) || MARCOS[0];
    const o = document.createElement('canvas'); o.width = ANCHO + 80; o.height = ALTO + 200;
    const y = o.getContext('2d');
    y.fillStyle = m[2]; y.fillRect(0, 0, o.width, o.height);
    y.fillStyle = '#0B0B0F'; y.fillRect(34, 34, ANCHO + 12, ALTO + 12);
    y.drawImage(c, 40, 40);
    y.textAlign = 'center';
    y.fillStyle = m[4]; y.font = '800 40px Poppins, sans-serif'; y.fillText('#RetoMenteMilenial', o.width / 2, ALTO + 112);
    y.fillStyle = m[3]; y.font = '700 30px Quicksand, sans-serif'; y.fillText('Chispa del día: ' + S.chispa, o.width / 2, ALTO + 156);
    y.font = '700 22px Quicksand, sans-serif'; y.fillText('Reto Creativo Fest', o.width / 2, ALTO + 188);
    return o;
  }
  function descargar(href, nombre) { const a = document.createElement('a'); a.href = href; a.download = nombre; document.body.appendChild(a); a.click(); a.remove(); }
  async function compartirOdescargar() {
    const o = conMarco();
    const blob = await new Promise(ok => o.toBlob(ok, 'image/png'));
    const archivo = blob && new File([blob], 'chispa-del-dia.png', { type: 'image/png' });
    if (archivo && navigator.canShare && navigator.canShare({ files: [archivo] })) {
      try { await navigator.share({ files: [archivo], text: 'Mi chispa del día: ' + S.chispa + ' #RetoMenteMilenial' }); return; } catch (e) { if (e && e.name === 'AbortError') return; }
    }
    descargar(o.toDataURL('image/png'), 'chispa-del-dia.png');
  }
  function video() {
    if (!club) return bloqueado('El video acelerado');
    if (!cuadros.length || S.video) return;
    S.video = true; pintarAbajo();
    let rec = null; const trozos = [];
    if (c.captureStream && window.MediaRecorder) {
      try {
        const tipo = ['video/mp4', 'video/webm;codecs=vp9', 'video/webm'].find(t => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t));
        rec = new MediaRecorder(c.captureStream(30), tipo ? { mimeType: tipo } : undefined);
        rec.ondataavailable = e => { if (e.data && e.data.size) trozos.push(e.data); };
        rec.onstop = () => { const b = new Blob(trozos, { type: rec.mimeType || 'video/webm' }); descargar(URL.createObjectURL(b), 'chispa-acelerada.' + ((rec.mimeType || '').includes('mp4') ? 'mp4' : 'webm')); };
        rec.start();
      } catch (e) { rec = null; }
    }
    const lista = cuadros.slice(), pausa = Math.max(60, Math.min(300, 5000 / lista.length));
    let i = 0; blanco();
    const sig = () => {
      if (i >= lista.length) { setTimeout(() => { if (rec) rec.stop(); S.video = false; pintarAbajo(); }, 900); return; }
      const img = new Image(); img.onload = () => { x.drawImage(img, 0, 0); i++; setTimeout(sig, pausa); }; img.src = lista[i];
    };
    setTimeout(sig, 300);
  }
  function pintarAbajo() {
    const ab = $('#ch-abajo');
    if (S.fase !== 'hecha') {
      ab.innerHTML = `<button type="button" class="btn blanco" id="ch-fin" ${S.ops > 0 ? '' : 'disabled'}>${S.ops > 0 ? 'TERMINÉ ANTES' : 'Dibuja algo para terminar'}</button>
        ${S.fase === 'lista' ? `<button type="button" class="btn blanco chico" id="ch-cambiar" ${S.cambiada ? 'disabled' : ''}>${S.cambiada ? 'Ya cambiaste tu chispa de hoy' : '🔄 Cambiar mi chispa · 1 al día' + candado}</button>` : ''}`;
      const f = $('#ch-fin'); if (f) f.addEventListener('click', terminar);
      const ca = $('#ch-cambiar');
      if (ca) ca.addEventListener('click', () => {
        if (S.cambiada) return;
        if (!club) return bloqueado('Cambiar la chispa');
        let n = Math.floor(Math.random() * POOL.length); if (POOL[n] === S.chispa) n = (n + 1) % POOL.length;
        S.chispa = POOL[n]; S.cambiada = true; guardarLS('chispa.' + diaCaracas(), { chispa: S.chispa, cambiada: true });
        $('#ch-t').textContent = 'Dibuja ' + S.chispa; pintarAbajo();
      });
      return;
    }
    if (S.ops <= 0) {
      ab.innerHTML = `<div class="caja">El lienzo quedó en blanco. ¡Inténtalo otra vez!</div><button type="button" class="btn amarillo" id="ch-otra">VOLVER A INTENTAR</button>`;
      $('#ch-otra').addEventListener('click', () => abrirChispa(ctx));
      return;
    }
    ab.innerHTML = `
      <div class="caja agua" style="text-align:center">${S.video ? '🎬 Grabando el video acelerado…' : S.quedan === 0 ? '⏰ ¡Se acabó el tiempo! Tu chispa quedó así.' : '🎉 ¡Chispa terminada!'}</div>
      <div class="fila-t"><strong>Marco</strong><span>Para guardarla o compartirla</span></div>
      <div class="marcos">${MARCOS.map(m => `<button type="button" class="marco" data-marco="${m[0]}" aria-pressed="${S.marco === m[0]}" style="background:${m[2]};color:${m[3]}">${m[1]}${m[5] && !club ? ' 🔒' : ''}</button>`).join('')}</div>
      <button type="button" class="btn amarillo" id="ch-desc">⬇ GUARDAR O COMPARTIR</button>
      <button type="button" class="btn blanco chico" id="ch-video" ${S.video ? 'disabled' : ''}>🎬 Video acelerado${candado}</button>
      <button type="button" class="enlace" id="ch-salir">Volver a Hoy · mañana hay otra chispa</button>`;
    root.querySelectorAll('[data-marco]').forEach(b => b.addEventListener('click', () => {
      const m = MARCOS.find(f => f[0] === b.dataset.marco);
      if (m[5] && !club) return bloqueado('El marco ' + m[1]);
      S.marco = m[0]; pintarAbajo();
    }));
    $('#ch-desc').addEventListener('click', compartirOdescargar);
    $('#ch-video').addEventListener('click', video);
    $('#ch-salir').addEventListener('click', () => ctx.volver());
  }
  pintarReloj(); pintarAbajo();
  return () => parar();
}
