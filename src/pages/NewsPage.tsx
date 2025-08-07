
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import News from '@/components/News';

const NewsPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20">
        <News />
      </div>
      <Footer />
    </div>
  );
};

export default NewsPage;
