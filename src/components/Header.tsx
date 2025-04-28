import F1SPlogo from 'assets/f1sp.png';
import F1SPlogoHorizontal from 'assets/f1sp-logo_horizontal.png';

import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const MenuButton = ({ label, onClick, className }: { label: string; onClick: () => void; className?: string }) => (
    <Button
        variant="ghost"
        className={cn(
            'dark:text-red-500 text-red-900 hover:underline hidden md:flex lg:flex xl:flex cursor-pointer font-bold',
            className,
        )}
        onClick={onClick}
    >
        {label}
    </Button>
);

const Header: React.FC = () => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <header className="flex gap-6 items-end justify-between bg-stone-200 border-b border-b-stone-800 dark:border-b-stone-200 dark:bg-stone-800 p-4 shadow-md">
            <div>
                <div className="flex md:hidden lg:hidden xl:hidden justify-end">
                    <img src={F1SPlogoHorizontal} alt="F1//SP Logo" className="h-8" />
                </div>

                <div className="hidden md:flex lg:flex xl:flex justify-start cursor-pointer">
                    <a title="F1 // SP home" onClick={() => handleNavigation('/')} className="flex items-center">
                        <img src={F1SPlogo} alt="F1//SP Logo" className="h-28" />
                    </a>
                </div>
            </div>

            <div className="flex flex-grow items-end gap-2">
                <MenuButton
                    label="Vote"
                    onClick={() => handleNavigation('/vote')}
                    className="border dark:border-red-700 border-red-900"
                />
                <MenuButton label="Leaderboard" onClick={() => handleNavigation('/leaderboard')} />

                <MenuButton label="Standings" onClick={() => handleNavigation('/standings')} />

                <MenuButton label="Drivers" onClick={() => handleNavigation('/drivers')} />
                <MenuButton label="Races" onClick={() => handleNavigation('/races')} />

                <MenuButton label="Circuits" onClick={() => handleNavigation('/circuits')} />

                <MenuButton label="Constructors" onClick={() => handleNavigation('/constructors')} />
                <MenuButton label="Schedule" onClick={() => handleNavigation('/results')} />
            </div>
        </header>
    );
};

export default Header;
