# KRUTZ Pizzería · Carta digital

Carta estática (HTML + CSS + JS, sin dependencias), pensada primero para celular.
Se puede subir tal cual a cualquier hosting o a una carpeta de krutz.cl (por ejemplo `krutz.cl/carta/`).

## Actualizar productos, precios y fotos

Todo está en **`assets/js/carta.js`**:

- **Precio:** número sin puntos (`7990`). La carta lo muestra como `$7.990`.
- **Foto:** guarda la imagen en `assets/fotos/` y escribe su ruta en `foto`. Si está vacía se muestra un espacio reservado.
- **Descripción / ingredientes:** campo `descripcion`. Si está vacío no se muestra nada.
- **Etiqueta:** `"Favorito"`, `"Especialidad"` o `"Recomendado"` (solo las aprobadas).
- **Napoletana:** `napoletana: true` en las pizzas que la admiten.
- **Foto de portada:** `fotoPortada`.

## QR

`qr/` contiene el QR a Instagram (@krutz.cl) en PNG y SVG, y una tarjeta A6 imprimible (PDF/PNG).
Es un QR estático: no caduca ni depende de servicios externos.

Íconos de los espacios reservados: Lucide (licencia ISC).
