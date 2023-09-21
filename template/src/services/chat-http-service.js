import { defineService } from "@/_app/_define";
import { useHttpProvider } from "@/providers/http-provider/http-provider";
import request from "@/providers/http-provider/interceptors/request";
import response from "@/providers/http-provider/interceptors/response";
import logger from "@/providers/http-provider/interceptors/logger";

export const useChatHttpService = defineService("chat-http-service", () => {
  const provider = useHttpProvider().new();
  provider.use(request, import.meta.env.DEV ? logger : {}, response);

  return {
    provider,
    http() {
      return { ...this.provider };
    },
    excute(url) {
      this.provider.setbaseURL(url);
    },
  };
});
