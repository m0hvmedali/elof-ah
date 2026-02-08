import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Moon, Sun, Bell, BellOff, Volume2, VolumeX, ArrowLeft, Lock } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function SettingsPanel() {
  const navigate = useNavigate()
  const {
    darkMode, setDarkMode,
    notificationsEnabled, setNotificationsEnabled,
    soundEnabled, setSoundEnabled
  } = useStore()

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', newMode.toString())
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleNotifications = () => {
    const newValue = !notificationsEnabled
    setNotificationsEnabled(newValue)
    localStorage.setItem('notificationsEnabled', newValue.toString())
  }

  const toggleSound = () => {
    const newValue = !soundEnabled
    setSoundEnabled(newValue)
    localStorage.setItem('soundEnabled', newValue.toString())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition"
          >
            <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">الإعدادات</h1>
        </div>

        {/* Settings Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6">

          {/* Dark Mode */}
          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <div className="flex items-center gap-4">
              {darkMode ? <Moon size={24} className="text-purple-500" /> : <Sun size={24} className="text-yellow-500" />}
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">الوضع الليلي</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">تفعيل الثيم الداكن</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative w-14 h-7 rounded-full transition ${darkMode ? 'bg-purple-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <div className="flex items-center gap-4">
              {notificationsEnabled ? <Bell size={24} className="text-blue-500" /> : <BellOff size={24} className="text-gray-400" />}
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">الإشعارات</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">تلقي الإشعارات</p>
              </div>
            </div>
            <button
              onClick={toggleNotifications}
              className={`relative w-14 h-7 rounded-full transition ${notificationsEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${notificationsEnabled ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Sound */}
          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <div className="flex items-center gap-4">
              {soundEnabled ? <Volume2 size={24} className="text-green-500" /> : <VolumeX size={24} className="text-gray-400" />}
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">الصوت</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">تفعيل المؤثرات الصوتية</p>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`relative w-14 h-7 rounded-full transition ${soundEnabled ? 'bg-green-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${soundEnabled ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Admin Shortcut */}
          <div className="pt-6 mt-6 border-t border-gray-200 dark:border-white/10">
            <button
              onClick={() => navigate('/admin')}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
            >
              <Lock size={20} />
              <span className="font-semibold">لوحة المشرف</span>
            </button>
          </div>

          {/* Footer */}
          <div className="pt-6 mt-6 border-t border-gray-200 dark:border-white/10 text-center">
            <p className="text-xs text-gray-400">
              Made with ❤️ for You
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
