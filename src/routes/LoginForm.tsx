import { cn } from '@/lib/utils';
import { Card } from 'components/ui/card';
// import { useNavigate } from 'react-router-dom';
import LF from '../components/LoginForm';

const LoginForm = () => {
    // const navigate = useNavigate();

    return (
        <div className="flex flex-col h-fit w-96 justify-center">
            <Card className={cn('overflow-hidden p-4 h-[2/5] w-full', 'dark:bg-zinc-800 bg-zinc-300flex flex-col')}>
                <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
                <p>At this point we are not collecting any data.</p>
                <p>We are storing it in the db, but really only to track if you have/have not voted.</p>
                <LF />
            </Card>

            <a href="account/new" className="mt-4 text-center text-blue-500 hover:underline">New User? Create Account</a>
        </div>
    );
};

export default LoginForm;
