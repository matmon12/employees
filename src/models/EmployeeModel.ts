import type {
  Employee,
  EmployeeForm,
  EmployeeFormErrors,
} from '@/types/employee'

/**
 * Дефолтные значения для формы сотрудника
 */
export const DEFAULT_EMPLOYEE_FORM: EmployeeForm = {
  firstName: '',
  lastName: '',
  experience: null,
  age: null,
  address: '',
}

export class EmployeeModel {
  /**
   * Создает нового сотрудника из данных формы
   * @param form - данные формы
   * @returns - новый сотрудник
   */
  static createFromForm(form: EmployeeForm): Omit<Employee, 'id'> {
    return {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      experience: form.experience ?? 0,
      age: form.age ?? 0,
      address: form.address.trim(),
    }
  }

  /**
   * Обновляет данные сотрудника из данных формы
   * @param employee - существующий сотрудник
   * @param form - данные формы
   * @returns - обновленные поля сотрудника (только измененные)
   */
  static updateFromForm(
    employee: Employee,
    form: EmployeeForm,
  ): Partial<Employee> {
    const updates: Partial<Employee> = {}

    // Обновляем только измененные поля
    const trimmedFirstName = form.firstName.trim()
    if (trimmedFirstName !== employee.firstName) {
      updates.firstName = trimmedFirstName
    }

    const trimmedLastName = form.lastName.trim()
    if (trimmedLastName !== employee.lastName) {
      updates.lastName = trimmedLastName
    }

    if (form.experience != null && form.experience !== employee.experience) {
      updates.experience = form.experience
    }

    if (form.age != null && form.age !== employee.age) {
      updates.age = form.age
    }

    const trimmedAddress = form.address.trim()
    if (trimmedAddress !== employee.address) {
      updates.address = trimmedAddress
    }

    return updates
  }

  /**
   * Преобразует сотрудника в данные формы для редактирования
   * @param employee - сотрудник
   * @returns - данные формы
   */
  static toForm(employee: Employee): EmployeeForm {
    return {
      firstName: employee.firstName,
      lastName: employee.lastName,
      experience: employee.experience,
      age: employee.age,
      address: employee.address,
    }
  }

  /**
   * Валидирует данные формы сотрудника
   * @param form - данные формы
   * @returns - объект с ошибками
   */
  static validateForm(form: EmployeeForm): EmployeeFormErrors {
    const errors: EmployeeFormErrors = {}

    if (!form.firstName.trim()) {
      errors.firstName = 'Поле "Имя" обязательно для заполнения'
    } else if (form.firstName.trim().length < 2) {
      errors.firstName = 'Поле "Имя" должно содержать не менее 2 символов'
    }

    if (!form.lastName.trim()) {
      errors.lastName = 'Поле "Фамилия" обязательно для заполнения'
    } else if (form.lastName.trim().length < 2) {
      errors.lastName = 'Поле "Фамилия" должно содержать не менее 2 символов'
    }

    if (form.experience == null) {
      errors.experience = 'Поле "Стаж" обязательно для заполнения'
    } else if (form.experience < 0) {
      errors.experience = 'Поле "Стаж" не может быть отрицательным'
    } else if (form.experience > 100) {
      errors.experience = 'Поле "Стаж" не может быть больше 100'
    }

    if (form.age == null) {
      errors.age = 'Поле "Возраст" обязательно для заполнения'
    } else if (form.age < 18) {
      errors.age = 'Поле "Возраст" не может быть меньше 18'
    } else if (form.age > 100) {
      errors.age = 'Поле "Возраст" не может быть больше 100'
    }

    if (!form.address.trim()) {
      errors.address = 'Поле "Адрес" обязательно для заполнения'
    } else if (form.address.trim().length < 5) {
      errors.address = 'Поле "Адрес" должно содержать не менее 5 символов'
    }

    return errors
  }
}
