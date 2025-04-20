import { JSX } from 'react';
import ModeToggle from './ModeToggle';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from './ui/navigation-menu';

/**
 * Header component that displays a header section with a title and a mode toggle button.
 *
 * @returns {JSX.Element} The rendered header component.
 */
const Header = (): JSX.Element => {
    return (
        <header className="border-b dark:border-gray-500 light:border-gray-900 h-14 flex p-2 justify-center items-center">
            <h2 data-testid="header" className="text-3xl font-bold">
                Base Configuration
            </h2>

            <div>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <NavigationMenuLink>Link</NavigationMenuLink>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            <div className="flex-1 text-right">
                <ModeToggle />
            </div>
        </header>
    );
};

export default Header;
