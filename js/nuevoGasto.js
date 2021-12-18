import { campoRequerido } from "./validaciones.js";
import { validarCampos } from "./validaciones.js";
import { validarNumeros } from "./validaciones.js";
import { campoRequeridoSelect } from "./validaciones.js";
import { Gasto } from "./gasto.js";

let campoConcepto = document.getElementById("concepto");
let campoCategoria = document.getElementById("categoria");
let campoImporte = document.getElementById("importe");
let campoMeDebePlata = document.getElementById("meDebePlata");
let campoPrestamo = document.getElementById("fuePrestamo");
let campoOrigen = document.getElementById("origen");
let campoComentario = document.getElementById("comentario");
let campoSaldo = document.getElementById("saldoACancelar");
let formulario = document.getElementById("nuevoGasto");
let formularioSaldo = document.getElementById("formularioSaldo");

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
campoPrestamo.addEventListener("click", () => {
  campoMeDebePlata.checked = false;
  campoMeDebePlata.disabled = !campoMeDebePlata.disabled;
});
formulario.addEventListener("submit", guardarGasto);

function guardarGasto(e) {
  e.preventDefault();

  if (validarCampos()) {
    crearGasto();
  }
}

function crearGasto() {
  let debe = "No";
  if (campoMeDebePlata.checked || campoPrestamo.checked) debe = "Si";

  let fechaActual = new Date();
  let dia = fechaActual.getDate();
  let mes = fechaActual.getMonth() + 1;
  let anio = fechaActual.getFullYear();

  if (dia < 10) {
    dia = "0" + dia;
  }

  if (mes < 10) {
    mes = "0" + mes;
  }

  let fecha = dia + "/" + mes + "/" + anio;

  let hora = fechaActual.getHours();
  let minutos = fechaActual.getMinutes();
  let segundos = fechaActual.getSeconds();

  if (hora < 10) {
    hora = "0" + hora;
  }

  if (minutos < 10) {
    minutos = "0" + minutos;
  }

  if (segundos < 10) {
    segundos = "0" + segundos;
  }

  let horaAct = hora + ":" + minutos + ":" + segundos;

  let tiempo = fecha + " - " + horaAct;

  let gastoNuevo = new Gasto(
    campoConcepto.value,
    campoCategoria.value,
    campoImporte.value,
    debe,
    campoOrigen.value,
    campoComentario.value,
    tiempo
  );

  descontarDinero(campoOrigen.value, campoImporte.value);
  if (debe == "Si") {
    let prestamo = campoPrestamo.checked;
    agregarAFavor(campoImporte.value,prestamo);
  }

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
  campoMeDebePlata.checked = false;
  campoPrestamo.checked = false;
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

function descontarDinero(origen, importe) {
  let info = JSON.parse(localStorage.getItem("info"));

  if (origen == "Efectivo") {
    let saldoEfectivo = info.saldoEfectivo;

    saldoEfectivo = parseFloat(saldoEfectivo) - parseFloat(importe);
    info.saldoEfectivo = saldoEfectivo;
  } else if (origen == "TC") {
    let limiteTC = info.limiteTC;

    limiteTC = parseFloat(limiteTC) - parseFloat(importe);
    info.limiteTC = limiteTC;
  } else if (origen == "TD") {
    let gastoTD = info.gastoTD;

    gastoTD = parseFloat(gastoTD) + parseFloat(importe);
    info.gastoTD = gastoTD;
  } else {
    let saldoPreviaje = info.saldoPreviaje;

    saldoPreviaje = parseFloat(saldoPreviaje) - parseFloat(importe);
    info.saldoPreviaje = saldoPreviaje;
  }

  localStorage.setItem("info", JSON.stringify(info));
}

function agregarAFavor(importe,prestamo) {
  let info = JSON.parse(localStorage.getItem("info"));
  let saldoAFavor = info.saldoAFavor;

  if(!prestamo) saldoAFavor = parseFloat(saldoAFavor) + (parseFloat(importe) / 2);
  else saldoAFavor = parseFloat(saldoAFavor) + parseFloat(importe);

  info.saldoAFavor = saldoAFavor;

  localStorage.setItem("info", JSON.stringify(info));
}

function botonSaldo() {
  let info = JSON.parse(localStorage.getItem("info"));
  if (info.saldoAFavor > 0) {
    document.getElementById("botonSaldo").style.display = "block";
    document.getElementById("tituloGasto").className = "display-1 text-center mt-2";

    document.getElementById("saldoAFavor").innerHTML = info.saldoAFavor;
  }
  else{
    document.getElementById("botonSaldo").style.display = "none";
  }
}

formularioSaldo.addEventListener("submit", cancelarSaldo);
campoSaldo.addEventListener("blur", () => {
  let inv = document.getElementById("invalidSaldo");
  inv.innerHTML = "Ingrese un valor valido";
  campoRequerido(campoSaldo);
});

function cancelarSaldo(e) {
  e.preventDefault();

  let inv = document.getElementById("invalidSaldo");
  inv.innerHTML = "Ingrese un valor valido";

  if(campoRequerido(campoSaldo)){
    let saldo = parseFloat(campoSaldo.value);
    let info = JSON.parse(localStorage.getItem("info"));
    let saldoAFavor = parseFloat(info.saldoAFavor);

    if(saldo>saldoAFavor){
      inv.innerHTML = "El saldo no puede ser mayor al saldo a favor";
      campoSaldo.className="form-control is-invalid";
      return;
    }

    info.saldoAFavor -= saldo;
    localStorage.setItem("info", JSON.stringify(info));
    Swal.fire({
      title: "Exito",
      text: "Saldo cancelado correctamente",
      icon: "success",
      confirmButtonText: "Joya",
    });
    document.getElementById("saldoAFavor").innerHTML = info.saldoAFavor;
  }
}
