
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import News from '@/components/News';
import Contacts from '@/components/Contacts';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Hero />
      <Services />
      <News />
      <About />
      <Contacts />
      <Footer />
    </div>
  );
};

export default Index;
