import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Employee, apiClient, LoginData } from '@/lib/api';

export type UserType = 'user' | 'employee' | 'manager' | null;

export interface AuthUser {
  id: number;
  name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  type: UserType;
  phone?: string;
  inn?: string;
  snils?: string;
  tariff_id?: number;
  active?: boolean;
  role_id?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем токен при загрузке приложения
    const token = localStorage.getItem('authToken');
    if (token) {
      // В реальном приложении здесь бы был запрос для получения данных пользователя
      // Пока используем моковые данные
      const mockUser: AuthUser = {
        id: 1,
        name: 'Иван',
        last_name: 'Петров',
        middle_name: 'Иванович',
        email: 'ivan@example.com',
        type: 'user',
        phone: '+7 (999) 123-45-67',
        inn: '123456789012',
        snils: '12345678901',
        tariff_id: 1,
      };
      setUser(mockUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginData) => {
    try {
      setIsLoading(true);
      const response = await apiClient.login(data);
      
      // Преобразуем данные пользователя в наш формат
      const authUser: AuthUser = {
        id: response.user.id,
        name: response.user.name,
        last_name: response.user.last_name,
        middle_name: response.user.middle_name,
        email: response.user.email,
        type: 'employee_id' in response.user ? 'employee' : 'user',
        phone: 'phone' in response.user ? response.user.phone : undefined,
        inn: 'inn' in response.user ? response.user.inn : undefined,
        snils: 'snils' in response.user ? response.user.snils : undefined,
        tariff_id: 'tariff_id' in response.user ? response.user.tariff_id : undefined,
        active: 'active' in response.user ? response.user.active : undefined,
        role_id: 'role_id' in response.user ? response.user.role_id : undefined,
      };

      setUser(authUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiClient.clearToken();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
