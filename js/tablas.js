let gastos = [];
cargarLocalStorage();

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
