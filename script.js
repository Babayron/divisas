let divisas = [];
let listaDivisas = [];

async function TraerDivisas() {
  const resultado = await fetch("https://co.dolarapi.com/v1/cotizaciones");
  if (!resultado.ok) {
    throw new Error("Error al traer las divisas");
  }
  const data = await resultado.json();
  return data;
}

async function MostrarDivisas() {
  try {
    const divisas = await TraerDivisas();
    listaDivisas = divisas;
    MostrarDivisasEnTabla(divisas);
    console.log("Divisas obtenidas:", divisas);
  } catch (error) {
    console.error(error.message);
    alert("No se pudieron cargar las divisas. Intenta de nuevo más tarde.")
  }
}

function MostrarDivisasEnTabla(divisas) {
  const tabla = document.getElementById("tabla-divisas");
  tabla.innerHTML = '<option value="">Selecciona una divisa</option>';

  const tablaComparar = document.getElementById("tabla-comparar");
  tablaComparar.innerHTML = '<option value="">Selecciona una divisa</option>';

  divisas.forEach((item, index) => {
    const opcion = document.createElement("option");
    opcion.value = index; // usamos el índice, no el nombre, para poder recuperar el objeto luego
    opcion.textContent = `${item.nombre} (${item.moneda})`;
    tabla.appendChild(opcion);
    tablaComparar.appendChild(opcion.cloneNode(true));
  });
}

function ConvertirDivisas() {
  const indexOrigen = document.getElementById("tabla-divisas").value;
  const indexDestino = document.getElementById("tabla-comparar").value;
  const cantidadInput = document.getElementById("cantidad").value;

  const cantidad = parseFloat(cantidadInput);

  if (indexDestino === "" || indexOrigen === "" || isNaN(cantidad) || cantidad <= 0) {
    alert("Por favor, selecciona ambas divisas y una cantidad válida.");
    return;
  }

  const divisaOrigen = listaDivisas[indexOrigen];
  const divisaDestino = listaDivisas[indexDestino];

  const tasaOrigen = (divisaOrigen.compra + divisaOrigen.venta) / 2;
  const tasaDestino = (divisaDestino.compra + divisaDestino.venta) / 2;

  const cantidadEnPesos = cantidad * tasaOrigen;
  const resultadoFinal = cantidadEnPesos / tasaDestino;
  console.log(`${cantidad} ${divisaOrigen.moneda} equivalen a ${resultadoFinal.toFixed(2)} ${divisaDestino.moneda}`)

  let contenedorResultado = document.getElementById("resultado");
  if (!contenedorResultado) {
    contenedorResultado = document.createElement("div");
    contenedorResultado.id = "resultado";
    document.getElementById("divisas-container").appendChild(contenedorResultado);
  }
  contenedorResultado.textContent = `${cantidad} ${divisaOrigen.moneda} equivalen a ${resultadoFinal.toFixed(2)} ${divisaDestino.moneda}`;
}

const botonConvertir = document.getElementById("convertir");
if (botonConvertir) {
  botonConvertir.addEventListener("click", ConvertirDivisas);
}

MostrarDivisas();