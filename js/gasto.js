export class Gasto {
    constructor(concepto, categoria, importe, debePlata, fuePrestamo, origen, comentario) {
        this.concepto = concepto;
        this.categoria = categoria;
        this.importe = importe;
        this.fuePrestamo = fuePrestamo;
        this.debePlata = debePlata;
        this.origen = origen;
        this.comentario = comentario;
        this.fecha = this.getDate();
        this.codigo = this.generarCodigo();
    }

    get getConcepto() {
        return this.concepto;
    }

    get getCategoria() {
        return this.categoria;
    }

    get getImporte() {
        return this.importe;
    }

    get getDebePlata() {
        return this.debePlata;
    }

    get getOrigen() {
        return this.origen;
    }

    get getComentario() {
        return this.comentario;
    }

    get getFecha() {
        return this.fecha;
    }

    set setConcepto(concepto) {
        this.concepto = concepto;
    }

    set setCategoria(categoria) {
        this.categoria = categoria;
    }

    set setImporte(importe) {
        this.importe = importe;
    }

    set setDebePlata (debePlata) {
        this.debePlata = debePlata;
    }

    set setOrigen(origen) {
        this.origen = origen;
    }

    set setComentario(comentario) {
        this.comentario = comentario;
    }

    set setFecha(fecha) {
        this.fecha = fecha;
    }

    generarCodigo() {
        let codigo = "";
        let caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let longitud = caracteres.length;
        for (let i = 0; i < 5; i++) {
            codigo += caracteres.charAt(Math.floor(Math.random() * longitud));
        }
        return codigo;
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
    
        let fecha = dd + '/' + mm + '/' + yyyy;
    
        let hour=today.getHours();
        let minute=today.getMinutes();
        let second=today.getSeconds();
    
        if(hour<10) {
            hour = '0' + hour;
        }
    
        if(minute<10) {
            minute = '0' + minute;
        }
    
        if(second<10) {
            second = '0' + second;
        }
    
        fecha += ' - ' + hour + ':' + minute + ':' + second;
    
        return fecha;
    }
}