"""Desde el 6 de diciembre de 2026 (hora de Caracas) cambia el título y la descripción que muestran
WhatsApp, Google y las redes al compartir el enlace de la web. El resto de la web cambia sola en el
navegador (assets/js/rcf.js), pero esas vistas previas leen el archivo tal cual, sin ejecutar nada.
Lo ejecuta GitHub Actions (.github/workflows/post-evento.yml) una vez al día; si ya está hecho, no cambia nada.
Para probar: POST_EVENTO_HOY=2026-12-06 python scripts/post_evento.py"""
import datetime, os, pathlib, sys

DESDE = datetime.date(2026, 12, 6)
RAIZ = pathlib.Path(__file__).resolve().parent.parent
CAMBIOS = {
    'index.html': [
        ('Reto Creativo Fest 2026 · Dibuja. Conecta. Celebra.',
         'Reto Creativo Fest · Dibuja cada semana con el #RetoMenteMilenial'),
        ('Festival de ilustración en Caracas: concurso de dibujo en vivo, charlas, bazar creativo y premiación del #RetoMenteMilenial. Sábado 5 de diciembre en FACES-UCV. Entrada gratuita.',
         'Dibuja cada semana con el #RetoMenteMilenial: descarga gratis la app, mira el reto, sube tu dibujo y gana premios en el Reto Creativo Fest, el festival de ilustración de Caracas.'),
    ],
    'sitemap.xml': [   # la página del concurso lleva al Inicio: sale del mapa del sitio para Google
        ('  <url><loc>https://retocreativofest.com/concurso.html</loc></url>\n', ''),
    ],
    'concurso.html': [
        ('Concurso de dibujo en vivo «Luces de Navidad en Venezuela». Sábado 5 de diciembre en el Sótano de FACES-UCV. Requisitos, programa y jurado.',
         'Así fue el concurso de dibujo en vivo «Luces de Navidad en Venezuela» de la 4.ª edición del Reto Creativo Fest. Sigue dibujando cada semana con el #RetoMenteMilenial.'),
    ],
}

hoy = os.environ.get('POST_EVENTO_HOY')
hoy = datetime.date.fromisoformat(hoy) if hoy else (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=4)).date()
if hoy < DESDE:
    print('Todavía no es 6 de diciembre en Caracas (hoy:', hoy, '): no cambio nada.'); sys.exit(0)

total = 0
for nombre, pares in CAMBIOS.items():
    archivo = RAIZ / nombre
    texto = archivo.read_text(encoding='utf-8')
    nuevo = texto
    for viejo, reemplazo in pares:
        nuevo = nuevo.replace(viejo, reemplazo)
    if nuevo != texto:
        archivo.write_text(nuevo, encoding='utf-8')
        total += 1
        print('Actualizado:', nombre)
print('Archivos cambiados:', total)
