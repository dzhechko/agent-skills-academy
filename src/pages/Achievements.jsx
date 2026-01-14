import { motion } from 'framer-motion';
import { Trophy, Award as AwardIcon } from 'lucide-react';
import AchievementBadge from '../components/AchievementBadge';
import { achievements } from '../data/content';
import { loadProgress } from '../utils/progress';

export default function Achievements() {
  const progress = loadProgress();

  const unlockedCount = progress.unlockedAchievements.length;
  const totalCount = achievements.length;
  const percentage = Math.round((unlockedCount / totalCount) * 100);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-7xl mb-4">🏆</div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Достижения
          </h1>
          <p className="text-xl text-gray-600">
            Отслеживайте свой прогресс и собирайте награды!
          </p>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-3xl shadow-2xl p-8 mb-12"
        >
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <Trophy size={60} />
              <div>
                <div className="text-sm opacity-90 mb-1">Собрано достижений</div>
                <div className="text-5xl font-bold">{unlockedCount}/{totalCount}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-6xl font-bold mb-2">{percentage}%</div>
              <div className="text-sm opacity-90">Завершено</div>
            </div>
          </div>

          <div className="mt-6 bg-white/30 rounded-full h-4 overflow-hidden">
            <motion.div
              className="bg-white h-4"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {achievements.map((achievement) => {
            const isUnlocked = progress.unlockedAchievements.includes(achievement.id);
            
            return (
              <motion.div key={achievement.id} variants={item}>
                <AchievementBadge
                  achievement={achievement}
                  isUnlocked={isUnlocked}
                  showDetails={true}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white rounded-3xl shadow-xl p-8 text-center"
        >
          {unlockedCount === totalCount ? (
            <>
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Поздравляем! Все достижения собраны!
              </h2>
              <p className="text-lg text-gray-600">
                Вы настоящий мастер агентных систем Claude AI!
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">💪</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Продолжайте в том же духе!
              </h2>
              <p className="text-lg text-gray-600">
                Осталось собрать ещё {totalCount - unlockedCount} достижени{totalCount - unlockedCount === 1 ? 'е' : 'й'}
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
