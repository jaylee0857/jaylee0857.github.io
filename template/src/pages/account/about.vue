<template>
  <div
    class="bg-white mt-5 px-8 pt-5 overflow-y-auto placeholder"
    style="color: #414655"
  >
    <div class="text-26 whitespace-pre-wrap break-words pb-6 border-b">
      {{ aboutMessages("content", { country: country }) }}
    </div>
    <div
      class="text-32 font-extrabold text-center pt-12 pb-6"
      style="color: #0f1925"
    >
      {{ aboutMessages("policy.title") }}
    </div>
    <div class="text-26 whitespace-pre-wrap break-words">
      {{ aboutMessages("policy.content") }}
    </div>
  </div>
</template>
<script>
import { useI18nService } from "@/services/i18n-service";

export default {
  layout: "layout-content",
  title: "pages.account.link.about",
  setup() {
    const { locale, scope } = useI18nService();
    const { t: aboutMessages } = scope("pages.about");
    const country = { tw: "台灣", vn: "Đài Loan:", en: "Taiwan", ph: "Taiwan" }[
      locale.value
    ];

    return {
      aboutMessages,
      country,
    };
  },
};
</script>
