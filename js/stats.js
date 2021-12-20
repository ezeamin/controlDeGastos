let total=gastosTotales();
gastoPromedio(total);
compararFondos();

function gastosTotales(){
    let info = JSON.parse(localStorage.getItem('info'));

    let gastos = JSON.parse(localStorage.getItem('gastos')) || [];

    let efectivo=0;
    let previaje=0;
    let TC=0;
    let TD=0;

    gastos.forEach(gasto => {
        if(gasto.origen == 'Efectivo') efectivo += parseFloat(gasto.importe);
        if(gasto.origen == 'Saldo Previaje') previaje += parseFloat(gasto.importe);
        if(gasto.origen == 'TC') TC += parseFloat(gasto.importe);
        if(gasto.origen == 'TD') TD += parseFloat(gasto.importe);
    });

    document.getElementById("efectivo").innerHTML = "$"+efectivo;
    document.getElementById("previaje").innerHTML = "$"+previaje;
    document.getElementById("TC").innerHTML = "$"+TC;
    document.getElementById("TD").innerHTML = "$"+TD;

    let total = efectivo + previaje + TC + TD;

    document.getElementById("totalGastos").innerHTML = "$"+total;

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

    let promedio = 0;
    if(dias != 0) promedio = total / dias;
    else promedio = total;

    //quitar decimales
    promedio = Math.round(promedio);

    document.getElementById("gastoPromedio").innerHTML = "$"+promedio;

    determinarDiferencia(promedio, fechaActual);
}

//cuando cargar promedio? todos los dias? en que momento?

function determinarDiferencia(promedio, fechaActual){
    let info = JSON.parse(localStorage.getItem('info'));

    let fecha = info.promedio[0];
    let promViejo = info.promedio[1];

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
    let info = JSON.parse(localStorage.getItem('info'));

    document.getElementById("efectivoActual").innerHTML = "$"+info.saldoEfectivo;
    document.getElementById("previajeActual").innerHTML = "$"+info.saldoPreviaje;
    document.getElementById("efectivoInicial").innerHTML = "$"+info.iniciales[0];
    document.getElementById("previajeInicial").innerHTML = "$"+info.iniciales[1];
    document.getElementById("efectivoPorcentaje").innerHTML = "("+(Math.round(info.saldoEfectivo / info.iniciales[0] * 100)) + "%"+")";
    document.getElementById("previajePorcentaje").innerHTML = "("+(Math.round(info.saldoPreviaje / info.iniciales[1] * 100)) + "%"+")";

}
