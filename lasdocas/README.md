# Las Docas · Cafetería en Las Cruces

Sitio web estático (HTML + CSS + JS, sin dependencias externas), diseñado primero para celular.

## Cómo actualizar el contenido

Todo se edita en **`assets/js/contenido.js`**:

- **Reseñas**: agrega `{ nombre, estrellas: 5, texto, fecha }`. Solo se muestran las de 5 estrellas.
  Borra las reseñas de ejemplo (`ejemplo: true`), que llevan una etiqueta «Ejemplo» visible.
- **Fotos**: guárdalas en `assets/fotos/` y agrégalas a `fotos`. La primera se usa en la portada;
  la galería arma sola un mosaico sin huecos.
- **Dirección, horario y WhatsApp**: si quedan vacíos, la sección «Visítanos» no se muestra.

## Código QR (Instagram)

Carpeta `qr/`:

| Archivo | Uso |
| --- | --- |
| `qr-instagram-lasdocas.png` | QR en alta resolución (3600 px) con el logo |
| `qr-instagram-lasdocas.svg` | QR vectorial para imprenta, en cualquier tamaño |
| `tarjeta-qr-lasdocas.pdf` / `.png` | Tarjeta lista para imprimir (A6, 105 × 148 mm) |
| `generar_qr.py` | Script para volver a generar el QR (`pip install segno pillow`) |

El QR es **estático**: codifica directamente `https://www.instagram.com/lasdocas/`.
No pasa por ningún servicio externo, así que no caduca, no tiene suscripción y funciona para siempre.

## Ver el sitio localmente

```bash
cd lasdocas && python3 -m http.server 8000
# abrir http://localhost:8000
```
