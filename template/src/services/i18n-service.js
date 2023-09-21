import { defineService } from "@/_app/_define";
import { createI18n } from "@arshown/vue3-i18n";
import { useAppStore } from "@/store/app-store";
import messages from "@/_app/locales";

export const useI18nService = defineService("i18n-service", () => {
  const i18n = createI18n({
    initLocale: import.meta.env.VITE_LOCALE, //使用語系
    fallbackLocale: import.meta.env.VITE_DEFAULT_LANG, //語系無資料時，備用語系
    messages, //語系資料
  });

  const setLocale = (locale) => {
    const appStore = useAppStore();
    appStore.setLocale(locale);
    i18n.setLocale(locale);
  };

  const scope = (val) => {
    const t = (str, params = {}) => i18n.t(`${val}.${str}`, params);
    return {
      ...i18n,
      scope,
      t,
      setLocale,
    };
  };

  return {
    ...i18n,
    scope,
    setLocale,
    locales: Object.keys(messages),
  };
});
