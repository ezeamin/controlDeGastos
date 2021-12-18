let txtSaldoEfectivo = document.getElementById("saldoEfectivo");
let txtSaldoPreviaje = document.getElementById("saldoPreviaje");
let txtSaldoAFavor = document.getElementById("saldoAFavor");

leerLocalStorage();

function checkLocalStorage() {
  if (localStorage.getItem("info") == null) {
    location.href = "pages/newUser.html";
  }
}

function leerLocalStorage() {
  let info = JSON.parse(localStorage.getItem("info"));
  txtSaldoEfectivo.innerHTML += info.saldoEfectivo;
  txtSaldoPreviaje.innerHTML += info.saldoPreviaje;
  txtSaldoAFavor.innerHTML += info.saldoAFavor;

  if (info.estado == "Correcto")
    document.getElementById(
      "estado"
    ).innerHTML = `<i class="fas fa-check-circle text-success"></i>`;
  else if (info.estado == "Advertencia")
    document.getElementById(
      "estado"
    ).innerHTML = `<i class="fas fa-exclamation-circle text-warning"></i>`;
  else
    document.getElementById(
      "estado"
    ).innerHTML = `<i class="fas fa-cross text-danger"></i>`;
}
