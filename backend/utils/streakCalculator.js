const getDateString = (date) => {
  return date.toISOString().split('T')[0];
};

const getYesterday = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getDateString(yesterday);
};

const getToday = () => {
  return getDateString(new Date());
};

export const calculateCurrentStreak = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;

  const uniqueDates = [...new Set(tasks
    .filter(task => task.completed)
    .map(task => {
      const dateSource = task.completedAt;
      return dateSource ? getDateString(new Date(dateSource)) : null;
    })
    .filter(date => date !== null)
  )];
  uniqueDates.sort((a, b) => new Date(b) - new Date(a));

  const today = getToday();
  const yesterday = getYesterday();

  const hasRecentTask = uniqueDates.includes(today) || uniqueDates.includes(yesterday);
  if (!hasRecentTask) return 0;

  let streak = 0;
  let currentDate = uniqueDates.includes(today) ? new Date() : new Date(getYesterday());

  for (const dateStr of uniqueDates) {
    const taskDate = getDateString(currentDate);
    
    if (dateStr === taskDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      const taskDateObj = new Date(dateStr);
      const daysDiff = Math.floor((currentDate - taskDateObj) / (1000 * 60 * 60 * 24));
      
      if (daysDiff > 0) {
        break;
      }
    }
  }

  return streak;
};

export const calculateLongestStreak = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;

  const uniqueDates = [...new Set(tasks
    .filter(task => task.completed)
    .map(task => {
      const dateSource = task.completedAt;
      return dateSource ? getDateString(new Date(dateSource)) : null;
    })
    .filter(date => date !== null)
  )];
  uniqueDates.sort((a, b) => new Date(a) - new Date(b));

  if (uniqueDates.length === 0) return 0;

  let longestStreak = 0;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);
    
    const daysDiff = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      currentStreak++;
    } else {
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 1;
    }
  }

  return Math.max(longestStreak, currentStreak);
};

export const calculateTotalDays = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  
  const uniqueDates = new Set(tasks
    .filter(task => task.completed)
    .map(task => {
      const dateSource = task.completedAt;
      return dateSource ? getDateString(new Date(dateSource)) : null;
    })
    .filter(date => date !== null)
  );
  return uniqueDates.size;
};

export const calculateProgress = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;

  return Math.round((completedTasks / totalTasks) * 100);
};

export const updateJourneyStats = (tasks) => {
  const currentStreak = calculateCurrentStreak(tasks);
  const longestStreak = calculateLongestStreak(tasks);
  const totalDays = calculateTotalDays(tasks);
  const progress = calculateProgress(tasks);
  const completedTopics = tasks.filter(task => task.completed).length;
  const totalTopics = tasks.length;

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalDays,
    progress,
    completedTopics,
    totalTopics
  };
};
