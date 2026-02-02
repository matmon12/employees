<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
        <div class="modal-container">
          <div class="modal__header">
            <h2 class="modal__header-title">{{ title }}</h2>
            <button class="modal__header-close" @click="handleClose">
              <i-ic:round-close />
            </button>
          </div>
          <div class="modal-content">
            <slot />
          </div>
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
interface ModalProps {
  isOpen: boolean
  title: string
}

interface ModalEmits {
  close: []
}

const props = defineProps<ModalProps>()
const emits = defineEmits<ModalEmits>()

const handleClose = () => {
  emits('close')
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)
    } else {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
    }
  },
  {
    immediate: true,
  },
)

onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: var(--z-index-1100);
}
.modal-container {
  background-color: var(--neutral-900);
  border-radius: var(--border-radius-2xl);
  border: 1px solid var(--neutral-800);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 1);
  color: var(--white);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.modal {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px 20px 24px;
  }

  &__header-title {
    font-size: 24px;
    font-weight: 500;
  }

  &__header-close {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2px;
    font-size: 20px;
    color: var(--neutral-400);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    transition: background-color 0.3s;

    &:hover {
      background-color: var(--neutral-800);
    }
  }
}
.modal-content {
  overflow-y: auto;
  flex: 1;
  padding: 0 24px 20px;
}
.modal-footer {
  padding: 0 20px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
  opacity: 0;
}
</style>
