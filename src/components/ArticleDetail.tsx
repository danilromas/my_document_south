import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowLeft, User, Clock, Share2, ChevronLeft, ChevronRight, Eye, Heart } from 'lucide-react';

const ArticleDetail = () => {
  const { id } = useParams();

  // Данные статей (в реальном приложении это будет из API)
  const articles = {
    '1': {
      title: "Новые льготы для ИП в Крыму: что изменилось в 2024 году",
      content: `
        <div class="article-intro">
          <p class="lead">В 2024 году в Республике Крым вступили в силу новые льготы для индивидуальных предпринимателей, направленные на поддержку малого бизнеса и стимулирование экономического развития региона.</p>
        </div>
        
        <div class="highlight-box">
          <h3>📊 Ключевые цифры</h3>
          <ul>
            <li>Снижение ставки УСН с <strong>6% до 4%</strong></li>
            <li>Расширение патентной системы на <strong>15 новых видов</strong> деятельности</li>
            <li>Льготы доступны для <strong>более 80%</strong> предпринимателей</li>
          </ul>
        </div>
        
        <h2>🏛️ Основные изменения в налогообложении</h2>
        
        <h3>💰 Налоговые льготы</h3>
        <p>Ключевые изменения касаются следующих аспектов:</p>
        
        <div class="info-cards">
          <div class="info-card">
            <h4>🎯 Упрощенная система налогообложения</h4>
            <p>Снижена ставка с 6% до 4% для доходов до 10 млн рублей в год</p>
          </div>
          
          <div class="info-card">
            <h4>📋 Патентная система</h4>
            <p>Расширен перечень видов деятельности, доступных для патентного налогообложения</p>
          </div>
          
          <div class="info-card">
            <h4>💼 Страховые взносы</h4>
            <p>Льготные тарифы для ИП, работающих в сфере IT и инноваций</p>
          </div>
        </div>
        
        <h3>👥 Кому доступны льготы</h3>
        <div class="checklist">
          <div class="check-item">✅ Впервые зарегистрированные ИП в 2024 году</div>
          <div class="check-item">✅ ИП, работающие в сфере образования и здравоохранения</div>
          <div class="check-item">✅ Предприниматели, занимающиеся производственной деятельностью</div>
          <div class="check-item">✅ ИП в сфере туризма и гостиничного бизнеса</div>
        </div>
        
        <h3>📝 Как оформить льготы</h3>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4>Подача заявления</h4>
              <p>Подать заявление в налоговую инспекцию</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4>Документы</h4>
              <p>Предоставить документы, подтверждающие право на льготы</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h4>Соблюдение условий</h4>
              <p>Соблюдать условия предоставления льгот</p>
            </div>
          </div>
        </div>
        
        <div class="quote-box">
          <blockquote>
            "Новые льготы позволят сэкономить предпринимателям до 200 000 рублей в год и существенно упростить ведение бизнеса"
          </blockquote>
          <cite>— Министерство экономического развития Крыма</cite>
        </div>
        
        <p>Подробную консультацию можно получить в наших центрах поддержки предпринимателей или на официальном сайте ФНС России.</p>
      `,
      date: "15 ноября 2024",
      category: "Налоги",
      author: "Анна Петрова",
      readTime: "5 мин",
      views: "1,234",
      likes: "89"
    },
    '2': {
      title: "Как открыть ИП в ДНР за 5 простых шагов",
      content: `
        <div class="article-intro">
          <p class="lead">Регистрация индивидуального предпринимателя в Донецкой Народной Республике стала значительно проще благодаря цифровизации государственных услуг.</p>
        </div>
        
        <div class="highlight-box">
          <h3>⚡ Быстрые факты</h3>
          <ul>
            <li>Регистрация занимает всего <strong>3 рабочих дня</strong></li>
            <li>Можно подать документы <strong>онлайн</strong></li>
            <li>Госпошлина составляет <strong>800 рублей</strong></li>
          </ul>
        </div>
        
        <h2>📋 Пошаговая инструкция регистрации ИП</h2>
        
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>📄 Подготовка документов</h3>
              <p>Для регистрации ИП вам понадобятся:</p>
              <div class="checklist">
                <div class="check-item">✅ Паспорт гражданина ДНР</div>
                <div class="check-item">✅ Справка о регистрации места жительства</div>
                <div class="check-item">✅ Заявление по форме Р21001</div>
                <div class="check-item">✅ Квитанция об уплате государственной пошлины</div>
              </div>
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>💰 Выбор налогового режима</h3>
              <p>Доступные режимы налогообложения:</p>
              <div class="info-cards">
                <div class="info-card">
                  <h4>УСН</h4>
                  <p>6% с доходов или 15% с прибыли</p>
                </div>
                <div class="info-card">
                  <h4>Патент</h4>
                  <p>Фиксированная стоимость</p>
                </div>
                <div class="info-card">
                  <h4>Общий режим</h4>
                  <p>Стандартное налогообложение</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>📤 Подача документов</h3>
              <p>Документы можно подать несколькими способами:</p>
              <div class="checklist">
                <div class="check-item">🏢 Лично в налоговой инспекции</div>
                <div class="check-item">🏛️ Через МФЦ</div>
                <div class="check-item">💻 Онлайн через портал госуслуг</div>
                <div class="check-item">📮 Почтой России</div>
              </div>
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>📜 Получение свидетельства</h3>
              <p>Регистрация занимает до 3 рабочих дней. После этого вы получите:</p>
              <div class="checklist">
                <div class="check-item">📋 Свидетельство о регистрации ИП</div>
                <div class="check-item">📊 Выписку из ЕГРИП</div>
                <div class="check-item">📧 Уведомление о постановке на налоговый учет</div>
              </div>
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">5</div>
            <div class="step-content">
              <h3>🚀 Начало деятельности</h3>
              <p>После регистрации необходимо:</p>
              <div class="checklist">
                <div class="check-item">🏦 Открыть расчетный счет в банке</div>
                <div class="check-item">📢 Уведомить налоговую о начале деятельности</div>
                <div class="check-item">📈 Начать ведение учета доходов и расходов</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="quote-box">
          <blockquote>
            "Благодаря упрощению процедур, теперь открыть ИП может каждый желающий всего за несколько дней"
          </blockquote>
          <cite>— Министерство экономики ДНР</cite>
        </div>
        
        <p>Наши консультанты готовы помочь вам на каждом этапе регистрации. Обращайтесь за бесплатной поддержкой!</p>
      `,
      date: "10 ноября 2024",
      category: "Регистрация",
      author: "Михаил Иванов",
      readTime: "7 мин",
      views: "2,156",
      likes: "143"
    },
    '3': {
      title: "Гранты для малого бизнеса в ЛНР: как получить поддержку",
      content: `
        <div class="article-intro">
          <p class="lead">Луганская Народная Республика предлагает широкий спектр грантовых программ для поддержки малого и среднего бизнеса.</p>
        </div>
        
        <div class="highlight-box">
          <h3>💎 Доступные гранты</h3>
          <ul>
            <li>До <strong>500 000 рублей</strong> на развитие бизнеса</li>
            <li>Льготное кредитование под <strong>3% годовых</strong></li>
            <li>Бесплатное обучение и консультации</li>
          </ul>
        </div>
        
        <h2>🎯 Основные виды поддержки</h2>
        <p>В рамках программы поддержки малого бизнеса в ЛНР доступны следующие меры:</p>
        
        <div class="info-cards">
          <div class="info-card">
            <h4>💰 Финансовые гранты</h4>
            <p>Прямая финансовая поддержка на развитие и запуск бизнеса</p>
          </div>
          
          <div class="info-card">
            <h4>🏦 Льготное кредитование</h4>
            <p>Кредиты под низкий процент с государственным субсидированием</p>
          </div>
          
          <div class="info-card">
            <h4>📚 Образовательные программы</h4>
            <p>Бесплатное обучение основам предпринимательства</p>
          </div>
        </div>
        
        <p>Подробную информацию о всех доступных программах можно получить в центрах поддержки предпринимательства.</p>
      `,
      date: "5 ноября 2024",
      category: "Поддержка",
      author: "Елена Сидорова",
      readTime: "4 мин",
      views: "987",
      likes: "67"
    }
  };

  const allArticleIds = Object.keys(articles);
  const currentIndex = allArticleIds.indexOf(id || '');
  const prevArticleId = currentIndex > 0 ? allArticleIds[currentIndex - 1] : null;
  const nextArticleId = currentIndex < allArticleIds.length - 1 ? allArticleIds[currentIndex + 1] : null;

  const article = articles[id as keyof typeof articles];

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-6 md:p-8 text-center max-w-md w-full">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Статья не найдена</h2>
          <Link to="/news">
            <Button className="w-full">Вернуться к новостям</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Налоги": "bg-green-100 text-green-800",
      "Регистрация": "bg-blue-100 text-blue-800",
      "Поддержка": "bg-purple-100 text-purple-800",
      "Цифровизация": "bg-orange-100 text-orange-800",
      "Аналитика": "bg-pink-100 text-pink-800",
      "Законодательство": "bg-gray-100 text-gray-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const articleStyles = `
    .article-content .article-intro {
      margin-bottom: 1.5rem;
    }
    
    @media (min-width: 768px) {
      .article-content .article-intro {
        margin-bottom: 2rem;
      }
    }
    
    .article-content .lead {
      font-size: 1.125rem;
      color: rgb(75 85 99);
      line-height: 1.625;
      font-weight: 500;
      margin-bottom: 0;
    }
    
    @media (min-width: 768px) {
      .article-content .lead {
        font-size: 1.25rem;
      }
    }
    
    .article-content .highlight-box {
      background-color: rgb(239 246 255);
      border-left: 4px solid rgb(59 130 246);
      padding: 1rem;
      margin: 1.5rem 0;
      border-top-right-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
    }
    
    @media (min-width: 768px) {
      .article-content .highlight-box {
        padding: 1.5rem;
        margin: 2rem 0;
      }
    }
    
    .article-content .highlight-box h3 {
      color: rgb(30 64 175);
      font-weight: bold;
      margin-bottom: 0.75rem;
      font-size: 1rem;
      margin-top: 0;
    }
    
    @media (min-width: 768px) {
      .article-content .highlight-box h3 {
        margin-bottom: 1rem;
        font-size: 1.125rem;
      }
    }
    
    .article-content .highlight-box ul {
      margin-bottom: 0;
    }
    
    .article-content .highlight-box li {
      color: rgb(30 64 175);
      margin-bottom: 0.25rem;
      font-size: 0.875rem;
    }
    
    @media (min-width: 768px) {
      .article-content .highlight-box li {
        margin-bottom: 0.5rem;
        font-size: 1rem;
      }
    }
    
    .article-content .info-cards {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      margin: 1.5rem 0;
    }
    
    @media (min-width: 768px) {
      .article-content .info-cards {
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin: 2rem 0;
      }
    }
    
    @media (min-width: 1024px) {
      .article-content .info-cards {
        grid-template-columns: 1fr 1fr 1fr;
      }
    }
    
    .article-content .info-card {
      background-color: rgb(249 250 251);
      padding: 1rem;
      border-radius: 0.5rem;
      border: 1px solid rgb(229 231 235);
    }
    
    @media (min-width: 768px) {
      .article-content .info-card {
        padding: 1.5rem;
      }
    }
    
    .article-content .info-card h4 {
      font-weight: bold;
      color: rgb(17 24 39);
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      margin-top: 0;
    }
    
    @media (min-width: 768px) {
      .article-content .info-card h4 {
        margin-bottom: 0.75rem;
        font-size: 1rem;
      }
    }
    
    .article-content .info-card p {
      color: rgb(75 85 99);
      margin-bottom: 0;
      font-size: 0.75rem;
    }
    
    @media (min-width: 768px) {
      .article-content .info-card p {
        font-size: 0.875rem;
      }
    }
    
    .article-content .checklist {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin: 1rem 0;
    }
    
    @media (min-width: 768px) {
      .article-content .checklist {
        gap: 0.75rem;
        margin: 1.5rem 0;
      }
    }
    
    .article-content .check-item {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      color: rgb(55 65 81);
      font-size: 0.875rem;
    }
    
    @media (min-width: 768px) {
      .article-content .check-item {
        gap: 0.75rem;
        font-size: 1rem;
      }
    }
    
    .article-content .steps {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin: 1.5rem 0;
    }
    
    @media (min-width: 768px) {
      .article-content .steps {
        gap: 2rem;
        margin: 2rem 0;
      }
    }
    
    .article-content .step {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    @media (min-width: 640px) {
      .article-content .step {
        flex-direction: row;
        gap: 0;
        align-items: flex-start;
      }
    }
    
    @media (min-width: 768px) {
      .article-content .step {
        gap: 1.5rem;
      }
    }
    
    .article-content .step-number {
      flex-shrink: 0;
      width: 2rem;
      height: 2rem;
      background-color: rgb(37 99 235);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 0.875rem;
    }
    
    @media (min-width: 640px) {
      .article-content .step-number {
        margin-right: 1rem;
      }
    }
    
    @media (min-width: 768px) {
      .article-content .step-number {
        width: 2.5rem;
        height: 2.5rem;
        font-size: 1rem;
        margin-right: 0;
      }
    }
    
    .article-content .step-content {
      flex: 1;
    }
    
    .article-content .step-content h3,
    .article-content .step-content h4 {
      font-weight: bold;
      color: rgb(17 24 39);
      margin-bottom: 0.5rem;
      font-size: 1rem;
      margin-top: 0;
    }
    
    @media (min-width: 768px) {
      .article-content .step-content h3,
      .article-content .step-content h4 {
        margin-bottom: 0.75rem;
        font-size: 1.125rem;
      }
    }
    
    .article-content .quote-box {
      background-color: rgb(249 250 251);
      border-left: 4px solid rgb(156 163 175);
      padding: 1rem;
      margin: 1.5rem 0;
      border-top-right-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
    }
    
    @media (min-width: 768px) {
      .article-content .quote-box {
        padding: 1.5rem;
        margin: 2rem 0;
      }
    }
    
    .article-content .quote-box blockquote {
      color: rgb(55 65 81);
      font-style: italic;
      font-size: 1rem;
      line-height: 1.625;
      margin-bottom: 0.75rem;
    }
    
    @media (min-width: 768px) {
      .article-content .quote-box blockquote {
        font-size: 1.125rem;
        margin-bottom: 1rem;
      }
    }
    
    .article-content .quote-box cite {
      color: rgb(107 114 128);
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    @media (min-width: 768px) {
      .article-content .quote-box cite {
        font-size: 1rem;
      }
    }
  `;

  return (
    <div className="min-h-screen bg-gray-50">
      <style dangerouslySetInnerHTML={{ __html: articleStyles }} />
      <div className="container mx-auto px-4 py-6 md:py-12">
        {/* Навигация */}
        <div className="mb-6 md:mb-8">
          <Link to="/news">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-2 md:p-3">
              <ArrowLeft size={16} className="mr-2" />
              <span className="hidden sm:inline">Назад к новостям</span>
              <span className="sm:hidden">Назад</span>
            </Button>
          </Link>
        </div>

        {/* Основной контент */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow-lg border-0 overflow-hidden">
            <CardContent className="p-4 md:p-8 lg:p-12">
              {/* Заголовок статьи */}
              <div className="mb-6 md:mb-8">
                <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <Badge className={`${getCategoryColor(article.category)} font-medium px-2 md:px-3 py-1 text-xs md:text-sm`}>
                    {article.category}
                  </Badge>
                  <div className="flex items-center space-x-3 md:space-x-4 text-xs md:text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar size={12} className="md:w-4 md:h-4" />
                      <span className="hidden sm:inline">{article.date}</span>
                      <span className="sm:hidden">{article.date.split(' ')[0]} {article.date.split(' ')[1]}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User size={12} className="md:w-4 md:h-4" />
                      <span className="hidden md:inline">{article.author}</span>
                      <span className="md:hidden">{article.author.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={12} className="md:w-4 md:h-4" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>
                
                <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4 md:mb-6">
                  {article.title}
                </h1>

                {/* Статистика и действия */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 md:pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-4 md:space-x-6 text-xs md:text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Eye size={14} />
                      <span>{article.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart size={14} />
                      <span>{article.likes}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs md:text-sm">
                    <Share2 size={14} className="mr-2" />
                    <span className="hidden sm:inline">Поделиться</span>
                    <span className="sm:hidden">Share</span>
                  </Button>
                </div>
              </div>

              {/* Содержание статьи */}
              <div 
                className="article-content prose prose-sm md:prose-lg max-w-none
                           prose-headings:text-gray-900 prose-headings:font-bold
                           prose-h2:text-lg md:prose-h2:text-2xl prose-h2:mt-6 md:prose-h2:mt-8 prose-h2:mb-3 md:prose-h2:mb-4
                           prose-h3:text-base md:prose-h3:text-xl prose-h3:mt-4 md:prose-h3:mt-6 prose-h3:mb-2 md:prose-h3:mb-3
                           prose-h4:text-sm md:prose-h4:text-lg prose-h4:mt-3 md:prose-h4:mt-4 prose-h4:mb-2
                           prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-3 md:prose-p:mb-4 prose-p:text-sm md:prose-p:text-base
                           prose-ul:text-gray-700 prose-ol:text-gray-700
                           prose-li:mb-1 md:prose-li:mb-2 prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Подвал статьи */}
              <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
                <div className="bg-blue-50 p-4 md:p-6 rounded-lg">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 md:mb-3">
                    Нужна консультация?
                  </h3>
                  <p className="text-gray-700 mb-3 md:mb-4 text-sm md:text-base">
                    Наши эксперты готовы помочь вам с любыми вопросами по ведению бизнеса
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm md:text-base">
                    Получить консультацию
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Навигация между статьями */}
          <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevArticleId && (
              <Link to={`/article/${prevArticleId}`}>
                <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md bg-white h-full">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center space-x-3 text-blue-600 mb-2">
                      <ChevronLeft size={16} />
                      <span className="text-xs md:text-sm font-medium">Предыдущая статья</span>
                    </div>
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {articles[prevArticleId as keyof typeof articles].title}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            )}
            
            {nextArticleId && (
              <Link to={`/article/${nextArticleId}`}>
                <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md bg-white h-full">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-end space-x-3 text-blue-600 mb-2">
                      <span className="text-xs md:text-sm font-medium">Следующая статья</span>
                      <ChevronRight size={16} />
                    </div>
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-right">
                      {articles[nextArticleId as keyof typeof articles].title}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
