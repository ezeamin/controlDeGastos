export class User{
    constructor(nombre, saldoEfectivo, saldoPreviaje, limiteTC){
        this.nombre = nombre;
        this.saldoEfectivo = saldoEfectivo;
        this.saldoPreviaje = saldoPreviaje;
        this.limiteTC = limiteTC;
        this.saldoAFavor = 0;
        this.gastoTD = 0;
        this.fecha = this.getDate();
        this.iniciales = [saldoEfectivo, saldoPreviaje];
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

    get getFecha(){
        return this.fecha;
    }

    get getIniciales(){
        return this.iniciales;
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

    set setFecha(fecha){
        this.fecha = fecha;
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