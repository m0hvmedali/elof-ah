import React, { Suspense, useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navigation from './components/common/Navigation'
import SettingsPanel from './pages/Settings'
import LoadingSpinner from './components/common/LoadingSpinner'
import MusicPlayer from './components/common/MusicPlayer'
import Footer from './components/Footer'
import AnalyticsFAB from './components/common/AnalyticsFAB'
import { useStore } from './store/useStore'
import { registerNotificationService } from './services/notificationService'
import { ThemeProvider } from './context/ThemeContext'

const MemoriesPage = React.lazy(() => import('./pages/Memories'))
const MessagesPage = React.lazy(() => import('./pages/Messages'))
const JanaPage = React.lazy(() => import('./pages/Jana'))
const GratitudePage = React.lazy(() => import('./pages/Gratitude'))
const PlaylistPage = React.lazy(() => import('./pages/Playlist'))
const MapPage = React.lazy(() => import('./pages/Map'))
const AnalyticsPage = React.lazy(() => import('./pages/Analytics'))
const AdminPage = React.lazy(() => import('./pages/Admin'))
const GamePage = React.lazy(() => import('./pages/Game'))
const MemoryRoomPage = React.lazy(() => import('./pages/MemoryRoom'))
import IntroOverlay from './components/common/IntroOverlay'

function App() {
  const { darkMode, setDarkMode, notificationsEnabled, setNotificationsEnabled } = useStore()
  const [showBlock, setShowBlock] = useState(false)
  const location = useLocation()
  const isMemoryRoom = location.pathname === '/room'

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
    <ThemeProvider>
      <div className="relative min-h-screen flex flex-col">
        <Suspense fallback={<LoadingSpinner />}>
          <IntroOverlay />
          <MusicPlayer />
        </Suspense>


        <main className="flex-1 relative pb-20">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<JanaPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/memories" element={<MemoriesPage />} />
              <Route path="/settings" element={<SettingsPanel />} />
              <Route path="/gratitude" element={<GratitudePage />} />
              <Route path="/playlist" element={<PlaylistPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/intro" element={<IntroOverlay />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/room" element={<MemoryRoomPage />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
        <Navigation />
        <AnalyticsFAB />
      </div>
    </ThemeProvider>
  )
}

export default App
