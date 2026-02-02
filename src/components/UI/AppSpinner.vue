<template>
  <div class="app-spinner">
    <i-svg-spinners:bars-rotate-fade class="app-spinner__icon" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.app-spinner {
  background-color: var(--neutral-800);
  padding: 20px;
  border-radius: var(--border-radius-xl);
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-index-1200);

  &__icon {
    width: 10%;
  }
}
</style>
