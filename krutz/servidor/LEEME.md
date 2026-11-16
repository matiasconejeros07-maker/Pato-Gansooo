# KRUTZ · Activar los pedidos directos a tu WhatsApp

Con esto, cuando un cliente toca **Pedir al local**:

1. El pedido se guarda en una planilla de Google tuya (hoja **Pedidos**, con número KR-0001, KR-0002…).
2. Los datos del cliente (nombre, RUT, teléfono) quedan en la hoja **Clientes**.
3. Te llega el pedido completo a tu WhatsApp, enviado por CallMeBot.
4. Si el WhatsApp falla, te llega el mismo pedido por correo como respaldo.

El cliente solo ve «¡Pedido recibido!» con su número de pedido. No se abre WhatsApp en su teléfono.

Son unos 15 minutos y es gratis.

---

## Paso 1 · Activar CallMeBot en tu WhatsApp (5 min)

Hazlo desde el teléfono donde quieres recibir los pedidos.

1. Entra a <https://www.callmebot.com/blog/free-api-whatsapp-messages/> y copia el número de CallMeBot que aparece ahí
   (cambia de vez en cuando, por eso no lo escribo aquí).
2. Guárdalo en tus contactos de ese teléfono.
3. Envíale por WhatsApp este mensaje exacto: `I allow callmebot to send me messages`
4. Te responde con tu **apikey** (un número). Guárdalo para el paso 3.

Los pedidos te llegarán desde el número de CallMeBot, no desde el del cliente.
El teléfono del cliente viene escrito dentro del pedido.

## Paso 2 · Crear la planilla y pegar el código (5 min)

1. Abre <https://sheets.new> con tu cuenta de Google. Ponle de nombre **KRUTZ Pedidos**.
2. Menú **Extensiones ▸ Apps Script**.
3. Borra lo que aparece y pega todo el contenido de [`Codigo.gs`](Codigo.gs).
4. Guarda (ícono de disquete).

## Paso 3 · Poner tu número y tu apikey

1. En Apps Script, menú izquierdo **⚙ Configuración del proyecto**.
2. Abajo, en **Propiedades del script**, agrega dos:

   | Propiedad          | Valor                       |
   | ------------------ | --------------------------- |
   | `WHATSAPP_NUMERO`  | `+56953730459`              |
   | `CALLMEBOT_APIKEY` | la apikey del paso 1        |

3. Guarda.

## Paso 4 · Probar

1. Vuelve a **Editor** (`< >`), elige la función **probarConfiguracion** arriba y toca **Ejecutar**.
2. Google te pedirá permisos. Acepta: «Configuración avanzada ▸ Ir a … (no seguro)» es normal,
   porque el código es tuyo y no está publicado en la tienda de Google.
3. Te debería llegar un WhatsApp: «Prueba KRUTZ: el servidor de pedidos está funcionando».
   En la planilla aparecen las hojas **Pedidos** y **Clientes**.

## Paso 5 · Publicar y conectar con la carta

1. Botón azul **Implementar ▸ Nueva implementación**.
2. Tipo (⚙): **Aplicación web**.
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
3. **Implementar** y copia la **URL de la aplicación web** (termina en `/exec`).
4. Envíame esa URL, o pégala tú en `assets/js/carta.js`:

   ```js
   pedidosURL: "https://script.google.com/macros/s/…/exec",
   ```

Desde ese momento, «Pedir al local» envía los pedidos directo a ti.
Mientras `pedidosURL` esté vacío, la carta usa el método anterior: el cliente envía el pedido desde su WhatsApp.

---

## Uso diario

- En la hoja **Pedidos**, la columna **Estado** dice «Pendiente». Cámbiala a «Listo» o «Entregado» cuando quieras.
  Puedes filtrar u ordenar como cualquier planilla.
- La columna **WhatsApp** indica si el aviso llegó («Enviado») o si se usó el correo de respaldo.

## Si cambias el código más adelante

**Implementar ▸ Administrar implementaciones ▸ ✏️ ▸ Versión: Nueva versión ▸ Implementar.**
Así la URL sigue siendo la misma.

## Bueno saber

- **CallMeBot** es un servicio gratuito pensado para avisos personales, sin garantía de servicio.
  Por eso existe el correo de respaldo.
  Si el volumen crece, se puede cambiar a la API oficial de WhatsApp Business (Meta). Esa opción necesita una cuenta de empresa
  en Meta y un número dedicado, y solo hay que reemplazar la función `enviarWhatsApp_`.
- **Datos personales**: el RUT y el teléfono quedan solo en tu cuenta de Google. No compartas la planilla
  y úsalos solo para gestionar pedidos. Al crear su cuenta, el cliente acepta esto.
- **Precios a prueba de cambios**: el cliente nunca escribe ni envía el mensaje, y la página solo manda
  qué productos eligió y cuántos. El servidor toma nombres, precios y opciones válidas de la carta oficial publicada
  (`assets/js/carta.js`) y rechaza cualquier pedido con precios, opciones o totales que no calcen.
  Si cambias precios en la carta, el servidor los toma en máximo 5 minutos.
- Un mismo RUT no puede enviar dos pedidos en menos de 45 segundos (evita duplicados por doble toque).
