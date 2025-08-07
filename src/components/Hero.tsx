
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Users, Award, Clock, ArrowRight, Newspaper, HeartHandshake, TrendingUp, Shield, Target } from 'lucide-react';

const Hero = () => {
  const advantages = [
    { icon: TrendingUp, text: "Рост бизнеса", desc: "Аналитика и стратегии" },
    { icon: Shield, text: "Правовая защита", desc: "Юридическое сопровождение" },
    { icon: Target, text: "Точные решения", desc: "Индивидуальный подход" },
    { icon: Award, text: "Экспертность", desc: "15+ лет опыта" }
  ];

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20 overflow-hidden">
      {/* Geometric background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-10 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Левая колонка - основной контент */}
          <div className="space-y-10">
            <div className="inline-flex items-center px-6 py-3 bg-slate-100 border border-slate-200 rounded-full text-slate-700 font-semibold text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              Комплексная бизнес-поддержка
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-slate-900">
                Развиваем
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
                  ваш бизнес
                </span>
              </h1>
              
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              
              <p className="text-xl text-slate-600 leading-relaxed font-medium max-w-2xl">
                Профессиональная экосистема для предпринимателей ЛНР, ДНР и Крыма. 
                От регистрации до масштабирования — всё для успешного бизнеса.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg px-10 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Начать развитие
                <ArrowRight size={20} className="ml-3" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10 py-6 rounded-xl border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300">
                Консультация
              </Button>
            </div>

            {/* Преимущества в grid */}
            <div className="grid sm:grid-cols-2 gap-6 pt-12">
              {advantages.map((advantage, index) => (
                <div key={index} className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md group-hover:shadow-lg transition-shadow">
                      <advantage.icon className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-bold text-lg mb-1">{advantage.text}</h4>
                      <p className="text-slate-600 text-sm font-medium">{advantage.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Правая колонка - интерактивная карточка */}
          <div className="relative">
            {/* Декоративные элементы */}
            <div className="absolute -top-8 -right-8 w-32 h-32 border-2 border-blue-200 rounded-3xl transform rotate-12"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl transform -rotate-12 opacity-20"></div>
            
            <Card className="relative p-10 bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
                  <Newspaper className="text-white w-10 h-10" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                  Экспертная поддержка
                </h3>
                <p className="text-slate-600 text-lg font-medium">Комплексные решения для роста</p>
              </div>
              
              <div className="space-y-5 mb-10">
                {[
                  { service: "Бизнес-консультации", status: "Премиум", icon: Target },
                  { service: "Юридическое сопровождение", status: "Включено", icon: Shield },
                  { service: "Налоговое планирование", status: "Профи", icon: TrendingUp },
                  { service: "Документооборот", status: "Автомат", icon: CheckCircle }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors group">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                        <item.icon className="text-slate-600 w-5 h-5" />
                      </div>
                      <span className="text-slate-800 font-semibold">{item.service}</span>
                    </div>
                    <div className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-bold rounded-xl shadow-md">
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
              
              <Button className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white text-lg py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Получить консультацию
                <ArrowRight size={20} className="ml-3" />
              </Button>
              
              <div className="text-center mt-6">
                <p className="text-slate-500 text-sm font-semibold flex items-center justify-center">
                  <Clock size={16} className="mr-2" />
                  Ответ в течение 24 часов
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Статистика */}
        <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { number: "500+", label: "Довольных клиентов" },
            { number: "15+", label: "Лет опыта" },
            { number: "3", label: "Региона работы" },
            { number: "24/7", label: "Поддержка" }
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-slate-600 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
