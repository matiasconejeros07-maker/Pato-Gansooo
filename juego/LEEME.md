# Gánale al Tío Pato · cómo activar los marcadores compartidos

Sin configurar nada, el juego funciona, pero cada persona solo ve su propio mejor puntaje (se guarda en su teléfono).
Para que **todos los jugadores compitan en un mismo marcador**, el juego necesita una base de datos en línea. Se usa
Firebase Realtime Database (gratis, aguanta miles de jugadores) y toma unos 5 minutos:

1. Entra a https://console.firebase.google.com con tu cuenta de Google y crea un proyecto (puedes desactivar Analytics).
2. En **Compilación → Realtime Database** aprieta **Crear base de datos**, elige cualquier región y el modo **bloqueado**.
3. En **Compilación → Authentication** aprieta **Comenzar**, abre **Método de acceso**, elige **Correo electrónico/contraseña**,
   actívalo (solo la primera opción) y guarda. Es lo que permite las cuentas con nombre y contraseña.
4. En Realtime Database, pestaña **Reglas**: borra lo que hay, pega el contenido de `firebase-rules.json` (está en esta carpeta) y aprieta **Publicar**.
5. En **Configuración del proyecto** (el engranaje ⚙ de la izquierda) → pestaña **General**, copia la **Clave de API web**.
6. Abre `config.js` y completa las dos líneas (la dirección de la base de datos está en la pestaña **Datos**):
   `window.DINERO_DB_URL = 'https://mi-proyecto-default-rtdb.firebaseio.com';`
   `window.FIREBASE_API_KEY = 'AIza...';`
7. Sube el cambio al repositorio. Listo: para jugar hay que crear una cuenta o iniciar sesión, y el marcador muestra el Top 100.

## Cuentas (nombre y contraseña)

- Para jugar hay que **crear una cuenta** (nombre + contraseña de al menos 6 caracteres) o **entrar** con una existente.
  La sesión queda guardada en el celular: no hay que volver a escribir la contraseña. Con la misma cuenta se puede entrar desde otro celular y se recupera el mejor puntaje.
- Las contraseñas las guarda Firebase Authentication (cifradas en los servidores de Google); el juego nunca las guarda.
- El nombre no distingue mayúsculas ni tildes: «Matías» y «matias» son la misma cuenta, y dos personas no pueden usar el mismo nombre.
- Como las cuentas no usan un correo real, **no hay recuperación de contraseña**: quien la olvide tendrá que crear otra cuenta con otro nombre.
  Se puede borrar o restablecer una cuenta a mano en Firebase → Authentication → Usuarios.
- Si `FIREBASE_API_KEY` queda vacía, el juego funciona en modo local (solo pide un nombre, sin contraseña y sin cuentas).

## Qué hace el marcador

- Cada cuenta guarda **solo su mejor puntaje** (si rebota más veces, se actualiza; si rebota menos, no baja). El puntaje son los rebotes: cada vez que la barra toca el billete suma uno. Gana quien más rebotes aguante contra el Tío Pato.
- Muestra el Top 100 ordenado por rebotes (en empate, quien llegó primero).
- Las reglas de `firebase-rules.json` solo dejan que cada cuenta escriba **su propio** registro (con su sesión iniciada), con nombres de 1 a 16
  caracteres, puntajes enteros de 0 a 100000 y sin que un puntaje baje.

## Límites que conviene saber

- Las cuentas impiden que alguien escriba en el registro de otra persona, pero no pueden impedir que alguien con conocimientos técnicos
  envíe un puntaje falso desde su propia cuenta (hasta el máximo permitido por las reglas). Para un juego entre conocidos o un evento es suficiente.
- El plan gratuito (Spark) de Firebase alcanza de sobra para 1.000+ jugadores: cada partida son unos pocos bytes y el
  marcador se descarga solo mientras alguien lo tiene abierto.

## El arte del Tío Pato

Las imágenes están en la carpeta `pato/` (capas PNG transparentes del mismo tamaño: 4 caras, alas de ángel y de diablo,
aureola, cuernos, tridente y cola). El juego las superpone y las anima según los rebotes:

- **0–29 rebotes:** ángel amistoso, con aureola y alas, frases cariñosas.
- **30–54:** sigue siendo ángel, pero desafiante.
- **55 en adelante:** en cuanto se enoja pierde la aureola y las alas de ángel y pasa a su piel de diablo: cuernos, alas de
  murciélago, cola y tridente rojo. Desde ahí se enoja de forma progresiva (más rojo, más temblor y vapor) y, desde el 58,
  aparece el aura de fuego, que crece hasta el rebote 80. El fondo pasa a rojo infierno.

La barra empieza grande y se achica hasta el 30% mientras el billete acelera. Los valores de dificultad están al inicio
del código de `index.html` (`SPEED0`, `SPEED_STEP`, `SPEED_MAX`, `SHRINK_RATE`, `P_CHALLENGE`, `P_ANGRY`).
