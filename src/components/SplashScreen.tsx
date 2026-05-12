import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const shapeVariants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 180, 360],
    opacity: [0.3, 0.7, 0.3],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Animated Shapes */}
      <motion.svg
        className="absolute top-20 left-20 w-16 h-16"
        viewBox="0 0 100 100"
        variants={shapeVariants}
        animate="animate"
      >
        <circle cx="50" cy="50" r="40" fill="white" opacity="0.3" />
      </motion.svg>

      <motion.svg
        className="absolute top-32 right-32 w-12 h-12"
        viewBox="0 0 100 100"
        variants={shapeVariants}
        animate="animate"
        style={{ animationDelay: '1s' }}
      >
        <rect x="10" y="10" width="80" height="80" fill="white" opacity="0.3" />
      </motion.svg>

      <motion.svg
        className="absolute bottom-40 left-40 w-20 h-20"
        viewBox="0 0 100 100"
        variants={shapeVariants}
        animate="animate"
        style={{ animationDelay: '2s' }}
      >
        <polygon points="50,10 90,90 10,90" fill="white" opacity="0.3" />
      </motion.svg>

      <motion.svg
        className="absolute bottom-20 right-20 w-14 h-14"
        viewBox="0 0 100 100"
        variants={shapeVariants}
        animate="animate"
        style={{ animationDelay: '0.5s' }}
      >
        <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="4" opacity="0.3" />
      </motion.svg>

      {/* Main Text */}
      <motion.div
        className="text-center z-10"
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-6"
          variants={itemVariants}
        >
          Welcome to Pebbly
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-gray-300"
          variants={itemVariants}
        >
          Your personal finance companion
        </motion.p>
      </motion.div>
    </div>
  );
}