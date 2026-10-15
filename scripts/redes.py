"""Lee los seguidores de Instagram y TikTok de @retocreativofest y @mentemilenial
y los guarda en data/redes.json. Lo ejecuta GitHub Actions (.github/workflows/redes.yml).
Si una red no deja leer la cifra, se conserva el último número guardado (también el que
se escriba a mano en el archivo)."""
import json, re, datetime, pathlib, urllib.request

CUENTAS = ['retocreativofest', 'mentemilenial']
OUT = pathlib.Path(__file__).resolve().parent.parent / 'data' / 'redes.json'
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

def get(url, headers=None):
    h = {'User-Agent': UA, 'Accept-Language': 'es,en;q=0.8'}
    h.update(headers or {})
    return urllib.request.urlopen(urllib.request.Request(url, headers=h), timeout=30).read().decode('utf-8', 'ignore')

def num(txt, suf=''):
    suf = suf.lower()
    if suf in ('k', 'm', 'mil'):
        return int(float(txt.replace(',', '.')) * (1_000_000 if suf == 'm' else 1_000))
    return int(re.sub(r'[^\d]', '', txt))

def tiktok(user):
    html = get(f'https://www.tiktok.com/@{user}')
    m = re.search(r'"followerCount"\s*:\s*(\d+)', html)
    return int(m.group(1)) if m else None

def instagram(user):
    try:
        d = json.loads(get(f'https://i.instagram.com/api/v1/users/web_profile_info/?username={user}', {'x-ig-app-id': '936619743392459'}))
        return int(d['data']['user']['edge_followed_by']['count'])
    except Exception:
        pass
    html = get(f'https://www.instagram.com/{user}/')
    m = re.search(r'([\d.,]+)\s*([KkMm]|mil)?\s*(Followers|seguidores)', html)
    return num(m.group(1), m.group(2) or '') if m else None

datos = json.loads(OUT.read_text()) if OUT.exists() else {}
hoy = datetime.date.today().isoformat()
for red, leer in (('instagram', instagram), ('tiktok', tiktok)):
    for user in CUENTAS:
        previo = datos.setdefault(red, {}).setdefault(user, {'seguidores': 0})
        try:
            n = leer(user)
        except Exception as e:
            print(f'{red} @{user}: no se pudo leer ({e.__class__.__name__}); se queda en {previo["seguidores"]}')
            continue
        if not n:
            print(f'{red} @{user}: sin cifra en la página; se queda en {previo["seguidores"]}')
            continue
        if previo.get('seguidores') and n < previo['seguidores'] * 0.5:
            print(f'{red} @{user}: cifra sospechosa {n}; se queda en {previo["seguidores"]}')
            continue
        datos[red][user] = {'seguidores': n, 'actualizado': hoy, 'fuente': 'automática'}
        print(f'{red} @{user}: {n}')

OUT.write_text(json.dumps(datos, ensure_ascii=False, indent=2) + '\n')
