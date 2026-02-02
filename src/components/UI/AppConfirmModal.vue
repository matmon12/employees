<template>
  <AppModal :is-open="isOpen" title="Подтверждение" @close="handleCancel">
    <p class="confirm-modal__message">{{ props.message }}</p>

    <template #footer>
      <AppButton variant="secondary" @click="handleCancel">Отменить</AppButton>
      <AppButton @click="handleConfirm">{{ props.confirmText }}</AppButton>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
interface ConfirmModalProps {
  isOpen: boolean
  message: string
  confirmText?: string
}

interface ConfirmModalEmits {
  confirm: []
  cancel: []
}

const props = withDefaults(defineProps<ConfirmModalProps>(), {
  confirmText: 'Подтвердить',
})
const emit = defineEmits<ConfirmModalEmits>()

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped lang="scss">
.confirm-modal__message {
  font-size: 16px;
  line-height: 1.5;
  color: var(--neutral-200);
}
</style>
