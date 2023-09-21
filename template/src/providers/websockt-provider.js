import { defineProvider } from "@/_app/_define";
import { io } from "socket.io-client";

export const useWebsocketProvider = defineProvider(() => {
  class WebSocketProvider {
    constructor() {
      this.io = null;
    }

    connect(url, options = {}) {
      this.io = io(url, options);
    }

    on(event, fn) {
      this.io.on(event, fn);
    }

    emit(channel, data) {
      this.io.emit(channel, data);
    }

    disconnect() {
      this.io.close();
    }

    destroy() {
      this.io.off();
      this.io.close();
      this.io = null;
    }
  }

  return {
    instances: [],
    new() {
      const instance = new WebSocketProvider();
      this.instances.push(instance);
      return instance;
    },
    destoryAll() {
      for (let instance of this.instances) {
        instance.destroy();
      }
      this.instances = [];
    },
  };
});
