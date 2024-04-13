document.addEventListener('DOMContentLoaded', () => {

    let indice = null;
    const alerta = document.getElementById("alerta");
    alerta.style.top = "-100px";

    let datos = [];


    const limpiarFormulario = () => {
        document.getElementById('nom_mas').value = '';
        document.getElementById('nom_pro').value = '';
        document.getElementById('telefono').value = '';
        document.getElementById('tipo_mas').value = 'Perro';
        document.getElementById('fecha').value = '';
        document.getElementById('hora').value = '';
        document.getElementById('sintomas').value = '';
    };
    let cancelas = document.getElementById("cancelas")


    const estadoCitas = () => {
        let select = document.getElementById("select");
        let valorSeleccionado = select.options[select.selectedIndex].value;
    
        if (valorSeleccionado === "activo") {
            document.getElementById("cancelas").style.display = "none";
            document.getElementById("cardsCitas").style.display = "grid"; 
        } else {
            document.getElementById("cardsCitas").style.display = "none"; 
            document.getElementById("cancelas").style.display = "grid"; 
        }
    };
    

    document.getElementById('select').addEventListener('change', estadoCitas);



    estadoCitas()

    const agregarCita = () => {
        const info = {
            nombreMascota: document.getElementById('nom_mas').value,
            nombrePropietario: document.getElementById('nom_pro').value,
            telefono: document.getElementById('telefono').value,
            tipoMascota: document.getElementById('tipo_mas').value,
            fecha: document.getElementById('fecha').value,
            hora: document.getElementById('hora').value,
            sintomas: document.getElementById('sintomas').value
        };

        if (indice !== null) {
            // Si el índice no es nulo se está editando una cita existente
            datos[indice] = info; // Actualizar la cita existente en el array 'datos'
            indice = null; // Reiniciar el índice de edición
        } else {
            datos.push(info);
        }
        document.getElementById("cardsCitas").textContent = "";
        pintar();
    };

    const pintar = () => {
        const cardsCitas = document.getElementById("cardsCitas");
        datos.forEach((info, index) => {
            const card = document.createElement("div");
            card.setAttribute("class", "card");

            let imagenSrc = '';
            switch (info.tipoMascota.toLowerCase()) {
                case 'perro':
                    imagenSrc = './imagenes/Canino.jpg';
                    break;
                case 'gato':
                    imagenSrc = './imagenes/Felino.jpg';
                    break;
                case 'roedor':
                    imagenSrc = './imagenes/Roedor.jpg';
                    break;
                case 'pez':
                    imagenSrc = './imagenes/Pez.jpeg';
                    break;
            }

            let imagen = document.createElement("img");
            imagen.setAttribute("src", imagenSrc);
            card.appendChild(imagen);

            let textoCard = document.createElement("div");
            textoCard.setAttribute("id", "textoCard");
            card.appendChild(textoCard)

            let tittle = document.createElement("div");
            tittle.setAttribute("class", "tittle");
            tittle.textContent = info.nombreMascota;
            textoCard.appendChild(tittle);

            let cardText = document.createElement("div");
            cardText.setAttribute("class", "cardText");
            let propietarioSpan = document.createElement("span");
            propietarioSpan.textContent = 'Propietario: ';
            let nombrePropietarioText = document.createTextNode(info.nombrePropietario);
            cardText.appendChild(propietarioSpan);
            cardText.appendChild(nombrePropietarioText);
            textoCard.appendChild(cardText);

            let telefono = document.createElement("div");
            telefono.setAttribute("class", "cardText");
            let telefonoSpan = document.createElement("span");
            telefonoSpan.textContent = 'Teléfono: ';
            let telefonoText = document.createTextNode(info.telefono);
            telefono.appendChild(telefonoSpan);
            telefono.appendChild(telefonoText);
            textoCard.appendChild(telefono);

            let tipoMascota = document.createElement("div");
            tipoMascota.setAttribute("class", "cardText");
            let tipoMascotaSpan = document.createElement("span");
            tipoMascotaSpan.textContent = 'Tipo de mascota: ';
            let tipoMascotaText = document.createTextNode(info.tipoMascota);
            tipoMascota.appendChild(tipoMascotaSpan);
            tipoMascota.appendChild(tipoMascotaText);
            textoCard.appendChild(tipoMascota);

            let fecha = document.createElement("div");
            fecha.setAttribute("class", "cardText");
            let fechaSpan = document.createElement("span");
            fechaSpan.textContent = 'Fecha: ';
            let fechaText = document.createTextNode(info.fecha);
            fecha.appendChild(fechaSpan);
            fecha.appendChild(fechaText);
            textoCard.appendChild(fecha);

            let hora = document.createElement("div");
            hora.setAttribute("class", "cardText");
            let horaSpan = document.createElement("span");
            horaSpan.textContent = 'Hora: ';
            let horaText = document.createTextNode(info.hora);
            hora.appendChild(horaSpan);
            hora.appendChild(horaText);
            textoCard.appendChild(hora);

            let sintomas = document.createElement("div");
            sintomas.setAttribute("class", "cardText");
            let sintomasSpan = document.createElement("span");
            sintomasSpan.textContent = 'Síntomas: ';
            let sintomasText = document.createTextNode(info.sintomas);
            sintomas.appendChild(sintomasSpan);
            sintomas.appendChild(sintomasText);
            textoCard.appendChild(sintomas);



            let eliminar = document.createElement("button")
            eliminar.setAttribute("class", "botonesCard")
            eliminar.setAttribute("id", "eliminar")
            eliminar.textContent = "Cancelar Cita"
            eliminar.addEventListener("click", () => {
                // Mover la tarjeta a la sección de citas canceladas
                cancelas.appendChild(card);
            })
            textoCard.appendChild(eliminar);

            let editar = document.createElement("button")
            editar.textContent = "Editar Cita"
            editar.setAttribute("class", "botonesCard")
            editar.setAttribute("id", "editar")
            editar.addEventListener("click", () => {
                document.getElementById('nom_mas').value = info.nombreMascota
                document.getElementById('nom_pro').value = info.nombrePropietario
                document.getElementById('telefono').value = info.telefono
                document.getElementById('tipo_mas').value = info.tipoMascota
                document.getElementById('fecha').value = info.fecha
                document.getElementById('hora').value = info.hora
                document.getElementById('sintomas').value = info.sintomas
                indice = index;
            })


            textoCard.appendChild(editar);
            cardsCitas.appendChild(card);
        });
    };

    const validarFormulario = () => {
        const nombreMascota = document.getElementById('nom_mas').value;
        const nombrePropietario = document.getElementById('nom_pro').value;
        const telefono = document.getElementById('telefono').value;
        const tipoMascota = document.getElementById('tipo_mas').value;
        const fecha = new Date(document.getElementById('fecha').value);
        const hora = document.getElementById('hora').value;
        const sintomas = document.getElementById('sintomas').value;
        const now = new Date();

        if (!nombreMascota || !nombrePropietario || !telefono || !fecha || !hora || !sintomas) {
            mostrarAlerta("Por favor, complete todos los campos");
        } else if (telefono.length < 10) {
            mostrarAlerta("El teléfono debe tener al menos 10 dígitos");
        } else if (hora < "06:00" || hora > "22:00") {
            mostrarAlerta("La hora debe estar entre las 6:00 AM y las 10:00 PM");
        } else if (fecha < now) {
            mostrarAlerta("La fecha debe ser posterior a hoy");
        } else {
            agregarCita();
            limpiarFormulario();
            mostrarExito("Registro exitoso");
            setTimeout(() => {
                myModal.hide();
            }, 700);
        }
    };

    const mostrarAlerta = (mensaje) => {
        alerta.style.top = "60px";
        document.getElementById("mensaje").textContent = mensaje;
        setTimeout(() => {
            alerta.style.top = "-100px";
        }, 3000);
    };

    const mostrarExito = (mensaje) => {
        const alerta2 = document.getElementById("alerta2");
        alerta2.style.top = "30px";
        document.getElementById("mensaje2").textContent = mensaje;
        setTimeout(() => {
            alerta2.style.top = "-100px";
        }, 3000);
    };

    document.getElementById('guardarCita').addEventListener('click', validarFormulario);
});


function cerrarModal() {
    myModal.hide();
}