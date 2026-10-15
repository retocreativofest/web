"""Lee la página pública del canal de WhatsApp y guarda los seguidores en data/canal.json.
Lo ejecuta GitHub Actions (.github/workflows/canal.yml). Si WhatsApp no muestra el número,
deja el archivo como estaba para que la web siga mostrando la última cifra conocida."""
import json, re, sys, datetime, pathlib, urllib.request

URL = 'https://www.whatsapp.com/channel/0029Vb0wgM92P59bPnVm2E2I'
OUT = pathlib.Path(__file__).resolve().parent.parent / 'data' / 'canal.json'

def to_int(num, suf):
    num = num.replace(',', '.') if suf else num.replace('.', '').replace(',', '')
    v = float(num)
    return int(v * {'k': 1_000, 'm': 1_000_000}.get(suf.lower(), 1)) if suf else int(v)

req = urllib.request.Request(URL, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Accept-Language': 'es,en;q=0.8'})
try:
    html = urllib.request.urlopen(req, timeout=30).read().decode('utf-8', 'ignore')
except Exception as e:
    print('No se pudo leer el canal:', e); sys.exit(0)

m = re.search(r'([\d.,]+)\s*(mil|[KkMm])?\s*(followers|seguidores)', html)
if not m:
    print('No encontré la cifra de seguidores; no cambio nada.'); sys.exit(0)
suf = 'k' if (m.group(2) or '').lower() == 'mil' else (m.group(2) or '')
n = to_int(m.group(1), suf)

old = json.loads(OUT.read_text()) if OUT.exists() else {'seguidores': 0}
if n < old.get('seguidores', 0) * 0.5:
    print('Cifra sospechosa:', n, '— no cambio nada.'); sys.exit(0)
OUT.write_text(json.dumps({'seguidores': n, 'actualizado': datetime.date.today().isoformat()}, ensure_ascii=False) + '\n')
print('Seguidores:', n)
