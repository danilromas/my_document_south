
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { User, Mail, Briefcase, Users, Search, Filter } from 'lucide-react';

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

interface ManagerAssignmentPanelProps {
  managers: Manager[];
  applications: Application[];
  onAssignManager: (applicationId: number, managerName: string) => void;
}

const ManagerAssignmentPanel = ({ managers, applications, onAssignManager }: ManagerAssignmentPanelProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getManagerStats = (managerName: string) => {
    const assignedApps = applications.filter(app => app.assignedManager === managerName);
    return {
      total: assignedApps.length,
      new: assignedApps.filter(app => app.status === 'new').length,
      inProgress: assignedApps.filter(app => app.status === 'in-progress').length,
      completed: assignedApps.filter(app => app.status === 'completed').length
    };
  };

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = app.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'unassigned' && !app.assignedManager) ||
                           (statusFilter !== 'unassigned' && app.status === statusFilter);
      
      const matchesPriority = priorityFilter === 'all' || app.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [applications, searchTerm, statusFilter, priorityFilter]);

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Статистика менеджеров */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {managers.map((manager) => {
          const stats = getManagerStats(manager.name);
          return (
            <Card key={manager.id} className="bg-white shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User size={20} />
                  {manager.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} />
                  {manager.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase size={14} />
                  {manager.specialization}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="font-semibold text-blue-800">{stats.new}</div>
                    <div className="text-blue-600">Новые</div>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded">
                    <div className="font-semibold text-yellow-800">{stats.inProgress}</div>
                    <div className="text-yellow-600">В работе</div>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <div className="font-semibold text-green-800">{stats.completed}</div>
                    <div className="text-green-600">Завершено</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="font-semibold text-gray-800">{stats.total}</div>
                    <div className="text-gray-600">Всего</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Панель управления заявками */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            Управление заявками
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Фильтры и поиск */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Поиск заявок..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="unassigned">Неназначенные</SelectItem>
                <SelectItem value="new">Новые</SelectItem>
                <SelectItem value="in-progress">В работе</SelectItem>
                <SelectItem value="review">На проверке</SelectItem>
                <SelectItem value="completed">Завершенные</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Приоритет" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все приоритеты</SelectItem>
                <SelectItem value="high">Высокий</SelectItem>
                <SelectItem value="medium">Средний</SelectItem>
                <SelectItem value="low">Низкий</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Filter size={16} />
              <span className="text-sm text-gray-600">
                {filteredApplications.length} из {applications.length}
              </span>
            </div>
          </div>

          {/* Таблица заявок */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Тип заявки</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Приоритет</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Менеджер</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{app.clientName}</div>
                        <div className="text-sm text-gray-500">{app.clientEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{app.type}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          app.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          app.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'review' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }
                      >
                        {app.status === 'new' ? 'Новая' :
                         app.status === 'in-progress' ? 'В работе' :
                         app.status === 'review' ? 'На проверке' : 'Завершена'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          app.priority === 'high' ? 'bg-red-100 text-red-800' :
                          app.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }
                      >
                        {app.priority === 'high' ? 'Высокий' : 
                         app.priority === 'medium' ? 'Средний' : 'Низкий'}
                      </Badge>
                    </TableCell>
                    <TableCell>{app.createdDate}</TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {app.assignedManager || 'Не назначен'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select onValueChange={(value) => onAssignManager(app.id, value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Назначить" />
                        </SelectTrigger>
                        <SelectContent>
                          {managers.map((manager) => (
                            <SelectItem key={manager.id} value={manager.name}>
                              {manager.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>

      {/* Общая статистика */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle>Общая статистика</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">{applications.length}</div>
              <div className="text-blue-600">Всего заявок</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-800">{managers.length}</div>
              <div className="text-green-600">Менеджеров</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-800">
                {applications.filter(app => app.status === 'in-progress').length}
              </div>
              <div className="text-yellow-600">В работе</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-800">
                {applications.filter(app => !app.assignedManager).length}
              </div>
              <div className="text-purple-600">Неназначенных</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerAssignmentPanel;
