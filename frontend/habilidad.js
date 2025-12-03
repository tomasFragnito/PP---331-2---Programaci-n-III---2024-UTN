/*
    nombre -> srting
    anios -> number
    excluyente -> bool
*/
export class Habilidad{
    constructor(nombre, aniosDeExperiencia, excluyente){
        this.nombre = nombre;
        this.aniosDeExperiencia = aniosDeExperiencia;
        this.excluyente = excluyente;
    }

    createHtmlElement(){
        const div = document.createElement("div");
        div.classList.add("habilidad");

        div.append(
            this._p("Nombre", this.nombre),
            this._p("Años", this.aniosDeExperiencia),
            this._p("Excluyente", this.excluyente)
        );

        return div;
    }

    _p(label, value){
        const p = document.createElement("p");
        p.textContent = `${label}: ${value}`;
        return p;
    }
}