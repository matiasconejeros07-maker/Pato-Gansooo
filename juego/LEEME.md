# Dinero Volador · cómo activar los marcadores compartidos

Sin configurar nada, el juego funciona, pero cada persona solo ve su propio puntaje (se guarda en su teléfono).
Para que **todos los jugadores compitan en un mismo marcador**, el juego necesita una base de datos en línea. Se usa
Firebase Realtime Database (gratis, aguanta miles de jugadores) y toma unos 5 minutos:

1. Entra a https://console.firebase.google.com con tu cuenta de Google y crea un proyecto (puedes desactivar Analytics).
2. En el menú **Build → Realtime Database** aprieta **Create Database**, elige cualquier región y el modo **bloqueado** (locked mode).
3. Abre la pestaña **Rules**, borra lo que hay, pega el contenido de `firebase-rules.json` (está en esta carpeta) y aprieta **Publish**.
4. Copia la dirección que aparece arriba en la pestaña **Data**, parecida a `https://mi-proyecto-default-rtdb.firebaseio.com`.
5. Abre `config.js`, pégala dentro de las comillas y guarda:
   `window.DINERO_DB_URL = 'https://mi-proyecto-default-rtdb.firebaseio.com';`
6. Sube el cambio al repositorio. Listo: el marcador muestra el Top 100 y se actualiza solo.

## Qué hace el marcador

- Cada dispositivo tiene un identificador propio y guarda **solo su mejor puntaje** (si juega mejor, se actualiza; si juega peor, no baja).
- Muestra el Top 100 ordenado por puntaje (en empate, quien llegó primero).
- Las reglas de `firebase-rules.json` solo permiten guardar nombres de 1 a 16 caracteres, puntajes enteros de 0 a 250,
  y que un puntaje nunca baje.

## Límites que conviene saber

- Es un juego sin cuentas: como cualquier marcador abierto en una página web, una persona con conocimientos técnicos
  podría enviar un puntaje falso (hasta el máximo de 250). Para un juego entre conocidos o un evento es suficiente.
- El plan gratuito (Spark) de Firebase alcanza de sobra para 1.000+ jugadores: cada partida son unos pocos bytes y el
  marcador se descarga solo mientras alguien lo tiene abierto.
