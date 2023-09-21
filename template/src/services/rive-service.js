import { defineService } from "@/_app/_define";
import { Rive, RuntimeLoader } from "@rive-app/canvas";

export const useRiveService = defineService("rive-service", () => {
  class RiveSubject {
    constructor(options) {
      const instance = new Rive({
        ...options,
        onLoad: () => {
          this.stages = this.instance
            .stateMachineInputs(options.stateMachines)
            .find((item) => item.name === "stage") ?? {
            value: 0,
          };
          this.action = this.instance
            .stateMachineInputs(options.stateMachines)
            .find((item) => item.name === "btn_click") ?? {
            fire: () => {
              this.setStage(this.stages.value + 1);
            },
          };
          options.onLoad?.();
        },
      });
      this.ctx = {};
      this.options = options;
      this.instance = instance;
    }

    setStage(stage, ctx = {}) {
      this.ctx = {
        ...this.ctx,
        ...ctx,
      };
      this.stages.value = stage;
      this.stageChangeCallback?.(stage, this.ctx);
    }

    fire(ctx = {}) {
      this.action.fire();
      this.setStage(this.stages.value + 1, ctx);
    }

    reset() {
      this.instance.reset({
        stateMachines: this.options.stateMachines,
      });
      this.ctx = {};
      this.setStage(0);
    }

    play() {
      if (!this.instance.isPlaying) this.instance.play();
    }

    onStageChanged(callback) {
      this.stageChangeCallback = callback;
    }

    cleanup() {
      this.instance.cleanup();
    }
  }

  return {
    Rive,
    isSupport: true,
    create(options) {
      return new Promise((resolve, reject) => {
        if (!this.isSupport) {
          reject("this device not support rive");
          return;
        }

        try {
          RuntimeLoader.getInstance(() => {
            const subjuct = new RiveSubject({
              ...options,
              onLoad() {
                /** 確定讀取完再回傳 */
                resolve(subjuct);
                options.onLoad?.();
              },
              onLoadError() {
                reject("Rive source load error");
              },
            });
          });
        } catch (error) {
          //! for debug 不要刪
          console.error("Rive initial error:", error);
          this.isSupport = false;
          reject(error);
        }
      });
    },
  };
});
