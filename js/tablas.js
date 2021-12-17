let gastos = [];
cargarLocalStorage();

//mostrar fondeo de cuenta

function cargarLocalStorage() {
  if (localStorage.getItem("gastos") != null) {
    gastos = JSON.parse(localStorage.getItem("gastos"));

    //cargar filas en tabla
    gastos.forEach((itemGasto) => {
      crearFila(itemGasto);
    });
  }
}

function crearFila(gasto) {
  let fila = document.getElementById("tablaGastos");

  if (gasto.deboPlata == "Si") {
    fila.innerHTML += `
            <tr>
              <th>${gasto.categoria}</th>
              <td>${gasto.fecha}</td>
              <td>${gasto.concepto}</td>
              <td>${gasto.origen}</td>
              <td>${gasto.comentario}</td>
              <td>$ ${gasto.importe}</td>
              <td>${gasto.debePlata}</td>
              <td>${gasto.deboPlata}</td>
              <td>
                <button class="btn btn-warning my-1" onclick="prepararEdicionGasto('${gasto.codigo}')">Editar</button>
                <button class="btn btn-danger my-1" onclick="cancelarDeuda('${gasto.codigo}')">Cancelar deuda</button>
              </td>
          </tr>`;
  }

  else{
    fila.innerHTML += `
    <tr>
        <th>${gasto.categoria}</th>
        <td>${gasto.fecha}</td>
        <td>${gasto.concepto}</td>
        <td>${gasto.origen}</td>
        <td>${gasto.comentario}</td>
        <td>$ ${gasto.importe}</td>
        <td>${gasto.debePlata}</td>
        <td>${gasto.deboPlata}</td>
        <td>
          <button class="btn btn-warning my-1" onclick="prepararEdicionGasto('${gasto.codigo}')">Editar</button>
        </td>
    </tr>`;
  }
}
