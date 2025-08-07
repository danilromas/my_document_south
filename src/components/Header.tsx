
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, User, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import ApplicationModal from './ApplicationModal';

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Логотип */}
            <Link to="/" className="flex items-center space-x-2 md:space-x-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg md:text-xl">МБ</span>
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                  Мой Бизнес ЮГ
                </h1>
                <p className="text-xs md:text-sm text-blue-600 font-medium">Образовательная платформа</p>
              </div>
            </Link>

            {/* Навигация */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Главная
              </Link>
              <button 
                onClick={() => scrollToSection('services')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Программы
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                О нас
              </button>
              <Link to="/news" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Новости
              </Link>
              <button 
                onClick={() => scrollToSection('contacts')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Контакты
              </button>
            </nav>

            {/* Действия */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="hidden xl:flex items-center space-x-3 text-gray-600">
                <Phone size={18} className="text-blue-600" />
                <span className="font-medium">8 (800) 555-01-23</span>
              </div>
              <Button asChild variant="outline" className="hidden md:inline-flex border-gray-300 hover:bg-gray-50 text-sm">
                <Link to="/dashboard">
                  <User size={16} className="mr-2" />
                  Личный кабинет
                </Link>
              </Button>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base px-3 md:px-4"
              >
                <span className="hidden sm:inline">Оставить заявку</span>
                <span className="sm:hidden">Заявка</span>
              </Button>
              <Button variant="ghost" size="sm" className="lg:hidden p-2">
                <Menu size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <ApplicationModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};

export default Header;
