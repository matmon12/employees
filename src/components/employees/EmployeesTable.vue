<template>
  <AppError
    v-if="error.list"
    :back="false"
    :message="error.list"
    class="table-error"
    :retry="employeesStore.loadEmployees"
  />
  <div v-else class="table-container">
    <table class="table">
      <thead>
        <tr>
          <th>Имя</th>
          <th>Фамилия</th>
          <th>Возраст</th>
          <th>Стаж (лет)</th>
          <th>Адрес</th>
          <th class="table__actions">Действия</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="loading.list">
          <tr v-for="i in 4" :key="i">
            <td colspan="6" class="table__skeleton">
              <AppSkeleton height="30px" />
            </td>
          </tr>
        </template>
        <tr v-else-if="sortedEmployees.length === 0">
          <td colspan="6">
            <div class="table__empty">
              <img
                src="@/assets/images/empty.svg"
                alt="empty"
                class="table__empty-image"
              />
              <p class="table__empty-text">Список сотрудников пуст</p>
            </div>
          </td>
        </tr>
        <template v-else>
          <tr v-for="employee in sortedEmployees" :key="employee.id">
            <td>{{ employee.firstName }}</td>
            <td>{{ employee.lastName }}</td>
            <td>{{ employee.age }}</td>
            <td>{{ employee.experience }}</td>
            <td class="table__address">
              <span class="table__address-text">{{ employee.address }}</span>
            </td>
            <td>
              <div class="table__actions-cell">
                <button
                  class="action-button action-button--delete"
                  title="Удалить"
                  :disabled="loading.delete"
                  @click="handleDelete(employee)"
                >
                  <i-svg-spinners:180-ring v-if="loading.delete" />
                  <i-ic:round-delete v-else />
                </button>
                <button
                  class="action-button action-button--edit"
                  title="Редактировать"
                  :disabled="loading.delete"
                  @click="handleEdit(employee)"
                >
                  <i-ic:round-edit />
                </button>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>

  <AppConfirmModal
    :is-open="isConfirmModalOpen"
    :message="confirmMessage"
    confirm-text="Удалить"
    @confirm="handleConfirmDelete"
    @cancel="handleCancelDelete"
  />

  <AppAlert
    type="error"
    title="Ошибка при удалении"
    :message="error.delete"
    :autoclose="3000"
    @dismiss="employeesStore.clearError('delete')"
  />
  <AppAlert
    type="success"
    title="Успешно"
    :message="success.delete"
    :autoclose="3000"
    @dismiss="employeesStore.clearSuccess('delete')"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUIStore } from '@/stores/ui'
import { useEmployeesStore } from '@/stores/employees'
import type { Employee } from '@/types/employee'

const employeesStore = useEmployeesStore()
const uiStore = useUIStore()
const { sortedEmployees, loading, error, success } = storeToRefs(employeesStore)

// Локальное состояние модалки подтверждения
const isConfirmModalOpen = ref(false)
const confirmMessage = ref('')
const pendingEmployeeId = ref<number | null>(null)

// Обработчики действий
const handleEdit = (employee: Employee) => {
  uiStore.openEditModal(employee)
}

const handleDelete = (employee: Employee) => {
  confirmMessage.value = `Вы уверены, что хотите удалить сотрудника ${employee.firstName} ${employee.lastName}?`
  pendingEmployeeId.value = employee.id
  isConfirmModalOpen.value = true
}

const handleConfirmDelete = () => {
  if (pendingEmployeeId.value !== null) {
    employeesStore.deleteEmployee(pendingEmployeeId.value)
    pendingEmployeeId.value = null
  }
  isConfirmModalOpen.value = false
}

const handleCancelDelete = () => {
  isConfirmModalOpen.value = false
  pendingEmployeeId.value = null
}

onMounted(() => {
  employeesStore.loadEmployees()
})
</script>

<style scoped lang="scss">
.table-container {
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}
.table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--neutral-900);

  thead {
    background-color: color-mix(in srgb, var(--violet-300), var(--black) 70%);
  }

  th {
    padding: 16px 16px;
    text-align: left;
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--white);

    &:first-child {
      border-top-left-radius: var(--border-radius-lg);
      border-bottom-left-radius: var(--border-radius-lg);
    }
    &:last-child {
      border-top-right-radius: var(--border-radius-lg);
      border-bottom-right-radius: var(--border-radius-lg);
    }
  }

  td {
    // text-align: center;
    padding: 10px 16px;
    border-bottom: 1px solid var(--neutral-700);

    &.table__skeleton {
      padding: 15px;
    }
  }

  tbody tr {
    &:last-child td {
      border-bottom: none;
    }
  }

  &__address {
    max-width: 300px;

    &-text {
      @include TextOverflow(1);
    }
  }

  &__empty {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 20px 30px 20px;
  }

  &__empty-text {
    font-size: 22px;
    margin-top: 20px;
  }

  &__empty-image {
    width: 200px;
  }

  &__actions {
    width: 120px;
    text-align: center;

    &-cell {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
  }
}

.table-error {
  flex: 1;
}
.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--neutral-700);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: background-color 0.3s;

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}
.action-button--edit {
  color: var(--violet-300);

  &:hover {
    background-color: color-mix(in srgb, var(--violet-300), transparent 70%);
  }
}
.action-button--delete {
  color: var(--red-300);

  &:hover {
    background-color: color-mix(in srgb, var(--red-300), transparent 70%);
  }
}
</style>
