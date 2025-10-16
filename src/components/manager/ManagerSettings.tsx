
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Settings, Users, Bell, Database, Mail, Shield, Palette, Globe, UserPlus } from 'lucide-react';
import CreateEmployeeModal from './CreateEmployeeModal';

const ManagerSettings = () => {
  const [showCreateEmployeeModal, setShowCreateEmployeeModal] = useState(false);
  const [settings, setSettings] = useState({
    // Общие настройки
    companyName: 'Наша Компания',
    timezone: 'Europe/Moscow',
    language: 'ru',
    workingHours: '9:00-18:00',
    
    // Уведомления
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    
    // Автоматизация
    autoAssignment: true,
    priorityEscalation: true,
    reminderNotifications: true,
    statusAutoUpdate: false,
    
    // Безопасность
    twoFactorAuth: false,
    sessionTimeout: '30',
    ipWhitelist: '',
    dataRetention: '365',
    
    // Интеграции
    emailProvider: 'gmail',
    crmIntegration: false,
    calendarSync: true,
    backupFrequency: 'daily',
  });

  const [managers, setManagers] = useState([
    { id: 1, name: "Алексей Иванов", email: "alexey@company.com", role: "Старший менеджер", active: true },
    { id: 2, name: "Елена Смирнова", email: "elena@company.com", role: "Менеджер", active: true },
    { id: 3, name: "Михаил Петров", email: "mikhail@company.com", role: "Менеджер", active: false },
    { id: 4, name: "Ольга Новикова", email: "olga@company.com", role: "Junior менеджер", active: true },
  ]);

  const [newManager, setNewManager] = useState({
    name: '',
    email: '',
    role: 'Менеджер',
    specialization: '',
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    toast({
      title: "Настройки сохранены",
      description: "Все изменения успешно применены.",
    });
  };

  const handleAddManager = () => {
    if (newManager.name && newManager.email) {
      const manager = {
        id: managers.length + 1,
        ...newManager,
        active: true,
      };
      setManagers(prev => [...prev, manager]);
      setNewManager({ name: '', email: '', role: 'Менеджер', specialization: '' });
      toast({
        title: "Менеджер добавлен",
        description: `${newManager.name} успешно добавлен в команду.`,
      });
    }
  };

  const toggleManagerStatus = (id: number) => {
    setManagers(prev => 
      prev.map(manager => 
        manager.id === id ? { ...manager, active: !manager.active } : manager
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Настройки системы</h2>
        <p className="text-gray-600">Управление конфигурацией CRM системы</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings size={16} />
            Общие
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users size={16} />
            Команда
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell size={16} />
            Уведомления
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Database size={16} />
            Автоматизация
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield size={16} />
            Безопасность
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Globe size={16} />
            Интеграции
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Основные настройки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Название компании</Label>
                  <Input
                    id="companyName"
                    value={settings.companyName}
                    onChange={(e) => handleSettingChange('companyName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Часовой пояс</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Moscow">Москва (UTC+3)</SelectItem>
                      <SelectItem value="Europe/Kiev">Киев (UTC+2)</SelectItem>
                      <SelectItem value="Europe/London">Лондон (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Язык системы</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ru">Русский</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="uk">Українська</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workingHours">Рабочие часы</Label>
                  <Input
                    id="workingHours"
                    value={settings.workingHours}
                    onChange={(e) => handleSettingChange('workingHours', e.target.value)}
                    placeholder="9:00-18:00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Управление сотрудниками
                <Button 
                  onClick={() => setShowCreateEmployeeModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <UserPlus size={16} className="mr-2" />
                  Создать сотрудника
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  placeholder="Имя и фамилия"
                  value={newManager.name}
                  onChange={(e) => setNewManager(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={newManager.email}
                  onChange={(e) => setNewManager(prev => ({ ...prev, email: e.target.value }))}
                />
                <Select value={newManager.role} onValueChange={(value) => setNewManager(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Роль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Старший менеджер">Старший менеджер</SelectItem>
                    <SelectItem value="Менеджер">Менеджер</SelectItem>
                    <SelectItem value="Junior менеджер">Junior менеджер</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Специализация"
                  value={newManager.specialization}
                  onChange={(e) => setNewManager(prev => ({ ...prev, specialization: e.target.value }))}
                />
              </div>
              <Button onClick={handleAddManager} className="w-full">
                Добавить менеджера
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Список менеджеров</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {managers.map((manager) => (
                  <div key={manager.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{manager.name}</p>
                        <p className="text-sm text-gray-600">{manager.email}</p>
                      </div>
                      <Badge variant={manager.active ? "default" : "secondary"}>
                        {manager.role}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={manager.active ? "default" : "secondary"}>
                        {manager.active ? "Активен" : "Неактивен"}
                      </Badge>
                      <Switch
                        checked={manager.active}
                        onCheckedChange={() => toggleManagerStatus(manager.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Настройки уведомлений</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email уведомления</Label>
                    <p className="text-sm text-gray-600">Получать уведомления на почту</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push уведомления</Label>
                    <p className="text-sm text-gray-600">Уведомления в браузере</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS уведомления</Label>
                    <p className="text-sm text-gray-600">Получать SMS для важных событий</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Еженедельные отчёты</Label>
                    <p className="text-sm text-gray-600">Автоматические отчёты по понедельникам</p>
                  </div>
                  <Switch
                    checked={settings.weeklyReports}
                    onCheckedChange={(checked) => handleSettingChange('weeklyReports', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Автоматизация процессов</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Автоназначение заявок</Label>
                    <p className="text-sm text-gray-600">Автоматически назначать заявки менеджерам</p>
                  </div>
                  <Switch
                    checked={settings.autoAssignment}
                    onCheckedChange={(checked) => handleSettingChange('autoAssignment', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Эскалация приоритета</Label>
                    <p className="text-sm text-gray-600">Повышать приоритет долго висящих заявок</p>
                  </div>
                  <Switch
                    checked={settings.priorityEscalation}
                    onCheckedChange={(checked) => handleSettingChange('priorityEscalation', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Напоминания</Label>
                    <p className="text-sm text-gray-600">Отправлять напоминания о просроченных задачах</p>
                  </div>
                  <Switch
                    checked={settings.reminderNotifications}
                    onCheckedChange={(checked) => handleSettingChange('reminderNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Автообновление статусов</Label>
                    <p className="text-sm text-gray-600">Автоматически обновлять статусы заявок</p>
                  </div>
                  <Switch
                    checked={settings.statusAutoUpdate}
                    onCheckedChange={(checked) => handleSettingChange('statusAutoUpdate', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Настройки безопасности</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Двухфакторная аутентификация</Label>
                    <p className="text-sm text-gray-600">Дополнительная защита учётных записей</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Таймаут сессии (минуты)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Хранение данных (дни)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    value={settings.dataRetention}
                    onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ipWhitelist">Белый список IP (через запятую)</Label>
                  <Textarea
                    id="ipWhitelist"
                    value={settings.ipWhitelist}
                    onChange={(e) => handleSettingChange('ipWhitelist', e.target.value)}
                    placeholder="192.168.1.1, 10.0.0.1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Интеграции с внешними сервисами</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Почтовый провайдер</Label>
                  <Select value={settings.emailProvider} onValueChange={(value) => handleSettingChange('emailProvider', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gmail">Gmail</SelectItem>
                      <SelectItem value="outlook">Outlook</SelectItem>
                      <SelectItem value="yandex">Яндекс.Почта</SelectItem>
                      <SelectItem value="custom">Настраиваемый SMTP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Интеграция с CRM</Label>
                    <p className="text-sm text-gray-600">Синхронизация с внешней CRM системой</p>
                  </div>
                  <Switch
                    checked={settings.crmIntegration}
                    onCheckedChange={(checked) => handleSettingChange('crmIntegration', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Синхронизация календаря</Label>
                    <p className="text-sm text-gray-600">Интеграция с Google Calendar / Outlook</p>
                  </div>
                  <Switch
                    checked={settings.calendarSync}
                    onCheckedChange={(checked) => handleSettingChange('calendarSync', checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Частота резервного копирования</Label>
                  <Select value={settings.backupFrequency} onValueChange={(value) => handleSettingChange('backupFrequency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Каждый час</SelectItem>
                      <SelectItem value="daily">Ежедневно</SelectItem>
                      <SelectItem value="weekly">Еженедельно</SelectItem>
                      <SelectItem value="monthly">Ежемесячно</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline">
          Сбросить настройки
        </Button>
        <Button onClick={handleSaveSettings}>
          Сохранить изменения
        </Button>
      </div>

      {/* Модальное окно создания сотрудника */}
      <CreateEmployeeModal 
        open={showCreateEmployeeModal} 
        onOpenChange={setShowCreateEmployeeModal}
        onEmployeeCreated={() => {
          // Можно добавить логику обновления списка сотрудников
          toast({
            title: "Сотрудник создан",
            description: "Новый сотрудник добавлен в систему",
          });
        }}
      />
    </div>
  );
};

export default ManagerSettings;
