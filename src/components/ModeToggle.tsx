import { Button } from 'components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * A React component that provides a button to toggle between light and dark themes.
 *
 * This component uses local storage to save the user's theme preference and applies
 * the theme to the document's root element. It also updates the theme state accordingly.
 *
 * @component
 * @example
 * // Usage example:
 * <ModeToggle />
 *
 * @returns {JSX.Element} A button that toggles the theme between light and dark.
 */
const ModeToggle = () => {
    const [theme, setThemeState] = useState('light');

    const setTheme = (newTheme: string) => {
        localStorage.setItem('shadcn-ui-theme', newTheme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('shadcn-ui-theme') || 'light';
        setTheme(savedTheme);
        setThemeState(savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        setThemeState(newTheme);
    };

    return (
        <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};

export default ModeToggle;
