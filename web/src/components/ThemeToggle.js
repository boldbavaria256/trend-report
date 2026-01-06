'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // Avoid hydration mismatch by waiting for mount
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-full bg-muted/50 animate-pulse" />
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-accent/20 group overflow-hidden"
            aria-label="Toggle theme"
        >
            <div className="relative w-5 h-5">
                <Sun
                    className={`absolute inset-0 transform transition-all duration-500 scale-100 rotate-0 dark:scale-0 dark:-rotate-90 text-yellow-500`}
                />
                <Moon
                    className={`absolute inset-0 transform transition-all duration-500 scale-0 rotate-90 dark:scale-100 dark:rotate-0 text-blue-400`}
                />
            </div>
        </button>
    );
}
