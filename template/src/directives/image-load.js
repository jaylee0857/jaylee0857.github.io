export default {
  mounted(el, binding) {
    // console.log(el.parentElement);
    const customStyle = binding.value?.custom ?? "";
    const parentPosition = binding.value?.position ?? "relative";
    el.src = binding.value.old;
    // console.log(el.src);
    /* 預設url (低畫質)*/
    el.parentElement.style = `position: ${parentPosition};`;
    el.style = "z-index: 0;";
    const image = new Image();
    image.addEventListener("load", function () {
      console.log("load");
      const coverImage = document.createElement("img");
      coverImage.src = image.src;
      coverImage.style = `position: absolute;width: 100%;height: 100%;top: 0;left: 0;z-index: -11;transition: all 1s linear;opacity: 0;${customStyle}`;
      el.parentElement.appendChild(coverImage);
      setTimeout(() => {
        coverImage.style = `position: absolute;width: 100%;height: 100%;top: 0;left: 0;z-index: 11;transition: all 1s linear;opacity: 1;${customStyle}`;
      }, 1000);
    });
    image.src = binding.value.cover;
  },
  // update(el) {
  //   console.log("update", el);
  // },
};
