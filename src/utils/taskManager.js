// Smart task management utilities
export const breakdownTask = (task) => {
  const taskPatterns = {
    'prepare for meeting': [
      'Review meeting agenda',
      'Gather relevant documents',
      'Write key talking points',
      'Set up presentation',
      'Check meeting tools'
    ],
    'write report': [
      'Create outline',
      'Write introduction',
      'Draft main sections',
      'Add conclusions',
      'Review and edit'
    ],
    'organize': [
      'Sort items by category',
      'Remove unnecessary items',
      'Create organization system',
      'Label items',
      'Put items in place'
    ],
    'clean': [
      'Clear surfaces',
      'Dust and wipe',
      'Organize items',
      'Vacuum/sweep',
      'Final touches'
    ]
  };

  // Check if task matches any patterns
  const matchingPattern = Object.keys(taskPatterns).find(pattern => 
    task.toLowerCase().includes(pattern)
  );

  return matchingPattern ? taskPatterns[matchingPattern] : null;
};

export const suggestNextTask = (completedTasks, category) => {
  const timeOfDay = new Date().getHours();
  const dayOfWeek = new Date().getDay();
  
  const suggestions = {
    work: {
      morning: [
        'Review today\'s priorities',
        'Check important emails',
        'Plan daily schedule',
        'Set up workspace'
      ],
      afternoon: [
        'Follow up on meetings',
        'Update task progress',
        'Clear inbox',
        'Review deadlines'
      ],
      evening: [
        'Plan tomorrow\'s tasks',
        'Organize files',
        'Send status updates',
        'Clean up workspace'
      ]
    },
    personal: {
      morning: [
        'Quick meditation',
        'Journal entry',
        'Read article',
        'Plan personal goals'
      ],
      afternoon: [
        'Take a break',
        'Declutter space',
        'Learn something new',
        'Personal correspondence'
      ],
      evening: [
        'Reflect on day',
        'Prepare for tomorrow',
        'Relaxation exercise',
        'Reading time'
      ]
    },
    fitness: {
      morning: [
        'Morning stretch',
        'Quick cardio',
        'Hydration check',
        'Plan workout'
      ],
      afternoon: [
        'Desk exercises',
        'Walk break',
        'Posture check',
        'Quick workout'
      ],
      evening: [
        'Evening yoga',
        'Light stretching',
        'Recovery exercises',
        'Mobility work'
      ]
    }
  };

  const getTimeOfDayCategory = (hour) => {
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const timeCategory = getTimeOfDayCategory(timeOfDay);
  const availableSuggestions = suggestions[category][timeCategory];
  
  // Filter out recently completed tasks
  const recentTasks = new Set(
    completedTasks
      .filter(task => task.category === category)
      .slice(-3)
      .map(task => task.name)
  );
  
  return availableSuggestions.filter(task => !recentTasks.has(task));
};