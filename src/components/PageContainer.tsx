import { JSX } from 'react';

// import Titles from './Titles';
// import Breadcrumbs from './Breadcrumbs';
import { cn } from '@/lib/utils';
import Breadcrumbs from './Breadcrumbs';
import Titles from './Titles';

interface PageContainerProps {
    children: React.ReactNode;
    className?: string;
    lastCrumb?: string;
    showBreadcrumbs?: boolean;
    showTitle?: boolean;
    title: string;
}

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
    return (
        <div className={cn('flex', 'flex-col', 'h-[80vh]', 'gap-2', className, 'border', 'border-primary')}>
            {showBreadcrumbs && <Breadcrumbs lastCrumb={lastCrumb} />}
            <div className="">{showTitle && title && <Titles title={title} type="h1" />}</div>
            {children}
        </div>
    );
};

export default PageContainer;
