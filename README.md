# Flores amarillas

Una carta digital para el 21 de septiembre. Se abre en el navegador, no pide cuenta y no guarda datos.

## Personalizar

Edita solo `js/config.js`:

- `nombre`: si escribes un nombre distinto de `TU NOMBRE`, aparece al final de la tarjeta.
- `titulo` y `subtitulo`: la pantalla de entrada.
- `mensajePrincipal`: el mensaje del ramo. La primera frase es el título.
- `mensajePersonal` y `mensajePersonalDestacado`: la frase destacada tiene que estar escrita igual dentro del mensaje.
- `mensajeFinal`: el cierre, «Nos vemos pronto.»
- `colorPrincipal`: un color en hexadecimal, por ejemplo `#E2B33C`.
- `botones`: los textos de cada botón.
- `musica`: el nombre del archivo de audio. Por defecto, `music.mp3`.

Si cambias el título o el subtítulo, actualiza también las etiquetas `og:title` y `og:description` en `index.html`. Esas líneas son las que ve la otra persona en la vista previa de WhatsApp, porque WhatsApp no ejecuta JavaScript.

Puedes usar `{nombre}` dentro de cualquier texto y se reemplaza solo.

## Música

La música no empieza sola. Hay un botón ♪ en la esquina superior derecha.

1. Consigue un archivo de audio que tengas derecho a usar.
2. Nómbralo `music.mp3`.
3. Colócalo en esta carpeta, junto a `index.html`.
4. Abre la página y toca el botón.

Si el archivo no está, la carta sigue funcionando y el botón avisa que falta la canción.

## Verla en tu computadora

Abre `index.html` con doble clic.

Para probar la música y verla igual que al publicarla, ábrela con un servidor local. En esta carpeta:

```powershell
python -m http.server 5500
```

Entra a [http://localhost:5500](http://localhost:5500).

Si no tienes Python:

```powershell
npx --yes serve .
```

Para recorrer la carta más rápido mientras editas textos, abre `http://localhost:5500/?rapido=1`.

## Verla en tu teléfono antes de publicarla

1. Deja el servidor encendido.
2. Conecta el teléfono a la misma red Wi-Fi.
3. En la computadora, abre PowerShell y ejecuta `ipconfig`.
4. Busca la dirección IPv4, por ejemplo `192.168.1.20`.
5. En el teléfono abre `http://192.168.1.20:5500`.

## Publicarla y enviar el enlace

La página es estática. No hace falta backend. Quien tenga el enlace puede verla; no pongas datos que no quieras compartir.

### GitHub Pages

1. Crea un repositorio en GitHub y sube esta carpeta. Debe incluir `index.html` en la raíz.
2. En el repositorio, entra a **Settings → Pages**.
3. En **Build and deployment**, elige **Deploy from a branch**.
4. Elige la rama `main` y la carpeta **/ (root)**. Guarda.
5. Unos minutos después el enlace será `https://tu-usuario.github.io/nombre-del-repo/`.

Ese es el enlace para enviar.

### Netlify

1. Entra a [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Arrastra esta carpeta.
3. Netlify te da un enlace `https://algo.netlify.app`. Puedes cambiar el nombre en la configuración del sitio.

### Vercel

1. Entra a [https://vercel.com](https://vercel.com) e importa el proyecto, o arrastra la carpeta.
2. No hace falta comando de build. El directorio de salida es la raíz.
3. Comparte el enlace `https://tu-proyecto.vercel.app`.

## Notas

- Las flores están dibujadas con SVG. No hay imágenes externas.
- Las fuentes Cormorant Garamond y Outfit están incluidas y usan la licencia SIL Open Font License. El texto está en `assets/fonts/`.
- Si publicas en GitHub Pages, el archivo `.nojekyll` evita que Jekyll oculte archivos.
