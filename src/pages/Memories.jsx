import React, { useEffect } from 'react'
import PhotoGallery from '../components/memories/PhotoGallery'
import ChatSimulator from '../components/memories/ChatSimulator'
import TimelineSlider from '../components/memories/TimelineSlider'
import { motion } from 'framer-motion'
import { Bell, Settings, Moon, Sun } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useStore } from '../store/useStore'
import ScrollButtons from '../components/scroltop-bot'
export default function MemoriesPage() {


  const {
    darkMode,
    setDarkMode }
    = useStore()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-24 min-h-screen bg-white dark:bg-black"
    >
      {/* 🔹 الهيدر */}
      <header className="fixed top-0 left-0 z-50 w-full border-b border-gray-200 backdrop-blur-md bg-white/80 dark:bg-black/90 dark:border-gray-700">
        <div className="container flex justify-between items-center px-4 py-3 mx-auto">
          {/* العنوان */}
          <motion.h1
            className="text-2xl font-bold text-rose-700 dark:text-pink-300"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            بطتي 💗
          </motion.h1>

          {/* الأيقونات */}
          <div className="flex gap-4 items-center text-gray-700 dark:text-gray-300">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-full transition hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={darkMode ? "التحويل إلى الوضع الفاتح" : "التحويل إلى الوضع الداكن"}
            >
              {darkMode ? <Moon size={24} /> : <Sun size={24} />}
            </button>
            <button className="p-2 rounded-full transition hover:bg-gray-100 dark:hover:bg-gray-800">
              <NavLink to="/settings">
                <Settings size={22} />
              </NavLink>
            </button>
          </div>
        </div>
      </header>

      {/* 🔹 المحتوى */}
      <div className="container px-4 pt-24 mx-auto">
        {/* التايم لاين */}
        <TimelineSlider />
        <motion.div
          className="love-card"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >

          <ChatSimulator />
        </motion.div>
        {/* الشبكة */}
        <div className="grid grid-cols-1 gap-8 mt-12 lg:grid-cols-2">
          {/* الصور */}
          <motion.div
            className="love-card"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="p-4 text-xl font-bold bg-rose-100 rounded-lg rtext-rose-700 dark:bg-gray-900 dark:text-pink-300">
              Gallery
            </h2>
            <PhotoGallery />
          </motion.div>

          {/* المحادثات */}

        </div>
      </div>
    </motion.div>
  )
}
