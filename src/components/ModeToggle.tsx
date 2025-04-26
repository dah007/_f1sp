import { LucideMoon, LucideSun } from 'lucide-react';
import { useTheme } from './ui/theme-provider';

const ModeToggle = () => {
    const theme = (localStorage.getItem('f1sp-theme') as 'dark' | 'light' | 'system') || 'dark';

    const { setTheme } = useTheme();
    return (
        <button
            className="p-2 rounded-md bg-stone-200 dark:bg-stone-800 cursor-pointer"
            onClick={() => {
                if (theme === 'system') {
                    setTheme('dark');
                    localStorage.setItem('f1sp-theme', 'dark');
                } else {
                    localStorage.setItem('f1sp-theme', theme === 'light' ? 'dark' : 'light');
                    setTheme(theme === 'light' ? 'dark' : 'light');
                }
            }}
            type="button"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
        >
            {theme === 'light' && <LucideSun className="h-5 w-5 text-stone-800 dark:text-stone-200" />}
            {theme === 'dark' && <LucideMoon className="h-5 w-5 text-stone-800 dark:text-stone-200" />}
        </button>
    );
};

export default ModeToggle;
