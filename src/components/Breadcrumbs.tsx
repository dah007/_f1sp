import { MENU } from 'constants/constants';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from './ui/breadcrumb';

interface BreadcrumbProps {
    lastCrumb?: string;
    resolveIdLabel?: (id: string, context?: string) => string | undefined;
}

const Breadcrumbs: React.FC<BreadcrumbProps> = ({ lastCrumb, resolveIdLabel }): JSX.Element => {
    const { id, year } = useParams();
    const location = useLocation();
    const [crumbs, setCrumbs] = useState<JSX.Element[]>([]);
    useEffect(() => {
        const pathnames = location.pathname.split('/').filter((x) => x);
        const generateCrumbs = () => {
            return pathnames
                .map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    let label = value;
                    // Special handling for known MENU items
                    const menuItem = MENU.find((item) => item.path === value);
                    if (menuItem && menuItem.label) label = menuItem.label;
                    // Show year as its own crumb
                    if (year && value === year) label = year;
                    // Show id as lastCrumb if present
                    if (id && value === id) {
                        // Try to resolve a label for the id, fallback to lastCrumb or id
                        label = (resolveIdLabel!(id, pathnames[index - 1]) || id || lastCrumb) as string;
                    }
                    // Hide hidden MENU items
                    if (menuItem && menuItem.hidden) return null;
                    return (
                        <div key={to} className="flex items-center">
                            <BreadcrumbSeparator className="mr-2" />
                            <BreadcrumbItem>
                                <BreadcrumbLink href={to}>{label}</BreadcrumbLink>
                            </BreadcrumbItem>
                        </div>
                    );
                })
                .filter(Boolean);
        };
        // Fix the type issue by explicitly casting the filtered result
        setCrumbs(generateCrumbs() as JSX.Element[]);
    }, [lastCrumb, location, id, year, resolveIdLabel]);

    return (
        <Breadcrumb className="flex w-full m-0 mt-3 text-left">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {crumbs}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default Breadcrumbs;
