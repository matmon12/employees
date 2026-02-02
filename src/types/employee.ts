export interface Employee {
  id: number
  firstName: string
  lastName: string
  experience: number
  age: number
  address: string
}

export interface EmployeeForm {
  firstName: string
  lastName: string
  experience: number | null
  age: number | null
  address: string
}

export interface EmployeeFormErrors {
  firstName?: string
  lastName?: string
  experience?: string
  age?: string
  address?: string
}
