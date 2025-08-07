
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
import { Phone, Mail, User, FileText, Send, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApplicationModal = ({ open, onOpenChange }: ApplicationModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Заявка отправлена:', formData);
    
    toast({
      title: "Заявка отправлена",
      description: "Мы свяжемся с вами в ближайшее время",
    });
    
    onOpenChange(false);
    setFormData({ name: '', phone: '', email: '', service: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-2xl backdrop-blur-sm p-0 overflow-hidden">
        {/* Декоративные элементы */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-full blur-xl"></div>
        
        <div className="relative p-8">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="text-white" size={24} />
              </div>
              Оставить заявку
            </DialogTitle>
            <DialogDescription className="text-slate-600 text-lg font-medium">
              Заполните форму, и наш менеджер свяжется с вами в течение 15 минут
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <User size={16} className="text-blue-600" />
                  Ваше имя *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Введите ваше имя"
                  required
                  className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Phone size={16} className="text-blue-600" />
                  Телефон *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (999) 123-45-67"
                  required
                  className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Mail size={16} className="text-blue-600" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="service" className="text-sm font-bold text-slate-700">
                Интересующая услуга
              </Label>
              <Input
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                placeholder="Например: Регистрация ИП, Консультация"
                className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="message" className="text-sm font-bold text-slate-700">
                Комментарий
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Расскажите подробнее о ваших потребностях..."
                rows={4}
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
              />
            </div>

            <DialogFooter className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 border-slate-300 hover:bg-slate-50 h-12 text-slate-700 font-semibold"
              >
                <X size={18} className="mr-2" />
                Отмена
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-12 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group font-semibold"
              >
                <Send size={18} className="mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                Отправить заявку
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
