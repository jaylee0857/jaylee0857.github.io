<script setup lang="ts">
import { RouterView } from 'vue-router'
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'; // 引入樣式
import { onMounted } from 'vue';

// 彈窗方法
const showAlert = () => {
  Swal.fire({
    title: '選擇超商須知', // 彈窗標題
    html: `
      <div style="text-align: center;">
        <p style="font-weight: bold; font-size: 18px; color: #f56c6c;">新開店家無法在地圖上即時更新</p>
        <p>請找尋自己附近的店家做綁定</p>
        <p>請選定自己附近的超商，若要再次變更綁定超商，請向客服聯絡進行更改。</p>
      </div>
    `, // 彈窗內容，HTML 格式
    confirmButtonText: '我知道了', // 按鈕文字
    confirmButtonColor: '#FF6A00', // 按鈕顏色
    customClass: {
      popup: 'custom-popup', // 自訂樣式
    },
  });
};
onMounted(() => {
  showAlert();
});
</script>

<template>
  <RouterView />
</template>

<style>
  html, body {
    padding: 0;
    margin: 0;
  }
</style>
