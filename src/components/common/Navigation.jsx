import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, Map, Star, Music, Gem, BookHeart, GalleryThumbnails, Menu, Home, MapPin, ImagePlay, Computer, TimerIcon } from 'lucide-react';

const navItems = [
  { id: 'home', path: '/', icon: <Home size={24} />, label: 'Home' },
  { id: 'memories', path: '/memories', icon: <GalleryThumbnails size={24} />, label: 'Memories' },
  { id: 'game', path: '/game', icon: <ImagePlay size={24} />, label: 'Game for u' },
  { id: 'map', path: '/map', icon: <MapPin size={24} />, label: 'Pin maps' },
  // { id: 'jana', path: '/jana', icon: <Gem size={24} />, label: 'جانا' },
  { id: 'room', path: '/room', icon: <Computer size={24} />, label: 'Room' },
  { id: 'gratitude', path: '/gratitude', icon: <BookHeart size={24} />, label: 'Gratitude' },
  { id: 'dreams', path: '/dreams', icon: <TimerIcon size={24} />, label: 'Dreams ' },
  // { id: 'playlist', path: '/playlist', icon: <Music size={24} />, label: 'Music' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* زر صغير لفتح الشريط */}
      <button
        className="fixed right-4 bottom-4 z-50 p-3 text-white bg-rose-500 rounded-full shadow-lg hover:bg-rose-600 dark:bg-pink-500 dark:hover:bg-pink-600"
        onClick={() => setIsOpen(true)}
        title="القائمة"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer عمودي */}
            <motion.nav
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="flex fixed top-0 right-0 bottom-0 z-50 flex-col justify-center items-center py-6 w-20 bg-white shadow-xl dark:bg-gray-800"
            >
              {navItems.map(item => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center mb-4 w-full cursor-pointer"
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex flex-col items-center text-sm transition-colors ${isActive
                        ? 'text-rose-500 dark:text-rose-400'
                        : 'text-gray-600 dark:text-gray-300'
                      } w-full`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span className="mt-1">{item.label}</span>
                  </NavLink>
                </motion.div>
              ))}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
