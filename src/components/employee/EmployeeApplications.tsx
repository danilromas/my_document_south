
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Briefcase, Search, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface Application {
  id: number;
  clientName: string;
  clientEmail: string;
  type: string;
  status: string;
  priority: string;
  createdDate: string;
  assignedManager: string;
  description: string;
  deadline: string;
}

interface EmployeeApplicationsProps {
  applications: Application[];
  onStatusChange: (id: number, newStatus: string) => void;
}

const EmployeeApplications = ({ applications, onStatusChange }: EmployeeApplicationsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = app.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || app.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [applications, searchTerm, statusFilter, priorityFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertTriangle size={16} className="text-blue-500" />;
      case 'in-progress': return <Clock size={16} className="text-yellow-500" />;
      case 'review': return <Clock size={16} className="text-purple-500" />;
      case 'completed': return <CheckCircle size={16} className="text-green-500" />;
      default: return null;
    }
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isDeadlineSoon = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return diffDays <= 2 && diffDays >= 0;
  };

  const isOverdue = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    return deadlineDate < today;
  };

  // Статистика для карточек
  const stats = {
    total: applications.length,
    new: applications.filter(app => app.status === 'new').length,
    inProgress: applications.filter(app => app.status === 'in-progress').length,
    completed: applications.filter(app => app.status === 'completed').length,
    overdue: applications.filter(app => isOverdue(app.deadline) && app.status !== 'completed').length
  };

  return (
    <div className="space-y-6">
      {/* Статистические карточки */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Всего заявок</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Новые</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.new}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">В работе</p>
                <p className="text-2xl font-bold text-orange-900">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Завершено</p>
                <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Просрочено</p>
                <p className="text-2xl font-bold text-red-900">{stats.overdue}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Основная таблица заявок */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase size={20} />
            Мои заявки
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Фильтры */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Поиск по клиенту или типу заявки..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="new">Новые</SelectItem>
                <SelectItem value="in-progress">В работе</SelectItem>
                <SelectItem value="review">На проверке</SelectItem>
                <SelectItem value="completed">Завершенные</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Приоритет" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все приоритеты</SelectItem>
                <SelectItem value="high">Высокий</SelectItem>
                <SelectItem value="medium">Средний</SelectItem>
                <SelectItem value="low">Низкий</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Таблица */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Клиент</TableHead>
                  <TableHead className="font-semibold">Тип заявки</TableHead>
                  <TableHead className="font-semibold">Статус</TableHead>
                  <TableHead className="font-semibold">Приоритет</TableHead>
                  <TableHead className="font-semibold">Дедлайн</TableHead>
                  <TableHead className="font-semibold">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app) => (
                  <TableRow key={app.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{app.clientName}</div>
                        <div className="text-sm text-gray-500">{app.clientEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{app.type}</div>
                        <div className="text-sm text-gray-500">{app.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(app.status)}
                        <Badge className={
                          app.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          app.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'review' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {getStatusLabel(app.status)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(app.priority)}>
                        {app.priority === 'high' ? 'Высокий' : 
                         app.priority === 'medium' ? 'Средний' : 'Низкий'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`font-medium ${
                        isOverdue(app.deadline) && app.status !== 'completed' ? 'text-red-600' :
                        isDeadlineSoon(app.deadline) && app.status !== 'completed' ? 'text-orange-600' :
                        'text-gray-900'
                      }`}>
                        {new Date(app.deadline).toLocaleDateString('ru-RU')}
                        {isOverdue(app.deadline) && app.status !== 'completed' && (
                          <span className="text-xs block text-red-500">Просрочено</span>
                        )}
                        {isDeadlineSoon(app.deadline) && app.status !== 'completed' && !isOverdue(app.deadline) && (
                          <span className="text-xs block text-orange-500">Скоро дедлайн</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select onValueChange={(value) => onStatusChange(app.id, value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Изменить статус" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Новая</SelectItem>
                          <SelectItem value="in-progress">В работе</SelectItem>
                          <SelectItem value="review">На проверке</SelectItem>
                          <SelectItem value="completed">Завершена</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Briefcase size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Заявки не найдены</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeApplications;
