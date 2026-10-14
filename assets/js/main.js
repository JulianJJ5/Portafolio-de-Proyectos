// Portafolio · Julián Durán
// Los proyectos se describen una sola vez aquí; las tarjetas, el filtro y el contador salen de esta lista.

const PROYECTOS = [
  {
    slug: "skate-city",
    titulo: "Skate City",
    categoria: "tienda",
    resumen: "Tienda de skateboarding con catálogo por secciones, buscador y carrito de compras dinámico.",
    tecnologias: ["Bootstrap", "JavaScript", "CSS"],
    destacado: true,
  },
  {
    slug: "tienda-electronica",
    titulo: "Tienda de electrónica",
    categoria: "tienda",
    resumen: "Página de inicio de una tienda de tecnología, con banners de producto, categorías y beneficios.",
    tecnologias: ["HTML", "CSS"],
  },
  {
    slug: "rapid-bite",
    titulo: "Rapid Bite",
    categoria: "sitio",
    resumen: "Menú digital de comidas rápidas: varias páginas por categoría con navegación lateral e identidad propia.",
    tecnologias: ["HTML", "CSS"],
  },
  {
    slug: "veterinaria",
    titulo: "Veterinaria Animalia",
    categoria: "app",
    resumen: "Agenda de citas para mascotas: registro de pacientes, propietarios y consulta de citas activas.",
    tecnologias: ["JavaScript", "HTML", "CSS"],
  },
  {
    slug: "gestion-tareas",
    titulo: "Gestión de tareas",
    categoria: "app",
    resumen: "Lista de tareas con fecha y prioridad, ordenamiento y edición de cada actividad.",
    tecnologias: ["JavaScript", "HTML", "CSS"],
  },
  {
    slug: "formulario",
    titulo: "Formulario de registro",
    categoria: "app",
    resumen: "Formulario de datos personales que construye una tabla con los registros ingresados.",
    tecnologias: ["JavaScript", "HTML", "CSS"],
  },
  {
    slug: "calculadora",
    titulo: "Calculadora",
    categoria: "app",
    resumen: "Calculadora de operaciones básicas con teclado en pantalla.",
    tecnologias: ["JavaScript", "CSS"],
  },
  {
    slug: "sobre-mi",
    titulo: "Página personal",
    categoria: "sitio",
    resumen: "Landing personal con presentación, servicios, habilidades y contacto.",
    tecnologias: ["HTML", "CSS"],
  },
];

const CATEGORIAS = { sitio: "Sitio web", tienda: "Comercio", app: "Aplicación" };

function tarjeta(p) {
  const li = document.createElement("li");
  li.className = "tarjeta" + (p.destacado ? " tarjeta--destacada" : "");
  li.dataset.categoria = p.categoria;
  const url = `proyectos/${p.slug}/index.html`;
  li.innerHTML = `
    <a class="tarjeta__imagen" href="${url}" tabindex="-1" aria-hidden="true">
      <img src="assets/img/proyectos/${p.slug}-640.webp"
           srcset="assets/img/proyectos/${p.slug}-640.webp 640w, assets/img/proyectos/${p.slug}-1200.webp 1200w"
           sizes="${p.destacado ? "(min-width: 1000px) 760px" : "(min-width: 1100px) 370px"}, (min-width: 700px) 50vw, 100vw"
           alt="" width="640" height="320" loading="lazy" decoding="async">
    </a>
    <div class="tarjeta__cuerpo">
      <p class="tarjeta__categoria">${CATEGORIAS[p.categoria]}</p>
      <h3><a href="${url}">${p.titulo}</a></h3>
      <p class="tarjeta__resumen">${p.resumen}</p>
      <ul class="etiquetas" aria-label="Tecnologías">${p.tecnologias.map((t) => `<li>${t}</li>`).join("")}</ul>
    </div>`;
  return li;
}

function iniciarProyectos() {
  const rejilla = document.getElementById("rejilla");
  if (!rejilla) return;
  rejilla.append(...PROYECTOS.map(tarjeta));
  document.querySelectorAll("[data-contar-proyectos]").forEach((n) => (n.textContent = PROYECTOS.length));

  const botones = document.querySelectorAll(".filtro");
  botones.forEach((b) =>
    b.addEventListener("click", () => {
      const f = b.dataset.filtro;
      botones.forEach((x) => {
        x.classList.toggle("activo", x === b);
        x.setAttribute("aria-pressed", String(x === b));
      });
      rejilla.querySelectorAll(".tarjeta").forEach((t) => {
        t.hidden = f !== "todos" && t.dataset.categoria !== f;
      });
    })
  );
}

function iniciarTema() {
  const boton = document.getElementById("tema");
  const raiz = document.documentElement;
  const oscuro = () =>
    raiz.dataset.theme ? raiz.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  const rotular = () => boton.setAttribute("aria-label", oscuro() ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
  rotular();
  boton.addEventListener("click", () => {
    raiz.dataset.theme = oscuro() ? "light" : "dark";
    try { localStorage.setItem("tema", raiz.dataset.theme); } catch (e) { /* almacenamiento bloqueado */ }
    rotular();
  });
}

function iniciarMenu() {
  const boton = document.getElementById("menu");
  const nav = document.getElementById("nav");
  const cerrar = () => {
    nav.classList.remove("abierto");
    boton.setAttribute("aria-expanded", "false");
    boton.setAttribute("aria-label", "Abrir menú");
  };
  boton.addEventListener("click", () => {
    const abierto = nav.classList.toggle("abierto");
    boton.setAttribute("aria-expanded", String(abierto));
    boton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  });
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", cerrar));
  document.addEventListener("keydown", (e) => e.key === "Escape" && cerrar());
}

function iniciarCabecera() {
  const cab = document.getElementById("cabecera");
  const marcar = () => cab.classList.toggle("con-sombra", scrollY > 8);
  marcar();
  addEventListener("scroll", marcar, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("anio").textContent = new Date().getFullYear();
  iniciarProyectos();
  iniciarTema();
  iniciarMenu();
  iniciarCabecera();
});
