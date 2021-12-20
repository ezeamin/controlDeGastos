import {
  validarCamposNuevoUsuario,
  validarNumeros,
  campoRequerido,
} from "./validaciones.js";
import { User } from "./user.js";

let campoNombre = document.getElementById("nombre");
let campoSaldoEfectivo = document.getElementById("saldoEfectivo");
let campoSaldoPreviaje = document.getElementById("saldoPreviaje");
let campoLimiteTC = document.getElementById("limiteTC");
let campoDias = document.getElementById("diasRestantes");
let formulario = document.getElementById("nuevoUsuario");

campoNombre.addEventListener("blur", () => {
  campoRequerido(campoNombre);
});
campoSaldoEfectivo.addEventListener("blur", () => {
  campoRequerido(campoSaldoEfectivo);
  validarNumeros(campoSaldoEfectivo);
});
campoSaldoPreviaje.addEventListener("blur", () => {
  campoRequerido(campoSaldoPreviaje);
  validarNumeros(campoSaldoPreviaje);
});
campoLimiteTC.addEventListener("blur", () => {
  campoRequerido(campoLimiteTC);
  validarNumeros(campoLimiteTC);
});
campoDias.addEventListener("blur", () => {
  campoRequerido(campoDias);
  validarNumeros(campoDias);
});

formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  if (validarCamposNuevoUsuario()) {
    guardar();
  }
});

function guardar() {
  let nuevoUsuario = new User(
    capitalizeFirstLetter(campoNombre.value),
    campoSaldoEfectivo.value,
    campoSaldoPreviaje.value,
    campoLimiteTC.value,
    campoDias.value
  );

  guardarLocalStorage(nuevoUsuario);
  location.href = "../index.html";
}

function guardarLocalStorage(nuevoUsuario) {
  localStorage.setItem("info", JSON.stringify(nuevoUsuario));
}

function capitalizeFirstLetter(string) {
  string.toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
}


/*function limpiarFormulario() {
    campoNombre.value = "";
    campoSaldoEfectivo.value = "";
    campoSaldoPreviaje.value = "";
    campoLimiteTC.value = "";
}*/
