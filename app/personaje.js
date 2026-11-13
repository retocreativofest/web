/* Personaje de la app (avatar armable), 6 nov 2026.
   Forma, ojos, boca, cabello, accesorio y color. Nadie sube fotos (hay menores y la app es para todo público en Google Play).
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
/* 13 nov 2026: ojos nuevos y bocas (aprobados por Stefany con maqueta). «locos» y «uno» son los de siempre.
   Los nuevos se dibujan en una rejilla propia (centro de los ojos en 0,0) y EJ los coloca en la cara. */
const EJ=s=>'<g transform="translate(50 49) scale(.68)">'+s+'</g>';
const DOS=(d,f)=>'<g transform="translate(-'+d+' 0)">'+f(-1)+'</g><g transform="translate('+d+' 0)">'+f(1)+'</g>';
const LIN='fill="none" stroke="#0B0B0F" stroke-linecap="round"';
const OJOS={
 redondos:EJ(DOS(19,()=>'<circle r="12.5" fill="#fff"/><circle r="9.5"/>')),
 locos:'<circle cx="38.5" cy="53" r="8.5" fill="#fff"/><circle cx="60.5" cy="47" r="12.5" fill="#fff"/><circle cx="35.5" cy="50" r="4"/><circle cx="64.5" cy="52" r="5.4"/>',
 arriba:EJ(DOS(18,()=>'<circle r="13" fill="#fff"/><path d="M12.43 -3.82A9.5 9.5 0 1 1 -2.48 -12.76A13 13 0 0 1 12.43 -3.82z"/>')),
 domo:EJ(DOS(18,()=>'<path d="M-13.5 6a13.5 13.5 0 0 1 27 0z" fill="#fff"/><path d="M-10.5 6a10.5 10.5 0 0 1 21 0z"/>')),
 gato:EJ(DOS(18,()=>'<path d="M-14 0q14 -15 28 0q-14 15 -28 0z" fill="#fff"/><path d="M-0.39 7.49Q-5.61 7.34 -10.84 3.01A7 7 0 1 1 -0.39 7.49z"/><path '+LIN+' stroke-width="3.2" d="M-6 -7l-3 -9M0 -8.5v-10M6 -7l3 -9"/>')),
 bizcos:EJ(DOS(14.5,s=>'<circle r="14" fill="#fff"/><ellipse cx="'+(-s*6)+'" cy="1" rx="7.5" ry="10.3"/>')),
 uno:'<circle cx="50" cy="50" r="12" fill="#fff"/><circle cx="51" cy="51" r="6"/><circle cx="53" cy="48.5" r="1.8" fill="#fff"/>'
};
/* ojos que ya no existen: cada uno pasa al nuevo más parecido (los personajes guardados no se quedan sin ojos) */
const VIEJOS={grandes:'redondos',felices:'domo',lado:'arriba',flor:'gato',timidos:'bizcos',tres:'uno'};
/* bocas: siempre debajo de los ojos; todas libres */
const BOCA={
 nada:'',
 linea:EJ('<path '+LIN+' stroke-width="3.8" d="M-4.5 22h9"/>'),
 sonrisa:EJ('<path '+LIN+' stroke-width="3.8" d="M-4.5 20q4.5 6 9 0"/>'),
 abierta:EJ('<path d="M-8.5 17q8.5 3 17 0q0 11 -8.5 11q-8.5 0 -8.5 -11z"/><path fill="#FF8FB8" d="M-5.9 25.8L-6.4 25.2L-6.6 24.9L-5.9 24.5L-5.1 24.1L-4.3 23.8L-3.4 23.6L-2.5 23.5L-1.5 23.5L-0.6 23.6L0.3 23.8L1.1 24.1L1.9 24.5L2.6 24.9L3.1 25.4L3.5 26.0L3.8 26.6L4.0 27.2L3.4 27.4L2.7 27.7L2.0 27.8L1.2 27.9L0.4 28.0L-0.4 28.0L-1.2 27.9L-2.0 27.8L-2.7 27.7L-3.4 27.4L-4.0 27.2L-4.6 26.8L-5.2 26.5L-5.7 26.0z"/>')
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
const CLUB={acc:['corbata','pajarita','bigote','lazo','lentes','mejillas','mono'],forma:['flor','corazon','sol'],ojos:['bizcos','uno'],pelo:['corona','antenas','corazon']};
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
export const OPCIONES = { forma: K(FORMAS), ojos: K(OJOS), boca: K(BOCA), pelo: K(PELO), acc: K(ACC), color: COL };
export const esDelClub = (k, v) => (CLUB[k] || []).includes(v);
export function nuevo() { return { forma: r(libres(FORMAS, 'forma')), ojos: r(libres(OJOS, 'ojos')), boca: r(K(BOCA)), pelo: r(['nada', ...libres(PELO, 'pelo')]), acc: 'nada', color: r(COL) }; }
/* Deja solo valores que existen; si no es del Club, cambia lo exclusivo por algo libre. */
export function limpiar(x, club) {
  const b = nuevo(), y = Object.assign({}, b, x || {});
  /* personajes de antes del 13 nov: no traen boca (quedan sin boca; «felices» traía su sonrisa) y pueden traer ojos viejos */
  if (!(x && x.boca in BOCA)) y.boca = x ? (x.ojos === 'felices' ? 'sonrisa' : 'nada') : b.boca;
  if (VIEJOS[y.ojos]) y.ojos = VIEJOS[y.ojos];
  if (!FORMAS[y.forma]) y.forma = b.forma; if (!OJOS[y.ojos]) y.ojos = b.ojos; if (!(y.pelo in PELO)) y.pelo = 'nada'; if (!(y.acc in ACC)) y.acc = 'nada'; if (COL.indexOf(y.color) < 0) y.color = b.color;
  if (!club) { if (esDelClub('forma', y.forma)) y.forma = b.forma; if (esDelClub('ojos', y.ojos)) y.ojos = b.ojos; if (esDelClub('pelo', y.pelo)) y.pelo = 'nada'; if (esDelClub('acc', y.acc)) y.acc = 'nada'; }
  return { forma: y.forma, ojos: y.ojos, boca: y.boca, pelo: y.pelo, acc: y.acc, color: y.color };
}
export function svg(x, box) {
  return `<svg viewBox="${box || '0 0 100 100'}" aria-hidden="true"><g transform="translate(6 8) scale(.88)"><g fill="${x.color}">${FORMAS[x.forma] || ''}</g><g fill="#0B0B0F" color="${x.color}">${OJOS[x.ojos] || OJOS[VIEJOS[x.ojos]] || ''}${x.ojos === 'uno' && BOCA[x.boca] ? '<g transform="translate(0 3)">' + BOCA[x.boca] + '</g>' : BOCA[x.boca] || ''}</g><g transform="translate(0 ${TOPE[x.forma] || 20})">${PELO[x.pelo] || ''}</g>${(ACC[x.acc] || ACC.nada)(TOPE[x.forma] || 20)}</g></svg>`;
}
/* Miniatura para los botones del editor: solo la parte que se elige. */
export function muestra(k, v, color) {
  const gris = '#d9d2e3';
  if (v === 'nada') return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M30 30l40 40M70 30L30 70" stroke="#bbb" stroke-width="5" stroke-linecap="round"/></svg>';
  if (k === 'forma') return svg({ forma: v, ojos: '', pelo: 'nada', acc: 'nada', color });
  if (k === 'ojos') return svg({ forma: 'circulo', ojos: v, pelo: 'nada', acc: 'nada', color: gris }, '20 29 60 44');
  if (k === 'boca') return svg({ forma: 'circulo', ojos: '', boca: v, pelo: 'nada', acc: 'nada', color: gris }, '20 29 60 44').replace('<g fill="#0B0B0F" color="' + gris + '">', '<g fill="#0B0B0F" color="' + gris + '"><circle cx="41" cy="49" r="3.5"/><circle cx="59" cy="49" r="3.5"/>');
  if (k === 'pelo') return svg({ forma: 'circulo', ojos: '', pelo: v, acc: 'nada', color: gris }, '14 -2 72 72');
  return svg({ forma: 'circulo', ojos: '', pelo: 'nada', acc: v, color: gris }).replace('<g fill="#0B0B0F" color="' + gris + '"></g>', '<g fill="#0B0B0F"><circle cx="41" cy="51" r="3.5"/><circle cx="59" cy="51" r="3.5"/></g>');
}
