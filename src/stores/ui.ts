import { ref } from 'vue'
import { defineStore } from 'pinia'
import { EmployeeModel, DEFAULT_EMPLOYEE_FORM } from '@/models/EmployeeModel'
import type { Employee, EmployeeForm } from '@/types/employee'

/**
 * Store для управления UI состоянием (модальные окна)
 */
export const useUIStore = defineStore('ui', () => {
  // ============================================
  // STATE - Модальное окно формы
  // ============================================
  const isModalOpen = ref(false)
  const isEditMode = ref(false)
  const editingEmployee = ref<Employee | null>(null)
  const formData = ref<EmployeeForm>({ ...DEFAULT_EMPLOYEE_FORM })

  // ============================================
  // ACTIONS - Модальное окно формы
  // ============================================
  /**
   * Открыть модальное окно для создания нового сотрудника
   */
  const openCreateModal = (): void => {
    isEditMode.value = false
    editingEmployee.value = null
    formData.value = { ...DEFAULT_EMPLOYEE_FORM }
    isModalOpen.value = true
  }

  /**
   * Открыть модальное окно для редактирования сотрудника
   */
  const openEditModal = (employee: Employee): void => {
    isEditMode.value = true
    editingEmployee.value = employee
    formData.value = EmployeeModel.toForm(employee)
    isModalOpen.value = true
  }

  /**
   * Закрыть модальное окно формы
   */
  const closeModal = (): void => {
    isModalOpen.value = false
    setTimeout(() => {
      isEditMode.value = false
      editingEmployee.value = null
      formData.value = { ...DEFAULT_EMPLOYEE_FORM }
    }, 300)
  }

  return {
    // State - форма
    isModalOpen,
    isEditMode,
    editingEmployee,
    formData,
    // Actions - форма
    openCreateModal,
    openEditModal,
    closeModal,
  }
})
