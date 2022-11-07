<template>
  <div id="wrap">
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
<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  line-height: 1;
}
html {
  font-size: 16px;
}
#wrap {
  background-color: black;
}
@media (max-width: 1125px) {
  html {
    font-size: 12px;
  }
  #wrap {
    background-color: unset;
  }
}
@media (max-width: 768yarpx) {
  html {
    font-size: 8px;
  }
}
</style>
