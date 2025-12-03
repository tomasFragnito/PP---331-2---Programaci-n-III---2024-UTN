import { Puesto } from "./puesto.js";

let listaGuardados = [];

let switchOrdenarNivel = true;
let switchOrdenarNombre = true;
let switchOrdenarSalario = true;

const ordenNivel = { "JR": 1, "SSR": 2, "SR": 3 };

document.addEventListener("DOMContentLoaded", async () => {
    listaGuardados  = await Puesto.traerGuardados();
    mostrarPuestos(listaGuardados);
});

document.getElementById("orden-nivel").addEventListener("click", () => {
    if(switchOrdenarNivel){
        listaGuardados.sort((a, b) => ordenNivel[a.nivel] - ordenNivel[b.nivel]);
        mostrarPuestos(listaGuardados);
        switchOrdenarNivel = false;
    }
    else{
        listaGuardados.sort((a, b) => ordenNivel[b.nivel] - ordenNivel[a.nivel]);
        mostrarPuestos(listaGuardados);

        switchOrdenarNivel = true;
    }

});

document.getElementById("orden-nombre").addEventListener("click", () => {
    if(switchOrdenarNivel){
        listaGuardados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        mostrarPuestos(listaGuardados);

        switchOrdenarNivel = false;
    }
    else{
        listaGuardados.sort((a, b) => b.nombre.localeCompare(a.nombre));
        mostrarPuestos(listaGuardados);
        
        switchOrdenarNivel = true;
    }

});

document.getElementById("orden-salario").addEventListener("click", () => {
    if(switchOrdenarNivel){
        listaGuardados.sort((a, b) => b.salario - a.salario); // mayor a menor
        mostrarPuestos(listaGuardados);

        switchOrdenarNivel = false;
    }
    else{
        listaGuardados.sort((a, b) => a.salario - b.salario); // menor a mayor
        mostrarPuestos(listaGuardados);
        
        switchOrdenarNivel = true;
    }
});

function mostrarPuestos(lista){
    const contenedor = document.getElementById("puestos-guardados");
    contenedor.innerHTML = ""; 

    lista.forEach(data => {

        const puesto = Puesto.createFromJsonString(data)

        contenedor.appendChild(puesto.createHtmlElement());
    });
}

