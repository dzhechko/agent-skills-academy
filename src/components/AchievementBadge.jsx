import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export default function AchievementBadge({ achievement, isUnlocked, showDetails = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`
        relative p-6 rounded-2xl border-2 transition-all
        ${isUnlocked 
          ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-400 shadow-lg' 
          : 'bg-gray-100 border-gray-300'}
      `}
    >
      {/* Иконка */}
      <div className="text-center mb-4">
        <div className={`
          text-6xl mb-2 transition-all
          ${isUnlocked ? 'grayscale-0' : 'grayscale opacity-50'}
        `}>
          {achievement.icon}
        </div>
        
        {!isUnlocked && (
          <div className="absolute top-4 right-4">
            <Lock size={24} className="text-gray-400" />
          </div>
        )}
      </div>

      {/* Название */}
      <h3 className={`
        text-xl font-bold text-center mb-2
        ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}
      `}>
        {achievement.title}
      </h3>

      {/* Описание */}
      {showDetails && (
        <p className={`
          text-sm text-center mb-3
          ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}
        `}>
          {achievement.description}
        </p>
      )}

      {/* XP награда */}
      {isUnlocked && (
        <div className="flex items-center justify-center gap-2 bg-yellow-400 rounded-full px-4 py-2 mx-auto w-fit">
          <span className="text-xl">⭐</span>
          <span className="font-bold text-gray-800">+{achievement.xpReward} XP</span>
        </div>
      )}
      
      {!isUnlocked && showDetails && (
        <div className="text-center text-xs text-gray-400 mt-2">
          🔒 Заблокировано
        </div>
      )}
    </motion.div>
  );
}

// Компонент для показа нового достижения (popup)
export function AchievementUnlocked({ achievement, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{ type: "spring", duration: 0.7 }}
        className="bg-white rounded-3xl p-8 max-w-md text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Конфетти эффект */}
        <div className="text-8xl mb-4 animate-bounce">
          {achievement.icon}
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Достижение разблокировано!
        </h2>

        <h3 className="text-2xl font-bold text-indigo-600 mb-4">
          {achievement.title}
        </h3>

        <p className="text-gray-600 mb-6">
          {achievement.description}
        </p>

        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full px-6 py-3 inline-flex items-center gap-2 text-white font-bold text-xl mb-6">
          <span>⭐</span>
          <span>+{achievement.xpReward} XP</span>
        </div>

        <motion.button
          onClick={onClose}
          className="w-full py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Продолжить
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
