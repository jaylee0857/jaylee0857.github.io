<template>
  <div class="layout-trade paging">
    <div class="header">
      <div class="header-actions">
        <slot name="actions"></slot>
      </div>
      <div class="title"><slot name="title"></slot></div>
    </div>
    <div class="container__trade">
      <slot name="content"></slot>
    </div>
    <div class="footer-actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<style lang="scss">
.paging {
  .footer-actions {
    position: fixed;
    bottom: 0;
  }
}
</style>
