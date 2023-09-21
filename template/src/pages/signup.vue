<template>
  <div class="">
    <div class="login__header"></div>
    <div class="login__title text-center text-white mt-28 text-30">
      {{ t("pages.register.title") }}
    </div>

    <div class="pt-12 pb-40 px-24">
      <div
        class="login__control login__control--username"
        :class="{ error: error.username }"
      >
        <input
          type="text"
          :placeholder="t('pages.register.username')"
          class="login__control__input"
          v-model="form.username"
        />
      </div>
      <div class="tip" v-if="error.username">
        {{ t("pages.register.placeholder.username") }}
      </div>
      <div
        class="login__control login__control--password"
        :class="{ error: error.password }"
      >
        <input
          type="password"
          :placeholder="t('pages.register.password')"
          class="login__control__input"
          v-model="form.password"
        />
      </div>
      <div class="tip" v-if="error.password">
        {{ t("pages.register.placeholder.password") }}
      </div>
      <div
        class="login__control login__control--password"
        :class="{ error: error.checkPassword }"
      >
        <input
          type="password"
          :placeholder="t('pages.register.confirmPassword')"
          class="login__control__input"
          v-model="form.checkPassword"
        />
      </div>
      <div class="tip" v-if="error.checkPassword">
        {{ t("valid.sameAs", { field: t("pages.register.password") }) }}
      </div>
      <div
        class="login__control login__control--phone"
        :class="{ error: error.phone }"
      >
        <input
          type="text"
          :placeholder="t('pages.register.phone')"
          class="login__control__input"
          v-model="form.phone"
        />
      </div>
      <div class="tip" v-if="error.phone">
        {{
          t("pages.password.form.phone.placeholder", {
            code: tip,
          })
        }}
      </div>
      <div
        class="login__control login__control--captcha captchas"
        :class="{ error: error.captcha }"
      >
        <input
          type="text"
          :placeholder="t('pages.register.captcha')"
          class="login__control__input"
          v-model="form.captcha"
        />
        <div
          class="add"
          :class="{ disabled: time.btnDisabled || time.seconds === 'running' }"
        >
          <div v-if="time.status === 'pending'" @click="getCaptcha" v-text-fit>
            {{ t("pages.register.captcha.send") }}
          </div>
          <span v-if="time.status === 'running'">
            {{ time.seconds }}
          </span>
        </div>
      </div>
      <div class="tip" v-if="error.captcha">
        {{ t("pages.register.placeholder.captcha") }}
      </div>
      <div
        class="login__submit"
        :class="[error.$invalid && 'login__submit--disabled']"
        @click="onSubmit"
      >
        {{ t("pages.register.submit") }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useI18nService } from "@/services/i18n-service";
import { useAlertService } from "@/services/alert-service";

/** workflow */
import { useSignupWorkflow } from "@/workflows/pages/signup-workflow";

/** helper */
import { format } from "date-fns";
import {
  getVersion,
  getModel,
  getPlatform,
  generateUuid,
} from "@/_lib/device-direct";
import { values, includes, omit, pipe } from "ramda";

defineOptions({
  layout: "layout-login",
});

const store = useStore();
const router = useRouter();
const { t } = useI18nService();
const alertService = useAlertService();
const signupWorkflow = useSignupWorkflow();
const tip = import.meta.env.VITE_ENV_CODE;
const form = reactive({
  username: "",
  password: "",
  checkPassword: "",
  phone: "",
  captcha: "",
});
const error = reactive({
  $invalid: computed(
    () =>
      !error.$dirty ||
      pipe(omit(["$invalid", "$dirty"]), values, includes(true))(error)
  ),
  $dirty: false,
  username: computed(
    () =>
      error.$dirty &&
      (!checkRequired(form.username) || !checkFormat(form.username))
  ),
  password: computed(
    () =>
      error.$dirty &&
      (!checkRequired(form.password) || !checkLength(form.password))
  ),
  checkPassword: computed(
    () =>
      error.$dirty &&
      (!checkRequired(form.checkPassword) ||
        !checkPasswordEquals(form.password, form.checkPassword))
  ),
  phone: computed(
    () =>
      error.$dirty && (!checkRequired(form.phone) || !checkPhone(form.phone))
  ),
  captcha: computed(() => error.$dirty && !checkRequired(form.captcha)),
});

/**
 * ===============================================================
 * 表單驗證
 * ===============================================================
 */
/** 必填 */
const checkRequired = (val) => val !== "";

/** 格式 */
const checkFormat = (string) => {
  /** 包含數字及小寫字母且不可任意標點符號 */
  const format = /^(?=.*[a-z])(?=.*\d)(?!.*[A-Z])(?!.*\W).{6,20}$/;
  return format.test(string);
};

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

/**
 * 驗證碼的計時器
 */
let time = reactive({
  btnDisabled: computed(
    () => !checkRequired(form.phone) || !checkPhone(form.phone)
  ),
  seconds: 0,
  status: "pending",
  //
});

/**
 * 取得驗證碼
 */
const getCaptcha = async () => {
  error.$dirty = true;
  if (time.btnDisabled) return;
  if (time.status === "running") return;

  time.seconds = 60;
  time.status = "running";

  const res = await signupWorkflow.sendCaptcha({
    phone: form.phone,
  });
  switch (res.code) {
    case 1:
      alertService.toast(t("feedback.action.success"));
      break;

    default:
      alertService.alert({
        title: t("app.dialog.system.title2"),
        text: t(`error.code.sms.${res.code < 0 ? res.code : -1}`),
      });
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

/**
 * 註冊
 */
const onSubmit = async () => {
  error.$dirty = true;
  if (error.$invalid) return;

  const res = await signupWorkflow.signupFlow({
    /** 註冊表單 */
    account: form.username, //帳號
    password: form.password, //密碼
    passwordConfirmed: form.checkPassword, //確認密碼
    phone: form.phone,
    captcha: form.captcha,
    deviceInfo: JSON.stringify({
      platform: getPlatform(),
      model: getModel(),
      version: getVersion(),
      uuid: generateUuid(),
      channel: "",
    }),

    /** 推廣碼數據表單 */
    date: format(new Date(), "yyyy-MM-dd"),
    domain: store.state.app.recordFrom || "直接註冊",
  });

  switch (res) {
    case "LOGIN_SUCCESS":
      router.push("/home");
      break;

    case "LOGIN_FAILED":
      router.push("/login");
      break;
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/signup.scss";
</style>
