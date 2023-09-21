<template>
  <div class="layout-content">
    <slot />
  </div>
</template>

<script>
export default {
  setup() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.layout-content {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f8f8f8;
}
</style>
