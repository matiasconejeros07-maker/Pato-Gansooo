"""Genera el QR (estático) que abre el Instagram de Las Docas, con el logo al centro.

Uso:  python3 qr/generar_qr.py
Requiere: pip install segno pillow
El QR codifica la URL directamente: no depende de ningún servicio externo,
no caduca y no tiene intermediarios.
"""
import base64
import io
from pathlib import Path

import segno
from PIL import Image, ImageDraw

URL = "https://www.instagram.com/lasdocas/"
AQUI = Path(__file__).resolve().parent
LOGO = AQUI.parent / "assets" / "img" / "logo-las-docas.png"
TINTA = "#141414"
BORDE = 4            # zona de silencio en módulos (estándar)
LOGO_FRAC = 0.30     # diámetro del logo respecto del símbolo

qr = segno.make(URL, error="h", micro=False, boost_error=False)
matrix = [list(row) for row in qr.matrix]
n = len(matrix)
centro = n / 2
r_logo = n * LOGO_FRAC / 2
r_hueco = r_logo + 0.6  # margen blanco alrededor del logo


def en_hueco(fila, col):
    return ((col + .5 - centro) ** 2 + (fila + .5 - centro) ** 2) ** .5 < r_hueco


def png(ruta, escala):
    total = (n + 2 * BORDE) * escala
    img = Image.new("RGB", (total, total), "white")
    d = ImageDraw.Draw(img)
    for f, fila in enumerate(matrix):
        for c, v in enumerate(fila):
            if v and not en_hueco(f, c):
                x, y = (c + BORDE) * escala, (f + BORDE) * escala
                d.rectangle([x, y, x + escala - 1, y + escala - 1], fill=TINTA)
    lado = int(2 * r_logo * escala)
    logo = Image.open(LOGO).convert("RGBA").resize((lado, lado), Image.LANCZOS)
    pos = int((BORDE + centro) * escala - lado / 2)
    img.paste(logo, (pos, pos), logo)
    img.save(ruta, optimize=True)


def svg(ruta):
    total = n + 2 * BORDE
    rects = []
    for f, fila in enumerate(matrix):
        c = 0
        while c < n:
            if fila[c] and not en_hueco(f, c):
                ini = c
                while c < n and fila[c] and not en_hueco(f, c):
                    c += 1
                rects.append(f"M{ini + BORDE} {f + BORDE}h{c - ini}v1h-{c - ini}z")
            else:
                c += 1
    buf = io.BytesIO()
    Image.open(LOGO).convert("RGBA").resize((600, 600), Image.LANCZOS).save(buf, "PNG", optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode()
    lado = 2 * r_logo
    pos = BORDE + centro - r_logo
    ruta.write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total} {total}" shape-rendering="crispEdges">'
        f"<title>QR Instagram @lasdocas</title>"
        f'<rect width="{total}" height="{total}" fill="#fff"/>'
        f'<path fill="{TINTA}" d="{"".join(rects)}"/>'
        f'<image href="data:image/png;base64,{b64}" x="{pos:.3f}" y="{pos:.3f}" width="{lado:.3f}" height="{lado:.3f}"/>'
        f"</svg>",
        encoding="utf-8",
    )


png(AQUI / "qr-instagram-lasdocas.png", 80)
svg(AQUI / "qr-instagram-lasdocas.svg")
print(f"QR versión {qr.version}, corrección {qr.error}, {n}x{n} módulos -> {URL}")
