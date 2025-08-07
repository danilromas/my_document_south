
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Application {
  id: number;
  type: string;
  status: string;
  date: string;
  description: string;
}

interface RecentApplicationsCardProps {
  applications: Application[];
}

const RecentApplicationsCard = ({ applications }: RecentApplicationsCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle size={14} className="mr-1" />Завершено</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><Clock size={14} className="mr-1" />В работе</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100"><AlertCircle size={14} className="mr-1" />Ожидает</Badge>;
      default:
        return <Badge variant="secondary">Неизвестно</Badge>;
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Последние заявки</CardTitle>
        <CardDescription>Статус ваших текущих заявок</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.slice(0, 3).map((app) => (
            <div key={app.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100 hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{app.type}</h4>
                <p className="text-sm text-gray-600">{app.description}</p>
                <p className="text-xs text-gray-500 mt-1">{app.date}</p>
              </div>
              <div className="ml-4">
                {getStatusBadge(app.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentApplicationsCard;
