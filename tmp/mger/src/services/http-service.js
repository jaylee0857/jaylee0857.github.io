import { HttpProvider } from "@/providers/http-provider/http-provider";
import logger from "@/providers/http-provider/interceptors/logger";

export class HttpService {
  constructor() {
    this.provider = new HttpProvider(import.meta.env.VITE_API_URL);
    this.init();
  }

  init() {
    this.provider.use(import.meta.env.DEV ? logger : {});
  }

  get get() {
    return this.provider.instance.get;
  }

  get post() {
    return this.provider.instance.post;
  }

  get put() {
    return this.provider.instance.put;
  }

  get delete() {
    return this.provider.instance.delete;
  }
}

HttpService.prototype.install = function install(app) {
  const provideName = "http-service";
  app.config.globalProperties[provideName] = this;
  app.provide(provideName, this);
};

export default new HttpService();
