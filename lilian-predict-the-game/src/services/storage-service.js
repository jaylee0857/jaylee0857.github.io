import store2 from "store2";

export class StorageService {
  constructor() {
    this.provider = store2;
  }

  destroy() {
    this.provider.clearAll();
  }
}

StorageService.prototype.install = function install(app) {
  const provideName = "storage-service";
  app.config.globalProperties[provideName] = this;
  app.provide(provideName, this);
};

export default new StorageService();
