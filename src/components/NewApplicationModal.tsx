
import React, { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Calendar, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { apiClient, RequestData, Service } from "@/lib/api";

interface NewApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestCreated?: () => void;
}

const NewApplicationModal = ({ open, onOpenChange, onRequestCreated }: NewApplicationModalProps) => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RequestData>({
    service_id: 0,
    desired_at: ''
  });

  // Загружаем услуги при открытии модального окна
  useEffect(() => {
    if (open) {
      loadServices();
    }
  }, [open]);

  const loadServices = async () => {
    try {
      const servicesData = await apiClient.getServices();
      setServices(servicesData);
    } catch (error) {
      console.error('Ошибка загрузки услуг:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список услуг",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.service_id === 0) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите услугу",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await apiClient.createRequest(formData);
      
      toast({
        title: "Заявка создана",
        description: "Ваша заявка успешно отправлена на рассмотрение",
      });
      
      // Сбрасываем форму
      setFormData({
        service_id: 0,
        desired_at: ''
      });
      
      onOpenChange(false);
      onRequestCreated?.();
    } catch (error) {
      toast({
        title: "Ошибка создания заявки",
        description: error instanceof Error ? error.message : "Произошла ошибка при создании заявки",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleServiceChange = (value: string) => {
    setFormData({
      ...formData,
      service_id: parseInt(value)
    });
  };

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
            <Label htmlFor="service" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText size={16} className="text-blue-600" />
              Услуга *
            </Label>
            <Select value={formData.service_id?.toString()} onValueChange={handleServiceChange}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500">
                <SelectValue placeholder="Выберите услугу" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desired_at" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar size={16} className="text-blue-600" />
              Желаемая дата завершения
            </Label>
            <Input
              id="desired_at"
              name="desired_at"
              type="datetime-local"
              value={formData.desired_at}
              onChange={handleChange}
              className="border-gray-300 focus:border-blue-500"
            />
          </div>

          <DialogFooter className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 hover:bg-gray-50"
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
            >
              {isLoading ? 'Создание...' : 'Создать заявку'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewApplicationModal;
