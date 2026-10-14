"use strict";

const form = document.getElementById("form-tarea");
const campoActividad = document.getElementById("actividad");
const campoFecha = document.getElementById("fecha");
const campoPrioridad = document.getElementById("prioridad");
const btnGuardar = document.getElementById("btn-guardar");
const btnCancelar = document.getElementById("btn-cancelar");
const btnOrdenar = document.getElementById("btn-ordenar");
const tituloForm = document.getElementById("titulo-form");
const mensaje = document.getElementById("mensaje");
const tablaContainer = document.getElementById("tablaContainer");
const cuerpoTabla = document.getElementById("cuerpo-tabla");
const mensajeVacio = document.getElementById("vacio");
const contador = document.getElementById("contador");

let tareas = [];
let idEdicion = null;
let siguienteId = 1;

/* ---------- Utilidades ---------- */

const formatearFecha = (iso) => {
    const [anio, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${anio}`;
};

const anunciar = (texto, tipo = "ok") => {
    mensaje.textContent = texto;
    mensaje.dataset.tipo = tipo;
};

const marcarError = (campo, texto) => {
    document.getElementById(`error-${campo.id}`).textContent = texto;
    campo.setAttribute("aria-invalid", texto ? "true" : "false");
};

const validar = () => {
    const actividad = campoActividad.value.trim().replace(/\s+/g, " ");
    const fecha = campoFecha.value;
    let valido = true;

    if (!actividad) {
        marcarError(campoActividad, "Describe la actividad.");
        valido = false;
    } else if (actividad.length < 3) {
        marcarError(campoActividad, "La actividad debe tener al menos 3 caracteres.");
        valido = false;
    } else {
        marcarError(campoActividad, "");
    }

    if (!fecha) {
        marcarError(campoFecha, "Selecciona una fecha válida.");
        valido = false;
    } else {
        marcarError(campoFecha, "");
    }

    return valido ? { actividad, fecha, alta: campoPrioridad.checked } : null;
};

/* ---------- Tabla ---------- */

const crearCelda = (etiqueta, contenido) => {
    const celda = document.createElement("td");
    celda.dataset.label = etiqueta;
    if (contenido instanceof Node) celda.append(contenido);
    else celda.textContent = contenido;
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

    tareas.forEach((tarea) => {
        const fila = document.createElement("tr");
        if (tarea.id === idEdicion) fila.classList.add("en-edicion");

        const insignia = document.createElement("span");
        insignia.className = `insignia ${tarea.alta ? "insignia--alta" : "insignia--baja"}`;
        insignia.textContent = tarea.alta ? "Alta" : "Baja";

        const opciones = crearCelda("Opciones", "");
        opciones.classList.add("celda-opciones");
        opciones.append(
            crearBoton("Editar", "boton-tabla--editar", `Editar la tarea «${tarea.actividad}»`, () => editar(tarea.id)),
            crearBoton("Eliminar", "boton-tabla--eliminar", `Eliminar la tarea «${tarea.actividad}»`, () => eliminar(tarea.id)),
        );

        fila.append(
            crearCelda("Actividad", tarea.actividad),
            crearCelda("Fecha", formatearFecha(tarea.fecha)),
            crearCelda("Prioridad", insignia),
            opciones,
        );
        cuerpoTabla.append(fila);
    });

    const hayTareas = tareas.length > 0;
    tablaContainer.hidden = !hayTareas;
    mensajeVacio.hidden = hayTareas;
    btnOrdenar.disabled = tareas.length < 2;
    contador.textContent = `(${tareas.length})`;
};

/* ---------- Acciones ---------- */

const salirDeEdicion = () => {
    idEdicion = null;
    form.reset();
    marcarError(campoActividad, "");
    marcarError(campoFecha, "");
    tituloForm.textContent = "Nueva tarea";
    btnGuardar.textContent = "Agregar tarea";
    btnCancelar.hidden = true;
};

const editar = (id) => {
    const tarea = tareas.find((t) => t.id === id);
    if (!tarea) return;
    idEdicion = id;
    campoActividad.value = tarea.actividad;
    campoFecha.value = tarea.fecha;
    campoPrioridad.checked = tarea.alta;
    marcarError(campoActividad, "");
    marcarError(campoFecha, "");
    tituloForm.textContent = "Editar tarea";
    btnGuardar.textContent = "Guardar cambios";
    btnCancelar.hidden = false;
    anunciar(`Editando «${tarea.actividad}».`, "info");
    pintar();
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    campoActividad.focus({ preventScroll: true });
};

const eliminar = (id) => {
    const tarea = tareas.find((t) => t.id === id);
    if (!tarea) return;
    tareas = tareas.filter((t) => t.id !== id);
    if (idEdicion === id) salirDeEdicion();
    pintar();
    anunciar(`Se eliminó «${tarea.actividad}».`);
};

const ordenar = () => {
    // Primero prioridad alta; dentro de cada grupo, la fecha más próxima primero.
    tareas.sort((a, b) => Number(b.alta) - Number(a.alta) || a.fecha.localeCompare(b.fecha));
    pintar();
    anunciar("Tareas ordenadas: prioridad alta primero y luego por fecha.", "info");
};

form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const datos = validar();
    if (!datos) {
        anunciar("Completa los campos marcados.", "error");
        (campoActividad.getAttribute("aria-invalid") === "true" ? campoActividad : campoFecha).focus();
        return;
    }

    if (idEdicion === null) {
        tareas.push({ id: siguienteId++, ...datos });
        anunciar(`Se agregó «${datos.actividad}».`);
    } else {
        const tarea = tareas.find((t) => t.id === idEdicion);
        Object.assign(tarea, datos);
        anunciar(`Se actualizó «${datos.actividad}».`);
    }
    salirDeEdicion();
    pintar();
    campoActividad.focus();
});

btnCancelar.addEventListener("click", () => {
    salirDeEdicion();
    pintar();
    anunciar("Edición cancelada.", "info");
});

btnOrdenar.addEventListener("click", ordenar);

[campoActividad, campoFecha].forEach((campo) => {
    campo.addEventListener("input", () => {
        if (campo.getAttribute("aria-invalid") === "true" && campo.value.trim()) marcarError(campo, "");
    });
});

pintar();
