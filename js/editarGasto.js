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
let formulario = document.getElementById("nuevoGasto");
let invImp = document.getElementById("invalidImporte");

let gasto = traerInfo();

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

  //resetear valores antes del gasto
  if (validarCampos()) {
    let importe = parseFloat(campoImporte.value);
    let info = JSON.parse(localStorage.getItem("info"));

    switch (campoOrigen.value) {
      case "Efectivo": {
        let saldoDisp = parseFloat(info.saldoEfectivo + gasto.importe);

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
        let saldoDisp = parseFloat(info.saldoPreviaje + gasto.importe);

        if (importe > saldoDisp) {
          invImp.innerHTML =
            "El importe no puede ser mayor al fondo disponible";
          campoImporte.className = "form-control is-invalid";
          return;
        }

        break;
      }
    }

    sumarSaldo(info);
    recalcularSaldos(info);

    let debe = "No";
    let fuePrestamo = "No";
    if (campoMeDebePlata.checked) debe = "Si";
    if (campoPrestamo.checked) fuePrestamo = "Si";

    if (debe == "Si") {
      let prestamo = campoPrestamo.checked;
      agregarAFavor(campoImporte.value, prestamo);
    }

    modificarGasto();

    Swal.fire({
      title: "Exito",
      text: "Gasto modificado correctamente",
      icon: "success",
      confirmButtonText: "Joya",
    });
  }
}

function sumarSaldo(info) {
  switch (gasto.origen) {
    case "Efectivo": {
      info.saldoEfectivo += parseFloat(gasto.importe);
      break;
    }
    case "TC": {
      info.gastoTC -= parseFloat(gasto.importe);
      break;
    }
    case "TD": {
      info.gastoTD -= parseFloat(gasto.importe);
      break;
    }
    default: {
      info.saldoPreviaje += parseFloat(gasto.importe);
    }
  }

  if (gasto.meDebePlata == "Si") {
    info.saldoAFavor += parseFloat(gasto.importe) / 2;
  }

  localStorage.setItem("info", JSON.stringify(info));
}

function recalcularSaldos(info) {
  switch (campoOrigen.value) {
    case "Efectivo": {
      info.saldoEfectivo -= parseFloat(campoImporte.value);
      break;
    }
    case "TD": {
      info.gastoTD += parseFloat(campoImporte.value);
      break;
    }
    case "TC": {
      info.gastoTC += parseFloat(campoImporte.value);
      break;
    }
    default: {
      info.saldoPreviaje -= parseFloat(campoImporte.value);
      break;
    }
  }

  localStorage.setItem("info", JSON.stringify(info));
}

function modificarGasto() {
  let id = getId();
  let gastos = cargarLocalStorage();
  let index = gastos.findIndex((gasto) => gasto.codigo == id);

  let comentario;
  if(comentario!="") comentario = campoComentario.value + " (Modificado)";
  else comentario = "(Modificado)";

  gasto.concepto = campoConcepto.value;
  gasto.categoria = campoCategoria.value;
  gasto.importe = parseFloat(campoImporte.value);
  gasto.origen = campoOrigen.value;
  gasto.comentario = campoComentario.value + " (Modificado)";
  gasto.fuePrestamo = campoPrestamo.checked ? "Si" : "No";
  gasto.meDebePlata = campoMeDebePlata.checked ? "Si" : "No";

  gastos[index] = gasto;
  localStorage.setItem("gastos", JSON.stringify(gastos));
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

function getId() {
  let url = new URL(window.location.href);
  let search_params = url.searchParams;

  let id = search_params.get("cod");

  return id;
}

function traerInfo() {
  let id = getId();

  let gastos = cargarLocalStorage();

  let gasto = gastos.find((gasto) => gasto.codigo == id);

  campoConcepto.value = gasto.concepto;
  campoCategoria.value = gasto.categoria;
  campoImporte.value = gasto.importe;
  campoOrigen.value = gasto.origen;
  campoComentario.value = gasto.comentario;
  campoPrestamo.checked = gasto.fuePrestamo == "Si";
  campoMeDebePlata.checked = gasto.meDebePlata == "Si";

  if (gasto.fuePrestamo == "Si") {
    campoMeDebePlata.disabled = true;
  }

  return gasto;
}

function cargarLocalStorage() {
  let gastos = JSON.parse(localStorage.getItem("gastos"));
  /*let info = ;
    
    if(info.gastos.length > 0){
        gastos = info.gastos;
    }*/

  return gastos;
}
