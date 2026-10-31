/* #RetoMenteMilenial · Chispa del día: un mini reto de 3 minutos (opcional, no suma puntos ni racha).
   Gratis: pincel mediano, borrador, deshacer, 22 colores y marco Clásico.
   Club Estrella (Chispa Pro): 3 tamaños, cubeta, cambiar la chispa 1 vez al día, marcos Sol y Mar, video acelerado. */
const POOL = ['3 gatos azules', '2 bomberos verdes', '1 taza rosada', '2 perros amarillos', '3 peces naranja', '1 sombrero morado',
  '2 zapatos rojos', '1 cara feliz amarilla', '3 pájaros rojos', '2 doctoras moradas', '1 elefante rosado', '3 camisas verdes',
  '2 caras tristes azules', '1 tortuga marrón', '3 manzanas moradas', '2 cocineros naranja', '1 vaca azul', '3 medias rosadas',
  '2 caras sorprendidas verdes', '1 caracol amarillo', '3 estrellas marrones', '2 casas moradas', '1 jirafa verde', '3 sombrillas naranja',
  '2 pintores rojos', '1 bufanda azul', '3 nubes rosadas', '2 conejos marrones', '1 cara enojada morada', '2 árboles azules',
  '3 globos verdes', '1 maestra amarilla', '2 gorras rosadas', '1 pulpo rojo', '3 flores naranja',
  '3 arepas amarillas', '2 guacamayas rojas', '1 chigüire marrón', '2 turpiales naranja', '3 cayenas rojas'];   // 31 oct: chispas venezolanas
const GAMAS = [['Rojo', '#FF5A5A', '#B30000'], ['Naranja', '#FFB04D', '#E06A00'], ['Amarillo', '#FFF35C', '#E0B400'],
  ['Verde', '#7EDC6A', '#1E7A1E'], ['Azul', '#6FB6FF', '#0B3D91'], ['Rosado', '#FFB3D1', '#E0408A'], ['Morado', '#C79BF2', '#5B2A86'],
  ['Marrón', '#C68B59', '#6B3E1E'], ['Piel', '#F6D3B3', '#A86B3C'], ['Negro', '#FFFFFF', '#000000'], ['Gris', '#C8C8C8', '#6E6E6E']];
const PALETA = GAMAS.map(g => [g[0] === 'Negro' ? 'Blanco' : g[0] + ' claro', g[1]]).concat(GAMAS.map(g => [g[0] === 'Negro' ? 'Negro' : g[0] + ' oscuro', g[2]]));
const SIZES = [['Fino', 6, 20], ['Mediano', 12, 36], ['Grueso', 26, 64]];
const MARCOS = [['clasico', 'Clásico', '#6B3FA0', '#FFFFFF', '#FFD60A', false], ['sol', 'Sol', '#FFD60A', '#0B0B0F', '#F0479B', true], ['mar', 'Mar', '#84D7DF', '#0B0B0F', '#6B3FA0', true],
  ['navidad', 'Navidad', '#1E7A3A', '#FFFFFF', '#FFD60A', 'adviento']];   // se gana con 15 chispas del Adviento

/* Adviento de Chispas: del 1 al 22 de diciembre, una chispa navideña por día (mientras llega la 3.ª temporada).
   Misma regla del banco: cantidad + cosa + color. Con 15 de 22 se gana el marco Navidad (para siempre, en ese teléfono). */
const ADVIENTO = { desde: '2026-12-01', hasta: '2026-12-22', meta: 15, lista: [
  '1 árbol de Navidad azul', '3 bolas de Navidad moradas', '2 hallacas verdes', '1 pan de jamón marrón', '3 estrellas amarillas',
  '2 renos rosados', '1 muñeco de nieve naranja', '3 regalos rojos', '2 gorros navideños verdes', '1 campana morada', '3 velas azules',
  '2 galletas marrones', '1 trineo amarillo', '2 medias navideñas azules', '3 bastones de caramelo verdes', '1 corona navideña rosada',
  '2 tambores rojos', '1 cuatro venezolano marrón', '2 maracas moradas', '1 taza de chocolate rosada', '3 luces de Navidad naranja', '2 ángeles azules'] };
const LIMITE = 180, ANCHO = 648, ALTO = 700;

const leerLS = k => { try { return JSON.parse(localStorage.getItem('rcf.' + k)); } catch (e) { return null; } };
const guardarLS = (k, v) => { try { localStorage.setItem('rcf.' + k, JSON.stringify(v)); } catch (e) {} };
export function diaCaracas(d) { return new Date((d || new Date()).getTime() - 4 * 36e5).toISOString().slice(0, 10); }
export function adviento(dia) {
  dia = dia || diaCaracas();
  if (dia < ADVIENTO.desde || dia > ADVIENTO.hasta) return null;
  const n = Math.round((Date.parse(dia) - Date.parse(ADVIENTO.desde)) / 864e5);
  const hechas = (leerLS('chispas') || []).filter(d => d >= ADVIENTO.desde && d <= ADVIENTO.hasta);
  return { dia: n + 1, total: ADVIENTO.lista.length, meta: ADVIENTO.meta, hechas: hechas, hoyHecha: hechas.indexOf(dia) >= 0, chispa: ADVIENTO.lista[n],
           desde: ADVIENTO.desde, marco: navidadGanada() };
}
export function navidadGanada() {
  if (leerLS('marcoNavidad')) return true;
  const n = (leerLS('chispas') || []).filter(d => d >= ADVIENTO.desde && d <= ADVIENTO.hasta).length;
  if (n >= ADVIENTO.meta) { guardarLS('marcoNavidad', true); return true; }
  return false;
}
export function chispaDeHoy() {
  const dia = diaCaracas(), guardada = leerLS('chispa.' + dia);
  if (guardada && guardada.chispa) return guardada;
  const adv = adviento(dia);
  if (adv) return { chispa: adv.chispa, cambiada: false };
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
  hechas.push(dia); guardarLS('chispas', hechas.slice(-60)); navidadGanada();
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
      <div class="ch-tit"><span class="pill-ch">${adviento() ? '🎄 ADVIENTO · DÍA ' + adviento().dia + ' DE ' + adviento().total + ' · TU CHISPA ES…' : 'TU CHISPA DE HOY ES…'}</span><h2 id="ch-t">Dibuja ${esc(S.chispa)}</h2></div>
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
  /* Sorteo: las chispas pasan rápido en el centro de la pantalla y se van frenando hasta caer en la de hoy (~2 s). */
  function sortear(final, listo) {
    const t = $('#ch-t'), aviso = $('#ch-emp');
    const fin = () => { S.fase = 'lista'; t.textContent = 'Dibuja ' + final; t.removeAttribute('aria-busy'); aviso.textContent = 'Toca el lienzo para empezar ✏️'; pintarAbajo(); if (listo) listo(); };
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return fin();
    S.fase = 'sorteo'; t.setAttribute('aria-busy', 'true'); t.textContent = 'Sorteando…'; aviso.textContent = 'Sorteando tu chispa… 🎲'; pintarAbajo();
    const ov = document.createElement('div');
    ov.className = 'ch-sorteo'; ov.setAttribute('aria-hidden', 'true');
    ov.innerHTML = `<div class="ch-sorteo-caja"><span class="pill-ch">${adviento() ? '🎄 DÍA ' + adviento().dia + ' DE ' + adviento().total : 'TU CHISPA DE HOY ES…'}</span><b class="girando"></b><span class="ch-sorteo-dado">🎲</span></div>`;
    root.appendChild(ov);
    const b = ov.querySelector('b');
    let paso = 0, previo = '';
    const total = 14;
    const tick = () => {
      if (!root.contains(t)) { ov.remove(); return; }   // salió de la pantalla
      if (paso >= total) {
        b.classList.remove('girando'); b.textContent = 'Dibuja ' + final; b.classList.add('cae');
        ov.querySelector('.ch-sorteo-dado').textContent = '✨';
        setTimeout(() => { ov.classList.add('sale'); setTimeout(() => { ov.remove(); if (root.contains(t)) { fin(); t.classList.add('cae'); setTimeout(() => t.classList.remove('cae'), 700); } }, 300); }, 1100);
        return;
      }
      let o; do { o = POOL[Math.floor(Math.random() * POOL.length)]; } while (o === previo || o === final);
      previo = o; b.textContent = 'Dibuja ' + o; paso++;
      setTimeout(tick, 45 + paso * paso * 1.6);
    };
    tick();
  }
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
    if (S.fase === 'hecha' || S.fase === 'sorteo' || S.video) return;
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

  function marcoAbierto(m) { return m[5] === 'adviento' ? navidadGanada() : !m[5] || club; }
  function marcoVisible(m) { return m[5] !== 'adviento' || navidadGanada() || !!adviento(); }
  function bloqueadoNavidad() {
    const l = $('#ch-lock'), a = adviento();
    l.innerHTML = `🎄 El marco <b>Navidad</b> se gana haciendo ${ADVIENTO.meta} chispas del Adviento${a ? ' (llevas ' + a.hechas.length + ')' : ''}.`;
    l.hidden = false; clearTimeout(bloqueoT); bloqueoT = setTimeout(() => { l.hidden = true; }, 3500);
  }
  /* Marco Navidad: estrellitas (como la del logo), copos de nieve y el sello del Adviento. Todo dibujado con código. */
  function adornosNavidad(y, ancho) {
    const estrella = (cx, cy, r) => {
      const k = r * 0.3; y.beginPath();
      [[0, -r], [k, -k], [r, 0], [k, k], [0, r], [-k, k], [-r, 0], [-k, -k]].forEach((p, i) => i ? y.lineTo(cx + p[0], cy + p[1]) : y.moveTo(cx + p[0], cy + p[1]));
      y.closePath(); y.fillStyle = '#FFD60A'; y.fill(); y.lineWidth = 2.5; y.strokeStyle = '#0B0B0F'; y.stroke();
    };
    const copo = (cx, cy, r) => {
      y.save(); y.translate(cx, cy); y.strokeStyle = '#FFFFFF'; y.lineWidth = 3; y.lineCap = 'round';
      for (let i = 0; i < 6; i++) {
        y.rotate(Math.PI / 3); y.beginPath();
        y.moveTo(0, 0); y.lineTo(0, -r);
        y.moveTo(0, -r * 0.55); y.lineTo(-r * 0.28, -r * 0.8); y.moveTo(0, -r * 0.55); y.lineTo(r * 0.28, -r * 0.8);
        y.stroke();
      }
      y.restore();
    };
    // Solo en los bordes verdes de los lados: nada tapa el dibujo ni el texto.
    [[19, 120, 13], [ancho - 19, 330, 15], [19, 470, 12], [ancho - 19, 640, 13]].forEach(e => estrella(e[0], e[1], e[2]));
    [[ancho - 19, 160, 13], [19, 300, 14], [ancho - 19, 500, 12], [19, 640, 14]].forEach(e => copo(e[0], e[1], e[2]));
  }
  /* Sello del Adviento (medalla roja). */
  function selloAdviento(y, cx, cy, r) {
    const k = r / 74;
    y.save(); y.translate(cx, cy); y.rotate(-0.14);
    y.beginPath(); y.arc(0, 0, r, 0, Math.PI * 2); y.fillStyle = '#D62839'; y.fill(); y.lineWidth = 5 * k; y.strokeStyle = '#0B0B0F'; y.stroke();
    y.setLineDash([6 * k, 6 * k]); y.beginPath(); y.arc(0, 0, r - 12 * k, 0, Math.PI * 2); y.lineWidth = 2.5 * k; y.strokeStyle = '#FFFFFF'; y.stroke(); y.setLineDash([]);
    y.textAlign = 'center'; y.fillStyle = '#FFFFFF';
    y.font = '800 ' + Math.round(19 * k) + 'px Poppins, sans-serif'; y.fillText('ADVIENTO', 0, -14 * k);
    y.font = '700 ' + Math.round(15 * k) + 'px Quicksand, sans-serif'; y.fillText('de Chispas', 0, 6 * k);
    y.fillStyle = '#FFD60A'; y.font = '800 ' + Math.round(26 * k) + 'px Poppins, sans-serif'; y.fillText(ADVIENTO.desde.slice(0, 4), 0, 36 * k);
    y.restore();
  }
  function conMarco() {
    const m = MARCOS.find(f => f[0] === S.marco) || MARCOS[0];
    const o = document.createElement('canvas'); o.width = ANCHO + 80; o.height = ALTO + 200;
    const y = o.getContext('2d');
    y.fillStyle = m[2]; y.fillRect(0, 0, o.width, o.height);
    y.fillStyle = '#0B0B0F'; y.fillRect(34, 34, ANCHO + 12, ALTO + 12);
    y.drawImage(c, 40, 40);
    if (m[0] === 'navidad') {   // abajo: el sello a la izquierda y el texto alineado a su lado
      adornosNavidad(y, o.width);
      const adv = adviento(), base = ALTO + 46, x0 = 192, maxW = o.width - x0 - 40;
      selloAdviento(y, 104, base + 78, 62);
      const ajustar = (txt, peso, fs, fam) => { y.font = peso + ' ' + fs + 'px ' + fam; while (y.measureText(txt).width > maxW && fs > 14) { fs -= 2; y.font = peso + ' ' + fs + 'px ' + fam; } };
      y.textAlign = 'left';
      ajustar('#RetoMenteMilenial', '800', 40, 'Poppins, sans-serif'); y.fillStyle = m[4]; y.fillText('#RetoMenteMilenial', x0, base + 56);
      const t = adv ? 'Día ' + adv.dia + ' · ' + S.chispa : 'Chispa del día: ' + S.chispa;
      ajustar(t, '700', 28, 'Quicksand, sans-serif'); y.fillStyle = m[3]; y.fillText(t, x0, base + 98);
      y.font = '700 21px Quicksand, sans-serif'; y.fillStyle = '#CDEBD5'; y.fillText('Reto Creativo Fest', x0, base + 132);
      return o;
    }
    y.textAlign = 'center';
    y.fillStyle = m[4]; y.font = '800 40px Poppins, sans-serif'; y.fillText('#RetoMenteMilenial', o.width / 2, ALTO + 112);
    const adv = adviento();
    const linea = (adv ? 'Adviento de Chispas · día ' + adv.dia + ': ' : 'Chispa del día: ') + S.chispa;
    let fs = 30; y.font = '700 ' + fs + 'px Quicksand, sans-serif';
    while (y.measureText(linea).width > o.width - 48 && fs > 16) { fs -= 2; y.font = '700 ' + fs + 'px Quicksand, sans-serif'; }
    y.fillStyle = m[3]; y.fillText(linea, o.width / 2, ALTO + 156);
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
        const banco = adviento() ? ADVIENTO.lista : POOL;
        let n = Math.floor(Math.random() * banco.length); if (banco[n] === S.chispa) n = (n + 1) % banco.length;
        S.chispa = banco[n]; S.cambiada = true; guardarLS('chispa.' + diaCaracas(), { chispa: S.chispa, cambiada: true });
        sortear(S.chispa);
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
      <div class="marcos">${MARCOS.filter(marcoVisible).map(m => `<button type="button" class="marco" data-marco="${m[0]}" aria-pressed="${S.marco === m[0]}" style="background:${m[2]};color:${m[3]}">${m[1]}${marcoAbierto(m) ? '' : ' 🔒'}</button>`).join('')}</div>
      <button type="button" class="btn amarillo" id="ch-desc">⬇ GUARDAR O COMPARTIR</button>
      <button type="button" class="btn blanco chico" id="ch-video" ${S.video ? 'disabled' : ''}>🎬 Video acelerado${candado}</button>
      <button type="button" class="enlace" id="ch-salir">Volver a Hoy · mañana hay otra chispa</button>`;
    root.querySelectorAll('[data-marco]').forEach(b => b.addEventListener('click', () => {
      const m = MARCOS.find(f => f[0] === b.dataset.marco);
      if (m[5] === 'adviento' && !marcoAbierto(m)) return bloqueadoNavidad();
      if (!marcoAbierto(m)) return bloqueado('El marco ' + m[1]);
      S.marco = m[0]; pintarAbajo();
    }));
    $('#ch-desc').addEventListener('click', compartirOdescargar);
    $('#ch-video').addEventListener('click', video);
    $('#ch-salir').addEventListener('click', () => ctx.volver());
  }
  pintarReloj(); sortear(S.chispa);
  return () => parar();
}
