import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Quiz from '../components/Quiz';
import { AchievementUnlocked } from '../components/AchievementBadge';
import { finalTest, achievements } from '../data/content';
import { loadProgress, saveProgress, addXP, checkAchievements } from '../utils/progress';

export default function FinalTest() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [newAchievements, setNewAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(null);

  const progress = loadProgress();
  const allSectionsCompleted = progress.completedSections.length === 7;

  const handleStart = () => {
    setStarted(true);
  };

  const handleComplete = (testScore, answers) => {
    let updatedProgress = loadProgress();
    
    // Сохраняем результат теста
    updatedProgress.finalTestScore = testScore;
    
    // Добавляем XP (до 300 за идеальный результат)
    const xpEarned = Math.round(300 * (testScore / 100));
    updatedProgress = addXP(updatedProgress, xpEarned);
    
    saveProgress(updatedProgress);
    
    // Проверяем достижения
    const unlockedAchievements = checkAchievements(updatedProgress, achievements);
    
    setScore(testScore);
    setCompleted(true);
    
    if (unlockedAchievements.length > 0) {
      setNewAchievements(unlockedAchievements);
      setShowAchievement(unlockedAchievements[0]);
    }
  };

  const handleCloseAchievement = () => {
    const currentIndex = newAchievements.indexOf(showAchievement);
    if (currentIndex < newAchievements.length - 1) {
      setShowAchievement(newAchievements[currentIndex + 1]);
    } else {
      setShowAchievement(null);
    }
  };

  // Показ достижения
  if (showAchievement) {
    return (
      <AchievementUnlocked
        achievement={showAchievement}
        onClose={handleCloseAchievement}
      />
    );
  }

  // Результаты теста
  if (completed && !showAchievement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="text-8xl mb-6"
            >
              {score >= 80 ? '🏆' : score >= 60 ? '🎉' : '📚'}
            </motion.div>

            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              {score >= 80 ? 'Поздравляем!' : score >= 60 ? 'Хороший результат!' : 'Попробуйте ещё раз!'}
            </h1>

            <div className="text-7xl font-bold text-indigo-600 mb-4">
              {score}%
            </div>

            <p className="text-xl text-gray-600 mb-8">
              {score >= 80 
                ? 'Вы продемонстрировали отличное знание агентных систем Claude AI!' 
                : score >= 60
                ? 'У вас хорошая база знаний. Повторите некоторые разделы для улучшения результата.'
                : 'Рекомендуем вернуться к изучению материала и попробовать снова.'}
            </p>

            {score >= 80 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl p-8 mb-8 text-white"
              >
                <h2 className="text-3xl font-bold mb-4">🎓 Сертификат получен!</h2>
                <p className="text-lg mb-4">
                  Вы прошли полный курс "Agent Skills Academy" с отличным результатом
                </p>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="font-bold text-2xl">Agent Skills Master</div>
                  <div className="text-sm opacity-90 mt-1">
                    {new Date().toLocaleDateString('ru-RU', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex gap-4 justify-center">
              <motion.button
                onClick={() => navigate('/')}
                className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                На главную
              </motion.button>
              
              {score < 80 && (
                <motion.button
                  onClick={() => {
                    setStarted(false);
                    setCompleted(false);
                  }}
                  className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Попробовать снова
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Прохождение теста
  if (started) {
    return (
      <div className="min-h-screen py-8">
        <Quiz
          questions={finalTest}
          title="Финальный тест"
          onComplete={handleComplete}
        />
      </div>
    );
  }

  // Стартовый экран
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-8 font-semibold"
        >
          <ArrowLeft size={20} />
          На главную
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-12"
        >
          <div className="text-center mb-8">
            <div className="text-7xl mb-6">🎓</div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Финальный тест
            </h1>
            <p className="text-xl text-gray-600">
              Проверьте свои знания агентных систем Claude AI
            </p>
          </div>

          {/* Предупреждение, если не все разделы пройдены */}
          {!allSectionsCompleted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-6 mb-8"
            >
              <div className="flex gap-3">
                <AlertCircle className="text-amber-600 flex-shrink-0" size={24} />
                <div>
                  <div className="font-bold text-amber-800 mb-1">Рекомендация</div>
                  <p className="text-amber-700">
                    Вы прошли только {progress.completedSections.length} из 7 разделов. 
                    Рекомендуем сначала завершить все разделы для лучшего результата.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Информация о тесте */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-indigo-50 rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">20</div>
              <div className="text-gray-600">Вопросов</div>
            </div>
            <div className="bg-purple-50 rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">~25</div>
              <div className="text-gray-600">Минут</div>
            </div>
            <div className="bg-pink-50 rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-pink-600 mb-2">80%</div>
              <div className="text-gray-600">Для сертификата</div>
            </div>
          </div>

          {/* Правила */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-xl text-gray-800 mb-4">Правила теста:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span>Тест состоит из 20 вопросов по всем разделам курса</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span>Каждый вопрос имеет один правильный ответ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span>После выбора ответа вы увидите объяснение</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span>Для получения сертификата нужно набрать минимум 80%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span>Вы можете пересдать тест в любое время</span>
              </li>
            </ul>
          </div>

          {/* Кнопка старта */}
          <motion.button
            onClick={handleStart}
            className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold text-xl shadow-xl hover:shadow-2xl transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Начать тест →
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
