import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiClient, EmployeeSignupData, Role } from "@/lib/api";
import { User, Mail, Lock, Building, Eye, EyeOff } from 'lucide-react';

interface CreateEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmployeeCreated?: () => void;
}

const CreateEmployeeModal = ({ open, onOpenChange, onEmployeeCreated }: CreateEmployeeModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<EmployeeSignupData>({
    name: '',
    last_name: '',
    middle_name: '',
    email: '',
    password: '',
    active: true,
    role_id: 1,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Загружаем роли при открытии модального окна
  useEffect(() => {
    if (open) {
      loadRoles();
    }
  }, [open]);

  const loadRoles = async () => {
    try {
      const rolesData = await apiClient.getRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error('Ошибка загрузки ролей:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список ролей",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiClient.employeeSignup(formData);
      toast({
        title: "Сотрудник создан",
        description: "Новый сотрудник успешно добавлен в систему",
      });
      
      // Сбрасываем форму
      setFormData({
        name: '',
        last_name: '',
        middle_name: '',
        email: '',
        password: '',
        active: true,
        role_id: 1,
      });
      
      onOpenChange(false);
      onEmployeeCreated?.();
    } catch (error) {
      toast({
        title: "Ошибка создания сотрудника",
        description: error instanceof Error ? error.message : "Произошла ошибка при создании сотрудника",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role_id: parseInt(value),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="text-green-600" size={24} />
            Создать нового сотрудника
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Заполните форму для добавления нового сотрудника в систему
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User size={16} className="text-green-600" />
                Имя *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Алексей"
                required
                className="border-gray-300 focus:border-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                Фамилия *
              </Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Иванов"
                required
                className="border-gray-300 focus:border-green-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="middle_name" className="text-sm font-medium text-gray-700">
              Отчество
            </Label>
            <Input
              id="middle_name"
              name="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
              placeholder="Петрович"
              className="border-gray-300 focus:border-green-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail size={16} className="text-green-600" />
              Email *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="employee@company.com"
              required
              className="border-gray-300 focus:border-green-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role_id" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Building size={16} className="text-green-600" />
              Роль *
            </Label>
            <Select value={formData.role_id?.toString()} onValueChange={handleRoleChange}>
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
            <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lock size={16} className="text-green-600" />
              Пароль *
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
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

          <DialogFooter className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 hover:bg-gray-50"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
            >
              {isLoading ? 'Создание...' : 'Создать сотрудника'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployeeModal;
