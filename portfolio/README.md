# Portafolio — Raquel Farías García

Portafolio en React (Vite). Diseño con lenguaje de dibujo técnico.

## Cómo correrlo en tu computadora

Necesitas tener instalado **Node.js** (versión 18 o más reciente).
Descárgalo en https://nodejs.org si no lo tienes.

Abre la carpeta en VS Code y, en la terminal:

```bash
npm install      # instala las dependencias (solo la primera vez)
npm run dev      # arranca el sitio en http://localhost:5173
```

Abre esa dirección en tu navegador. Cada cambio que guardes se ve al instante.

## Dónde editar tu contenido

- **`src/data.js`** — aquí está TODO tu texto: nombre, bio, proyectos, premios,
  correo y LinkedIn. Edita este archivo para cambiar la información.
  No necesitas tocar el diseño.
- **`src/components/`** — cada sección (Hero, About, Projects, Awards, Footer).
- **`src/index.css`** — colores, tipografías y estilos. Las variables de color
  están hasta arriba del archivo.

> Tip: puedes pedirle a Claude Code cosas como "agrega una sección de
> ilustraciones" o "cambia el azul por un verde oliva" y editará estos archivos.

## Cómo publicarlo en Vercel (gratis)

1. Sube esta carpeta a un repositorio en **GitHub**.
2. Entra a https://vercel.com y crea una cuenta con tu GitHub.
3. Haz clic en **Add New → Project** e importa tu repositorio.
4. Vercel detecta Vite automáticamente. Confirma estos ajustes:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Haz clic en **Deploy**. En ~1 minuto tendrás una URL pública.

A partir de ahí, cada vez que hagas `git push` a GitHub, Vercel
republica el sitio solo. No tienes que hacer nada más.

### Dominio propio (opcional)

En tu proyecto de Vercel: **Settings → Domains → Add**. Si compras un dominio
(~10–15 USD/año), lo conectas ahí y reemplazas la URL de `tunombre.vercel.app`.
