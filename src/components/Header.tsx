import F1SPlogo from 'assets/f1sp.png';
import F1SPlogoHorizontal from 'assets/f1sp-logo_horizontal.png';

import Button from './Button';

const Header: React.FC = () => {
    const handleNavigation = (path: string) => {
        window.location.href = path;
    };

    return (
        <header className="flex">
            <div>
                <div className="flex md:hidden lg:hidden xl:hidden justify-end">
                    <img src={F1SPlogoHorizontal} alt="F1SP Logo" className="h-8" />
                </div>

                <div className="hidden md:flex lg:flex xl:flex justify-start cursor-pointer">
                    <a title="F1 // SP home" onClick={() => handleNavigation('/')} className="flex items-center">
                        <img src={F1SPlogo} alt="F1SP Logo" className="h-32" />
                    </a>
                </div>
            </div>

            <div className="flex flex-grow flex-col">
                <div className="flex flex-grow items-end">
                    <Button
                        variant="ghost"
                        className="hidden md:flex lg:flex xl:flex cursor-pointer"
                        onClick={() => handleNavigation('/drivers')}
                    >
                        Drivers
                    </Button>

                    <Button
                        variant="ghost"
                        className="hidden md:flex lg:flex xl:flex cursor-pointer"
                        onClick={() => handleNavigation('/races')}
                    >
                        Races
                    </Button>

                    <Button
                        variant="ghost"
                        className="hidden md:flex lg:flex xl:flex cursor-pointer"
                        onClick={() => handleNavigation('/constructors')}
                    >
                        Constructors
                    </Button>

                    <Button variant="ghost" className="hidden md:flex lg:flex xl:flex">
                        Drivers
                    </Button>
                    {/* <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuLink>Link</NavigationMenuLink>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <NavigationMenuLink>Link</NavigationMenuLink>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                    <ModeToggle /> */}
                </div>

                <div className="h-2 lg:h-6 xl:h-8"></div>
            </div>
        </header>
    );
};

export default Header;
