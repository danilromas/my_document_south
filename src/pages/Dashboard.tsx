
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  FileText, 
  Upload, 
  MessageCircle, 
  CreditCard
} from 'lucide-react';
import Header from '@/components/Header';
import NewApplicationModal from '@/components/NewApplicationModal';
import UploadDocumentModal from '@/components/UploadDocumentModal';
import UserProfileCard from '@/components/dashboard/UserProfileCard';
import QuickActionsCard from '@/components/dashboard/QuickActionsCard';
import RecentApplicationsCard from '@/components/dashboard/RecentApplicationsCard';
import ApplicationsList from '@/components/dashboard/ApplicationsList';
import DocumentsList from '@/components/dashboard/DocumentsList';
import ChatSection from '@/components/dashboard/ChatSection';
import PaymentsSection from '@/components/dashboard/PaymentsSection';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewApplicationModal, setShowNewApplicationModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Mock данные
  const userInfo = {
    name: "Иван Петров",
    email: "ivan.petrov@email.com", 
    phone: "+7 (999) 123-45-67",
    tariff: "Бизнес",
    joinDate: "15 марта 2024"
  };

  const applications = [
    {
      id: 1,
      type: "Регистрация ИП",
      status: "completed",
      date: "2024-03-20",
      description: "Регистрация индивидуального предпринимателя"
    },
    {
      id: 2,
      type: "Создание сайта",
      status: "in-progress",
      date: "2024-03-22",
      description: "Разработка корпоративного сайта"
    },
    {
      id: 3,
      type: "Настройка рекламы",
      status: "pending",
      date: "2024-03-25",
      description: "Настройка контекстной рекламы"
    }
  ];

  const documents = [
    { id: 1, name: "Свидетельство о регистрации ИП.pdf", date: "2024-03-20", size: "2.3 MB" },
    { id: 2, name: "Справка о налоговой.pdf", date: "2024-03-18", size: "1.2 MB" },
    { id: 3, name: "Договор аренды.pdf", date: "2024-03-15", size: "890 KB" }
  ];

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
                onUploadDocument={() => setShowUploadModal(true)}
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
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Мои документы</h2>
              <Button 
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <Upload size={16} className="mr-2" />
                Загрузить документ
              </Button>
            </div>
            <DocumentsList documents={documents} />
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
      />
      <UploadDocumentModal 
        open={showUploadModal} 
        onOpenChange={setShowUploadModal} 
      />
    </div>
  );
};

export default Dashboard;
