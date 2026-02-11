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
