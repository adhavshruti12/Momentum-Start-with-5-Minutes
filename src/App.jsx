import { useState, useEffect } from 'react';
import Timer from './components/Timer';
import TaskSuggestion from './components/TaskSuggestion';
import ProgressDashboard from './components/ProgressDashboard';
import { motion } from 'framer-motion';
import { saveToStorage, loadFromStorage } from './utils/storage';

function App() {
  const [username, setUsername] = useState(() => loadFromStorage('username', ''));
  const [showNamePrompt, setShowNamePrompt] = useState(!loadFromStorage('username', ''));
  const [currentCategory, setCurrentCategory] = useState('work');
  const [currentTask, setCurrentTask] = useState('');
  const [completedTasks, setCompletedTasks] = useState(() => {
    const today = new Date().toDateString();
    const savedTasks = loadFromStorage('completedTasks', {});
    return savedTasks[today] || [];
  });
  const [streak, setStreak] = useState(() => loadFromStorage('streak', 0));
  const [level, setLevel] = useState(() => loadFromStorage('level', 1));
  const [experience, setExperience] = useState(() => loadFromStorage('experience', 0));
  const [taskHistory, setTaskHistory] = useState(() => loadFromStorage('taskHistory', {}));

  // Load previous days' tasks on mount
  useEffect(() => {
    const today = new Date().toDateString();
    const savedTasks = loadFromStorage('completedTasks', {});
    
    if (!savedTasks[today]) {
      savedTasks[today] = [];
      saveToStorage('completedTasks', savedTasks);
    }
    
    // Clean up tasks older than 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    Object.keys(savedTasks).forEach(date => {
      if (new Date(date) < oneWeekAgo) {
        delete savedTasks[date];
      }
    });
    
    saveToStorage('completedTasks', savedTasks);
  }, []);

  // Save state changes to localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const savedTasks = loadFromStorage('completedTasks', {});
    savedTasks[today] = completedTasks;
    
    saveToStorage('completedTasks', savedTasks);
    saveToStorage('streak', streak);
    saveToStorage('level', level);
    saveToStorage('experience', experience);
    saveToStorage('taskHistory', taskHistory);
  }, [completedTasks, streak, level, experience, taskHistory]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      saveToStorage('username', username);
      setShowNamePrompt(false);
    }
  };

  const handleTaskComplete = () => {
    if (currentTask) {
      const today = new Date().toDateString();
      const newTask = {
        name: currentTask,
        category: currentCategory,
        timestamp: new Date().toISOString(),
      };
      
      setCompletedTasks(prev => [...prev, newTask]);
      
      // Update task history for better suggestions
      setTaskHistory(prev => ({
        ...prev,
        [currentCategory]: [...(prev[currentCategory] || []), newTask.name]
      }));
      
      setCurrentTask('');
      
      // Update streak and experience
      setStreak(prev => prev + 1);
      const newExperience = experience + 20;
      if (newExperience >= level * 100) {
        setLevel(prev => prev + 1);
        setExperience(newExperience - (level * 100));
      } else {
        setExperience(newExperience);
      }
    }
  };

  const handleTaskSelect = (task, category) => {
    setCurrentTask(task);
    setCurrentCategory(category);
  };

  if (showNamePrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full"
        >
          <h2 className="text-2xl font-bold mb-4">Welcome to Momentum!</h2>
          <p className="text-gray-400 mb-6">Let's start by getting to know you.</p>
          <form onSubmit={handleNameSubmit}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 mb-4"
              required
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary rounded-lg hover:bg-secondary transition-colors"
            >
              Get Started
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Welcome back, {username}!</h1>
          <p className="text-gray-400">Start with 5 minutes</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Choose Your Task</h2>
              <div className="flex gap-2 mb-4">
                {['work', 'personal', 'fitness'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setCurrentCategory(category)}
                    className={`px-4 py-2 rounded-lg capitalize ${
                      currentCategory === category
                        ? 'bg-primary'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <TaskSuggestion
                category={currentCategory}
                onTaskSelect={handleTaskSelect}
                completedTasks={completedTasks}
              />
              {currentTask && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-4 bg-gray-700 rounded-lg"
                >
                  <h3 className="font-semibold">Current Task:</h3>
                  <p>{currentTask}</p>
                </motion.div>
              )}
            </div>
            <Timer onComplete={handleTaskComplete} />
          </div>
          
          <ProgressDashboard
            completedTasks={completedTasks}
            streak={streak}
            level={level}
            experience={experience}
          />
        </div>
      </div>
    </div>
  );
}

export default App;