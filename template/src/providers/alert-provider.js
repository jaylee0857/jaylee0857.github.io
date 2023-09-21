/**
 * doc
 * @link https://sweetalert2.github.io/
 */
import { defineProvider } from "@/_app/_define";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export const useAlertProvider = defineProvider(() => {
  return Swal.mixin({
    reverseButtons: true, //反轉按鈕
    heightAuto: false, //自適應高度
    focusConfirm: false, //focus確認鈕
    allowOutsideClick: false, //不可點擊範圍外
    allowEnterKey: false, //不可透過enter來操控彈窗
    allowEscapeKey: false,
    customClass: "swal2-wrap", //自定義彈窗樣式
    // width: 300, //寬度
    didOpen(popup) {
      const cancelBtn = popup.querySelector(".swal2-cancel");
      const confirmBtn = popup.querySelector(".swal2-confirm");
      confirmBtn.blur();
      cancelBtn.blur();
    },
  });
});
