export function determinarEstado(info){
    let estado,estado1,estado2;

    let porcentajeEfectivo = Math.round(info.saldoEfectivo / info.iniciales[0] * 100);
    let porcentajePreviaje = Math.round(info.saldoPreviaje / info.iniciales[1] * 100);
    let porcentajeTC = Math.round(100-(info.gastoTC / info.limiteTC * 100)); //saldos restantes disponibles

    let porcentajeTotal = (porcentajeEfectivo + porcentajePreviaje + porcentajeTC) / 3;
    let saldoTotal = info.saldoEfectivo + info.saldoPreviaje + info.limiteTC-info.gastoTC + info.saldoAFavor;

    let diasT = getDias(info);
    let dias = diasT[0];

    let diasRestantes = info.diasRestantes;

    let promedio = info.promedio[2];
    let promedioIdeal = saldoTotal / (diasRestantes - dias+1);
    let porcentajePromedio = (promedioIdeal - promedio) / promedioIdeal * 100;

    if(porcentajePromedio < -1){ //-1 porque el promedio es una estimacion y la diferencia es poca
        if(Math.abs(porcentajePromedio)>=4) estado1 = "Malo";
        else estado1 = "Regular";
    }
    else estado1 = "Bueno";

    porcentajePromedio = Math.abs(porcentajePromedio).toFixed(1);

    //ver promedio y saldo total
    //console.log(promedioIdeal,promedio*diasRestantes,0.9*saldoTotal);

    //sacar porcentaje de dias restantes
    let porcentajeDias = Math.round(dias / diasRestantes * 100);
    let porcentajeDispIdeal = 100 - porcentajeDias;
    let diferenciaPorcentual;
    if(porcentajeDispIdeal > porcentajeTotal){
        diferenciaPorcentual = porcentajeTotal / porcentajeDispIdeal * 100;

        if (diferenciaPorcentual <= 40) estado2 = "Malo";
        else estado2 = "Regular";
    }
    else estado2 = "Bueno";

    if(estado1 == "Bueno"){
        if(estado2 == "Bueno") estado = "Bueno";
        else if (estado2 == "Regular") estado = "Regular";
        else estado = "Malo";
    }
    else if (estado1 == "Regular"){
        if(estado2 == "Bueno") estado = "Regular";
        else if (estado2 == "Regular") estado = "Regular";
        else estado = "Malo";
    }
    else if (estado1 == "Malo"){
        if(estado2 == "Bueno") estado = "Regular";
        else if (estado2 == "Regular") estado = "Malo";
        else estado = "Malo";
    }

    info.estado = estado;

    localStorage.setItem('info', JSON.stringify(info));

    return [estado,estado1,estado2,diferenciaPorcentual,diasRestantes,porcentajePromedio,promedioIdeal];
}

export function getDias(info){
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

    return [dias,fechaActual];
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