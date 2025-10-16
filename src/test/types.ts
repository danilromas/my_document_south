import { User, Employee, Request, Service, Role, Tariff } from '../lib/api'

export interface TestUser extends Omit<User, 'id'> {
  id: number
  type: 'user' | 'employee' | 'manager'
}

export interface TestEmployee extends Omit<Employee, 'id'> {
  id: number
  type: 'employee' | 'manager'
}

export interface TestRequest extends Omit<Request, 'id'> {
  id: number
}

export interface TestService extends Omit<Service, 'id'> {
  id: number
}

export interface TestRole extends Omit<Role, 'id'> {
  id: number
}

export interface TestTariff extends Omit<Tariff, 'id'> {
  id: number
}

export interface MockAuthState {
  user: TestUser | TestEmployee | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => Promise<void>
  logout: () => void
}

export interface TestApplication {
  id: number
  type: string
  status: string
  date: string
  description: string
  priority?: string
  deadline?: string
  clientName?: string
  clientEmail?: string
  assignedManager?: string
}
