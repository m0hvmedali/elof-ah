import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Heart } from 'lucide-react';

const LoadingSpinner = ({ message = "جاري التحميل..." }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <Loader2 className="text-rose-500 w-16 h-16" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 15, -15, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Heart className="text-rose-500 fill-current w-8 h-8" />
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-lg text-gray-700 dark:text-gray-300"
      >
        {message}
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;