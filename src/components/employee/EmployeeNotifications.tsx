
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, BellRing, AlertTriangle, CheckCircle, Info, Trash2 } from 'lucide-react';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface EmployeeNotificationsProps {
  notifications: Notification[];
  onMarkRead: (id: number) => void;
}

const EmployeeNotifications = ({ notifications, onMarkRead }: EmployeeNotificationsProps) => {
  const [filter, setFilter] = useState('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_application':
        return <BellRing size={20} className="text-blue-500" />;
      case 'deadline_warning':
        return <AlertTriangle size={20} className="text-orange-500" />;
      case 'status_update':
        return <CheckCircle size={20} className="text-green-500" />;
      default:
        return <Info size={20} className="text-gray-500" />;
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'new_application': return 'Новая заявка';
      case 'deadline_warning': return 'Дедлайн';
      case 'status_update': return 'Обновление';
      default: return 'Уведомление';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        onMarkRead(notification.id);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Заголовок с статистикой */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={20} />
              Уведомления
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount} новых
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
                  <SelectItem value="unread">Непрочитанные</SelectItem>
                  <SelectItem value="read">Прочитанные</SelectItem>
                </SelectContent>
              </Select>
              
              {unreadCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-blue-600 border-blue-600"
                >
                  Отметить все как прочитанные
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">{notifications.length}</div>
              <div className="text-blue-600 text-sm">Всего</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-800">{unreadCount}</div>
              <div className="text-red-600 text-sm">Непрочитанные</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-800">{notifications.length - unreadCount}</div>
              <div className="text-green-600 text-sm">Прочитанные</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Список уведомлений */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">
                {filter === 'unread' ? 'Нет непрочитанных уведомлений' : 
                 filter === 'read' ? 'Нет прочитанных уведомлений' : 
                 'Нет уведомлений'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                !notification.read ? 'border-blue-200 bg-blue-50' : 'bg-white'
              }`}
              onClick={() => !notification.read && onMarkRead(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              notification.type === 'new_application' ? 'border-blue-300 text-blue-700' :
                              notification.type === 'deadline_warning' ? 'border-orange-300 text-orange-700' :
                              'border-green-300 text-green-700'
                            }`}
                          >
                            {getNotificationTypeLabel(notification.type)}
                          </Badge>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className={`text-sm ${!notification.read ? 'text-gray-800' : 'text-gray-600'}`}>
                          {notification.message}
                        </p>
                        
                        <p className="text-xs text-gray-500 mt-2">
                          {notification.timestamp}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkRead(notification.id);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Отметить как прочитанное
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Инструкция */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Уведомления:</p>
              <ul className="space-y-1 text-xs">
                <li>• <strong>Синий кружок</strong> - непрочитанное уведомление</li>
                <li>• <strong>Новая заявка</strong> - вам назначена новая заявка для выполнения</li>
                <li>• <strong>Дедлайн</strong> - приближается срок выполнения заявки</li>
                <li>• <strong>Обновление</strong> - статус заявки был изменен</li>
                <li>• Нажмите на уведомление, чтобы отметить его как прочитанное</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeNotifications;
