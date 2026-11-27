/* Preguntas frecuentes: para agregar o cambiar una pregunta, edita FAQ (hasta el festival) o FAQ_POST (desde el 6 dic, CONFIG.postEvento). */
/* Precios de preventa de los stands hasta el 6 de noviembre; el 7 cambian solos al precio regular. */
const PREVENTA = Date.now() < Date.parse('2026-11-07T00:00:00-04:00');
/* 21 nov 2026 (Diego): desde el lunes 30 nov ya no hay Ruta creativa en línea (CONFIG.preventaFin en rcf.js). 27 nov: los cupos del concurso se agotaron (texto fijo en «¿Quién puede participar?»). */
const EN_LINEA = Date.now() < Date.parse(CONFIG.preventaFin);
/* Originalidad (15 nov 2026): criterios de los Guardianes del arte. Van en la sección «Reto semanal», antes y después del festival. */
const ORIGINALIDAD = [
  ['¿Cómo uso una referencia sin que cuente como copia?', `<p>Usar referencias (fotos, poses, anatomía, lugares) es parte del oficio y se vale. <b>Para que sea una referencia válida, tienes que cambiar la pose o la composición, o añadir elementos propios que la transformen en una obra nueva.</b></p><p>Si tu dibujo es una copia fiel de la referencia, no podemos aceptarlo en la galería, por respeto a los derechos del autor original y a los demás participantes que crearon sus diseños desde cero.</p><p>Si usaste una foto de otra persona como referencia, te recomendamos contarlo en la descripción.</p>`],
  ['¿Cómo saben los Guardianes si un dibujo es plagio?', `<p>Hay plagio cuando se toma el diseño de personaje, la composición exacta o una solución visual única de otro artista y se presenta como propia, <b>aunque esté redibujada desde cero y en otro estilo</b>. Revisan:</p><ul><li><b>Diseño de personaje idéntico:</b> la misma combinación de rasgos (peinado, cicatrices, paleta de colores, silueta y accesorios) que el personaje original (OC) de otro artista.</li><li><b>Composición clonada:</b> la misma perspectiva, la misma ubicación de los elementos, la misma pose y la misma iluminación que otra ilustración. Los «dibuja esto en tu estilo» (DTIYS) tampoco se aceptan, aunque des crédito: el diseño sigue siendo de otra persona.</li><li><b>Recortes de obras ajenas:</b> texturas, fondos, sellos o elementos decorativos sacados de la obra de otro artista. Los pinceles y texturas que compras o descargas para usar libremente sí se valen.</li><li><b>Coherencia del diseño:</b> si hay dudas sobre un personaje, podemos pedirte que lo dibujes desde otro ángulo o con otra expresión. Quien lo creó sabe cómo está construido.</li></ul>`],
  ['¿Cómo saben si un dibujo es calcado?', `<p>Calcar es copiar los contornos de una imagen que ya existe (una foto, un modelo 3D u otro dibujo) trazando encima. Señales que revisan:</p><ul><li><b>Contornos que coinciden al superponer:</b> al poner el dibujo encima de la imagen sospechosa, codos, nudillos, pliegues de ropa y caída del cabello encajan exactos.</li><li><b>Línea insegura sobre anatomía difícil:</b> escorzos o manos en perspectiva muy complejos, pero con un trazo tembloroso y del mismo grosor, como quien sigue un borde en vez de construir la forma.</li><li><b>Figura y entorno que no cuadran:</b> un personaje con anatomía perfecta y realista, y una ropa, unos accesorios o un fondo con errores básicos de perspectiva.</li><li><b>Los mismos «accidentes»:</b> las mismas arrugas casuales de una tela o los mismos errores de proporción que tenía la imagen original.</li></ul><p>Pasar en limpio tu propio boceto sí se vale.</p>`],
  ['¿Cómo saben si un dibujo se hizo con IA?', `<p>Analizan la lógica con la que está construido el dibujo:</p><ul><li><b>Objetos y ropa sin lógica:</b> detalles que parecen complejos pero, al acercarse, no tienen sentido: correas que no se abrochan a nada, botones sin ojal, mangos torcidos o mechones que nacen de la ropa.</li><li><b>Acabados que no combinan:</b> un sombreado hiperrealista junto a líneas sucias que no aportan volumen, o texturas «derretidas» donde las líneas se funden sin criterio.</li><li><b>Errores que no son humanos:</b> quien empieza a dibujar se equivoca en proporciones (cabeza grande, brazos cortos), y eso está bien. La IA se equivoca en la estructura: dedos que se funden, articulaciones de más, dientes sin forma o pupilas con brillos distintos.</li><li><b>Proceso que no se puede mostrar:</b> no hay boceto ni líneas guía, o el video del proceso muestra la imagen apareciendo de golpe en vez de construirse de lo general a lo particular.</li></ul>`],
  ['¿Cómo saben si un dibujo es fan art?', `<p>Es fan art aunque cambies totalmente el estilo (por ejemplo, de anime a realista) si:</p><ul><li><b>Se reconoce por su silueta o sus atributos:</b> uniforme, símbolos, paleta de colores o rasgos de la cara característicos de un personaje de una serie, película, videojuego, cómic o libro.</li><li><b>Usa objetos, criaturas o universos de otra obra:</b> aunque no salga el protagonista, aparecen cosas exclusivas y reconocibles, como una Pokébola, un sable de luz o el escudo de una casa de una saga.</li><li><b>Su historia depende de otra obra:</b> el nombre, la historia o la estética del personaje vienen de una obra que ya existe.</li></ul><p>Tus propios personajes (OC) y las leyendas y tradiciones venezolanas, con un diseño tuyo, sí se valen.</p>`],
  ['¿Qué pruebas de mi proceso pueden pedirme?', `<p>Si hay dudas sobre un dibujo, la organización puede pedirte pruebas. <b>Guárdalas siempre</b>, por lo menos hasta la premiación de esa edición.</p><p><b>Si dibujas en digital:</b></p><ul><li>El <b>archivo con las capas separadas</b> de tu programa (Procreate, Clip Studio, Photoshop, ibisPaint u otro): boceto, líneas, colores y sombras. Un archivo con todo en una sola capa es una señal de alerta.</li><li>El <b>video del proceso (timelapse)</b>. Muchos programas lo graban solos: actívalo antes de empezar.</li><li>Una <b>captura de pantalla</b> del programa con el dibujo a medias, donde se vean las capas y las herramientas.</li></ul><p><b>Si dibujas en tradicional:</b></p><ul><li><b>2 o 3 fotos del proceso:</b> el boceto a lápiz, el dibujo a la mitad y casi terminado.</li><li>Una <b>foto del dibujo junto a una nota escrita a mano</b> con la fecha y #RMM. No envíes fotos de tu cédula ni de documentos.</li></ul><p>Una sola señal no basta para retirar un dibujo. Si los Guardianes tienen dudas, te escribimos <b>por correo</b> (si eres menor, a tu representante) y te llega un aviso en la app. Tienes <b>48 horas</b> para responder ese correo con tus pruebas, sin pasar del martes a las 6:00 p. m. si tu dibujo está en la votación. Mientras tanto, tu dibujo sigue participando. <b>Si no respondes o no puedes mostrar tu proceso, el dibujo se retira antes de que termine la votación de esa semana.</b></p>`],
  ['¿Cuántas veces me pueden retirar un dibujo?', `<p>Si un dibujo incumple claramente las reglas (es fan art, plagio, calco o está hecho con IA), los Guardianes lo retiran sin pedir pruebas. Ese dibujo no cuenta para nada, pero <b>puedes seguir participando desde la semana siguiente</b>.</p><p>Cada retiro cuenta como una falta. <b>Con 3 faltas en una misma edición</b> (julio o diciembre), ya no puedes seguir participando en esa edición. En la edición siguiente empiezas de cero.</p>`],
];
const FAQ_EVENTO = [
 {id:'categorias', t:'Categorías y cómo clasificar', c:'#FFD60A', q:[
  ['Ilustrador estrella: ¿cómo se gana?', `<p><b>Categoría principal · 1 ganador.</b> Para quien acumula más puestos de honor en los resultados semanales.</p><p><b>Cómo se clasifica:</b> cada 1.er lugar suma 3 puntos y cada 2.º o 3.er lugar suma 1. Gana quien tenga más puntos.</p><a class="act" href="reto-semanal.html">Ver «Así van los puntajes»</a>`],
  ['Ilustradores destacados: ¿cómo se gana?', `<p><b>Categoría principal · 3 ganadores.</b></p><p><b>Cómo se clasifica:</b> los tres con más puestos de honor (1.º, 2.º y 3.º), sin contar al ilustrador estrella.</p>`],
  ['Relámpago creativo: ¿cómo se gana?', `<p><b>Categoría principal · 1 ganador.</b></p><p><b>Cómo se clasifica:</b> quien más veces fue la primera persona en publicar cada semana.</p><p>Cuenta desde que el reto está disponible, incluido el acceso anticipado: los miembros del <b>Club Estrella</b> ven el reto 24 horas antes y pueden publicar desde ese momento. Participar es gratis siempre. Ten en cuenta que esas 24 horas también dan más tiempo para dibujar y para sumar «Me gusta».</p>`],
  ['Mejor ilustración digital: ¿cómo se gana?', `<p><b>Categoría principal · 4 nominados · 1 ganador.</b></p><p><b>Cómo se clasifica:</b> marca tu técnica como Digital al publicar. Las 4 ilustraciones digitales con más «Me gusta» <b>en el Padlet</b> quedan nominadas y el jurado elige la ganadora. Aquí no cuenta la votación semanal del podio (WhatsApp o app): solo los «Me gusta» del Padlet.</p>`],
  ['Mejor ilustración tradicional: ¿cómo se gana?', `<p><b>Categoría principal · 4 nominados · 1 ganador.</b></p><p><b>Cómo se clasifica:</b> marca tu técnica como Tradicional al publicar. Las 4 ilustraciones tradicionales con más «Me gusta» <b>en el Padlet</b> quedan nominadas y el jurado elige la ganadora. Aquí no cuenta la votación semanal del podio (WhatsApp o app): solo los «Me gusta» del Padlet.</p>`],
  ['Premio a la constancia: ¿cómo se gana?', `<p><b>Categoría principal · 1 ganador · rotativa por año.</b> No se puede sumar a otra categoría: quien la gana no gana otra. Es rotativa por año: quien la ganó no puede volver a ganarla en la siguiente edición del mismo año.</p><p><b>Cómo se clasifica:</b> quien participó en más semanas del periodo, seguidas o no. Cuenta cada semana con un dibujo publicado a tiempo y que no fue retirado. Los protectores cuidan tu racha, pero no suman semanas para este premio.</p><p><b>Si hay empate:</b> 1) la racha más larga de semanas seguidas dentro del periodo; 2) quien votó en más semanas en la votación de la app; 3) sorteo en vivo en el stream de Mente Milenial.</p>`],
  ['Ilustración más interactiva: ¿cómo se gana?', `<p><b>Solo reconocimiento · 1 ganador · rotativa por año.</b> La organización entrega solo una medalla conmemorativa; si una marca aliada la patrocina, puede sumar su propio premio. Se puede sumar a otra categoría. Quien la ganó no puede volver a ganarla en la siguiente edición del mismo año.</p><p><b>Cómo se clasifica:</b> la ilustración con más me gusta del Padlet. Los votos se revisan para confirmar que son reales.</p>`],
  ['Elección de la comunidad: ¿cómo se gana?', `<p>Se vota el día del evento.</p>`],
  ['¿Puedo ganar más de una categoría?', `<p>Cada persona gana solo una categoría principal: Estrella, Destacados, Relámpago, Digital, Tradicional o Premio a la constancia.</p><p>Solo la <b>Ilustración más interactiva</b> se puede ganar además de una categoría principal, porque es un reconocimiento (medalla conmemorativa). El Premio a la constancia y la Ilustración más interactiva son rotativas por año.</p>`],
  ['¿Qué pasa si hay un empate?', `<p>Gana quien tenga más primeros lugares; si sigue el empate, más segundos y terceros; luego, más me gusta.</p>`],
  ['¿Y si hay empate en la votación de la semana?', `<p>Si dos dibujos empatan en votos, gana quien tenga más me gusta en el Padlet. Si siguen empatados, gana quien subió su dibujo primero. Los puestos del podio no se comparten. Lo mismo pasa para entrar a las 5 finalistas: con los mismos me gusta, entra quien subió primero, y la app te avisa si quedaste fuera por un empate.</p>`], ['¿Qué pasa si retiran a una finalista?', `<p>Entra en su lugar el siguiente dibujo con más me gusta, contados al cierre del lunes, y su autor recibe un aviso en la app. Si habías votado por la finalista retirada, tu voto no cuenta y puedes votar otra vez. Siempre hay 5 finalistas mientras queden dibujos en la lista.</p>`], ['¿Qué es el reto de calentamiento?', `<p>Son <b>dos retos sencillos para estrenar la app</b> antes de la temporada: del 2 al 7 de diciembre y del 9 al 14 de diciembre (el Club Estrella los ve 24 horas antes). Funcionan igual que el reto de siempre: subes tu dibujo desde la app, pasan a la final los 5 con más «Me gusta» y el podio se vota en la app. <b>No suman puntos para el Reto Creativo Fest ni cuentan para tu racha.</b> En el reto 1 puedes subir un dibujo viejo, pero tiene que ser original: nada de fan art. El 1.er lugar de cada uno gana 1 mes del Club Estrella. La temporada empieza de verdad el 22 de diciembre.</p>`]
 ]},
 {id:'evento', t:'El evento', c:'#FFD60A', q:[
  ['¿Cuándo y dónde es el Reto Creativo Fest?', `<p>El <b>sábado 5 de diciembre</b>, de 10:00 a. m. a 4:00 p. m., en la Facultad de Ciencias Económicas y Sociales (FACES) de la Universidad Central de Venezuela, Caracas.</p><a class="act" href="index.html#programa">Ver el programa</a>`],
  ['¿La entrada tiene costo?', `<p>No. La entrada al festival es <b>gratuita</b>.</p><p>Para entrar a las <b>charlas con propósito</b> necesitas donar al menos <b>2 insumos nuevos de primera necesidad</b> (juguetes, alimentos, higiene personal, medicinas o material de arte) o adquirir la <b>Ruta creativa</b>${EN_LINEA ? '' : ', que se compra en nuestro stand del evento'}.</p>${EN_LINEA ? '<a class="act" href="tienda.html">Comprar la Ruta creativa</a>' : ''}`],
  ['¿Qué necesito para entrar a las charlas?', `<p>Tienes dos opciones:</p><ul><li>Donar al menos <b>2 insumos nuevos</b>: los de <b>primera necesidad</b> (juguetes, alimentos, higiene personal y medicinas) se entregan al <b>Centro de Acopio de la UCV</b>, y los <b>materiales de arte</b> nos ayudan a mantener la iniciativa premiando a artistas emergentes.</li><li>Adquirir la <b>Ruta creativa</b>${EN_LINEA ? '' : ' en nuestro stand del evento'}.</li></ul><p>La donación es individual y solo se aceptan productos nuevos. Los <b>menores de 12 años</b> no requieren presentar donación.</p>`],
  ['¿Hay estacionamiento?', `<p>Sí, hay estacionamiento. Tiene costo y no está incluido en la entrada.</p>`],
  ['¿Puedo ir con niños?', `<p>¡Claro! Los niños son bienvenidos, siempre que estén <b>supervisados por sus padres o representantes</b>. La Ruta creativa es una actividad apta para todo público.</p>`]
 ]},
 {id:'concurso', t:'Concurso en vivo', c:'#84D7DF', q:[
  ['¿Quién puede participar?', `<p>Personas de <b>15 años o más</b> que ya estén inscritas. <b>Los cupos del concurso se agotaron</b> y ya no hay inscripciones para esta edición. Los menores de 18 necesitan la autorización de su representante.</p>`],
  ['¿Cómo funciona el concurso?', `<ul><li>Tienes <b>45 minutos</b> para hacer tu dibujo.</li><li>El check-in es de <b>9:00 a 9:50 a. m.</b> y hay <b>3 lotes de 12 personas</b>: 10:00 a. m., 11:00 a. m. y 12:00 p. m.</li><li>El jurado elige <b>4 ganadores</b>, que se anuncian en la premiación a las 3:00 p. m. en el Auditorio naranja.</li></ul>`],
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
  ['Soy menor de edad, ¿puedo participar en el reto semanal?', `<p>Sí. Los menores de 18 años participan con la <b>autorización de su representante</b>: debe llenar el formulario y confirmar el correo que le llega de retocreativofest@gmail.com. Si no lo ve, que revise spam y Promociones; desde la app puedes reenviárselo, y si su buzón está lleno la app te avisa para que use otro correo. Hasta que tu representante confirme, no puedes publicar tu dibujo, agregar amigos, quedar entre las finalistas ni recibir premios.</p><p>Publica solo tu <b>nombre de pila y tu usuario</b>: nunca tu colegio, tu dirección ni fotos tuyas.</p><a class="act" data-link="autorizacion" href="#">Formulario de autorización</a>`],
  ['¿Cómo se eligen los ganadores?', `<p>Algunas categorías se ganan por puntos según tus puestos de cada semana, otras por los «Me gusta» del Padlet, y en Digital y Tradicional el jurado elige entre las 4 de cada técnica con más «Me gusta» en el Padlet.</p><a class="act" href="reto-semanal.html">Ver «Así van los puntajes»</a>`],
  ['¿Qué dibujos no se aceptan? ¿Puedo usar IA, calcar o hacer fan art?', `<p>Solo se aceptan obras <b>100 % originales y tuyas</b>: no se aceptan fan arts, copias, calcos ni plagios, ni dibujos o bocetos hechos con inteligencia artificial. Puedes usar la IA solo como referencia (por ejemplo, para ver una pose), pero el dibujo es tuyo de principio a fin. Los <b>Guardianes del arte</b> revisan cada dibujo y retiran los que no cumplan. Mira <a href="bases.html#originalidad">qué cuenta como fan art, plagio, calco o IA, y qué sí se vale</a>.</p>`],
  ...ORIGINALIDAD,
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
    : `<ul><li>Stand para artistas (1 × 1 m): <b>$30</b></li><li>Stand básico (1 × 1 m): <b>$40</b></li><li>Stand pro (1,5 × 1,5 m): <b>$50</b></li></ul><p><b>Los stands del 5 de diciembre están agotados.</b> Si ya tienes el tuyo, la 2.ª cuota vence el 1 de diciembre. Para la próxima edición, déjanos tus datos y te avisamos primero.</p><a class="act" href="bazar-creativo.html#marcas">Quiero un stand en la próxima edición</a>`],
  ['¿Cómo pago mi stand?', PREVENTA ? `<ul><li><b>Hasta el 6 de noviembre:</b> solo USD en efectivo, Binance, Zinli o PayPal (con comisión). No se aceptan bolívares.</li><li><b>Desde el 7 de noviembre:</b> también Pago Móvil. Si pagas completo, a tasa dólar BCV del día; si pagas en dos cuotas, a tasa euro BCV del día.</li></ul>`
    : `<p>USD en efectivo, Binance, Zinli, PayPal (con comisión) o Pago Móvil. Si pagas completo, a tasa dólar BCV del día; si pagas en dos cuotas, a tasa euro BCV del día. La 2.ª cuota vence el 1 de diciembre.</p>`],
  ['¿Qué incluye el stand?', `<p>Kit de bienvenida, promoción de tu marca en redes y fotos del evento. Cada marca debe donar 1 producto para el sorteo de la Ruta creativa.</p>`],
  ['¿Tengo que llevar mesa y silla?', `<p>Sí. Cada expositor lleva sus <b>propias mesas, sillas y mobiliario, sin excepción</b>, adaptados al tamaño de su espacio.</p>`]
 ]},
 {id:'comunidad', t:'Comunidad', c:'#C5A6D9', q:[
  ['¿Dónde veo los streams de @mentemilenial?', `<p>Lunes, miércoles y viernes a las <b>8:30 p. m. (hora de Venezuela)</b>, en TikTok, Twitch, YouTube y Kick.</p><a class="act" href="mente-milenial.html">Ver la semana en vivo</a>`],
  ['¿Cómo entro al Discord?', `<p>El Discord de Mente Milenial es exclusivo para miembros del Patreon de Reto Mente Milenial. Ahí puedes hablar con el equipo durante los streams, conocer el reto 24 horas antes y ver master class exclusivas.</p><a class="act" data-link="patreon" href="#">Ir a Patreon</a>`],
  ['Soy periodista o medio, ¿cómo me acredito?', `<p>Completa el formulario de <b>acreditación de prensa</b>. Revisamos cada solicitud y te confirmamos por correo y WhatsApp.</p><a class="act" href="index.html#prensa">Solicitar acreditación</a>`],
  ['¿Cómo puedo patrocinar el evento?', `<p>Tenemos planes para el <b>Reto Creativo Fest</b> y para el <b>#RetoMenteMilenial</b> (tu marca en el reto de la semana, el mes o la temporada). Pídenos la propuesta con precios por correo.</p><a class="act" href="bazar-creativo.html#planes">Ver los planes 2027</a>`]
 ]}
];


/* Desde el 6 de diciembre: la app y el reto primero; el festival pasa a «la próxima edición». */
const CATEGORIAS = FAQ_EVENTO.find(g => g.id === 'categorias');
const FAQ_POST = [
 {id:'app', t:'La app y el reto', c:'#AA57F7', q:[
  ['¿Qué es el #RetoMenteMilenial?', `<p>Un reto de dibujo <b>cada semana, todo el año</b>. Cada miércoles sale un tema nuevo, lo dibujas en digital o tradicional y lo subes desde la app. Los mejores de cada semana suman puntos para los premios del Reto Creativo Fest.</p><a class="act" href="la-app.html">Conocer la app</a>`],
  ['¿Cómo participo?', `<p>Es gratis y se hace desde la <b>app del reto</b>, con <b>una sola cuenta</b>:</p><ol><li><b>Instala la app</b> y entra con tu cuenta de Google o con tu correo.</li><li><b>Arma tu personaje y completa tu perfil.</b> Si eres menor de edad, tu representante llena la autorización.</li><li><b>Mira el reto</b> el miércoles a las 8:00 p. m. (el Club Estrella lo ve el martes).</li><li><b>Dibuja</b> en digital o tradicional, sin IA, calcos ni copias.</li><li><b>Súbelo desde la app</b> antes del <b>lunes a las 8:00 p. m.</b> con título, descripción y técnica. Se publica solo en el Padlet.</li></ol><a class="act" href="la-app.html">Descargar la app</a>`],
  ['¿Cómo instalo la app?', `<p>Es gratis para Android y iPhone y se instala desde el navegador:</p><ul><li><b>Android:</b> ábrela en Chrome y toca «Instalar».</li><li><b>iPhone:</b> ábrela en Safari, toca Compartir y elige «Agregar a inicio».</li></ul><p>Si llegaste desde Instagram o WhatsApp, abre el enlace en Chrome o Safari para poder instalarla.</p><a class="act" href="la-app.html#instalar">Ver cómo instalarla</a>`],
  ['¿Cuándo empieza la temporada?', `<p>La <b>3.ª temporada</b> arranca con la <b>Semana 0</b>: el Club Estrella ve el reto el martes 22 de diciembre y todos el <b>miércoles 23 de diciembre</b> a las 8:00 p. m. La primera fase va hasta finales de junio de 2027; en julio hacemos una pausa y la segunda fase empieza el 27 de julio.</p><a class="act" href="reto-semanal.html">Ver el reto semanal</a>`],
  ['¿Puedo subir más de un dibujo por semana?', `<p>No. Es <b>un dibujo por persona y por semana</b>, y solo desde la app. Elige bien el que quieres mostrar.</p>`],
  ['¿Qué es la racha y para qué sirven los protectores?', `<p>Cada semana que participas tu fuego 🔥 crece. Si una semana no puedes dibujar, un <b>protector</b> cuida tu racha para que no se apague. Te regalamos uno en tu cumpleaños, y el Club Estrella recibe 2 cada mes. El protector salva la racha, pero esa semana no cuenta como participada para el Premio a la constancia.</p>`],
  ['¿Qué es la Chispa del día?', `<p>Un mini reto de 3 minutos para calentar la mano <b>todos los días</b>, con chispas especiales en fechas como Navidad. Puedes guardarla o compartirla con tu nombre.</p>`],
  ['¿Cómo funcionan los amigos y los saludos?', `<p>Agrega a tus amigos por su usuario, mira sus rachas y salúdalos con un sticker para animarlos a dibujar. Puedes <b>bloquear o reportar</b> a cualquier persona en un par de pasos.</p>`],
  ['¿Por qué no hay chat ni comentarios?', `<p>Porque en el reto participan niños, niñas y adolescentes. Para que sea un espacio seguro y sin bullying, solo hay «Me gusta» en el Padlet y saludos entre amigos.</p>`],
  ['¿Cómo activo o apago los avisos?', `<p>En la app, entra a <b>Yo → Avisos</b> y elige cuáles quieres: el reto, tu racha, tus amigos y la Chispa del día. En iPhone, los avisos funcionan con la app instalada desde Safari (iOS 16.4 o más reciente).</p>`],
  ['¿Cómo borro mi cuenta?', `<p>En la app, entra a <b>Yo → Borrar mi cuenta</b> y escribe BORRAR. Se borran tus datos y tu cuenta de forma permanente.</p><a class="act" href="borrar-cuenta.html">Más sobre el borrado de cuenta</a>`]
 ]},
 {id:'votacion', t:'Votación y premios', c:'#FFD60A', q:[
  ['¿Cómo se eligen las finalistas y el podio?', `<p>El <b>lunes en la noche</b>, cuando cierra el reto, pasan a la final los <b>5 dibujos con más «Me gusta»</b> en el Padlet. Desde el lunes a las 9:00 p. m. hasta el martes a las 9:00 p. m. se vota en la app, y el martes sale el podio: 1.º, 2.º y 3.er lugar.</p>`],
  ['¿Qué pasa si retiran a una finalista?', `<p>Entra en su lugar el siguiente dibujo con más me gusta, contados al cierre del lunes, y su autor recibe un aviso en la app. Si habías votado por la finalista retirada, tu voto no cuenta y puedes votar otra vez. Si empataste en me gusta con la última finalista y quedaste fuera por subir después, la app te avisa.</p>`],
  ['¿Qué es el reto de calentamiento?', `<p>Son <b>dos retos sencillos para estrenar la app</b> antes de la temporada: del 2 al 7 de diciembre y del 9 al 14 de diciembre (el Club Estrella los ve 24 horas antes). Funcionan igual que el reto de siempre: subes tu dibujo desde la app, pasan a la final los 5 con más «Me gusta» y el podio se vota en la app. <b>No suman puntos para el Reto Creativo Fest ni cuentan para tu racha.</b> En el reto 1 puedes subir un dibujo viejo, pero tiene que ser original: nada de fan art. El 1.er lugar de cada uno gana 1 mes del Club Estrella. La temporada empieza de verdad el 22 de diciembre.</p>`],
  ['¿Quién puede votar?', `<p>Todas las personas que subieron <b>al menos un dibujo en la temporada</b>, y los Guardianes del arte. Es <b>un voto por semana</b>, no se puede cambiar y nunca por tu propio dibujo.</p>`],
  ['¿Alguien puede ver por quién voté?', `<p>No. El voto es <b>secreto</b>: nadie, ni siquiera desde la app, puede ver cómo va cada finalista. Al cierre solo se muestra el resultado del podio.</p>`],
  ['¿Quién puede ganar los premios?', `<p>Personas <b>venezolanas residentes en Venezuela</b>, con <b>una sola cuenta</b> por participante. Los menores de edad necesitan la autorización confirmada de su representante.</p>`],
  ['¿Cómo suma el reto para el festival?', `<p>Tus puestos de cada semana, tus «Me gusta» y las semanas que participas suman para las categorías de premios del Reto Creativo Fest. En la app, en <b>Ranking</b>, ves cómo vas en cada una.</p><a class="act" href="reto-semanal.html">Ver las categorías</a>`],
  ['¿Qué dibujos no se aceptan? ¿Puedo usar IA, calcar o hacer fan art?', `<p>Solo se aceptan obras <b>100 % originales y tuyas</b>: no se aceptan fan arts, copias, calcos ni plagios, ni dibujos o bocetos hechos con inteligencia artificial. Puedes usar la IA solo como referencia (por ejemplo, para ver una pose), pero el dibujo es tuyo de principio a fin. Los <b>Guardianes del arte</b> revisan cada dibujo y retiran los que no cumplan. Mira <a href="bases.html#originalidad">qué cuenta como fan art, plagio, calco o IA, y qué sí se vale</a>.</p>`],
  ...ORIGINALIDAD,
  ['¿Qué pasa si retiran mi dibujo?', `<p>Si los Guardianes del arte retiran tu dibujo, te avisamos por correo y en la app (si eres menor, a tu representante). Ese dibujo no cuenta para nada y esa semana no puedes subir otro, pero puedes seguir participando desde la semana siguiente. Cada retiro cuenta como una falta: con <b>3 faltas en una misma edición</b>, ya no puedes seguir participando en esa edición. Tienes <b>7 días</b> para pedir que lo revisemos.</p>`]
 ]},
 Object.assign({}, CATEGORIAS, {q: CATEGORIAS.q.concat([
  ['Gané en julio, ¿puedo volver a ganar en diciembre?', `<p>Sí, en otra categoría. No puedes repetir la misma categoría que ganaste en julio.</p>`]])}),
 {id:'menores', t:'Menores de edad', c:'#84D7DF', q:[
  ['Soy menor de edad, ¿puedo participar?', `<p>Sí. Los menores de 18 años participan con la <b>autorización de su representante</b>: debe llenar el formulario y confirmar el correo que le llega de retocreativofest@gmail.com. Si no lo ve, que revise spam y Promociones; desde la app puedes reenviárselo.</p><p>Hasta que tu representante confirme, no puedes publicar tu dibujo, agregar amigos, quedar entre las finalistas ni recibir premios.</p><a class="act" data-link="autorizacion" href="#">Formulario de autorización</a>`],
  ['¿Qué datos ven las otras personas?', `<p>Solo tu <b>nombre de pila, tu usuario y tu personaje</b>. En la app no hay fotos de perfil y nadie ve datos personales de otras personas. Nunca publiques tu colegio, tu dirección ni fotos tuyas.</p><a class="act" href="privacidad.html">Ver la política de privacidad</a>`]
 ]},
 {id:'club', t:'Club Estrella', c:'#F0479B', q:[
  ['¿Qué es el Club Estrella?', `<p>Es la membresía del #RetoMenteMilenial. Cuesta <b>5,50 dólares al mes</b>, la cancelas cuando quieras y ayuda a que el reto y los premios sigan creciendo. Participar en el reto sigue siendo gratis.</p><a class="act" href="la-app.html#club">Ver el Club Estrella</a>`],
  ['¿Qué ventajas tiene?', `<ul><li>Ves el reto <b>24 horas antes</b> y puedes publicar primero (ventaja en el Relámpago creativo).</li><li>2 protectores de racha al mes.</li><li>Chispa del día Pro.</li><li>Personaje exclusivo.</li><li>Tu estrella en el ranking, que crece con los meses.</li><li>Discord privado.</li></ul>`],
  ['¿Cómo me uno y cómo pago?', `<p>Únete por <b>Patreon</b> y, en la app, entra a Club y toca «Vincular mi Patreon»: tus ventajas se activan solas. También puedes pagar por <b>Pago Móvil, Binance o Zinli</b> y te activamos a mano.</p><a class="act" data-link="patreon" href="#">Unirme por Patreon</a>`],
  ['¿Cómo entro al Discord?', `<p>El Discord de Mente Milenial es exclusivo para el Club Estrella. Al unirte por Patreon recibes el acceso.</p>`]
 ]},
 {id:'festival', t:'El festival', c:'#6B3FA0', q:[
  ['¿Cuándo es el próximo Reto Creativo Fest?', `<p>Ya celebramos <b>cuatro ediciones</b>. Anunciaremos la fecha de la 5.ª edición en nuestro canal de WhatsApp y en redes. Déjanos tu correo y te escribimos primero cuando abran la preventa, el concurso y los stands.</p><a class="act" href="index.html#avisame">Avísame</a>`],
  ['¿Habrá concurso de dibujo en vivo?', `<p>El concurso en vivo es parte de cada edición. Las inscripciones abren con la preventa del festival: te avisamos si dejas tu correo.</p><a class="act" href="index.html#avisame">Avísame</a>`],
  ['Quiero un stand en el bazar, ¿cómo lo reservo?', `<p>Escríbenos en el formulario de marcas y elige «Stand». Te contactamos cuando abran los stands de la próxima edición.</p><a class="act" href="bazar-creativo.html#marcas">Ir al formulario</a>`]
 ]},
 {id:'tienda', t:'Tienda', c:'#F0479B', q:[
  FAQ_EVENTO.find(g => g.id === 'tienda').q[0], FAQ_EVENTO.find(g => g.id === 'tienda').q[1],
  ['¿Cuánto tarda mi pedido y cómo llega?', `<p>Los productos <b>bajo pedido</b> tardan alrededor de <b>1 semana</b> en estar listos. Los enviamos por <b>MRW con cobro a destino</b> a todo el país.</p>`]
 ]},
 {id:'comunidad', t:'Marcas, prensa y comunidad', c:'#C5A6D9', q:[
  ['¿Cómo puedo patrocinar?', `<p>Tenemos planes para el <b>#RetoMenteMilenial</b> (tu marca en el reto de la semana, el mes o la temporada) y para el <b>Reto Creativo Fest</b>. Pídenos la propuesta con precios por correo.</p><a class="act" href="bazar-creativo.html#planes">Ver los planes</a>`],
  ['¿Dónde veo los streams de @mentemilenial?', FAQ_EVENTO.find(g => g.id === 'comunidad').q[0][1]],
  ['Soy periodista o medio, ¿cómo los contacto?', `<p>Escríbenos a <b>retocreativofest@gmail.com</b> y te respondemos lo antes posible.</p><a class="act" href="mailto:retocreativofest@gmail.com">Escribir un correo</a>`]
 ]}
];
/* 21 nov 2026: abiertas desde la app de Google Play (PLAY_WEB, en rcf.js) estas respuestas van sin precio, sin Patreon
   y sin otros medios de pago del Club (política de pagos de Google). En la web normal salen completas. */
const SIN_PAGOS = {
  '¿Qué es el Club Estrella?': ['¿Qué es el Club Estrella?', `<p>Es la membresía del #RetoMenteMilenial: ves el reto 24 horas antes, tienes protectores para tu racha, la Chispa del día Pro y más. Participar en el reto sigue siendo gratis.</p><a class="act" href="la-app.html#club">Ver el Club Estrella</a>`],
  '¿Cómo me uno y cómo pago?': ['Ya soy miembro, ¿cómo activo mis ventajas?', `<p>En la app, entra a <b>Club</b> y toca «Ya soy miembro: vincular mi Patreon». Tus ventajas se activan solas y se revisan cada día.</p>`],
  '¿Cómo entro al Discord?': ['¿Cómo entro al Discord?', `<p>El Discord de Mente Milenial es exclusivo para los miembros del Club Estrella.</p>`]
};
/* Sin tienda (TIENDA en rcf.js) no van su sección ni los botones que llevan a ella. */
const FAQ = (POST_EVENTO ? FAQ_POST : FAQ_EVENTO).filter(g => TIENDA || g.id !== 'tienda').map(g => TIENDA ? g : {...g, q: g.q.map(x => [x[0], x[1].replace(/<a class="act" href="tienda\.html">[^<]*<\/a>/g, '')])}).map(g => typeof PLAY_WEB !== 'undefined' && PLAY_WEB ? {...g, q: g.q.map(x => SIN_PAGOS[x[0]] || x)} : g);

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
  ['ia','inteligencia','artificial','copiar','calcar','calco','calcado','plagio','copia','fan art','fanart','original','referencia','referencias','pose','prueba','pruebas','proceso','capas','timelapse','dtiys'],
  ['tienda','comprar','compra','producto','productos','pedido','franela','camisa','sticker','stickers','guante','ruta','tote','totebag'],
  ['envio','envios','enviar','mrw','delivery','despacho','tarda','tiempo','entrega','llega','retirar'],
  ['stand','stands','bazar','expositor','exponer','vender','emprendimiento','emprendedor','marca','mesa','silla','mobiliario','caballete'],
  ['charla','charlas','insumos','donar','donacion','acopio','alimentos','juguetes','medicinas','higiene'],
  ['estacionamiento','parking','carro','estacionar','aparcar'],
  ['stream','streams','vivo','directo','twitch','youtube','kick','tiktok','transmision'],
  ['discord','patreon','comunidad','suscripcion','miembro','club','estrella','membresia'],
  ['racha','fuego','protector','protectores','chispa','amigo','amigos','toque','toques','saludo','saludos','saludar','aviso','avisos','notificacion','notificaciones','personaje'],
  ['votar','voto','votos','votacion','finalista','finalistas','podio','secreto'],
  ['borrar','eliminar','cuenta','datos','privacidad','retirar','retiraron','retirado'],
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
  if (POST_EVENTO) $('#q').placeholder = 'Busca: app, racha, votar, Club, menores…';
  renderTopics(); render();
})();
