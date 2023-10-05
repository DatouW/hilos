const { isMainThread } = require("worker_threads");
const { getClientes } = require("./utils");
const ThreadManager = require("./ThreadManager");

if (isMainThread) {
  // Obtener la lista de clientes
  getClientes()
    .then((clientes) => {
      const manager = new ThreadManager(1, clientes);

      manager.startAllThreads();
    })
    .catch((error) => {
      console.error("Error al obtener la lista de clientes:", error.message);
    });
}
