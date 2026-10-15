/* Tabla «Así van los premios».
   Fuente: la hoja pública del Tablero RCF 2026. Si CONFIG.premiosCSV tiene el enlace CSV publicado
   en Google Sheets, la página lee los datos en vivo; si no, usa la copia de assets/js/premios-datos.js. */
(function(){
  const ORDEN = [
    {k:'ilustrador estrella',          h:'h-yellow', pill:'1 ganador'},
    {k:'premio a la constancia',       h:'h-soft',   pill:'1 ganador'},
    {k:'ilustración más interactiva',  h:'h-lav',    pill:'1 ganador'},
    {k:'mejor ilustración digital',    h:'h-cyan',   pill:'1 ganador · 4 nominados'},
    {k:'mejor ilustración tradicional',h:'h-pink',   pill:'1 ganador · 4 nominados'},
    {k:'ilustradores destacados',      h:'h-purple', pill:'3 ganadores'},
    {k:'relámpago creativo',           h:'h-cream',  pill:'1 ganador'}
  ];
  const STATUS = ['Va ganando','En carrera','Nominado','Por definir'];

  function parse(rows){
    const out = {lead:'', cats:[], legal:''};
    let i = 2; out.lead = (rows[i++] || [''])[0];
    while (i < rows.length && rows[i][0] !== 'Reglas en 30 segundos') i++;
    i++;
    while (i < rows.length && rows[i].length === 2) i++;
    let cat = null;
    for (; i < rows.length; i++){
      const r = rows[i];
      if (STATUS.includes(r[0])){ cat && cat.items.push({status:r[0], who:r[1] || '', det:r.slice(2).join(' ')}); continue; }
      if (r.length === 1 && /^Sujeto a/i.test(r[0])){ out.legal = r[0]; continue; }
      if (r.length === 1){
        if (cat && !cat.def && !cat.items.length){ cat.def = r[0]; continue; }
        cat = {name:r[0].replace(/\s*\(\d+ premios?\)\s*$/,''), def:'', items:[]}; out.cats.push(cat);
      }
    }
    return out;
  }
  function splitName(s){
    const m = s.match(/^(.*?)\s*\(([^()]*)\)\s*$/);
    if (!m) return {n:s, h:''};
    return {n:m[1], h:m[2].replace(/^[^:]+:\s*/, '')};
  }
  function splitDet(s){
    s = s.replace(/\s+/g,' ').trim();
    let m = s.match(/^([^()·]+?)\s*\((.*)\)\s*$/); if (m) return {v:m[1], rest:m[2]};
    m = s.match(/^(.+?)\s*·\s*(.*)$/); return m ? {v:m[1], rest:m[2]} : {v:s, rest:''};
  }
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  function render(rows){
    const d = parse(rows);
    const w = d.lead.match(/semana (\d+) de (\d+)/i);
    if (w){
      const a = +w[1], b = +w[2], bar = $('#weekBar');
      $('#weekTxt').textContent = `Semana ${a} de ${b}`;
      bar.setAttribute('aria-valuenow', a); bar.setAttribute('aria-valuemax', b);
      requestAnimationFrame(() => requestAnimationFrame(() => { $('#weekFill').style.width = Math.round(a / b * 100) + '%'; }));
    }
    const cats = ORDEN.map(o => ({o, c:d.cats.find(c => c.name.toLowerCase().startsWith(o.k))})).filter(x => x.c);
    const html = cats.map(({o, c}) => `<article class="cat"><header class="${o.h}"><h3>${esc(cap(c.name))}</h3><span class="pill">${esc(o.pill)}</span></header>
      <p class="def">${esc(c.def)}</p><ol>${c.items.map(it => {
        if (it.status === 'Por definir') return '<li><span class="who">Puesto abierto</span><div class="det">Aún hay espacio para entrar a la nominación.</div></li>';
        const nm = splitName(it.who), dt = splitDet(it.det);
        return `<li class="${it.status === 'Va ganando' ? 'win' : ''}"><span class="who">${esc(nm.n)}${nm.h ? ' ' + esc(nm.h) : ''}</span><div class="det"><b>${esc(dt.v)}</b> ${esc(dt.rest)}</div></li>`;
      }).join('')}</ol></article>`).join('');
    $('#cats').innerHTML = html + $('#rulesTpl').innerHTML;
    if (d.legal) $('#legal').textContent = d.legal;
  }

  function csvRows(text){
    const rows = []; let row = [], cell = '', q = false;
    for (let i = 0; i < text.length; i++){
      const ch = text[i];
      if (q){ if (ch === '"'){ if (text[i+1] === '"'){ cell += '"'; i++; } else q = false; } else cell += ch; }
      else if (ch === '"') q = true;
      else if (ch === ','){ row.push(cell); cell = ''; }
      else if (ch === '\n' || ch === '\r'){ if (ch === '\r' && text[i+1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
      else cell += ch;
    }
    if (cell || row.length){ row.push(cell); rows.push(row); }
    return rows.map(r => r.map(c => c.trim()).filter(Boolean)).filter(r => r.length);
  }

  render(window.RCF_PREMIOS || []);
  if (CONFIG.premiosCSV){
    fetch(CONFIG.premiosCSV, {cache:'no-store'}).then(r => r.ok ? r.text() : Promise.reject())
      .then(t => { const rows = csvRows(t); if (rows.length > 10) render(rows); }).catch(() => {});
  }
})();
