import { Habilidad } from "./habilidad.js";

export class Puesto{
    constructor(nombre, salario, nivel, fechaDeCreacion, habilidades = []){
        this.nombre = nombre;
        this.salario = salario;
        this.nivel = nivel;
        this.fechaDeCreacion = fechaDeCreacion;
        this.habilidades = habilidades;
        this.guardado = false;
    }

    static _comprobarYaAgregado(lista, puesto) {
        for (let i = 0; i < lista.length; i++) {
            const item = lista[i];

            if (item.nombre === puesto.nombre) {
                return true; 
            }
        }
        return false; 
    }

    static guardar(puesto){
        const lista = JSON.parse(localStorage.getItem("puestos-guardados")) || [];

        if (!this._comprobarYaAgregado(lista, puesto)) {
            puesto.guardado = true;
            lista.push(puesto);
            localStorage.setItem("puestos-guardados", JSON.stringify(lista));
            console.log("guardado!!")
        } else {
            console.log("error, puesto ya guardado");
        }
    }

    static SacarDeguardar(puesto){
        const lista = JSON.parse(localStorage.getItem("puestos-guardados")) || [];

        // filtra todos los que NO coincidan con el puesto a sacar
        const nuevaLista = lista.filter(item => item.nombre !== puesto.nombre);

        puesto.guardado = false;

        localStorage.setItem("puestos-guardados", JSON.stringify(nuevaLista));
    }

    static traerGuardados() {
        const data = localStorage.getItem("puestos-guardados");

        if (!data) return [];
        const lista = JSON.parse(data);

        return lista;
    }

    static estaGuardado(nombre) {
        const lista = JSON.parse(localStorage.getItem("puestos-guardados")) || [];
        return lista.some(item => item.nombre === nombre);
    }

    createHtmlElement(){
        const paginaActual = window.location.pathname.split("/").pop();

        if (Puesto.estaGuardado(this.nombre)) {
            this.guardado = true;
        }

        const card = document.createElement("div");
        card.classList.add("card");

        const datosContainer = document.createElement("div");
        datosContainer.classList.add("card-datos");


        const nombreText = document.createElement("p");
        nombreText.textContent = this.nombre;

        const salarioText = document.createElement("p");
        salarioText.textContent = this.salario;

        const nivelText = document.createElement("p");
        nivelText.textContent = this.nivel;

        const fechaDeCreacionText = document.createElement("p");
        fechaDeCreacionText.textContent = this.fechaDeCreacion;

        const botonContainer = document.createElement("div");
        botonContainer.classList.add("btnGuardarDiv");

        const btnGuardar = document.createElement("button");
        botonContainer.append(btnGuardar);

        const actualizarBoton = () => {

            btnGuardar.disabled = false;

            if (this.guardado) {
                if (paginaActual === "index.html") {
                    btnGuardar.textContent = "guardado"
                    btnGuardar.disabled = true;
                } 
                else{
                    btnGuardar.textContent = "quitar";

                    btnGuardar.onclick = () => {
                        Puesto.SacarDeguardar(this);
                        this.guardado = false;

                        card.remove(); // en guardados desaparece la card
                    };   
                }


            } else {
                btnGuardar.textContent = "guardar";

                btnGuardar.onclick = () => {
                    Puesto.guardar(this);
                    this.guardado = true;

                    if (paginaActual === "index.html") {
                        // en index lo bloqueado
                        btnGuardar.disabled = true;
                        btnGuardar.textContent = "guardado";
                    } else {
                        actualizarBoton(); 
                    }
                };
            }
        };

        actualizarBoton();

        datosContainer.append(nombreText, salarioText, nivelText, fechaDeCreacionText, botonContainer);

        // Mostrar habilidades
        const habilidadesDiv = document.createElement("div");
        habilidadesDiv.classList.add("habilidades");

        const tituloHab = document.createElement("p");
        tituloHab .textContent = "--HABILIDADES--";
        tituloHab.style.fontWeight = "bold";

        habilidadesDiv.append(tituloHab);

        this.habilidades.forEach(h => {
            const habItem = h.createHtmlElement(); 
            habItem.classList.add("habilidad-item");
            habilidadesDiv.append(habItem);
        });

        card.append(datosContainer, habilidadesDiv);
        return card;
    }

    static createFromJsonString(jsonObj) {
        const data = jsonObj;

        const habilidadesInstancias = data.habilidades.map(h => {
            return new Habilidad(h.nombre, h.aniosDeExperiencia, h.excluyente);
        });

        const puesto = new Puesto(
            data.nombre,
            data.salario,
            data.nivel,
            data.fechaDeCreacion,
            habilidadesInstancias
        );
        puesto.guardado = data.guardado ?? false;

        return puesto;
    }

}