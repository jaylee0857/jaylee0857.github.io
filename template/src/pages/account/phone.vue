<template>
  <div class="header sticky top-0 left-0 w-full h-24 z-30 bg-white">
    <the-header go-back-button>
      <template v-slot:title>
        {{ t("pages.account.profile.form.phone") }}
      </template>
      <template v-slot:actions>
        <div :class="{ 'text-gray-300': form.invalid }" @click="onSubmit">
          {{ t("button.finish") }}
        </div>
      </template>
    </the-header>
  </div>
  <div class="border-t pt-8 bg-white px-6">
    <div class="py-8 border-b">
      <div class="color-base text-28 whitespace-nowrap mb-3">
        {{ t("pages.account.profile.form.phone") }}
      </div>
      <div class="text-36 whitespace-nowrap">
        <input
          v-model="form.phone"
          class="color-black placeholder-gray-300 focus:outline-none w-full"
          :class="{
            'font-medium': form.phone !== '',
            'font-light': form.phone === '',
          }"
          :placeholder="
            t(`pages.account.profile.form.phone.validate`, {
              code: tip,
            })
          "
        />
      </div>
    </div>
    <div class="py-8">
      <div class="color-base text-28 whitespace-nowrap mb-3">
        {{ t("pages.account.profile.form.captcha") }}
      </div>
      <div class="text-36 whitespace-nowrap flex items-center">
        <input
          v-model="form.captcha"
          class="flex-1 color-black placeholder-gray-300 focus:outline-none w-full"
          :class="{
            'font-medium': form.captcha !== '',
            'font-light': form.captcha === '',
          }"
          :placeholder="t('pages.account.profile.form.captcha.validate')"
        />
        <div
          class="flex-shirk-0 flex-grow-0 whitespace-nowrap px-5 py-3 rounded-sm text-28 text-white"
          :class="[form.captchaInvalid && 'bg-gray-300']"
          :style="!form.captchaInvalid && 'background-color: #4a70f1'"
          @click="requestCaptcha"
        >
          {{ t("pages.account.profile.form.captcha.send") }}
          <span v-if="captchaTimer.status === 'start'">
            ({{ captchaTimer.remain }})
          </span>
        </div>
      </div>
    </div>
  </div>
  <ProfileFooter />
</template>
<script>
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { useI18nService } from "@/services/i18n-service";
import { useApiService } from "@/services/api-service";
import { useAuthStore } from "@/store/auth-store";
import { useAlertService } from "@/services/alert-service";

/** components */
import ProfileFooter from "@/widgets/profile-footer";
/** hleper */
import { test, anyPass } from "ramda";

export default {
  layout: "layout-empty",
  components: { ProfileFooter },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const apiService = useApiService();
    const alertService = useAlertService();
    const { t } = useI18nService();
    const tip = import.meta.env.VITE_ENV_CODE;

    const isPhone = (value) => {
      return anyPass([
        test(/^09\d{8}$/),
        // test(/^\+8869\d{8}$/) /*目前不支援這格式*/,
        test(
          /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[235-8]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|66\d{2})\d{6}$/
        ),
      ])(value);
    };
    const includsSmsCode = ["vonage", "sns"]; //sns要加上國碼
    const form = reactive({
      invalid: computed(() => {
        if (
          form.phone === "" ||
          form.captcha === "" ||
          form.phone === (authStore.user.phone ?? "")
        )
          return true;
        if (includsSmsCode.includes(import.meta.env.VITE_SMS)) return false;

        return !isPhone(form.phone);
      }),
      captchaInvalid: computed(() => {
        if (
          form.phone === "" ||
          form.phone === (authStore.user.phone ?? "") ||
          captchaTimer.status === "start"
        )
          return true;
        if (includsSmsCode.includes(import.meta.env.VITE_SMS)) return false;
        return !isPhone(form.phone);
      }),
      phone: authStore.user.phone ?? "",
      captcha: "",
    });

    const captchaTimer = reactive({
      status: "pending",
      value: null,
      remain: 30,
    });

    const requestCaptcha = async () => {
      if (form.captchaInvalid) return false;
      captchaTimer.status = "start";
      await apiService.sendCaptcha({
        phone: form.phone,
      });
      captchaTimer.remain = 30;
      captchaTimer.value = setInterval(() => {
        if (captchaTimer.remain === 0) {
          captchaTimer.status = "pending";
          clearInterval(captchaTimer.value);
          captchaTimer.value = null;
          return;
        }
        captchaTimer.remain -= 1;
      }, 1000);
    };

    const onSubmit = async () => {
      if (form.invalid) return false;

      const res = await authStore.updatePhone({
        phone: form.phone,
        captcha: form.captcha,
      });
      if (res.code === 1) {
        alertService.toast(t("feedback.save.success"));
        router.replace("/account/profile");
      } else {
        alertService.toast(t(`error.code.phone.sms.${res.code}`));
        // eslint-disable-next-line require-atomic-updates
        form.captcha = "";
      }
    };

    return {
      t,
      tip,
      form,
      onSubmit,
      requestCaptcha,
      captchaTimer,
    };
  },
};
</script>
