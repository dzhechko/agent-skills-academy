import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ChevronRight, Award } from 'lucide-react';

export default function Quiz({ questions, onComplete, title = "Тест" }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSelectAnswer = (index) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === question.correct;
    setAnswers([...answers, { questionId: question.id, isCorrect, selected: selectedAnswer }]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setShowResults(true);
    }
  };

  const correctCount = answers.filter(a => a.isCorrect).length;
  const score = Math.round((correctCount / questions.length) * 100);

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto p-8"
      >
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <Award size={80} className="mx-auto mb-6" />
          </motion.div>

          <h2 className="text-4xl font-bold mb-4">Тест завершён!</h2>
          
          <div className="grid grid-cols-2 gap-4 my-8 max-w-md mx-auto">
            <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-5xl font-bold mb-2">{correctCount}</div>
              <div className="text-sm opacity-90">из {questions.length}</div>
            </div>
            <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-5xl font-bold mb-2">{score}%</div>
              <div className="text-sm opacity-90">Правильно</div>
            </div>
          </div>

          <div className="text-xl mb-8">
            {score >= 90 ? '🏆 Превосходно!' : 
             score >= 70 ? '🎉 Отлично!' : 
             score >= 50 ? '👍 Хорошо!' : 
             '💪 Нужно повторить материал'}
          </div>

          <motion.button
            onClick={() => onComplete && onComplete(score, answers)}
            className="px-8 py-4 bg-yellow-400 text-indigo-900 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Продолжить
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
        
        {/* Прогресс-бар */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-sm font-semibold text-gray-600">
            {currentQuestion + 1}/{questions.length}
          </span>
        </div>
      </div>

      {/* Вопрос */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-6"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-8">
            {question.question}
          </h3>

          {/* Варианты ответов */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correct;
              const showCorrect = showFeedback && isCorrect;
              const showWrong = showFeedback && isSelected && !isCorrect;

              return (
                <motion.button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={showFeedback}
                  className={`
                    w-full text-left p-5 rounded-2xl border-2 transition-all
                    ${showCorrect ? 'bg-green-50 border-green-500' :
                      showWrong ? 'bg-red-50 border-red-500' :
                      isSelected ? 'bg-indigo-50 border-indigo-500' :
                      'bg-gray-50 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'}
                    ${showFeedback ? 'cursor-default' : 'cursor-pointer'}
                  `}
                  whileHover={!showFeedback ? { scale: 1.02 } : {}}
                  whileTap={!showFeedback ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold
                      ${showCorrect ? 'bg-green-500 border-green-500 text-white' :
                        showWrong ? 'bg-red-500 border-red-500 text-white' :
                        isSelected ? 'bg-indigo-500 border-indigo-500 text-white' :
                        'border-gray-300 text-gray-600'}
                    `}>
                      {showCorrect ? <Check size={20} /> :
                       showWrong ? <X size={20} /> :
                       String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1 text-lg">{option}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Объяснение */}
          {showFeedback && question.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl"
            >
              <p className="text-sm text-gray-700">
                <strong className="text-blue-700">Пояснение:</strong> {question.explanation}
              </p>
            </motion.div>
          )}

          {/* Кнопки */}
          <div className="flex gap-3 mt-8">
            {!showFeedback ? (
              <motion.button
                onClick={handleCheckAnswer}
                disabled={selectedAnswer === null}
                className={`
                  flex-1 py-4 rounded-full font-bold text-lg transition
                  ${selectedAnswer !== null
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                `}
                whileHover={selectedAnswer !== null ? { scale: 1.02 } : {}}
                whileTap={selectedAnswer !== null ? { scale: 0.98 } : {}}
              >
                Проверить
              </motion.button>
            ) : (
              <motion.button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-lg transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {currentQuestion < questions.length - 1 ? 'Далее' : 'Завершить'}
                <ChevronRight size={24} />
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
