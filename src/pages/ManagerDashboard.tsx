import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import KanbanBoard from '@/components/manager/KanbanBoard';
import ManagerAssignmentPanel from '@/components/manager/ManagerAssignmentPanel';
import CRMAnalytics from '@/components/manager/CRMAnalytics';
import ManagerSettings from '@/components/manager/ManagerSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Kanban, Settings, BarChart3 } from 'lucide-react';
import { apiClient, Request, Employee, User } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const ManagerDashboard = () => {
  const { toast } = useToast();

  // Загружаем все заявки
  const { data: requests, isLoading: requestsLoading, refetch: refetchRequests } = useQuery({
    queryKey: ['all-requests'],
    queryFn: () => apiClient.getRequests(),
  });

  // Загружаем сотрудников
  const { data: employees, isLoading: employeesLoading, refetch: refetchEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: () => apiClient.getEmployees(),
  });

  // Преобразуем данные для отображения
  const applications = requests?.map(request => ({
    id: request.id,
    clientName: `${request.user?.name || ''} ${request.user?.last_name || ''}`.trim() || 'Неизвестный клиент',
    clientEmail: request.user?.email || 'email@example.com',
    type: request.service?.name || "Неизвестная услуга",
    status: getStatusLabel(request.status),
    priority: "medium", // Можно добавить в API
    createdDate: new Date(request.created_at).toLocaleDateString('ru-RU'),
    assignedManager: request.employee ? `${request.employee.name} ${request.employee.last_name}` : null,
    description: `Заявка на услугу: ${request.service?.name || "Неизвестная услуга"}`,
    originalRequest: request
  })) || [];

  const managers = employees?.map(employee => ({
    id: employee.id,
    name: `${employee.name} ${employee.last_name}`,
    email: employee.email,
    specialization: employee.services?.[0]?.name || "Общие услуги",
    activeClients: requests?.filter(req => req.employee_id === employee.id).length || 0
  })) || [];

  function getStatusLabel(status: number): string {
    switch (status) {
      case 0: return "new";
      case 1: return "in-progress";
      case 2: return "completed";
      default: return "unknown";
    }
  }

  const updateApplicationStatus = async (id: number, newStatus: string) => {
    try {
      const statusMap: { [key: string]: number } = {
        'new': 0,
        'in-progress': 1,
        'completed': 2
      };
      
      const statusValue = statusMap[newStatus];
      if (statusValue !== undefined) {
        await apiClient.updateRequestStatus(id, statusValue);
        refetchRequests();
        toast({
          title: "Статус обновлен",
          description: `Заявка №${id} переведена в статус: ${newStatus}`,
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус заявки",
        variant: "destructive",
      });
    }
  };

  const assignManager = async (applicationId: number, managerName: string) => {
    try {
      const employee = employees?.find(emp => `${emp.name} ${emp.last_name}` === managerName);
      if (employee) {
        await apiClient.assignEmployee(applicationId, employee.id);
        refetchRequests();
        toast({
          title: "Сотрудник назначен",
          description: `Заявка №${applicationId} назначена сотруднику ${managerName}`,
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось назначить сотрудника",
        variant: "destructive",
      });
    }
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
