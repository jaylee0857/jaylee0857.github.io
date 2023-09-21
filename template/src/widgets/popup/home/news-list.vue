<template>
  <div class="news-list">
    <div v-for="(item, index) in list" :key="item" @click="showDetailed(index)">
      <div class="news-list-item">
        <div class="news-list-icon"></div>
        <div class="news-list-content">
          <p class="limit news-list-title">
            <span class="news-list-text"> 【{{ item.title }}】 </span>
            <span class="news-list-date">
              {{
                item.created_at.split(" ").shift().split("-").slice(1).join("-")
              }}
            </span>
          </p>
          <p class="limit news-list-main">{{ item.content }}</p>
        </div>
      </div>
      <div class="news-list-check" v-show="activeIdx === index">
        {{ item.content }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
defineProps({ list: Array });
const activeIdx = ref(-1);
const showDetailed = (index) => {
  console.log(index);
  activeIdx.value = activeIdx.value === index ? -1 : index;
};
/* 使用setup語法糖時，將資料給父層使用 */
// defineExpose({
//   activeIdx,
// });
</script>

<style lang="scss" scoped>
.news-list {
  padding: 0.3rem 0;
  height: 50vh;
  line-height: 1.2;
  background: transparent;
  overflow-y: overlay;
  &-item {
    position: relative;
    display: flex;
    align-items: center;
    padding-top: 0.2rem;
    padding-bottom: 0.3rem;
    min-height: 10%;
    background: transparent;
    // border-bottom: 1px solid #c3c3c3;
    word-break: break-all;
  }
  &-icon {
    margin: 0 0.25rem;
    margin-right: 0.1rem;
    width: 0.8rem;
    min-width: 0.8rem;
    height: 0.8rem;
    background-image: url("@/assets/images/icon_message_notification.webp");
    background-size: cover;
    background-repeat: no-repeat;
  }
  &-content {
    flex-grow: 1;
    padding: 0.1rem 0.2rem;
    overflow: hidden;
  }
  &-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: -0.2rem;
    font-size: 0.35rem;
    padding-bottom: 0.1rem;
    font-size: 0.34rem;
  }
  &-date {
    text-align: right;
    min-width: 25%; // 保證日期不會被壓縮
    color: #c3c3c3;
    font-size: 0.28rem;
    white-space: nowrap;
  }
  &-text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &-main {
    font-size: 0.3rem;
    color: #424553;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2; // 想顯示的行數 lines you want to display
    -webkit-box-orient: vertical;
  }
  &-check {
    margin: 0.1rem 0;
    padding: 0.1rem;
    height: 20vh;
    font-size: 0.3rem;
    overflow-y: overlay;
    white-space: pre-wrap;
  }
}
</style>
