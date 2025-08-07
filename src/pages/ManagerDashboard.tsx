import React, { useState } from 'react';
import Header from '@/components/Header';
import KanbanBoard from '@/components/manager/KanbanBoard';
import ManagerAssignmentPanel from '@/components/manager/ManagerAssignmentPanel';
import CRMAnalytics from '@/components/manager/CRMAnalytics';
import ManagerSettings from '@/components/manager/ManagerSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Kanban, Settings, BarChart3 } from 'lucide-react';

const ManagerDashboard = () => {
  // Mock данные для демонстрации
  const [applications, setApplications] = useState([
    {
      id: 1,
      clientName: "Иван Петров",
      clientEmail: "ivan@email.com",
      type: "Регистрация ИП",
      status: "new",
      priority: "medium",
      createdDate: "2024-06-11",
      assignedManager: null,
      description: "Регистрация индивидуального предпринимателя"
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
      description: "Разработка корпоративного сайта"
    },
    {
      id: 3,
      clientName: "Дмитрий Козлов",
      clientEmail: "dmitry@email.com",
      type: "Настройка рекламы",
      status: "review",
      priority: "low",
      createdDate: "2024-06-09",
      assignedManager: "Елена Смирнова",
      description: "Настройка контекстной рекламы"
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
      description: "Ведение бухгалтерского учета"
    },
    {
      id: 5,
      clientName: "Петр Николаев",
      clientEmail: "petr@email.com",
      type: "Регистрация ООО",
      status: "completed",
      priority: "high",
      createdDate: "2024-06-11",
      assignedManager: "Елена Смирнова",
      description: "Регистрация общества с ограниченной ответственностью"
    },
    {
      id: 6,
      clientName: "Светлана Орлова",
      clientEmail: "svetlana@email.com",
      type: "Налоговая отчётность",
      status: "in-progress",
      priority: "medium",
      createdDate: "2024-06-11",
      assignedManager: "Ольга Новикова",
      description: "Подготовка налоговой отчётности"
    }
  ]);

  const managers = [
    { id: 1, name: "Алексей Иванов", email: "alexey@company.com", specialization: "Регистрация бизнеса", activeClients: 12 },
    { id: 2, name: "Елена Смирнова", email: "elena@company.com", specialization: "Веб-разработка", activeClients: 8 },
    { id: 3, name: "Михаил Петров", email: "mikhail@company.com", specialization: "Реклама и маркетинг", activeClients: 15 },
    { id: 4, name: "Ольга Новикова", email: "olga@company.com", specialization: "Бухгалтерия", activeClients: 6 }
  ];

  const updateApplicationStatus = (id: number, newStatus: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  const assignManager = (applicationId: number, managerName: string) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === applicationId ? { ...app, assignedManager: managerName } : app
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-2">
            Панель менеджера
          </h1>
          <p className="text-gray-600 text-lg">Управление клиентами и заявками</p>
        </div>

        <Tabs defaultValue="board" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="board" className="flex items-center gap-2">
              <Kanban size={16} />
              Доска заявок
            </TabsTrigger>
            <TabsTrigger value="managers" className="flex items-center gap-2">
              <Users size={16} />
              Менеджеры
            </TabsTrigger>
            <TabsTrigger value="crm" className="flex items-center gap-2">
              <BarChart3 size={16} />
              CRM Аналитика
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={16} />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="board">
            <KanbanBoard 
              applications={applications}
              onStatusChange={updateApplicationStatus}
              onAssignManager={assignManager}
              managers={managers}
            />
          </TabsContent>

          <TabsContent value="managers">
            <ManagerAssignmentPanel 
              managers={managers}
              applications={applications}
              onAssignManager={assignManager}
            />
          </TabsContent>

          <TabsContent value="crm">
            <CRMAnalytics 
              managers={managers}
              applications={applications}
            />
          </TabsContent>

          <TabsContent value="settings">
            <ManagerSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManagerDashboard;
