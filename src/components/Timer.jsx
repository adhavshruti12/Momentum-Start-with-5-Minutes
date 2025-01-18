import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaRedo } from 'react-icons/fa';
import Confetti from 'react-confetti';

const Timer = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setShowConfetti(true);
      onComplete?.();
      setTimeout(() => setShowConfetti(false), 3000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(300);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const progress = ((300 - timeLeft) / 300) * 100;

  return (
    <div className="relative">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      <div className="flex flex-col items-center space-y-8">
        <motion.div 
          className="w-64 h-64 relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className="stroke-gray-200"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="45%"
              className="stroke-primary"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.827} 282.7`}
              animate={{
                strokeDasharray: `${progress * 2.827} 282.7`,
              }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="text-4xl font-bold">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </motion.div>

        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTimer}
            className="bg-primary text-white p-4 rounded-full"
          >
            {isRunning ? <FaPause /> : <FaPlay />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={resetTimer}
            className="bg-gray-600 text-white p-4 rounded-full"
          >
            <FaRedo />
          </motion.button>
        </div>

        {timeLeft === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-semibold text-green-500"
          >
            Great job! Keep the momentum going!
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Timer;