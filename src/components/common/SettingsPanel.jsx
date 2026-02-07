import React from 'react'
import { Sun, Moon, Bell, BellOff } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function SettingsPage() {
  const {
    darkMode,
    setDarkMode,
    notificationsEnabled,
    setNotificationsEnabled
  } = useStore()

  return (
    <div className="px-4 py-6 min-h-screen text-gray-800 bg-white dark:bg-black dark:text-gray-200">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">الإعدادات</h1>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full transition hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="تبديل الوضع"
            >
              {darkMode ? <Moon size={24} /> : <Sun size={24} />}
            </button>

            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className="p-2 rounded-full transition hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="الإشعارات"
            >
              {notificationsEnabled ? <Bell size={24} /> : <BellOff size={24} />}
            </button>
          </div>
        </header>

        {/* Dark Mode / Notifications Section */}
        <section className="p-4 mb-8 bg-gray-100 rounded-xl shadow dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold">الخيارات</h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span>الوضع الداكن</span>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-1 text-white bg-rose-500 rounded-full transition hover:bg-rose-600"
              >
                {darkMode ? 'مفعل' : 'غير مفعل'}
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span>الإشعارات</span>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className="px-4 py-1 text-white bg-rose-500 rounded-full transition hover:bg-rose-600"
              >
                {notificationsEnabled ? 'مفعل' : 'غير مفعل'}
              </button>
            </div>
          </div>
        </section>

        {/* Terms & Conditions */}
        <section className="p-4 bg-gray-100 rounded-xl shadow dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold">شروط وأحكام</h2>
          <div className="text-sm leading-relaxed">
            <p>
              ١. استخدام التطبيق يكون على مسئوليتك الشخصية. <br />
              ٢. نحتفظ بالحق في تعديل أي محتوى أو بيانات دون إشعار مسبق. <br />
              ٣. لا يجوز استخدام التطبيق لأغراض غير قانونية أو مضرة بالآخرين. <br />
              ٤. جميع الحقوق محفوظة للتطبيق.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
