// src/components/SettingsPanel.jsx
import { useState } from 'react';
import { Sun, Moon, Bell, BellOff, Lock, Unlock } from 'lucide-react';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-full shadow-xl p-3 flex flex-col items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? <Moon size={24} /> : <Sun size={24} />}
        </button>

        <button
          onClick={() => setNotifications(!notifications)}
          className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {notifications ? <Bell size={24} /> : <BellOff size={24} />}
        </button>

        <button
          onClick={() => setPrivacy(!privacy)}
          className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {privacy ? <Lock size={24} /> : <Unlock size={24} />}
        </button>
      </div>
      <footer class="w-full border-t border-neutral-800 bg-neutral-950 text-neutral-400">
        <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-4 sm:flex-row">

          <span class="text-sm">
            built quietly.
          </span>

          <div class="flex gap-5 text-sm">
            <a
              href="https://instagram.com/m0hvmed_ali"
              target="_blank"
              class="transition hover:text-white"
            >
              Instagram
            </a>

            <a
              href="mohamedalix546@gmail.com"
              class="transition hover:text-white"
            >
              Email
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
}