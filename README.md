# Portafolio · Julián Durán

Portafolio de proyectos web: sitios, tiendas en línea y aplicaciones interactivas hechas con HTML, CSS y JavaScript.
Sitio estático, sin dependencias ni paso de compilación.

## Estructura

```
index.html              página principal (proyectos, sobre mí, habilidades, contacto)
assets/
  css/main.css          estilos (tema oscuro y claro, diseño adaptable)
  js/main.js            lista de proyectos, filtro, tema y menú móvil
  js/volver.js          botón «← Portafolio» que se inserta en cada proyecto
  img/proyectos/        miniaturas en WebP (640 y 1200 px)
proyectos/
  skate-city/           tienda de skateboarding (Bootstrap + carrito en JavaScript)
  tienda-electronica/   página de inicio de una tienda de tecnología
  rapid-bite/           menú digital de comidas rápidas (varias páginas)
  veterinaria/          agenda de citas para mascotas
  gestion-tareas/       gestor de tareas con fecha y prioridad
  formulario/           formulario de registro con tabla de resultados
  calculadora/          calculadora básica
  sobre-mi/             página personal
```

## Agregar un proyecto

1. Crear la carpeta `proyectos/<slug>/` con su `index.html` y, en su `<head>`,
   `<script src="../../assets/js/volver.js"></script>`.
2. Guardar la miniatura como `assets/img/proyectos/<slug>-640.webp` y `<slug>-1200.webp` (proporción 16:10).
3. Agregar el proyecto a la lista `PROYECTOS` de `assets/js/main.js`.

## Ver en local

Abrir `index.html` en el navegador, o servir la carpeta: `python -m http.server` → http://localhost:8000.

## Publicar

Funciona tal cual en GitHub Pages, Netlify o Vercel (sitio estático). Las rutas no tienen espacios ni dependen de
mayúsculas, así que se comportan igual en servidores Linux.
