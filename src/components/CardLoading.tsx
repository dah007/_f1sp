interface CardLoadingProps {
    isLoading: boolean;
}

/**
 * CardLoading component displays a loading skeleton overlay when the `isLoading` prop is true.
 *
 * @component
 * @param {CardLoadingProps} props - The props for the CardLoading component.
 * @param {boolean} props.isLoading - Determines whether the loading skeleton should be displayed.
 * @returns {JSX.Element | null} - Returns a div with loading skeleton classes if `isLoading` is true, otherwise returns null.
 */
const CardLoading: React.FC<CardLoadingProps> = ({ isLoading }: CardLoadingProps): JSX.Element | null => {
    if (!isLoading) return null;

    return (
        <div className="absolute w-full h-[80vh] gap-4 flex items-center justify-center text-white racingFont text-3xl flex-col">
            Loading
            <div className="loader"></div>
        </div>
    );
};

export default CardLoading;
