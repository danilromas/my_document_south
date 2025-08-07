
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { User, Calendar, AlertCircle, FileText, Clock, Mail, Phone, MapPin } from 'lucide-react';

interface Application {
  id: number;
  clientName: string;
  clientEmail: string;
  type: string;
  status: string;
  priority: string;
  createdDate: string;
  assignedManager: string | null;
  description: string;
}

interface Manager {
  id: number;
  name: string;
  email: string;
  specialization: string;
  activeClients: number;
}

interface ApplicationDetailModalProps {
  application: Application | null;
  managers: Manager[];
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: number, newStatus: string) => void;
  onAssignManager: (applicationId: number, managerName: string) => void;
}

const ApplicationDetailModal = ({ 
  application, 
  managers, 
  isOpen, 
  onClose, 
  onStatusChange, 
  onAssignManager 
}: ApplicationDetailModalProps) => {
  if (!application) return null;

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">Высокий</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800">Средний</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Низкий</Badge>;
      default:
        return <Badge variant="secondary">Обычный</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800">Новая</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-100 text-yellow-800">В работе</Badge>;
      case 'review':
        return <Badge className="bg-purple-100 text-purple-800">На проверке</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Завершена</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText size={24} />
            Заявка #{application.id}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Основная информация */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User size={20} />
                  Информация о клиенте
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Имя клиента</label>
                    <p className="text-lg font-semibold">{application.clientName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <p>{application.clientEmail}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText size={20} />
                  Детали заявки
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Тип заявки</label>
                  <p className="text-lg">{application.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Описание</label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800">{application.description}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Комментарии</label>
                  <Textarea 
                    placeholder="Добавить комментарий к заявке..."
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={20} />
                  Статус и приоритет
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Текущий статус</label>
                  {getStatusBadge(application.status)}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Изменить статус</label>
                  <Select
                    value={application.status}
                    onValueChange={(value) => onStatusChange(application.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Новая</SelectItem>
                      <SelectItem value="in-progress">В работе</SelectItem>
                      <SelectItem value="review">На проверке</SelectItem>
                      <SelectItem value="completed">Завершена</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Приоритет</label>
                  {getPriorityBadge(application.priority)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User size={20} />
                  Назначение
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Текущий менеджер</label>
                  {application.assignedManager ? (
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                      <User size={16} className="text-blue-600" />
                      <span className="text-blue-800 font-medium">{application.assignedManager}</span>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Не назначен</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Назначить менеджера</label>
                  <Select
                    value={application.assignedManager || "unassigned"}
                    onValueChange={(value) => onAssignManager(application.id, value === "unassigned" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите менеджера" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Не назначен</SelectItem>
                      {managers.map((manager) => (
                        <SelectItem key={manager.id} value={manager.name}>
                          {manager.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={20} />
                  Временные метки
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Дата создания</label>
                  <p className="text-sm">{application.createdDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Последнее обновление</label>
                  <p className="text-sm">{new Date().toLocaleDateString('ru-RU')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Закрыть
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              Печать
            </Button>
            <Button>
              Сохранить изменения
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailModal;
