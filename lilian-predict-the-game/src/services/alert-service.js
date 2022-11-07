import { AlertProvider } from "@/providers/alert-provider";

export class AlertService {
  constructor() {
    this.provider = new AlertProvider();
  }

  close() {
    this.provider.close();
  }

  async alertInfo(opts = {}) {
    return this.provider.fire({
      icon: "info",
      showCancelButton: false,
      ...opts,
    });
  }

  async alertSuccess(opts = {}) {
    return this.provider.fire({
      icon: "success",
      showCancelButton: false,
      ...opts,
    });
  }

  async alertWarning(opts = {}) {
    return this.provider.fire({
      icon: "warning",
      showCancelButton: false,
      ...opts,
    });
  }

  async alertError(opts = {}) {
    return this.provider.fire({
      icon: "error",
      showCancelButton: false,
      ...opts,
    });
  }

  async confirmInfo(opts = {}) {
    return this.provider.fire({
      icon: "info",
      showCancelButton: true,
      ...opts,
    });
  }

  async confirmSuccess(opts = {}) {
    return this.provider.fire({
      icon: "success",
      showCancelButton: true,
      ...opts,
    });
  }

  async confirmWarning(opts = {}) {
    return this.provider.fire({
      icon: "warning",
      showCancelButton: true,
      ...opts,
    });
  }

  async confirmError(opts = {}) {
    return this.provider.fire({
      icon: "error",
      showCancelButton: true,
      ...opts,
    });
  }

  async confirmQuestionGreen(opts = {}) {
    return this.provider.fire({
      icon: "question",
      iconColor: "#0e9f6e",
      showCancelButton: true,
      ...opts,
    });
  }

  async confirmQuestionRed(opts = {}) {
    return this.provider.fire({
      icon: "question",
      iconColor: "#e02525",
      showCancelButton: true,
      ...opts,
    });
  }

  async toastInfo(opts = {}) {
    return this.provider.fire({
      icon: "info",
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      ...opts,
    });
  }

  async toastSuccess(opts = {}) {
    return this.provider.fire({
      icon: "success",
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      ...opts,
    });
  }

  async toastError(opts = {}) {
    return this.provider.fire({
      icon: "error",
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      ...opts,
    });
  }
}

export default new AlertService();
