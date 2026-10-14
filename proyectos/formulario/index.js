"use strict";

const formulario = document.getElementById("formulario");
const btnGuardar = document.getElementById("btn-guardar");
const btnCancelar = document.getElementById("btn-cancelar");
const estado = document.getElementById("estado");
const cuerpoTabla = document.getElementById("cuerpo-tabla");
const tablaScroll = document.getElementById("tabla-scroll");
const mensajeVacio = document.getElementById("vacio");
const contador = document.getElementById("contador");

const registros = [];
let indiceEdicion = null;

const PATRON_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]{2,60}$/;
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PATRON_TELEFONO = /^\d{7,15}$/;
const PATRON_DOCUMENTO = /^\d{5,12}$/;

const hoyISO = () => {
    const hoy = new Date();
    hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
    return hoy.toISOString().slice(0, 10);
};

document.getElementById("fecha").max = hoyISO();

/* ---------- Validación ---------- */

const leerDatos = () => {
    const datos = new FormData(formulario);
    return {
        nombre: (datos.get("nombre") || "").trim().replace(/\s+/g, " "),
        apellido: (datos.get("apellido") || "").trim().replace(/\s+/g, " "),
        genero: datos.get("genero") || "",
        fecha: datos.get("fecha") || "",
        tipodoc: datos.get("tipodoc") || "",
        documento: (datos.get("documento") || "").trim(),
        telefono: (datos.get("telefono") || "").replace(/[\s-]/g, ""),
        correo: (datos.get("correo") || "").trim().toLowerCase(),
    };
};

const validar = (d) => {
    const errores = {};

    if (!d.nombre) errores.nombre = "Escribe tus nombres.";
    else if (!PATRON_NOMBRE.test(d.nombre)) errores.nombre = "Usa solo letras (mínimo 2).";

    if (!d.apellido) errores.apellido = "Escribe tus apellidos.";
    else if (!PATRON_NOMBRE.test(d.apellido)) errores.apellido = "Usa solo letras (mínimo 2).";

    if (!d.genero) errores.genero = "Selecciona una opción.";

    if (!d.fecha) errores.fecha = "Indica tu fecha de nacimiento.";
    else if (d.fecha > hoyISO()) errores.fecha = "La fecha no puede ser posterior a hoy.";
    else if (d.fecha < "1900-01-01") errores.fecha = "Revisa el año de nacimiento.";

    if (!d.tipodoc) errores.tipodoc = "Selecciona el tipo de documento.";

    if (!d.documento) errores.documento = "Escribe el número de documento.";
    else if (!PATRON_DOCUMENTO.test(d.documento)) errores.documento = "Debe tener entre 5 y 12 dígitos, sin puntos ni espacios.";
    else if (registros.some((r, i) => i !== indiceEdicion && r.tipodoc === d.tipodoc && r.documento === d.documento)) {
        errores.documento = "Ya existe un registro con este documento.";
    }

    if (!d.telefono) errores.telefono = "Escribe un número de teléfono.";
    else if (!PATRON_TELEFONO.test(d.telefono)) errores.telefono = "Usa solo dígitos (entre 7 y 15).";

    if (!d.correo) errores.correo = "Escribe tu correo electrónico.";
    else if (!PATRON_CORREO.test(d.correo)) errores.correo = "Escribe un correo válido, por ejemplo nombre@dominio.com.";

    return errores;
};

const mostrarErrores = (errores) => {
    ["nombre", "apellido", "genero", "fecha", "tipodoc", "documento", "telefono", "correo"].forEach((campo) => {
        const mensaje = errores[campo] || "";
        document.getElementById(`error-${campo}`).textContent = mensaje;
        const controles = campo === "genero"
            ? formulario.querySelectorAll('input[name="genero"]')
            : [document.getElementById(campo)];
        controles.forEach((control) => control.setAttribute("aria-invalid", mensaje ? "true" : "false"));
    });
};

const anunciar = (texto, tipo = "ok") => {
    estado.textContent = texto;
    estado.dataset.tipo = tipo;
};

/* ---------- Tabla ---------- */

const formatearFecha = (iso) => {
    const [anio, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${anio}`;
};

const crearCelda = (etiqueta, texto) => {
    const celda = document.createElement("td");
    celda.dataset.label = etiqueta;
    celda.textContent = texto;
    return celda;
};

const crearBoton = (texto, clase, etiquetaAccesible, alHacerClic) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = `boton-tabla ${clase}`;
    boton.textContent = texto;
    boton.setAttribute("aria-label", etiquetaAccesible);
    boton.addEventListener("click", alHacerClic);
    return boton;
};

const pintar = () => {
    cuerpoTabla.replaceChildren();

    registros.forEach((r, indice) => {
        const fila = document.createElement("tr");
        if (indice === indiceEdicion) fila.classList.add("en-edicion");
        const nombreCompleto = `${r.nombre} ${r.apellido}`;

        fila.append(
            crearCelda("Nombres", r.nombre),
            crearCelda("Apellidos", r.apellido),
            crearCelda("Género", r.genero),
            crearCelda("Teléfono", r.telefono),
            crearCelda("Nacimiento", formatearFecha(r.fecha)),
            crearCelda("Documento", `${r.tipodoc} ${r.documento}`),
            crearCelda("Correo", r.correo),
        );

        const celdaAcciones = document.createElement("td");
        celdaAcciones.dataset.label = "Acciones";
        celdaAcciones.className = "celda-acciones";
        celdaAcciones.append(
            crearBoton("Editar", "boton-tabla--editar", `Editar registro de ${nombreCompleto}`, () => editar(indice)),
            crearBoton("Eliminar", "boton-tabla--eliminar", `Eliminar registro de ${nombreCompleto}`, () => eliminar(indice)),
        );
        fila.append(celdaAcciones);
        cuerpoTabla.append(fila);
    });

    const hayRegistros = registros.length > 0;
    tablaScroll.hidden = !hayRegistros;
    mensajeVacio.hidden = hayRegistros;
    contador.textContent = `(${registros.length})`;
};

/* ---------- Acciones ---------- */

const salirDeEdicion = () => {
    indiceEdicion = null;
    formulario.reset();
    mostrarErrores({});
    btnGuardar.textContent = "Agregar registro";
    btnCancelar.hidden = true;
};

const editar = (indice) => {
    const r = registros[indice];
    indiceEdicion = indice;
    formulario.elements.nombre.value = r.nombre;
    formulario.elements.apellido.value = r.apellido;
    formulario.elements.fecha.value = r.fecha;
    formulario.elements.tipodoc.value = r.tipodoc;
    formulario.elements.documento.value = r.documento;
    formulario.elements.telefono.value = r.telefono;
    formulario.elements.correo.value = r.correo;
    formulario.querySelectorAll('input[name="genero"]').forEach((radio) => {
        radio.checked = radio.value === r.genero;
    });
    mostrarErrores({});
    btnGuardar.textContent = "Guardar cambios";
    btnCancelar.hidden = false;
    anunciar(`Editando el registro de ${r.nombre} ${r.apellido}.`, "info");
    pintar();
    formulario.scrollIntoView({ behavior: "smooth", block: "start" });
    formulario.elements.nombre.focus({ preventScroll: true });
};

const eliminar = (indice) => {
    const [eliminado] = registros.splice(indice, 1);
    if (indiceEdicion === indice) salirDeEdicion();
    else if (indiceEdicion !== null && indiceEdicion > indice) indiceEdicion -= 1;
    pintar();
    anunciar(`Se eliminó el registro de ${eliminado.nombre} ${eliminado.apellido}.`);
};

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const datos = leerDatos();
    const errores = validar(datos);
    mostrarErrores(errores);

    const primerError = Object.keys(errores)[0];
    if (primerError) {
        anunciar("Revisa los campos marcados.", "error");
        const control = primerError === "genero"
            ? formulario.querySelector('input[name="genero"]')
            : document.getElementById(primerError);
        control.focus();
        return;
    }

    if (indiceEdicion === null) {
        registros.push(datos);
        anunciar(`Se agregó el registro de ${datos.nombre} ${datos.apellido}.`);
    } else {
        registros[indiceEdicion] = datos;
        anunciar(`Se actualizó el registro de ${datos.nombre} ${datos.apellido}.`);
    }
    salirDeEdicion();
    pintar();
});

btnCancelar.addEventListener("click", () => {
    salirDeEdicion();
    pintar();
    anunciar("Edición cancelada.", "info");
});

// Limpia el error de un campo en cuanto la persona lo corrige.
formulario.addEventListener("input", (evento) => {
    const campo = evento.target.name;
    if (!campo) return;
    const contenedorError = document.getElementById(`error-${campo}`);
    if (!contenedorError || !contenedorError.textContent) return;
    if (!validar(leerDatos())[campo]) {
        contenedorError.textContent = "";
        formulario.querySelectorAll(`[name="${campo}"]`).forEach((control) => control.setAttribute("aria-invalid", "false"));
    }
});

pintar();
