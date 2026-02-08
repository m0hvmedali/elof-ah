import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Heart, MessageCircle, Music, Map,
  Star, Settings, TrendingUp, Menu, X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

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

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/messages', icon: Heart, label: 'Messages' },
    { path: '/memories', icon: MessageCircle, label: 'Memories' },
    { path: '/playlist', icon: Music, label: 'Playlist' },
    { path: '/map', icon: Map, label: 'Map' },
    { path: '/gratitude', icon: Star, label: 'Gratitude' },
    { path: '/analytics', icon: TrendingUp, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

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
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link key={item.path} to={item.path}>
                    <motion.div
                      className="relative px-4 py-2 rounded-full transition-all cursor-pointer"
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
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Hamburger Button */}
        <motion.button
          className="fixed top-4 right-4 z-50 p-3 backdrop-blur-xl rounded-full"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.primary}66, ${currentTheme.secondary}66)`,
            border: `2px solid ${currentTheme.accent}`,
            boxShadow: `0 4px 20px ${currentTheme.accent}44`
          }}
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? <X size={24} color="#fff" /> : <Menu size={24} color="#fff" />}
        </motion.button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-0 z-40 backdrop-blur-2xl"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.primary}ee, ${currentTheme.secondary}ee)`
              }}
            >
              <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
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
