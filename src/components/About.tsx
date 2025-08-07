
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Users, Clock, BookOpen, Heart, Shield, Zap, Target, TrendingUp, Award } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Users, number: "500+", label: "Активных клиентов", color: "from-blue-500 to-indigo-600" },
    { icon: Target, number: "98%", label: "Успешных проектов", color: "from-green-500 to-emerald-600" },
    { icon: Award, number: "15+", label: "Лет экспертности", color: "from-purple-500 to-violet-600" },
    { icon: MapPin, number: "3", label: "Региона присутствия", color: "from-orange-500 to-red-600" }
  ];

  const offices = [
    {
      region: "Луганская Народная Республика",
      city: "Луганск",
      address: "ул. Советская, 15, офис 301",
      phone: "+7 (856) 123-45-67",
      coords: { lat: 48.5764, lng: 39.3508 }
    },
    {
      region: "Донецкая Народная Республика", 
      city: "Донецк",
      address: "пр. Мира, 25, офис 205",
      phone: "+7 (622) 234-56-78",
      coords: { lat: 48.0159, lng: 37.8028 }
    },
    {
      region: "Республика Крым",
      city: "Симферополь",
      address: "ул. Киевская, 108, офис 412",
      phone: "+7 (365) 345-67-89",
      coords: { lat: 44.9519, lng: 34.1024 }
    }
  ];

  const values = [
    { icon: Shield, title: "Правовая защита", description: "Полное юридическое сопровождение бизнеса" },
    { icon: TrendingUp, title: "Рост эффективности", description: "Оптимизация бизнес-процессов" },
    { icon: Target, title: "Точные решения", description: "Индивидуальный подход к каждому клиенту" },
    { icon: Award, title: "Профессионализм", description: "Высокие стандарты качества услуг" }
  ];

  return (
    <section id="about" className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20 overflow-hidden">
      {/* Geometric background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-10 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-slate-100 border border-slate-200 rounded-full text-slate-700 font-semibold text-sm mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
            О платформе
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold mb-6 text-slate-900">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
              Мой Бизнес ЮГ
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-6"></div>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium">
            Профессиональная экосистема для развития бизнеса в новых регионах России. 
            Комплексные решения от регистрации до масштабирования вашего предприятия.
          </p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="group p-8 bg-white/80 backdrop-blur-sm border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 rounded-2xl">
              <CardContent className="p-0 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 font-semibold">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Наша миссия */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 mb-16 border border-slate-200 shadow-2xl">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">
              Наша миссия
            </h3>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-slate-700 text-lg leading-relaxed font-medium">
                С 2019 года мы создаем профессиональную экосистему для предпринимателей в ЛНР, ДНР и Крыму. 
                Помогаем превратить бизнес-идеи в успешные проекты через экспертную поддержку и современные решения.
              </p>
              <p className="text-slate-700 text-lg leading-relaxed font-medium">
                Каждый клиент получает доступ к профессиональным консультациям, правовому сопровождению 
                и комплексной поддержке на всех этапах развития бизнеса.
              </p>
            </div>
            <div className="space-y-6">
              {values.map((value, index) => (
                <div key={index} className="group p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md group-hover:shadow-lg transition-shadow">
                      <value.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-bold text-lg mb-1">{value.title}</h4>
                      <p className="text-slate-600 font-medium">{value.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Карта и офисы */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Карта */}
          <Card className="bg-white/95 backdrop-blur-sm border border-slate-200 shadow-xl rounded-3xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-3xl font-bold text-slate-900 mb-6">
                Карта наших центров
              </h3>
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <MapPin className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-slate-900 font-bold text-xl mb-4">Интерактивная карта</h4>
                  <p className="text-slate-600 font-medium">
                    Здесь будет отображена карта с местоположением наших центров поддержки
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Список офисов */}
          <div>
            <h3 className="text-3xl font-bold text-slate-900 mb-8">
              Наши центры поддержки
            </h3>
            <div className="space-y-6">
              {offices.map((office, index) => (
                <Card key={index} className="group p-6 bg-white/90 backdrop-blur-sm border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                        <MapPin className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-slate-900 mb-3">{office.region}</h4>
                        <div className="space-y-2 text-slate-600">
                          <div className="flex items-start space-x-2">
                            <MapPin size={16} className="mt-1 text-slate-400 flex-shrink-0" />
                            <span className="font-medium">{office.city}, {office.address}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">📞</span>
                            <span className="font-medium">{office.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
