// Veterinaria Animalia · agenda de citas
document.addEventListener('DOMContentLoaded', () => {
    const CLAVE = 'animalia-citas';
    const IMAGENES = {
        Perro: { src: './imagenes/Canino.jpg', nombre: 'Canino' },
        Gato: { src: './imagenes/Felino.jpg', nombre: 'Felino' },
        Roedor: { src: './imagenes/Roedor.jpg', nombre: 'Roedor' },
        Pez: { src: './imagenes/Pez.jpeg', nombre: 'Pez' },
    };

    const $ = (id) => document.getElementById(id);
    const campos = {
        nombreMascota: $('nom_mas'),
        nombrePropietario: $('nom_pro'),
        telefono: $('telefono'),
        tipoMascota: $('tipo_mas'),
        fecha: $('fecha'),
        hora: $('hora'),
        sintomas: $('sintomas'),
    };
    const form = $('formCita');
    const filtro = $('filtro');
    const lista = $('citas');
    const vacio = $('vacio');
    const tituloCitas = $('titulo-citas');
    const alerta = $('alerta');
    const aviso = $('aviso');
    const modalEl = $('modalCita');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    let citas = cargar();
    let editandoId = null;

    $('anio').textContent = new Date().getFullYear();

    // ── Persistencia ────────────────────────────────────────
    function cargar() {
        try {
            const datos = JSON.parse(localStorage.getItem(CLAVE));
            return Array.isArray(datos) ? datos : [];
        } catch (e) {
            return [];
        }
    }

    function guardar() {
        try {
            localStorage.setItem(CLAVE, JSON.stringify(citas));
        } catch (e) { /* sin almacenamiento: la agenda vive solo en esta sesión */ }
    }

    // ── Fechas ──────────────────────────────────────────────
    const fechaLocal = (d) => {
        const p = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
    };
    const hoy = () => fechaLocal(new Date());
    const manana = () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return fechaLocal(d);
    };
    const formatoFecha = (iso) => {
        const [a, m, d] = iso.split('-').map(Number);
        return new Date(a, m - 1, d).toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    };

    // ── Formulario ──────────────────────────────────────────
    const limpiarFormulario = () => {
        form.reset();
        campos.tipoMascota.value = 'Perro';
        ocultarAlerta();
    };

    const leerFormulario = () => {
        const info = {};
        for (const [clave, campo] of Object.entries(campos)) info[clave] = campo.value.trim();
        return info;
    };

    const validar = (info) => {
        const digitos = info.telefono.replace(/\D/g, '');
        if (Object.values(info).some((v) => !v)) return 'Por favor, complete todos los campos';
        if (!/^[\d\s+()-]+$/.test(info.telefono) || digitos.length < 10) return 'El teléfono debe tener al menos 10 dígitos';
        if (info.hora < '06:00' || info.hora > '22:00') return 'La hora debe estar entre las 6:00 AM y las 10:00 PM';
        if (info.fecha <= hoy()) return 'La fecha debe ser posterior a hoy';
        return null;
    };

    const mostrarAlerta = (mensaje) => {
        alerta.textContent = mensaje;
        alerta.classList.remove('d-none');
        alerta.scrollIntoView({ block: 'nearest' });
    };

    const ocultarAlerta = () => alerta.classList.add('d-none');

    let temporizadorAviso;
    const mostrarExito = (mensaje) => {
        aviso.textContent = mensaje;
        aviso.classList.add('visible');
        clearTimeout(temporizadorAviso);
        temporizadorAviso = setTimeout(() => aviso.classList.remove('visible'), 3000);
    };

    const abrirModal = (cita) => {
        limpiarFormulario();
        editandoId = cita ? cita.id : null;
        if (cita) {
            for (const [clave, campo] of Object.entries(campos)) campo.value = cita[clave];
        }
        $('guardarCita').textContent = cita ? 'Guardar cambios' : 'Guardar y enviar';
        campos.fecha.min = manana();
        modal.show();
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const info = leerFormulario();
        const error = validar(info);
        if (error) {
            mostrarAlerta(error);
            return;
        }

        if (editandoId !== null) {
            const cita = citas.find((c) => c.id === editandoId);
            if (cita) Object.assign(cita, info);
            mostrarExito('Cita actualizada');
        } else {
            citas.push({ id: Date.now(), estado: 'activo', ...info });
            mostrarExito('Registro exitoso');
        }

        guardar();
        filtro.value = 'activo';
        pintar();
        modal.hide();
    });

    modalEl.addEventListener('shown.bs.modal', () => campos.nombreMascota.focus());

    $('agendar').addEventListener('click', () => abrirModal(null));

    // ── Tarjetas ────────────────────────────────────────────
    const linea = (etiqueta, valor) => {
        const p = document.createElement('p');
        p.className = 'cardText';
        const span = document.createElement('span');
        span.textContent = `${etiqueta}: `;
        p.append(span, document.createTextNode(valor));
        return p;
    };

    const boton = (texto, clase, accion) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = `botonesCard ${clase}`;
        b.textContent = texto;
        b.addEventListener('click', accion);
        return b;
    };

    const crearTarjeta = (cita) => {
        const tipo = IMAGENES[cita.tipoMascota] || IMAGENES.Perro;
        const card = document.createElement('article');
        card.className = 'card-cita' + (cita.estado === 'cancelado' ? ' card-cita--cancelada' : '');

        const img = document.createElement('img');
        img.src = tipo.src;
        img.alt = `Mascota de tipo ${tipo.nombre.toLowerCase()}`;
        img.width = 800;
        img.height = 450;
        img.loading = 'lazy';
        card.appendChild(img);

        const texto = document.createElement('div');
        texto.className = 'textoCard';

        const titulo = document.createElement('h3');
        titulo.className = 'tittle';
        titulo.textContent = cita.nombreMascota;
        texto.appendChild(titulo);

        texto.append(
            linea('Propietario', cita.nombrePropietario),
            linea('Teléfono', cita.telefono),
            linea('Tipo de mascota', tipo.nombre),
            linea('Fecha', formatoFecha(cita.fecha)),
            linea('Hora', cita.hora),
            linea('Síntomas', cita.sintomas),
        );

        const botones = document.createElement('div');
        botones.className = 'botones-card';
        if (cita.estado === 'activo') {
            botones.append(
                boton('Editar Cita', 'editar', () => abrirModal(cita)),
                boton('Cancelar Cita', 'eliminar', () => {
                    cita.estado = 'cancelado';
                    guardar();
                    pintar();
                    mostrarExito('Cita cancelada');
                }),
            );
        } else {
            const etiqueta = document.createElement('p');
            etiqueta.className = 'etiqueta-cancelada';
            etiqueta.textContent = 'Cita cancelada';
            botones.appendChild(etiqueta);
        }
        texto.appendChild(botones);
        card.appendChild(texto);
        return card;
    };

    const pintar = () => {
        const estado = filtro.value;
        const visibles = citas
            .filter((c) => c.estado === estado)
            .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));

        tituloCitas.textContent = estado === 'activo' ? 'Citas activas' : 'Citas canceladas';
        vacio.textContent = estado === 'activo'
            ? 'No tienes citas activas. Usa «Agendar Cita» para registrar la primera.'
            : 'No tienes citas canceladas.';
        vacio.hidden = visibles.length > 0;
        lista.replaceChildren(...visibles.map(crearTarjeta));
    };

    filtro.addEventListener('change', pintar);
    pintar();
});
