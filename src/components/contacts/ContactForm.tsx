
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ContactFormProps {
  onOpenApplicationModal: () => void;
}

const ContactForm = ({ onOpenApplicationModal }: ContactFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    region: '',
    message: '',
    consent: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consent) {
      toast({
        title: "Ошибка",
        description: "Необходимо согласие на обработку персональных данных",
        variant: "destructive"
      });
      return;
    }

    console.log('Сообщение отправлено:', formData);
    
    toast({
      title: "Сообщение отправлено",
      description: "Мы свяжемся с вами в ближайшее время",
    });
    
    setFormData({ name: '', phone: '', email: '', region: '', message: '', consent: false });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <Card className="p-10 bg-white/95 backdrop-blur-sm shadow-2xl border border-slate-200 rounded-3xl">
      <CardHeader className="p-0 mb-8">
        <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Напишите нам
        </CardTitle>
        <p className="text-slate-600 text-lg font-medium">
          Оставьте заявку, и мы свяжемся с вами в течение часа
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Ваше имя *
              </label>
              <Input 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Введите ваше имя" 
                required
                className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Телефон *
              </label>
              <Input 
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+7 (___) ___-__-__" 
                required
                className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">
              Email
            </label>
            <Input 
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com" 
              className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">
              Регион
            </label>
            <select 
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full h-12 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium"
            >
              <option value="">Выберите регион</option>
              <option value="lnr">Луганская Народная Республика</option>
              <option value="dnr">Донецкая Народная Республика</option>
              <option value="crimea">Республика Крым</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">
              Сообщение
            </label>
            <Textarea 
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Расскажите о вашем проекте или задайте вопрос..."
              rows={4}
              className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-start space-x-3">
            <input 
              type="checkbox" 
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="mt-1.5 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" 
            />
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Согласен на обработку персональных данных в соответствии с 
              <a href="#" className="text-blue-600 hover:text-blue-700 underline font-semibold"> политикой конфиденциальности</a>
            </p>
          </div>

          <div className="flex gap-4">
            <Button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg py-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group"
            >
              <Send size={20} className="mr-2 group-hover:translate-x-1 transition-transform duration-200" />
              Отправить сообщение
            </Button>
            <Button
              type="button"
              onClick={onOpenApplicationModal}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg py-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Оставить заявку
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
