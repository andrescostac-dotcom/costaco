# Costa & Co — sitio web

Sitio de la inmobiliaria Costa & Co (costaco.life). Está hecho con [Astro](https://astro.build) y tiene un panel de administración ([Decap CMS](https://decapcms.org)) en `/admin` para cargar y editar propiedades sin tocar código.

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
