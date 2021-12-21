import { determinarEstado } from './determinarEstado.js';

let txtUser = document.getElementById("user");

let info = JSON.parse(localStorage.getItem("info"));
txtUser.innerHTML = info.nombre;

determinarEstado(info);
