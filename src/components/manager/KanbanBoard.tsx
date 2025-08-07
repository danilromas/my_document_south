import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Calendar, User, AlertCircle, CheckCircle, Clock, Eye, Search, Filter, ChevronUp, ChevronDown } from 'lucide-react';
import ApplicationDetailModal from './ApplicationDetailModal';

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

interface KanbanBoardProps {
  applications: Application[];
  onStatusChange: (id: number, newStatus: string) => void;
  onAssignManager: (applicationId: number, managerName: string) => void;
  managers: Manager[];
}

type SortField = 'clientName' | 'type' | 'status' | 'priority' | 'createdDate' | 'assignedManager';
type SortDirection = 'asc' | 'desc';

const KanbanBoard = ({ applications, onStatusChange, onAssignManager, managers }: KanbanBoardProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [managerFilter, setManagerFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [sortField, setSortField] = useState<SortField>('createdDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenApplication = (application: Application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedApplications = useMemo(() => {
    let filtered = applications.filter(app => {
      const matchesSearch = app.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPriority = priorityFilter === 'all' || app.priority === priorityFilter;
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesManager = managerFilter === 'all' || 
                           (managerFilter === 'unassigned' && !app.assignedManager) ||
                           (managerFilter !== 'unassigned' && app.assignedManager === managerFilter);
      
      return matchesSearch && matchesPriority && matchesStatus && matchesManager;
    });

    // Сортировка
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortField] || '';
      let bValue: string | number = b[sortField] || '';
      
      if (sortField === 'createdDate') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [applications, searchTerm, priorityFilter, statusFilter, managerFilter, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredAndSortedApplications.slice(startIndex, startIndex + itemsPerPage);

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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp size={14} className="inline ml-1" /> : 
      <ChevronDown size={14} className="inline ml-1" />;
  };

  return (
    <div className="space-y-6">
      {/* Панель управления */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} />
            Управление заявками
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <div className="relative col-span-2">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Поиск по всем полям..."
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

            <Select value={managerFilter} onValueChange={setManagerFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Менеджер" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все менеджеры</SelectItem>
                {managers.map((manager) => (
                  <SelectItem key={manager.id} value={manager.name}>
                    {manager.name}
                  </SelectItem>
                ))}
                <SelectItem value="unassigned">Неназначенные</SelectItem>
              </SelectContent>
            </Select>

            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="На странице" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 строк</SelectItem>
                <SelectItem value="50">50 строк</SelectItem>
                <SelectItem value="100">100 строк</SelectItem>
                <SelectItem value="200">200 строк</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Показано {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedApplications.length)} из {filteredAndSortedApplications.length} заявок</span>
            <span>Всего в системе: {applications.length}</span>
          </div>
        </CardContent>
      </Card>

      {/* Таблица заявок */}
      <Card className="bg-white shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 px-4 py-3"
                    onClick={() => handleSort('clientName')}
                  >
                    Клиент <SortIcon field="clientName" />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 px-4 py-3"
                    onClick={() => handleSort('type')}
                  >
                    Тип заявки <SortIcon field="type" />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 px-4 py-3"
                    onClick={() => handleSort('status')}
                  >
                    Статус <SortIcon field="status" />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 px-4 py-3"
                    onClick={() => handleSort('priority')}
                  >
                    Приоритет <SortIcon field="priority" />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 px-4 py-3"
                    onClick={() => handleSort('createdDate')}
                  >
                    Дата создания <SortIcon field="createdDate" />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 px-4 py-3"
                    onClick={() => handleSort('assignedManager')}
                  >
                    Менеджер <SortIcon field="assignedManager" />
                  </TableHead>
                  <TableHead className="px-4 py-3">Описание</TableHead>
                  <TableHead className="px-4 py-3">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedApplications.map((app, index) => (
                  <TableRow 
                    key={app.id} 
                    className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                  >
                    <TableCell className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">{app.clientName}</div>
                        <div className="text-sm text-gray-500">{app.clientEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">{app.type}</TableCell>
                    <TableCell className="px-4 py-3">
                      <Select
                        value={app.status}
                        onValueChange={(value) => onStatusChange(app.id, value)}
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Новая</SelectItem>
                          <SelectItem value="in-progress">В работе</SelectItem>
                          <SelectItem value="review">На проверке</SelectItem>
                          <SelectItem value="completed">Завершена</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {getPriorityBadge(app.priority)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm">{app.createdDate}</TableCell>
                    <TableCell className="px-4 py-3">
                      <Select
                        value={app.assignedManager || "unassigned"}
                        onValueChange={(value) => onAssignManager(app.id, value === "unassigned" ? "" : value)}
                      >
                        <SelectTrigger className="w-36 h-8">
                          <SelectValue placeholder="Назначить" />
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
                    </TableCell>
                    <TableCell className="px-4 py-3 max-w-xs">
                      <div className="text-sm text-gray-600 truncate" title={app.description}>
                        {app.description}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-xs"
                        onClick={() => handleOpenApplication(app)}
                      >
                        Открыть
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Модальное окно деталей заявки */}
      <ApplicationDetailModal
        application={selectedApplication}
        managers={managers}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStatusChange={onStatusChange}
        onAssignManager={onAssignManager}
      />
    </div>
  );
};

export default KanbanBoard;
