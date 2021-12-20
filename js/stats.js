import { determinarEstado } from './determinarEstado.js';

let info = JSON.parse(localStorage.getItem('info'));

let total=gastosTotales();
gastoPromedio(total);
estado();
compararFondos();

function estado(){
    let estado = determinarEstado(info);

    if(estado == "Bueno"){
        document.getElementById("estado").innerHTML = "Bueno";
        document.getElementById("colorEstado").innerHTML = "█ ";
        document.getElementById("colorEstado").style.color = "green";
    }
    else if(estado == "Regular"){
        document.getElementById("estado").innerHTML = "Sobreviviendo";
        document.getElementById("colorEstado").innerHTML = "█ ";
        document.getElementById("colorEstado").style.color = "orange";
    }
    else{
        document.getElementById("estado").innerHTML = "En la misma miseria";
        document.getElementById("colorEstado").innerHTML = "█ ";
        document.getElementById("colorEstado").style.color = "red";
    }
}

function gastosTotales(){
    let gastos = JSON.parse(localStorage.getItem('gastos')) || [];

    let efectivo=0;
    let previaje=0;
    let TC=0;
    let TD=0;
    let SPV=false;

    gastos.forEach(gasto => {
        if(gasto.origen == 'Efectivo') efectivo += parseFloat(gasto.importe);
        if(gasto.origen == 'Saldo Previaje') {
            if(gasto.comentario.indexOf("(SPV de gasto unico)") == -1) previaje += parseFloat(gasto.importe);
            else {
                previaje += parseFloat(gasto.importe)/2;
                SPV = true;
            }
        }
        if(gasto.origen == 'TC') TC += parseFloat(gasto.importe);
        if(gasto.origen == 'TD') TD += parseFloat(gasto.importe);
    });

    document.getElementById("efectivo").innerHTML = "$"+efectivo;
    document.getElementById("previaje").innerHTML = "$"+previaje;
    document.getElementById("TC").innerHTML = "$"+TC;
    document.getElementById("TD").innerHTML = "$"+TD;

    if(SPV){
        document.getElementById("SPV").style.display = "block";
        document.getElementById("SPV*").style.display = "inline";
    }
    else{
        document.getElementById("SPV").style.display = "none";
        document.getElementById("SPV*").style.display = "none";
    }

    let total = efectivo + previaje + TC + TD;

    document.getElementById("totalGastos").innerHTML = "$"+total;

    let txtPrimerIngreso = document.getElementById("fechaInicial");
    txtPrimerIngreso.innerHTML = info.fecha;

    return total;
}

function gastoPromedio(total){
    let fechaInicial = info.fecha;
    let fechaActual = getDate();
    let dias = 0;

    //contar dias entre fechas
    let fechaInicialArray = fechaInicial.split("/");
    let fechaActualArray = fechaActual.split("/");

    let fechaI = new Date(fechaInicialArray[2], fechaInicialArray[1] - 1, fechaInicialArray[0]);
    let fechaA = new Date(fechaActualArray[2], fechaActualArray[1] - 1, fechaActualArray[0]);

    dias = (fechaA.getTime() - fechaI.getTime()) / (1000 * 3600 * 24);
    dias++;

    let promedio = 0;
    if(dias != 0) promedio = total / dias;
    else promedio = total;

    //quitar decimales
    promedio = Math.round(promedio);

    document.getElementById("gastoPromedio").innerHTML = "$"+promedio;

    determinarDiferencia(promedio, fechaActual);

    document.getElementById("diasTranscurridos").innerHTML = dias-1 + " dia(s) transcurrido(s)";

    info.promedio[2] = promedio;
    localStorage.setItem('info', JSON.stringify(info));
}

//cuando cargar promedio? todos los dias? en que momento?

function determinarDiferencia(promedio, fechaActual){
    if(fechaActual == info.fecha) return;

    let fecha = info.promedio[0];
    let promViejo = info.promedio[1];

    if(promViejo == 0) promViejo = promedio;
    let porcentaje = Math.round((promViejo - promedio) / promViejo * 100);

    if(promViejo > promedio){
        document.getElementById("colorPromedio").innerHTML = "█ ";
        document.getElementById("colorPromedio").style.color = "green";
        document.getElementById("estadoPromedio").innerHTML = "Disminuyó $" + (promViejo - promedio) + " pesos (" + porcentaje + "%)";
    }
    else if(promViejo < promedio){
        document.getElementById("colorPromedio").innerHTML = "█ ";
        document.getElementById("colorPromedio").style.color = "red";
        document.getElementById("estadoPromedio").innerHTML = "Aumentó $" + (promedio - promViejo) + " pesos (" + porcentaje + "%)";
    }
    else{
        document.getElementById("colorPromedio").innerHTML = "█ ";
        document.getElementById("colorPromedio").style.color = "orange";
        document.getElementById("estadoPromedio").innerHTML = "No ha variado";
    }

    if (fecha != fechaActual){
        info.promedio[0] = fechaActual;
        info.promedio[1] = promedio;
        localStorage.setItem('info', JSON.stringify(info));
    }
}

function getDate(){
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0' + dd;
    } 

    if(mm<10) {
        mm = '0' + mm;
    } 

    let fecha = dd + '/' + mm + '/' + yyyy;

    return fecha;
}

function compararFondos(){
    let porcentajeEfectivo = Math.round(info.saldoEfectivo / info.iniciales[0] * 100);
    let porcentajePreviaje = Math.round(info.saldoPreviaje / info.iniciales[1] * 100);
    let porcentajeTC = Math.round(info.gastoTC / info.limiteTC * 100);

    document.getElementById("efectivoActual").innerHTML = "$"+info.saldoEfectivo;
    document.getElementById("previajeActual").innerHTML = "$"+info.saldoPreviaje;
    document.getElementById("efectivoInicial").innerHTML = "$"+info.iniciales[0];
    document.getElementById("previajeInicial").innerHTML = "$"+info.iniciales[1];
    document.getElementById("TCActual").innerHTML = "$"+info.gastoTC;
    document.getElementById("TCLimite").innerHTML = "$"+info.limiteTC;
    document.getElementById("efectivoPorcentaje").innerHTML = "("+ porcentajeEfectivo + "%"+")";
    document.getElementById("previajePorcentaje").innerHTML = "("+ porcentajePreviaje + "%"+")";
    document.getElementById("TCPorcentaje").innerHTML = "("+ porcentajeTC + "%"+")";

    let barraEfectivo = document.getElementById("efectivoPorcentajeBarra");
    let barraPreviaje = document.getElementById("previajePorcentajeBarra");
    let barraTC = document.getElementById("TCPorcentajeBarra");

    barraEfectivo.style.width = porcentajeEfectivo + "%";
    barraPreviaje.style.width = porcentajePreviaje + "%";
    barraTC.style.width = porcentajeTC + "%";

    if(porcentajeEfectivo <= 20) barraEfectivo.className = "progress-bar bg-danger";
    else if(porcentajeEfectivo <= 50) barraEfectivo.className = "progress-bar bg-warning";
    else if(porcentajeEfectivo > 50) barraEfectivo.className = "progress-bar bg-success";

    if(porcentajePreviaje <= 20) barraPreviaje.className = "progress-bar bg-danger";
    else if(porcentajePreviaje <= 50) barraPreviaje.className = "progress-bar bg-warning";
    else if(porcentajePreviaje > 50) barraPreviaje.className = "progress-bar bg-success";

    if(porcentajeTC < 50) barraTC.className = "progress-bar bg-success";
    else if(porcentajeTC >= 80) barraTC.className = "progress-bar bg-danger";
    else if(porcentajeTC >= 50) barraTC.className = "progress-bar bg-warning";
}
