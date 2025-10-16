import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiClient, UserSignupData, EmployeeSignupData } from '@/lib/api';
import { Eye, EyeOff, User, Lock, Mail, Phone, FileText, Building } from 'lucide-react';

const SignupPage = () => {
  const [userFormData, setUserFormData] = useState<UserSignupData>({
    name: '',
    last_name: '',
    middle_name: '',
    email: '',
    phone: '',
    password: '',
    inn: '',
    snils: '',
    tariff_id: 1,
  });

  const [employeeFormData, setEmployeeFormData] = useState<EmployeeSignupData>({
    name: '',
    last_name: '',
    middle_name: '',
    email: '',
    password: '',
    active: true,
    role_id: 1,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tariffs, setTariffs] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Загружаем тарифы и роли при монтировании компонента
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [tariffsData, rolesData] = await Promise.all([
          apiClient.getTariffs(),
          apiClient.getRoles(),
        ]);
        setTariffs(tariffsData);
        setRoles(rolesData);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };
    loadData();
  }, []);

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiClient.userSignup(userFormData);
      toast({
        title: "Регистрация успешна",
        description: "Аккаунт пользователя создан. Теперь вы можете войти в систему.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Ошибка регистрации",
        description: error instanceof Error ? error.message : "Произошла ошибка при регистрации",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiClient.employeeSignup(employeeFormData);
      toast({
        title: "Регистрация успешна",
        description: "Аккаунт сотрудника создан. Теперь вы можете войти в систему.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Ошибка регистрации",
        description: error instanceof Error ? error.message : "Произошла ошибка при регистрации",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserFormData({
      ...userFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeFormData({
      ...employeeFormData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">МБ</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Мой Бизнес ЮГ</h1>
          <p className="text-gray-600">Создайте новый аккаунт</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Регистрация</CardTitle>
            <CardDescription className="text-center">
              Выберите тип аккаунта и заполните форму
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="user" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user">Пользователь</TabsTrigger>
                <TabsTrigger value="employee">Сотрудник</TabsTrigger>
              </TabsList>

              <TabsContent value="user" className="space-y-4">
                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <User size={16} className="text-blue-600" />
                        Имя *
                      </Label>
                      <Input
                        id="user-name"
                        name="name"
                        value={userFormData.name}
                        onChange={handleUserChange}
                        placeholder="Иван"
                        required
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="user-last-name" className="text-sm font-medium text-gray-700">
                        Фамилия *
                      </Label>
                      <Input
                        id="user-last-name"
                        name="last_name"
                        value={userFormData.last_name}
                        onChange={handleUserChange}
                        placeholder="Петров"
                        required
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user-middle-name" className="text-sm font-medium text-gray-700">
                      Отчество
                    </Label>
                    <Input
                      id="user-middle-name"
                      name="middle_name"
                      value={userFormData.middle_name}
                      onChange={handleUserChange}
                      placeholder="Иванович"
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user-email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail size={16} className="text-blue-600" />
                      Email *
                    </Label>
                    <Input
                      id="user-email"
                      name="email"
                      type="email"
                      value={userFormData.email}
                      onChange={handleUserChange}
                      placeholder="ivan@example.com"
                      required
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user-phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Phone size={16} className="text-blue-600" />
                      Телефон
                    </Label>
                    <Input
                      id="user-phone"
                      name="phone"
                      value={userFormData.phone}
                      onChange={handleUserChange}
                      placeholder="+7 (999) 123-45-67"
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-inn" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FileText size={16} className="text-blue-600" />
                        ИНН
                      </Label>
                      <Input
                        id="user-inn"
                        name="inn"
                        value={userFormData.inn}
                        onChange={handleUserChange}
                        placeholder="123456789012"
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="user-snils" className="text-sm font-medium text-gray-700">
                        СНИЛС
                      </Label>
                      <Input
                        id="user-snils"
                        name="snils"
                        value={userFormData.snils}
                        onChange={handleUserChange}
                        placeholder="12345678901"
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user-tariff" className="text-sm font-medium text-gray-700">
                      Тариф
                    </Label>
                    <Select value={userFormData.tariff_id?.toString()} onValueChange={(value) => setUserFormData({...userFormData, tariff_id: parseInt(value)})}>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500">
                        <SelectValue placeholder="Выберите тариф" />
                      </SelectTrigger>
                      <SelectContent>
                        {tariffs.map((tariff) => (
                          <SelectItem key={tariff.id} value={tariff.id.toString()}>
                            {tariff.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user-password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Lock size={16} className="text-blue-600" />
                      Пароль *
                    </Label>
                    <div className="relative">
                      <Input
                        id="user-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={userFormData.password}
                        onChange={handleUserChange}
                        placeholder="Введите пароль"
                        required
                        className="border-gray-300 focus:border-blue-500 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                  >
                    {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="employee" className="space-y-4">
                <form onSubmit={handleEmployeeSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employee-name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <User size={16} className="text-green-600" />
                        Имя *
                      </Label>
                      <Input
                        id="employee-name"
                        name="name"
                        value={employeeFormData.name}
                        onChange={handleEmployeeChange}
                        placeholder="Алексей"
                        required
                        className="border-gray-300 focus:border-green-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employee-last-name" className="text-sm font-medium text-gray-700">
                        Фамилия *
                      </Label>
                      <Input
                        id="employee-last-name"
                        name="last_name"
                        value={employeeFormData.last_name}
                        onChange={handleEmployeeChange}
                        placeholder="Иванов"
                        required
                        className="border-gray-300 focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee-middle-name" className="text-sm font-medium text-gray-700">
                      Отчество
                    </Label>
                    <Input
                      id="employee-middle-name"
                      name="middle_name"
                      value={employeeFormData.middle_name}
                      onChange={handleEmployeeChange}
                      placeholder="Петрович"
                      className="border-gray-300 focus:border-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee-email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail size={16} className="text-green-600" />
                      Email *
                    </Label>
                    <Input
                      id="employee-email"
                      name="email"
                      type="email"
                      value={employeeFormData.email}
                      onChange={handleEmployeeChange}
                      placeholder="employee@company.com"
                      required
                      className="border-gray-300 focus:border-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee-role" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Building size={16} className="text-green-600" />
                      Роль *
                    </Label>
                    <Select value={employeeFormData.role_id?.toString()} onValueChange={(value) => setEmployeeFormData({...employeeFormData, role_id: parseInt(value)})}>
                      <SelectTrigger className="border-gray-300 focus:border-green-500">
                        <SelectValue placeholder="Выберите роль" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee-password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Lock size={16} className="text-green-600" />
                      Пароль *
                    </Label>
                    <div className="relative">
                      <Input
                        id="employee-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={employeeFormData.password}
                        onChange={handleEmployeeChange}
                        placeholder="Введите пароль"
                        required
                        className="border-gray-300 focus:border-green-500 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                  >
                    {isLoading ? 'Регистрация...' : 'Зарегистрировать сотрудника'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Уже есть аккаунт?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Войти
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
