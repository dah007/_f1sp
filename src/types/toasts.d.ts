import { FONT_SIZE } from 'constants/constants';

/**
 * Props for the LoadingToast component.
 *
 * @interface ILoadingProps
 * @property {string} [addClass=''] - Optional additional classes to apply to the loading toast.
 * @property {boolean} [card=false] - Determines if the loading toast should be displayed in a card.
 * @property {string} [fontSize='text-md'] - The font size of the loading text.
 * @property {boolean} isLoading - Determines if the loading toast should be displayed.
 * @property {string} [text] - Optional text to display in the loading toast. Defaults to 'Loading...'.
 */
export interface ILoadingProps {
    addClass?: string;
    card?: boolean;
    fontSize?: keyof typeof FONT_SIZE;
    isLoading: boolean;
    text?: string;
}

/**
 * Props for the ErrorToast component.
 *
 * @interface IErrorProps
 * @property {string} [addClass=''] - Optional additional classes to apply to the error toast.
 * @property {boolean} [card=false] - Determines if the error toast should be displayed in a card.
 * @property {string} [fontSize='text-md'] - The font size of the error text.
 * @property {boolean} isError - Determines if the error toast should be displayed.
 * @property {string} [text] - Optional text to display in the error toast. Defaults to 'Error'.
 */
export interface IErrorProps {
    addClass?: string;
    card?: boolean;
    fontSize?: string;
    header?: boolean;
    isError: boolean;
    text?: string;
}
