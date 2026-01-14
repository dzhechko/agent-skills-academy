import { motion } from 'framer-motion';
import { levels } from '../data/content';

export default function ProgressBar({ totalXP }) {
  // Найти текущий уровень
  let currentLevel = levels[0];
  let nextLevel = levels[1];
  
  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalXP >= levels[i].minXP) {
      currentLevel = levels[i];
      nextLevel = levels[i + 1] || null;
      break;
    }
  }

  const progressInLevel = totalXP - currentLevel.minXP;
  const levelRange = nextLevel ? (nextLevel.minXP - currentLevel.minXP) : 0;
  const percentage = nextLevel ? Math.min((progressInLevel / levelRange) * 100, 100) : 100;
  const xpToNext = nextLevel ? nextLevel.minXP - totalXP : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Заголовок уровня */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{currentLevel.icon}</span>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Уровень {currentLevel.level}</div>
            <div className="text-xl font-bold text-gray-800">{currentLevel.title}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-indigo-600">{totalXP}</div>
          <div className="text-xs text-gray-500">XP</div>
        </div>
      </div>

      {/* Прогресс-бар */}
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        {nextLevel && (
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-gray-600">{currentLevel.minXP} XP</span>
            <span className="font-semibold text-indigo-600">
              {xpToNext} XP до следующего уровня
            </span>
            <span className="text-gray-600">{nextLevel.minXP} XP</span>
          </div>
        )}
        
        {!nextLevel && (
          <div className="mt-2 text-center text-sm font-semibold text-yellow-600">
            🏆 Максимальный уровень достигнут!
          </div>
        )}
      </div>
    </div>
  );
}
