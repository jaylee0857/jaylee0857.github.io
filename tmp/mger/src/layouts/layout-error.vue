<template>
  <div>
    <h1>404</h1>
    <router-link :to="{ name: 'default-path' }">Back To Home</router-link>
  </div>
</template>

<script>
export default {
  setup() {
    return {};
  },
};
</script>
