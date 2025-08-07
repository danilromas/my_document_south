
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Users, Clock, CheckCircle, AlertTriangle, Calendar, Target, Activity } from 'lucide-react';

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

interface CRMAnalyticsProps {
  managers: Manager[];
  applications: Application[];
}

const CRMAnalytics = ({ managers, applications }: CRMAnalyticsProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('applications');

  // Генерируем данные для графиков
  const generateTimeSeriesData = () => {
    const days = 7;
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayApplications = applications.filter(app => app.createdDate === dateStr);
      
      data.push({
        date: date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }),
        applications: dayApplications.length,
        completed: dayApplications.filter(app => app.status === 'completed').length,
        inProgress: dayApplications.filter(app => app.status === 'in-progress').length,
        new: dayApplications.filter(app => app.status === 'new').length,
      });
    }
    return data;
  };

  const timeSeriesData = generateTimeSeriesData();

  // Данные по типам заявок
  const applicationTypeData = useMemo(() => {
    const typeCount = applications.reduce((acc, app) => {
      acc[app.type] = (acc[app.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCount).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / applications.length) * 100)
    }));
  }, [applications]);

  // Производительность менеджеров
  const managerPerformanceData = useMemo(() => {
    return managers.map(manager => {
      const managerApps = applications.filter(app => app.assignedManager === manager.name);
      const completed = managerApps.filter(app => app.status === 'completed').length;
      const efficiency = managerApps.length > 0 ? Math.round((completed / managerApps.length) * 100) : 0;
      
      return {
        name: manager.name.split(' ')[0],
        total: managerApps.length,
        completed,
        efficiency,
        pending: managerApps.filter(app => app.status === 'new').length,
        inProgress: managerApps.filter(app => app.status === 'in-progress').length,
      };
    });
  }, [managers, applications]);

  const totalApplications = applications.length;
  const completedApplications = applications.filter(app => app.status === 'completed').length;
  const pendingApplications = applications.filter(app => app.status === 'new').length;
  const inProgressApplications = applications.filter(app => app.status === 'in-progress').length;
  const overallEfficiency = totalApplications > 0 ? Math.round((completedApplications / totalApplications) * 100) : 0;
  const highPriorityApps = applications.filter(app => app.priority === 'high').length;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const chartConfig = {
    applications: {
      label: "Заявки",
      color: "#3b82f6",
    },
    completed: {
      label: "Завершено",
      color: "#10b981",
    },
    inProgress: {
      label: "В работе",
      color: "#f59e0b",
    },
    new: {
      label: "Новые",
      color: "#6b7280",
    },
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Всего заявок</p>
                <p className="text-3xl font-bold text-blue-900">{totalApplications}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-xs text-blue-600">+12% за месяц</span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Эффективность</p>
                <p className="text-3xl font-bold text-green-900">{overallEfficiency}%</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+5% за неделю</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">В работе</p>
                <p className="text-3xl font-bold text-yellow-900">{inProgressApplications}</p>
                <div className="flex items-center mt-2">
                  <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-xs text-yellow-600">Средний срок: 3.2 дня</span>
                </div>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Приоритетные</p>
                <p className="text-3xl font-bold text-red-900">{highPriorityApps}</p>
                <div className="flex items-center mt-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-xs text-red-600">Требуют внимания</span>
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="trends" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="trends">Тренды</TabsTrigger>
            <TabsTrigger value="performance">Производительность</TabsTrigger>
            <TabsTrigger value="distribution">Распределение</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Неделя</SelectItem>
                <SelectItem value="month">Месяц</SelectItem>
                <SelectItem value="quarter">Квартал</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  Динамика заявок
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="applications" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="completed" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Статусы заявок
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="new" fill="#6b7280" />
                      <Bar dataKey="inProgress" fill="#f59e0b" />
                      <Bar dataKey="completed" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} />
                Производительность менеджеров
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={managerPerformanceData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="total" fill="#3b82f6" name="Всего заявок" />
                    <Bar dataKey="completed" fill="#10b981" name="Завершено" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Распределение по типам заявок</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={applicationTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        label={({ type, percentage }) => `${type} (${percentage}%)`}
                      >
                        {applicationTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Эффективность по менеджерам</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {managerPerformanceData.map((manager, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{manager.name}</p>
                        <p className="text-sm text-gray-600">{manager.total} заявок</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              manager.efficiency >= 80 ? 'bg-green-500' :
                              manager.efficiency >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${manager.efficiency}%` }}
                          />
                        </div>
                        <Badge variant="outline">{manager.efficiency}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMAnalytics;
