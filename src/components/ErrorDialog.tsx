import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

import errorImage500 from 'assets/images/500.png';
const ErrorDialog: React.FC = () => {
    return (
        <Dialog defaultOpen={true}>
            <DialogContent className="z-50 border border-zinc-300 bg-white dark:bg-zinc-900 dark:border-zinc-50">
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
                        <br />
                        <a href="/" className="text-blue-500">
                            Go back to home
                        </a>
                        {/* <DialogClose onClick={() => setOpen(false)} /> */}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default ErrorDialog;
