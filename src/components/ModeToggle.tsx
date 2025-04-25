import { LucideMoon, LucideSun } from 'lucide-react';

const ModeToggle = ({
    theme = 'dark',
}: {
    theme?: 'light' | 'dark' | 'system';
    setTheme?: (theme: 'light' | 'dark' | 'system') => void;
}) => {
    return (
        <div className="flex items-center m-10">
            <button className="p-2 rounded-md bg-gray-200 dark:bg-gray-800">
                {theme === 'light' && <LucideSun className="h-5 w-5 text-gray-800 dark:text-gray-200" />}
                {theme === 'dark' && <LucideMoon className="h-5 w-5 text-gray-800 dark:text-gray-200" />}
            </button>
        </div>
    );
};

export default ModeToggle;
