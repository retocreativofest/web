"""Guarda la tasa oficial del BCV (bolívares por dólar) en data/bcv.json para que el carrito muestre
el total en Bs. Lo ejecuta GitHub Actions (.github/workflows/bcv.yml) cada 6 horas.
Fuente principal: ve.dolarapi.com (repite la tasa del BCV); si falla, la página del BCV.
Si nada responde, o el número parece raro, deja el archivo como estaba: la web avisa si la tasa es vieja."""
import json, re, sys, pathlib, urllib.request

OUT = pathlib.Path(__file__).resolve().parent.parent / 'data' / 'bcv.json'
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def leer(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30).read().decode('utf-8', 'ignore')

def dolarapi():
    d = json.loads(leer('https://ve.dolarapi.com/v1/dolares/oficial'))
    return float(d['promedio']), str(d['fechaActualizacion'])[:10]

def bcv():
    html = leer('https://www.bcv.org.ve/')
    m = re.search(r'id="dolar".*?<strong>\s*([\d.,]+)\s*</strong>', html, re.S)
    f = re.search(r'Fecha Valor.*?content="(\d{4}-\d{2}-\d{2})', html, re.S)
    return float(m.group(1).replace('.', '').replace(',', '.')), f.group(1)

tasa = fecha = None
for fuente in (dolarapi, bcv):
    try:
        tasa, fecha = fuente(); break
    except Exception as e:
        print('Falló', fuente.__name__, e)
if not tasa or not re.match(r'^\d{4}-\d{2}-\d{2}$', fecha or ''):
    print('Sin tasa nueva; no cambio nada.'); sys.exit(0)

old = json.loads(OUT.read_text()) if OUT.exists() else {}
if old.get('tasa') and not (0.7 < tasa / old['tasa'] < 1.5):
    print('Tasa sospechosa:', tasa, 'antes', old['tasa'], '— no cambio nada.'); sys.exit(0)
OUT.write_text(json.dumps({'tasa': round(tasa, 4), 'fecha': fecha}, ensure_ascii=False) + '\n')
print('Tasa BCV:', tasa, fecha)
