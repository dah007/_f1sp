import { YEAR } from '@/constants/constants';
import { cn } from '@/lib/utils';
import { LucideCoffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { DesktopNavigation } from './DesktopNavigation';
import F1SPlogoHorizontal from '/assets/f1sp-logo_horizontal.svg';
import F1SPlogo from '/assets/f1sp.svg';

export const constructorMenuItems: { title: string; href: string; description: string }[] = [
    {
        title: 'Standings',
        href: `/standings`,
        description: "View the current season's standings.",
    },
    {
        title: 'All Constructors',
        href: `/constructors/${YEAR}`,
        description: "View the current season's constructors.",
    },
    {
        title: 'Constructor Records',
        href: '/constructor/records',
        description: 'View constructor records and statistics (coming soon).',
    },
    {
        title: 'Engine Manufacturers',
        href: '/extra/engine',
        description: 'View engine records and statistics',
    },
    {
        title: 'Tire Suppliers',
        href: '/extra/tyre',
        description: 'View tire records and statistics',
    },
    {
        title: 'Chassis Manufacturers',
        href: '/extra/chassis',
        description: 'View chassis records and statistics (coming soon).',
    },
];
export const driverMenuItems: { title: string; href: string; description: string }[] = [
    {
        title: 'Standings',
        href: `/standings`,
        description: "View the current season's standings.",
    },
    {
        title: 'Current Drivers',
        href: `/drivers`,
        description: "This is currently the same page as Previous Drivers 😟.View the current season's drivers. ",
    },
    {
        title: 'Previous Drivers',
        href: '/drivers',
        description: "View the previous season's drivers.",
    },
    {
        title: 'Driver Records',
        href: '/driver/records',
        description: 'View driver records and statistics (coming soon).',
    },
    {
        title: 'Most Points w/o a Win',
        href: '/extra?tab=points',
        description: 'Top 100 drivers with the most points without a win.',
    },
];
export const raceMenuItems: { title: string; href: string; description: string }[] = [
    {
        title: 'Next Race',
        href: `/race/1138`,
        description: 'View details about the next race.',
    },
    {
        title: 'Last Race',
        href: `/race/last`,
        description: 'View details about the last race.',
    },
    {
        title: 'Current Season',
        href: `/races`,
        description: "View the current season's races. New current season interface coming some.",
    },
    {
        title: 'Circuits',
        href: `/circuits`,
        description: "View the current season's circuits.",
    },
    {
        title: 'All Races',
        href: '/races',
        description:
            'Changing to a season by season view soon. Table of results, single table view for a given season with filtering.',
    },
    {
        title: 'Records',
        href: '/races/records',
        description: 'View race records and statistics. (coming soon)',
    },
];
export const seasonsMenuItems: { title: string; href: string; description: string }[] = [
    {
        title: 'Current Season',
        href: `/seasons/season/2025`,
        description: 'View current season and their details.',
    },
    {
        title: 'All Seasons',
        href: `/seasons`,
        description: 'View all seasons at the top level with the ability to  and their details.',
    },
    {
        title: 'Season Records',
        href: '/seasons/records',
        description: 'View season records and statistics (coming soon).',
    },
];

// const menuItemClassName = 'menu-item font-extrabold text-zinc-800 dark:text-zinc-300 cursor-pointer text-md hover:underline';

/**
 * Renders a customizable menu button component.
 *
 * @param label - The text label displayed on the button.
 * @param onClick - Callback function invoked when the button is clicked.
 * @param className - Optional additional CSS class names for styling the button.
 *
 * @returns A styled button element suitable for use in menus or navigation bars.
 */
export const MenuButton = ({
    label,
    onClick,
    className,
}: {
    label: string;
    onClick: () => void;
    className?: string;
}) => (
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
 * Header component for the F1//sp application.
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

    return (
        <header
            id="top"
            className="
            flex 
            gap-4 
            items-start 
            w-full
            p-2 pb-1 mb-0
            bg-zinc-300
          dark:bg-zinc-800 
            shadow-md"
        >
            <div
                className="cursor-pointer absolute top-4 right-4 flex items-center gap-4"
                title="What's New"
                role="button"
            >
                <a href="https://buymeacoffee.com/dah007" rel="noreferrer" target="_blank" title="Buy me a coffee">
                    <LucideCoffee className="text-yellow-400 light:text-brown-500" />
                </a>
            </div>
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
            <div className="flex lg:hidden xl:hidden justify-start grow pt-0 mt-0">
                <a title="F1//sp home" onClick={() => handleNavigation('/')}>
                    <img src={F1SPlogoHorizontal} alt="F1//sp Logo" className="w-36" />
                </a>
            </div>
            <div className="hidden md:hidden lg:flex xl:flex justify-start cursor-pointer">
                <a title="F1//sp home" onClick={() => handleNavigation('/')}>
                    <img src={F1SPlogo} alt="F1//sp Logo" className="w-24" />
                </a>
            </div>

            <div className="hidden lg:block w-full">
                <DesktopNavigation />
            </div>

            {/* MOBILE MENU */}
            <ul id="menu" className="hidden fixed top-0 right-0 px-10 py-16 bg-zinc-900 z-50">
                <li>
                    <MenuButton label="Vote" onClick={() => handleNavigationMobile('/vote')} />
                </li>
                <div className="w-full grid grid-cols-3">
                    <div>
                        <li className="ml-4">
                            <MenuButton label="Leaderboard" onClick={() => handleNavigationMobile('/leaderboard')} />
                        </li>

                        <li>
                            <MenuButton label="Races" onClick={() => handleNavigationMobile('/races')} />
                        </li>

                        <ul className="ml-4 mt-0">
                            {raceMenuItems.map((component) => (
                                <li key={component.title}>
                                    <MenuButton
                                        label={component.title}
                                        onClick={() => handleNavigationMobile(component.href)}
                                    />
                                </li>
                            ))}
                        </ul>

                        <li>
                            <MenuButton label="Drivers" onClick={() => handleNavigationMobile('/drivers')} />
                        </li>

                        <ul className="ml-4 mt-0">
                            {driverMenuItems.map((component) => (
                                <li key={component.title}>
                                    <MenuButton
                                        label={component.title}
                                        onClick={() => handleNavigationMobile(component.href)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <li>
                            <MenuButton label="Seasons" onClick={() => handleNavigationMobile('/seasons')} />
                        </li>
                        <ul className="ml-4 mt-0">
                            {seasonsMenuItems.map((component) => (
                                <li key={component.title}>
                                    <MenuButton
                                        label={component.title}
                                        onClick={() => handleNavigationMobile(component.href)}
                                    />
                                </li>
                            ))}
                        </ul>

                        <li>
                            <MenuButton label="Constructors" onClick={() => handleNavigationMobile('/constructors')} />
                        </li>
                        <ul className="ml-4 mt-0">
                            {constructorMenuItems.map((component) => (
                                <li key={component.title}>
                                    <MenuButton
                                        label={component.title}
                                        onClick={() => handleNavigationMobile(component.href)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <div className="absolute bottom-8 right-8">
                            <a
                                href="https://buymeacoffee.com/dah007"
                                rel="noreferrer"
                                target="_blank"
                                title="Buy me a coffee"
                            >
                                <LucideCoffee size="32" className="text-yellow-400 light:text-brown-500" />
                            </a>
                        </div>
                        <div className="lg:hidden z-90 fixed top-4 right-6">
                            <a
                                href="javascript:void(0)"
                                className="text-right text-white text-4xl"
                                onClick={toggleMenu}
                            >
                                &times;
                            </a>
                        </div>
                    </div>
                </div>
            </ul>
        </header>
    );
};

export default Header;
