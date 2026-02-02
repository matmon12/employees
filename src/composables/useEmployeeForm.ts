import { EmployeeModel } from '@/models/EmployeeModel'
import { useEmployeesStore } from '@/stores/employees'
import { useUIStore } from '@/stores/ui'
import type { EmployeeForm } from '@/types/employee'

export const useEmployeeForm = () => {
  const employeesStore = useEmployeesStore()
  const uiStore = useUIStore()

  const saveEmployee = async (form: EmployeeForm) => {
    if (uiStore.isEditMode && uiStore.editingEmployee) {
      const updatedData = EmployeeModel.updateFromForm(
        uiStore.editingEmployee,
        form,
      )
      await employeesStore.updateEmployee(
        uiStore.editingEmployee.id,
        updatedData,
      )
    } else {
      const newEmployeeData = EmployeeModel.createFromForm(form)
      await employeesStore.saveEmployee(newEmployeeData)
    }

    uiStore.closeModal()
  }

  return {
    saveEmployee,
  }
}
