'use client';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import React from 'react';
import { constructorMenuItems, driverMenuItems, raceMenuItems, seasonsMenuItems } from './Header';
import NextRaceBanner from './NextRaceBanner';

const menuButton =
    'text-zinc-800 dark:text-zinc-300 hover:text-zinc-500 dark:hover:text-zinc-300 font-extrabold text-xl';
const menuItemBG = 'bg-zinc-300 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md shadow-md';

export function DesktopNavigation() {
    return (
        <div className="flex flex-col w-full">
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className={cn('text-red-500 font-extrabold text-xl')}>
                            Vote
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className={menuItemBG}>
                            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                <ListItem href="/vote" title="Vote">
                                    Vote for your favourite driver and constructor.
                                </ListItem>
                                <ListItem href="/leaderboard" title="Leaderboard">
                                    Coming soon.
                                </ListItem>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuTrigger className={menuButton}>Races</NavigationMenuTrigger>
                        <NavigationMenuContent className={menuItemBG}>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                {raceMenuItems.map((component) => (
                                    <ListItem key={component.title} title={component.title} href={component.href}>
                                        {component.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuTrigger className={menuButton}>Drivers</NavigationMenuTrigger>
                        <NavigationMenuContent className={menuItemBG}>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                {driverMenuItems.map((component) => (
                                    <ListItem key={component.title} title={component.title} href={component.href}>
                                        {component.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuTrigger className={menuButton}>Seasons</NavigationMenuTrigger>
                        <NavigationMenuContent className={menuItemBG}>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                {seasonsMenuItems.map((component) => (
                                    <ListItem key={component.title} title={component.title} href={component.href}>
                                        {component.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuTrigger className={menuButton}>Constructors</NavigationMenuTrigger>
                        <NavigationMenuContent className={menuItemBG}>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                {constructorMenuItems.map((component) => (
                                    <ListItem key={component.title} title={component.title} href={component.href}>
                                        {component.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <NextRaceBanner />
        </div>
    );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
    ({ className, title, children, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref={ref}
                        className={cn(
                            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                            className,
                        )}
                        {...props}
                    >
                        <div className="text-sm font-medium leading-none">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
                    </a>
                </NavigationMenuLink>
            </li>
        );
    },
);
ListItem.displayName = 'ListItem';
