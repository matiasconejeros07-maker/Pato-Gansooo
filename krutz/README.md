# KRUTZ Pizzería · Menú digital

Menú estático (HTML + CSS + JS, sin dependencias), pensado primero para celular y con la misma
identidad visual de krutz.cl (negro, blanco y amarillo; League Spartan + DM Sans).
Se puede subir tal cual a cualquier hosting o a una carpeta de krutz.cl.

## Actualizar productos, precios y fotos

Todo está en **`assets/js/carta.js`**:

- **Precio:** número sin puntos (`7990`). El menú lo muestra como `$7.990`.
- **Detalle:** tamaño o porción (`"120 g"`, `"12 oz / 300 ml"`). Opcional.
- **Descripción / ingredientes:** campo `descripcion`. Si está vacío no se muestra nada.
- **Foto:** guarda la imagen (vertical 4:5, ej. 960×1200) en `assets/fotos/` y escribe su ruta en `foto`.
  Los productos con foto aparecen en la franja de fotos de su sección.
- **Opciones al pedir:** `opciones` (ej. sabor de la lata, salsa de las papas). El cliente debe elegir una antes de agregar.
- **Hazla DOP:** `napoletana: true` en las pizzas que la admiten; el bloque se edita en `napoletana`.
- **Categorías:** `menu` (texto en la barra de categorías; sin él no aparece), `kicker`, `nombre`,
  `intro`, `notas`, `aviso`, `dosColumnas`, `ancho` y `destacado` (bloque amarillo).
- **Portada:** `videoPortada` (video del horno, en loop y sin sonido) y `fotoPortada` (imagen de respaldo).
- **WhatsApp:** `whatsapp` (solo números); todos los botones de pedido lo usan.

## Pedidos

Cada producto tiene un botón **Agregar**. El cliente arma su pedido y escribe comentarios
(ej. «sin albahaca»). Para pedir debe tener una cuenta con **nombre, RUT y teléfono**; el RUT se valida.
Luego toca **Pedir al local**.

- **Con servidor** (`pedidosURL` en `carta.js`): el pedido se guarda en tu planilla de Google
  y te llega a tu WhatsApp, con un correo de respaldo. El cliente ve «¡Pedido recibido!» con su número de pedido.
  Para activarlo, sigue [`servidor/LEEME.md`](servidor/LEEME.md).
- **Sin servidor** (`pedidosURL` vacío): se abre el WhatsApp del cliente con el pedido escrito.

La lógica está en `assets/js/pedido.js`, los estilos en `assets/css/pedido.css`
y el servidor en `servidor/Codigo.gs`.

## QR

`qr/` contiene el QR a Instagram (@krutz.cl) en PNG y SVG, y una tarjeta A6 imprimible (PDF/PNG).
Es un QR estático: no caduca ni depende de servicios externos.
