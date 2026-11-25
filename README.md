# Costa & Co — sitio web

Sitio de la inmobiliaria Costa & Co (costaco.life). Está hecho con [Astro](https://astro.build) y tiene un panel de administración ([Decap CMS](https://decapcms.org)) en `/admin` para cargar y editar propiedades sin tocar código.

## Panel de administración (`/admin`)

Desde **https://costaco.life/admin** (entrás con tu cuenta de GitHub):

| Quiero… | Dónde |
|---|---|
| Dar de alta una propiedad | Propiedades → **+ Propiedad** → completar → **Publicar → Publicar ahora** |
| Editar textos, datos o fotos | Propiedades → elegir la propiedad → cambiar → **Publicar ahora** |
| Agregar videos | En la propiedad, campo **Videos (YouTube o Instagram)** → pegar el link (podés poner varios) |
| Marcarla como vendida o reservada | Campo **Estado** |
| Ocultarla sin borrarla (dar de baja) | Apagar **Publicada en la web** |
| Borrarla definitivamente | Botón **Eliminar entrada** |
| Cambiar WhatsApp, email o textos de la home | Datos del sitio → Contacto y textos de la home |
| Editar servicios o zonas | Datos del sitio → Servicios / Zonas |

Los cambios se publican solos en 1 o 2 minutos.

## Códigos QR

- Cada ficha tiene un bloque **Compartir** con su QR, botón de WhatsApp, copiar link y descarga del QR.
- **https://costaco.life/qr/** muestra los QR de todas las propiedades juntos, para descargar o imprimir. No aparece en Google.
- Cada QR abre `https://costaco.life/propiedades/<propiedad>/`. Se generan solos al cargar una propiedad nueva.
- PNG (1200×1200) para compartir; SVG para imprimir en carteles de cualquier tamaño.

## Cómo editar (día a día)

1. Entrá a **https://costaco.life/admin** e iniciá sesión con tu cuenta de GitHub.
2. **Propiedades → Nueva propiedad**: completá los datos, subí la portada, la galería y los planos, y tocá **Publicar**.
3. Para marcar una casa como vendida, abrila y cambiá **Estado** a *Vendida*. Para ocultarla sin borrarla, apagá **Publicada en la web**.
4. **Datos del sitio** sirve para cambiar el WhatsApp, el email, el Instagram y los textos de la home.

Cada cambio se guarda en GitHub y Netlify vuelve a publicar el sitio solo, en 1 o 2 minutos.

Las consultas del formulario llegan a Netlify (**Forms**). Ahí podés activar que te lleguen por email.

## Publicarlo (una sola vez)

1. Creá un repositorio en GitHub (por ejemplo `costaco`) y subí este proyecto.
2. (Hecho) El panel ya apunta a `andrescostac-dotcom/costaco` en `public/admin/config.yml`.
3. En [Netlify](https://app.netlify.com): **Add new project → Import from GitHub**, elegí el repo. La configuración ya viene en `netlify.toml`.
4. Login del panel: en GitHub, **Settings → Developer settings → OAuth Apps → New OAuth App**
   - Homepage URL: `https://costaco.life`
   - Authorization callback URL: `https://api.netlify.com/auth/done`

   Después, en Netlify: **Project configuration → Access & security → OAuth → Install provider → GitHub**. Pegá ahí el Client ID y el Secret.
5. Dominio: en Netlify, **Domain management → Add a domain → costaco.life**. Seguí las instrucciones para apuntar los DNS desde donde compraste el dominio.
6. Formularios: en Netlify, **Forms → Enable form detection**. Después, en **Notifications**, agregá tu email.

## Desarrollo local

```bash
npm install
npm run dev          # http://localhost:4321
npx decap-server     # en otra terminal: permite usar /admin en local sin login
```

## Estructura

- `src/content/propiedades/*.md`: una ficha por propiedad. Es lo que edita el panel.
- `src/data/sitio.json`: datos de contacto y textos de la home.
- `public/uploads/propiedades/`: fotos.
- `public/admin/config.yml`: campos del panel de administración.
- `src/styles/global.css`: colores y tipografías del brandbook (Marea, Arena, Coral, Espuma; Manrope y DM Serif Display).
