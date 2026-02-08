import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Dynamic theme palettes
const themes = [
    {
        name: 'sunset',
        primary: '#ff6b6b',
        secondary: '#feca57',
        accent: '#ee5a6f',
        bg: 'from-red-900 via-orange-800 to-yellow-900'
    },
    {
        name: 'ocean',
        primary: '#48dbfb',
        secondary: '#0abde3',
        accent: '#00d2d3',
        bg: 'from-blue-900 via-cyan-800 to-teal-900'
    },
    {
        name: 'forest',
        primary: '#10ac84',
        secondary: '#1dd1a1',
        accent: '#00d2d3',
        bg: 'from-green-900 via-emerald-800 to-teal-900'
    },
    {
        name: 'purple-dream',
        primary: '#a29bfe',
        secondary: '#6c5ce7',
        accent: '#fd79a8',
        bg: 'from-purple-900 via-pink-800 to-red-900'
    },
    {
        name: 'midnight',
        primary: '#4834d4',
        secondary: '#686de0',
        accent: '#30336b',
        bg: 'from-indigo-900 via-purple-900 to-pink-900'
    }
];

export function ThemeProvider({ children }) {
    const [currentThemeIndex, setCurrentThemeIndex] = useState(3); // Start with purple-dream
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Auto-change theme every 90 seconds (1.5 minutes)
    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentThemeIndex((prev) => (prev + 1) % themes.length);
                setIsTransitioning(false);
            }, 1000); // 1sec transition
        }, 90000); // 90 seconds

        return () => clearInterval(interval);
    }, []);

    const currentTheme = themes[currentThemeIndex];

    const switchTheme = (themeName) => {
        const index = themes.findIndex(t => t.name === themeName);
        if (index !== -1) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentThemeIndex(index);
                setIsTransitioning(false);
            }, 500);
        }
    };

    return (
        <ThemeContext.Provider value={{
            currentTheme,
            switchTheme,
            isTransitioning,
            allThemes: themes
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
