import { campoRequerido } from "./validaciones.js";
import { validarCampos } from "./validaciones.js";
import { validarNumeros } from "./validaciones.js";
import { campoRequeridoSelect } from "./validaciones.js";
import { Gasto } from "./gasto.js";

let campoConcepto = document.getElementById("concepto");
let campoCategoria = document.getElementById("categoria");
let campoImporte = document.getElementById("importe");
let campoMeDebePlata = document.getElementById("meDebePlata");
let campoOrigen = document.getElementById("origen");
let campoDeboPlata = document.getElementById("deboPlata");
let campoComentario = document.getElementById("comentario");
let formulario = document.getElementById("nuevoGasto");

//mostrar/ocultar boton de saldo y cambiar mt-5 segun corresponda
botonSaldo();

let gastos = cargarLocalStorage();

campoConcepto.addEventListener("blur", () => {
  campoRequerido(campoConcepto);
});
campoCategoria.addEventListener("blur", () => {
  campoRequeridoSelect(campoCategoria);
});
campoImporte.addEventListener("blur", () => {
  campoRequerido(campoImporte);
  validarNumeros(campoImporte);
});
campoOrigen.addEventListener("blur", () => {
  campoRequeridoSelect(campoOrigen);
});
formulario.addEventListener("submit", guardarGasto);

function guardarGasto(e) {
  e.preventDefault();

  if (validarCampos()) {
    crearGasto();
  }
}

function crearGasto() {
  let debo = "No";
  let debe = "No";
  if (campoDeboPlata.checked) debo = "Si";
  if (campoMeDebePlata.checked) debe = "Si";

  let fechaActual = new Date();
  let dia = fechaActual.getDate();
  let mes = fechaActual.getMonth() + 1;
  let anio = fechaActual.getFullYear();
  let fecha = dia + "/" + mes + "/" + anio;

  let hora = fechaActual.getHours();
  let minutos = fechaActual.getMinutes();
  let segundos = fechaActual.getSeconds();
  let horaAct = hora + ":" + minutos + ":" + segundos;

  let tiempo = fecha + " - " + horaAct;

  let gastoNuevo = new Gasto(
    campoConcepto.value,
    campoCategoria.value,
    campoImporte.value,
    debe,
    campoOrigen.value,
    debo,
    campoComentario.value,
    tiempo
  );

  gastos.push(gastoNuevo);
  limpiarFormulario();
  guardarLocalStorage();

  Swal.fire({
    title: "Exito",
    text: "Gasto cargado correctamente",
    icon: "success",
    confirmButtonText: "Joya",
  });
}

function limpiarFormulario() {
  campoConcepto.value = "";
  campoCategoria.value = "0";
  campoImporte.value = "";
  campoOrigen.value = "0";
  campoDeboPlata.checked = false;
  campoMeDebePlata.checked = false;
  campoComentario.value = "";
}

function guardarLocalStorage() {
  localStorage.setItem("gastos", JSON.stringify(gastos));
}

function cargarLocalStorage() {
  let gastos;
  if (localStorage.getItem("gastos") === null) {
    gastos = [];
  } else {
    gastos = JSON.parse(localStorage.getItem("gastos"));
  }
  return gastos;
}

function botonSaldo(){
  //if saldo>0 mostrar boton saldo
  /*if(saldo>0){
    document.getElementById("botonSaldo").style.display = "block";
    
  }
  else{*/
    document.getElementById("botonSaldo").style.display = "none";
    document.getElementById("tituloGasto").className = "display-1 text-center mt-5"
  //}
}

function cancelarSaldo() {}
