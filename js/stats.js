import { determinarEstado, getDias } from "./determinarEstado.js";

let info = JSON.parse(localStorage.getItem("info"));

let total = gastosTotales();
gastoPromedio(total);
estado();
compararFondos();

function estado() {
  let estadoGral = determinarEstado(info);
  let estado = estadoGral[0];
  let estado1 = estadoGral[1];
  let estado2 = estadoGral[2];
  let dif = (100 - estadoGral[3]).toFixed(1);
  let dias = estadoGral[4] - 1;
  let porcentajePromedio = estadoGral[5];
  let promedioIdeal = estadoGral[6];

  let razon = "";
  console.log(estadoGral);
  if (estado1 == "Regular") {
    if (estado2 == "Bueno")
      razon =
        "El promedio por dia indica que no alcanzará con los dias restantes (" +
        dias +
        " dias, debe bajarlo un " +
        porcentajePromedio +
        '% hasta <span class="fw-bold">$' +
        promedioIdeal +
        "</span>).";
    else
      razon =
        "El promedio por dia indica que no alcanzará con los dias restantes (" +
        dias +
        " dias, debe bajarlo un " +
        porcentajePromedio +
        '% hasta <span class="fw-bold">$' +
        promedioIdeal +
        "</span>), y sus gastos superan el ideal a la fecha de sus fondos disponibles (diferencia del ideal: " +
        dif +
        " %)";
  } else if (estado1 == "Malo") {
    if (estado2 == "Bueno")
      razon =
        "El promedio por dia indica que no alcanzará con los dias restantes (" +
        dias +
        " dias, debe bajarlo un " +
        porcentajePromedio +
        '% hasta <span class="fw-bold">$' +
        promedioIdeal +
        "</span>)";
    else
      razon =
        "El promedio por dia indica que severamente no alcanzará con los dias restantes (" +
        dias +
        " dias, debe bajarlo un " +
        porcentajePromedio +
        '% hasta <span class="fw-bold">$' +
        promedioIdeal +
        "</span>), y sus gastos superan el ideal a la fecha de sus fondos disponibles (diferencia del ideal: " +
        dif +
        " %)";
  } else if (estado1 == "Bueno")
    razon =
      "Sus gastos superan el ideal a la fecha de sus fondos disponibles (diferencia del ideal: " +
      dif +
      " %)";

  if (estado == "Bueno") {
    document.getElementById("estado").innerHTML = "Bueno";
    document.getElementById("colorEstado").innerHTML = `<i class="fas fa-check-circle text-success"></i>`;
    document.getElementById("colorEstado").style.color = "green";
  } else if (estado == "Regular") {
    document.getElementById("estado").innerHTML = "Sobreviviendo";
    document.getElementById("colorEstado").innerHTML = `<i class="fas fa-exclamation-circle text-warning"></i>`;
    document.getElementById("colorEstado").style.color = "orange";
    document.getElementById("razonEstado").innerHTML = razon;
  } else {
    document.getElementById("estado").innerHTML = "A la miseria (Q.E.P.D.)";
    document.getElementById("colorEstado").innerHTML = `<i class="fas fa-cross text-danger"></i>`;
    document.getElementById("colorEstado").style.color = "red";
    document.getElementById("razonEstado").innerHTML = razon;
  }
}

function gastosTotales() {
  let gastos = JSON.parse(localStorage.getItem("gastos")) || [];

  let efectivo = 0;
  let previaje = 0;
  let TC = 0;
  let TD = 0;
  let SPV = false;

  gastos.forEach((gasto) => {
    if (gasto.origen == "Efectivo") efectivo += parseFloat(gasto.importe);
    if (gasto.origen == "Saldo Previaje") {
      if (
        gasto.comentario.indexOf("(SPV de gasto unico)") == -1 ||
        gasto.debePlata == false
      )
        previaje += parseFloat(gasto.importe);
      else {
        previaje += parseFloat(gasto.importe) / 2;
        SPV = true;
      }
    }
    if (gasto.origen == "TC") TC += parseFloat(gasto.importe);
    if (gasto.origen == "TD") TD += parseFloat(gasto.importe);
  });

  document.getElementById("efectivo").innerHTML = "$" + efectivo;
  document.getElementById("previaje").innerHTML = "$" + previaje;
  document.getElementById("TC").innerHTML = "$" + TC;
  document.getElementById("TD").innerHTML = "$" + TD;

  if (SPV) {
    document.getElementById("SPV").style.display = "block";
    document.getElementById("SPV*").style.display = "inline";
  } else {
    document.getElementById("SPV").style.display = "none";
    document.getElementById("SPV*").style.display = "none";
  }

  let total = efectivo + previaje + TC + TD;

  document.getElementById("totalGastos").innerHTML = "$" + total;

  let txtPrimerIngreso = document.getElementById("fechaInicial");
  let fechaInicial = info.fecha.split("/");
  let fechaFinal = new Date(
    fechaInicial[2] + "/" + fechaInicial[1] + "/" + fechaInicial[0]
  );
  fechaFinal.setDate(fechaFinal.getDate() + parseInt(info.diasRestantes));

  fechaFinal =
    fechaFinal.getDate() +
    "/" +
    (fechaFinal.getMonth() + 1) +
    "/" +
    fechaFinal.getFullYear();

  txtPrimerIngreso.innerHTML = info.fecha + " - " + fechaFinal;

  return total;
}

function gastoPromedio(total) {
  let dias = getDias(info);
  //dias[0] = dias transcurridos
  //dias[1] = fecha actual

  let promedio = 0;
  if (dias[0] != 0) promedio = total / dias[0];
  else promedio = total;

  //quitar decimales
  promedio = Math.round(promedio);

  document.getElementById("gastoPromedio").innerHTML = "$" + promedio;

  determinarDiferencia(promedio, dias[1]);

  document.getElementById("diasTranscurridos").innerHTML =
    dias[0] - 1 + " dia(s) transcurrido(s)";

  info.promedio[2] = promedio;
  localStorage.setItem("info", JSON.stringify(info));

  return promedio;
}

//cuando cargar promedio? todos los dias? en que momento?

function determinarDiferencia(promedio, fechaActual) {
  if (fechaActual == info.fecha) return;

  let fecha = info.promedio[0];
  let promViejo = info.promedio[1];

  if (promViejo == 0) promViejo = promedio;
  let porcentaje = Math.abs(((promViejo - promedio) / promViejo) * 100).toFixed(
    1
  );

  document.getElementById("promedioAnterior").innerHTML = "$" + promViejo;
  document.getElementById("barraEstadoPromedio").innerHTML = "<hr class=\"my-2\"/>";
  document.getElementById("barraEstadoPromedio").style.color = "black";

  document.getElementById("colorPromedio").className = "";
  if (promViejo > promedio) {
    document.getElementById("colorPromedio").innerHTML = "▼ ";
    document.getElementById("colorPromedio").style.color = "green";
    document.getElementById("estadoPromedio").innerHTML =
      "Disminuyó $" + (promViejo - promedio) + " pesos (" + porcentaje + "%)";
  } else if (promViejo < promedio) {
    document.getElementById("colorPromedio").innerHTML = "▲ ";
    document.getElementById("colorPromedio").style.color = "red";
    document.getElementById("estadoPromedio").innerHTML =
      "Aumentó $" + (promedio - promViejo) + " pesos (" + porcentaje + "%)";
  } else {
    document.getElementById("colorPromedio").innerHTML = "= ";
    document.getElementById("colorPromedio").className = "fw-bold";
    document.getElementById("colorPromedio").style.color = "orange";
    document.getElementById("estadoPromedio").innerHTML = "No ha variado";
  }

  if (fecha != fechaActual) {
    info.promedio[0] = fechaActual;
    info.promedio[1] = promedio;
    localStorage.setItem("info", JSON.stringify(info));
  }
}

function compararFondos() {
  let porcentajeEfectivo = Math.round(
    (info.saldoEfectivo / info.iniciales[0]) * 100
  );
  let porcentajePreviaje = Math.round(
    (info.saldoPreviaje / info.iniciales[1]) * 100
  );
  let porcentajeTC = Math.round((info.gastoTC / info.limiteTC) * 100);

  document.getElementById("efectivoActual").innerHTML =
    "$" + info.saldoEfectivo;
  document.getElementById("previajeActual").innerHTML =
    "$" + info.saldoPreviaje;
  document.getElementById("efectivoInicial").innerHTML =
    "$" + info.iniciales[0];
  document.getElementById("previajeInicial").innerHTML =
    "$" + info.iniciales[1];
  document.getElementById("TCActual").innerHTML = "$" + info.gastoTC;
  document.getElementById("TCLimite").innerHTML = "$" + info.limiteTC;
  document.getElementById("efectivoPorcentaje").innerHTML =
    "(" + porcentajeEfectivo + "%" + ")";
  document.getElementById("previajePorcentaje").innerHTML =
    "(" + porcentajePreviaje + "%" + ")";
  document.getElementById("TCPorcentaje").innerHTML =
    "(" + porcentajeTC + "%" + ")";

  let barraEfectivo = document.getElementById("efectivoPorcentajeBarra");
  let barraPreviaje = document.getElementById("previajePorcentajeBarra");
  let barraTC = document.getElementById("TCPorcentajeBarra");

  barraEfectivo.style.width = porcentajeEfectivo + "%";
  barraPreviaje.style.width = porcentajePreviaje + "%";
  barraTC.style.width = porcentajeTC + "%";

  if (porcentajeEfectivo <= 20)
    barraEfectivo.className = "progress-bar bg-danger";
  else if (porcentajeEfectivo <= 50)
    barraEfectivo.className = "progress-bar bg-warning";
  else if (porcentajeEfectivo > 50)
    barraEfectivo.className = "progress-bar bg-success";

  if (porcentajePreviaje <= 20)
    barraPreviaje.className = "progress-bar bg-danger";
  else if (porcentajePreviaje <= 50)
    barraPreviaje.className = "progress-bar bg-warning";
  else if (porcentajePreviaje > 50)
    barraPreviaje.className = "progress-bar bg-success";

  if (porcentajeTC < 50) barraTC.className = "progress-bar bg-success";
  else if (porcentajeTC >= 80) barraTC.className = "progress-bar bg-danger";
  else if (porcentajeTC >= 50) barraTC.className = "progress-bar bg-warning";

  let totalDisponible = info.saldoEfectivo + info.saldoPreviaje + info.limiteTC - info.gastoTC;
  let campoTotalDisponible = document.getElementById("totalDisponible");
  campoTotalDisponible.innerHTML = "$" + totalDisponible;

  if(info.saldoAFavor != 0) {
    let campoSaldoAFavor = document.getElementById("saldoAFavor");
    saldoAFavor.className = "textoImporte d-flex align-items-center justify-content-end";
    campoSaldoAFavor.innerHTML = " (+ $" + info.saldoAFavor + " a favor)";
  }
}
