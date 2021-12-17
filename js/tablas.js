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

  fila.innerHTML += `
            <tr>
              <th>${gasto.categoria}</th>
              <td>${gasto.fecha}</td>
              <td>${gasto.concepto}</td>
              <td>${gasto.origen}</td>
              <td>${gasto.comentario}</td>
              <td>${gasto.debePlata}</td>
              <td>$ ${gasto.importe}</td>
              <td>
                <button class="btn btn-warning my-1" onclick="prepararEdicionGasto('${gasto.codigo}')">Editar</button>
              </td>
          </tr>`;
}
