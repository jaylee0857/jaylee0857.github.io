import { ref, onMounted, onUnmounted } from "vue";

export const useMobile = () => {
  const isMobile = ref(false);

  const resizeHandler = () => {
    if (window.innerWidth < 768) isMobile.value = true;
    else isMobile.value = false;
  };

  onMounted(() => {
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", resizeHandler);
  });

  return isMobile;
};

export default useMobile;
