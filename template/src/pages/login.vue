<template>
  <div class="login">
    <div class="login__header" :class="[env]"></div>
    <div class="login__title text-center text-white mt-28 text-30">
      {{ t("pages.login.title") }}
    </div>
    <div class="pt-12 pb-40 px-24">
      <div class="login__control login__control--username mb-8">
        <input
          type="text"
          :placeholder="t('pages.login.username')"
          class="login__control__input"
          v-model="form.username"
          list="account-list"
          @change="autofillin"
        />
      </div>
      <div class="login__control login__control--password mb-8">
        <input
          type="password"
          :placeholder="t('pages.login.password')"
          class="login__control__input"
          v-model="form.password"
        />
      </div>
      <datalist
        id="account-list"
        v-if="form.username !== form.find?.account && form.username.length > 1"
      >
        <option
          v-for="item in form.autocompleteList"
          :key="item.account"
          :value="item.account"
        >
          {{ item.account }}
        </option>
      </datalist>
      <div class="pb-8 flex justify-between items-center text-28 text-white">
        <div
          class="px-10 flex items-center space-x-4"
          @click="form.isRemember = !form.isRemember"
        >
          <img
            class="w-10 h-10"
            :class="!form.isRemember && 'opacity-50'"
            src="@/assets/images/login/icon_password_confirm.svg"
          />
          <div>{{ t("pages.login.remeber") }}</div>
        </div>
        <router-link to="/forgot" class="px-10 font-sans">
          {{ t("pages.login.forgot.password") }}?
        </router-link>
      </div>
      <div
        class="login__submit"
        :class="[form.invalid && 'login__submit--disabled']"
        @click="onSubmit"
      >
        {{ t("pages.login.submit") }}
      </div>
    </div>
    <div
      class="text-32 text-white divide-x divide-gray-50 text-center flex justify-center"
    >
      <router-link to="/home" class="px-20">
        {{ t("pages.login.lookAround") }}
      </router-link>
      <router-link to="/signup" class="px-20">
        {{ t("pages.login.register") }}
      </router-link>
    </div>
  </div>
</template>
<script>
import { reactive, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

/** stores */
import { useAppStore } from "@/store/app-store";
import { useAuthStore } from "@/store/auth-store";

/** services */
import { useAlertService } from "@/services/alert-service";
import { useI18nService } from "@/services/i18n-service";

/** workflows */
import { useAuthWorkflow } from "@/workflows/auth-workflow";

export default {
  layout: "layout-login",
  setup() {
    const router = useRouter();
    const store = useStore();
    const appStore = useAppStore();
    const authStore = useAuthStore();
    const alertService = useAlertService();
    const { t } = useI18nService();
    const authWorkflow = useAuthWorkflow();

    const env = computed(() => store.state.app.env);
    const form = reactive({
      invalid: computed(() => form.username === "" || form.password === ""),
      username: "",
      password: "",
      autocompleteList: appStore.passwordList,
      isRemember: true,
      find: {},
    });

    const onSubmit = async () => {
      if (form.invalid) return false;

      alertService.showLoading();

      const onFailed = () => {
        alertService.alert({
          title: t("app.dialog.system.title2"),
          text: t("error.code.login.-1"),
        });
        form.password = "";
      };

      const response = await authStore.login({
        account: form.username,
        password: form.password,
      });
      if (response.code === 1) {
        /** 記住帳號 */
        if (form.isRemember) {
          appStore.savePassport({
            account: form.username,
            password: form.password,
          });
        }
        /**
         * 登入成功拿會員資料
         * 會員資料拿成功才算登入成功，否則算登入失敗
         */
        const response = await authWorkflow.getUser();
        if (response.code === 1) {
          alertService.close();
          router.push({ path: "/home" });
        } else {
          /** 拿資料失敗就跟後端做登出 */
          authStore.logout();
          onFailed();
        }
      } else {
        onFailed();
      }
    };

    /* 自動填入 */
    const autofillin = () => {
      // 找尋儲存的陣列中是否有該帳號
      const find = form.autocompleteList.find(
        (item) => item.account === form.username
      );
      // 無則不做任何動作 有則自動填入密碼
      if (!find) return;
      form.find = { ...find };
      form.password = find.password;
    };

    return {
      t,
      env,
      form,
      onSubmit,
      autofillin,
    };
  },
};
</script>
