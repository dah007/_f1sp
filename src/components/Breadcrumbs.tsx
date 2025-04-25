import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from './ui/breadcrumb';
import { MENU } from 'constants/constants';
import { RouteProps } from './CustomLink';

interface BreadcrumbProps {
    lastCrumb?: string;
}

const Breadcrumbs: React.FC<BreadcrumbProps> = ({ lastCrumb }): JSX.Element => {
    const { id, year } = useParams();
    const location = useLocation();
    const [crumbs, setCrumbs] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const getMenuItem = (pathname: string): Partial<RouteProps> => {
            return MENU.find((item) => item.path === pathname) || { path: '', label: '', hidden: false };
        };

        const pathnames = location.pathname.split('/').filter((x) => x);

        const generateCrumbs = () => {
            const Breadcrumbs: JSX.Element[] = pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                const menuItem = getMenuItem(value);

                let label = menuItem?.label ?? value;

                const hidden = menuItem?.hidden ?? false;

                if (value === year)
                    return (
                        <div key={to} className="hidden w-0">
                            year
                        </div>
                    );

                if (value === id) {
                    label = lastCrumb ?? 'bob';
                } else if (hidden) return <div key={to} className="hidden w-0"></div>;

                return (
                    <div key={to} className="flex items-center">
                        <BreadcrumbSeparator className="mr-2" />
                        <BreadcrumbItem>
                            <BreadcrumbLink href={to}>{label}</BreadcrumbLink>
                        </BreadcrumbItem>
                    </div>
                );
            });

            return Breadcrumbs;
        };

        setCrumbs(generateCrumbs());
    }, [lastCrumb, location, id, year]);

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
