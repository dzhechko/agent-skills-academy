import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Book, Award, Zap, Download, Upload } from 'lucide-react';
import { exportProgress, importProgress, resetProgress, loadProgress, saveProgress } from '../utils/progress';

export default function Help() {
  const [openIndex, setOpenIndex] = useState(null);
  const [importMessage, setImportMessage] = useState('');

  const faqs = [
    {
      question: "Как работает система XP и уровней?",
      answer: "Вы зарабатываете очки опыта (XP) за прохождение разделов, правильные ответы в тестах и получение достижений. Накопление XP повышает ваш уровень от Новичка до Мастера агентов. Каждый уровень требует больше XP, но открывает новые достижения."
    },
    {
      question: "Что такое флэш-карточки и зачем они нужны?",
      answer: "Флэш-карточки — это интерактивный способ запоминания терминов. На лицевой стороне показан термин, на обратной — определение. Отмечайте, какие термины вы знаете, а какие нет. Это помогает улучшить запоминание материала на 30% по сравнению с обычным чтением."
    },
    {
      question: "Сколько времени занимает прохождение курса?",
      answer: "В среднем полное прохождение всех разделов занимает 3-4 часа. Можно проходить в своём темпе, сохраняя прогресс. Рекомендуем заниматься сессиями по 20-30 минут для лучшего усвоения материала."
    },
    {
      question: "Как получить сертификат?",
      answer: "Для получения сертификата нужно: 1) Пройти все 6 обучающих разделов, 2) Набрать минимум 80% в финальном тесте. После успешного прохождения сертификат отобразится на странице результатов теста."
    },
    {
      question: "Что делать, если потерял прогресс?",
      answer: "Прогресс сохраняется в localStorage браузера. Если вы очистили кэш или используете другое устройство, прогресс будет утерян. Рекомендуем периодически экспортировать прогресс через раздел 'Управление данными' ниже."
    },
    {
      question: "Можно ли пройти тест несколько раз?",
      answer: "Да! Вы можете проходить любые тесты неограниченное количество раз. В статистике сохраняется ваш лучший результат. Это отличная возможность закрепить материал."
    },
    {
      question: "Как работает система достижений?",
      answer: "Достижения разблокируются автоматически при выполнении определённых условий: завершение разделов, высокие результаты тестов, полосы побед. За каждое достижение вы получаете бонусные XP."
    },
    {
      question: "Что такое streak и как его поддерживать?",
      answer: "Streak (полоса побед) — это количество дней подряд, когда вы заходили в приложение. Заходите хотя бы раз в день, чтобы поддерживать streak. За 3 дня подряд вы получите специальное достижение 🔥."
    }
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleExport = () => {
    const progress = loadProgress();
    exportProgress(progress);
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const progress = await importProgress(file);
      saveProgress(progress);
      setImportMessage('✅ Прогресс успешно импортирован!');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setImportMessage('❌ Ошибка: ' + error.message);
    }
    
    setTimeout(() => setImportMessage(''), 3000);
  };

  const handleReset = () => {
    if (confirm('Вы уверены? Все данные будут удалены без возможности восстановления!')) {
      resetProgress();
      alert('Прогресс сброшен. Страница будет перезагружена.');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-7xl mb-4">❓</div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Справка
          </h1>
          <p className="text-xl text-gray-600">
            Ответы на частые вопросы и управление данными
          </p>
        </motion.div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.a
            href="#faq"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition"
          >
            <HelpCircle className="mx-auto mb-3 text-indigo-600" size={40} />
            <div className="font-bold text-gray-800">FAQ</div>
            <div className="text-sm text-gray-600">Частые вопросы</div>
          </motion.a>

          <motion.a
            href="#data"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition"
          >
            <Download className="mx-auto mb-3 text-purple-600" size={40} />
            <div className="font-bold text-gray-800">Управление данными</div>
            <div className="text-sm text-gray-600">Экспорт/импорт</div>
          </motion.a>

          <motion.a
            href="https://github.com/dzhechko/agent-skills-academy"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition"
          >
            <Book className="mx-auto mb-3 text-pink-600" size={40} />
            <div className="font-bold text-gray-800">GitHub</div>
            <div className="text-sm text-gray-600">Исходный код</div>
          </motion.a>
        </div>

        {/* FAQ Section */}
        <motion.div
          id="faq"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Часто задаваемые вопросы
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition"
                >
                  <span className="font-bold text-lg text-gray-800 pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="text-indigo-600 flex-shrink-0" size={24} />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          id="data"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Управление данными
          </h2>

          <div className="space-y-4">
            {/* Export */}
            <div className="border-2 border-gray-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Download className="text-green-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">
                    Экспорт прогресса
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Скачайте файл с вашим прогрессом для резервного копирования или переноса на другое устройство.
                  </p>
                  <button
                    onClick={handleExport}
                    className="px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition"
                  >
                    Скачать прогресс
                  </button>
                </div>
              </div>
            </div>

            {/* Import */}
            <div className="border-2 border-gray-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Upload className="text-blue-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">
                    Импорт прогресса
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Загрузите ранее сохранённый файл прогресса. Это заменит текущие данные.
                  </p>
                  <label className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition cursor-pointer">
                    Выбрать файл
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                  {importMessage && (
                    <div className="mt-3 text-sm font-semibold">
                      {importMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reset */}
            <div className="border-2 border-red-200 rounded-2xl p-6 bg-red-50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="text-red-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">
                    Сброс прогресса
                  </h3>
                  <p className="text-gray-600 mb-4">
                    ⚠️ Внимание! Это действие удалит все ваши данные без возможности восстановления.
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition"
                  >
                    Сбросить всё
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
