
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, TrendingUp, CheckCircle, Clock, AlertTriangle, Calendar, Search } from 'lucide-react';

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

interface CRMStatsPanelProps {
  managers: Manager[];
  applications: Application[];
}

const CRMStatsPanel = ({ managers, applications }: CRMStatsPanelProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');

  // Получаем статистику для каждого менеджера
  const getManagerStats = (managerName: string) => {
    const managerApps = applications.filter(app => app.assignedManager === managerName);
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const getFilteredApps = (period: string) => {
      switch (period) {
        case 'today':
          return managerApps.filter(app => app.createdDate === todayStr);
        case 'week':
          return managerApps.filter(app => new Date(app.createdDate) >= weekAgo);
        case 'month':
          return managerApps.filter(app => new Date(app.createdDate) >= monthAgo);
        default:
          return managerApps;
      }
    };

    const filteredApps = getFilteredApps(selectedPeriod);

    return {
      total: filteredApps.length,
      new: filteredApps.filter(app => app.status === 'new').length,
      inProgress: filteredApps.filter(app => app.status === 'in-progress').length,
      completed: filteredApps.filter(app => app.status === 'completed').length,
      highPriority: filteredApps.filter(app => app.priority === 'high').length,
      efficiency: filteredApps.length > 0 ? Math.round((filteredApps.filter(app => app.status === 'completed').length / filteredApps.length) * 100) : 0
    };
  };

  const filteredManagers = useMemo(() => {
    return managers.filter(manager => 
      manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [managers, searchTerm]);

  const totalStats = useMemo(() => {
    const allStats = filteredManagers.map(manager => getManagerStats(manager.name));
    return {
      totalApplications: allStats.reduce((sum, stats) => sum + stats.total, 0),
      totalCompleted: allStats.reduce((sum, stats) => sum + stats.completed, 0),
      totalInProgress: allStats.reduce((sum, stats) => sum + stats.inProgress, 0),
      averageEfficiency: allStats.length > 0 ? Math.round(allStats.reduce((sum, stats) => sum + stats.efficiency, 0) / allStats.length) : 0
    };
  }, [filteredManagers, selectedPeriod]);

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'today': return 'за сегодня';
      case 'week': return 'за неделю';
      case 'month': return 'за месяц';
      default: return 'за всё время';
    }
  };

  return (
    <div className="space-y-6">
      {/* Общая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Всего заявок</p>
                <p className="text-2xl font-bold text-blue-900">{totalStats.totalApplications}</p>
                <p className="text-xs text-blue-500">{getPeriodLabel()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Завершено</p>
                <p className="text-2xl font-bold text-green-900">{totalStats.totalCompleted}</p>
                <p className="text-xs text-green-500">{getPeriodLabel()}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">В работе</p>
                <p className="text-2xl font-bold text-yellow-900">{totalStats.totalInProgress}</p>
                <p className="text-xs text-yellow-500">{getPeriodLabel()}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Эффективность</p>
                <p className="text-2xl font-bold text-purple-900">{totalStats.averageEfficiency}%</p>
                <p className="text-xs text-purple-500">средняя по команде</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={20} />
            Статистика по менеджерам
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Поиск менеджера..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <Calendar size={16} className="mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Сегодня</SelectItem>
                <SelectItem value="week">За неделю</SelectItem>
                <SelectItem value="month">За месяц</SelectItem>
                <SelectItem value="all">За всё время</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Таблица менеджеров */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Менеджер</TableHead>
                  <TableHead className="font-semibold text-center">Всего заявок</TableHead>
                  <TableHead className="font-semibold text-center">Новые</TableHead>
                  <TableHead className="font-semibold text-center">В работе</TableHead>
                  <TableHead className="font-semibold text-center">Завершено</TableHead>
                  <TableHead className="font-semibold text-center">Приоритетные</TableHead>
                  <TableHead className="font-semibold text-center">Эффективность</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredManagers.map((manager) => {
                  const stats = getManagerStats(manager.name);
                  return (
                    <TableRow key={manager.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{manager.name}</div>
                          <div className="text-sm text-gray-500">{manager.specialization}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-semibold">
                          {stats.total}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-blue-100 text-blue-800">
                          {stats.new}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">
                          {stats.inProgress}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-green-100 text-green-800">
                          {stats.completed}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {stats.highPriority > 0 ? (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertTriangle size={12} className="mr-1" />
                            {stats.highPriority}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className={`w-16 h-2 rounded-full bg-gray-200 overflow-hidden`}>
                            <div 
                              className={`h-full transition-all duration-300 ${
                                stats.efficiency >= 80 ? 'bg-green-500' :
                                stats.efficiency >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${stats.efficiency}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{stats.efficiency}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Инструкция для пользователя */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Как читать статистику:</p>
              <ul className="space-y-1 text-xs">
                <li>• <strong>Эффективность</strong> - процент завершённых заявок от общего количества</li>
                <li>• <strong>Зелёная полоска</strong> - эффективность выше 80%</li>
                <li>• <strong>Жёлтая полоска</strong> - эффективность 60-80%</li>
                <li>• <strong>Красная полоска</strong> - эффективность ниже 60%</li>
                <li>• Используйте фильтр периода для анализа работы за разные промежутки времени</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMStatsPanel;
