/* #RetoMenteMilenial · Chispa del día: un mini reto de 3 minutos (opcional, no suma puntos ni racha).
   Gratis: pincel mediano, borrador, deshacer y 22 colores. Toda chispa se guarda con el marco y la marca de agua del reto.
   Club Estrella (Chispa Pro): 3 tamaños, cubeta, cambiar la chispa 1 vez al día y video acelerado (también con marca de agua).
   10 nov 2026 (pedido de los testers): opacidad del pincel, para todos (gratis). El trazo se dibuja en una capa aparte
   y al soltar se pega con esa opacidad, así un mismo trazo no se oscurece donde se cruza consigo mismo.
   6 nov 2026: sin selector de marcos. Quien gana el Adviento recibe una insignia y su marco pasa a verde navideño. */
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
/* [fondo, texto, título]. El verde es el premio del Adviento (15 de 22 chispas): queda para siempre en ese teléfono. */
/* 12 nov 2026: marcos especiales del Club Estrella («estrellas» y «rayo»), con los colores y las formas del reto. Se cambian al terminar la chispa. */
const MARCO = {
  clasico: { nombre: 'Clásico', fondo: '#6B3FA0', texto: '#FFFFFF', titulo: '#FFD60A' },
  navidad: { nombre: 'Navidad', fondo: '#1E7A3A', texto: '#FFFFFF', titulo: '#FFD60A' },
  estrellas: { nombre: 'Estrellas', fondo: '#F0479B', texto: '#FFFFFF', titulo: '#FFD60A', club: true },
  rayo: { nombre: 'Rayo', fondo: '#84D7DF', texto: '#0B0B0F', titulo: '#6B3FA0', club: true } };

/* Adviento de Chispas: del 1 al 22 de diciembre, una chispa navideña por día (mientras llega la 3.ª temporada).
   Misma regla del banco: cantidad + cosa + color. Con 15 de 22 se gana la insignia del Adviento y el marco verde (para siempre, en ese teléfono). */
const ADVIENTO = { meta: 15, lista: [
  '1 árbol de Navidad azul', '3 bolas de Navidad moradas', '2 hallacas verdes', '1 pan de jamón marrón', '3 estrellas amarillas',
  '2 renos rosados', '1 muñeco de nieve naranja', '3 regalos rojos', '2 gorros navideños verdes', '1 campana morada', '3 velas azules',
  '2 galletas marrones', '1 trineo amarillo', '2 medias navideñas azules', '3 bastones de caramelo verdes', '1 corona navideña rosada',
  '2 tambores rojos', '1 cuatro venezolano marrón', '2 maracas moradas', '1 taza de chocolate rosada', '3 luces de Navidad naranja', '2 ángeles azules'] };
/* Chispas 2027+ (6 nov 2026, aprobadas por Stefany): 305 normales por fecha (MM-DD), fechas especiales fijas y móviles. Generado desde Chispas-2027-para-revisar.xlsx. */
const CAL = {"01-02": "1 jirafa verde", "01-03": "2 turpiales naranja", "01-04": "2 gorras rosadas", "01-05": "3 manzanas moradas", "01-06": "3 sombrillas naranja", "01-07": "3 flores naranja", "01-08": "1 maestra amarilla", "01-09": "2 caras tristes azules", "01-10": "1 vaca azul", "01-11": "3 arepas amarillas", "01-12": "3 camisas verdes", "01-13": "2 helados morados", "01-14": "2 casas moradas", "01-15": "3 nubes rosadas", "01-16": "2 doctoras moradas", "01-17": "2 caras sorprendidas verdes", "01-18": "1 pulpo rojo", "01-19": "2 guacamayas rojas", "01-20": "2 zapatos rojos", "01-21": "1 dona azul", "01-22": "1 taza rosada", "01-23": "3 estrellas marrones", "01-24": "2 cocineros naranja", "01-25": "1 cara enojada morada", "01-26": "3 pájaros rojos", "01-27": "1 chigüire marrón", "01-28": "1 sombrero morado", "01-29": "2 peras marrones", "01-30": "3 globos verdes", "01-31": "2 árboles azules", "02-01": "2 pintores rojos", "02-02": "1 cara feliz amarilla", "02-03": "2 perros amarillos", "02-04": "3 cayenas rojas", "02-05": "1 bufanda azul", "02-06": "2 fresas amarillas", "02-07": "1 vela verde", "02-10": "2 cactus naranja", "02-11": "2 bomberos verdes", "02-12": "1 cara dormida azul", "02-13": "3 gatos azules", "02-15": "1 tequeño verde", "02-16": "3 medias rosadas", "02-17": "2 pizzas moradas", "02-18": "3 macetas naranja", "02-19": "2 soles azules", "02-20": "1 enfermero rojo", "02-21": "3 caras asustadas moradas", "02-22": "1 tortuga marrón", "02-23": "2 cachapas rosadas", "02-24": "1 falda marrón", "02-25": "2 cerezas azules", "02-26": "1 escoba morada", "02-27": "2 hojas naranja", "02-28": "3 panaderas rojas", "03-01": "2 conejos marrones", "03-02": "3 chinchorros rosados", "03-03": "2 chaquetas marrones", "03-04": "1 plátano verde", "03-05": "3 lápices marrones", "03-06": "1 piedra naranja", "03-07": "3 pilotos amarillos", "03-09": "1 caracol amarillo", "03-10": "2 orquídeas azules", "03-11": "3 mochilas verdes", "03-12": "2 piñas marrones", "03-13": "3 ollas moradas", "03-14": "1 hongo amarillo", "03-15": "3 carteros rosados", "03-16": "1 elefante rosado", "03-17": "3 araguaneyes azules", "03-18": "2 guantes rosados", "03-19": "1 empanada amarilla", "03-23": "2 libros azules", "03-24": "3 lunas rojas", "03-25": "2 músicos rosados", "03-26": "3 peces naranja", "03-27": "2 vestidos morados", "03-28": "1 tomate rosado", "03-29": "2 sofás morados", "03-30": "1 volcán azul", "03-31": "2 jardineras verdes", "04-01": "1 oveja naranja", "04-03": "3 pantalones rosados", "04-04": "1 pan naranja", "04-05": "3 aviones rojos", "04-06": "1 montaña naranja", "04-07": "2 astronautas azules", "04-08": "1 mariposa marrón", "04-09": "2 botas rojas", "04-10": "3 galletas amarillas", "04-11": "2 relojes rojos", "04-12": "1 isla rosada", "04-13": "3 serpientes moradas", "04-14": "2 corbatas naranja", "04-15": "3 zanahorias moradas", "04-16": "1 tren marrón", "04-17": "3 leones verdes", "04-18": "2 tortas azules", "04-19": "3 camas marrones", "04-20": "2 cangrejos azules", "04-21": "1 huevo naranja", "04-24": "3 ventanas azules", "04-25": "1 pingüino rosado", "04-26": "2 sandías azules", "04-27": "3 barcos amarillos", "04-28": "1 mono morado", "04-30": "2 limones amarillos", "05-01": "3 regalos verdes", "05-02": "1 búho marrón", "05-03": "2 teléfonos rojos", "05-04": "1 ratón verde", "05-05": "3 llaves rojas", "05-06": "2 ballenas moradas", "05-07": "1 cuchara azul", "05-08": "3 ranas verdes", "05-10": "1 carro rosado", "05-11": "2 patos verdes", "05-12": "3 lámparas marrones", "05-13": "2 cerdos rosados", "05-14": "1 bicicleta marrón", "05-16": "2 dinosaurios morados", "05-17": "3 puertas verdes", "05-18": "2 osos marrones", "05-19": "3 cohetes azules", "05-21": "1 abeja marrón", "05-22": "3 sillas verdes", "05-23": "2 gallinas amarillas", "05-24": "3 caballos naranja", "05-25": "2 jirafas rojas", "05-26": "3 turpiales azules", "05-27": "1 gorra roja", "05-28": "2 manzanas marrones", "05-29": "1 sombrilla morada", "05-31": "2 flores rosadas", "06-01": "3 maestras rojas", "06-02": "1 cara triste morada", "06-03": "2 vacas rosadas", "06-04": "1 arepa marrón", "06-06": "2 camisas amarillas", "06-07": "3 helados naranja", "06-09": "1 casa verde", "06-10": "2 nubes azules", "06-11": "1 doctora naranja", "06-12": "3 caras sorprendidas amarillas", "06-13": "2 pulpos naranja", "06-14": "1 guacamaya marrón", "06-15": "3 zapatos amarillos", "06-16": "2 donas naranja", "06-17": "3 tazas verdes", "06-18": "2 estrellas moradas", "06-19": "3 cocineros rojos", "06-22": "2 caras enojadas rosadas", "06-23": "1 pájaro amarillo", "06-24": "2 chigüires rojos", "06-25": "3 sombreros rosados", "06-26": "1 pera naranja", "06-28": "2 globos azules", "06-29": "3 árboles rosados", "06-30": "1 pintor amarillo", "07-01": "2 caras felices verdes", "07-02": "3 perros rosados", "07-03": "2 cayenas verdes", "07-04": "3 bufandas amarillas", "07-05": "1 fresa azul", "07-06": "3 velas naranja", "07-07": "1 cactus morado", "07-08": "3 bomberos rojos", "07-09": "2 caras dormidas amarillas", "07-10": "1 gato rosado", "07-11": "2 tequeños azules", "07-12": "1 media verde", "07-13": "3 pizzas rojas", "07-14": "1 maceta amarilla", "07-15": "3 soles naranja", "07-16": "2 enfermeros rosados", "07-17": "1 cara asustada naranja", "07-19": "2 tortugas verdes", "07-21": "1 cachapa azul", "07-22": "3 faldas amarillas", "07-23": "1 cereza morada", "07-24": "3 escobas naranja", "07-25": "1 hoja amarilla", "07-26": "2 panaderas verdes", "07-27": "3 conejos rosados", "07-28": "1 chinchorro naranja", "07-29": "3 chaquetas rojas", "07-31": "2 plátanos rosados", "08-01": "1 lápiz rojo", "08-02": "2 piedras marrones", "08-03": "1 piloto morado", "08-04": "3 caracoles marrones", "08-05": "1 orquídea naranja", "08-06": "2 mochilas rosadas", "08-07": "3 piñas rojas", "08-09": "1 olla rosada", "08-10": "2 hongos morados", "08-11": "1 cartero naranja", "08-12": "2 elefantes verdes", "08-13": "1 araguaney rojo", "08-14": "3 guantes amarillos", "08-15": "2 empanadas moradas", "08-16": "3 libros amarillos", "08-17": "1 luna rosada", "08-18": "3 músicos naranja", "08-20": "2 peces azules", "08-21": "3 vestidos verdes", "08-22": "2 tomates marrones", "08-23": "1 sofá rojo", "08-24": "3 volcanes morados", "08-25": "1 jardinera roja", "08-27": "3 ovejas rosadas", "08-28": "1 pantalón azul", "08-29": "2 panes morados", "08-30": "1 avión azul", "08-31": "3 montañas verdes", "09-01": "1 astronauta naranja", "09-02": "2 mariposas verdes", "09-03": "3 botas moradas", "09-04": "2 galletas verdes", "09-05": "1 reloj morado", "09-06": "3 islas marrones", "09-07": "2 serpientes rojas", "09-08": "1 corbata rosada", "09-09": "2 zanahorias amarillas", "09-10": "3 trenes verdes", "09-12": "2 leones marrones", "09-13": "3 tortas amarillas", "09-14": "2 camas naranja", "09-15": "1 cangrejo rosado", "09-16": "2 huevos marrones", "09-17": "1 ventana rosada", "09-18": "2 pingüinos naranja", "09-19": "3 sandías rosadas", "09-20": "2 barcos marrones", "09-22": "3 monos azules", "09-23": "1 limón rojo", "09-24": "2 regalos marrones", "09-25": "3 búhos naranja", "09-26": "1 teléfono rosado", "09-28": "3 ratones morados", "09-29": "1 llave amarilla", "09-30": "3 ballenas marrones", "10-02": "2 cucharas rojas", "10-03": "1 rana naranja", "10-05": "2 carros amarillos", "10-06": "1 pato rosado", "10-07": "2 lámparas verdes", "10-08": "1 cerdo marrón", "10-09": "3 bicicletas rojas", "10-10": "1 dinosaurio amarillo", "10-11": "2 puertas moradas", "10-12": "1 oso azul", "10-13": "2 cohetes naranja", "10-14": "3 abejas azules", "10-15": "2 sillas marrones", "10-16": "3 gallinas azules", "10-17": "2 caballos rosados", "10-18": "3 jirafas azules", "10-19": "1 turpial marrón", "10-20": "3 gorras azules", "10-21": "1 manzana naranja", "10-22": "2 sombrillas amarillas", "10-23": "1 flor roja", "10-24": "2 maestras verdes", "10-25": "3 caras tristes naranja", "10-26": "1 vaca morada", "10-27": "2 arepas verdes", "10-28": "1 camisa marrón", "10-29": "2 helados verdes", "10-30": "3 casas naranja", "11-01": "1 nube verde", "11-02": "3 doctoras rojas", "11-03": "1 cara sorprendida azul", "11-04": "3 pulpos morados", "11-05": "1 guacamaya rosada", "11-06": "2 zapatos verdes", "11-07": "3 donas amarillas", "11-08": "2 tazas naranja", "11-09": "1 estrella rosada", "11-10": "3 cocineros amarillos", "11-11": "1 cara enojada naranja", "11-12": "2 pájaros marrones", "11-14": "3 chigüires rosados", "11-15": "2 sombreros rojos", "11-16": "3 peras azules", "11-17": "1 globo marrón", "11-18": "2 árboles rojos", "11-19": "3 pintores verdes", "11-21": "1 cara feliz rosada", "11-22": "3 perros naranja", "11-23": "1 cayena morada", "11-24": "2 bufandas naranja", "11-25": "3 fresas moradas", "11-26": "2 velas rojas", "11-27": "3 cactus marrones", "11-28": "1 bombero morado", "11-29": "3 caras dormidas rojas", "11-30": "2 gatos morados", "12-23": "3 tequeños rosados", "12-26": "2 medias azules", "12-27": "1 pizza naranja", "12-28": "2 macetas moradas", "12-29": "1 sol verde", "12-30": "3 enfermeros morados"};
const FIESTAS = {"01-01": ["Año Nuevo", "🎆 ¡Feliz Año Nuevo!", "tu deseo para este año"], "02-14": ["Día del Amor y la Amistad", "💕 Hoy es el Día del Amor y la Amistad", "a tu mejor amigo o amiga como si fuera un animal"], "03-08": ["Día Internacional de la Mujer", "💜 Hoy es el Día Internacional de la Mujer", "a una mujer que admiras haciendo lo que mejor sabe hacer"], "03-20": ["Día Internacional de la Felicidad", "😄 Hoy es el Día de la Felicidad", "algo que siempre te hace feliz"], "03-21": ["Día Internacional de los Bosques", "🌳 Hoy es el Día de los Bosques", "un bosque con 3 animales escondidos"], "03-22": ["Día Mundial del Agua", "💧 Hoy es el Día Mundial del Agua", "una gota de agua con cara y emociones"], "04-02": ["Día del Libro Infantil", "📖 Hoy es el Día del Libro Infantil", "al personaje de un cuento inventado por ti"], "04-22": ["Día de la Tierra", "🌍 Hoy es el Día de la Tierra", "la Tierra con una cara feliz"], "04-23": ["Día del Libro", "📚 Hoy es el Día del Libro", "una pila de libros que se convierte en ciudad"], "04-29": ["Día de la Danza", "💃 Hoy es el Día de la Danza", "algo que baila: un objeto, un animal o tú"], "05-15": ["Día de la Familia", "🏡 Hoy es el Día de la Familia", "a tu familia como si fueran frutas"], "05-20": ["Día de las Abejas", "🐝 Hoy es el Día de las Abejas", "una abeja trabajando en algo inesperado"], "06-05": ["Día del Medio Ambiente", "♻️ Hoy es el Día del Medio Ambiente", "un objeto reciclado con una vida nueva"], "06-08": ["Día de los Océanos", "🌊 Hoy es el Día de los Océanos", "un pez que nadie ha visto nunca"], "06-21": ["Día de la Música", "🎵 Hoy es el Día de la Música", "un instrumento musical con patas"], "06-27": ["Día del Periodista (Venezuela)", "🎙️ Hoy es el Día del Periodista", "un micrófono entrevistando a un animal"], "07-20": ["Llegada a la Luna", "🚀 Un día como hoy se llegó a la Luna", "tu casa en la Luna"], "07-30": ["Día Internacional de la Amistad", "🤝 Hoy es el Día de la Amistad", "dos objetos que serían mejores amigos"], "08-08": ["Día del Gato", "🐱 Hoy es el Día del Gato", "un gato haciendo tu trabajo o tu tarea"], "08-19": ["Día de la Fotografía", "📷 Hoy es el Día de la Fotografía", "una cámara y lo que está fotografiando"], "08-26": ["Día del Perro", "🐶 Hoy es el Día del Perro", "un perro con tu peinado"], "09-21": ["Día Internacional de la Paz", "🕊️ Hoy es el Día de la Paz", "una paloma que lleva algo bonito a alguien"], "09-27": ["Día del Turismo", "🧳 Hoy es el Día del Turismo", "la postal de un lugar de Venezuela que te encanta"], "10-01": ["Día del Café", "☕ Hoy es el Día del Café", "una taza de café con personalidad"], "10-04": ["Día de los Animales", "🐾 Hoy es el Día de los Animales", "tu animal favorito en su versión más tierna"], "10-31": ["Halloween", "🎃 ¡Feliz Halloween!", "una calabaza con una cara divertida"], "11-13": ["Día de la Amabilidad", "🤗 Hoy es el Día de la Amabilidad", "algo amable que alguien hizo por ti"], "11-20": ["Día Universal del Niño", "🎈 Hoy es el Día Universal del Niño", "lo que querías ser de grande cuando eras pequeño"], "12-24": ["Nochebuena", "🎄 ¡Feliz Nochebuena!", "tu cena de Nochebuena: hallacas, pan de jamón, ensalada de gallina…"], "12-25": ["Navidad", "🎁 ¡Feliz Navidad!", "el regalo que te gustaría recibir"], "12-31": ["Fin de año", "🎇 ¡Último día del año!", "lo mejor que te pasó este año"]};
const MOVILES = {"carnaval1": ["Carnaval (lunes)", "🎭 ¡Es Carnaval!", "tu disfraz de Carnaval soñado"], "carnaval2": ["Carnaval (martes)", "🎉 ¡Sigue el Carnaval!", "una máscara de Carnaval con solo 3 colores"], "madre": ["Día de la Madre (Venezuela)", "💐 Hoy es el Día de la Madre", "un ramo de flores para mamá o para quien te cuida"], "arbol": ["Día del Árbol (Venezuela)", "🌱 Hoy es el Día del Árbol", "un árbol que da algo distinto a frutas"], "padre": ["Día del Padre (Venezuela)", "👔 Hoy es el Día del Padre", "a papá o a quien te cuida como un superhéroe inventado por ti"], "nino": ["Día del Niño (Venezuela)", "🧸 Hoy es el Día del Niño", "tu juguete favorito de cuando eras pequeño"], "arepa": ["Día Mundial de la Arepa", "🫓 Hoy es el Día Mundial de la Arepa", "tu arepa favorita con su relleno"]};
const BANCO = Object.values(CAL);
/* Rango del Adviento del año de ese día (1 al 22 de diciembre). */
const advRango = dia => { const y = (dia || diaCaracas()).slice(0, 4); return { desde: y + '-12-01', hasta: y + '-12-22' }; };
/* Fechas especiales que cambian cada año: Carnaval (Pascua − 48 y − 47), Madre (2.º dom. de mayo), Árbol (último dom. de mayo),
   Padre (3.er dom. de junio), Niño (3.er dom. de julio), Día de la Arepa (2.º sáb. de septiembre). */
function pascua(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  return new Date(Date.UTC(y, Math.floor((h + l - 7 * m + 114) / 31) - 1, ((h + l - 7 * m + 114) % 31) + 1));
}
const isoUTC = d => d.toISOString().slice(0, 10);
function enesimo(y, mes, diaSemana, n) {   // n-ésimo día de la semana del mes (n = -1: el último)
  if (n < 0) { const d = new Date(Date.UTC(y, mes, 0)); while (d.getUTCDay() !== diaSemana) d.setUTCDate(d.getUTCDate() - 1); return isoUTC(d); }
  const d = new Date(Date.UTC(y, mes - 1, 1)); while (d.getUTCDay() !== diaSemana) d.setUTCDate(d.getUTCDate() + 1);
  d.setUTCDate(d.getUTCDate() + 7 * (n - 1)); return isoUTC(d);
}
function movilesDe(y) {
  const p = pascua(y), menos = n => isoUTC(new Date(p.getTime() - n * 864e5));
  return { [menos(48)]: 'carnaval1', [menos(47)]: 'carnaval2', [enesimo(y, 5, 0, 2)]: 'madre', [enesimo(y, 5, 0, -1)]: 'arbol',
    [enesimo(y, 6, 0, 3)]: 'padre', [enesimo(y, 7, 0, 3)]: 'nino', [enesimo(y, 9, 6, 2)]: 'arepa' };
}
/* La fiesta de ese día (o null): { nombre, aviso, chispa }. Solo fiestas no religiosas ni patrias, más Nochebuena y Navidad. */
export function fiestaDe(dia) {
  dia = dia || diaCaracas();
  const m = movilesDe(+dia.slice(0, 4))[dia], f = m ? MOVILES[m] : FIESTAS[dia.slice(5)];
  return f ? { nombre: f[0], aviso: f[1], chispa: f[2] } : null;
}
const LIMITE = 180, ANCHO = 648, ALTO = 700;
/* 12 nov 2026 (pedido de Stefany): para que la chispa cuente hay que dibujar al menos 10 segundos con el pincel
   (se suma solo el tiempo en que el dedo o el lápiz se mueve sobre el lienzo). Un garabato rápido ya no la termina. */
const MIN_DIBUJO = 10;
/* Candado dibujado con el mismo trazo negro y relleno amarillo que la estrella de la chispa y el fuego de la racha (reemplaza al emoji). */
export const CANDADO = '<svg class="ico-candado" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.6 10.5V7.4a4.4 4.4 0 0 1 8.8 0v3.1" fill="none" stroke="#0B0B0F" stroke-width="2.4" stroke-linecap="round"/><rect x="4.4" y="10.3" width="15.2" height="11.2" rx="3.2" fill="#FFD60A" stroke="#0B0B0F" stroke-width="2.2" stroke-linejoin="round"/><circle cx="12" cy="15.9" r="1.7" fill="#0B0B0F"/></svg>';
const trazo = d => '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
/* Herramientas dibujadas (12 nov 2026): mismo trazo negro y rellenos del reto, en vez de emojis. */
const herr = d => '<svg class="ico-herr" width="22" height="22" viewBox="0 0 24 24" stroke="#0B0B0F" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">' + d + '</svg>';
const ICO_PINCEL = herr('<path d="M19.6 3.3l1.1 1.1c.6.6.6 1.5.1 2.1l-7.4 8.4-4.3-4.3 8.4-7.4c.6-.5 1.5-.5 2.1.1z" fill="#84D7DF"/><path d="M9.1 10.6l4.3 4.3c.5 2.7-1 5.1-3.7 5.7-2.2.5-4.5 0-6.4-1.3 1.7-.6 2.4-1.7 2.7-3.4.4-2.3 1.4-4.300 3.100-5.300z" fill="#F0479B"/>');
const ICO_BORRADOR = herr('<path d="M14.3 3.700l6 6c.8.8.8 2 0 2.800L12.500 20.300H7.300l-3.600-3.600c-.8-.8-.8-2 0-2.800L11.500 3.700c.8-.8 2-.8 2.800 0z" fill="#F0479B"/><path d="M8.100 7.100l8.800 8.800-4.400 4.400H7.300l-3.600-3.600c-.8-.8-.8-2 0-2.800z" fill="#FFFFFF"/><path d="M12.500 20.300H21" fill="none"/>');
const ICO_CUBETA = herr('<path d="M4.800 9.200h14.400l-1.500 9.800c-.2 1.100-1.100 1.900-2.200 1.900H8.500c-1.100 0-2-.8-2.200-1.900z" fill="#84D7DF"/><ellipse cx="12" cy="9.200" rx="7.200" ry="2.500" fill="#FFD60A"/><path d="M5.600 8.300C6 4.600 8.700 2.900 12 2.900s6 1.700 6.400 5.400" fill="none"/>');
const ICO_DESHACER = '<svg class="ico-herr" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B0B0F" stroke-width="2.600" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.500 4.500L3.500 9.500l5 5"/><path d="M3.500 9.500H14a5.500 5.500 0 0 1 0 11h-3"/></svg>';
const ICO_MARCO = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.400" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.500" y="3" width="17" height="18" rx="2.500"/><rect x="7" y="6.500" width="10" height="8"/></svg>';
const ICO_GUARDAR = trazo('<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/>');
const ICO_COMPARTIR = trazo('<path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>');
const ICO_VIDEO = trazo('<rect x="3" y="6" width="12" height="12" rx="2.5"/><path d="M15 10.5l6-3.5v10l-6-3.5z"/>');
/* Logo de la app para la imagen guardada (ya está en la caché de la app). */
const LOGO = new Image(); LOGO.src = 'img/icon-lila-192.png';   // 12 nov 2026: ícono nuevo con fondo lila

const leerLS = k => { try { return JSON.parse(localStorage.getItem('rcf.' + k)); } catch (e) { return null; } };
const guardarLS = (k, v) => { try { localStorage.setItem('rcf.' + k, JSON.stringify(v)); } catch (e) {} };
/* 7 nov 2026: el día de la chispa sale de la hora del SERVIDOR (app.js la ajusta con ajustarHora), no del reloj del teléfono:
   así todos los teléfonos ven la misma chispa aunque alguno tenga la hora mal. */
let DESFASE = 0;
export function ajustarHora(ms) { DESFASE = Number(ms) || 0; }
const ahoraMs = () => Date.now() + DESFASE;
export function diaCaracas(d) { return new Date((d ? d.getTime() : ahoraMs()) - 4 * 36e5).toISOString().slice(0, 10); }
export function adviento(dia) {
  dia = dia || diaCaracas();
  const r = advRango(dia);
  if (dia < r.desde || dia > r.hasta) return null;
  const n = Math.round((Date.parse(dia) - Date.parse(r.desde)) / 864e5);
  const hechas = (leerLS('chispas') || []).filter(d => d >= r.desde && d <= r.hasta);
  return { dia: n + 1, total: ADVIENTO.lista.length, meta: ADVIENTO.meta, hechas: hechas, hoyHecha: hechas.indexOf(dia) >= 0, chispa: ADVIENTO.lista[n],
           desde: r.desde, marco: navidadGanada() };
}
export function navidadGanada() {
  if (leerLS('marcoNavidad')) return true;
  const r = advRango(), n = (leerLS('chispas') || []).filter(d => d >= r.desde && d <= r.hasta).length;
  if (n >= ADVIENTO.meta) { guardarLS('marcoNavidad', true); return true; }
  return false;
}
export function chispaDeHoy() {
  const dia = diaCaracas(), guardada = leerLS('chispa.' + dia);
  if (guardada && guardada.chispa) return guardada;
  const adv = adviento(dia);
  if (adv) return { chispa: adv.chispa, cambiada: false };
  const f = fiestaDe(dia);
  if (f) return { chispa: f.chispa, cambiada: false, fiesta: f };
  if (CAL[dia.slice(5)]) return { chispa: CAL[dia.slice(5)], cambiada: false };
  const n = Math.floor((Date.parse(dia) - Date.parse('2026-01-01')) / 864e5);   // días sin chispa en el calendario (29 de feb., fechas móviles de 2027 en otros años)
  return { chispa: POOL[((n % POOL.length) + POOL.length) % POOL.length], cambiada: false };
}
export function chispasDeLaSemana() {   // cuántas hiciste desde el lunes
  const hechas = leerLS('chispas') || [], hoy = new Date(ahoraMs() - 4 * 36e5);
  const lunes = new Date(hoy); lunes.setUTCDate(hoy.getUTCDate() - ((hoy.getUTCDay() + 6) % 7));
  const desde = lunes.toISOString().slice(0, 10);
  return hechas.filter(d => d >= desde).length;
}
/* Los 7 días de esta semana (lunes a domingo, hora de Caracas) para el contador de círculos de «Hoy». */
export function diasChispaSemana() {
  const hechas = leerLS('chispas') || [], hoy = new Date(ahoraMs() - 4 * 36e5), hoyIso = hoy.toISOString().slice(0, 10);
  const lunes = new Date(hoy); lunes.setUTCDate(hoy.getUTCDate() - ((hoy.getUTCDay() + 6) % 7));
  return ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((letra, i) => {
    const d = new Date(lunes); d.setUTCDate(lunes.getUTCDate() + i); const iso = d.toISOString().slice(0, 10);
    return { letra, iso, hecha: hechas.indexOf(iso) >= 0, hoy: iso === hoyIso };
  });
}
/* Racha de chispas (7 nov 2026): días seguidos haciendo la Chispa del día. Si hoy todavía no la hiciste, cuenta hasta ayer.
   Es distinta de la racha 🔥 del reto (semanas seguidas subiendo el dibujo). */
export function rachaChispas() {
  const hechas = {}; (leerLS('chispas') || []).forEach(d => { hechas[d] = true; });
  let d = Date.parse(diaCaracas()), n = 0;
  if (!hechas[new Date(d).toISOString().slice(0, 10)]) d -= 864e5;
  while (hechas[new Date(d).toISOString().slice(0, 10)]) { n++; d -= 864e5; }
  return n;
}
/* Chispas del año en este aparato (9 nov 2026, pedido de Stefany): se reinicia el 1 de enero. No se guarda en el servidor. */
export function chispasDelAnio() { const a = diaCaracas().slice(0, 4); return { anio: a, n: (leerLS('chispas') || []).filter(d => d.slice(0, 4) === a).length }; }
export function chispaHechaHoy() { return (leerLS('chispas') || []).indexOf(diaCaracas()) >= 0; }
function marcarHecha() {
  const dia = diaCaracas(), hechas = (leerLS('chispas') || []).filter(d => d !== dia);
  hechas.push(dia); guardarLS('chispas', hechas.slice(-400)); navidadGanada();   // 9 nov 2026: se guarda el año completo (antes 60 días)
}
/* Une las dos últimas palabras con un espacio que no se corta: así nunca queda una palabra sola en la última línea
   (para los teléfonos que todavía no entienden text-wrap: balance). */
const sinViuda = t => { const p = String(t).trim().split(' '); return p.length > 2 ? p.slice(0, -1).join(' ') + '\u00a0' + p[p.length - 1] : String(t); };
const hexRgb = h => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };

const IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
/* ctx: { root, esc, club (bool), volver(), irClub() } */
export function abrirChispa(ctx) {
  const { root, esc } = ctx, club = !!ctx.club;
  const hoy = chispaDeHoy();
  const S = { fase: 'lista', quedan: LIMITE, herramienta: 'pincel', color: '#000000', tam: 1, opac: 1, ops: 0, ms: 0, vale: false, video: false, chispa: hoy.chispa, cambiada: hoy.cambiada };
  let hist = [], cuadros = [], foto = null, lapiz = null, reloj = null, dibujando = false, ultimo = null, medio = null, tMov = 0;
  const candado = club ? '' : ' ' + CANDADO;
  /* Marcos: el de siempre (o el verde del Adviento) y, para el Club, los especiales. Se recuerda el último elegido. */
  const marcos = [navidadGanada() ? 'navidad' : 'clasico'].concat(club ? ['estrellas', 'rayo'] : []);
  S.marco = marcos.indexOf(leerLS('marco')) >= 0 ? leerLS('marco') : marcos[0];
  const faltan = () => Math.max(0, Math.ceil(MIN_DIBUJO - S.ms / 1000));

  root.innerHTML = `
    <header class="barra ch-barra" style="padding-bottom:10px;gap:8px">
      <button type="button" class="volver" id="ch-v" aria-label="Volver">${ctx.icoVolver || '‹'}</button>
      <div style="flex:1;min-width:0"><h1 style="font-size:19px">Chispa del día</h1><span class="sub">3 minutos · no suma puntos ni racha</span></div>
      <button type="button" class="son-ch" id="ch-son" aria-pressed="${sonidoOn()}" aria-label="Sonido del reloj" title="Sonido del reloj">${sonidoOn() ? '🔊' : '🔇'}</button>
      <span class="reloj-ch" id="ch-reloj" role="timer" aria-live="off">3:00</span>
    </header>
    <main class="cont ch">
      <div class="ch-tit"><span class="pill-ch">${adviento() ? '🎄 ADVIENTO · DÍA ' + adviento().dia + ' DE ' + adviento().total + ' · TU CHISPA ES…' : hoy.fiesta ? esc(hoy.fiesta.aviso) : 'TU CHISPA DE HOY ES…'}</span><h2 id="ch-t">${esc(sinViuda('Dibuja ' + S.chispa))}</h2><p class="ch-falta" id="ch-falta" role="status"></p></div>
      <div class="lienzo"><canvas id="ch-c" width="${ANCHO}" height="${ALTO}" aria-label="Lienzo para dibujar"></canvas><canvas id="ch-capa" class="ch-capa" width="${ANCHO}" height="${ALTO}" aria-hidden="true"></canvas><div class="ch-empezar" id="ch-emp">Toca el lienzo para empezar ✏️</div></div>
      <img class="ch-prev" id="ch-prev" alt="Tu chispa con el marco" hidden>
      <div class="ch-tools" id="ch-tools">
        <button type="button" class="tool" data-tool="pincel" aria-pressed="true" aria-label="Pincel" title="Pincel">${ICO_PINCEL}<span class="tt"> Pincel</span></button>
        <button type="button" class="tool" data-tool="borrador" aria-pressed="false" aria-label="Borrar" title="Borrar">${ICO_BORRADOR}<span class="tt"> Borrar</span></button>
        <button type="button" class="tool" data-tool="cubeta" aria-pressed="false" aria-label="Cubeta${candado ? ' (Club Estrella)' : ''}" title="Cubeta">${ICO_CUBETA}<span class="tt"> Cubeta</span>${candado}</button>
        <button type="button" class="tool" id="ch-undo" aria-label="Deshacer" title="Deshacer">${ICO_DESHACER}</button>
        <span class="tams">${SIZES.map((z, i) => `<button type="button" class="tam" data-tam="${i}" aria-pressed="${i === 1}" aria-label="Tamaño ${z[0].toLowerCase()}${club || i === 1 ? '' : ' (Club Estrella)'}"><i style="width:${[6, 10, 15][i]}px;height:${[6, 10, 15][i]}px;${club || i === 1 ? '' : 'background:#B9AECB'}"></i></button>`).join('')}</span>
      </div>
      <label class="ch-opac" for="ch-op"><span>Opacidad</span><input type="range" id="ch-op" min="10" max="100" step="5" value="100"><b id="ch-opv">100 %</b></label>
      <div class="paleta" role="group" aria-label="Colores">${PALETA.map(c => `<button type="button" class="col" data-col="${c[1]}" aria-label="${esc(c[0])}" aria-pressed="${c[1] === S.color}" style="background:${c[1]}"></button>`).join('')}</div>
      <div id="ch-abajo"></div>
    </main>`;
  const c = root.querySelector('#ch-c'), x = c.getContext('2d');
  const capa = root.querySelector('#ch-capa'), xc = capa.getContext('2d');
  const blanco = () => { x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, ANCHO, ALTO); };
  blanco();
  const $ = s => root.querySelector(s);

  /* 12 nov 2026 (pedido de Stefany): lo que es del Club se explica solo al tocarlo, en una burbuja pegada al botón (ya no hay recuadro fijo). */
  function bloqueado(el, que) {
    document.querySelectorAll('.ch-burbuja').forEach(n => n.remove());
    const b = document.createElement('div');
    b.className = 'ch-burbuja'; b.setAttribute('role', 'status');
    b.innerHTML = `<span>${CANDADO} <b>${esc(que)}</b> del Club&nbsp;Estrella.</span> <button type="button" class="enlace">Conocer el&nbsp;Club</button><i></i>`;
    document.body.appendChild(b);
    const r = el.getBoundingClientRect(), w = b.offsetWidth, h = b.offsetHeight;
    const izq = Math.max(8, Math.min(window.innerWidth - w - 8, r.left + r.width / 2 - w / 2)), arriba = r.top - h - 12 >= 8;
    b.style.left = izq + 'px'; b.style.top = (arriba ? r.top - h - 12 : r.bottom + 12) + 'px';
    if (!arriba) b.classList.add('abajo');
    b.querySelector('i').style.left = Math.max(14, Math.min(w - 30, r.left + r.width / 2 - izq - 8)) + 'px';
    const quitar = () => { b.remove(); window.removeEventListener('scroll', quitar, true); document.removeEventListener('pointerdown', fuera, true); };
    const fuera = e => { if (!b.contains(e.target)) quitar(); };
    b.querySelector('button').addEventListener('click', () => { quitar(); parar(); ctx.irClub(); });
    setTimeout(() => { window.addEventListener('scroll', quitar, true); document.addEventListener('pointerdown', fuera, true); }, 0);
    setTimeout(quitar, 4000);
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
    const fin = () => { S.fase = 'lista'; t.textContent = sinViuda('Dibuja ' + final); t.removeAttribute('aria-busy'); aviso.textContent = 'Toca el lienzo para empezar ✏️'; pintarAbajo(); if (listo) listo(); };
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return fin();
    S.fase = 'sorteo'; t.setAttribute('aria-busy', 'true'); t.textContent = 'Sorteando…'; aviso.textContent = 'Sorteando tu chispa… 🎲'; pintarAbajo();
    const ov = document.createElement('div');
    ov.className = 'ch-sorteo'; ov.setAttribute('aria-hidden', 'true');
    ov.innerHTML = `<div class="ch-sorteo-caja"><span class="pill-ch">${adviento() ? '🎄 DÍA ' + adviento().dia + ' DE ' + adviento().total : hoy.fiesta && !S.cambiada ? esc(hoy.fiesta.aviso) : 'TU CHISPA DE HOY ES…'}</span><b class="girando"></b><span class="ch-sorteo-dado">🎲</span></div>`;
    document.body.appendChild(ov);
    centrarEnLienzo(ov.querySelector('.ch-sorteo-caja'));
    const b = ov.querySelector('b');
    let paso = 0, previo = '';
    const total = 14;
    const tick = () => {
      if (!root.contains(t)) { ov.remove(); return; }   // salió de la pantalla
      if (paso >= total) {
        b.classList.remove('girando'); b.textContent = sinViuda('Dibuja ' + final); b.classList.add('cae');
        ov.querySelector('.ch-sorteo-dado').textContent = '✨';
        setTimeout(() => { ov.classList.add('sale'); setTimeout(() => { ov.remove(); if (root.contains(t)) { fin(); t.classList.add('cae'); setTimeout(() => t.classList.remove('cae'), 700); } }, 300); }, 1100);
        return;
      }
      let o; do { o = BANCO[Math.floor(Math.random() * BANCO.length)]; } while (o === previo || o === final);
      previo = o; b.textContent = sinViuda('Dibuja ' + o); paso++;
      setTimeout(tick, 45 + paso * paso * 1.6);
    };
    tick();
  }
  /* La cajita del sorteo (y la ventana del Club) se centran sobre el lienzo, no sobre toda la pantalla (6 nov 2026). */
  function centrarEnLienzo(caja) {
    const r = c.getBoundingClientRect(), h = caja.getBoundingClientRect().height;
    const arriba = Math.max(12, Math.min(window.innerHeight - h - 12, r.top + r.height / 2 - h / 2));
    caja.parentNode.style.placeItems = 'start center'; caja.style.marginTop = (arriba - parseFloat(getComputedStyle(caja.parentNode).paddingTop || 0)) + 'px';
  }
  function guardarFoto() { try { foto = c.toDataURL('image/png'); } catch (e) {} }
  function empezar() {
    S.fase = 'dibujando'; S.quedan = LIMITE; $('#ch-emp').hidden = true;
    audio();   // el navegador solo deja sonar si el audio se prepara con un toque (este)
    reloj = setInterval(() => {
      S.quedan--;
      if (S.quedan <= 0) { S.quedan = 0; campana(); terminar(); }
      else if (S.quedan <= 30) tic(S.quedan % 2 === 0, S.quedan <= 10);   // los últimos 30 s: tic-tac de suspenso
      pintarReloj(); pintarFin();
    }, 1000);
    pintarAbajo();
  }
  function terminar() {
    if (S.fase === 'hecha') return;
    parar(); dibujando = false; S.fase = 'hecha'; guardarFoto();
    S.vale = S.ops > 0 && faltan() === 0;   // 12 nov: sin 10 segundos de dibujo no cuenta
    if (S.vale) marcarHecha();
    pintarAbajo();
    avisoLienzo(!S.vale ? '' : S.quedan === 0 ? '⏰ ¡Se acabó el tiempo!' : '🎉 ¡Chispa terminada!');
  }
  /* 7 nov 2026: el aviso del final sale en el centro del dibujo y se va solo a los 2,5 segundos. */
  function avisoLienzo(texto) {
    if (!texto) return;
    const l = document.querySelector('.lienzo');
    if (!l) return;
    const a = document.createElement('div');
    a.className = 'ch-aviso'; a.setAttribute('role', 'status'); a.textContent = texto;
    l.appendChild(a);
    setTimeout(() => a.classList.add('fuera'), 2500);
    setTimeout(() => a.remove(), 3100);
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
    guardarHist(); dibujando = true; ultimo = p; medio = p; tMov = performance.now();
    if (c.setPointerCapture && e.pointerId != null) { try { c.setPointerCapture(e.pointerId); } catch (err) {} }
    const w = S.herramienta === 'borrador' ? tam().borrador : tam().pincel;
    /* Con opacidad menor a 100 % el pincel pinta en la capa de arriba (que se ve con esa opacidad); el borrador siempre borra completo. */
    lapiz = S.herramienta === 'pincel' && S.opac < 1 ? xc : x;
    capa.style.opacity = String(S.opac);
    lapiz.beginPath(); lapiz.fillStyle = S.herramienta === 'borrador' ? '#FFFFFF' : S.color; lapiz.arc(p.x, p.y, w / 2, 0, Math.PI * 2); lapiz.fill();
  }
  /* Trazo fluido (7 nov 2026): se leen TODOS los puntos que registra la pantalla o el lápiz (getCoalescedEvents)
     y se unen con curvas que pasan por el punto medio entre cada par. Antes eran rectas sueltas y salían «picos». */
  function estilo() {
    lapiz.strokeStyle = S.herramienta === 'borrador' ? '#FFFFFF' : S.color;
    lapiz.lineWidth = S.herramienta === 'borrador' ? tam().borrador : tam().pincel; lapiz.lineCap = 'round'; lapiz.lineJoin = 'round';
  }
  function seguir(p) {
    if (Math.hypot(p.x - ultimo.x, p.y - ultimo.y) < 1.2) return;
    const m = { x: (ultimo.x + p.x) / 2, y: (ultimo.y + p.y) / 2 };
    lapiz.beginPath(); lapiz.moveTo(medio.x, medio.y); lapiz.quadraticCurveTo(ultimo.x, ultimo.y, m.x, m.y); lapiz.stroke();
    medio = m; ultimo = p;
    /* Tiempo de dibujo: solo cuenta el pincel en movimiento (las pausas con el dedo quieto suman como mucho un cuarto de segundo). */
    const ya = performance.now();
    if (S.herramienta === 'pincel') S.ms += Math.min(250, Math.max(0, ya - tMov));
    tMov = ya;
  }
  function mover(e) {
    if (!dibujando || S.fase !== 'dibujando') return;
    if (e.cancelable) e.preventDefault();
    estilo();
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : null;
    (evs && evs.length ? evs : [e]).forEach(ev => seguir(pos(ev)));
  }
  function arriba() {
    if (!dibujando) return;
    dibujando = false;
    estilo(); lapiz.beginPath(); lapiz.moveTo(medio.x, medio.y); lapiz.lineTo(ultimo.x, ultimo.y); lapiz.stroke();   // cierra el último tramo
    if (lapiz === xc) { x.globalAlpha = S.opac; x.drawImage(capa, 0, 0); x.globalAlpha = 1; xc.clearRect(0, 0, ANCHO, ALTO); }   // pega el trazo con su opacidad
    lapiz = null;
    S.ops++; cuadro(); pintarAbajo();
  }
  c.addEventListener('pointerdown', abajo); c.addEventListener('pointermove', mover);
  ['touchstart', 'touchmove', 'touchend'].forEach(t => c.addEventListener(t, e => { if (e.cancelable) e.preventDefault(); }, { passive: false }));   // sin zoom ni lupa al dibujar
  c.addEventListener('dblclick', e => e.preventDefault());
  c.addEventListener('pointerup', arriba); c.addEventListener('pointercancel', arriba); c.addEventListener('pointerleave', arriba);

  root.querySelectorAll('[data-tool]').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.tool === 'cubeta' && !club) return bloqueado(b, 'La cubeta es');
    S.herramienta = b.dataset.tool;
    root.querySelectorAll('[data-tool]').forEach(t => t.setAttribute('aria-pressed', String(t === b)));
  }));
  root.querySelectorAll('[data-tam]').forEach(b => b.addEventListener('click', () => {
    if (!club && b.dataset.tam !== '1') return bloqueado(b, 'Cambiar el tamaño es');
    S.tam = +b.dataset.tam; root.querySelectorAll('[data-tam]').forEach(t => t.setAttribute('aria-pressed', String(t === b)));
  }));
  root.querySelectorAll('[data-col]').forEach(b => b.addEventListener('click', () => {
    S.color = b.dataset.col; if (S.herramienta === 'borrador') { S.herramienta = 'pincel'; root.querySelectorAll('[data-tool]').forEach(t => t.setAttribute('aria-pressed', String(t.dataset.tool === 'pincel'))); }
    root.querySelectorAll('[data-col]').forEach(t => t.setAttribute('aria-pressed', String(t === b)));
  }));
  $('#ch-op').addEventListener('input', ev => {
    S.opac = +ev.target.value / 100; $('#ch-opv').textContent = ev.target.value + ' %';
    if (S.herramienta === 'borrador') { S.herramienta = 'pincel'; root.querySelectorAll('[data-tool]').forEach(t => t.setAttribute('aria-pressed', String(t.dataset.tool === 'pincel'))); }
  });
  $('#ch-undo').addEventListener('click', () => {
    if (S.fase !== 'dibujando' || !hist.length) return;
    x.putImageData(hist.pop(), 0, 0); S.ops = Math.max(0, S.ops - 1); cuadro(); pintarAbajo();
  });
  $('#ch-v').addEventListener('click', () => { parar(); ctx.volver(); });
  $('#ch-son').addEventListener('click', ev => {
    const b = ev.currentTarget, on = !sonidoOn();
    guardarLS('chispaSonido', on); b.setAttribute('aria-pressed', String(on)); b.textContent = on ? '🔊' : '🔇';
    if (on) { audio(); tic(true, false); }
  });

  /* Marco con la marca de agua del reto. Se dibuja sobre «o» (lo crea lienzoMarco). Los marcos del Club llevan una franja
     arriba y adornos (destellos, estrellas, sello, corazones, rayo) que nunca tapan el dibujo ni los textos. */
  function pintarMarco(o, src) {
    const m = MARCO[S.marco] || MARCO.clasico, y = o.getContext('2d'), W = o.width, H = o.height, oy = m.club ? 86 : 40;
    y.fillStyle = m.fondo; y.fillRect(0, 0, W, H);
    const forma = (color, camino) => { y.beginPath(); camino(); y.closePath(); y.fillStyle = color; y.fill(); y.lineWidth = 5; y.lineJoin = 'round'; y.strokeStyle = '#0B0B0F'; y.stroke(); };
    const puntas = (cx, cy, r, n, dentro, color, giro) => forma(color, () => { for (let i = 0; i < n * 2; i++) { const a = i * Math.PI / n - Math.PI / 2 + (giro || 0), rr = i % 2 ? r * dentro : r; y[i ? 'lineTo' : 'moveTo'](cx + rr * Math.cos(a), cy + rr * Math.sin(a)); } });
    const destello = (cx, cy, r, color) => puntas(cx, cy, r, 4, .34, color);
    const estrella = (cx, cy, r, color, giro) => puntas(cx, cy, r, 5, .5, color, giro);
    const sello = (cx, cy, r, color) => forma(color, () => { for (let i = 0; i < 96; i++) { const a = i / 96 * Math.PI * 2, rr = r * (1 + .1 * Math.cos(12 * a)); y[i ? 'lineTo' : 'moveTo'](cx + rr * Math.cos(a), cy + rr * Math.sin(a)); } });
    const corazon = (cx, cy, t, color) => forma(color, () => { y.moveTo(cx, cy + t * .9); y.bezierCurveTo(cx - t * 1.5, cy - t * .1, cx - t * .7, cy - t * 1.2, cx, cy - t * .4); y.bezierCurveTo(cx + t * .7, cy - t * 1.2, cx + t * 1.5, cy - t * .1, cx, cy + t * .9); });
    const rayo = (cx, cy, t, color) => forma(color, () => { [[.25, -1], [-.6, .12], [-.08, .12], [-.35, 1], [.6, -.22], [.08, -.22], [.5, -1]].forEach((p, i) => y[i ? 'lineTo' : 'moveTo'](cx + p[0] * t, cy + p[1] * t)); });
    if (S.marco === 'estrellas') {
      forma('#FFD60A', () => y.arc(52, H + 6, 92, 0, Math.PI * 2));                                  // medio círculo abajo a la izquierda
      y.fillStyle = '#0B0B0F'; for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) { y.beginPath(); y.arc(W - 118 + i * 20, H - 86 + j * 20, 3.6, 0, Math.PI * 2); y.fill(); }   // puntos abajo a la derecha
      estrella(56, 44, 34, '#FFD60A', -.2); estrella(118, 56, 17, '#FFFFFF', .25);
      sello(W - 62, 44, 30, '#84D7DF'); destello(W - 132, 34, 17, '#FFFFFF');
      destello(W - 52, H - 150, 24, '#FFD60A');
    } else if (S.marco === 'rayo') {
      forma('#AA57F7', () => { y.moveTo(W - 150, -6); y.lineTo(W + 6, -6); y.lineTo(W + 6, 150); y.quadraticCurveTo(W - 40, 60, W - 150, -6); });   // esquina morada
      forma('#C5A6D9', () => { y.moveTo(-6, H - 64); y.bezierCurveTo(60, H - 100, 110, H - 30, 190, H + 6); y.lineTo(-6, H + 6); });                 // ola abajo a la izquierda
      corazon(52, 46, 15, '#F0479B'); corazon(92, 46, 15, '#FFD60A'); corazon(132, 46, 15, '#FFFFFF');
      destello(50, H - 150, 26, '#FFD60A'); destello(84, H - 104, 14, '#F0479B');
      rayo(W - 62, H - 96, 62, '#FFD60A');
    }
    y.fillStyle = '#0B0B0F'; y.fillRect(34, oy - 6, ANCHO + 12, ALTO + 12);
    y.drawImage(src || c, 40, oy);
    y.textAlign = 'center';
    /* 12 nov 2026 (pedido de Stefany): orden de lectura de arriba a abajo, cada línea un poco más pequeña que la anterior:
       1) quién lo dibujó · 2) #RetoMenteMilenial · 3) la chispa del día · 4) logo de la app + retocreativofest.com. */
    const cx = W / 2, max = W - (m.club ? 230 : 56);
    const texto = (t, peso, fam, tamano, color, yy) => {
      let f = tamano; y.font = peso + ' ' + f + 'px ' + fam;
      while (y.measureText(t).width > max && f > 16) { f -= 2; y.font = peso + ' ' + f + 'px ' + fam; }
      y.fillStyle = color; y.fillText(t, cx, yy);
    };
    const au = ctx.autor || {}, us = String(au.usuario || '').replace(/^@+/, '');
    const firma = au.nombre && us ? au.nombre + ' · @' + us : us ? '@' + us : au.nombre || '';
    const adv = adviento();
    const fi = !S.cambiada && hoy.fiesta;
    const linea = (adv ? 'Adviento de Chispas · día ' + adv.dia + ': ' : fi ? fi.nombre + ': ' : 'Chispa del día: ') + S.chispa;
    let yy = oy + ALTO + 12;
    if (firma) { yy += 50; texto(firma, '800', 'Poppins, sans-serif', 38, m.titulo, yy); yy += 42; texto('#RetoMenteMilenial', '700', 'Poppins, sans-serif', 28, m.texto, yy); }
    else { yy += 50; texto('#RetoMenteMilenial', '800', 'Poppins, sans-serif', 38, m.titulo, yy); }
    yy += 38; texto(linea, '700', 'Quicksand, sans-serif', 25, m.texto, yy);
    /* Cierre: el logo de la app y la web, juntos y centrados, separados del resto por una línea fina. */
    yy += 24; y.globalAlpha = .35; y.fillStyle = m.texto; y.fillRect(cx - 150, yy, 300, 2); y.globalAlpha = 1;
    const web = 'retocreativofest.com', L = 44, hayLogo = LOGO.complete && LOGO.naturalWidth > 0;
    y.font = '700 22px Quicksand, sans-serif';
    const wt = y.measureText(web).width, total = (hayLogo ? L + 12 : 0) + wt, x0 = cx - total / 2, yl = yy + 18;
    if (hayLogo) {
      y.save(); y.beginPath();
      if (y.roundRect) y.roundRect(x0, yl, L, L, 11); else y.rect(x0, yl, L, L);
      y.clip(); y.drawImage(LOGO, x0, yl, L, L); y.restore();
      y.beginPath(); if (y.roundRect) y.roundRect(x0, yl, L, L, 11); else y.rect(x0, yl, L, L); y.lineWidth = 3; y.strokeStyle = '#0B0B0F'; y.stroke();
    }
    y.textAlign = 'left'; y.fillStyle = m.texto; y.fillText(web, x0 + (hayLogo ? L + 12 : 0), yl + L / 2 + 8); y.textAlign = 'center';
    return o;
  }
  function lienzoMarco() {
    const o = document.createElement('canvas'), m = MARCO[S.marco] || MARCO.clasico;
    o.width = ANCHO + 80; o.height = ALTO + (ctx.autor && (ctx.autor.usuario || ctx.autor.nombre) ? 284 : 242) + (m.club ? 46 : 0); return o;
  }
  /* Vista previa con el marco (al terminar): reemplaza al lienzo y a las herramientas para que se vea cómo queda la imagen. */
  function pintarPrevia() {
    const ver = S.fase === 'hecha' && S.vale && !S.video, pv = $('#ch-prev');
    root.querySelector('.lienzo').hidden = ver; pv.hidden = !ver;
    ['#ch-tools', '.ch-opac', '.paleta'].forEach(q => { const n = root.querySelector(q); if (n) n.hidden = S.fase === 'hecha'; });
    if (ver) { try { pv.src = conMarco().toDataURL('image/png'); } catch (e) {} }
  }
  if (!LOGO.complete) LOGO.addEventListener('load', () => { if (root.contains(c)) pintarPrevia(); });
  function conMarco() { return pintarMarco(lienzoMarco()); }
  function descargar(href, nombre) { const a = document.createElement('a'); a.href = href; a.download = nombre; document.body.appendChild(a); a.click(); a.remove(); }
  /* 8 nov 2026: en Android, «Compartir» abría la lista de apps y no había forma de guardar en el teléfono.
     Ahora son dos botones: GUARDAR (descarga directa a «Descargas», también en la app de Google Play) y COMPARTIR. */
  const nombreImg = () => 'chispa-' + diaCaracas() + '.png';
  async function imagenChispa() { const o = conMarco(); return await new Promise(ok => o.toBlob(ok, 'image/png')); }
  async function guardarImagen() {
    const blob = await imagenChispa();
    if (!blob) return;
    /* 9 nov 2026: en iPhone y iPad la descarga abre una vista previa que, al cerrarla, dejaba la app descolocada
       (menú a media pantalla). Ahí «Guardar» usa la hoja de compartir del sistema, que trae «Guardar imagen» (va a Fotos). */
    if (IOS) {
      const archivo = new File([blob], nombreImg(), { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [archivo] })) {
        const n = $('#ch-nota'); if (n) n.textContent = 'Toca «Guardar imagen» para guardarla en Fotos.';
        try { await navigator.share({ files: [archivo] }); setTimeout(ventanaClub, 400); } catch (e) {}
        return;
      }
    }
    const url = URL.createObjectURL(blob);
    descargar(url, nombreImg());
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    const n = $('#ch-nota'); if (n) n.textContent = '✓ Guardada en tu teléfono, en la carpeta «Descargas» (también la ves en la Galería).';
    setTimeout(ventanaClub, 1200);   // deja ver el aviso de la descarga
  }
  async function compartir() {
    const blob = await imagenChispa();
    const archivo = blob && new File([blob], nombreImg(), { type: 'image/png' });
    if (archivo && navigator.canShare && navigator.canShare({ files: [archivo] })) {
      try { await navigator.share({ files: [archivo], text: 'Mi chispa del día: ' + S.chispa + ' #RetoMenteMilenial' }); return ventanaClub(); } catch (e) { if (e && e.name === 'AbortError') return; }
    }
    guardarImagen();
  }
  const puedeCompartir = !!(navigator.canShare && navigator.share);
  /* 6 nov 2026: la ventana del Club sale DESPUÉS de guardar o compartir la chispa (no tapa el dibujo antes).
     Quién la ve lo decide app.js: solo mayores, nunca miembros, nunca en Google Play, 1 vez al día. */
  function ventanaClub() { mostrarPromoClub({ promoClub: ctx.promoClub, irClub: () => { parar(); ctx.irClub(); } }); }
  function video() {
    if (!club) return bloqueado($('#ch-video'), 'El video acelerado es');
    if (!cuadros.length || S.video) return;
    S.video = true; pintarAbajo();
    let rec = null; const trozos = [], o = lienzoMarco();   // el video también lleva el marco y la marca de agua
    if (o.captureStream && window.MediaRecorder) {
      try {
        const tipo = ['video/mp4', 'video/webm;codecs=vp9', 'video/webm'].find(t => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t));
        pintarMarco(o);
        rec = new MediaRecorder(o.captureStream(30), tipo ? { mimeType: tipo } : undefined);
        rec.ondataavailable = e => { if (e.data && e.data.size) trozos.push(e.data); };
        rec.onstop = () => { const b = new Blob(trozos, { type: rec.mimeType || 'video/webm' }); descargar(URL.createObjectURL(b), 'chispa-acelerada.' + ((rec.mimeType || '').includes('mp4') ? 'mp4' : 'webm')); };
        rec.start();
      } catch (e) { rec = null; }
    }
    const lista = cuadros.slice(), pausa = Math.max(60, Math.min(300, 5000 / lista.length));
    let i = 0; blanco(); pintarMarco(o);
    const sig = () => {
      if (i >= lista.length) { setTimeout(() => { if (rec) rec.stop(); S.video = false; pintarAbajo(); }, 900); return; }
      const img = new Image(); img.onload = () => { x.drawImage(img, 0, 0); pintarMarco(o); i++; setTimeout(sig, pausa); }; img.src = lista[i];
    };
    setTimeout(sig, 300);
  }
  function pintarAbajo() {
    const ab = $('#ch-abajo');
    if (S.fase !== 'hecha') {
      ab.innerHTML = `<button type="button" class="btn blanco" id="ch-fin" hidden>TERMINÉ ANTES</button>
        ${S.fase === 'lista' ? `<button type="button" class="btn blanco chico" id="ch-cambiar" ${S.cambiada ? 'disabled' : ''}>${S.cambiada ? 'Ya cambiaste tu chispa de hoy' : '🔄 Cambiar mi chispa · 1 al día' + candado}</button>` : ''}`;
      pintarFin();
      const f = $('#ch-fin'); if (f) f.addEventListener('click', terminar);
      const ca = $('#ch-cambiar');
      if (ca) ca.addEventListener('click', () => {
        if (S.cambiada) return;
        if (!club) return bloqueado(ca, 'Cambiar la chispa es');
        const banco = adviento() ? ADVIENTO.lista : BANCO;
        let n = Math.floor(Math.random() * banco.length); if (banco[n] === S.chispa) n = (n + 1) % banco.length;
        S.chispa = banco[n]; S.cambiada = true; guardarLS('chispa.' + diaCaracas(), { chispa: S.chispa, cambiada: true });
        sortear(S.chispa);
      });
      return;
    }
    pintarPrevia(); pintarFin();
    if (!S.vale) {
      ab.innerHTML = `<div class="caja">${S.ops <= 0 ? 'El lienzo quedó en blanco. ¡Inténtalo otra vez!' : 'Para que tu chispa cuente hay que dibujar al menos ' + MIN_DIBUJO + ' segundos. ¡Inténtalo otra vez!'}</div><button type="button" class="btn amarillo" id="ch-otra">VOLVER A INTENTAR</button>`;
      $('#ch-otra').addEventListener('click', () => abrirChispa(ctx));
      return;
    }
    const adv = adviento();
    ab.innerHTML = `
      ${S.video ? '<div class="caja agua" style="text-align:center">🎬 Grabando el video acelerado…</div>' : ''}
      ${adv && navidadGanada() ? '<div class="caja crema ch-insignia">🎄 <b>Insignia del Adviento ganada.</b> Tu marco ahora es verde navideño.</div>' : ''}
      <div class="compartir ch-fila">
        <button type="button" class="btn blanco chico cp-chico" id="ch-video" ${S.video ? 'disabled' : ''}>${ICO_VIDEO}<span>Video acelerado</span>${club ? '' : CANDADO}</button>
        <button type="button" class="btn blanco chico cp-chico" id="ch-marco" ${S.video ? 'disabled' : ''}>${ICO_MARCO}<span>Cambiar marco</span>${club ? '' : CANDADO}</button>
        ${puedeCompartir ? `<button type="button" class="btn blanco chico cp-chico ch-ico" id="ch-comp" aria-label="Compartir" title="Compartir">${ICO_COMPARTIR}</button>` : ''}
        <button type="button" class="btn amarillo cp-grande" id="ch-desc">${ICO_GUARDAR}<span>GUARDAR EN MI TELÉFONO</span></button>
      </div>
      <p class="nota" id="ch-nota" role="status" style="margin:0;text-align:center"></p>
      <button type="button" class="enlace" id="ch-salir">Volver a Hoy · mañana hay otra chispa</button>`;
    $('#ch-desc').addEventListener('click', guardarImagen);
    if ($('#ch-comp')) $('#ch-comp').addEventListener('click', compartir);
    $('#ch-video').addEventListener('click', video);
    $('#ch-marco').addEventListener('click', () => {
      if (!club) return bloqueado($('#ch-marco'), 'Los marcos especiales son');
      S.marco = marcos[(marcos.indexOf(S.marco) + 1) % marcos.length]; guardarLS('marco', S.marco); pintarAbajo();
    });
    $('#ch-salir').addEventListener('click', () => ctx.volver());
  }
  /* Debajo del texto de la chispa (sin recuadro) dice cuánto falta; el botón «TERMINÉ ANTES» aparece cuando ya hay 10 segundos de dibujo. */
  function pintarFin() {
    const f = $('#ch-fin'), p = $('#ch-falta'), n = faltan(), listo = S.ops > 0 && n === 0;
    const t = S.fase === 'hecha' || S.fase === 'sorteo' ? '' : listo ? '¡Listo! Termina cuando quieras' : S.ms < 1000 ? 'Dibuja al menos ' + MIN_DIBUJO + ' segundos para terminar' : n > 0 ? 'Dibuja ' + n + (n === 1 ? ' segundo' : ' segundos') + ' más para terminar' : 'Dibuja algo para terminar';
    if (p && p.textContent !== t) p.textContent = t;
    if (p) p.hidden = S.fase === 'hecha';   // al terminar no deja un hueco entre el título y la imagen
    if (f) f.hidden = !listo;
  }
  pintarReloj(); sortear(S.chispa);
  return () => parar();
}

/* ---------- sonidos del reloj (7 nov 2026) ----------
   Se generan en el teléfono (sin archivos de audio): tic-tac los últimos 30 segundos y una campana al acabarse el tiempo.
   Se pueden apagar con el botón 🔊 junto al reloj (queda guardado en el teléfono). */
let AC = null;
const sonidoOn = () => leerLS('chispaSonido') !== false;
function audio() {
  if (!sonidoOn()) return null;
  try { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) { AC = null; }
  return AC;
}
function nota(frec, inicio, dura, vol, tipo) {
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = tipo || 'sine'; o.frequency.value = frec;
  g.gain.setValueAtTime(0.0001, inicio); g.gain.exponentialRampToValueAtTime(vol, inicio + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, inicio + dura);
  o.connect(g); g.connect(AC.destination); o.start(inicio); o.stop(inicio + dura + 0.02);
}
function tic(esTic, urgente) {
  if (!sonidoOn() || !audio()) return;
  const t = AC.currentTime;
  nota(esTic ? (urgente ? 1900 : 1500) : (urgente ? 1400 : 1050), t, 0.05, urgente ? 0.3 : 0.18, 'square');
}
function campana() {
  if (navigator.vibrate) try { navigator.vibrate([120, 80, 220]); } catch (e) {}
  if (!sonidoOn() || !audio()) return;
  const t = AC.currentTime;
  [[1, 0.35], [2.0, 0.18], [2.76, 0.12], [5.4, 0.06]].forEach(([k, v]) => { nota(784 * k, t, 2.6, v); nota(784 * k, t + 0.45, 2.2, v * 0.7); });
}

/* ---------- ventana del Club Estrella (después de guardar la chispa o de subir el dibujo) ----------
   Quién la ve lo decide app.js (promoClub): solo mayores, nunca miembros, nunca en Google Play, 1 vez al día. */
export function mostrarPromoClub(ctx) {
  if (!(ctx.promoClub && ctx.promoClub()) || document.querySelector('.club-modal')) return false;
  const ov = document.createElement('div');
  ov.className = 'club-modal'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-labelledby', 'club-ban-t');
  ov.innerHTML = `<div class="club-modal-caja"><button type="button" class="club-modal-x" aria-label="Cerrar">✕</button>${bannerClub(ctx.titulo)}</div>`;
  document.body.appendChild(ov);
  const cerrar = () => ov.remove();
  ov.querySelector('.club-modal-x').addEventListener('click', cerrar);
  ov.addEventListener('click', e => { if (e.target === ov) cerrar(); });
  ov.querySelector('#ch-club-b').addEventListener('click', () => { cerrar(); ctx.irClub(); });
  ov.querySelector('.club-modal-x').focus();
  return true;
}
/* Banner del Club Estrella (6 nov 2026). Las estrellas son las de Stefany. */
export function bannerClub(titulo) {
  const destello = '<svg class="dst" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z"/></svg>';
  return `<section class="club-ban" aria-labelledby="club-ban-t">${destello}${destello}
    <div class="club-ban-est"><img src="img/estrella-1.webp" alt="" width="46" height="40"><img src="img/estrella-3.webp" alt="" width="42" height="42"><img src="img/estrella-6.webp" alt="" width="44" height="42"></div>
    <span class="club-ban-pill">CLUB ESTRELLA</span>
    <h3 id="club-ban-t">${titulo || '¿Te quedaste con ganas de&nbsp;más?'}</h3>
    <p>Ve el reto <b>24 horas antes</b>, cuida tu racha con <b>2 protectores al mes</b> y desbloquea la Chispa Pro: cubeta, 3 tamaños y video&nbsp;acelerado.</p>
    <button type="button" class="btn amarillo chico" id="ch-club-b">★ CONOCER EL CLUB ESTRELLA</button>
    <small>5,50 $ al mes · participar en el reto es gratis&nbsp;siempre</small>
  </section>`;
}
