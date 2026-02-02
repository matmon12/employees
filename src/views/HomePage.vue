<template>
  <div class="home-page">
    <div class="home-page__header">
      <h1 class="home-page__title">Список сотрудников</h1>
      <AppButton
        :disabled="loading.list || loading.delete"
        @click="uiStore.openCreateModal()"
      >
        <i-gravity-ui:plus class="home-page__btn-icon" />
        Добавить
      </AppButton>
    </div>

    <div class="home-page__content">
      <EmployeesTable />
    </div>

    <EmployeeFormModal />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUIStore } from '@/stores/ui'
import { useEmployeesStore } from '@/stores/employees'

const employeesStore = useEmployeesStore()
const uiStore = useUIStore()
const { loading } = storeToRefs(employeesStore)
</script>

<style scoped lang="scss">
.home-page {
  flex: 1;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 16px;
  }

  &__title {
    line-height: 1;
    font-size: 30px;
    font-weight: 700;
  }

  &__btn {
    &-icon {
      font-size: 14px;
    }
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>
