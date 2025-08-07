
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Clock, MessageCircle } from 'lucide-react';

const ContactInfo = () => {
  return (
    <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-xl border border-slate-200 rounded-3xl">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Наши контакты
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-6">
        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Phone className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-lg">Телефон</p>
            <p className="text-slate-700 font-semibold">8 (800) 555-01-23</p>
            <p className="text-sm text-blue-600 font-medium">Бесплатный звонок</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Mail className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-lg">Email</p>
            <p className="text-slate-700 font-semibold">info@mydocs-yug.ru</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <Clock className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-lg">Режим работы</p>
            <div className="text-slate-700 font-semibold space-y-1">
              <p>Пн-Пт: 9:00 - 18:00</p>
              <p>Сб: 10:00 - 16:00</p>
              <p>Вс: выходной</p>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-lg mb-3">Мессенджеры</p>
            <div className="flex space-x-3">
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg">
                Telegram
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg">
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;
