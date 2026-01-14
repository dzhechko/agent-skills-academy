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

            {/* Key Skills (для Agent Skills) */}
            {section.content.keySkills && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Ключевые навыки</h2>
                <div className="grid gap-6">
                  {section.content.keySkills.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-white border-2 border-indigo-200 rounded-2xl p-6"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <span className="text-5xl">{skill.icon}</span>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">{skill.title}</h3>
                          <p className="text-gray-700 mb-4">{skill.description}</p>
                        </div>
                      </div>
                      
                      <div className="bg-indigo-50 rounded-xl p-4 mb-4">
                        <h4 className="font-bold text-indigo-900 mb-2">Возможности:</h4>
                        <ul className="space-y-1">
                          {skill.capabilities.map((cap, capIndex) => (
                            <li key={capIndex} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-indigo-600 mt-0.5">•</span>
                              <span>{cap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-4">
                        <p className="text-sm text-gray-700">
                          <strong className="text-green-700">Пример:</strong> {skill.example}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Features (для Agent Skills) */}
            {section.content.performanceFeatures && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Performance Features</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.content.performanceFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200"
                    >
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.feature}</h3>
                      <div className="text-2xl font-bold text-purple-600 mb-2">{feature.benefit}</div>
                      <p className="text-sm text-gray-700 mb-3">{feature.description}</p>
                      <div className="text-xs text-gray-600 bg-white rounded-lg p-2">
                        <strong>Use Case:</strong> {feature.useCase}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Real World Examples (для Agent Skills) */}
            {section.content.realWorldExamples && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Реальные примеры</h2>
                {section.content.realWorldExamples.map((example, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-blue-50 rounded-2xl p-6 mb-4 border-l-4 border-blue-500"
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{example.scenario}</h3>
                    <p className="text-gray-700 mb-4">{example.description}</p>
                    
                    <div className="bg-white rounded-xl p-4 mb-3">
                      <h4 className="font-bold text-gray-800 mb-3">Workflow:</h4>
                      <ol className="space-y-2">
                        {example.workflow.map((step, stepIndex) => (
                          <li key={stepIndex} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="font-bold text-blue-600 min-w-[20px]">{stepIndex + 1}.</span>
                            <span>{step.replace(/^\d+\.\s*/, '')}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {example.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
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
                {/* Проверяем тип первого элемента */}
                {typeof section.content.bestPractices[0] === 'string' ? (
                  /* Простой список строк */
                  <ul className="space-y-2">
                    {section.content.bestPractices.map((practice, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-gray-700">{practice}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  /* Структурированные практики по категориям */
                  <div className="grid gap-6">
                    {section.content.bestPractices.map((categoryGroup, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-green-50 rounded-2xl p-6 border-l-4 border-green-500"
                      >
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                          {categoryGroup.category}
                        </h3>
                        <ul className="space-y-2">
                          {categoryGroup.practices.map((practice, practiceIndex) => (
                            <li key={practiceIndex} className="flex items-start gap-3">
                              <span className="text-green-600 mt-1">✓</span>
                              <span className="text-gray-700">{practice}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Limitations (для Agent Skills) */}
            {section.content.limitations && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Ограничения</h2>
                <div className="grid gap-4">
                  {section.content.limitations.map((limitGroup, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-yellow-50 rounded-2xl p-6 border-l-4 border-yellow-500"
                    >
                      <h3 className="text-lg font-bold text-gray-800 mb-3">
                        ⚠️ {limitGroup.title}
                      </h3>
                      <ul className="space-y-2">
                        {limitGroup.limits.map((limit, limitIndex) => (
                          <li key={limitIndex} className="flex items-start gap-3">
                            <span className="text-yellow-600 mt-1">•</span>
                            <span className="text-gray-700">{limit}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Integration Tips (для Agent Skills) */}
            {section.content.integrationTips && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 Советы по интеграции</h2>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                  <ul className="space-y-3">
                    {section.content.integrationTips.map((tip, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="flex items-start gap-3"
                      >
                        <span className="text-blue-600 font-bold mt-0.5">{index + 1}.</span>
                        <span className="text-gray-700">{tip}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Architecture (для Custom Skills) */}
            {section.content.architecture && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {section.content.architecture.title}
                </h2>
                
                <div className="prose max-w-none mb-6">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {section.content.architecture.description}
                  </p>
                </div>

                {/* Architecture Images */}
                {section.content.architecture.images && (
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {section.content.architecture.images.map((img, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-white rounded-2xl p-4 shadow-lg border-2 border-indigo-100"
                      >
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="w-full rounded-lg mb-3"
                        />
                        <p className="text-sm text-gray-600 text-center italic">
                          {img.caption}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* How Claude Accesses */}
                {section.content.architecture.howClaudeAccesses && (
                  <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      Как Claude получает доступ к Skills:
                    </h3>
                    <ul className="space-y-3">
                      {section.content.architecture.howClaudeAccesses.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-blue-600 font-bold mt-0.5">{index + 1}.</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* What Enables */}
                {section.content.architecture.whatEnables && (
                  <div className="grid gap-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      Что обеспечивает эта архитектура:
                    </h3>
                    {section.content.architecture.whatEnables.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-l-4 border-green-500"
                      >
                        <h4 className="text-lg font-bold text-gray-800 mb-2">
                          {item.capability}
                        </h4>
                        <p className="text-gray-700">{item.description}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
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
      'agent-skills': 'agentSkills',
      'basics': 'basics',
      'tool-use': 'toolUse',
      'workflows': 'workflows',
      'extended-thinking': 'extendedThinking',
      'patterns': 'patterns',
      'best-practices': 'bestPractices',
      'custom-skills': 'customSkills'
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
