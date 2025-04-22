import { cn } from '@/lib/utils';
import { Card as CCard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from 'components/ui/card';
import { JSX } from 'react';

interface CardProps {
    children: React.ReactNode;
    childrenClassName?: string;
    className?: string;
    description?: string;
    descriptionClassName?: string;
    footer?: React.ReactNode;
    footerClassName?: string;
    title?: string;
    titleClassName?: string;
}

/**
 * Card. Wrapper component for t he shadcn/ui card component.
 *
 * @component
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The content to be displayed within the card
 * @param {string} [props.childrenClassName] - Additional class names for the card content
 * @param {string} [props.className] - Additional class names for the card container
 * @param {string} [props.description] - Description text shown in the card header
 * @param {string} [props.descriptionClassName] - Additional class names for the description
 * @param {React.ReactNode} [props.footer] - Content to be displayed in the card footer
 * @param {string} [props.footerClassName] - Additional class names for the footer
 * @param {string} [props.title] - Title text shown in the card header
 * @param {string} [props.titleClassName] - Additional class names for the title
 * @returns {JSX.Element} The rendered Card component
 */
export function Card({
    children,
    childrenClassName,
    className,
    description,
    descriptionClassName,
    footer,
    footerClassName,
    title,
    titleClassName,
}: CardProps): JSX.Element {
    return (
        <CCard className={cn('w-full bg-white dark:bg-slate-800 shadow-md p-0', className)}>
            {(title || description) && (
                <CardHeader>
                    fsdjkf;a aklfds a;fskaf a;fsd;klj
                    {title && <CardTitle className={cn('p-4 pt-0 bg-amber-300', titleClassName)}>{title}</CardTitle>}
                    {description && <CardDescription className={descriptionClassName}>{description}</CardDescription>}
                </CardHeader>
            )}

            <CardContent className={cn(childrenClassName)}>DASFAskdsafl":{children}</CardContent>

            {footer && <CardFooter className={cn('flex justify-between', footerClassName)}>{footer}</CardFooter>}
        </CCard>
    );
}
