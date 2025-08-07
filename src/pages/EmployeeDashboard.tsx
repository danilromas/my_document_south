
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import EmployeeApplications from '@/components/employee/EmployeeApplications';
import EmployeeNotifications from '@/components/employee/EmployeeNotifications';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Bell, BarChart3, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EmployeeDashboard = () => {
  const { toast } = useToast();
  const currentEmployee = "Алексей Иванов"; // В реальном приложении получать из контекста авторизации

  // Mock данные заявок для сотрудника
  const [applications, setApplications] = useState([
    {
      id: 1,
      clientName: "Иван Петров",
      clientEmail: "ivan@email.com",
      type: "Регистрация ИП",
      status: "new",
      priority: "medium",
      createdDate: "2024-06-11",
      assignedManager: "Алексей Иванов",
      description: "Регистрация индивидуального предпринимателя",
      deadline: "2024-06-15"
    },
    {
      id: 2,
      clientName: "Мария Сидорова", 
      clientEmail: "maria@email.com",
      type: "Создание сайта",
      status: "in-progress",
      priority: "high",
      createdDate: "2024-06-10",
      assignedManager: "Алексей Иванов",
      description: "Разработка корпоративного сайта",
      deadline: "2024-06-20"
    },
    {
      id: 4,
      clientName: "Анна Волкова",
      clientEmail: "anna@email.com", 
      type: "Бухгалтерские услуги",
      status: "completed",
      priority: "medium",
      createdDate: "2024-06-08",
      assignedManager: "Алексей Иванов",
      description: "Ведение бухгалтерского учета",
      deadline: "2024-06-12"
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "new_application",
      title: "Новая заявка",
      message: "Вам назначена заявка от Иван Петров - Регистрация ИП",
      timestamp: "2024-06-11 09:30",
      read: false
    },
    {
      id: 2,
      type: "deadline_warning",
      title: "Приближается дедлайн",
      message: "Заявка 'Бухгалтерские услуги' должна быть завершена до 12.06",
      timestamp: "2024-06-11 08:00",
      read: false
    },
    {
      id: 3,
      type: "status_update",
      title: "Статус обновлен",
      message: "Заявка 'Создание сайта' переведена в статус 'В работе'",
      timestamp: "2024-06-10 16:45",
      read: true
    }
  ]);

  // Функция для обновления статуса заявки
  const updateApplicationStatus = (id: number, newStatus: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
    
    // Показываем уведомление об успешном обновлении
    toast({
      title: "Статус обновлен",
      description: `Заявка №${id} переведена в статус: ${getStatusLabel(newStatus)}`,
    });

    // Добавляем уведомление в список
    const newNotification = {
      id: Date.now(),
      type: "status_update",
      title: "Статус обновлен",
      message: `Заявка №${id} переведена в статус '${getStatusLabel(newStatus)}'`,
      timestamp: new Date().toLocaleString('ru-RU'),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Новая';
      case 'in-progress': return 'В работе';
      case 'review': return 'На проверке';
      case 'completed': return 'Завершена';
      default: return status;
    }
  };

  // Отмечаем уведомление как прочитанное
  const markNotificationRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Получаем количество непрочитанных уведомлений
  const unreadCount = notifications.filter(n => !n.read).length;

  // Симуляция получения новых заявок
  useEffect(() => {
    const interval = setInterval(() => {
      // Случайно показываем новые уведомления (для демонстрации)
      if (Math.random() < 0.1) { // 10% шанс каждые 30 секунд
        const newNotification = {
          id: Date.now(),
          type: "new_application",
          title: "Новая заявка",
          message: "Вам назначена новая заявка",
          timestamp: new Date().toLocaleString('ru-RU'),
          read: false
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        
        toast({
          title: "Новая заявка!",
          description: "Вам назначена новая заявка. Проверьте список заявок.",
        });
      }
    }, 30000); // Проверяем каждые 30 секунд

    return () => clearInterval(interval);
  }, [toast]);

  const employeeApplications = applications.filter(app => 
    app.assignedManager === currentEmployee
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-2">
            Панель сотрудника
          </h1>
          <p className="text-gray-600 text-lg">
            Добро пожаловать, {currentEmployee}! У вас {employeeApplications.length} назначенных заявок
          </p>
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <Briefcase size={16} />
              Мои заявки ({employeeApplications.length})
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell size={16} />
              Уведомления {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-1">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={16} />
              Профиль
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <EmployeeApplications 
              applications={employeeApplications}
              onStatusChange={updateApplicationStatus}
            />
          </TabsContent>

          <TabsContent value="notifications">
            <EmployeeNotifications 
              notifications={notifications}
              onMarkRead={markNotificationRead}
            />
          </TabsContent>

          <TabsContent value="profile">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Профиль сотрудника</h3>
              <div className="space-y-4">
                <div>
                  <label className="font-medium text-gray-700">Имя:</label>
                  <p className="text-gray-900">{currentEmployee}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Email:</label>
                  <p className="text-gray-900">alexey@company.com</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Специализация:</label>
                  <p className="text-gray-900">Регистрация бизнеса</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Активных заявок:</label>
                  <p className="text-gray-900">{employeeApplications.filter(app => app.status !== 'completed').length}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
