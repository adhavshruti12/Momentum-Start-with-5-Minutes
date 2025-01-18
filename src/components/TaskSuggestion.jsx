import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { breakdownTask, suggestNextTask } from '../utils/taskManager';

const TaskSuggestion = ({ category, onTaskSelect, completedTasks }) => {
  const [customTask, setCustomTask] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [taskBreakdown, setTaskBreakdown] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Get AI-suggested tasks based on time and previous completions
    const newSuggestions = suggestNextTask(completedTasks, category);
    setSuggestions(newSuggestions);
  }, [category, completedTasks]);

  const handleTaskSelect = (task) => {
    const breakdown = breakdownTask(task);
    if (breakdown) {
      setTaskBreakdown(breakdown);
    } else {
      onTaskSelect(task, category);
      setShowSuggestions(false);
      setTaskBreakdown(null);
    }
  };

  const handleBreakdownTaskSelect = (subtask) => {
    onTaskSelect(subtask, category);
    setTaskBreakdown(null);
    setShowSuggestions(false);
  };

  const handleCustomTaskSubmit = (e) => {
    e.preventDefault();
    if (customTask.trim()) {
      handleTaskSelect(customTask);
      setCustomTask('');
    }
  };

  return (
    <div className="relative mb-4">
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          value={customTask}
          onChange={(e) => setCustomTask(e.target.value)}
          placeholder={`Add a ${category} task...`}
          className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          onFocus={() => setShowSuggestions(true)}
        />
        <button
          onClick={handleCustomTaskSubmit}
          className="px-4 py-2 bg-primary rounded-lg hover:bg-secondary transition-colors"
        >
          Add
        </button>
      </div>
      
      {showSuggestions && !taskBreakdown && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 w-full bg-gray-800 rounded-lg shadow-lg mt-1"
        >
          {suggestions.map((task, index) => (
            <button
              key={index}
              onClick={() => handleTaskSelect(task)}
              className="w-full text-left px-4 py-2 hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
            >
              {task}
            </button>
          ))}
        </motion.div>
      )}

      {taskBreakdown && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 w-full bg-gray-800 rounded-lg shadow-lg mt-1"
        >
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400">Task Breakdown</h3>
          </div>
          {taskBreakdown.map((subtask, index) => (
            <button
              key={index}
              onClick={() => handleBreakdownTaskSelect(subtask)}
              className="w-full text-left px-4 py-2 hover:bg-gray-700"
            >
              {subtask}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default TaskSuggestion;