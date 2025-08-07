
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const ChatSection = () => {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
            <MessageCircle className="text-white w-6 h-6" />
          </div>
          Чат с менеджером
        </CardTitle>
        <CardDescription>Ваш персональный менеджер: Анна Иванова</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs">
                <p className="text-sm">Здравствуйте! Как дела с регистрацией ИП?</p>
                <span className="text-xs text-gray-500">Анна, 10:30</span>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg max-w-xs">
                <p className="text-sm">Все отлично, документы получил. Спасибо!</p>
                <span className="text-xs text-blue-100">Вы, 10:45</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Напишите сообщение..." 
            className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
            Отправить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatSection;
