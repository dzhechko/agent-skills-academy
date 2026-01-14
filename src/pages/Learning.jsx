import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Lock, Zap } from 'lucide-react';
import { sections } from '../data/content';
import { loadProgress } from '../utils/progress';

export default function Learning() {
  const progress = loadProgress();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            📚 Обучение
          </h1>
          <p className="text-xl text-gray-600">
            Последовательно изучите все разделы для достижения мастерства
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Ваш прогресс</h2>
            <div className="text-3xl font-bold text-indigo-600">
              {progress.completedSections.length}/{sections.length}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4"
              initial={{ width: 0 }}
              animate={{ width: `${(progress.completedSections.length / sections.length) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          
          <p className="text-gray-600 text-sm mt-3">
            {progress.completedSections.length === sections.length
              ? '🎉 Поздравляем! Все разделы пройдены!'
              : `Осталось разделов: ${sections.length - progress.completedSections.length}`}
          </p>
        </motion.div>

        {/* Sections List */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {sections.map((section, index) => {
            const isCompleted = progress.completedSections.includes(section.id);
            const score = progress.sectionScores[section.id];
            const isPrevCompleted = index === 0 || progress.completedSections.includes(sections[index - 1].id);
            const isLocked = !isPrevCompleted;

            return (
              <motion.div key={section.id} variants={item}>
                <Link
                  to={isLocked ? '#' : `/learning/${section.id}`}
                  className={`
                    block group
                    ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <motion.div
                    whileHover={!isLocked ? { scale: 1.02, y: -3 } : {}}
                    className={`
                      relative bg-white rounded-2xl shadow-lg p-6 transition-all
                      ${isCompleted ? 'border-2 border-green-400' : 'border-2 border-transparent'}
                      ${isLocked ? 'opacity-60' : 'group-hover:shadow-2xl'}
                    `}
                  >
                    {/* Lock indicator */}
                    {isLocked && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-gray-300 rounded-full p-2">
                          <Lock size={24} className="text-gray-600" />
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-6">
                      {/* Icon and Status */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-4xl mb-3">
                          {section.icon}
                        </div>
                        <div className="text-center">
                          {isCompleted ? (
                            <CheckCircle className="text-green-500 mx-auto" size={28} />
                          ) : isLocked ? (
                            <Lock className="text-gray-400 mx-auto" size={28} />
                          ) : (
                            <Circle className="text-gray-300 mx-auto" size={28} />
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-2xl font-bold text-gray-800">
                            {section.title}
                          </h3>
                          {isCompleted && score !== undefined && (
                            <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold">
                              {score}%
                            </div>
                          )}
                        </div>

                        <p className="text-gray-600 mb-4">
                          {section.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                            <Zap size={18} />
                            <span>+{section.xpReward} XP</span>
                          </div>

                          {!isLocked && (
                            <div className="flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-3 transition-all">
                              <span>{isCompleted ? 'Повторить' : 'Начать'}</span>
                              <motion.span
                                initial={{ x: 0 }}
                                whileHover={{ x: 5 }}
                              >
                                →
                              </motion.span>
                            </div>
                          )}

                          {isLocked && (
                            <div className="text-gray-400 text-sm">
                              Завершите предыдущий раздел
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Completion CTA */}
        {progress.completedSections.length === sections.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4">
              🎉 Все разделы пройдены!
            </h2>
            <p className="text-lg mb-6">
              Теперь вы готовы к финальному тесту. Продемонстрируйте свои знания!
            </p>
            <Link to="/final-test">
              <motion.button
                className="px-8 py-4 bg-white text-green-600 rounded-full font-bold text-lg shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Пройти финальный тест
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
