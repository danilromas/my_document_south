
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

const PaymentsSection = () => {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="text-center py-12">
          <CreditCard className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Платежи не найдены</h3>
          <p className="text-gray-600 mb-6">У вас пока нет истории платежей</p>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
            Выбрать тариф
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentsSection;
