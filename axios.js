const axios = require("axios");

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 5000, // Establece el tiempo máximo de espera en milisegundos (5 segundos en este caso)
  retry: 3, // Número de reintentos automáticos en caso de fallo
  retryDelay: 1000, // Tiempo de espera entre reintentos en milisegundos (1 segundo en este caso)
});

const retryRequest = async (config) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(axiosInstance(config));
    }, config.retryDelay);
  });
};

// Interceptores
axiosInstance.interceptors.response.use(
  (res) => {
    return Promise.resolve(res);
  },
  (error) => {
    const { config } = error;
    if (config.retry > 0) {
      config.retry = config.retry - 1;

      // la solicitud ha excedido el tiempo de espera
      if (error.code === "ECONNABORTED") {
        console.log("Request timeout. Retrying...", config.data);

        // Realizar otra solicitud para verificar
        if (config.url === "/pagos") {
          return retryRequest({
            ...config,
            url: "/pagos/confirm",
          });
        } else {
          return retryRequest(config);
        }
      } else {
        console.log("Retrying...", config);
        return retryRequest(config);
      }
    }
  }
);

module.exports = axiosInstance;
