import { JSX } from 'react';

// import Titles from './Titles';
// import Breadcrumbs from './Breadcrumbs';
import { useAppSelector } from '@/app/store';
import { DRIVERS_BY_ID } from '@/constants/driversConstants';
import { cn } from '@/lib/utils';
import { ScrollAreaScrollbar } from '@radix-ui/react-scroll-area';
import Breadcrumbs from './Breadcrumbs';
import Titles from './Titles';
import { ScrollArea } from './ui/scroll-area';

interface PageContainerProps {
    children: React.ReactNode;
    className?: string;
    lastCrumb?: string;
    showBreadcrumbs?: boolean;
    showTitle?: boolean;
    title: string;
}

// const { id, year } = useParams();

/**
 * PageContainer component that wraps its children with optional breadcrumbs and title.
 *
 * @param {PageContainerProps} props - The props for the PageContainer component.
 * @param {React.ReactNode} props.children - The content to be displayed inside the container.
 * @param {string} [props.className] - The class name to be applied to the container.
 * @param {string} [props.lastCrumb] - The last breadcrumb to be displayed if breadcrumbs are shown.
 * @param {boolean} [props.showBreadcrumbs=true] - Flag to show or hide breadcrumbs.
 * @param {boolean} [props.showTitle=true] - Flag to show or hide the title.
 * @param {string} [props.title] - The title to be displayed if showTitle is true.
 *
 * @returns {JSX.Element} The rendered PageContainer component.
 */
const PageContainer: React.FC<PageContainerProps> = ({
    children,
    className,
    lastCrumb,
    showBreadcrumbs = true,
    showTitle = true,
    title,
}: PageContainerProps): JSX.Element => {
    const raceDetails = useAppSelector((state) => state.races.raceDetails);
    return (
        <div className={cn('flex', 'flex-col', 'h-[80vh]', 'gap-2', className)}>
            {showBreadcrumbs && (
                <Breadcrumbs
                    lastCrumb={lastCrumb}
                    resolveIdLabel={(id: string, context?: string): string | undefined => {
                        console.log('id', id, 'context', context);
                        if (context === 'driver') {
                            const driver = DRIVERS_BY_ID[id]?.name;
                            return driver ? String(driver) : undefined;
                        } else if (context === 'race') {
                            return raceDetails
                                ? String(raceDetails.official_name) || String(raceDetails.full_name)
                                : undefined;
                        }
                        // if (context === 'race') return raceNameMap[id]; // e.g., { '1131': 'Formula 1 Crypto.com Miami Grand Prix 2025' }
                        return undefined;
                    }}
                />
            )}
            <div>{showTitle && title && <Titles title={title} type="h1" />}</div>
            <ScrollArea className="h-[80vh] w-full">
                <ScrollAreaScrollbar />
                {children}
            </ScrollArea>
        </div>
    );
};

export default PageContainer;
