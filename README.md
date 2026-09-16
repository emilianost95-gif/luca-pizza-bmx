# LUCA PIZZA BMX — Landing

Web estática en HTML, CSS y JS vanilla. No necesita build ni dependencias externas: las fuentes están incluidas en el proyecto.

## Cómo verla
- Abrí `index.html` en el navegador (con doble clic alcanza).
- Para trabajar con recarga automática: usá **Live Server** en VS Code.
- Para publicarla: subí la carpeta completa a Netlify, Vercel o GitHub Pages.

## Estructura
```
index.html            Landing
carta.html            Carta imprimible A4 (versión oscura y clara, botón Imprimir/PDF)
css/
  fonts.css           @font-face (fuentes locales)
  tokens.css          Colores, tipografías, espaciados  ← la paleta se cambia acá
  base.css            Reset, tipografía, reveals, reduced-motion
  components.css      Botones, navbar, menú móvil, media, ticker, dock, lightbox
  sections.css        Estilos de cada sección (mobile first)
  carta.css           Estilos de la carta imprimible
js/
  data.js             ★ TODO EL CONTENIDO: carta, precios, eventos, horarios, redes, imágenes
  components.js       Funciones que arman el HTML a partir de data.js
  main.js             Interacciones (navbar, tabs, parallax, scroll horizontal, lightbox…)
assets/
  img/                Fotos (JPG optimizados)
  brand/              Logo blanco, logo circular, favicons, QR de WhatsApp
  carta/              Carta en PDF (oscura y clara)
  fonts/              Anton, Inter, JetBrains Mono, Permanent Marker
  video/              (vacío) video opcional del hero
```

## Cambiar contenido
Todo se edita en **`js/data.js`**. La web y la carta imprimible leen del mismo archivo.

| Quiero cambiar…        | Dónde                                       |
|------------------------|---------------------------------------------|
| Un precio o un producto | `menu` → `items` (`price` va sin puntos: `16000`) |
| La pizza destacada      | `featured`                                  |
| Horarios                | `hours` (el estado "Abierto/Cerrado" se calcula solo) |
| WhatsApp / Instagram    | `contact`                                   |
| Eventos                 | `events` (los que ya pasaron se ocultan solos) |
| Una foto                | Reemplazá el archivo con el **mismo nombre** en `assets/img/`, o cambiá la ruta en `images` |

Si una imagen no existe, la web muestra un placeholder con el nombre del archivo que espera.

### Regenerar el PDF de la carta
Abrí `carta.html` → **Imprimir / Guardar PDF** → Destino "Guardar como PDF", tamaño A4, márgenes "Ninguno" y "Gráficos de fondo" activado.
Guardalo como `assets/carta/carta-luca-pizza.pdf`.

### Video de fondo (opcional)
Subí `assets/video/hero.mp4` (ideal: 8–15 s, 1280 px, sin audio, menos de 4 MB) y en `data.js` poné `heroVideo: { src: "assets/video/hero.mp4" }`.
Se reproduce solo en desktop y se desactiva con "reducir movimiento" o con ahorro de datos.

## Pendientes antes de publicar (marcados con `// TODO` en data.js)
- [ ] Dirección exacta, ciudad, coordenadas y búsqueda para el mapa
- [ ] Horarios reales y año de apertura (`est`)
- [ ] Ingredientes de cada pizza (están redactados a partir de las recetas clásicas)
- [ ] **Burger Luca $10.000 vs La clásica $15.000**: confirmar, porque parece invertido en la carta original
- [ ] Vigencia de la promo de los domingos
- [ ] Fechas reales de los eventos (las actuales son de ejemplo)
- [ ] **Testimonios**: son de ejemplo. Reemplazarlos por reseñas reales de Google o Instagram
- [ ] Dominio real en `<link rel="canonical">` y URL absoluta en `og:image` (index.html)
- [ ] Foto `assets/img/banderines.jpg` (banderines con luces)
- [ ] Una foto propia de hamburguesa (hoy esa categoría usa la foto del lomo pizza)
- [ ] `calzon.jpg`: el papel del fondo tiene impresa la marca de otro local ("El Ahumadero"); conviene cambiar la foto

## Accesibilidad y rendimiento
- HTML semántico, skip link, foco visible y tabs accesibles con teclado (flechas, Inicio y Fin)
- Menú móvil que retiene el foco y se cierra con Esc
- Todas las animaciones se desactivan con `prefers-reduced-motion`
- Imágenes con carga diferida (lazy), hero precargado y fuentes locales con `font-display: swap`
- El mapa de Google se carga solo cuando el usuario lo pide
- JSON-LD `Restaurant` generado desde data.js
