import { createI18n } from "@arshown/vue3-i18n";
import messages from "@/_app/locales";

const i18n = createI18n({
  initLocale: import.meta.env.VITE_LOCALE_INIT,
  fallbackLocale: import.meta.env.VITE_LOCALE_FALLBACK,
  messages,
});

export default i18n;
