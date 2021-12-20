import { campoRequerido,validarNumeros,campoRequeridoSelect,validarCamposNuevoIngreso } from "./validaciones.js";
import { Gasto } from "./gasto.js";
import { determinarEstado } from "./determinarEstado.js";

let campoImporte = document.getElementById("importe");
let campoCuenta = document.getElementById("cuenta");
let campoComentario = document.getElementById("comentario");
let formulario = document.getElementById("formularioFondeo");
cargarGastos();

let campoMaximo = document.getElementById("maximoTC");
let formularioMaximo = document.getElementById("formularioModificarTC");

campoImporte.addEventListener("blur", () => {
    campoRequerido(campoImporte);
    validarNumeros(campoImporte);
});

campoCuenta.addEventListener("blur", () => {
    campoRequeridoSelect(campoCuenta);
});

campoMaximo.addEventListener("blur", () => {
    campoRequerido(campoMaximo);
    validarNumeros(campoMaximo);
});

formulario.addEventListener("submit", guardarFondeo);
formularioMaximo.addEventListener("submit", modificarTC);

function guardarFondeo(e){
    e.preventDefault();

    if(validarCamposNuevoIngreso()){
        cargarFondo();
    }
}

function cargarFondo(){
    let info = JSON.parse(localStorage.getItem("info"));
    
    switch(campoCuenta.value){
        case "Efectivo":{
            info.saldoEfectivo += parseFloat(campoImporte.value);
            break;
        }
        default:{
            info.saldoPreviaje += parseFloat(campoImporte.value);
            break;
        }
    }

    localStorage.setItem("info", JSON.stringify(info));

    agregarATabla();

    Swal.fire({
        title: "Importe cargado",
        text: "Se ha añadido correctamente el valor",
        icon: "success",
        confirmButtonText: "Joya"
    });
    limpiarFormulario();
}

function agregarATabla(){
    let gastos = cargarLocalStorage();

    let gasto = new Gasto(
        "Fondeo",
        "Fondeo",
        campoImporte.value,
        "No",
        "No",
        campoCuenta.value,
        campoComentario.value
    )

    gastos.push(gasto);

    localStorage.setItem("gastos", JSON.stringify(gastos));
}

function cargarLocalStorage(){
    let gastos = [];

    if(localStorage.getItem("gastos")){
        gastos = JSON.parse(localStorage.getItem("gastos"));
    }

    return gastos;

}

function limpiarFormulario(){
    campoImporte.value = "";
    campoCuenta.value = "0";
    campoComentario.value = "";
}

function cargarGastos(){
    let txtLimite = document.getElementById("limiteTC");
    let txtGastadoTC = document.getElementById("gastoTC");
    let txtGastadoTD = document.getElementById("gastoTD");

    let info = JSON.parse(localStorage.getItem("info"));

    //determinarEstado(info);

    txtLimite.innerHTML = '$' + info.limiteTC;
    txtGastadoTC.innerHTML = '$' + info.gastoTC;
    txtGastadoTD.innerHTML = '$' + info.gastoTD;
    
    document.getElementById("name").innerHTML = info.nombre;
    if(info.estado == "Bueno") document.getElementById("estado").innerHTML = `<i class="fas fa-check-circle text-success"></i>`;
    else if (info.estado == "Regular") document.getElementById("estado").innerHTML = `<i class="fas fa-exclamation-circle text-warning"></i>`;
    else document.getElementById("estado").innerHTML = `<i class="fas fa-cross text-danger"></i>`;

    document.getElementById("atencionTC").innerHTML = "Atencion, está cerca del limite";
    document.getElementById("pGastadoTC").className = "lead mb-3";
    document.getElementById("atencionTC").style.display = "none";
    if(info.gastoTC >= info.limiteTC){
        document.getElementById("atencionTC").style.display = "block";
        document.getElementById("atencionTC").innerHTML = "Atencion, se ha excedido el límite de gastos en TC";
        document.getElementById("atencionTC").style.color = "red";
    }
    if((info.gastoTC/info.limiteTC) >= 0.8){
        txtGastadoTC.style.color = "red";
        document.getElementById("atencionTC").style.display = "block";
        document.getElementById("pGastadoTC").className = "lead mb-0";
    }
    else 
    if((info.gastoTC/info.limiteTC) >= 0.7){
        txtGastadoTC.style.color = "orange";
    }
    else {
        txtGastadoTC.style.color = "black";
    }
}

function modificarTC(e){
    e.preventDefault();

    if(campoRequerido(campoMaximo) && validarNumeros(campoMaximo)){
        modificarMaximo();
    }
}

function modificarMaximo(){
    let info = JSON.parse(localStorage.getItem("info"));

    info.limiteTC = parseFloat(campoMaximo.value);

    localStorage.setItem("info", JSON.stringify(info));

    Swal.fire({
        title: "Modificación realizada",
        text: "Se ha modificado correctamente el límite",
        icon: "success",
        confirmButtonText: "Joya"
    });
    campoMaximo.value = "";

    cargarGastos();
}