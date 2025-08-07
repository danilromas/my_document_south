
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, Newspaper, Eye, Heart, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const News = () => {
  const mainArticle = {
    id: '1',
    title: "Новые льготы для ИП в Крыму: что изменилось в 2024 году",
    excerpt: "Подробный разбор налоговых льгот и преференций для индивидуальных предпринимателей в Республике Крым. Рассматриваем все изменения в законодательстве, которые вступили в силу с начала 2024 года, и объясняем, как воспользоваться новыми возможностями.",
    date: "15 ноября 2024",
    category: "Налоги",
    isNew: true,
    views: "5,234",
    likes: "289",
    readTime: "8 мин"
  };

  const articles = [
    {
      id: '2',
      title: "Как открыть ИП в ДНР за 5 простых шагов",
      excerpt: "Пошаговая инструкция по регистрации индивидуального предпринимателя в Донецкой Народной Республике.",
      date: "10 ноября 2024", 
      category: "Регистрация",
      isNew: true,
      views: "2,156",
      likes: "143"
    },
    {
      id: '3',
      title: "Гранты для малого бизнеса в ЛНР: как получить поддержку",
      excerpt: "Обзор доступных грантовых программ и требований для получения государственной поддержки бизнеса.",
      date: "5 ноября 2024",
      category: "Поддержка",
      isNew: false,
      views: "987",
      likes: "67"
    },
    {
      id: '4',
      title: "Электронный документооборот: упрощаем ведение бизнеса",
      excerpt: "Преимущества цифровых решений для ведения документооборота и взаимодействия с госорганами.",
      date: "28 октября 2024",
      category: "Цифровизация",
      isNew: false,
      views: "756",
      likes: "45"
    },
    {
      id: '5',
      title: "Самые популярные виды деятельности для ИП в 2024 году",
      excerpt: "Статистика и рекомендации по выбору направления бизнеса для начинающих предпринимателей.",
      date: "20 октября 2024",
      category: "Аналитика",
      isNew: false,
      views: "1,890",
      likes: "156"
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Налоги": "bg-green-100 text-green-800 border-green-200",
      "Регистрация": "bg-blue-100 text-blue-800 border-blue-200",
      "Поддержка": "bg-purple-100 text-purple-800 border-purple-200",
      "Цифровизация": "bg-orange-100 text-orange-800 border-orange-200",
      "Аналитика": "bg-pink-100 text-pink-800 border-pink-200",
      "Законодательство": "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <section id="news" className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20 overflow-hidden">
      {/* Geometric background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-slate-100 border border-slate-200 rounded-full text-slate-700 font-semibold text-sm mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
            Новости и аналитика
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold mb-6 text-slate-900">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
              Актуальные новости
            </span>
            <br />
            <span className="text-slate-900">бизнеса</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-6"></div>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium">
            Следите за важными событиями и изменениями в бизнес-среде 
            ЛНР, ДНР и Крыма. Экспертная аналитика и практические рекомендации.
          </p>
        </div>

        {/* Главная новость */}
        <div className="mb-16">
          <Link to={`/article/${mainArticle.id}`}>
            <Card className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white/95 backdrop-blur-sm border border-slate-200 overflow-hidden rounded-3xl">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              <div className="lg:flex">
                <div className="lg:w-2/3 p-8 lg:p-12">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Badge className={`${getCategoryColor(mainArticle.category)} font-semibold px-4 py-2 border`}>
                        {mainArticle.category}
                      </Badge>
                      {mainArticle.isNew && (
                        <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-4 py-2 shadow-lg">
                          Новое
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-slate-500 text-sm font-semibold">
                      <Clock size={16} className="mr-2" />
                      <span>{mainArticle.readTime}</span>
                    </div>
                  </div>

                  <h3 className="text-2xl lg:text-4xl font-bold text-slate-900 group-hover:text-blue-600 transition-all duration-300 mb-6 leading-tight">
                    {mainArticle.title}
                  </h3>

                  <p className="text-slate-600 mb-8 leading-relaxed text-lg font-medium">
                    {mainArticle.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-slate-500 space-x-6 font-semibold">
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>{mainArticle.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Eye size={16} />
                        <span>{mainArticle.views}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart size={16} />
                        <span>{mainArticle.likes}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-blue-600 font-bold group-hover:text-blue-700 transition-colors duration-200 text-lg">
                      <span>Читать полностью</span>
                      <ArrowRight size={20} className="ml-3 transition-transform group-hover:translate-x-1 duration-200" />
                    </div>
                  </div>
                </div>
                
                <div className="lg:w-1/3 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center min-h-[300px] lg:min-h-[400px]">
                  <div className="text-center text-white p-8">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                      <TrendingUp size={40} className="text-white" />
                    </div>
                    <h4 className="text-2xl font-bold mb-3">Главная новость</h4>
                    <p className="text-blue-100 font-medium">Самое важное сегодня</p>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Остальные новости */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {articles.map((article, index) => (
            <Link key={index} to={`/article/${article.id}`}>
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white/90 backdrop-blur-sm border border-slate-200 h-full rounded-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={`${getCategoryColor(article.category)} font-semibold px-3 py-2 border text-sm`}>
                      {article.category}
                    </Badge>
                    {article.isNew && (
                      <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-3 py-1 shadow-lg text-sm">
                        Новое
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-all duration-300 line-clamp-2 leading-tight">
                    {article.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col justify-between flex-1 pt-0">
                  <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed font-medium">
                    {article.excerpt}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-slate-500 font-semibold">
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} />
                        <span>{article.date}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Eye size={14} />
                          <span>{article.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart size={14} />
                          <span>{article.likes}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-blue-600 font-bold group-hover:text-blue-700 transition-colors duration-200">
                      <span>Читать статью</span>
                      <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1 duration-200" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Призыв к действию */}
        <Card className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          <div className="p-8 lg:p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Newspaper className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Хотите быть в курсе всех новостей?
            </h3>
            <p className="text-slate-600 mb-8 text-lg font-medium max-w-2xl mx-auto">
              Подписывайтесь на наши обновления и получайте актуальную информацию о бизнесе первыми
            </p>
            <Link to="/news" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-bold text-lg transition-colors duration-200 group">
              Посмотреть все новости 
              <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default News;
