export function campoRequerido(campo){
    if(campo.value.trim() == ""){
        campo.className="form-control is-invalid";
        return false;
    }
    else{
        campo.className="form-control";
        return true;
    }
}

export function campoRequeridoSelect(campo){
    if(campo.value == "0"){
        campo.className="form-control is-invalid";
        return false;
    }
    else{
        campo.className="form-control";
        return true;
    }
}

export function validarNumeros(input){
    let patron = /^[+]?((\d+(\.\d*)?)|(\.\d+))$/;
    if(!patron.test(input.value)){
        input.className="form-control is-invalid";
        return false;
    }
    else{
        input.className="form-control";
        return true;
    }
}

export function validarCampos(){
    let error = false;
    let campos = document.getElementsByClassName("form-control");
    if(!campoRequerido(campos[0])) error=true;
    if(!campoRequeridoSelect(campos[1])) error=true;
    if(!campoRequerido(campos[2])) error=true;
    if(!campoRequeridoSelect(campos[3])) error=true;

    if(error){
        return false;
    }
    return true;
}

export function validarCamposNuevoUsuario(){
    let error = false;
    let campos = document.getElementsByClassName("form-control");
    if(!campoRequerido(campos[0])) error=true;
    if(!campoRequerido(campos[1]) || !validarNumeros(campos[1])) error=true;
    if(!campoRequerido(campos[2]) || !validarNumeros(campos[2])) error=true;
    if(!campoRequerido(campos[3]) || !validarNumeros(campos[3])) error=true;

    if(error){
        return false;
    }
    return true;
}

export function validarCamposNuevoIngreso(){
    let error = false;
    let campos = document.getElementsByClassName("form-control");
    if(!campoRequerido(campos[0])) error=true;
    if(!campoRequeridoSelect(campos[1])) error=true;

    if(error){
        return false;
    }
    return true;
}