import { cn } from '@/lib/utils';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';

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
 * A wrapper component for the Card component that provides a standardized layout with optional title, description, and footer.
 *
 * @component
 * @example
 * ```tsx
 * <CardContainer
 *   title="My Card"
 *   description="This is a description"
 *   footer={<Button>Submit</Button>}
 * >
 *   Content goes here
 * </CardContainer>
 * ```
 *
 * @param props - The component props
 * @param props.children - The content to be displayed in the card body
 * @param props.childrenClassName - Additional CSS class names for the card content
 * @param props.className - Additional CSS class names for the card container
 * @param props.description - Optional description text to display in the card header
 * @param props.descriptionClassName - Additional CSS class names for the description
 * @param props.footer - Optional content to display in the card footer
 * @param props.footerClassName - Additional CSS class names for the footer
 * @param props.title - Optional title text to display in the card header
 * @param props.titleClassName - Additional CSS class names for the title
 * @returns A Card component with the specified structure and styling
 */
const CardContainer: React.FC<CardProps> = ({
    children,
    childrenClassName,
    className,
    description,
    descriptionClassName,
    footer,
    footerClassName,
    title,
    titleClassName,
}: CardProps): JSX.Element => {
    // const [notLoaded, setNotLoaded] = useState(true);
    return (
        <Card className={cn('bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700', className)}>
            {(title || description) && (
                <CardHeader>
                    {title && <CardTitle className={cn('m-0', titleClassName)}>{title}</CardTitle>}
                    {description && <CardDescription className={descriptionClassName}>{description}</CardDescription>}
                </CardHeader>
            )}

            <CardContent className={cn('children-div', childrenClassName)}>
                {!children && <Skeleton />}
                {children}
            </CardContent>

            {footer && (
                <CardFooter className={cn('card-footer flex justify-between', footerClassName)}>{footer}</CardFooter>
            )}
        </Card>
    );
};

export default CardContainer;
