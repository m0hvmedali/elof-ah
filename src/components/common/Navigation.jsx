import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Heart, MessageCircle, Music, Map,
  Star, Settings, TrendingUp, Menu, X, Image as ImageIcon, Bot
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Logo from './Logo';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/messages', icon: Heart, label: 'Messages' },
  { path: '/ai-chat', icon: Bot, label: 'AI Chat' },
  { path: '/memories', icon: MessageCircle, label: 'Memories' },
  { path: '/playlist', icon: Music, label: 'Playlist' },
  { path: '/map', icon: Map, label: 'Map' },
  { path: '/gratitude', icon: Star, label: 'Gratitude' },
  { path: '/game', icon: Star, label: 'Game' },
  { path: '/photoz', icon: ImageIcon, label: 'Photoz' },
  { path: '/room', icon: Map, label: '3D Room' },
  { path: '/analytics', icon: TrendingUp, label: 'Analytics' },
  { path: '/settings', icon: Settings, label: 'Settings' }
];

export default function Navigation() {
  const location = useLocation();
  const { currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        className="hidden md:block fixed top-0 left-0 right-0 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className={`mx-auto transition-all duration-500 ${scrolled ? 'mt-4 max-w-4xl' : 'mt-8 max-w-5xl'
          }`}>
          <motion.div
            className="backdrop-blur-xl rounded-full px-6 py-3 shadow-2xl"
            style={{
              background: scrolled
                ? `linear-gradient(135deg, ${currentTheme.primary}44, ${currentTheme.secondary}44)`
                : `linear-gradient(135deg, ${currentTheme.primary}22, ${currentTheme.secondary}22)`,
              border: `2px solid ${currentTheme.accent}66`,
              boxShadow: `0 8px 32px ${currentTheme.accent}33`
            }}
            animate={{
              scale: scrolled ? 0.95 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between gap-2">
              <Link to="/" className="flex items-center gap-3 group">
                <Logo className="w-10 h-10" />
                {!scrolled && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600"
                  >
                    Ducky Memories
                  </motion.span>
                )}
              </Link>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <Link key={item.path} to={item.path} className="flex-shrink-0">
                      <motion.div
                        className="relative px-4 py-2 rounded-full transition-all cursor-pointer overflow-hidden"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          background: active
                            ? `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`
                            : 'transparent',
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Icon
                            size={20}
                            color={active ? '#fff' : currentTheme.primary}
                            strokeWidth={active ? 2.5 : 2}
                          />
                          {active && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: 'auto' }}
                              exit={{ opacity: 0, width: 0 }}
                              className="text-white font-bold text-sm whitespace-nowrap overflow-hidden"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </div>

                        {active && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute inset-0 rounded-full"
                            style={{
                              boxShadow: `0 0 20px ${currentTheme.accent}`,
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile Header & Navigation */}
      <div className="md:hidden">
        {/* Mobile Header with Logo */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-16 z-40 px-4 flex items-center justify-between backdrop-blur-xl border-b"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.primary}44, ${currentTheme.secondary}44)`,
            borderBottomColor: `${currentTheme.accent}44`
          }}
        >
          <Link to="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              Ducky
            </span>
          </Link>

          <button
            className="p-2 rounded-full"
            style={{ background: `${currentTheme.primary}22` }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} color={currentTheme.primary} /> : <Menu size={24} color={currentTheme.primary} />}
          </button>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: '-100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-100%' }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="fixed inset-0 z-40 backdrop-blur-2xl"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.primary}f2, ${currentTheme.secondary}f2)`
              }}
            >
              <div className="flex flex-col items-center justify-start h-full pt-24 overflow-y-auto pb-12 gap-4 px-8">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                      >
                        <motion.div
                          className="flex items-center gap-4 px-8 py-4 rounded-full"
                          style={{
                            background: active ? '#ffffff22' : 'transparent',
                            border: active ? `2px solid ${currentTheme.accent}` : '2px solid transparent'
                          }}
                          whileHover={{ scale: 1.05, x: 10 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon size={28} color="#fff" strokeWidth={active ? 2.5 : 2} />
                          <span className="text-white text-xl font-bold">{item.label}</span>
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
