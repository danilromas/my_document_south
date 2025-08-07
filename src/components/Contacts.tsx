
import React, { useState } from 'react';
import ApplicationModal from './ApplicationModal';
import ContactInfo from './contacts/ContactInfo';
import OfficeLocations from './contacts/OfficeLocations';
import ContactForm from './contacts/ContactForm';
import QuickActions from './contacts/QuickActions';

const Contacts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="contacts" className="relative py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
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
            Свяжитесь с нами
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
              Мы готовы помочь
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-6"></div>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium">
            Готовы ответить на ваши вопросы и помочь в развитии бизнеса. 
            Выберите удобный способ связи
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Контактная информация */}
          <div className="lg:col-span-1 space-y-6">
            <ContactInfo />
            <OfficeLocations />
          </div>

          {/* Форма обратной связи */}
          <div className="lg:col-span-2">
            <ContactForm onOpenApplicationModal={() => setIsModalOpen(true)} />
          </div>
        </div>

        {/* Быстрые действия */}
        <QuickActions />
      </div>

      <ApplicationModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
  );
};

export default Contacts;
