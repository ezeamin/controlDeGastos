export class User{
    constructor(nombre, saldoEfectivo, saldoPreviaje, limiteTC,dias){
        this.nombre = nombre;
        this.saldoEfectivo = parseFloat(saldoEfectivo);
        this.saldoPreviaje = parseFloat(saldoPreviaje);
        this.limiteTC = parseFloat(limiteTC);
        this.saldoAFavor = 0;
        this.gastoTD = 0;
        this.gastoTC = 0;
        this.fecha = this.getDate();
        this.iniciales = [parseFloat(saldoEfectivo), parseFloat(saldoPreviaje)];
        this.promedio = [this.fecha,0,0];
        this.estado = "Bueno";
        this.diasRestantes = parseFloat(dias);
    }

    get getNombre(){
        return this.nombre;
    }

    get getSaldoEfectivo(){
        return this.saldoEfectivo;
    }

    get getSaldoPreviaje(){
        return this.saldoPreviaje;
    }

    get getLimiteTC(){
        return this.limiteTC;
    }

    get getSaldoAFavor(){
        return this.saldoAFavor;
    }

    get getGastoTD(){
        return this.gastoTD;
    }

    get getGastoTC(){
        return this.gastoTC;
    }

    get getFecha(){
        return this.fecha;
    }

    get getIniciales(){
        return this.iniciales;
    }

    get getPromedio(){
        return this.promedio;
    }

    get getEstado(){
        return this.estado;
    }

    set setNombre(nombre){
        this.nombre = nombre;
    }

    set setSaldoEfectivo(saldoEfectivo){
        this.saldoEfectivo = saldoEfectivo;
    }

    set setSaldoPreviaje(saldoPreviaje){
        this.saldoPreviaje = saldoPreviaje;
    }

    set setLimiteTC(limiteTC){
        this.limiteTC = limiteTC;
    }

    set setSaldoAFavor(saldoAFavor){
        this.saldoAFavor = saldoAFavor;
    }

    set setGastoTD(gastoTD){
        this.gastoTD = gastoTD;
    }

    set setGastoTC(gastoTC){
        this.gastoTC = gastoTC;
    }

    set setFecha(fecha){
        this.fecha = fecha;
    }

    set setIniciales(iniciales){
        this.iniciales = iniciales;
    }

    set setPromedio(promedio){
        this.promedio = promedio;
    }

    set setEstado(estado){
        this.estado = estado;
    }

    getDate(){
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

        today = dd + '/' + mm + '/' + yyyy;
        return today;
    }
}