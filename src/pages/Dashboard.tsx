
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  FileText, 
  Upload, 
  MessageCircle, 
  CreditCard
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import NewApplicationModal from '@/components/NewApplicationModal';
import UserProfileCard from '@/components/dashboard/UserProfileCard';
import QuickActionsCard from '@/components/dashboard/QuickActionsCard';
import RecentApplicationsCard from '@/components/dashboard/RecentApplicationsCard';
import ApplicationsList from '@/components/dashboard/ApplicationsList';
import PersonalDataForm from '@/components/dashboard/PersonalDataForm';
import ChatSection from '@/components/dashboard/ChatSection';
import PaymentsSection from '@/components/dashboard/PaymentsSection';
import { apiClient, Request, User as UserType } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewApplicationModal, setShowNewApplicationModal] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Загружаем данные пользователя
  const { data: userData, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: () => apiClient.getUser(user?.id || 1),
    enabled: !!user?.id,
  });

  // Загружаем заявки пользователя
  const { data: requests, isLoading: requestsLoading, refetch: refetchRequests } = useQuery({
    queryKey: ['requests', user?.id],
    queryFn: () => apiClient.getRequests({ owner_id: user?.id }),
    enabled: !!user?.id,
  });

  // Преобразуем данные для отображения
  const userInfo = userData ? {
    name: `${userData.name} ${userData.last_name}`,
    email: userData.email,
    phone: userData.phone || "Не указан",
    tariff: userData.tariff?.name || "Не выбран",
    joinDate: new Date(userData.created_at).toLocaleDateString('ru-RU')
  } : {
    name: "Загрузка...",
    email: "",
    phone: "",
    tariff: "",
    joinDate: ""
  };

  const applications = requests?.map(request => ({
    id: request.id,
    type: request.service?.name || "Неизвестная услуга",
    status: getStatusLabel(request.status),
    date: new Date(request.created_at).toLocaleDateString('ru-RU'),
    description: `Заявка на услугу: ${request.service?.name || "Неизвестная услуга"}`
  })) || [];

  function getStatusLabel(status: number): string {
    switch (status) {
      case 0: return "pending";
      case 1: return "in-progress";
      case 2: return "completed";
      default: return "unknown";
    }
  }

  const handleRequestCreated = () => {
    refetchRequests();
    toast({
      title: "Заявка создана",
      description: "Новая заявка добавлена в ваш список",
    });
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-2">
            Личный кабинет
          </h1>
          <p className="text-gray-600 text-lg">Управляйте вашим бизнесом и заявками</p>
        </div>

        {/* Основной контент */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User size={16} />
              Обзор
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <FileText size={16} />
              Заявки
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <Upload size={16} />
              Документы
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle size={16} />
              Чат
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard size={16} />
              Платежи
            </TabsTrigger>
          </TabsList>

          {/* Обзор */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <UserProfileCard userInfo={userInfo} />
              <QuickActionsCard 
                onNewApplication={() => setShowNewApplicationModal(true)}
              />
            </div>
            <RecentApplicationsCard applications={applications} />
          </TabsContent>

          {/* Заявки */}
          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Мои заявки</h2>
              <Button 
                onClick={() => setShowNewApplicationModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                <FileText size={16} className="mr-2" />
                Создать заявку
              </Button>
            </div>
            <ApplicationsList applications={applications} />
          </TabsContent>

          {/* Документы */}
          <TabsContent value="documents" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Персональные данные</h2>
              <p className="text-gray-600">Заполните ваши персональные данные для ускорения обработки заявок</p>
            </div>
            <PersonalDataForm />
          </TabsContent>

          {/* Чат */}
          <TabsContent value="chat" className="space-y-6">
            <ChatSection />
          </TabsContent>

          {/* Платежи */}
          <TabsContent value="payments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">История платежей</h2>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                <CreditCard size={16} className="mr-2" />
                Оплатить услуги
              </Button>
            </div>
            <PaymentsSection />
          </TabsContent>
        </Tabs>
      </div>

      {/* Модальные окна */}
      <NewApplicationModal 
        open={showNewApplicationModal} 
        onOpenChange={setShowNewApplicationModal}
        onRequestCreated={handleRequestCreated}
      />
    </div>
  );
};

export default Dashboard;
