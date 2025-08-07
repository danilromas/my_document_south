
import React, { useState } from 'react';
import { MapPin, Phone, Mail, FileText } from 'lucide-react';
import ApplicationModal from './ApplicationModal';

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Логотип и описание */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">МБ</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Мой Бизнес ЮГ
                  </h3>
                  <p className="text-sm text-blue-200 font-medium">Образовательная платформа</p>
                </div>
              </div>
              <p className="text-gray-300 text-base leading-relaxed">
                Комплексная поддержка начинающих предпринимателей в ЛНР, ДНР и Крыму. 
                Полное сопровождение от регистрации до развития бизнеса.
              </p>
            </div>

            {/* Программы */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-white">
                Программы
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors font-medium">Основы бизнеса</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Развитие бизнеса</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Экспертная поддержка</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Ведение документооборота</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Консультации</a></li>
              </ul>
            </div>

            {/* Регионы */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-white">
                Регионы
              </h4>
              <ul className="space-y-4 text-gray-300">
                {[
                  { region: "ЛНР (Луганск)" },
                  { region: "ДНР (Донецк)" },
                  { region: "Крым (Симферополь)" }
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="p-1.5 bg-blue-600 rounded">
                      <MapPin size={16} className="text-white" />
                    </div>
                    <span className="font-medium">{item.region}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Контакты */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-white">
                Контакты
              </h4>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-blue-600 rounded">
                    <Phone size={16} className="text-white" />
                  </div>
                  <span className="font-medium">8 (800) 555-01-23</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-blue-600 rounded">
                    <Mail size={16} className="text-white" />
                  </div>
                  <span className="font-medium">info@mybiz-yug.ru</span>
                </div>
                <div className="pt-2">
                  <p className="text-sm font-medium leading-relaxed">
                    Пн-Пт: 9:00 - 18:00<br/>
                    Сб: 10:00 - 16:00<br/>
                    Вс: выходной
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-16 pt-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-base mb-6 md:mb-0 font-medium">
                © 2024 Мой Бизнес ЮГ. Все права защищены.
              </div>
              <div className="flex flex-wrap justify-center space-x-8 text-gray-400 text-base">
                <a href="#" className="hover:text-white transition-colors font-medium">Политика конфиденциальности</a>
                <a href="#" className="hover:text-white transition-colors font-medium">Пользовательское соглашение</a>
                <a href="#" className="hover:text-white transition-colors font-medium">Карта сайта</a>
              </div>
            </div>
          </div>

          {/* Кнопка заявки */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-8 right-8 p-4 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg transition-colors z-50"
            aria-label="Оставить заявку"
          >
            <FileText size={24} className="text-white" />
          </button>
        </div>
      </footer>

      <ApplicationModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};

export default Footer;
