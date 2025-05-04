import { LucideMoon, LucideSun } from 'lucide-react';
import { useTheme } from './ui/theme-provider';
import { useState, useEffect, useCallback } from 'react';

/**
 * ModeToggle component for switching between light/dark themes
 * Optimized for Azure Static Web Apps with client-side theme persistence
 */
const ModeToggle = () => {
    const { setTheme } = useTheme();
    const [currentTheme, setCurrentTheme] = useState<'dark' | 'light' | 'system'>('dark');

    // Get initial theme from localStorage with error handling
    useEffect(() => {
        try {
            const savedTheme = localStorage.getItem('f1sp-theme') as 'dark' | 'light' | 'system';
            if (savedTheme) {
                setCurrentTheme(savedTheme);
                setTheme(savedTheme);
            }
        } catch (error) {
            console.error('Error accessing localStorage:', error);
            // Fallback to dark theme if localStorage is unavailable
            setCurrentTheme('dark');
        }
    }, [setTheme]);

    // Handler for toggling theme
    const modeToggleClickHandler = useCallback(() => {
        try {
            if (currentTheme === 'system') {
                setTheme('dark');
                setCurrentTheme('dark');
                localStorage.setItem('f1sp-theme', 'dark');
            } else {
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                localStorage.setItem('f1sp-theme', newTheme);
                setTheme(newTheme);
                setCurrentTheme(newTheme);
            }
        } catch (error) {
            console.error('Error updating theme in localStorage:', error);
            // Still toggle the theme even if localStorage fails
            if (currentTheme === 'system') {
                setTheme('dark');
                setCurrentTheme('dark');
            } else {
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                setTheme(newTheme);
                setCurrentTheme(newTheme);
            }
        }
    }, [currentTheme, setTheme]);

    return (
        <button
            className="p-2 rounded-md text-zinc-800 dark:text-zinc-300 cursor-pointer"
            onClick={modeToggleClickHandler}
            type="button"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
        >
            {currentTheme === 'light' && <LucideSun className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />}
            {currentTheme === 'dark' && <LucideMoon className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />}
        </button>
    );
};

export default ModeToggle;

// Export the component only, not the internal handler
