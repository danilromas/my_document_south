
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Application {
  id: number;
  type: string;
  status: string;
  date: string;
  description: string;
}

interface ApplicationsListProps {
  applications: Application[];
}

const ApplicationsList = ({ applications }: ApplicationsListProps) => {
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
    <div className="space-y-4">
      {applications.map((app) => (
        <Card key={app.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{app.type}</h3>
                <p className="text-gray-600 mb-3">{app.description}</p>
                <p className="text-sm text-gray-500">Дата подачи: {app.date}</p>
              </div>
              <div className="ml-6 text-right">
                {getStatusBadge(app.status)}
                <Button variant="outline" size="sm" className="mt-3 ml-2">
                  Подробнее
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ApplicationsList;
