
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle } from 'lucide-react';
import ApplicationModal from '../ApplicationModal';

const QuickActions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="text-center bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-200">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Нужна срочная консультация?
        </h3>
        <p className="text-slate-600 mb-8 text-lg font-medium">
          Свяжитесь с нами прямо сейчас любым удобным способом
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <Phone size={20} className="mr-2" />
            Заказать звонок
          </Button>
          <Button 
            variant="outline" 
            className="border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50 px-8 py-4 text-lg transition-all duration-200 font-semibold"
          >
            <MessageCircle size={20} className="mr-2" />
            Написать в Telegram
          </Button>
        </div>
      </div>

      <ApplicationModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};

export default QuickActions;
