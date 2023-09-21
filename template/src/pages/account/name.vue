<template>
  <div class="header sticky top-0 left-0 w-full h-24 z-30 bg-white">
    <the-header go-back-button>
      <template v-slot:title>
        {{ t("pages.account.profile.form.name") }}
      </template>
      <template v-slot:actions>
        <div :class="{ 'text-gray-300': form.invalid }" @click="onSubmit">
          {{ t("button.finish") }}
        </div>
      </template>
    </the-header>
  </div>
  <div class="border-t pt-8 bg-white px-6">
    <div class="py-8">
      <div class="color-base text-28 whitespace-nowrap mb-3">
        {{ t("pages.account.profile.form.name") }}
      </div>
      <div class="text-36 whitespace-nowrap">
        <input
          v-model="form.name"
          class="color-black placeholder-gray-300 focus:outline-none w-full"
          :class="{
            'font-medium': form.name !== '',
            'font-light': form.name === '',
          }"
          :placeholder="t('pages.account.profile.form.name.validate')"
        />
      </div>
    </div>
  </div>
  <ProfileFooter />
</template>
<script>
import { computed, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth-store";
import { useI18nService } from "@/services/i18n-service";
import { useAlertService } from "@/services/alert-service";

/** components */
import ProfileFooter from "@/widgets/profile-footer";

export default {
  layout: "layout-empty",
  components: { ProfileFooter },
  setup() {
    const store = useStore();
    const authStore = useAuthStore();
    const router = useRouter();
    const { t } = useI18nService();
    const alertService = useAlertService();

    const form = reactive({
      invalid: computed(() => form.name === ""),
      name: authStore.user.nickname ?? "",
    });

    const onSubmit = async () => {
      if (form.invalid) return false;
      alertService.showLoading();
      const res = await authStore.updateName({ name: form.name });
      if (res.code === 1) {
        alertService.toast(t("feedback.save.success"));
        router.replace("/account/profile");
      } else {
        alertService.toast(t("feedback.save.failed"));
      }
    };

    return {
      t,
      form,
      store,
      onSubmit,
    };
  },
};
</script>
