
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, ArrowRight, Newspaper, Users, HeartHandshake, Info } from 'lucide-react';

const Services = () => {
  const services = [
    {
      name: "Новости бизнеса",
      description: "Актуальная информация каждый день",
      features: [
        "Ежедневные новости из ЛНР, ДНР, Крыма",
        "Изменения в законодательстве",
        "Налоговые новости",
        "Экономические обзоры",
        "Отраслевая аналитика",
        "Быстрые уведомления"
      ],
      isPopular: false,
      buttonText: "Читать новости",
      borderColor: "border-gray-200",
      bgColor: "bg-white",
      icon: Newspaper
    },
    {
      name: "Аналитика и статьи",
      description: "Глубокие материалы для понимания",
      features: [
        "Подробный анализ трендов",
        "Экспертные мнения",
        "Практические советы",
        "Разборы кейсов",
        "Прогнозы развития рынка",
        "Интервью с предпринимателями",
        "Статистические данные"
      ],
      isPopular: true,
      buttonText: "Читать статьи",
      borderColor: "border-blue-300",
      bgColor: "bg-blue-50",
      icon: Users
    },
    {
      name: "Поддержка сообщества",
      description: "Взаимопомощь предпринимателей",
      features: [
        "Обмен опытом",
        "Ответы на вопросы",
        "Полезные контакты",
        "Рекомендации специалистов",
        "Информация о мероприятиях",
        "Сетевое взаимодействие",
        "Обратная связь"
      ],
      isPopular: false,
      buttonText: "Присоединиться",
      borderColor: "border-gray-200",
      bgColor: "bg-white",
      icon: HeartHandshake
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-lg text-gray-700 font-medium mb-6 border border-gray-200">
            <Info size={16} className="mr-2" />
            Наши возможности
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
            Что мы предлагаем
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Информационная поддержка для предпринимателей на всех этапах развития бизнеса
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className={`relative ${service.borderColor} ${service.bgColor} ${service.isPopular ? 'scale-105 shadow-lg border-2' : 'shadow-md border'} hover:shadow-lg transition-all duration-300`}>
              {service.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-6 py-2 text-sm font-semibold">
                    <Star size={16} className="mr-2" />
                    Популярный раздел
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-blue-100 flex items-center justify-center">
                  <service.icon className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-4">{service.name}</CardTitle>
                <p className="text-gray-600 text-lg">{service.description}</p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-4 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <div className="p-1 bg-green-100 rounded-full mt-0.5">
                        <Check className="text-green-600 w-4 h-4" />
                      </div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white">
                  {service.buttonText}
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center bg-white rounded-lg p-8 shadow-md border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Есть интересная новость?
          </h3>
          <p className="text-gray-600 mb-6 text-lg">
            Поделитесь с сообществом или задайте вопрос экспертам
          </p>
          <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-blue-300 hover:bg-blue-50 text-blue-600">
            Связаться с нами
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
