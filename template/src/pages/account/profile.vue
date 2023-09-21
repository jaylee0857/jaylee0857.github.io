<template>
  <div class="border-t pt-8 bg-white">
    <div class="bg-white px-6 divide-y">
      <div class="py-8" @click="onAvatarClick">
        <div class="color-base text-28 whitespace-nowrap mb-3">
          {{ t("pages.account.profile.form.avatar") }}
        </div>
        <div class="w-32 h-32 relative">
          <img
            :src="avatar.preview"
            class="w-full h-full overflow-hidden rounded-full"
          />
          <div class="absolute -bottom-1 -right-1">
            <img
              src="@/assets/images/account/icon_edit.webp"
              class="w-12 h-12"
            />
          </div>
        </div>
        <input
          ref="avatarInput"
          type="file"
          accept="image/*"
          @change="onAvatarChange"
          class="text-18 absolute"
          style="z-index: -999; top: -99999px"
        />
        <ProfileCropper
          v-if="!!avatar.path"
          :path="avatar.path"
          @save="onAvatarSave"
          @close="onAvatarClose"
        />
      </div>
      <div class="py-8">
        <div class="color-base text-28 whitespace-nowrap mb-3">
          {{ t("pages.account.profile.form.username") }}
        </div>
        <div class="color-base text-36 whitespace-nowrap">
          {{ user.account }}
        </div>
      </div>
      <router-link to="/account/name" class="bg-white py-8 block w-full">
        <div class="color-base text-28 mb-3">
          {{ t("pages.account.profile.form.name") }}
        </div>
        <div class="flex justify-between items-center">
          <div v-if="user.nickname" class="text-36 color-base">
            {{ user.nickname }}
          </div>
          <div v-else class="text-26 font-light" style="color: #c4c4c6">
            {{ t("pages.account.profile.form.name.placeholder") }}
          </div>
          <img
            class="w-5"
            src="@/assets/images/withdraw/icon_arrow_right.webp"
          />
        </div>
      </router-link>
      <div class="bg-white py-8 block w-full" @click="openGenderSwitcher">
        <div class="color-base text-28 mb-3">
          {{ t("pages.account.profile.form.gender") }}
        </div>
        <div class="flex justify-between items-center">
          <div v-if="user.sex !== null" class="text-36 color-base">
            {{ t(`pages.account.profile.form.gender.${user.sex}`) }}
          </div>
          <div v-else class="text-26 font-light" style="color: #c4c4c6">
            {{ t("pages.account.profile.form.gender.placeholder") }}
          </div>
          <img
            class="w-5"
            src="@/assets/images/withdraw/icon_arrow_right.webp"
          />
        </div>
      </div>
      <div class="bg-white py-8 block w-full" @click="openBirthSwitcher">
        <div class="color-base text-28 mb-3">
          {{ t("pages.account.profile.form.birthday") }}
        </div>
        <div class="flex justify-between items-center">
          <div v-if="user.birthday !== null" class="text-36 color-base">
            {{ user.birthday }}
          </div>
          <div v-else class="text-26 font-light" style="color: #c4c4c6">
            {{ t("pages.account.profile.form.birthday.placeholder") }}
          </div>
          <img
            class="w-5"
            src="@/assets/images/withdraw/icon_arrow_right.webp"
          />
        </div>
      </div>
      <router-link
        class="bg-white py-8 block w-full"
        to="/account/phone"
        @click="(e) => phone && e.preventDefault()"
      >
        <div class="color-base text-28 mb-3">
          {{ t("pages.account.profile.form.phone") }}
        </div>
        <div v-if="phone" class="color-base text-36 whitespace-nowrap">
          {{ phone }}
        </div>
        <div v-else class="text-26 font-light" style="color: #c4c4c6">
          {{ t("pages.account.profile.form.phone.placeholder") }}
        </div>
      </router-link>
    </div>
  </div>

  <ProfileFooter />
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useAuthStore } from "@/store/auth-store";
import { useI18nService } from "@/services/i18n-service";
import { useAlertService } from "@/services/alert-service";
import { usePopupStore } from "@/store/popup-store";

/** assets */
// import avatarDefault from "@/assets/images/account/user_avatar_default.webp";
import avatarDefault from "@/assets/images/account/user_avatar_default.png";

/** components */
import ProfileCropper from "@/widgets/profile-cropper";
import ProfileFooter from "@/widgets/profile-footer";
import BottomPicker from "@/widgets/popup/bottom-sheet/bottom-picker";
import BottomPickerDate from "@/widgets/popup/bottom-sheet/bottom-picker-date";

/** helper */
import { slice } from "ramda";
import { format } from "date-fns";

defineOptions({
  layout: "layout-content",
  title: "app.page.account.profile",
});

const authStore = useAuthStore();
const { t } = useI18nService();
const alertService = useAlertService();
const popupStore = usePopupStore();

const user = computed(() => authStore.user);

/** 圖像 */
const avatarInput = ref();
const avatar = reactive({
  path: null,
  preview: computed(() =>
    user.value.avatar
      ? new URL(user.value.avatar, import.meta.env.VITE_REMOTE_IMAGES).href
      : avatarDefault
  ),
});
const onAvatarClick = () => {
  avatarInput.value.click();
};
const onAvatarChange = (e) => {
  const URL = window.URL || window.webkitURL;
  const file = e.target.files[0];
  if (file) avatar.path = URL.createObjectURL(file);
};
const onAvatarSave = async (data) => {
  alertService.showLoading();
  const result = await fetch(data);
  const blob = await result.arrayBuffer();
  const file = new File([blob], "avatar.jpeg", { type: "images/jpeg" });
  onAvatarClose();
  const res = await authStore.updateAvatar({ file });
  if (res.code === 1) {
    alertService.toast(t("feedback.save.success"));
  } else {
    alertService.toast(t("feedback.save.failed"));
  }
};
const onAvatarClose = () => {
  avatar.path = null;
};

/** 性別 */
const openGenderSwitcher = async () => {
  const { isConfirmed, result } = await popupStore.bottomSheet({
    component: BottomPicker,
    props: {
      options: [
        [
          { value: 0, label: t("pages.account.profile.form.gender.0") },
          { value: 1, label: t("pages.account.profile.form.gender.1") },
        ],
      ],
      value: [user.value.sex ?? 0],
    },
  });

  if (isConfirmed && user.value.sex !== result.value[0]) {
    const res = await authStore.updateGender({
      gender: result.value[0].toString(),
    });
    if (res.code === 1) {
      alertService.toast(t("feedback.save.success"));
    } else {
      alertService.toast(t("feedback.save.failed"));
    }
  }
};

/** 生日 */
const openBirthSwitcher = async () => {
  const { isConfirmed, result } = await popupStore.bottomSheet({
    component: BottomPickerDate,
    props: {
      dateRange: [100], // year, month, day
      value: user.value.birthday ? new Date(user.value.birthday) : new Date(),
    },
  });

  if (isConfirmed) {
    const newBirthday = format(result.value, "yyyy-MM-dd");
    if (user.value.birthday !== newBirthday) {
      const res = await authStore.updateBirthday({
        birth: newBirthday,
      });
      if (res.code === 1) {
        alertService.toast(t("feedback.save.success"));
      } else {
        alertService.toast(t("feedback.save.failed"));
      }
    }
  }
};

/** 手機 */
const phone = computed(() => {
  if (user.value.phone) {
    return (
      slice(0, 3, user.value.phone) +
      "****" +
      slice(7, user.value.phone.length, user.value.phone)
    );
  }
  return null;
});
</script>
