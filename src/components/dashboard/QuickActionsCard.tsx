
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, MessageCircle } from 'lucide-react';

interface QuickActionsCardProps {
  onNewApplication: () => void;
}

const QuickActionsCard = ({ onNewApplication }: QuickActionsCardProps) => {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Быстрые действия</CardTitle>
        <CardDescription>Часто используемые функции</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={onNewApplication}
          className="w-full justify-start bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
        >
          <FileText size={16} className="mr-2" />
          Новая заявка
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start hover:bg-blue-50"
        >
          <Upload size={16} className="mr-2" />
          Заполнить данные
        </Button>
        <Button variant="outline" className="w-full justify-start hover:bg-purple-50">
          <MessageCircle size={16} className="mr-2" />
          Связаться с менеджером
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
