import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const timelinePeriods = [
  { id: 'beginning', label: null, year: 'Aug' },
  { id: 'first-date', label: null, year: 'Sep' },
  { id: 'engagement', label: null, year: 'Oct' },
  { id: 'current', label: null, year: 'Nov' },
  { id: 'future', label: null, year: 'Dec' },
  { id: '1', label: null, year: 'Jan' },
  { id: '2', label: null, year: 'Feb' },
]

export default function TimelineSlider() {
  const [activePeriod, setActivePeriod] = useState('current')
  const [direction, setDirection] = useState(0)

  const handlePeriodChange = (id) => {
    const currentIndex = timelinePeriods.findIndex(p => p.id === activePeriod)
    const newIndex = timelinePeriods.findIndex(p => p.id === id)
    setDirection(newIndex > currentIndex ? 1 : -1)
    setActivePeriod(id)
  }

  const activePeriodData = timelinePeriods.find(p => p.id === activePeriod)

  return (
    <div className="overflow-hidden relative py-6 mb-8 w-full bg-gradient-to-r from-rose-50 to-pink-100 rounded-xl shadow-lg dark:from-purple-900 dark:to-pink-800">
      <div className="absolute inset-0 opacity-10 bg-heart-pattern dark:opacity-5"></div>

      {/* شريط التنقل */}
      <div className="flex justify-between items-center px-6 mb-4">
        <button
          onClick={() => {
            const currentIndex = timelinePeriods.findIndex(p => p.id === activePeriod)
            const prevIndex = (currentIndex - 1 + timelinePeriods.length) % timelinePeriods.length
            handlePeriodChange(timelinePeriods[prevIndex].id)
          }}
          className="p-2 bg-white rounded-full shadow-md transition dark:bg-gray-800 hover:bg-rose-50 dark:hover:bg-purple-900"
          aria-label="الفترة السابقة"
        >
          <ChevronLeft className="text-rose-600 dark:text-purple-300" />
        </button>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activePeriod}
            custom={direction}
            initial={{ opacity: 0, x: direction * 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -100 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-rose-700 dark:text-pink-300">
              {activePeriodData.label}
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-300">
              {activePeriodData.year}
            </p>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => {
            const currentIndex = timelinePeriods.findIndex(p => p.id === activePeriod)
            const nextIndex = (currentIndex + 1) % timelinePeriods.length
            handlePeriodChange(timelinePeriods[nextIndex].id)
          }}
          className="p-2 bg-white rounded-full shadow-md transition dark:bg-gray-800 hover:bg-rose-50 dark:hover:bg-purple-900"
          aria-label="الفترة التالية"
        >
          <ChevronRight className="text-rose-600 dark:text-purple-300" />
        </button>
      </div>

      {/* نقاط الخط الزمني */}
      <div className="flex relative justify-between px-4">
        <div className="absolute right-0 left-0 top-4 z-0 mx-16 h-1 bg-rose-200 dark:bg-purple-700"></div>

        {timelinePeriods.map((period) => (
          <div
            key={period.id}
            className="flex relative z-10 flex-col items-center cursor-pointer"
            onClick={() => handlePeriodChange(period.id)}
            aria-label={`الانتقال إلى فترة ${period.label}`}
          >
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${activePeriod === period.id
                  ? 'bg-rose-600 dark:bg-pink-500'
                  : 'bg-white dark:bg-gray-700'
                }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {activePeriod === period.id && (
                <motion.div
                  className="absolute inset-0 bg-rose-400 rounded-full dark:bg-pink-400"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>
            <span
              className={`mt-2 text-sm font-medium ${activePeriod === period.id
                  ? 'text-rose-700 dark:text-pink-300 font-bold'
                  : 'text-gray-500 dark:text-gray-400'
                }`}
            >
              {period.year}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}