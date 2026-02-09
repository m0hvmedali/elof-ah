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
const PhotozPage = React.lazy(() => import('./pages/Photoz'))
const RelationshipAIPage = React.lazy(() => import('./pages/RelationshipAI'))
import IntroOverlay from './components/common/IntroOverlay'
import SiteLock from './components/common/SiteLock'

function App() {
  const { darkMode, setDarkMode, notificationsEnabled, setNotificationsEnabled } = useStore()
  const [showBlock, setShowBlock] = useState(false)
  const location = useLocation()
  const isMemoryRoom = location.pathname === '/room'

  useEffect(() => {
    document.title = "Memories Site ❤️"

    // GLOBAL ERROR MONITORING & SUPPRESSION
    const handleError = (e) => {
      const msg = (e.message || e.reason?.message || "").toLowerCase();

      // Specifically target Mixpanel and checkVersion errors that break the app flow
      if (
        msg.includes('mixpanel') ||
        msg.includes('checkversion') ||
        msg.includes('blocked_by_client') ||
        (e.reason && e.reason.toString().includes('checkVersion'))
      ) {
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
        return false;
      }

      console.error("Caught Global Error:", e);
    };

    // FILTER CONSOLE NOISE
    const filterNoise = (originalFn) => (...args) => {
      const errorStr = args.map(arg => {
        try {
          if (typeof arg === 'string') return arg;
          if (arg instanceof Error) return arg.message;
          if (arg instanceof Event) return arg.type;
          return JSON.stringify(arg);
        } catch (e) {
          return String(arg);
        }
      }).join(' ').toLowerCase();

      if (
        errorStr.includes('mixpanel') ||
        errorStr.includes('blocked_by_client') ||
        errorStr.includes('checkversion') ||
        errorStr.includes('quota exceeded') ||
        errorStr.includes('limit: 0') ||
        errorStr.includes('generativelanguage') ||
        errorStr.includes('pollinations') ||
        errorStr.includes('api-js') ||
        errorStr.includes('net::err_blocked_by_client') ||
        errorStr.includes('failed to load resource') ||
        errorStr.includes('406 (not acceptable)')
      ) {
        return;
      }
      originalFn.apply(console, args);
    };

    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleLog = console.log;

    console.error = filterNoise(console.error);
    console.warn = filterNoise(console.warn);
    console.log = filterNoise(console.log);

    window.addEventListener('error', handleError, true);
    window.addEventListener('unhandledrejection', handleError, true);

    return () => {
      window.removeEventListener('error', handleError, true);
      window.removeEventListener('unhandledrejection', handleError, true);
      console.error = originalConsoleError;
    };
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
        <SiteLock>
          <Suspense fallback={<LoadingSpinner />}>
            <IntroOverlay />
            <MusicPlayer />
          </Suspense>


          <main className="flex-1 relative pt-16 md:pt-0 pb-20">
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
                <Route path="/photoz" element={<PhotozPage />} />
                <Route path="/ai-chat" element={<RelationshipAIPage />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />
          <Navigation />
          <AnalyticsFAB />
        </SiteLock>
      </div>
    </ThemeProvider>
  )
}

export default App
