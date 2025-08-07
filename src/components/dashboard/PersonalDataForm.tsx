import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Save, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface PersonalData {
  lastName: string;
  firstName: string;
  middleName: string;
  phone: string;
  email: string;
  snils: string;
  inn: string;
  passportSeries: string;
  passportNumber: string;
  passportDate: string;
  passportIssuer: string;
  birthDate: string;
  birthPlace: string;
  address: string;
  notes: string;
}

const PersonalDataForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PersonalData>({
    lastName: '',
    firstName: '',
    middleName: '',
    phone: '',
    email: '',
    snils: '',
    inn: '',
    passportSeries: '',
    passportNumber: '',
    passportDate: '',
    passportIssuer: '',
    birthDate: '',
    birthPlace: '',
    address: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof PersonalData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Имитация отправки данных
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Сохраненные данные:', formData);
    
    toast({
      title: "Данные сохранены",
      description: "Ваши персональные данные успешно обновлены",
    });

    setIsSubmitting(false);
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <User className="text-white w-6 h-6" />
          </div>
          Персональные данные
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ФИО */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Фамилия *
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Иванов"
                required
                className="border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                Имя *
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Иван"
                required
                className="border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName" className="text-sm font-medium text-gray-700">
                Отчество
              </Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
                placeholder="Иванович"
                className="border-gray-300 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Контактные данные */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Номер телефона *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+7 (999) 123-45-67"
                required
                className="border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="ivan@example.com"
                required
                className="border-gray-300 focus:border-blue-500"
              />
            </div>
          </div>

          {/* СНИЛС и ИНН */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="snils" className="text-sm font-medium text-gray-700">
                СНИЛС *
              </Label>
              <Input
                id="snils"
                value={formData.snils}
                onChange={(e) => handleInputChange('snils', e.target.value)}
                placeholder="123-456-789 00"
                required
                className="border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inn" className="text-sm font-medium text-gray-700">
                ИНН
              </Label>
              <Input
                id="inn"
                value={formData.inn}
                onChange={(e) => handleInputChange('inn', e.target.value)}
                placeholder="123456789012"
                className="border-gray-300 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Паспортные данные */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Паспортные данные</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="passportSeries" className="text-sm font-medium text-gray-700">
                  Серия паспорта *
                </Label>
                <Input
                  id="passportSeries"
                  value={formData.passportSeries}
                  onChange={(e) => handleInputChange('passportSeries', e.target.value)}
                  placeholder="1234"
                  required
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passportNumber" className="text-sm font-medium text-gray-700">
                  Номер паспорта *
                </Label>
                <Input
                  id="passportNumber"
                  value={formData.passportNumber}
                  onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                  placeholder="567890"
                  required
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="passportDate" className="text-sm font-medium text-gray-700">
                  Дата выдачи *
                </Label>
                <Input
                  id="passportDate"
                  type="date"
                  value={formData.passportDate}
                  onChange={(e) => handleInputChange('passportDate', e.target.value)}
                  required
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-sm font-medium text-gray-700">
                  Дата рождения *
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  required
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passportIssuer" className="text-sm font-medium text-gray-700">
                Кем выдан *
              </Label>
              <Input
                id="passportIssuer"
                value={formData.passportIssuer}
                onChange={(e) => handleInputChange('passportIssuer', e.target.value)}
                placeholder="ОУФМС России по г. Москве"
                required
                className="border-gray-300 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthPlace" className="text-sm font-medium text-gray-700">
                Место рождения *
              </Label>
              <Input
                id="birthPlace"
                value={formData.birthPlace}
                onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                placeholder="г. Москва"
                required
                className="border-gray-300 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Адрес */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Адрес регистрации *
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="г. Москва, ул. Ленина, д. 1, кв. 1"
              required
              rows={3}
              className="border-gray-300 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Примечания */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Дополнительная информация
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Дополнительные сведения..."
              rows={3}
              className="border-gray-300 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Кнопка сохранения */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg disabled:opacity-50 px-8"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Сохранить данные
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalDataForm;