
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, ArrowRight, Building2, Calculator, Users, Briefcase, Cog, MapPin, Phone } from 'lucide-react';

const Services = () => {
  const services = [
    {
      name: "Регистрация бизнеса",
      description: "Полное сопровождение регистрации любой формы собственности",
      features: [
        "Регистрация ИП, ООО, КФХ, СНТ",
        "Подбор кодов ОКВЭД",
        "Выбор системы налогообложения",
        "Подготовка заявления о регистрации ИП",
        "Заявление на УСН при необходимости",
        "Консультации по выбору формы собственности",
        "Подсказки по лучшему способу подачи документов"
      ],
      isPopular: true,
      buttonText: "Зарегистрировать бизнес",
      borderColor: "border-blue-300",
      bgColor: "bg-blue-50",
      icon: Building2
    },
    {
      name: "Бухгалтерские услуги",
      description: "Полное ведение учета - удобная альтернатива штатному бухгалтеру",
      features: [
        "Ведение налогового и бухгалтерского учета",
        "Кадровый учет",
        "Отчетность по различным налогам и сборам",
        "Контроль сроков уплаты налогов",
        "Все операции отражены в приложении",
        "Круглосуточная поддержка специалистов",
        "Бесконтактное взаимодействие",
        "Широкий перечень разовых услуг"
      ],
      isPopular: false,
      buttonText: "Заказать ведение учета",
      borderColor: "border-gray-200",
      bgColor: "bg-white",
      icon: Calculator
    },
    {
      name: "Консультации и планирование",
      description: "Стратегическое развитие и оптимизация бизнеса",
      features: [
        "Консультации по налоговому планированию",
        "Разработка финансовой стратегии",
        "Анализ финансовых рисков",
        "Оптимизация налоговых расходов",
        "Постановка и ведение учета основных средств",
        "Определение стоимости имущества и амортизация",
        "Анализ эффективности использования активов",
        "Подготовка отчетности по состоянию имущества"
      ],
      isPopular: false,
      buttonText: "Получить консультацию",
      borderColor: "border-gray-200",
      bgColor: "bg-white",
      icon: Users
    },
    {
      name: "IT и автоматизация",
      description: "Современные решения для эффективного учета",
      features: [
        "Внедрение автоматизированных систем учета",
        "Выбор подходящего ПО для учета",
        "Обучение сотрудников работе с системами",
        "Обеспечение защиты данных",
        "Соблюдение конфиденциальности",
        "1С - настройка и конфигурация",
        "IT-поддержка",
        "Цифровизация бизнес-процессов"
      ],
      isPopular: false,
      buttonText: "Автоматизировать учет",
      borderColor: "border-gray-200",
      bgColor: "bg-white",
      icon: Cog
    },
    {
      name: "Специализированные услуги",
      description: "Дополнительные направления для развития бизнеса",
      features: [
        "Работа в сфере государственных контрактов",
        "Маркетинговые услуги",
        "Рекламные кампании",
        "IT-решения для бизнеса",
        "Консалтинг по развитию",
        "Аудит бизнес-процессов"
      ],
      isPopular: false,
      buttonText: "Узнать подробнее",
      borderColor: "border-gray-200",
      bgColor: "bg-white",
      icon: Briefcase
    }
  ];

  const offices = [
    {
      city: "Евпатория",
      address: "ул. Эскадронная, дом 11, офис 3",
      phone: "+7 (978) 854-75-00",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      city: "Донецк", 
      address: "Проспект Ильича, 19ж, 3 этаж, офис 321",
      phone: "+7 (949) 508-88-32",
      contact: "Каран Марина",
      gradient: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-lg text-gray-700 font-medium mb-6 border border-gray-200">
            <Briefcase size={16} className="mr-2" />
            Наши услуги
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
            Полный спектр бухгалтерских услуг
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Профессиональное ведение учета, регистрация бизнеса и консалтинг для предпринимателей ЛНР, ДНР и Крыма
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className={`relative ${service.borderColor} ${service.bgColor} ${service.isPopular ? 'scale-105 shadow-lg border-2' : 'shadow-md border'} hover:shadow-lg transition-all duration-300`}>
              {service.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-6 py-2 text-sm font-semibold">
                    <Star size={16} className="mr-2" />
                    Популярная услуга
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

        {/* Преимущества работы с нами */}
        <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200 mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Почему выбирают нас?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-green-100 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Не нужно нанимать бухгалтера</h4>
              <p className="text-gray-600">Экономия на зарплате штатного специалиста</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-blue-100 flex items-center justify-center">
                <Calculator className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Все операции в приложении</h4>
              <p className="text-gray-600">Прозрачность и контроль процессов</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Круглосуточная поддержка</h4>
              <p className="text-gray-600">Специалисты всегда на связи</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-orange-100 flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Бесконтактное взаимодействие</h4>
              <p className="text-gray-600">Удобство и безопасность</p>
            </div>
          </div>
        </div>

        {/* Наши офисы */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 shadow-md border border-blue-200">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Наши офисы
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {offices.map((office, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${office.gradient} rounded-xl flex items-center justify-center shadow-md`}>
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-xl text-gray-900 mb-2">{office.city}</h4>
                    <p className="text-gray-700 font-medium mb-2">{office.address}</p>
                    <div className="flex items-center space-x-2 mb-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-600 font-semibold">{office.phone}</span>
                    </div>
                    {office.contact && (
                      <p className="text-gray-600 font-medium">Контактное лицо: {office.contact}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
