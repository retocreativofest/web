/* Personaje de la app (avatar armable), 6 nov 2026.
   Forma, ojos, cabello, accesorio y color. Nadie sube fotos (hay menores y la app es para todo público en Google Play).
   Las opciones de CLUB son solo para el Club Estrella; a quien no es del Club nunca le tocan al azar. */
const FORMAS={
 circulo:'<circle cx="50" cy="51" r="31"/>',
 cuadro:'<rect x="21" y="21" width="58" height="58" rx="17"/>',
 fantasma:'<path d="M21 81V50a29 29 0 0 1 58 0v31z"/>',
 gota:'<path d="M50 18C68 36 82 48 82 62a32 22 0 0 1-64 0c0-14 14-26 32-44z"/>',
 nube:'<g><circle cx="35" cy="58" r="18"/><circle cx="65" cy="58" r="18"/><circle cx="50" cy="40" r="20"/><rect x="25" y="55" width="50" height="23" rx="11"/></g>',
 flor:'<g><circle cx="50" cy="32" r="13"/><circle cx="68" cy="45" r="13"/><circle cx="61" cy="67" r="13"/><circle cx="39" cy="67" r="13"/><circle cx="32" cy="45" r="13"/><circle cx="50" cy="51" r="19"/></g>',
 corazon:'<path d="M50 83C25 67 17 55 17 42a16.5 16.5 0 0 1 33-7a16.5 16.5 0 0 1 33 7c0 13-8 25-33 41z"/>',
 sol:'<path d="'+(()=>{let p='';for(let i=0;i<24;i++){const a=i*Math.PI/12-Math.PI/2,r=i%2?25:33;p+=(i?'L':'M')+(50+r*Math.cos(a)).toFixed(1)+' '+(51+r*Math.sin(a)).toFixed(1)}return p+'z'})()+'"/>'
};
/* dónde empieza la forma por arriba: ahí se apoya el cabello, siempre centrado (x = 50) */
const TOPE={circulo:20,cuadro:21,fantasma:21,flor:19,corazon:34,sol:18,gota:19,nube:20};
const OJOS={
 locos:'<circle cx="38.5" cy="53" r="8.5" fill="#fff"/><circle cx="60.5" cy="47" r="12.5" fill="#fff"/><circle cx="35.5" cy="50" r="4"/><circle cx="64.5" cy="52" r="5.4"/>',
 grandes:'<circle cx="40" cy="50" r="9.5" fill="#fff"/><circle cx="60" cy="50" r="9.5" fill="#fff"/><circle cx="42" cy="52" r="4.6"/><circle cx="62" cy="52" r="4.6"/>',
 felices:'<path d="M34 52q6-8 12 0M54 52q6-8 12 0" fill="none" stroke="#0B0B0F" stroke-width="3.6" stroke-linecap="round"/><path d="M44 62q6 5 12 0" fill="none" stroke="#0B0B0F" stroke-width="3" stroke-linecap="round"/>',
 lado:'<ellipse cx="40" cy="50" rx="9" ry="7" fill="#fff"/><ellipse cx="60" cy="50" rx="9" ry="7" fill="#fff"/><circle cx="45" cy="50" r="4"/><circle cx="65" cy="50" r="4"/>',
 flor:'<ellipse cx="40" cy="52" rx="9" ry="7" fill="#fff"/><ellipse cx="60" cy="52" rx="9" ry="7" fill="#fff"/><circle cx="42.5" cy="55" r="4.3"/><circle cx="57.5" cy="55" r="4.3"/><path d="M29 52Q37 45 51 50V43H29zM49 50Q63 45 71 52V43H49z" fill="currentColor"/>',
 uno:'<circle cx="50" cy="50" r="12" fill="#fff"/><circle cx="51" cy="51" r="6"/><circle cx="53" cy="48.5" r="1.8" fill="#fff"/>',
 timidos:'<path d="M31 48h18a9 8.5 0 0 1-18 0z" fill="#fff"/><path d="M51 48h18a9 8.5 0 0 1-18 0z" fill="#fff"/><path d="M38 48h9a4.5 5 0 0 1-9 0zM58 48h9a4.5 5 0 0 1-9 0z"/>',
 tres:'<circle cx="39" cy="43" r="7.5" fill="#fff"/><circle cx="41" cy="60" r="7" fill="#fff"/><circle cx="60" cy="51" r="8.5" fill="#fff"/><circle cx="41" cy="44.5" r="3.6"/><circle cx="43" cy="61.5" r="3.4"/><circle cx="62" cy="53" r="4.2"/>'
};
const P='fill="none" stroke="#0B0B0F" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"';
/* cabello dibujado con la base en y = 0 y centrado en x = 50; se sube hasta el tope de cada forma */
const PELO={
 nada:'',
 rulos:'<path '+P+' d="M32 3c-5-10 7-13 6-3c2-10 12-10 12 0c0-10 10-10 12 0c-1-10 11-7 6 3"/>',
 mechon:'<path '+P+' d="M50 2c-1-9 7-14 9-8c1 5-5 6-6 1"/>',
 pelitos:'<path '+P+' d="M41 2l-2-11M47 1l-1-12M53 1l1-12M59 2l2-11"/>',
 picos:'<path '+P+' d="M31 7l5-14 7 9 7-13 7 13 7-9 5 14"/>',
 corona:'<path d="M36 1l-2-14 9 7 7-11 7 11 9-7-2 14z" fill="#0B0B0F" stroke="#0B0B0F" stroke-width="2.2" stroke-linejoin="round"/>',
 antenas:'<path '+P+' d="M45 2l-6-12M55 2l6-12"/><circle cx="38" cy="-12" r="3.5"/><circle cx="62" cy="-12" r="3.5"/>',
 corazon:'<path d=\"M50 1L41-8c-4-4 0-10 5-8l4 3 4-3c5-2 9 4 5 8z\" fill=\"#0B0B0F\" stroke="#0B0B0F" stroke-width="2.4" stroke-linejoin="round"/>'
};
const CLUB={acc:['corbata','pajarita','bigote','lazo','lentes','mejillas','mono'],forma:['flor','corazon','sol'],ojos:['uno','timidos','tres'],pelo:['corona','antenas','corazon']};
const S2='stroke="#0B0B0F" stroke-width="2.2" stroke-linejoin="round"';
/* accesorios: solo Club Estrella. t = tope de la forma (para el lazo) */
const ACC={
 nada:t=>'',
 corbata:t=>'<path d="M46 66h8l-2 4 4 13-6 5-6-5 4-13z" fill="#0B0B0F" '+S2+'/>',
 pajarita:t=>'<path d="M50 74l-12-7v14zM50 74l12-7v14z" fill="#0B0B0F" '+S2+'/><circle cx="50" cy="74" r="3.4" fill="#0B0B0F"/>',
 bigote:t=>'<path d="M50 61c-4-4-11-5-15 1 5 1 10 2 15-1zM50 61c4-4 11-5 15 1-5 1-10 2-15-1z" fill="#0B0B0F"/>',
 lazo:t=>'<g transform="translate(64 '+(t+4)+') rotate(18)"><path d="M0 0l-10-7v14zM0 0l10-7v14z" fill="#0B0B0F" '+S2+'/><circle r="3.4" fill="#0B0B0F"/></g>',
 lentes:t=>'<circle cx="36.5" cy="51" r="13" fill="none" stroke="#0B0B0F" stroke-width="3.6"/><circle cx="63.5" cy="51" r="13" fill="none" stroke="#0B0B0F" stroke-width="3.6"/><path d="M49.5 48q.5-2 1 0M23.5 49l-4-2M76.5 49l4-2" fill="none" stroke="#0B0B0F" stroke-width="3.6" stroke-linecap="round"/>',
 mejillas:t=>'<ellipse cx="31" cy="61" rx="5.5" ry="3.4" fill="#E53935" opacity=".8"/><ellipse cx="69" cy="61" rx="5.5" ry="3.4" fill="#E53935" opacity=".8"/>',
 mono:t=>'<path d="M50 '+(t+2)+'v-5" fill="none" stroke="#0B0B0F" stroke-width="3.4" stroke-linecap="round"/><circle cx="50" cy="'+(t-10)+'" r="7" fill="#0B0B0F"/>'};
const COL=['#FFD60A','#F0479B','#84D7DF','#AA57F7','#FF9F43','#4CC38A','#4D7CFE','#C5A6D9'];

const r = a => a[Math.floor(Math.random() * a.length)];
const K = o => Object.keys(o);
const libres = (o, k) => K(o).filter(x => !(CLUB[k] || []).includes(x) && x !== 'nada');
export const OPCIONES = { forma: K(FORMAS), ojos: K(OJOS), pelo: K(PELO), acc: K(ACC), color: COL };
export const esDelClub = (k, v) => (CLUB[k] || []).includes(v);
export function nuevo() { return { forma: r(libres(FORMAS, 'forma')), ojos: r(libres(OJOS, 'ojos')), pelo: r(['nada', ...libres(PELO, 'pelo')]), acc: 'nada', color: r(COL) }; }
/* Deja solo valores que existen; si no es del Club, cambia lo exclusivo por algo libre. */
export function limpiar(x, club) {
  const b = nuevo(), y = Object.assign({}, b, x || {});
  if (!FORMAS[y.forma]) y.forma = b.forma; if (!OJOS[y.ojos]) y.ojos = b.ojos; if (!(y.pelo in PELO)) y.pelo = 'nada'; if (!(y.acc in ACC)) y.acc = 'nada'; if (COL.indexOf(y.color) < 0) y.color = b.color;
  if (!club) { if (esDelClub('forma', y.forma)) y.forma = b.forma; if (esDelClub('ojos', y.ojos)) y.ojos = b.ojos; if (esDelClub('pelo', y.pelo)) y.pelo = 'nada'; if (esDelClub('acc', y.acc)) y.acc = 'nada'; }
  return { forma: y.forma, ojos: y.ojos, pelo: y.pelo, acc: y.acc, color: y.color };
}
export function svg(x, box) {
  return `<svg viewBox="${box || '0 0 100 100'}" aria-hidden="true"><g transform="translate(6 8) scale(.88)"><g fill="${x.color}">${FORMAS[x.forma] || ''}</g><g fill="#0B0B0F" color="${x.color}">${OJOS[x.ojos] || ''}</g><g transform="translate(0 ${TOPE[x.forma] || 20})">${PELO[x.pelo] || ''}</g>${(ACC[x.acc] || ACC.nada)(TOPE[x.forma] || 20)}</g></svg>`;
}
/* Miniatura para los botones del editor: solo la parte que se elige. */
export function muestra(k, v, color) {
  const gris = '#d9d2e3';
  if (v === 'nada') return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M30 30l40 40M70 30L30 70" stroke="#bbb" stroke-width="5" stroke-linecap="round"/></svg>';
  if (k === 'forma') return svg({ forma: v, ojos: '', pelo: 'nada', acc: 'nada', color });
  if (k === 'ojos') return svg({ forma: 'circulo', ojos: v, pelo: 'nada', acc: 'nada', color: gris }, '20 29 60 44');
  if (k === 'pelo') return svg({ forma: 'circulo', ojos: '', pelo: v, acc: 'nada', color: gris }, '14 -2 72 72');
  return svg({ forma: 'circulo', ojos: '', pelo: 'nada', acc: v, color: gris }).replace('<g fill="#0B0B0F" color="' + gris + '"></g>', '<g fill="#0B0B0F"><circle cx="41" cy="51" r="3.5"/><circle cx="59" cy="51" r="3.5"/></g>');
}
