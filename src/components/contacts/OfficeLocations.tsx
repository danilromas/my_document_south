
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

const OfficeLocations = () => {
  const offices = [
    { city: "Луганск", address: "ул. Советская, 15, офис 301", gradient: "from-blue-500 to-indigo-600" },
    { city: "Донецк", address: "пр. Мира, 25, офис 205", gradient: "from-green-500 to-emerald-600" },
    { city: "Симферополь", address: "ул. Киевская, 108, офис 412", gradient: "from-purple-500 to-pink-600" }
  ];

  return (
    <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-xl border border-slate-200 rounded-3xl">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Адреса офисов
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-6">
        {offices.map((office, index) => (
          <div key={index} className="flex items-start space-x-4 p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className={`w-12 h-12 bg-gradient-to-br ${office.gradient} rounded-xl flex items-center justify-center shadow-md`}>
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-lg">{office.city}</p>
              <p className="text-slate-600 font-medium">{office.address}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default OfficeLocations;
