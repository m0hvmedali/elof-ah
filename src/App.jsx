import React, { Suspense, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/common/Navigation'
import SettingsPanel from './components/common/SettingsPanel'
import LoadingSpinner from './components/common/LoadingSpinner'
import { useStore } from './store/useStore'
import { registerNotificationService } from './services/notificationService'

const MemoriesPage = React.lazy(() => import('./pages/Memories'))
const GamePage = React.lazy(() => import('./pages/Game'))
const MapPage = React.lazy(() => import('./pages/Map'))
const JanaPage = React.lazy(() => import('./pages/Jana'))
const MemoryRoomPage = React.lazy(() => import('./pages/MemoryRoom'))
const GratitudePage = React.lazy(() => import('./pages/Gratitude'))
const DreamsPage = React.lazy(() => import('./pages/Dreams'))
const HomePage = React.lazy(() => import('./pages/Home'))
const Chat = React.lazy(() => import('./components/memories/ChatSimulator'))

function App() {
  const { darkMode, setDarkMode, notificationsEnabled, setNotificationsEnabled } = useStore()
  const [showBlock, setShowBlock] = useState(true)

  useEffect(() => {
    document.title = "Memories Site ❤️"
  }, [])

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode')
    const savedNotifications = localStorage.getItem('notificationsEnabled')

    const darkModeEnabled = savedDarkMode ? savedDarkMode === 'true' : true
    const notificationsEnabledValue = savedNotifications ? savedNotifications === 'true' : false

    setDarkMode(darkModeEnabled)
    setNotificationsEnabled(notificationsEnabledValue)

    if (darkModeEnabled) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')

    if (notificationsEnabledValue) registerNotificationService()
  }, [setDarkMode, setNotificationsEnabled])

  return (
    <div className="overflow-x-hidden relative min-h-screen">

      {showBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 text-white p-6 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">ايه اللي دخلك؟</h1>
            <p className="text-lg leading-relaxed mb-6">
              جنى… انتي مبقتيش تستحقي اللي اتعمل عشانك، ولا الويب سايت اللي كان معمول ليكي.
              الوقت بيكشف، وانتي كنتِ مجرد انعكاس مؤقت… مش حقيقة. مهما كنت بحبك، نتيجتك كانت ذكرى وحشة.
            </p>
            <button
              onClick={() => setShowBlock(false)}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white text-lg font-semibold transition-all"
            >
              متابعة
            </button>
          </div>
        </div>
      )}

      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/memories" element={<MemoriesPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/" element={<JanaPage />} />
          <Route path="/room" element={<MemoryRoomPage />} />
          <Route path="/gratitude" element={<GratitudePage />} />
          <Route path="/dreams" element={<DreamsPage />} />
          <Route path="/settings" element={<SettingsPanel />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Suspense>

      <Navigation />
    </div>
  )
}

export default App
