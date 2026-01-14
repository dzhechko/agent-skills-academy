import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Award } from 'lucide-react';
import Flashcard from '../components/Flashcard';
import Quiz from '../components/Quiz';
import { sections, flashcardsBySection, quizQuestions } from '../data/content';
import { loadProgress, saveProgress, addXP, completeSection, checkAchievements } from '../utils/progress';
import { achievements } from '../data/content';
import { AchievementUnlocked } from '../components/AchievementBadge';

export default function SectionDetail() {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState('content'); // 'content', 'flashcards', 'quiz'
  const [newAchievements, setNewAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(null);

  const section = sections.find(s => s.id === sectionId);
  const progress = loadProgress();

  if (!section) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Раздел не найден</h2>
          <button
            onClick={() => navigate('/learning')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold"
          >
            Вернуться к обучению
          </button>
        </div>
      </div>
    );
  }

  const handleCompleteContent = () => {
    setMode('flashcards');
  };

  const handleCompleteFlashcards = (score) => {
    let updatedProgress = loadProgress();
    updatedProgress = addXP(updatedProgress, Math.round(section.xpReward * 0.3));
    
    // Если карточки пройдены хорошо, переходим к тесту
    if (score >= 60) {
      setMode('quiz');
    } else {
      setMode('flashcards');
    }
  };

  const handleCompleteQuiz = (score, answers) => {
    let updatedProgress = loadProgress();
    
    // Добавляем XP
    const xpEarned = Math.round(section.xpReward * (score / 100));
    updatedProgress = addXP(updatedProgress, xpEarned);
    
    // Отмечаем секцию как завершённую
    updatedProgress = completeSection(updatedProgress, sectionId, score);
    
    // Проверяем достижения
    const unlockedAchievements = checkAchievements(updatedProgress, achievements);
    
    if (unlockedAchievements.length > 0) {
      setNewAchievements(unlockedAchievements);
      setShowAchievement(unlockedAchievements[0]);
    } else {
      navigate('/learning');
    }
  };

  const handleCloseAchievement = () => {
    const currentIndex = newAchievements.indexOf(showAchievement);
    if (currentIndex < newAchievements.length - 1) {
      setShowAchievement(newAchievements[currentIndex + 1]);
    } else {
      navigate('/learning');
    }
  };

  // Контентный режим
  if (mode === 'content') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate('/learning')}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4 font-semibold"
            >
              <ArrowLeft size={20} />
              Назад к обучению
            </button>

            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <span className="text-6xl">{section.icon}</span>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    {section.title}
                  </h1>
                  <p className="text-lg text-gray-600">
                    {section.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-8 mb-8"
          >
            {/* Intro */}
            {section.content.intro && (
              <div className="prose max-w-none mb-8">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {section.content.intro}
                </p>
              </div>
            )}

            {/* Key Points */}
            {section.content.keyPoints && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Ключевые концепции</h2>
                <div className="grid gap-4">
                  {section.content.keyPoints.map((point, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-indigo-50 rounded-2xl p-6 border-l-4 border-indigo-500"
                    >
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{point.title}</h3>
                      <p className="text-gray-700">{point.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Tool Types */}
            {section.content.toolTypes && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Типы инструментов</h2>
                {section.content.toolTypes.map((category, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-xl font-bold text-indigo-600 mb-3">{category.category}</h3>
                    <div className="grid gap-3">
                      {category.tools.map((tool, toolIndex) => (
                        <div key={toolIndex} className="bg-gray-50 rounded-xl p-4">
                          <div className="font-bold text-gray-800">{tool.name}</div>
                          <div className="text-sm text-gray-600">{tool.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Best Practices */}
            {section.content.bestPractices && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Best Practices</h2>
                <ul className="space-y-2">
                  {section.content.bestPractices.map((practice, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">{practice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <button
              onClick={handleCompleteContent}
              className="px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition"
            >
              Перейти к практике →
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Режим флэш-карточек
  if (mode === 'flashcards') {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setMode('content')}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4 font-semibold"
          >
            <ArrowLeft size={20} />
            Назад к материалу
          </button>
          <Flashcard 
            cards={flashcardsBySection[sectionId] || flashcardsBySection['basics']} 
            onComplete={handleCompleteFlashcards}
          />
        </div>
      </div>
    );
  }

  // Режим теста
  if (mode === 'quiz') {
    // Маппинг ID раздела на ключ вопросов
    const questionKeyMap = {
      'basics': 'basics',
      'tool-use': 'toolUse',
      'workflows': 'workflows',
      'extended-thinking': 'extendedThinking',
      'patterns': 'patterns',
      'best-practices': 'bestPractices'
    };
    
    const questionsKey = questionKeyMap[sectionId] || 'basics';
    const sectionQuestions = quizQuestions[questionsKey] || quizQuestions.basics;
    
    return (
      <div className="min-h-screen py-8">
        <Quiz 
          questions={sectionQuestions}
          title={`Тест: ${section.title}`}
          onComplete={handleCompleteQuiz}
        />
      </div>
    );
  }

  // Показ достижений
  if (showAchievement) {
    return (
      <AchievementUnlocked
        achievement={showAchievement}
        onClose={handleCloseAchievement}
      />
    );
  }

  return null;
}
