// ------------------------------- DATOS ------------------------------------
const productos = [
    {
        imagen: "./imag/tabla1.jpg",
        nombre: "Tabla Alien Believe Black",
        descripcion: "Tabla de skate profesional de 7 capas de arce con diseño de Alien.",
        precio: 300000,
        cantidad: 12,
    },
    {
        imagen: "./imag/tabla2.avif",
        nombre: "Tabla Moderna Trivial blacdex",
        descripcion: "Tabla de skate estilo cruiser de 8.5 pulgadas con gráficos trivales.",
        precio: 270000,
        cantidad: 10,
    },
    {
        imagen: "./imag/tabla3.png",
        nombre: "Tabla ChromeWheels Negra",
        descripcion: "Tabla de skate street de 7.75 pulgadas con estilo urbano y acabado antideslizante.",
        precio: 300000,
        cantidad: 8,
    },
    {
        imagen: "./imag/tabla4.webp",
        nombre: "Tabla Canadian maple",
        descripcion: "Tabla de skate de bambú de 8 pulgadas con grabado de hoja de maple.",
        precio: 300000,
        cantidad: 12,
    },
    {
        imagen: "./imag/tabla5.jpg",
        nombre: "Tabla Sr Oscuro Jart",
        descripcion: "Tabla de skate para principiantes de 7.25 pulgadas con diseño siniestro y ruedas suaves.",
        precio: 300000,
        cantidad: 12,
    },
    {
        imagen: "./imag/tabla6.jpg",
        nombre: "Tabla Aesthetic ghost red Jart",
        descripcion: "Tabla de skate old school de 9 pulgadas con ilustraciones retro de los años 80.",
        precio: 300000,
        cantidad: 12,
    },
    {
        imagen: "./imag/tabla7.jpg",
        nombre: "Tabla Scream dark Jart",
        descripcion: "Tabla de skate con estampado de  redondeados.",
        precio: 300000,
        cantidad: 12,
    },
    {
        imagen: "./imag/tabla8.jpg",
        nombre: "Tabla Kiss Jart",
        descripcion: "Tabla de skate de colección edición limitada de 8.25 pulgadas con arte urbano exclusivo.",
        precio: 300000,
        cantidad: 12,
    },
    {
        imagen: "./imag/tabla9.jpg",
        nombre: "Tabla simple sk8",
        descripcion: "Tabla de skate de arce canadiense de 7.75 pulgadas con acabado brillante y grip tape de alta calidad.",
        precio: 300000,
        cantidad: 12,
    },
    {
        imagen: "./imag/tabla10.webp",
        nombre: "Tabla Sk8 blue mfa",
        descripcion: "Tabla de skate doble kick de 8.0 pulgadas con diseño abstracto en tonos pastel y construcción robusta.",
        precio: 300000,
        cantidad: 12,
    },
    {
        imagen: "./imag/tabla11.webp",
        nombre: "Tabla Jart Gold Edition",
        descripcion: "Tabla de skate de 8.125 pulgadas con forma cóncava y gráficos psicodélicos inspirados en el arte pop de los años 60.",
        precio: 300000,
        cantidad: 12,
    },
    {
        imagen: "./imag/tabla12.png",
        nombre: "Tabla Anime Blue",
        descripcion: "Tabla de skate de 7 capas de arce con tecnología de prensado en frío para una mayor durabilidad, cuenta con diseño minimalista en blanco y negro.",
        precio: 300000,
        cantidad: 12,
    },
];

const productosR = [
    { imagen: "./imag/a1.webp", nombre: "Anti Hero Eagle Real Tree Black", precio: 90000, cantidad: 12 },
    { imagen: "./imag/a2.webp", nombre: "Baker Eagle Harley", precio: 90000, cantidad: 10 },
    { imagen: "./imag/a3.webp", nombre: "Camibuso Body Glove Black", precio: 99900, cantidad: 8 },
    { imagen: "./imag/a4.webp", nombre: "Camibuso Hanes Beefy Henley Ebony", precio: 120000, cantidad: 12 },
    { imagen: "./imag/a5.webp", nombre: "Camibuso Hanes Beefy T Henley Grey Oxford Pizarra Jaspeado", precio: 99900, cantidad: 12 },
    { imagen: "./imag/a6.webp", nombre: "Camibuso Hanes Beefy T Henley Green Grey", precio: 99900, cantidad: 12 },
    { imagen: "./imag/a7.webp", nombre: "Camibuso MJ Soffe Army Brown", precio: 99900, cantidad: 12 },
    { imagen: "./imag/a8.webp", nombre: "Camiseta 3/4 Champion Red Black", precio: 99900, cantidad: 12 },
    { imagen: "./imag/a9.webp", nombre: "Chaqueta Clop Oversize", precio: 80000, cantidad: 12 },
    { imagen: "./imag/a10.webp", nombre: "Chaqueta Dc Howsthat Grey", precio: 270000, cantidad: 12 },
];

// Accesorios: tenis de skate (imágenes z1–z10 de la carpeta imag/).
const productosA = [
    { imagen: "./imag/z1.webp", nombre: "Tenis Circa Gamuza Azul Pizarra", precio: 250000, cantidad: 6 },
    { imagen: "./imag/z2.webp", nombre: "Tenis Circa Negro Suela Gum", precio: 250000, cantidad: 8 },
    { imagen: "./imag/z3.webp", nombre: "Tenis Circa Gris Suela Gum", precio: 250000, cantidad: 5 },
    { imagen: "./imag/z4.webp", nombre: "Tenis Circa Negro Amarillo", precio: 230000, cantidad: 7 },
    { imagen: "./imag/z5.webp", nombre: "Tenis Circa Azul Navy", precio: 230000, cantidad: 9 },
    { imagen: "./imag/z6.webp", nombre: "Tenis Skull Negro Fucsia", precio: 210000, cantidad: 10 },
    { imagen: "./imag/z7.webp", nombre: "Tenis Skull Negro Rojo", precio: 210000, cantidad: 10 },
    { imagen: "./imag/z8.webp", nombre: "Tenis Skull Gris", precio: 210000, cantidad: 6 },
    { imagen: "./imag/z9.webp", nombre: "Tenis Skull Negro Clásico", precio: 210000, cantidad: 12 },
    { imagen: "./imag/z10.webp", nombre: "Tenis Skull Cuero Negro", precio: 240000, cantidad: 4 },
];

// ------------------------------- RENDER -----------------------------------
const formatoPrecio = (valor) => "$" + valor.toLocaleString("es-CO");

// Las primeras tarjetas (visibles al cargar) se cargan de inmediato; el resto en diferido.
let tarjetasPintadas = 0;

const crearTarjeta = (item, claseTarjeta) => {
    const tarjeta = document.createElement("article");
    tarjeta.className = claseTarjeta;
    tarjeta.dataset.busqueda = `${item.nombre} ${item.descripcion || ""}`.toLowerCase();

    const img = document.createElement("img");
    img.className = "imagen";
    img.src = item.imagen;
    img.alt = item.nombre;
    img.width = 300;
    img.height = 300;
    img.decoding = "async";
    if (tarjetasPintadas++ >= 4) img.loading = "lazy";

    const titulo = document.createElement("h3");
    titulo.className = "titulo";
    titulo.textContent = item.nombre;

    const cantidad = document.createElement("div");
    cantidad.className = "cantidad";
    cantidad.textContent = "cantidad: " + item.cantidad;

    tarjeta.append(img, titulo, cantidad);

    if (item.descripcion) {
        const descripcion = document.createElement("p");
        descripcion.className = "descripcion";
        descripcion.textContent = item.descripcion;
        tarjeta.appendChild(descripcion);
    }

    const precio = document.createElement("div");
    precio.className = "precio";
    precio.textContent = formatoPrecio(item.precio);

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "botonzz";
    boton.textContent = "AGREGAR";
    boton.setAttribute("aria-label", "Agregar " + item.nombre + " al carrito");
    boton.addEventListener("click", () => agregarAlCarrito(item));

    tarjeta.append(precio, boton);
    return tarjeta;
};

const pintarLista = (idContenedor, lista, claseTarjeta) => {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;
    lista.forEach((item) => contenedor.appendChild(crearTarjeta(item, claseTarjeta)));
};

// ------------------------------- BUSCADOR ---------------------------------
const buscar = () => {
    const input = document.getElementById("buscador");
    if (!input) return;
    const termino = input.value.trim().toLowerCase();
    let visibles = 0;

    document.querySelectorAll("[data-busqueda]").forEach((tarjeta) => {
        const coincide = tarjeta.dataset.busqueda.includes(termino);
        tarjeta.hidden = !coincide;
        if (coincide) visibles++;
    });

    // Oculta las secciones que quedan sin resultados.
    document.querySelectorAll(".seccion").forEach((seccion) => {
        seccion.hidden = !seccion.querySelector("[data-busqueda]:not([hidden])");
    });

    const aviso = document.getElementById("sin-resultados");
    if (aviso) aviso.hidden = visibles > 0;

    if (termino && visibles > 0) {
        document.querySelector("[data-busqueda]:not([hidden])")
            .scrollIntoView({ behavior: "smooth", block: "center" });
    }
};

const eventosBuscador = () => {
    const form = document.getElementById("search");
    const input = document.getElementById("buscador");
    if (!form || !input) return;
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        buscar();
    });
    // Al borrar el campo (o pulsar la "x" del input search) se muestra todo de nuevo.
    input.addEventListener("input", () => {
        if (input.value.trim() === "") buscar();
    });
};

// ------------------------------- CARRITO ----------------------------------
let carrito = {};

const actualizarContador = () => {
    const contador = document.getElementById("contador-carrito");
    if (!contador) return;
    const unidades = Object.values(carrito).reduce((suma, p) => suma + p.cantidad, 0);
    contador.textContent = unidades;
    contador.hidden = unidades === 0;
};

const agregarAlCarrito = (producto) => {
    if (carrito[producto.nombre]) {
        carrito[producto.nombre].cantidad++;
    } else {
        carrito[producto.nombre] = { ...producto, cantidad: 1 };
    }
    mostrarCarrito();
};

const mostrarCarrito = () => {
    const carritoLista = document.getElementById("carrito-lista");
    const totalCost = document.getElementById("total-cost");
    if (!carritoLista || !totalCost) return;

    carritoLista.innerHTML = "";
    let totalCosto = 0;

    const nombres = Object.keys(carrito);
    if (nombres.length === 0) {
        const vacio = document.createElement("p");
        vacio.className = "carrito-vacio";
        vacio.textContent = "Tu carrito está vacío.";
        carritoLista.appendChild(vacio);
    }

    nombres.forEach((nombre) => {
        const producto = carrito[nombre];
        const subtotal = producto.precio * producto.cantidad;

        const itemCarrito = document.createElement("div");
        itemCarrito.className = "item-carrito";

        const imagen = document.createElement("img");
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;
        imagen.className = "img-carrito";

        const textoProducto = document.createElement("span");
        textoProducto.className = "texto-producto";
        textoProducto.textContent = `${producto.nombre} - ${formatoPrecio(subtotal)} - Cantidad: ${producto.cantidad}`;

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "btn btn-danger btn-sm";
        botonEliminar.addEventListener("click", () => eliminarDelCarrito(nombre));

        itemCarrito.append(imagen, textoProducto, botonEliminar);
        carritoLista.appendChild(itemCarrito);

        totalCosto += subtotal;
    });

    totalCost.textContent = `Total COP: ${formatoPrecio(totalCosto)}`;
    actualizarContador();
};

const eliminarDelCarrito = (nombreProducto) => {
    if (!carrito[nombreProducto]) return;
    if (carrito[nombreProducto].cantidad > 1) {
        // Si hay más de una unidad, resta una
        carrito[nombreProducto].cantidad--;
    } else {
        // Si solo queda una, elimina el producto del carrito
        delete carrito[nombreProducto];
    }
    mostrarCarrito();
};

const vaciarCarrito = () => {
    carrito = {};
    mostrarCarrito();
};

// ------------------------------- INICIO -----------------------------------
document.addEventListener("DOMContentLoaded", () => {
    pintarLista("tablas", productos, "tabla");
    pintarLista("ropa", productosR, "tabla2");
    pintarLista("accesorios", productosA, "tabla3");
    eventosBuscador();

    const vaciar = document.getElementById("btn-btn-TR");
    if (vaciar) vaciar.addEventListener("click", vaciarCarrito);

    mostrarCarrito();
});
