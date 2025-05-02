import F1SPlogo from 'assets/f1sp.png';
import F1SPlogoHorizontal from 'assets/f1sp-logo_horizontal.png';

import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import ModeToggle from './ModeToggle';

const MenuButton = ({ label, onClick, className }: { label: string; onClick: () => void; className?: string }) => (
    <Button
        variant="ghost"
        className={cn('dark:text-stone-300 text-stone-800 hover:underline cursor-pointer font-bold', className)}
        onClick={onClick}
    >
        {label}
    </Button>
);

const toggleMenu = () => {
    const menu = document.getElementById('menu');
    if (menu) {
        menu.classList.toggle('hidden');
        menu.classList.toggle('w-full');
        menu.classList.toggle('h-screen');
    }
};

/**
 * Header component for the F1//SP application.
 *
 * Renders a responsive navigation header with:
 * - Logo that navigates to home page
 * - Navigation menu with links to different sections
 * - Dark mode toggle
 * - Mobile-friendly menu with hamburger button for smaller screens
 *
 * The component adapts its layout based on screen size, showing different
 * versions of the logo and menu for mobile vs desktop views.
 *
 * @returns JSX.Element - The rendered Header component
 */
const Header: React.FC = () => {
    const navigate = useNavigate();

    /**
     * Navigates to the specified path and toggles the menu state.
     *
     * @param path - The target path to navigate to
     * @returns void
     */
    const handleNavigation = (path: string) => {
        navigate(path);
        toggleMenu();
    };

    return (
        <>
            <div className="absolute right-4 top-4 sm:hidden md:visible z-10">
                <ModeToggle />
            </div>
            <header
                className="
                flex 
                gap-6 
                items-center 
                content-end
                justify-start
                w-full
                bg-stone-300 
                border-b 
                border-b-stone-800 
                dark:border-b-stone-300 
                dark:bg-stone-800 
                p-4 

                shadow-md"
            >
                {/* <div className="container px-4 md:px-0 h-full mx-auto flex justify-start items-center"> */}
                {/* LOGOS */}
                <div className="flex lg:hidden xl:hidden justify-start grow">
                    <img src={F1SPlogoHorizontal} alt="F1//SP Logo" className="w-36" />
                </div>

                <div className="hidden md:hidden lg:flex xl:flex justify-start cursor-pointer">
                    <a title="F1//SP home" onClick={() => handleNavigation('/')}>
                        <img src={F1SPlogo} alt="F1//SP Logo" className="w-32" />
                    </a>
                </div>

                {/* MENU ITEMS> */}
                <ul
                    id="menu"
                    className="hidden fixed top-0 right-0 px-10 py-16 bg-stone-900 z-50 lg:relative lg:flex lg:p-0 lg:bg-transparent lg:flex-row lg:space-x-6"
                >
                    <li className="md:hidden z-90 fixed top-4 right-6">
                        <a href="javascript:void(0)" className="text-right text-white text-4xl" onClick={toggleMenu}>
                            &times;
                        </a>
                    </li>
                    <li>
                        <MenuButton
                            label="Vote"
                            onClick={() => handleNavigation('/vote')}
                            className="border dark:border-red-700 border-red-900"
                        />
                    </li>
                    <li>
                        <MenuButton label="Leaderboard" onClick={() => handleNavigation('/leaderboard')} />
                    </li>
                    <li>
                        <MenuButton label="Standings" onClick={() => handleNavigation('/standings')} />
                    </li>
                    <li>
                        <MenuButton label="Drivers" onClick={() => handleNavigation('/drivers')} />
                    </li>
                    <li>
                        <MenuButton label="Races" onClick={() => handleNavigation('/races')} />
                    </li>
                    <li>
                        <MenuButton label="Circuits" onClick={() => handleNavigation('/circuits')} />
                    </li>
                    <li>
                        <MenuButton label="Constructors" onClick={() => handleNavigation('/constructors')} />
                    </li>
                    <li className="hidden lg:visible">
                        <MenuButton label="Toggle dark mode" onClick={() => handleNavigation('/constructors')} />
                    </li>
                </ul>

                {/* <!-- This is used to open the menu on mobile devices --> */}
                <div className="flex items-end grow md:lg content-end justify-end lg:hidden">
                    <button
                        className="text-white text-4xl font-bold opacity-70 hover:opacity-100 duration-300"
                        onClick={toggleMenu}
                    >
                        &#9776;
                    </button>
                </div>
            </header>
        </>
    );
};

export default Header;
