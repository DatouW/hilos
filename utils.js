const axiosInstance = require("./axios");
const { v4: uuidv4 } = require("uuid");

const PORCENTAJE = [0.5, 0.8, 1];

//generar un numero aleatorio entero entre [min, max-1]
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Función para obtener la lista de clientes
const getClientes = async () => {
  try {
    const { data } = await axiosInstance.get("/clientes");
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Función para elegir aleatoriamente un cliente
const elegirClienteAleatorio = (clientes) => {
  const index = getRandomInt(0, clientes.length);
  return clientes[index].idCliente;
};

// Función para obtener las deudas de un cliente
const getDeudas = async (idCliente) => {
  try {
    const { data } = await axiosInstance.get(`/deudas/${idCliente}`);
    return data;
  } catch (error) {
    console.error(`Error al obtener las deudas para ${idCliente}: ${error}`);
    return [];
  }
};

// Función para pagar las deudas de un cliente
const deudasAPagar = (deudas) => {
  const numDeudas = getRandomInt(1, deudas.length);
  let arr = [];
  for (let i = 0; i < numDeudas; i++) {
    const porc = PORCENTAJE[getRandomInt(0, PORCENTAJE.length)];
    arr.push({
      ...deudas[i],
      monto: (deudas[i].monto * porc).toFixed(2),
      codVer: uuidv4(),
    });
  }
  return arr;
};

const pagarDeuda = async (deuda) => {
  try {
    const { data } = await axiosInstance.post("/pagos", {
      deuda,
    });
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const pagarDeudas = async (deudas) => {
  const numDeudas = getRandomInt(1, deudas.length);
  //pagar n deudas
  const arr = [];
  for (let i = 0; i < numDeudas; i++) {
    const porc = PORCENTAJE[getRandomInt(0, PORCENTAJE.length)];
    arr.push({
      ...deudas[i],
      monto: (deudas[i].monto * porc).toFixed(2),
    });
  }
  try {
    const { data } = await axiosInstance.post("/pagos", {
      deudas: arr,
    });
    console.log(data);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getClientes,
  elegirClienteAleatorio,
  getDeudas,
  deudasAPagar,
  pagarDeuda,
};
