<template>
  <div class="creates reject">
    <div class="lebel">
      {{ t(`pages.bank.field.reject.reason.${bankCard.reject_reason}`) }}
    </div>
  </div>
  <div class="creates name">
    <TextField
      v-model="form.owner"
      :title="t('pages.bank.field.name')"
      :placeholder="t('pages.bank.field.name.placeholder')"
    />
  </div>
  <div class="create__ex">
    {{ t("pages.bank.field.description") }}
  </div>
  <div class="creates">
    <div class="lebel">{{ t("pages.bank.field.bank") }}</div>
    <select v-model="form.bank" id="selectId">
      <option value="" disabled selected>
        {{ t("pages.bank.field.bank.placeholder") }}
      </option>
      <option v-for="item in bankList" :key="item.id" :value="item.id">
        {{ item.name }}
      </option>
    </select>
  </div>
  <div class="creates">
    <TextField
      v-model="form.account"
      :title="t('pages.bank.field.bankid')"
      :placeholder="t('pages.bank.field.bankid.placeholder')"
    />
  </div>

  <div class="creates addfile">
    <div class="lebel">
      <img v-if="form.coverFile" :src="toObjUrl(form.coverFile)" />
      <img
        v-else-if="bankCard.bankbook_cover"
        :src="`data:image/png;base64, ${bankCard.bankbook_cover}`"
      />
      <span v-else>
        {{ t("pages.bank.field.cover") }}
      </span>
    </div>
    <label class="btn">
      {{ t("pages.bank.field.cover.button") }}
      <input
        type="file"
        accept="image/*"
        style="display: none"
        @change="getFile($event, 'cover')"
      />
    </label>
  </div>

  <div class="creates addfile">
    <div class="lebel">
      <img v-if="form.userIdFile" :src="toObjUrl(form.userIdFile)" alt="" />
      <img
        v-else-if="bankCard.user_id_image"
        :src="`data:image/png;base64, ${bankCard.user_id_image}`"
      />
      <span v-else>
        {{ t("pages.bank.field.idcard") }}
      </span>
    </div>
    <label class="btn">
      <input
        type="file"
        accept="image/*"
        style="display: none"
        @change="getFile($event, 'userId')"
      />
      {{ t("pages.bank.field.cover.button") }}
    </label>
  </div>
  <div class="creates addfile">
    <div class="lebel">
      <img v-if="form.selfieFile" :src="toObjUrl(form.selfieFile)" alt="" />
      <img
        v-else-if="bankCard.selfie_image"
        :src="`data:image/png;base64, ${bankCard.selfie_image}`"
      />
      <span v-else>{{ t("pages.bank.field.tackidcard") }}</span>
    </div>
    <label class="btn">
      <input
        type="file"
        accept="image/*"
        style="display: none"
        @change="getFile($event, 'selfie')"
      />
      {{ t("pages.bank.field.cover.button") }}
    </label>
  </div>
  <div class="create__ex bg-w">
    {{ t("pages.bank.field.finalcheck") }}
  </div>
  <div class="footer bg-w create">
    <div class="submit" :class="[form.invalid && 'disabled']" @click="onSubmit">
      {{ t("pages.bank.field.submit") }}
    </div>
  </div>
  <div class="question create pb-10">
    {{ t("pages.bank.add.notice.line.2") }}
    <router-link to="/service" class="link">
      {{ t("pages.bank.add.notice.line.2.params.0") }}
    </router-link>
  </div>
</template>
<script setup>
import { reactive, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

/** stores */
import { usePaymentStore } from "@/store/payment-store";

/** service */
import { useI18nService } from "@/services/i18n-service";

/** workflows */
import { usePopupWorkflow } from "@/workflows/common/popup-workflow";
import { usePaymentWorkflow } from "@/workflows/payment-workflow";

/** components */
import TextField from "@/widgets/text-field.vue";

/** helper */
import { compress, toObjUrl } from "@/_lib/image-direct";

defineOptions({
  layout: "layout-trade",
  title: "pages.bank.cards.update.title",
});

const paymentStore = usePaymentStore();
const paymentWorkflow = usePaymentWorkflow();
const popupWorkflow = usePopupWorkflow();
const { t } = useI18nService();
const router = useRouter();

const { bankList, bankCard } = storeToRefs(paymentStore);
const form = reactive({
  /**
   * @desc
   * vivi 站所有欄位皆必填
   */
  invalid: computed(
    () =>
      form.owner === "" ||
      form.account === "" ||
      (!bankCard.value.bankbook_cover && !form.coverFile) ||
      (!bankCard.value.user_id_image && !form.userIdFile) ||
      (!bankCard.value.selfie_image && !form.selfieFile) ||
      form.bank === ""
  ),
  owner: bankCard.value.bankbook_username, // 存簿持有人
  account: bankCard.value.bankbook_account, // 存簿帳號
  coverFile: null, // 存簿照片
  userIdFile: null, // 證件封面圖片
  selfieFile: null, // 手持證件照
  bank: "", // 所屬銀行
});

const getFile = async (event, type) => {
  let file = null;
  if (event.target.files.length > 0) {
    file = await compress(event.target.files[0]);
  }

  switch (type) {
    case "cover":
      form.coverFile = file;
      break;

    case "userId":
      form.userIdFile = file;
      break;

    case "selfie":
      form.selfieFile = file;
      break;
  }
};

const onSubmit = async () => {
  if (form.invalid) return;

  const loadingStop = popupWorkflow.loadingStart();
  const bankTarget = bankList.value.find((bank) => bank.id === form.bank);
  const res = await paymentWorkflow.updateBankCard({
    id: bankCard.value.id,
    coverFile: form.coverFile,
    userIdFile: form.userIdFile,
    selfieFile: form.selfieFile,
    bankName: bankTarget.name,
    bankNumber: bankTarget.branch,
    owner: form.owner,
    account: form.account,
  });
  loadingStop();

  if (res.code === 1) {
    popupWorkflow.toast(t("pages.bank.add.changeSuccees"));
    router.replace("/bankbook");
  } else {
    popupWorkflow.alert({
      title: t("app.dialog.system.title2"),
      text: t("pages.bank.add.changeFail"),
    });
  }
};

/** lifecycle */
onMounted(() => {
  paymentWorkflow.getBankList().then(() => {
    /** 寫入所屬銀行 */
    form.bank =
      bankList.value.find((bank) => bank.branch === bankCard.value.bank_number)
        ?.id ?? "";
  });
});
</script>
<style lang="scss" scoped>
@import "@/assets/scss/withdraw.scss";
</style>
