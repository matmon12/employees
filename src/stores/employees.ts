import type { Employee } from '@/types/employee'
import { employeeService } from '@/services/EmployeeService'
import { defineStore } from 'pinia'

export const useEmployeesStore = defineStore('employees', () => {
  // ============================================
  // STATE
  // ============================================
  const employees = ref<Map<number, Employee>>(new Map())
  const loading = ref({
    list: false,
    save: false,
    update: false,
    delete: false,
  })
  const error = ref<{
    list: string | null
    save: string | null
    update: string | null
    delete: string | null
  }>({
    list: null,
    save: null,
    update: null,
    delete: null,
  })
  const success = ref<{
    save: string | null
    update: string | null
    delete: string | null
  }>({
    save: null,
    update: null,
    delete: null,
  })

  // ============================================
  // COMPUTED
  // ============================================
  /**
   * Получить отсортированный список сотрудников (по фамилии)
   */
  const sortedEmployees = computed<Employee[]>(() => {
    return Array.from(employees.value.values()).sort((a, b) =>
      a.lastName.localeCompare(b.lastName, 'ru'),
    )
  })

  // ============================================
  // ACTIONS
  // ============================================
  /**
   * Загрузить список сотрудников с сервера
   */
  const loadEmployees = async (): Promise<void> => {
    loading.value.list = true
    error.value.list = null

    try {
      const data = await employeeService.getAll()

      employees.value.clear()
      data.forEach((employee) => {
        employees.value.set(employee.id, employee)
      })
    } catch (e) {
      error.value.list =
        e instanceof Error
          ? e.message
          : 'Не удалось загрузить список сотрудников'
      console.error('Ошибка при загрузке списка сотрудников:', e)
      throw e
    } finally {
      loading.value.list = false
    }
  }

  /**
   * Сохранить нового сотрудника
   */
  const saveEmployee = async (employee: Omit<Employee, 'id'>) => {
    loading.value.save = true
    error.value.save = null
    success.value.save = null

    try {
      const createdEmployee = await employeeService.create(employee)
      employees.value.set(createdEmployee.id, createdEmployee)
      success.value.save = 'Сотрудник успешно добавлен'
    } catch (e) {
      error.value.save =
        e instanceof Error ? e.message : 'Не удалось добавить сотрудника'
      console.error('Ошибка при сохранении сотрудника:', e)
      throw e
    } finally {
      loading.value.save = false
    }
  }

  /**
   * Обновить данные сотрудника
   */
  const updateEmployee = async (id: number, employee: Partial<Employee>) => {
    loading.value.update = true
    error.value.update = null
    success.value.update = null

    try {
      const updatedEmployee = await employeeService.update(id, employee)
      employees.value.set(id, updatedEmployee)
      success.value.update = 'Данные сотрудника успешно обновлены'
    } catch (e) {
      error.value.update =
        e instanceof Error ? e.message : 'Не удалось обновить сотрудника'
      console.error('Ошибка при обновлении сотрудника:', e)
      throw e
    } finally {
      loading.value.update = false
    }
  }

  /**
   * Удалить сотрудника
   */
  const deleteEmployee = async (id: number): Promise<void> => {
    loading.value.delete = true
    error.value.delete = null
    success.value.delete = null

    try {
      await employeeService.delete(id)
      employees.value.delete(id)
      success.value.delete = 'Сотрудник успешно удален'
    } catch (e) {
      error.value.delete =
        e instanceof Error ? e.message : 'Не удалось удалить сотрудника'
      console.error('Ошибка при удалении сотрудника:', e)
      throw e
    } finally {
      loading.value.delete = false
    }
  }

  /**
   * Очистить ошибку
   */
  const clearError = (type?: 'list' | 'save' | 'update' | 'delete'): void => {
    if (type) {
      error.value[type] = null
    } else {
      error.value.list = null
      error.value.save = null
      error.value.update = null
      error.value.delete = null
    }
  }

  /**
   * Очистить сообщение об успехе
   */
  const clearSuccess = (type?: 'save' | 'update' | 'delete'): void => {
    if (type) {
      success.value[type] = null
    } else {
      success.value.save = null
      success.value.update = null
      success.value.delete = null
    }
  }

  return {
    // State
    employees,
    loading,
    error,
    success,

    // Getters
    sortedEmployees,

    // Actions
    loadEmployees,
    saveEmployee,
    updateEmployee,
    deleteEmployee,
    clearError,
    clearSuccess,
  }
})
