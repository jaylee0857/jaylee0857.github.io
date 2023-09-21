import { defineService } from "@/_app/_define";
import { useHttpProvider } from "@/providers/http-provider/http-provider";
import logger from "@/providers/http-provider/interceptors/logger";
import auth from "@/providers/http-provider/interceptors/auth";
import request from "@/providers/http-provider/interceptors/request";
import response from "@/providers/http-provider/interceptors/response";
import validate from "@/providers/http-provider/interceptors/validate";
import redirect from "@/providers/http-provider/interceptors/redirect";

export const useHttpService = defineService("http-service", () => {
  const provider = useHttpProvider().new();

  provider.setbaseURL(import.meta.env.VITE_REMOTE_API);

  /** registers */
  provider.use(
    auth,
    redirect,
    validate,
    request,
    import.meta.env.DEV ? logger : {},
    response
  );

  return provider;
});
