export class Gasto {
    constructor(concepto, categoria, importe, debePlata, origen, comentario, fecha) {
        this.concepto = concepto;
        this.categoria = categoria;
        this.importe = importe;
        this.debePlata = debePlata;
        this.origen = origen;
        this.comentario = comentario;
        this.fecha = fecha;
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
}