import { Puesto } from "./puesto.js";

const btnDescargarPDF = document.getElementById("btnDescargarPDF");

const btnSiguiente = document.getElementById("btnSiguiente");
const btnAnterior = document.getElementById("btnAnterior");

btnSiguiente.addEventListener("click", pagSiguiente);
btnAnterior.addEventListener("click", pagAnterior);

const btTraerPuesto = document.getElementById("bt-traer-puesto");
btTraerPuesto.addEventListener("click", traerPuesto);

const puestos = 50;
let cantPuestos = 5;
let paginaActual = 1;
let puestosTotales = [];

document.addEventListener("DOMContentLoaded", async () => {
    
    const data = await traerPuestosTotales(puestos); 
    puestosTotales = data.puestos || [];
    mostrarPagina();

});

function mostrarPagina() {
    const inicio = (paginaActual - 1) * cantPuestos;
    const fin = inicio + cantPuestos;
    const listaPagina = puestosTotales.slice(inicio, fin);
    mostrarPuestos(listaPagina);
}

function mostrarPuestos(lista){
    const contenedor = document.getElementById("puestos");
    contenedor.innerHTML = ""; 

    lista.forEach(data => {

        const puesto = Puesto.createFromJsonString(data)

        contenedor.appendChild(puesto.createHtmlElement());
    });
}

function mostrarUltimoPuestoGuardado(nuevoPuesto) {
    const contenedor = document.getElementById("ultimoPuestoGuardado");
    if (!contenedor) return;

    if (!contenedor.offsetParent) return;

    contenedor.innerHTML = "";

    const data = JSON.parse(localStorage.getItem("ultimoPuestoBuscado"));
    if (!data) return; 

    if(!(nuevoPuesto.nombre === data.nombre)){
            
        const divNombre = document.createElement("p");
        divNombre.textContent = "Nombre del puesto anterior: " + data.nombre;

        const divSalario = document.createElement("p");
        if (nuevoPuesto) {
            
            const sueldoNuevo = Number(nuevoPuesto.salario);
            const sueldoViejo = Number(data.salario);

            const diferencia = sueldoNuevo - sueldoViejo;

            if (diferencia > 0) {
                divSalario.textContent = `El puesto ${nuevoPuesto.nombre} tiene más $${diferencia} de sueldo`;
            } else if (diferencia < 0) {
                divSalario.textContent = `El puesto ${nuevoPuesto.nombre} tiene menos $${Math.abs(diferencia)} de sueldo`;
            } else {
                divSalario.textContent = `Ambos puestos tienen el mismo sueldo`;
            }
        }

        if (!data.habilidades || !Array.isArray(data.habilidades)) {
            return;
        }

        const divHabilidad = document.createElement("p");
        let maxHabilidad = { nombre: "", aniosDeExperiencia: 0, puesto: "" };
        data.habilidades.forEach(h => {
            if (h.aniosDeExperiencia > maxHabilidad.aniosDeExperiencia) {
                maxHabilidad = { ...h, puesto: data.nombre };
            }
        });
        divHabilidad.textContent = `Habilidad que más experiencia requiere: ${maxHabilidad.nombre} (${maxHabilidad.aniosDeExperiencia} años) del puesto ${maxHabilidad.puesto}`;

        contenedor.appendChild(divNombre);
        contenedor.appendChild(divSalario);
        contenedor.appendChild(divHabilidad);
    }

}


async function traerPuesto() {
    const input = document.getElementById("traer-puesto");
    const nombre = input.value.trim();

    const contenedorBusqueda = document.getElementById("busqueda");
    contenedorBusqueda.innerHTML = "";

    // Validacion

    const errorValidacion = validarNombrePuesto(nombre);
    if (errorValidacion) {
        const alerta = document.createElement("p");
        alerta.textContent = errorValidacion;
        alerta.classList.add("alerta");
        contenedorBusqueda.appendChild(alerta);
        return;
    }


    const data = await fetchJSON("https://pp-prog-iii-2025-c2.vercel.app/puestos/"+nombre);
    if (!data) {
        const alerta = document.createElement("p");
        alerta.textContent = "Puesto no encontrado";
        alerta.classList.add("alerta");
        contenedorBusqueda.appendChild(alerta);
        return;
    }

    const puesto = Puesto.createFromJsonString(data);

    // Mostramos información comparativa antes de sobreescribir
    mostrarUltimoPuestoGuardado(puesto);

    // Guardamos el puesto actual
    localStorage.setItem("ultimoPuestoBuscado", JSON.stringify(data));

    contenedorBusqueda.appendChild(puesto.createHtmlElement());
}

async function traerPuestosTotales(limit){
    const data = await fetchJSON("https://pp-prog-iii-2025-c2.vercel.app/puestos?limit=$"+limit);
    return data || { puestos: [] };
}

function validarNombrePuesto(nombre) {
    if (nombre.length < 3) {
        return "El mínimo de caracteres debe ser 3";
    } else if (nombre.length > 12) {
        return "El máximo de caracteres debe ser 12";
    }

    const prohibidos = ["@", "&", "$"];

    for (let i = 0; i < nombre.length; i++) {
        const char = nombre[i];

        if (!isNaN(parseInt(char))) {
            return "No puede contener números";
        }

        if (prohibidos.includes(char)) {
            return "No puede contener los siguientes caracteres @, &, $";
        }
    }

}

async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

btnDescargarPDF.addEventListener("click", async () => {
    const data = JSON.parse(localStorage.getItem("ultimoPuestoBuscado"));
    if (!data) {
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Error al generar PDF");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "puesto.pdf"; // nombre del archivo PDF
        a.click();

        URL.revokeObjectURL(url);
    } catch (error) {
        console.error(error);
    }
});

function pagSiguiente(){
    if ((paginaActual * cantPuestos) < puestosTotales.length){
        paginaActual++;
        mostrarPagina();
    }
}

function pagAnterior(){
    if (paginaActual > 1) {
        paginaActual--;
        mostrarPagina();
    }
}
