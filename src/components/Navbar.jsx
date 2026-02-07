// src/components/Navigation.jsx
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Map, Star, Music, Gem, BookHeart, GalleryThumbnails } from 'lucide-react';

const navItems = [
  { id: 'memories', icon: <GalleryThumbnails />, label: 'ذكريات' },
  { id: 'game', icon: <Star />, label: 'لعبة' },
  { id: 'map', icon: <Map />, label: 'خريطة' },
  { id: 'jana', icon: <Gem />, label: 'جانا' },
  { id: 'room', icon: <Heart />, label: 'الغرفة' },
  { id: 'gratitude', icon: <BookHeart />, label: 'امتنان' },
  { id: 'dreams', icon: <MessageSquare />, label: 'أحلام' },
];

export default function Navbar() {
  return (
    <motion.div
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full shadow-xl px-4 py-2 flex"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 25 }}
    >
      <div className="flex space-x-1">
        {navItems.map((item) => (
          <motion.a
            key={item.id}
            href={`#${item.id}`}
            className="flex flex-col items-center p-3 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-rose-500 dark:text-rose-400">{item.icon}</span>
            <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">{item.label}</span>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}