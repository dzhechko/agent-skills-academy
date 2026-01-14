import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Target, Zap, Award, ArrowRight } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import { loadProgress } from '../utils/progress';
import { sections } from '../data/content';

export default function Home() {
  const progress = loadProgress();

  const stats = [
    { 
      icon: BookOpen, 
      label: 'Разделов пройдено', 
      value: `${progress.completedSections.length}/${sections.length}`,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: Target, 
      label: 'Достижений', 
      value: progress.unlockedAchievements.length,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      icon: Zap, 
      label: 'Текущий streak', 
      value: `${progress.loginStreak} дн.`,
      color: 'from-orange-500 to-red-500'
    },
    { 
      icon: Award, 
      label: 'Лучший результат', 
      value: `${progress.maxCorrectStreak} подряд`,
      color: 'from-green-500 to-emerald-500'
    }
  ];

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-800 mb-4">
            Agent Skills Academy
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 mb-8">
            Мастерство агентных систем Claude AI
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/learning">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Начать обучение
                <ArrowRight size={24} />
              </motion.button>
            </Link>
            <Link to="/final-test">
              <motion.button
                className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Пройти финальный тест
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <ProgressBar totalXP={progress.totalXP} />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                variants={item}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="text-white" size={24} />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Sections Overview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Разделы обучения</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => {
              const isCompleted = progress.completedSections.includes(section.id);
              const score = progress.sectionScores[section.id];
              
              return (
                <Link key={section.id} to={`/learning/${section.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -5 }}
                    className={`
                      bg-white rounded-2xl shadow-lg p-6 h-full transition-all
                      ${isCompleted ? 'border-2 border-green-400' : 'border-2 border-transparent'}
                    `}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-5xl">{section.icon}</span>
                      {isCompleted && (
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          ✓ {score}%
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {section.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                      <Zap size={16} />
                      <span>+{section.xpReward} XP</span>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Готовы стать экспертом?</h2>
          <p className="text-lg mb-6 opacity-90">
            Пройдите все разделы, соберите достижения и получите сертификат!
          </p>
          <Link to="/achievements">
            <motion.button
              className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Посмотреть достижения
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
