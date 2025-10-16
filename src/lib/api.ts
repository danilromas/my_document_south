// API клиент для взаимодействия с бэкендом
const API_BASE_URL = 'http://localhost:3000';

export interface ApiError {
  error: string;
  timestamp?: string;
}

export interface User {
  id: number;
  name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  phone?: string;
  password?: string;
  inn?: string;
  snils?: string;
  tariff_id?: number;
  tariff?: Tariff;
  created_at: string;
  updated_at?: string;
}

export interface Employee {
  id: number;
  name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  password?: string;
  active: boolean;
  role_id: number;
  role?: Role;
  services?: Service[];
  created_at: string;
  updated_at?: string;
}

export interface Role {
  id: number;
  name: string;
  created_at: string;
  updated_at?: string;
}

export interface Service {
  id: number;
  name: string;
  created_at: string;
  updated_at?: string;
}

export interface Tariff {
  id: number;
  name: string;
  created_at: string;
  updated_at?: string;
}

export interface Request {
  id: number;
  owner_id: number;
  user?: User;
  service_id: number;
  service?: Service;
  employee_id?: number;
  employee?: Employee;
  status: number;
  desired_at?: string;
  created_at: string;
  updated_at?: string;
  closed_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User | Employee;
}

// Типы для форм
export interface UserSignupData {
  name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  phone?: string;
  password: string;
  inn?: string;
  snils?: string;
  tariff_id?: number;
}

export interface EmployeeSignupData {
  name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  password: string;
  active?: boolean;
  role_id: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RequestData {
  service_id: number;
  desired_at?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      // Если ответ пустой (например, 201 без тела), возвращаем пустой объект
      if (response.status === 201 && response.headers.get('content-length') === '0') {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Аутентификация
  async userSignup(data: UserSignupData): Promise<void> {
    await this.request('/pub/users/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async employeeSignup(data: EmployeeSignupData): Promise<void> {
    await this.request('/pub/employee/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginData): Promise<AuthResponse> {
    // Предполагаем, что есть эндпоинт для логина (может потребоваться создать на бэкенде)
    const response = await this.request<AuthResponse>('/pub/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    this.setToken(response.token);
    return response;
  }

  // Пользователи
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/prot/users');
  }

  async getUser(id: number): Promise<User> {
    return this.request<User>(`/prot/users/${id}`);
  }

  async deleteUser(id: number): Promise<{ id: number }> {
    return this.request<{ id: number }>(`/prot/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Сотрудники
  async getEmployees(): Promise<Employee[]> {
    return this.request<Employee[]>('/prot/employee');
  }

  async getEmployee(id: number): Promise<Employee> {
    return this.request<Employee>(`/prot/employee/${id}`);
  }

  async deleteEmployee(id: number): Promise<{ id: number }> {
    return this.request<{ id: number }>(`/prot/employee/${id}`, {
      method: 'DELETE',
    });
  }

  async addEmployeeService(employeeId: number, serviceId: number): Promise<void> {
    await this.request(`/prot/employee/${employeeId}/service`, {
      method: 'POST',
      body: JSON.stringify({ service_id: serviceId }),
    });
  }

  async removeEmployeeService(employeeId: number, serviceId: number): Promise<void> {
    await this.request(`/prot/employee/${employeeId}/service/${serviceId}`, {
      method: 'DELETE',
    });
  }

  // Роли
  async getRoles(): Promise<Role[]> {
    return this.request<Role[]>('/prot/roles');
  }

  async getRole(id: number): Promise<Role> {
    return this.request<Role>(`/prot/roles/${id}`);
  }

  async createRole(name: string): Promise<Role> {
    return this.request<Role>('/pub/roles', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  // Услуги
  async getServices(): Promise<Service[]> {
    return this.request<Service[]>('/prot/services/');
  }

  async getService(id: number): Promise<Service> {
    return this.request<Service>(`/prot/services/${id}`);
  }

  async createService(name: string): Promise<Service> {
    return this.request<Service>('/prot/services', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async updateService(id: number, name: string): Promise<Service> {
    return this.request<Service>(`/prot/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  async deleteService(id: number): Promise<{ id: number }> {
    return this.request<{ id: number }>(`/prot/services/${id}`, {
      method: 'DELETE',
    });
  }

  // Тарифы
  async getTariffs(): Promise<Tariff[]> {
    return this.request<Tariff[]>('/prot/tariffs/');
  }

  async getTariff(id: number): Promise<Tariff> {
    return this.request<Tariff>(`/prot/tariffs/${id}`);
  }

  async createTariff(name: string): Promise<Tariff> {
    return this.request<Tariff>('/pub/tariffs', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async updateTariff(id: number, name: string): Promise<Tariff> {
    return this.request<Tariff>(`/prot/tariffs/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  async deleteTariff(id: number): Promise<{ id: number }> {
    return this.request<{ id: number }>(`/prot/tariffs/${id}`, {
      method: 'DELETE',
    });
  }

  // Заявки
  async getRequests(filters?: {
    owner_id?: number;
    service_id?: number;
    status?: number;
    employee_id?: number;
    desired_at?: string;
  }): Promise<Request[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `/prot/request?${queryString}` : '/prot/request';
    
    return this.request<Request[]>(endpoint);
  }

  async getRequest(id: number): Promise<Request> {
    return this.request<Request>(`/prot/request/${id}`);
  }

  async createRequest(data: RequestData): Promise<Request> {
    return this.request<Request>('/prot/request', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteRequest(id: number): Promise<{ id: number }> {
    return this.request<{ id: number }>(`/prot/request/${id}`, {
      method: 'DELETE',
    });
  }

  async assignEmployee(requestId: number, employeeId: number): Promise<Request> {
    return this.request<Request>(`/prot/request/${requestId}/employee`, {
      method: 'PATCH',
      body: JSON.stringify({ employee_id: employeeId }),
    });
  }

  async updateRequestStatus(requestId: number, status: number): Promise<Request> {
    return this.request<Request>(`/prot/request/${requestId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}

export const apiClient = new ApiClient();
