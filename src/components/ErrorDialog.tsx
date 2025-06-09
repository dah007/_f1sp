import { RootState, useAppDispatch, useAppSelector } from '@/app/store';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

import { setError } from '@/slices/systemWideSlice';
import { useEffect } from 'react';
import errorImage500 from '/assets/images/500.png';

/**
 * ErrorDialog Component
 *
 * A modal dialog component that displays a 500 error message to the user.
 * It automatically shows when an error state is set in the Redux store.
 *
 * Features:
 * - Displays a descriptive error message with an F1-themed error image
 * - Automatically logs errors to the console
 * - Can be closed by clicking the Close button, pressing Escape, or clicking outside
 * - Responsive to dark/light mode through appropriate class styling
 *
 * State:
 * - Uses Redux for state management
 * - Monitors loading and error states from the siteWide reducer
 *
 * @component
 * @example
 * // The component is typically used in a layout or error boundary
 * // It automatically appears when an error is set in Redux
 * <ErrorDialog />
 */
const ErrorDialog: React.FC = () => {
    // add a close function that dispatches the setError action to false
    const dispatch = useAppDispatch();
    const loading = useAppSelector((state: RootState) => state.systemWide.loading);
    const error = useAppSelector((state: RootState) => state.systemWide.error);

    const setOpen = (errorStatus: boolean) => {
        dispatch(setError(errorStatus));
    };
    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        if (error) {
            console.error('Error:', error);
            return;
        }
        if (loading) {
            console.log('Loading...');
            return;
        }
        console.log('Loaded');
    }, [error, loading]);

    return (
        <Dialog defaultOpen={true}>
            <DialogContent
                className="z-50 border border-zinc-300 bg-white dark:bg-zinc-900 dark:border-zinc-50"
                onEscapeKeyDown={handleClose}
                onPointerDownOutside={handleClose}
                onCloseAutoFocus={handleClose}
            >
                <DialogHeader className="dark:border-zinc-50">
                    <DialogTitle className="text-3xl racingFont-bold dark:text-zinc-50">500 Error</DialogTitle>
                    <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                        We are sorry, but something went wrong. Please try again later.
                        <br />
                        <img
                            src={errorImage500}
                            alt="500 Error - NOTE: All I asked AI for was a 'F1 inspired 500 error image'"
                            className="w-full rounded-lg"
                        />
                        <strong>NOTE: </strong>All I asked AI for was a &ldquo;F1 inspired 500 error image&rdquo; and
                        this is what it came up with.
                        <DialogClose
                            onClick={handleClose}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Close
                        </DialogClose>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default ErrorDialog;
