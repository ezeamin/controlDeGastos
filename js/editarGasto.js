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
document.getElementById("disponible").style.display = "none";
document.getElementById("avisoPreviaje").style.display = "none";

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
campoOrigen.addEventListener("change", () => {
  let info = JSON.parse(localStorage.getItem("info"));
  document.getElementById("disponible").style.display = "none";

  mostrarSaldoDisponible(info);
});
campoOrigen.addEventListener("blur", () => {
  campoRequeridoSelect(campoOrigen);
});
campoPrestamo.addEventListener("click", () => {
  campoMeDebePlata.checked = false;
  campoMeDebePlata.disabled = !campoMeDebePlata.disabled;
});
formulario.addEventListener("submit", guardarGasto);

function mostrarSaldoDisponible(info) {
  let campo = document.getElementById("saldoDisponible");
  let aviso = document.getElementById("avisoPreviaje");
  switch (campoOrigen.value) {
    case "Efectivo": {
      document.getElementById("disponible").style.display = "block";
      aviso.style.display = "none";
      campo.innerHTML = info.saldoEfectivo;
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
}

function guardarGasto(e) {
  e.preventDefault();
  invImp.innerHTML = "El importe es requerido";

  //resetear valores antes del gasto
  if (validarCampos()) {
    let importe = parseFloat(campoImporte.value);
    let info = JSON.parse(localStorage.getItem("info"));

    switch (campoOrigen.value) {
      case "Efectivo": {
        let saldoDisp;
        if(gasto.origen != "Efectivo") saldoDisp = parseFloat(info.saldoEfectivo);
        else saldoDisp = parseFloat(info.saldoEfectivo + gasto.importe);

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
        let saldoDisp;
        if(gasto.origen != "Saldo Previaje") saldoDisp = parseFloat(info.saldoPreviaje);
        else saldoDisp = parseFloat(info.saldoPreviaje + gasto.importe);

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

    let comentario = campoComentario.value;

    if (campoOrigen.value == "Saldo Previaje" && campoMeDebePlata.checked) {
      debe = "No";
      comentario += " (SPV de gasto unico)";
    }

    if (debe == "Si" || fuePrestamo == "Si") {
      let prestamo = campoPrestamo.checked;
      agregarAFavor(campoImporte.value, prestamo);
    }

    modificarGasto(comentario);

    Swal.fire({
      title: "Exito",
      text: "Gasto modificado correctamente",
      icon: "success",
      confirmButtonText: "Joya",
    });
    setTimeout(() => {
      window.location.href = "tablas.html";
    }, 2000);
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

  if (gasto.debePlata == "Si" && gasto.origen != "Saldo Previaje") {
    info.saldoAFavor -= parseFloat(gasto.importe) / 2;
  } else if (gasto.fuePrestamo == "Si") {
    info.saldoAFavor -= parseFloat(gasto.importe);
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

function modificarGasto(comentarioOriginal) {
  let id = getId();
  let gastos = cargarLocalStorage();
  let index = gastos.findIndex((gasto) => gasto.codigo == id);

  let comentario;
  if (comentario != "") {
    //eliminar "modificado" del comentario
    comentario = comentarioOriginal;
    let index = comentario.indexOf("(Modificado)");
    if (index != -1) {
      comentario = comentario.substring(0, index);
    }

    comentario += " (Modificado)";
  } else comentario = "(Modificado)";

  gasto.concepto = campoConcepto.value;
  gasto.categoria = campoCategoria.value;
  gasto.importe = parseFloat(campoImporte.value);
  gasto.origen = campoOrigen.value;
  gasto.comentario = comentario;
  gasto.fuePrestamo = campoPrestamo.checked ? "Si" : "No";
  gasto.debePlata = campoMeDebePlata.checked ? "Si" : "No";

  gastos[index] = gasto;
  localStorage.setItem("gastos", JSON.stringify(gastos));
}

function agregarAFavor(importe, prestamo) {
  let info = JSON.parse(localStorage.getItem("info"));
  let saldoAFavor = info.saldoAFavor;

  if (!prestamo) saldoAFavor += parseFloat(importe) / 2;
  else saldoAFavor += parseFloat(importe);

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
  campoPrestamo.checked = gasto.fuePrestamo == "Si";
  campoMeDebePlata.checked = gasto.debePlata == "Si";

  if (gasto.fuePrestamo == "Si") {
    campoMeDebePlata.disabled = true;
  }

  //ver si fue modificado SVP y cargar "debe" para tick
  let comentario = gasto.comentario;
  let index = comentario.indexOf("(SPV de gasto unico)");
  console.log(index);
  if (index != -1) {
    comentario = comentario.substring(0, index);
    console.log(comentario);
    campoComentario.value = comentario;
    campoMeDebePlata.checked = true;
  }

  //eliminar "modificado" del comentario
  let comentario2 = campoComentario.value;
  index = comentario2.indexOf("(Modificado)");
  if (index != -1) {
    comentario2 = comentario2.substring(0, index);
  }
  campoComentario.value = comentario2;

  let info = JSON.parse(localStorage.getItem("info"));
  mostrarSaldoDisponible(info);

  return gasto;
}

function cargarLocalStorage() {
  let gastos = JSON.parse(localStorage.getItem("gastos"));

  return gastos;
}
