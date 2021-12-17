let txtSaldoEfectivo = document.getElementById("saldoEfectivo");
let txtSaldoPreviaje = document.getElementById("saldoPreviaje");
let txtSaldoAFavor = document.getElementById("saldoAFavor");

leerLocalStorage();

function checkLocalStorage() {
    if (localStorage.getItem("info") == null) {
      location.href = "pages/newUser.html";
    }
}

function leerLocalStorage(){
    let info = JSON.parse(localStorage.getItem("info"));
    txtSaldoEfectivo.innerHTML += info.saldoEfectivo;
    txtSaldoPreviaje.innerHTML += info.saldoPreviaje;
    txtSaldoAFavor.innerHTML += info.saldoAFavor;
}