# Panel de Celia

Dos páginas en el mismo repositorio de GitHub Pages:

- `index.html` → **pantalla de la tablet de mamá** (fecha, hora, "Ahora toca…", mensajes).
- `familia.html` → **web para David, Dani y César** (enviar/borrar mensajes, editar el horario, ver si la tablet está viva).

La pantalla de la tablet funciona sola (reloj y horario) aunque Firebase no esté configurado o no haya wifi.
Firebase solo sirve para los mensajes y para que el horario editado llegue a la tablet.

## 1. Firebase (una vez)

1. https://console.firebase.google.com → **Añadir proyecto** (o usa uno de los tuyos). Plan Spark (gratuito). Sin Analytics.
2. **Realtime Database** → Crear base de datos → ubicación **europe-west1** → modo bloqueado.
   Copia la URL que aparece arriba (algo como `https://NOMBRE-default-rtdb.europe-west1.firebasedatabase.app`).
3. Pestaña **Reglas** → pega el contenido de `reglas.json` **sustituyendo** `CORREO_CESAR`, `CORREO_DAVID` y `CORREO_DANI`
   por los tres correos (en minúsculas) → **Publicar**.
4. **Authentication** → Método de acceso → activa **Correo electrónico/contraseña**.
   Pestaña **Usuarios** → Añadir usuario: crea los 3 (correo y contraseña de cada uno).
   (Si aparece "Enable create (sign-up)" en Configuración → Acciones del usuario, desactívalo.)
5. **Configuración del proyecto** (rueda) → General → "Tus apps" → icono `</>` (web) → registra la app →
   copia `apiKey`.
6. `firebase-config.js` ya lleva el `dbUrl` y la `apiKey` de panel-celia. Si al entrar en `familia.html` sale un error sobre la apiKey, compara la letra a letra con la de Firebase (0/O, l/I).

## 2. GitHub Pages

Crea un repositorio nuevo (p. ej. `panel_celia`), sube **todos los archivos de esta carpeta** y activa
Settings → Pages → Deploy from branch → main / (root).
- Tablet: `https://cop1310.github.io/panel_celia/`
- Familia: `https://cop1310.github.io/panel_celia/familia.html`

No hay datos personales en el repo (la apiKey de Firebase y la URL no son secretos; protegen las reglas).

## 3. Tablet de mamá (Huawei, Android 7)

- Abre la dirección de la tablet en Chrome → menú → **Instalar aplicación** / Añadir a pantalla de inicio. Ábrela desde su icono.
- Ajustes → Pantalla → **Suspender** al máximo, y en Opciones de desarrollador activa **Mantener activo** (con la tablet enchufada).
- Mantenla **siempre enchufada**. Desde la web familiar se ve si está enchufada y con qué batería.
- Opcional: **Fijar pantalla** (Ajustes → Seguridad → Fijar pantalla) para que no salga de la app.
- Si el wifi se cae, el reloj y el horario siguen; los mensajes nuevos no llegan hasta que vuelva.

## 4. Móviles (2 Android + 1 iPhone)

Abre `familia.html`, elige quién eres, escribe el correo y la contraseña de Firebase. Se queda recordado.
- Android: menú de Chrome → Instalar aplicación.
- iPhone: Safari → Compartir → Añadir a pantalla de inicio.

## Cómo funciona

- Horario: la tablet muestra la franja más reciente de la hora actual. De 21:00 a 7:30 es "noche" (pantalla oscura, "Hay que dormir").
- Festivos: en la web familiar → Horario → Festivos, un día entre semana se trata como sábado o domingo.
- Mensajes: salen en la tablet en ≤ 6 s y la pantalla parpadea 45 s (amarillo/blanco, sin sonido). Al tocar la pantalla deja de parpadear. Los borráis desde el móvil.
- El horario editado llega a la tablet en ≤ 1 minuto.
- La tablet se recarga sola cada noche a las 3:30 para coger versiones nuevas.
