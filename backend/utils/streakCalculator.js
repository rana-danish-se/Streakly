/**
 * Streak Calculator Utility
 * Calculates current streak, longest streak, and total unique days from tasks
 */

/**
 * Get date in YYYY-MM-DD format
 * @param {Date} date 
 * @returns {string}
 */
const getDateString = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Get yesterday's date in YYYY-MM-DD format
 * @returns {string}
 */
const getYesterday = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getDateString(yesterday);
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string}
 */
const getToday = () => {
  return getDateString(new Date());
};

/**
 * Calculate current streak from tasks
 * Counts consecutive days backwards from today
 * @param {Array} tasks - Array of task objects sorted by createdAt desc
 * @returns {number}
 */
export const calculateCurrentStreak = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;

  // Get unique dates from tasks
  const uniqueDates = [...new Set(tasks.map(task => getDateString(new Date(task.createdAt))))];
  uniqueDates.sort((a, b) => new Date(b) - new Date(a)); // Sort descending

  const today = getToday();
  const yesterday = getYesterday();

  // Check if there's a task today or yesterday
  const hasRecentTask = uniqueDates.includes(today) || uniqueDates.includes(yesterday);
  if (!hasRecentTask) return 0;

  // Start counting from the most recent task date
  let streak = 0;
  let currentDate = uniqueDates.includes(today) ? new Date() : new Date(getYesterday());

  for (const dateStr of uniqueDates) {
    const taskDate = getDateString(currentDate);
    
    if (dateStr === taskDate) {
      streak++;
      // Move to previous day
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // Check if we've reached a gap in dates
      const taskDateObj = new Date(dateStr);
      const daysDiff = Math.floor((currentDate - taskDateObj) / (1000 * 60 * 60 * 24));
      
      if (daysDiff > 0) {
        // There's a gap, streak is broken
        break;
      }
    }
  }

  return streak;
};

/**
 * Calculate longest streak from all tasks
 * @param {Array} tasks - Array of task objects
 * @returns {number}
 */
export const calculateLongestStreak = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;

  // Get unique dates and sort ascending
  const uniqueDates = [...new Set(tasks.map(task => getDateString(new Date(task.createdAt))))];
  uniqueDates.sort((a, b) => new Date(a) - new Date(b));

  let longestStreak = 0;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);
    
    // Calculate day difference
    const daysDiff = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      // Consecutive day
      currentStreak++;
    } else {
      // Gap found, reset streak
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 1;
    }
  }

  return Math.max(longestStreak, currentStreak);
};

/**
 * Calculate total unique days with tasks
 * @param {Array} tasks - Array of task objects
 * @returns {number}
 */
export const calculateTotalDays = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  
  const uniqueDates = new Set(tasks.map(task => getDateString(new Date(task.createdAt))));
  return uniqueDates.size;
};

/**
 * Update journey stats based on tasks
 * @param {Object} journey - Journey document
 * @param {Array} tasks - Array of task objects
 * @returns {Object} Updated stats
 */
export const updateJourneyStats = (tasks) => {
  const currentStreak = calculateCurrentStreak(tasks);
  const longestStreak = calculateLongestStreak(tasks);
  const totalDays = calculateTotalDays(tasks);

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalDays
  };
};
