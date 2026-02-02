import { Employee } from '@/types/employee'
import axios from 'axios'

class EmployeeService {
  private readonly baseUrl = 'https://a4d3904e5e5cf144.mokky.dev/employees'

  async getAll(): Promise<Employee[]> {
    const response = await axios.get<Employee[]>(this.baseUrl)
    return response.data
  }

  async create(employee: Omit<Employee, 'id'>): Promise<Employee> {
    const response = await axios.post<Employee>(this.baseUrl, employee)
    return response.data
  }

  async update(id: number, employee: Partial<Employee>): Promise<Employee> {
    const response = await axios.patch<Employee>(
      `${this.baseUrl}/${id}`,
      employee,
    )
    return response.data
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`)
  }
}

export const employeeService = new EmployeeService()
