import { motion } from 'framer-motion';
import { FaTrophy, FaStar, FaMedal } from 'react-icons/fa';

const ProgressDashboard = ({ completedTasks, streak, level, experience }) => {
  const categories = ['work', 'personal', 'fitness'];
  
  const getCategoryCount = (category) => {
    return completedTasks.filter(task => task.category === category).length;
  };

  const getProgressWidth = (category) => {
    const count = getCategoryCount(category);
    const maxTasks = 8; // Maximum tasks per category per day
    return `${(count / maxTasks) * 100}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-6 mt-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Today's Progress</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FaTrophy className="text-yellow-500" />
            <span>Level {level}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-500" />
            <span>{streak} Streak</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="capitalize">{category}</span>
              <span>{getCategoryCount(category)} tasks</span>
            </div>
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: getProgressWidth(category) }}
                className="h-full bg-primary rounded-full"
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="flex justify-between items-center">
          <span>Experience</span>
          <span>{experience} / {(level + 1) * 100} XP</span>
        </div>
        <div className="h-4 bg-gray-700 rounded-full overflow-hidden mt-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(experience / ((level + 1) * 100)) * 100}%` }}
            className="h-full bg-green-500 rounded-full"
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {completedTasks.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Completed Tasks</h3>
          <div className="space-y-2">
            {completedTasks.map((task, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-sm text-gray-300"
              >
                <FaMedal className="text-primary" />
                <span>{task.name}</span>
                <span className="text-gray-500">({task.category})</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProgressDashboard;