# Nodiantis · Landing del Pack IA para Inmobiliarias

Web estática de una sola página. HTML, CSS y JavaScript puros, sin dependencias ni paso de build.

```
nodiantis-web/
├── index.html       Página principal
├── privacidad.html  Política de privacidad (Ley 25.326)
├── terminos.html    Términos y condiciones
├── styles.css       Estilos (mobile-first)
├── script.js        Comportamiento (botones, copiar, pestañas, menú)
├── motion.js        Animaciones (GSAP) y scroll suave (Lenis)
├── config.js        ← Todo lo configurable está aquí
├── og-image.png     Imagen que aparece al compartir el enlace (1200 × 630)
├── img/             Vistas reales de plantillas, guía y prompts (JPG)
└── README.md
```

## 1. Ver la web en local

Opción rápida: abre `index.html` con doble clic en tu navegador.

Opción recomendada (para que el botón «Copiar» funcione igual que en producción), desde la carpeta `nodiantis-web`:

```bash
python3 -m http.server 8080
# o bien
npx serve .
```

Luego abre <http://localhost:8080>.

## 2. Qué configurar en `config.js`

| Clave | Para qué sirve |
|---|---|
| `WHATSAPP_NUMBER` | Número para el botón flotante y los mensajes. Formato internacional, solo dígitos. |
| `MERCADOPAGO_URL` | Enlace de pago. Si tiene valor, todos los botones «Quiero el pack» lo abren. Si está vacío, abren WhatsApp con el mensaje «Hola, me interesa el Pack IA para Inmobiliarias de Nodiantis». |
| `SOCIAL` | URLs completas (con `https://`) de Instagram, LinkedIn, TikTok y YouTube. Solo se muestran las que tengan valor. |
| `SITE_URL` | Dirección pública cuando tengas dominio. Agrega la etiqueta canonical y `og:url`. |

| `PRICE` | Precio que se muestra en el hero, el cierre y la barra móvil (por ejemplo, `"USD 18,99"`). Si está vacío, no se muestra. |
| `PRICE_NOTE` | Aclaración bajo el precio (por defecto, que en Argentina se cobra en pesos al tipo de cambio del día). Si está vacía, no se muestra. |
| `TITULAR` | Nombre o razón social, CUIT y domicilio del responsable. Aparecen en la política de privacidad y en los términos. **Complétalos antes de publicar.** |
| `CONTACT_EMAIL` | Correo para consultas y pedidos sobre datos personales. Si está vacío, solo se ofrece WhatsApp. |

Los datos de `TITULAR` y `CONTACT_EMAIL` que dejes vacíos no se muestran. Los textos de `privacidad.html` y `terminos.html` son una base de trabajo y no reemplazan la revisión de un abogado.

## 3. Publicar la web

Son archivos estáticos: no hay comando de build ni carpeta de salida. Publica la carpeta `nodiantis-web` tal como está.

- **Netlify:** entra a <https://app.netlify.com/drop> y arrastra la carpeta. O conecta un repositorio con «Build command» vacío y «Publish directory» `.`.
- **Vercel:** «Add New → Project», importa el repositorio, elige el preset **Other**, sin build command y con output directory `.`. También puedes ejecutar `npx vercel` dentro de la carpeta.
- **Cloudflare Pages:** «Workers & Pages → Create → Pages → Upload assets» y sube la carpeta. Si conectas un repositorio, deja el build command vacío y el output directory en `/`.
- **Hosting tradicional (cPanel, FTP):** sube todos los archivos a la carpeta pública (`public_html` o equivalente).

Cuando tengas la dirección definitiva, cambia en `index.html` la etiqueta `og:image` por la dirección completa de la imagen (por ejemplo, `https://tu-sitio.netlify.app/og-image.png`). WhatsApp y las redes solo muestran la vista previa con una dirección completa.

Cada plataforma te da una dirección provisoria (por ejemplo, `tu-sitio.netlify.app`). Cuando tengas dominio propio, lo conectas desde el panel de la plataforma y cargas `SITE_URL` en `config.js`.

## 4. Licencias de lo que usa la web

| Recurso | Origen | Licencia |
|---|---|---|
| Cormorant Garamond (títulos) | Google Fonts | SIL Open Font License 1.1: uso comercial permitido |
| Inter (textos) | Google Fonts | SIL Open Font License 1.1: uso comercial permitido |
| Íconos, ilustraciones, mockup y favicon | Dibujados en SVG/CSS para este sitio | Propios |
| Fotos | No hay | No aplica |
| GSAP 3.13 (animaciones) | jsDelivr | Licencia estándar de GSAP: uso comercial gratuito |
| Lenis 1.3 (scroll suave) | jsDelivr | MIT |

## 5. Animaciones

`motion.js` usa GSAP 3.13 (con ScrollTrigger y SplitText) y Lenis 1.3, cargados desde jsDelivr. Las animaciones son: entrada del hero con el título palabra por palabra, revelado de secciones al hacer scroll, parallax del mockup, scroll suave, luz que sigue al cursor en las tarjetas y un leve efecto magnético en los botones de compra.

- Si la persona tiene activada la opción «reducir movimiento» en su dispositivo, no se cargan las animaciones.
- Si las librerías no cargan, la web funciona igual con animaciones básicas.
- GSAP es gratuito para uso comercial desde la versión 3.13 (licencia estándar de GSAP). Lenis tiene licencia MIT.
