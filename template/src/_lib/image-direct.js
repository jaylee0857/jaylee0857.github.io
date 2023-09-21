import * as imageConversion from "image-conversion";
import heic2any from "heic2any";

/**
 * 壓縮圖片
 * @description
 * 一般情況會回傳壓縮後的 jpeg 檔案
 * 若傳入為非 image，或是 gif 則會返回原檔
 * 壓縮失敗也是返回原檔
 *
 * @param {File} file
 * @returns {Promise<File>}
 */
export const compress = (file, { quality = 0.1 } = {}) => {
  const [type, ext] = file.type.split("/");
  if (type !== "image") {
    return Promise.resolve(file);
  }

  return new Promise((resolve) => {
    switch (ext) {
      case "png":
      case "jpg":
      case "jpeg":
        imageConversion.compress(file, quality).then((blob) => {
          if (blob) {
            resolve(new File([blob], file.name));
          } else {
            resolve(file);
          }
        });
        break;

      case "heic":
        heic2any({
          blob: file,
          toType: "image/jpeg",
          quality,
        }).then((blob) => {
          if (blob) {
            resolve(new File([blob], file.name));
          } else {
            resolve(file);
          }
        });
        break;

      default:
        resolve(file);
        break;
    }
  });
};

/**
 * 轉成顯示網址
 * @param {File} file
 * @returns {String} url
 */
export const toObjUrl = (file) => {
  return URL.createObjectURL(file);
};
