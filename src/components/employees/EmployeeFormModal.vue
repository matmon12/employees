<template>
  <AppModal
    :is-open="isModalOpen"
    :title="isEditMode ? 'Редактировать сотрудника' : 'Добавить сотрудника'"
    @close="uiStore.closeModal"
  >
    <form class="form" @submit.prevent="handleFormSubmit">
      <div class="form-group">
        <label for="firstName" class="form-label form-label--required">
          Имя
        </label>
        <AppInput
          id="firstName"
          v-model="localFormData.firstName"
          placeholder="Введите имя"
          :invalid="!!errors.firstName"
          @blur="() => validateField('firstName')"
        />
        <transition name="error">
          <span v-if="errors.firstName" class="form-error">{{
            errors.firstName
          }}</span>
        </transition>
      </div>

      <div class="form-group">
        <label for="lastName" class="form-label form-label--required">
          Фамилия
        </label>
        <AppInput
          id="lastName"
          v-model="localFormData.lastName"
          placeholder="Введите фамилию"
          :invalid="!!errors.lastName"
          @blur="() => validateField('lastName')"
        />
        <transition name="error">
          <span v-if="errors.lastName" class="form-error">{{
            errors.lastName
          }}</span>
        </transition>
      </div>

      <div class="form-group">
        <label for="age" class="form-label form-label--required">
          Возраст
        </label>
        <AppInput
          id="age"
          v-model="localFormData.age"
          type="number"
          placeholder="Введите возраст"
          :invalid="!!errors.age"
          @blur="() => validateField('age')"
        />
        <transition name="error">
          <span v-if="errors.age" class="form-error">{{ errors.age }}</span>
        </transition>
      </div>

      <div class="form-group">
        <label for="experience" class="form-label form-label--required">
          Опыт работы
        </label>
        <AppInput
          id="experience"
          v-model="localFormData.experience"
          type="number"
          placeholder="Введите опыт работы"
          :invalid="!!errors.experience"
          @blur="() => validateField('experience')"
        />
        <transition name="error">
          <span v-if="errors.experience" class="form-error">{{
            errors.experience
          }}</span>
        </transition>
      </div>

      <div class="form-group">
        <label for="address" class="form-label form-label--required">
          Адрес
        </label>
        <AppInput
          id="address"
          v-model="localFormData.address"
          as-textarea
          placeholder="Введите адрес"
          :invalid="!!errors.address"
          @blur="() => validateField('address')"
        />
        <transition name="error">
          <span v-if="errors.address" class="form-error">{{
            errors.address
          }}</span>
        </transition>
      </div>
    </form>

    <template #footer>
      <AppButton
        variant="secondary"
        :disabled="loading.save || loading.update"
        @click="uiStore.closeModal"
      >
        Отменить
      </AppButton>
      <AppButton
        :disabled="loading.save || loading.update"
        @click="handleFormSubmit"
      >
        <template v-if="loading.save || loading.update">
          <i-svg-spinners:180-ring />
          {{ isEditMode ? 'Сохранение...' : 'Добавление...' }}
        </template>
        <template v-else>
          {{ isEditMode ? 'Сохранить' : 'Добавить' }}
        </template>
      </AppButton>
    </template>
  </AppModal>

  <AppSpinner
    v-if="loading.save || loading.update"
    class="form-modal__spinner"
  />

  <AppAlert
    type="error"
    title="Ошибка при добавлении"
    :message="error.save"
    :autoclose="3000"
    @dismiss="employeesStore.clearError('save')"
  />
  <AppAlert
    type="error"
    title="Ошибка при обновлении"
    :message="error.update"
    :autoclose="3000"
    @dismiss="employeesStore.clearError('update')"
  />
  <AppAlert
    type="success"
    title="Успешно"
    :message="success.save"
    :autoclose="3000"
    @dismiss="employeesStore.clearSuccess('save')"
  />
  <AppAlert
    type="success"
    title="Успешно"
    :message="success.update"
    :autoclose="3000"
    @dismiss="employeesStore.clearSuccess('update')"
  />
</template>

<script setup lang="ts">
import { EmployeeModel } from '@/models/EmployeeModel'
import { useEmployeesStore } from '@/stores/employees'
import { useUIStore } from '@/stores/ui'
import { useEmployeeForm } from '@/composables/useEmployeeForm'
import type { EmployeeForm, EmployeeFormErrors } from '@/types/employee'
import { storeToRefs } from 'pinia'

const employeesStore = useEmployeesStore()
const uiStore = useUIStore()
const { loading, error, success } = storeToRefs(employeesStore)
const { isModalOpen, isEditMode, formData } = storeToRefs(uiStore)
const { saveEmployee } = useEmployeeForm()

// Состояние формы
const errors = ref<EmployeeFormErrors>({})
const localFormData = ref<EmployeeForm>({ ...formData.value })

// Синхронизация с store при открытии модального окна (дефолтные значения)
watch(
  () => formData.value,
  (newData) => {
    localFormData.value = { ...newData }
    errors.value = {}
  },
)

const validateField = (field: keyof EmployeeForm) => {
  const fieldErrors = EmployeeModel.validateForm(localFormData.value)
  errors.value[field] = fieldErrors[field]
}

const validateForm = (): boolean => {
  const formErrors = EmployeeModel.validateForm(localFormData.value)
  errors.value = formErrors
  return Object.keys(formErrors).length === 0
}

const handleFormSubmit = () => {
  if (validateForm()) {
    saveEmployee({ ...localFormData.value })
  }
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--neutral-400);
}

.form-label--required {
  &::after {
    content: '*';
    color: var(--red-400);
  }
}

.form-error {
  font-size: 12px;
  color: var(--red-400);
  line-height: 1;
  margin-top: -2px;
  max-height: 100px;
}

.error-enter-active,
.error-leave-active {
  transition: max-height 0.3s;
}

.error-enter-from,
.error-leave-to {
  max-height: 0;
}

.form-modal__spinner {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
