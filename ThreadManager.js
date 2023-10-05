const { Worker } = require("worker_threads");

class ThreadManager {
  constructor(numThreads, cliArr) {
    this.threads = [];
    this.addThread(numThreads, cliArr);
  }

  addThread(numThreads, cliArr) {
    for (let i = 0; i < numThreads; i++) {
      const worker = new Worker("./worker.js", {
        workerData: { cliArr },
      });
      this.threads.push(worker);
      worker.on("message", (msg) => {
        console.log(`Thread ${worker.threadId}: ${msg}`);
      });
    }
  }

  startThread(thread) {
    thread.postMessage("start");
  }

  startAllThreads() {
    this.threads.forEach((thread) => {
      this.startThread(thread);
    });
  }

  terminateThread(thread) {
    thread.terminate();
    this.threads = this.threads.filter((t) => t !== thread);
  }

  terminateAllThreads() {
    for (let thread of this.threads) {
      thread.terminate();
    }
    this.threads = [];
  }
}

module.exports = ThreadManager;
