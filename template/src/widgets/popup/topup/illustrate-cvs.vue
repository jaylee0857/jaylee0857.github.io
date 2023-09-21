<template>
  <div class="illustrate-paging">
    <div class="illustrate-paging-block illustrate-paging-block--cvs">
      <h1>{{ currentMessages("cvs.title") }}</h1>
      <ul class="illustrate-paging-list">
        <li v-for="item in list" :key="item">
          <div class="illustrate-paging-list-question" @click="onSelect(item)">
            <span>{{ currentMessages(`cvs.${item}`) }}</span>
            <img
              class="arrow-block-bottom"
              :class="{ 'arrow-block-bottom--inverted': opens === item }"
              src="@/assets/images/trade/arror_block.png"
              alt=""
            />
          </div>
          <div class="illustrate-paging-list-answer" v-show="opens === item">
            <div
              class="illustrate-paging-list-answer-item"
              v-for="num in 7"
              :key="`cvs-${num}`"
            >
              <p>{{ currentMessages(`cvs.${item}.${num}`) }}</p>
              <div class="illustrate-paging-list-answer-item-img bg-gray-50">
                <img
                  :src="getImageUrl(`trade/${item}_${num}.png`)"
                  v-image-reload="{
                    height: `${item === 'ibon' && num === 7 ? '7rem' : '5rem'}`,
                  }"
                />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="illustrate-paging-block">
      <h2>
        {{ currentMessages("cvs.question") }}
      </h2>
      <div class="caption">
        {{ currentMessages("cvs.answer") }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18nService } from "@/services/i18n-service";
import { getImageUrl } from "@/tool";
import { ref } from "vue";
const { scope } = useI18nService();
const { t: currentMessages } = scope("pages.deposit.illustrate");
const list = ["ibon", "family", "hilife", "ok"];
const opens = ref("");
const onSelect = (item) => {
  const isSame = opens.value === item;
  isSame ? (opens.value = "") : (opens.value = item);
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/topup.scss";
</style>
