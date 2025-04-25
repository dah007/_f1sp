import { FONT_SIZE } from 'constants/constants';
import type { ILoadingProps } from 'types/toasts';

/**
 * LoadingToast component displays a loading indicator with optional text.
 *
 * @param {ILoadingProps} props - The props for the component.
 * @param {string} [props.fontSize='text-md'] - Optional font size class to apply to the loading toast.
 * @param {boolean} props.isLoading - Determines if the loading toast should be displayed.
 * @param {string} [props.text='Loading...'] - Optional text to display in the loading toast.
 * @param {string} [props.addClass=''] - Optional additional classes to apply to the loading toast.
 *
 * @returns {JSX.Element | null} - The loading toast element or null if not loading.
 */
const LoadingToast: React.FC<ILoadingProps> = ({
    isLoading = false,
    fontSize = 'text-md',
    text = 'Loading...',
    addClass = '',
}: ILoadingProps): JSX.Element => {
    if (!isLoading) {
        return <></>;
    }
    // ? why did i do what i did below with the Grid? because i'm lazy and it was easy
    return (
        <div className={`grid grid-cols-3 mb-3 ${addClass}`}>
            <div>&nbsp;</div>
            <div
                className={`pr-0 m-0 mb-4 flex bg-blue-600 font-bold ${FONT_SIZE[fontSize]} alert`}
                role="alert"
                data-testid="LoadingToast"
            >
                <span className="loading loading-bars loading-md"></span>
                <span>{text}</span>
            </div>
            <div>&nbsp;</div>
        </div>
    );
};

export default LoadingToast;
