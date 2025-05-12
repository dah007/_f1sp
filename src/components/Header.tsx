import F1SPlogo from 'assets/f1sp.svg';
import F1SPlogoHorizontal from 'assets/f1sp-logo_horizontal.svg';

import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from './ui/navigation-menu';

const MenuButton = ({ label, onClick, className }: { label: string; onClick: () => void; className?: string }) => (
    <Button
        rel="noopener noreferrer"
        variant="ghost"
        className={cn('dark:text-zinc-300 text-zinc-800 hover:underline cursor-pointer font-bold', className)}
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
    const handleNavigation = (path: string, makeActive?: string) => {
        navigate(path);

        // clear out all menu item underlines
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach((item) => {
            item.classList.remove('underline');
        });

        if (makeActive) {
            // add underline to the active menu item
            const activeItem = document.querySelector(`.${makeActive}`);
            if (activeItem) {
                activeItem.classList.add('underline');
            }
        }
    };

    const handleNavigationMobile = (path: string) => {
        navigate(path);
        toggleMenu();
    };

    const menuItemClassName =
        'menu-item font-extrabold text-zinc-800 dark:text-zinc-300 cursor-pointer text-md hover:underline';

    return (
        <header
            className="
            flex 
            gap-6 
            items-end 
            w-full
            p-4 
            pb-0 mb-0
bg-zinc-800 
            shadow-md"
        >
            {/* HAMBURGER MENU */}
            <div className="flex lg:hidden xl:hidden justify-end grow">
                <button
                    className="text-white text-4xl font-bold opacity-70 hover:opacity-100 duration-300"
                    onClick={toggleMenu}
                >
                    &#9776;
                </button>
            </div>

            {/* LOGOS */}
            <div className="flex lg:hidden xl:hidden justify-start grow">
                <a title="F1//SP home" onClick={() => handleNavigation('/')}>
                    <img src={F1SPlogoHorizontal} alt="F1//SP Logo" className="w-36" />
                </a>
            </div>
            <div className="hidden md:hidden lg:flex xl:flex justify-start cursor-pointer">
                <a title="F1//SP home" onClick={() => handleNavigation('/')}>
                    <img src={F1SPlogo} alt="F1//SP Logo" className="w-24" />
                </a>
            </div>

            <NavigationMenu className="hidden md:hidden lg:flex xl:flex justify-end grow w-[80vw]">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-red-800 font-extrabold cursor-pointer text-md">
                            Vote
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="bg-zinc-300 dark:bg-zinc-800">
                            <NavigationMenuLink className={menuItemClassName} onClick={() => handleNavigation('/vote')}>
                                Vote
                            </NavigationMenuLink>
                            <NavigationMenuLink
                                className={menuItemClassName}
                                onClick={() => handleNavigation('/leaderboard')}
                            >
                                Leaderboard
                            </NavigationMenuLink>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuLink
                        className={`standings ${menuItemClassName}`}
                        onClick={() => handleNavigation('/standings', 'standings')}
                    >
                        Standings
                    </NavigationMenuLink>
                    <NavigationMenuLink
                        className={`drivers ${menuItemClassName}`}
                        onClick={() => handleNavigation('/drivers', 'drivers')}
                    >
                        Drivers
                    </NavigationMenuLink>
                    <NavigationMenuLink
                        className={` ${menuItemClassName}`}
                        onClick={() => handleNavigation('/races', 'races')}
                    >
                        Races
                    </NavigationMenuLink>
                    <NavigationMenuLink
                        className={` ${menuItemClassName}`}
                        onClick={() => handleNavigation('/circuits', 'circuits')}
                    >
                        Circuits
                    </NavigationMenuLink>
                    <NavigationMenuLink
                        className={`constructors ${menuItemClassName}`}
                        onClick={() => handleNavigation('/constructors', 'constructors')}
                    >
                        Constructors
                    </NavigationMenuLink>
                    <NavigationMenuLink
                        className={`extras ${menuItemClassName}`}
                        onClick={() => handleNavigation('/extra', 'extras')}
                    >
                        Extras
                    </NavigationMenuLink>
                </NavigationMenuList>
            </NavigationMenu>

            <ul id="menu" className="hidden fixed top-0 right-0 px-10 py-16 bg-zinc-900 z-50">
                <li className="md:hidden z-90 fixed top-4 right-6">
                    <a href="javascript:void(0)" className="text-right text-white text-4xl" onClick={toggleMenu}>
                        &times;
                    </a>
                </li>
                <li>
                    <MenuButton
                        label="Vote"
                        onClick={() => handleNavigationMobile('/vote')}
                        className="border dark:border-red-700 border-red-900"
                    />
                </li>
                <li>
                    <MenuButton label="Leaderboard" onClick={() => handleNavigationMobile('/leaderboard')} />
                </li>
                <li>
                    <MenuButton label="Standings" onClick={() => handleNavigationMobile('/standings')} />
                </li>
                <li>
                    <MenuButton label="Drivers" onClick={() => handleNavigationMobile('/drivers')} />
                </li>
                <li>
                    <MenuButton label="Races" onClick={() => handleNavigationMobile('/races')} />
                </li>
                <li>
                    <MenuButton label="Circuits" onClick={() => handleNavigationMobile('/circuits')} />
                </li>
                <li>
                    <MenuButton label="Constructors" onClick={() => handleNavigationMobile('/constructors')} />
                </li>
                <li>
                    <MenuButton label="Extra" onClick={() => handleNavigationMobile('/extra')} />
                </li>
            </ul>
        </header>
    );
};

export default Header;
