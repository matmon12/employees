<template>
  <button
    :disabled="props.disabled"
    :class="buttonClasses"
    @click="emits('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  disabled: false,
})

const emits = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed<CSSStyleValue>(() => [
  'app-button',
  `app-button--${props.variant}`,
])
</script>

<style scoped lang="scss">
.app-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 10px 15px;
  border-radius: var(--border-radius-lg);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;

  &--primary {
    background-color: var(--violet-400);
    color: var(--black);
    font-weight: 500;

    &:not(:disabled):hover {
      background-color: var(--violet-300);
    }
  }

  &--secondary {
    background-color: var(--neutral-800);
    color: var(--white);

    &:not(:disabled):hover {
      background-color: var(--neutral-700);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
