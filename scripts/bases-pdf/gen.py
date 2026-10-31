# Genera el PDF de las bases: python3 gen.py (desde esta carpeta). Editar bases.html y volver a ejecutar.
import asyncio, pathlib
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg=await b.new_page()
        await pg.goto('file://'+str(pathlib.Path('bases.html').resolve())); await pg.wait_for_timeout(800)
        print(await pg.evaluate("[...document.querySelectorAll('.page')].map(p=>[p.scrollHeight,p.clientHeight, Math.round([...p.querySelectorAll('.card,.dudas')].pop().getBoundingClientRect().bottom - p.getBoundingClientRect().top)])"))
        await pg.pdf(path='../../assets/docs/Condiciones-y-bases-generales-RetoMenteMilenial.pdf', format='A4', print_background=True, prefer_css_page_size=True)
        await b.close()
asyncio.run(main())
