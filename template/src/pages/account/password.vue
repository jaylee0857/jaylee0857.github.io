<template>
  <div class="border-t">
    <div class="bg-white px-8 pt-12 flex-col focus:bg-gray-200">
      <div class="color-base text-28 whitespace-nowrap">
        {{ t("pages.password.form.oldpassword") }}
      </div>
      <div class="border-b">
        <input
          type="password"
          class="text-24 font-extralight leading-loose m-0 px-0 py-4 block w-full focus:outline-none"
          :placeholder="t('pages.password.form.oldpassword.placeholder')"
          v-model="form.origin"
        />
      </div>
    </div>
    <div
      class="bg-white px-8 pt-8 flex-col focus:bg-gray-200"
      :class="{ 'text-red-400': invalid.new.$invalid }"
    >
      <div class="color-base text-28 whitespace-nowrap">
        {{ t("pages.password.form.password") }}
      </div>
      <div class="border-b">
        <input
          type="password"
          class="text-24 font-extralight leading-loose m-0 px-0 py-4 block w-full focus:outline-none"
          :placeholder="t('pages.password.form.password.placeholder')"
          v-model="form.new"
        />
        <div v-show="invalid.new.$invalid" class="text-20 mb-5">
          {{ invalid.new.$message }}
        </div>
      </div>
    </div>
    <div
      class="bg-white px-8 pt-8 flex-col focus:bg-gray-200"
      :class="{ 'text-red-400': invalid.confirm.$invalid }"
    >
      <div class="color-base text-28 whitespace-nowrap">
        {{ t("pages.password.form.confirm.password") }}
      </div>
      <div class="border-b">
        <input
          type="password"
          class="text-24 font-extralight leading-loose m-0 px-0 py-4 block w-full focus:outline-none"
          :placeholder="t('pages.password.form.confirm.password.placeholder')"
          v-model="form.confirm"
        />
        <div v-show="invalid.confirm.$invalid" class="text-20 mb-5">
          {{ invalid.confirm.$message }}
        </div>
      </div>
    </div>
    <div class="px-8 py-10 bg-white">
      <div
        class="flex justify-center items-center text-28 text-white rounded-sm py-6"
        :class="{
          'bg-gray-300 bg-opacity-80 bg-none': form.disabled,
          'submit--enabled': !form.disabled,
        }"
        @click="onSubmit"
      >
        {{ t("button.submit") }}
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18nService } from "@/services/i18n-service";
import { useAlertService } from "@/services/alert-service";
import { useAuthStore } from "@/store/auth-store";

export default {
  layout: "layout-content",
  title: "pages.password.change.title",
  setup() {
    const { t } = useI18nService();
    const alertService = useAlertService();
    const authStore = useAuthStore();
    const router = useRouter();

    const invalid = reactive({
      $invalid: computed(
        () => invalid.new.$invalid || invalid.confirm.$invalid
      ),
      new: computed(() => {
        return {
          $invalid:
            form.isValid && (form.new.length < 6 || form.new.length > 12),
          $message: t("pages.password.valid.length"),
        };
      }),
      confirm: computed(() => {
        return {
          $invalid: form.isValid && form.confirm !== form.new,
          $message: t("pages.password.valid.not.same"),
        };
      }),
    });
    const form = reactive({
      disabled: computed(() => {
        return form.origin === "" || form.new === "" || form.confirm === "";
      }),
      isValid: false,
      origin: "",
      new: "",
      confirm: "",
    });

    const onSubmit = async () => {
      form.isValid = true;
      if (invalid.$invalid) return false;
      alertService.showLoading();
      const res = await authStore.updatePassword(form);
      if (res.code === 1) {
        alertService.alert({
          title: t("pages.password.success.title"),
          text: t("pages.password.success.message"),
          async willClose() {
            await authStore.logout();
            router.replace("/login");
          },
        });
      } else {
        alertService.alert({
          title: t("feedback.update.failed"),
          text: t(`error.code.password.change.${res.code}`),
        });
        reset();
      }
    };

    const reset = () => {
      form.origin = form.new = form.confirm = "";
      form.isValid = false;
    };

    return {
      t,
      form,
      invalid,
      onSubmit,
    };
  },
};
</script>
<style lang="scss" scoped>
.submit--enabled {
  background-image: linear-gradient(to right, #74aef8, #4a70f1);
}
</style>
