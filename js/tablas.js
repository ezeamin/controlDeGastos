let gastos = [];
cargarLocalStorage();

let campoFiltroCategoria = document.getElementById("filtroCategoria");
let campoFiltroOrigen = document.getElementById("filtroOrigen");
let campoFiltroPago = document.getElementById("filtroPago");

campoFiltroCategoria.addEventListener("change", () => {
  filtrarTabla(
    campoFiltroCategoria.value,
    campoFiltroOrigen.value,
    campoFiltroPago.value
  );
});
campoFiltroOrigen.addEventListener("change", () => {
  filtrarTabla(
    campoFiltroCategoria.value,
    campoFiltroOrigen.value,
    campoFiltroPago.value
  );
});
campoFiltroPago.addEventListener("change", () => {
  filtrarTabla(
    campoFiltroCategoria.value,
    campoFiltroOrigen.value,
    campoFiltroPago.value
  );
});

function filtrarTabla(categoria, origen, pago) {
  let listaFiltrada = gastos;
  console.log(categoria, origen, pago);

  if (categoria == 0 && origen == 0 && pago == 0){
    limpiarTabla();
    listaFiltrada.forEach((itemGasto) => {
      crearFila(itemGasto);
    });
    return;
  }

  if (categoria != "0" || origen != "0" || pago != "0") {
    let debe = "No";

    if (pago == "Pago unico") debe = "Si";

    if (categoria == "0") {
      if (origen == "0") {
        listaFiltrada = listaFiltrada.filter((gasto) => {
          return gasto.debePlata == debe;
        });
      } else {
        if (pago == "0") {
          listaFiltrada = listaFiltrada.filter((gasto) => {
            return gasto.origen == origen;
          });
        } else {
        listaFiltrada = listaFiltrada.filter((gasto) => {
          return gasto.origen == origen &&
           gasto.debePlata == debe;
        });
      }
    }
    } else {
      if (origen == "0") {
        if (pago == "0") {
          listaFiltrada = listaFiltrada.filter((gasto) => {
            return gasto.categoria == categoria;
          });
        } else {
          listaFiltrada = listaFiltrada.filter((gasto) => {
            return gasto.categoria == categoria &&
            gasto.debePlata == debe;
          });
        }
      } else if (pago == "0") {
        listaFiltrada = listaFiltrada.filter((gasto) => {
          return gasto.categoria == categoria &&
           gasto.origen == origen;
        });
      } else {
        listaFiltrada = listaFiltrada.filter((gasto) => {
          return (
            gasto.categoria == categoria &&
            gasto.origen == origen &&
            gasto.debePlata == debe
          );
        });
      }
    }

    console.log(listaFiltrada);

    limpiarTabla();
    listaFiltrada.forEach((itemGasto) => {
      crearFila(itemGasto);
    });
  }
}

function limpiarTabla() {
  let tabla = document.getElementById("tablaGastos");
  tabla.innerHTML = "";
}

//mostrar fondeo de cuenta

function cargarLocalStorage() {
  if (localStorage.getItem("gastos") != null) {
    gastos = JSON.parse(localStorage.getItem("gastos"));

    gastos.reverse();
    //cargar filas en tabla
    gastos.forEach((itemGasto) => {
      crearFila(itemGasto);
    });
  }
}

function crearFila(gasto) {
  let fila = document.getElementById("tablaGastos");

  let debe = "No";
  if (gasto.debePlata == "Si" || gasto.fuePrestamo == "Si") debe = "Si";

  if (gasto.categoria == "Fondeo") {
    fila.innerHTML += `
            <tr>
            <td id="cat_${gasto.codigo}"> </td>
              <th >${gasto.categoria}</th>
              <td>${gasto.fecha}</td>
              <td>${gasto.concepto}</td>
              <td>${gasto.origen}</td>
              <td>${gasto.comentario}</td>
              <td>${debe}</td>
              <td>$ ${gasto.importe}</td>
              <td> </td>
          </tr>`;
  } else
    fila.innerHTML += `
            <tr>
              <td id="cat_${gasto.codigo}"> </td>
              <th>${gasto.categoria}</th>
              <td>${gasto.fecha}</td>
              <td>${gasto.concepto}</td>
              <td>${gasto.origen}</td>
              <td>${gasto.comentario}</td>
              <td>${debe}</td>
              <td>$ ${gasto.importe}</td>
              <td>
                <button class="btn btn-warning my-1" onclick="prepararEdicionGasto('${gasto.codigo}')">Editar</button>
              </td>
          </tr>`;

  let cat = document.getElementById(`cat_${gasto.codigo}`);
  switch (gasto.categoria) {
    case "Comida": {
      cat.style.backgroundColor = "#fff87f";
      break;
    }
    case "Transporte": {
      cat.style.backgroundColor = "#f86f6f";
      break;
    }
    case "Varios": {
      cat.style.backgroundColor = "#b5c5d7";
      break;
    }
    case "Entretenimiento": {
      cat.style.backgroundColor = "#ff35c2";
      break;
    }
    case "Super": {
      cat.style.backgroundColor = "#4fa8fb";
      break;
    }
    case "Salida nocturna": {
      cat.style.backgroundColor = "#66d7d1";
      break;
    }
    case "Fondeo": {
      cat.style.backgroundColor = "#b5d57b";
      break;
    }
  }
}

function prepararEdicionGasto(codigo) {
  location.href = "editarGasto.html?cod=" + codigo;
}
