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
let invImp = document.getElementById("invalidImporte");
document.getElementById("disponible").style.display = "none";
document.getElementById("avisoPreviaje").style.display = "none";

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
  invImp.innerHTML = "El importe es requerido";
  campoRequerido(campoImporte);
  validarNumeros(campoImporte);
});
campoOrigen.addEventListener("change", () => {
  let info = JSON.parse(localStorage.getItem("info"));
  document.getElementById("disponible").style.display = "none";

  let campo = document.getElementById("saldoDisponible");
  let aviso = document.getElementById("avisoPreviaje");
  switch (campoOrigen.value) {
    case "Efectivo": {
      document.getElementById("disponible").style.display = "block";
      campo.innerHTML = info.saldoEfectivo;
      aviso.style.display = "none";
      break;
    }
    case "Saldo Previaje": {
      document.getElementById("disponible").style.display = "block";
      campo.innerHTML = info.saldoPreviaje;

      if (campoMeDebePlata.checked) {
        aviso.style.display = "block";
      } else {
        aviso.style.display = "none";
      }
      break;
    }
    default: {
      aviso.style.display = "none";
    }
  }
});
campoMeDebePlata.addEventListener("click", () => {
  let aviso = document.getElementById("avisoPreviaje");
  
  if (campoOrigen.value == "Saldo Previaje" && campoMeDebePlata.checked) {
    aviso.style.display = "block";
  } else {
    aviso.style.display = "none";
  }
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
  invImp.innerHTML = "El importe es requerido";

  if (validarCampos()) {
    let importe = parseFloat(campoImporte.value);
    let info = JSON.parse(localStorage.getItem("info"));

    switch (campoOrigen.value) {
      case "Efectivo": {
        let saldoDisp = parseFloat(info.saldoEfectivo);

        if (importe > saldoDisp) {
          invImp.innerHTML =
            "El importe no puede ser mayor al fondo disponible";
          campoImporte.className = "form-control is-invalid";
          return;
        }

        break;
      }
      case "TD": {
        break;
      }
      case "TC": {
        break;
      }
      default: {
        let saldoDisp = parseFloat(info.saldoPreviaje);

        if (importe > saldoDisp) {
          invImp.innerHTML =
            "El importe no puede ser mayor al fondo disponible";
          campoImporte.className = "form-control is-invalid";
          return;
        }

        break;
      }
    }

    localStorage.setItem("info", JSON.stringify(info));

    crearGasto();
  }
}

function crearGasto() {
  let debe = "No";
  let fuePrestamo = "No";
  if (campoPrestamo.checked) fuePrestamo = "Si";
  if (campoMeDebePlata.checked) debe = "Si";

  let comentario = campoComentario.value;

  if (campoOrigen.value == "Saldo Previaje" && campoMeDebePlata.checked) {
    debe = "No";
    comentario += " (SPV de gasto unico)";
    comentario.trimStart();
  }

  let gastoNuevo = new Gasto(
    campoConcepto.value,
    campoCategoria.value,
    campoImporte.value,
    debe,
    fuePrestamo,
    campoOrigen.value,
    comentario
  );

  descontarDinero(campoOrigen.value, campoImporte.value);
  if (debe == "Si") {
    let prestamo = campoPrestamo.checked;
    agregarAFavor(campoImporte.value, prestamo);
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

  document.getElementById("disponible").style.display = "none";
  document.getElementById("avisoPreviaje").style.display = "none";
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
    info.saldoEfectivo -= parseFloat(importe);
  } else if (origen == "TC") {
    info.gastoTC += parseFloat(importe);
  } else if (origen == "TD") {
    info.gastoTD += parseFloat(importe);
  } else {
    info.saldoPreviaje -= parseFloat(importe);
  }

  localStorage.setItem("info", JSON.stringify(info));
}

function agregarAFavor(importe, prestamo) {
  let info = JSON.parse(localStorage.getItem("info"));
  let saldoAFavor = info.saldoAFavor;

  if (!prestamo)
    saldoAFavor = parseFloat(saldoAFavor) + parseFloat(importe) / 2;
  else saldoAFavor = parseFloat(saldoAFavor) + parseFloat(importe);

  info.saldoAFavor = saldoAFavor;

  localStorage.setItem("info", JSON.stringify(info));
}

function botonSaldo() {
  let info = JSON.parse(localStorage.getItem("info"));
  if (info.saldoAFavor > 0) {
    document.getElementById("botonSaldo").style.display = "block";
    document.getElementById("tituloGasto").className =
      "display-1 text-center mt-2";

    document.getElementById("saldoAFavor").innerHTML = info.saldoAFavor;
  } else {
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

  if (campoRequerido(campoSaldo)) {
    let saldo = parseFloat(campoSaldo.value);
    let info = JSON.parse(localStorage.getItem("info"));
    let saldoAFavor = parseFloat(info.saldoAFavor);

    if (saldo > saldoAFavor) {
      inv.innerHTML = "El saldo no puede ser mayor al saldo a favor";
      campoSaldo.className = "form-control is-invalid";
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
    campoSaldo.value = "";
    document.getElementById("saldoAFavor").innerHTML = info.saldoAFavor;
  }
}
