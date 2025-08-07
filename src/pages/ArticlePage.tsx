
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleDetail from '@/components/ArticleDetail';

const ArticlePage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20">
        <ArticleDetail />
      </div>
      <Footer />
    </div>
  );
};

export default ArticlePage;
