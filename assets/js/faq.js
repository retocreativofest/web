/* Preguntas frecuentes: para agregar o cambiar una pregunta, edita FAQ. */
/* Precios de preventa de los stands hasta el 6 de noviembre; el 7 cambian solos al precio regular. */
const PREVENTA = Date.now() < Date.parse('2026-11-07T00:00:00-04:00');
const FAQ = [
 {id:'categorias', t:'Categorías y cómo clasificar', c:'#FFD60A', q:[
  ['Ilustrador estrella: ¿cómo se gana?', `<p><b>Categoría principal · 1 ganador.</b> Para quien acumula más puestos de honor en los resultados semanales.</p><p><b>Cómo se clasifica:</b> cada 1.er lugar suma 3 puntos y cada 2.º o 3.er lugar suma 1. Gana quien tenga más puntos.</p><a class="act" href="reto-semanal.html">Ver «Así van los puntajes»</a>`],
  ['Ilustradores destacados: ¿cómo se gana?', `<p><b>Categoría principal · 3 ganadores.</b></p><p><b>Cómo se clasifica:</b> los tres con más puestos de honor (1.º, 2.º y 3.º), sin contar al ilustrador estrella.</p>`],
  ['Relámpago creativo: ¿cómo se gana?', `<p><b>Categoría principal · 1 ganador.</b></p><p><b>Cómo se clasifica:</b> quien más veces fue la primera persona en publicar cada semana.</p><p>Cuenta desde que el reto está disponible, incluido el acceso anticipado: los miembros del <b>Club Estrella</b> ven el reto 24 horas antes y pueden publicar desde ese momento. Participar es gratis siempre. Ten en cuenta que esas 24 horas también dan más tiempo para dibujar y para sumar «Me gusta».</p>`],
  ['Mejor ilustración digital: ¿cómo se gana?', `<p><b>Categoría principal · 4 nominados · 1 ganador.</b></p><p><b>Cómo se clasifica:</b> marca tu técnica como Digital al publicar. Las 4 ilustraciones digitales con más me gusta quedan nominadas y el jurado elige la ganadora.</p>`],
  ['Mejor ilustración tradicional: ¿cómo se gana?', `<p><b>Categoría principal · 4 nominados · 1 ganador.</b></p><p><b>Cómo se clasifica:</b> marca tu técnica como Tradicional al publicar. Las 4 ilustraciones tradicionales con más me gusta quedan nominadas y el jurado elige la ganadora.</p>`],
  ['Premio a la constancia: ¿cómo se gana?', `<p><b>Categoría principal · 1 ganador · rotativa por año.</b> No se puede sumar a otra categoría: quien la gana no gana otra. Es rotativa por año: quien la ganó no puede volver a ganarla en la siguiente edición del mismo año.</p><p><b>Cómo se clasifica:</b> quien participó en más semanas del periodo, seguidas o no.</p>`],
  ['Ilustración más interactiva: ¿cómo se gana?', `<p><b>Se puede sumar a otro premio · 1 ganador · rotativa por año.</b> Quien la ganó no puede volver a ganarla en la siguiente edición del mismo año.</p><p><b>Cómo se clasifica:</b> la ilustración con más me gusta del Padlet. Los votos se revisan para confirmar que son reales.</p>`],
  ['Elección de la comunidad: ¿cómo se gana?', `<p>Se vota el día del evento.</p>`],
  ['¿Puedo ganar más de una categoría?', `<p>Cada persona gana solo una categoría principal: Estrella, Destacados, Relámpago, Digital, Tradicional o Premio a la constancia.</p><p>Solo la <b>Ilustración más interactiva</b> se puede ganar además de una categoría principal. El Premio a la constancia y la Ilustración más interactiva son rotativas por año.</p>`],
  ['¿Qué pasa si hay un empate?', `<p>Gana quien tenga más primeros lugares; si sigue el empate, más segundos y terceros; luego, más me gusta.</p>`]
 ]},
 {id:'evento', t:'El evento', c:'#FFD60A', q:[
  ['¿Cuándo y dónde es el Reto Creativo Fest?', `<p>El <b>sábado 5 de diciembre</b>, de 10:00 a. m. a 4:00 p. m., en la Facultad de Ciencias Económicas y Sociales (FACES) de la Universidad Central de Venezuela, Caracas.</p><a class="act" href="index.html#programa">Ver el programa</a>`],
  ['¿La entrada tiene costo?', `<p>No. La entrada al festival es <b>gratuita</b>.</p><p>Para entrar a las <b>charlas con propósito</b> necesitas donar al menos <b>2 insumos nuevos de primera necesidad</b> (juguetes, alimentos, medicinas o material de arte) o adquirir la <b>Ruta creativa</b>.</p><a class="act" href="tienda.html">Comprar la Ruta creativa</a>`],
  ['¿Qué necesito para entrar a las charlas?', `<p>Tienes dos opciones:</p><ul><li>Donar al menos <b>2 insumos nuevos de primera necesidad</b>: juguetes, alimentos, medicinas o material de arte. Todo lo recolectado se entrega al Centro de Acopio de la UCV.</li><li>Adquirir la <b>Ruta creativa</b>.</li></ul>`],
  ['¿Hay estacionamiento?', `<p>Sí, hay estacionamiento. Tiene costo y no está incluido en la entrada.</p>`],
  ['¿Puedo ir con niños?', `<p>¡Claro! Los niños son bienvenidos, siempre que estén <b>supervisados por sus padres o representantes</b>. La Ruta creativa es una actividad apta para todo público.</p>`]
 ]},
 {id:'concurso', t:'Concurso en vivo', c:'#84D7DF', q:[
  ['¿Quién puede participar?', `<p>Personas de <b>15 años o más</b> que se inscriban en el formulario. Los menores de 18 necesitan la autorización de su representante.</p><a class="act" data-link="inscripcion" href="#">Inscribirme al concurso</a>`],
  ['¿Cómo funciona el concurso?', `<ul><li>Tienes <b>45 minutos</b> para hacer tu dibujo.</li><li>Hay <b>4 lotes de 12 personas</b>.</li><li>El jurado elige <b>4 ganadores</b>, que se anuncian en la premiación a las 3:00 p. m. en el Auditorio naranja.</li></ul>`],
  ['¿Qué técnicas se permiten?', `<p>Solo <b>técnica tradicional</b>, sin acuarelas ni acrílicos. La obra debe ser original, sin copias ni calcos, y no puedes usar el celular mientras dibujas.</p>`],
  ['¿Puedo llevar mis propios materiales?', `<p>Sí, y es lo recomendado: con tus propios materiales te sentirás más cómodo durante los 45 minutos. Recuerda que no se permiten acuarelas ni acrílicos.</p>`],
  ['¿Tengo que quedarme hasta la premiación?', `<p>Sí. Para recibir tu premio debes estar presente en la premiación a las 3:00 p. m. en el Auditorio naranja.</p>`]
 ]},
 {id:'reto', t:'Reto semanal', c:'#AA57F7', q:[
  ['¿Cómo participo en el #RetoMenteMilenial?', CONFIG.app
    ? `<p>Es gratis y se hace desde la <b>app del reto</b>, con <b>una sola cuenta</b>:</p><ol><li><b>Instala la app</b> y entra con tu cuenta de Google o con tu correo.</li><li><b>Completa tu perfil:</b> nombre, usuario en redes y si vives en Venezuela. Si eres menor, tu representante llena la autorización.</li><li><b>Mira el reto</b> el miércoles a las 8:00 p. m. (el Club Estrella lo ve el martes).</li><li><b>Dibuja</b> en digital o tradicional, sin IA, calcos ni copias.</li><li><b>Súbelo desde la app</b> antes del <b>lunes a las 8:00 p. m.</b> con título, descripción y técnica. Se publica sola en el Padlet.</li><li><b>Cuida tu racha</b>: los ganadores se anuncian el martes y suman puntos para el festival.</li></ol><a class="act" data-link="app" href="#">Abrir la app</a>`
    : `<p>Es gratis y se hace en el <b>Padlet</b>, con <b>una sola cuenta</b>:</p><ol><li><b>Mira el reto</b> el miércoles a las 8:00 p. m. en nuestras redes (el Club Estrella lo ve el martes).</li><li><b>Dibuja</b> en digital o tradicional, sin IA, calcos ni copias.</li><li><b>Abre el Padlet</b>, entra con tu cuenta y toca «+» en la sección de la semana.</li><li><b>En el título</b> pon tu nombre y tu usuario en redes; sube la imagen, escribe una descripción y marca tu técnica. Deja la tarjeta en blanco.</li><li><b>Publica antes del lunes a las 8:00 p. m.</b></li></ol><p>Desde diciembre se participa con la app del reto.</p><a class="act" href="reto-semanal.html#como-participar">Ver el paso a paso</a>`],
  ['¿Cómo instalo la app del reto?', CONFIG.app
    ? `<p>Es gratis y no está en las tiendas: se instala desde el navegador.</p><ul><li><b>iPhone:</b> ábrela en Safari, toca Compartir y elige «Agregar a inicio». Los avisos funcionan desde iOS 16.4.</li><li><b>Android:</b> ábrela en Chrome y toca «Instalar».</li></ul><p>Si llegaste desde Instagram o WhatsApp, abre el enlace en Safari o Chrome para poder instalarla.</p><a class="act" data-link="app" href="#">Abrir la app</a>`
    : `<p>La app llega el <b>1 de diciembre</b>, gratis para Android y iPhone. Te avisamos ese día por el canal de WhatsApp.</p><a class="act" data-link="canal" href="#">Unirme al canal</a>`],
  ['¿Quién puede ganar los premios?', `<p>Personas <b>venezolanas residentes en Venezuela</b>, con <b>una sola cuenta</b> por participante.</p>`],
  ['Soy menor de edad, ¿puedo participar en el reto semanal?', `<p>Sí. Los menores de 18 años participan con la <b>autorización de su representante</b>: debe llenar el formulario y confirmar el correo que le llega. Sin autorización puedes publicar, pero no puedes quedar entre las finalistas ni recibir premios.</p><p>Publica solo tu <b>nombre de pila y tu usuario</b>: nunca tu colegio, tu dirección ni fotos tuyas.</p><a class="act" data-link="autorizacion" href="#">Formulario de autorización</a>`],
  ['¿Cómo se eligen los ganadores?', `<p>Algunas categorías se ganan por puntos según tus puestos de cada semana, otras por me gusta, y Digital y Tradicional las decide el jurado.</p><a class="act" href="reto-semanal.html">Ver «Así van los puntajes»</a>`],
  ['¿Puedo usar IA, calcar o copiar?', `<p>No. Los <b>Guardianes del arte</b> revisan cada dibujo del Padlet para evitar IA, plagios y copias.</p>`],
  ['Gané en julio, ¿puedo volver a ganar?', `<p>Sí, en otra categoría. No puedes repetir la misma categoría que ganaste en julio.</p>`]
 ]},
 {id:'tienda', t:'Tienda', c:'#F0479B', q:[
  ['¿Cómo compro?', `<p>Arma tu pedido en la tienda de la web y envíalo por WhatsApp. Te confirmamos disponibilidad y pago por mensaje.</p><a class="act" href="tienda.html">Ir a la tienda</a>`],
  ['¿Cómo puedo pagar?', `<p>Los precios están en <b>USD a tasa BCV</b>. Aceptamos:</p><ul><li>Pago Móvil, a tasa BCV del día.</li><li>Binance</li><li>Zinli</li><li>PayPal (con comisión).</li></ul>`],
  ['¿Cuánto tarda mi pedido?', `<p>Los productos <b>bajo pedido</b> tardan alrededor de <b>1 semana</b> en estar listos. Luego se envían por MRW o se entregan en el evento, según lo que elijas.</p>`],
  ['¿Hacen envíos?', `<p>Sí, hacemos <b>envíos nacionales por MRW con cobro a destino</b>. Todos los productos se entregan por MRW, salvo que elijas retirarlos el día del evento.</p>`]
 ]},
 {id:'bazar', t:'Bazar creativo', c:'#6B3FA0', q:[
  ['¿Cuánto cuesta un stand?', PREVENTA ? `<p>Estos son los precios de <b>preventa</b>, válidos hasta el 6 de noviembre de 2026:</p><ul><li>Stand para artistas (1 × 1 m): <b>$20</b></li><li>Stand básico (1 × 1 m): <b>$30</b></li><li>Stand pro (1,5 × 1,5 m): <b>$40</b></li></ul><p>Se pagan en 2 cuotas. Desde el 7 de noviembre aplica el precio regular ($30, $40 y $50).</p><a class="act" href="bazar-creativo.html">Reservar mi stand</a>`
    : `<ul><li>Stand para artistas (1 × 1 m): <b>$30</b></li><li>Stand básico (1 × 1 m): <b>$40</b></li><li>Stand pro (1,5 × 1,5 m): <b>$50</b></li></ul><p>Puedes pagar completo o en 2 cuotas; la 2.ª vence el 1 de diciembre.</p><a class="act" href="bazar-creativo.html">Reservar mi stand</a>`],
  ['¿Cómo pago mi stand?', PREVENTA ? `<ul><li><b>Hasta el 6 de noviembre:</b> solo USD en efectivo, Binance, Zinli o PayPal (con comisión). No se aceptan bolívares.</li><li><b>Desde el 7 de noviembre:</b> también Pago Móvil. Si pagas completo, a tasa dólar BCV del día; si pagas en dos cuotas, a tasa euro BCV del día.</li></ul>`
    : `<p>USD en efectivo, Binance, Zinli, PayPal (con comisión) o Pago Móvil. Si pagas completo, a tasa dólar BCV del día; si pagas en dos cuotas, a tasa euro BCV del día. La 2.ª cuota vence el 1 de diciembre.</p>`],
  ['¿Qué incluye el stand?', `<p>Kit de bienvenida, promoción de tu marca en redes y fotos del evento. Cada marca debe donar 1 producto para el sorteo de la Ruta creativa.</p>`],
  ['¿Tengo que llevar mesa y silla?', `<p>Sí. Cada expositor lleva sus <b>propias mesas, sillas y mobiliario, sin excepción</b>, adaptados al tamaño de su espacio.</p>`]
 ]},
 {id:'comunidad', t:'Comunidad', c:'#C5A6D9', q:[
  ['¿Dónde veo los streams de @mentemilenial?', `<p>Lunes, miércoles y viernes a las <b>8:30 p. m. (hora de Venezuela)</b>, en TikTok, Twitch, YouTube y Kick.</p><a class="act" href="mente-milenial.html">Ver la semana en vivo</a>`],
  ['¿Cómo entro al Discord?', `<p>El Discord de Mente Milenial es exclusivo para miembros del Patreon de Reto Mente Milenial. Ahí puedes hablar con el equipo durante los streams, conocer el reto 24 horas antes y ver master class exclusivas.</p><a class="act" data-link="patreon" href="#">Ir a Patreon</a>`],
  ['Soy periodista o medio, ¿cómo me acredito?', `<p>Completa el formulario de <b>acreditación de prensa</b>. Revisamos cada solicitud y te confirmamos por correo y WhatsApp.</p><a class="act" href="index.html#prensa">Solicitar acreditación</a>`],
  ['¿Cómo puedo patrocinar el evento?', `<p>Tenemos paquetes desde <b>$20</b>, que puedes combinar con productos o servicios de tu marca.</p><a class="act" data-wa="¡Hola! Quiero conocer los paquetes de patrocinio del Reto Creativo Fest." href="#">Ver paquetes de patrocinio</a>`]
 ]}
];

/* Buscador con sinónimos: cada grupo reúne palabras que la gente usa para lo mismo. */
const SINONIMOS = [
  ['categoria','categorias','clasificar','clasifica','clasificacion','ranking','nominados'],
  ['prensa','periodista','medio','medios','acreditacion','acreditar','cobertura','entrevista'],
  ['fecha','cuando','dia','sabado','diciembre','hora','horario','horas','empieza','comienza','termina','programa','cronograma','agenda'],
  ['donde','lugar','ubicacion','direccion','sede','queda','ucv','faces','universidad','llegar','caracas'],
  ['costo','cuesta','precio','precios','pagar','pago','pagos','gratis','gratuita','gratuito','entrada','cobran','valor','tarifa','dolares','bolivares'],
  ['pago','pagar','metodo','metodos','binance','zinli','paypal','pagomovil','movil','transferencia','efectivo','bcv','tasa'],
  ['concurso','competencia','competir','participar','participo','inscribir','inscripcion','inscribirme','registro','registrar','formulario'],
  ['edad','anos','menor','menores','nino','ninos','hijo','hijos','representante','familia'],
  ['material','materiales','lapices','colores','tecnica','tecnicas','acuarela','acrilico','tradicional','digital'],
  ['premio','premios','ganar','ganador','ganadores','gane','premiacion','categoria','categorias','jurado','puntos','puntaje','puntajes'],
  ['reto','padlet','semanal','semana','retomentemilenial','subir','publicar','dibujo','app','aplicacion','instalar','descargar'],
  ['ia','inteligencia','artificial','copiar','calcar','calco','plagio','copia'],
  ['tienda','comprar','compra','producto','productos','pedido','franela','camisa','sticker','stickers','guante','ruta','tote','totebag'],
  ['envio','envios','enviar','mrw','delivery','despacho','tarda','tiempo','entrega','llega','retirar'],
  ['stand','stands','bazar','expositor','exponer','vender','emprendimiento','emprendedor','marca','mesa','silla','mobiliario','caballete'],
  ['charla','charlas','insumos','donar','donacion','acopio','alimentos','juguetes','medicinas'],
  ['estacionamiento','parking','carro','estacionar','aparcar'],
  ['stream','streams','vivo','directo','twitch','youtube','kick','tiktok','transmision'],
  ['discord','patreon','comunidad','suscripcion','miembro'],
  ['patrocinar','patrocinio','patrocinador','paquete','paquetes','kit','medios','auspiciar','aliado']
];
const VACIAS = new Set('que como cual cuales es son el la los las lo un una unos unas de del en y o a al por para con sin se me mi mis te tu tus yo hay puedo puede tengo tiene necesito quiero saber sobre si ya esta este esto eso'.split(' '));
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const words = s => norm(s).replace(/[^a-z0-9ñ]+/g, ' ').trim().split(/\s+/).filter(Boolean);
const raiz = w => w.length > 4 ? w.replace(/(es|s)$/, '') : w;
function expandir(tok){
  const set = new Set([tok]);
  SINONIMOS.forEach(g => { if (g.some(x => raiz(x) === raiz(tok))) g.forEach(x => set.add(x)); });
  return [...set];
}
function puntaje(qTokens, texto){
  const ws = words(texto).map(raiz);
  let s = 0;
  qTokens.forEach(alts => { if (alts.some(a => { const r = raiz(a); return ws.some(w => w === r || (r.length >= 4 && w.startsWith(r))); })) s++; });
  return s;
}

(function(){
  let topic = 'todo', query = '';
  const strip = h => h.replace(/<[^>]+>/g, ' ');
  function renderTopics(){
    const all = FAQ.reduce((s, g) => s + g.q.length, 0);
    const items = [{id:'todo', t:'Todas', c:'#FFFFFF', n:all}, ...FAQ.map(g => ({id:g.id, t:g.t, c:g.c, n:g.q.length}))];
    $('#topics').innerHTML = '<h2>Temas</h2>' + items.map(i => `<button class="t" type="button" style="--c:${i.c}" aria-pressed="${topic===i.id}" data-id="${i.id}"><span class="ic"><span class="dot" aria-hidden="true"></span>${i.t}</span><span class="n">${i.n}</span></button>`).join('');
    $$('#topics .t').forEach(b => b.onclick = () => { topic = b.dataset.id; renderTopics(); render(); });
  }
  const item = (p, a, open) => `<details${open ? ' open' : ''}><summary>${p}<span class="pm" aria-hidden="true"></span></summary><div class="ans">${a}</div></details>`;
  function render(){
    const toks = words(query).filter(w => !VACIAS.has(w)).map(expandir);
    const groups = FAQ.filter(g => topic === 'todo' || g.id === topic);
    if (!toks.length){
      $('#list').innerHTML = groups.map(g => `<section class="group" style="--c:${g.c}" aria-labelledby="g-${g.id}"><h2 id="g-${g.id}"><span class="bar" aria-hidden="true"></span>${g.t}</h2>${g.q.map(([p, a]) => item(p, a, false)).join('')}</section>`).join('');
      $('#none').hidden = true; wireLinks(); return;
    }
    const res = [];
    groups.forEach(g => g.q.forEach(([p, a]) => { const s = 2 * puntaje(toks, p) + puntaje(toks, g.t + ' ' + strip(a)); if (s) res.push({g, p, a, s}); }));
    res.sort((x, y) => y.s - x.s);
    const top = res.length ? res[0].s : 0;
    const shown = res.filter(r => r.s >= Math.max(1, Math.ceil(top * 0.6)));
    $('#list').innerHTML = shown.length ? `<p class="results-h">${shown.length === 1 ? '1 respuesta' : shown.length + ' respuestas'} para «${esc(query.trim())}»</p>` +
      shown.map((r, k) => `<div class="group" style="--c:${r.g.c};margin-bottom:0">${item(r.p, r.a, k === 0)}</div>`).join('') : '';
    $('#none').hidden = shown.length > 0;
    wireLinks();
  }
  $('#q').addEventListener('input', e => { query = e.target.value; $('#clear').hidden = !query; render(); });
  $('#clear').onclick = () => { $('#q').value = ''; query = ''; $('#clear').hidden = true; render(); $('#q').focus(); };
  renderTopics(); render();
})();
