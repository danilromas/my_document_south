
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Calendar, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface NewApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewApplicationModal = ({ open, onOpenChange }: NewApplicationModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    priority: 'medium',
    deadline: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Новая заявка создана:', formData);
    
    toast({
      title: "Заявка создана",
      description: "Ваша заявка успешно отправлена на рассмотрение",
    });
    
    onOpenChange(false);
    setFormData({ title: '', type: '', description: '', priority: 'medium', deadline: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const serviceTypes = [
    'Регистрация ИП',
    'Регистрация ООО',
    'Создание сайта',
    'Настройка рекламы',
    'Ведение бухгалтерии',
    'Юридическая консультация',
    'Другое'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-blue-600" size={24} />
            Создать новую заявку
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Заполните форму для создания новой заявки
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User size={16} className="text-blue-600" />
              Название заявки *
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Краткое описание заявки"
              required
              className="border-gray-300 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium text-gray-700">
              Тип услуги *
            </Label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
            >
              <option value="">Выберите тип услуги</option>
              {serviceTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
              Приоритет
            </Label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
            >
              <option value="low">Низкий</option>
              <option value="medium">Средний</option>
              <option value="high">Высокий</option>
              <option value="urgent">Срочный</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar size={16} className="text-blue-600" />
              Желаемая дата завершения
            </Label>
            <Input
              id="deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              className="border-gray-300 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Подробное описание *
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Опишите детально что вам нужно..."
              rows={4}
              required
              className="border-gray-300 focus:border-blue-500"
            />
          </div>

          <DialogFooter className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 hover:bg-gray-50"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
            >
              Создать заявку
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewApplicationModal;
