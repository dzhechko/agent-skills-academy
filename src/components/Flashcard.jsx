import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, RotateCw } from 'lucide-react';

export default function Flashcard({ cards, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState([]);
  const [unknownCards, setUnknownCards] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleKnown = () => {
    setKnownCards([...knownCards, currentCard.id]);
    nextCard();
  };

  const handleUnknown = () => {
    setUnknownCards([...unknownCards, currentCard.id]);
    nextCard();
  };

  const nextCard = () => {
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 200);
    } else {
      setShowResults(true);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setKnownCards([]);
    setUnknownCards([]);
    setShowResults(false);
    setIsFlipped(false);
  };

  const score = Math.round((knownCards.length / cards.length) * 100);

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[500px] bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-7xl mb-6"
        >
          {score >= 80 ? '🎉' : score >= 60 ? '👍' : '💪'}
        </motion.div>
        
        <h2 className="text-4xl font-bold mb-4">Результаты</h2>
        
        <div className="grid grid-cols-2 gap-6 mb-8 w-full max-w-md">
          <div className="bg-white/20 rounded-2xl p-6 text-center backdrop-blur-sm">
            <div className="text-5xl font-bold mb-2">{knownCards.length}</div>
            <div className="text-sm opacity-90">Освоено</div>
          </div>
          <div className="bg-white/20 rounded-2xl p-6 text-center backdrop-blur-sm">
            <div className="text-5xl font-bold mb-2">{unknownCards.length}</div>
            <div className="text-sm opacity-90">На повторение</div>
          </div>
        </div>

        <div className="text-3xl font-bold mb-2">{score}%</div>
        <div className="text-lg mb-8 opacity-90">
          {score >= 80 ? 'Отличный результат!' : score >= 60 ? 'Хороший результат!' : 'Нужно повторить материал'}
        </div>

        <div className="flex gap-4">
          <motion.button
            onClick={restart}
            className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-full font-semibold shadow-lg hover:shadow-xl transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCw size={20} />
            Повторить
          </motion.button>
          
          <motion.button
            onClick={() => onComplete && onComplete(score)}
            className="px-6 py-3 bg-yellow-400 text-indigo-900 rounded-full font-semibold shadow-lg hover:shadow-xl transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Продолжить обучение
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8">
      {/* Прогресс-бар */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between text-white text-sm mb-2">
          <span>Карточка {currentIndex + 1} из {cards.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
          <motion.div
            className="bg-yellow-400 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Карточка */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="w-full max-w-md h-80 cursor-pointer mb-8"
          onClick={handleFlip}
        >
          <motion.div
            className="w-full h-full relative"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Лицевая сторона (термин) */}
            <div
              className="absolute w-full h-full bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center"
              style={{ backfaceVisibility: "hidden" }}
            >
              <span className="text-xs uppercase tracking-wide text-indigo-600 font-semibold mb-4 px-3 py-1 bg-indigo-100 rounded-full">
                {currentCard.category}
              </span>
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
                {currentCard.term}
              </h2>
              <p className="text-gray-500 text-sm mt-auto">
                Нажмите для ответа
              </p>
            </div>

            {/* Обратная сторона (определение + пример) */}
            <div
              className="absolute w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-2xl p-6 flex flex-col overflow-y-auto"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)"
              }}
            >
              <p className="text-white text-base leading-relaxed mb-4">
                {currentCard.definition}
              </p>
              
              {/* Пример кода если есть */}
              {currentCard.example && (
                <div className="mt-auto">
                  <div className="text-yellow-300 text-xs font-bold mb-2">ПРИМЕР:</div>
                  <pre className="bg-gray-900/50 text-gray-100 text-xs p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                    {currentCard.example}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Кнопки оценки */}
      <div className="flex gap-4">
        <motion.button
          onClick={handleUnknown}
          className="flex items-center gap-2 px-8 py-3 bg-red-500 text-white rounded-full font-semibold shadow-lg hover:bg-red-600 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ❌ Не знаю
        </motion.button>
        <motion.button
          onClick={handleKnown}
          className="flex items-center gap-2 px-8 py-3 bg-green-500 text-white rounded-full font-semibold shadow-lg hover:bg-green-600 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ✅ Знаю
        </motion.button>
      </div>

      {/* Статистика внизу */}
      <div className="mt-8 flex gap-6 text-white">
        <div className="text-center">
          <div className="text-3xl font-bold">{knownCards.length}</div>
          <div className="text-sm opacity-80">Освоено</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{unknownCards.length}</div>
          <div className="text-sm opacity-80">На повторение</div>
        </div>
      </div>
    </div>
  );
}
