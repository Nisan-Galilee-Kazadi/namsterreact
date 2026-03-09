import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-xl glass-card border border-white/20 shadow-sm hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={theme}
                    initial={{ y: 20, opacity: 0, rotate: -45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -20, opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center"
                >
                    {theme === 'light' ? (
                        <Moon className="w-5 h-5 text-primary" />
                    ) : (
                        <Sun className="w-5 h-5 text-yellow-400" />
                    )}
                </motion.div>
            </AnimatePresence>
        </button>
    );
};

export default ThemeToggle;
