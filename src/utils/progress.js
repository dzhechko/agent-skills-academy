// Утилиты для работы с прогрессом пользователя (LocalStorage)

const STORAGE_KEY = 'agent_skills_progress';

// Начальное состояние прогресса
const initialProgress = {
  completedSections: [],
  sectionScores: {},
  totalXP: 0,
  currentLevel: 1,
  unlockedAchievements: [],
  finalTestScore: null,
  lastVisit: new Date().toISOString(),
  loginStreak: 1,
  visitDates: [new Date().toDateString()],
  correctStreak: 0,
  maxCorrectStreak: 0,
  fastestModuleTime: null,
  flashcardProgress: {}
};

// Загрузить прогресс из LocalStorage
export const loadProgress = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const progress = JSON.parse(saved);
      // Обновить streak при возвращении
      updateLoginStreak(progress);
      return progress;
    }
    return initialProgress;
  } catch (error) {
    console.error('Error loading progress:', error);
    return initialProgress;
  }
};

// Сохранить прогресс в LocalStorage
export const saveProgress = (progress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

// Обновить streak посещений
const updateLoginStreak = (progress) => {
  const today = new Date().toDateString();
  const lastVisit = new Date(progress.lastVisit).toDateString();
  
  if (today === lastVisit) {
    // Сегодня уже заходили
    return;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();
  
  if (lastVisit === yesterdayStr) {
    // Вчера заходили - продолжаем streak
    progress.loginStreak += 1;
  } else {
    // Пропустили дни - сбрасываем streak
    progress.loginStreak = 1;
  }
  
  progress.lastVisit = new Date().toISOString();
  progress.visitDates.push(today);
  saveProgress(progress);
};

// Добавить XP и проверить повышение уровня
export const addXP = (progress, amount) => {
  progress.totalXP += amount;
  
  // Проверить повышение уровня
  const levels = [
    { level: 1, minXP: 0 },
    { level: 2, minXP: 100 },
    { level: 3, minXP: 300 },
    { level: 4, minXP: 600 },
    { level: 5, minXP: 1000 }
  ];
  
  for (let i = levels.length - 1; i >= 0; i--) {
    if (progress.totalXP >= levels[i].minXP) {
      progress.currentLevel = levels[i].level;
      break;
    }
  }
  
  saveProgress(progress);
  return progress;
};

// Отметить секцию как завершённую
export const completeSection = (progress, sectionId, score = 100) => {
  if (!progress.completedSections.includes(sectionId)) {
    progress.completedSections.push(sectionId);
  }
  progress.sectionScores[sectionId] = score;
  saveProgress(progress);
  return progress;
};

// Разблокировать достижение
export const unlockAchievement = (progress, achievementId) => {
  if (!progress.unlockedAchievements.includes(achievementId)) {
    progress.unlockedAchievements.push(achievementId);
    saveProgress(progress);
    return true; // Новое достижение
  }
  return false; // Уже было разблокировано
};

// Проверить все достижения
export const checkAchievements = (progress, achievements) => {
  const newAchievements = [];
  
  achievements.forEach(achievement => {
    if (!progress.unlockedAchievements.includes(achievement.id)) {
      if (achievement.condition(progress)) {
        unlockAchievement(progress, achievement.id);
        addXP(progress, achievement.xpReward);
        newAchievements.push(achievement);
      }
    }
  });
  
  return newAchievements;
};

// Обновить streak правильных ответов
export const updateCorrectStreak = (progress, isCorrect) => {
  if (isCorrect) {
    progress.correctStreak += 1;
    if (progress.correctStreak > progress.maxCorrectStreak) {
      progress.maxCorrectStreak = progress.correctStreak;
    }
  } else {
    progress.correctStreak = 0;
  }
  saveProgress(progress);
  return progress;
};

// Сохранить время прохождения модуля
export const saveModuleTime = (progress, timeInSeconds) => {
  if (!progress.fastestModuleTime || timeInSeconds < progress.fastestModuleTime) {
    progress.fastestModuleTime = timeInSeconds;
  }
  saveProgress(progress);
  return progress;
};

// Получить информацию об уровне
export const getLevelInfo = (totalXP) => {
  const levels = [
    { level: 1, title: "Новичок", minXP: 0, maxXP: 100, icon: "🌱" },
    { level: 2, title: "Практик", minXP: 100, maxXP: 300, icon: "📘" },
    { level: 3, title: "Специалист", minXP: 300, maxXP: 600, icon: "⚙️" },
    { level: 4, title: "Эксперт", minXP: 600, maxXP: 1000, icon: "🎯" },
    { level: 5, title: "Мастер агентов", minXP: 1000, maxXP: Infinity, icon: "🏆" }
  ];
  
  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalXP >= levels[i].minXP) {
      const currentLevel = levels[i];
      const nextLevel = levels[i + 1];
      const progressInLevel = totalXP - currentLevel.minXP;
      const levelRange = currentLevel.maxXP - currentLevel.minXP;
      const percentage = nextLevel ? (progressInLevel / levelRange) * 100 : 100;
      
      return {
        ...currentLevel,
        progressInLevel,
        levelRange,
        percentage: Math.min(percentage, 100),
        nextLevel
      };
    }
  }
  
  return levels[0];
};

// Сбросить прогресс (для тестирования)
export const resetProgress = () => {
  localStorage.removeItem(STORAGE_KEY);
  return initialProgress;
};

// Экспортировать прогресс как JSON
export const exportProgress = (progress) => {
  const dataStr = JSON.stringify(progress, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  const exportFileDefaultName = `agent_skills_progress_${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

// Импортировать прогресс из JSON
export const importProgress = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const progress = JSON.parse(e.target.result);
        saveProgress(progress);
        resolve(progress);
      } catch (error) {
        reject(new Error('Неверный формат файла'));
      }
    };
    reader.onerror = () => reject(new Error('Ошибка чтения файла'));
    reader.readAsText(file);
  });
};
