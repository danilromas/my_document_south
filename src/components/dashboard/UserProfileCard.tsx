
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Settings, Star } from 'lucide-react';

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  tariff: string;
  joinDate: string;
}

interface UserProfileCardProps {
  userInfo: UserInfo;
}

const UserProfileCard = ({ userInfo }: UserProfileCardProps) => {
  return (
    <Card className="md:col-span-2 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <User className="text-white w-6 h-6" />
          </div>
          Информация о профиле
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Имя</p>
            <p className="font-semibold">{userInfo.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Email</p>
            <p className="font-semibold">{userInfo.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Телефон</p>
            <p className="font-semibold">{userInfo.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Тариф</p>
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
              <Star size={14} className="mr-1" />
              {userInfo.tariff}
            </Badge>
          </div>
        </div>
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-500 mb-1">Дата регистрации</p>
          <p className="font-semibold">{userInfo.joinDate}</p>
        </div>
        <Button className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Settings size={16} className="mr-2" />
          Редактировать профиль
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
