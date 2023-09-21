<template>
  <div class="border-t">
    <div
      class="bg-white px-8 pt-12 flex-col focus:bg-gray-200"
      :class="{ 'text-red-400': error.new }"
    >
      <div class="color-base text-28 whitespace-nowrap">
        {{ scopeMessages("form.password") }}
      </div>
      <div class="border-b">
        <input
          type="password"
          class="text-24 font-extralight leading-loose m-0 px-0 py-4 block w-full focus:outline-none"
          :placeholder="scopeMessages('form.password.placeholder')"
          v-model="form.new"
        />
        <div v-show="error.new" class="text-20 mb-5">
          {{ scopeMessages("valid.length") }}
        </div>
      </div>
    </div>
    <div
      class="bg-white px-8 pt-8 flex-col focus:bg-gray-200"
      :class="{ 'text-red-400': error.confirm }"
    >
      <div class="color-base text-28 whitespace-nowrap">
        {{ rootMessages("pages.register.confirmPassword") }}
      </div>
      <div class="border-b">
        <input
          type="password"
          class="text-24 font-extralight leading-loose m-0 px-0 py-4 block w-full focus:outline-none"
          :placeholder="scopeMessages('form.password.placeholder')"
          v-model="form.confirm"
        />
        <div v-show="error.confirm" class="text-20 mb-5">
          {{ scopeMessages("valid.not.same") }}
        </div>
      </div>
    </div>
    <div
      class="bg-white px-8 pt-8 flex-col focus:bg-gray-200"
      :class="{ 'text-red-400': error.phone }"
    >
      <div class="color-base text-28 whitespace-nowrap">
        {{ scopeMessages("form.phone") }}
      </div>
      <div class="border-b">
        <input
          type="text"
          class="text-24 font-extralight leading-loose m-0 px-0 py-4 block w-full focus:outline-none"
          :placeholder="
            scopeMessages('form.phone.placeholder', {
              code: tip,
            })
          "
          v-model="form.phone"
        />
        <div v-show="error.phone" class="text-20 mb-5">
          {{ rootMessages("error.code.phone.sms.-5") }}
        </div>
      </div>
    </div>
    <div
      class="bg-white px-8 pt-8 flex-col focus:bg-gray-200"
      :class="{ 'text-red-400': error.captcha }"
    >
      <div class="color-base text-28 whitespace-nowrap">
        {{ scopeMessages("form.captcha") }}
      </div>
      <div class="border-b">
        <div class="flex items-center relative">
          <input
            type="text"
            class="text-24 font-extralight leading-loose m-0 px-0 py-4 block w-3/4 focus:outline-none"
            :placeholder="scopeMessages('form.captcha.placeholder')"
            v-model="form.captcha"
          />
          <div
            class="flex justify-center items-cneter w-1/4 text-white text-24 submit--enabled rounded-sm py-3"
            @click="getCaptcha"
            :class="{
              submit__disabiled: time.btnDisabled || time.status === 'running',
            }"
          >
            {{ scopeMessages("form.captcha.send") }}
            <span v-show="time.status === 'running'">({{ time.seconds }})</span>
          </div>
        </div>
        <div v-show="error.captcha" class="text-20 mb-5">
          {{ scopeMessages("form.captcha.placeholder") }}
        </div>
      </div>
    </div>
    <div class="px-8 py-10 bg-white">
      <div
        class="flex justify-center items-center text-28 text-white rounded-sm py-6"
        :class="{
          'bg-gray-300 bg-opacity-80 bg-none': error.$invalid,
          'submit--enabled': !error.$invalid,
        }"
        @click="onSubmit"
      >
        {{ rootMessages("button.submit") }}
      </div>
    </div>
  </div>
  <div class="question mt-10">
    {{ scopeMessages("notice.line.1") }}
    <router-link to="/service" class="link">
      {{ scopeMessages("notice.line.1.params.0") }}
    </router-link>
  </div>
</template>
<script setup>
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18nService } from "@/services/i18n-service";
import { useAlertService } from "@/services/alert-service";
import { useApiService } from "@/services/api-service";
import { useAuthStore } from "@/store/auth-store";

/** helper */
import { values, includes, omit, pipe } from "ramda";

defineOptions({
  layout: "layout-content",
  title: "pages.login.forgot.password",
});

const { t: rootMessages, scope } = useI18nService();
const { t: scopeMessages } = scope("pages.password");
const alertService = useAlertService();
const apiService = useApiService();
const authStore = useAuthStore();
const router = useRouter();
const tip = import.meta.env.VITE_ENV_CODE;
/**
 * ===============================================================
 * 表單驗證
 * ===============================================================
 */
/** 必填 */
const checkRequired = (val) => val !== "";

/** 格式 */
const checkLength = (string) => {
  switch (true) {
    case string.length < 6:
    case string.length > 12:
      return false;
    default:
      return true;
  }
};

//檢查手機號碼（台灣）
const checkPhone = (string) => {
  const includsSmsCode = ["vonage", "sns"]; //sns要加上國碼
  if (includsSmsCode.includes(import.meta.env.VITE_SMS)) return true;
  const format = /^09\d{8}$/;
  return format.test(string);
};

//檢查確認密碼是否一至
const checkPasswordEquals = (password, confirmed) => {
  return password === confirmed;
};

const error = reactive({
  $invalid: computed(
    () =>
      !error.$dirty ||
      pipe(omit(["$invalid", "$dirty"]), values, includes(true))(error)
  ),
  $dirty: false,
  new: computed(
    () => error.$dirty && (!checkRequired(form.new) || !checkLength(form.new))
  ),
  confirm: computed(
    () =>
      error.$dirty &&
      (!checkRequired(form.confirm) ||
        !checkPasswordEquals(form.new, form.confirm))
  ),
  phone: computed(
    () =>
      error.$dirty && (!checkRequired(form.phone) || !checkPhone(form.phone))
  ),
  captcha: computed(() => error.$dirty && !checkRequired(form.captcha)),
});

const form = reactive({
  captcha: "",
  new: "",
  confirm: "",
  phone: "",
});
const time = reactive({
  btnDisabled: computed(
    () => !checkRequired(form.phone) || !checkPhone(form.phone)
  ),
  seconds: 0,
  status: "pending",
  //
}); //倒數秒數

const getCaptcha = async () => {
  error.$dirty = true;
  if (time.btnDisabled) return;
  if (time.status === "running") return;

  time.seconds = 60;
  time.status = "running";

  const res = await apiService.sendCaptcha({
    type: 1,
    phone: form.phone,
  });

  switch (res.code) {
    case 100003:
    case 100002:
      break;
    case 1:
      alertService.toast(rootMessages("feedback.send.success"));
      break;
    default:
      alertService.toast(
        rootMessages(`error.code.sms.${res.code < 0 ? res.code : -1}`)
      );
      break;
  }
  const startReciprocal = setInterval(() => {
    time.seconds--;
    if (time.seconds === 0) {
      clearInterval(startReciprocal);
      time.status = "pending";
    }
  }, 1000);
};

const onSubmit = async () => {
  error.$dirty = true;
  if (error.$invalid) return;

  alertService.showLoading();
  const res = await authStore.resetPassword(form);
  if (res.code === 1) {
    alertService.alert({
      title: scopeMessages("success.title"),
      text: scopeMessages("success.message"),
      willClose() {
        router.push("/login");
      },
    });
  } else {
    // eslint-disable-next-line require-atomic-updates
    form.new = form.phone = form.captcha = "";

    alertService.alert({
      title: rootMessages("feedback.update.failed"),
      text: rootMessages(`error.code.password.${res.code}`),
    });
  }
};
</script>
<style lang="scss" scoped>
.submit--enabled {
  background-image: linear-gradient(to right, #74aef8, #4a70f1);
}

.submit__disabiled {
  opacity: 0.5;
}

.question {
  font-size: 0.3rem;
  color: #c0c1c5;
  text-align: center;
  .link {
    color: #8ea8d2;
  }
}
</style>
