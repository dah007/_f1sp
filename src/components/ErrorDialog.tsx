import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

import errorImage500 from 'assets/images/500.png';
const ErrorDialog: React.FC = () => {
    return (
        <Dialog defaultOpen={true}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle onClick={() => console.log('CLICK BITCHES')} className="text-3xl racingFont">
                        500 Error
                    </DialogTitle>
                    <DialogDescription>
                        <img
                            src={errorImage500}
                            alt="500 Error - NOTE: All I asked AI for was a 'F1 inspired 500 error image"
                            className="w-full rounded-lg"
                        />
                        We are sorry, but something went wrong. Please try again later.
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
