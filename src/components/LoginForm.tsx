import { cn } from '@/lib/utils';
import { Card } from './ui/card';
import { Input } from './ui/input';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const navigate = useNavigate();
    return (
        <Card className={cn('overflow-hidden p-4 h-[2/5] w-full', 'dark:bg-zinc-800 bg-zinc-300flex flex-col')}>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input type="email" id="email" placeholder="Email" />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input type="password" id="pw" placeholder="Password" />
            </div>

            <p>
                <strong>NOTE:</strong> You are limited to a single vote per week. Any attempts to vote more than once
                will just over write your last record.
            </p>
            <Button variant="default" className="border border-zinc-300 shadow-2xl">
                Vote
            </Button>

            <Button
                variant="link"
                className="text-blue-500 hover:text-blue-700"
                onClick={() => navigate('/account/new')}
            >
                New Account
            </Button>
        </Card>
    );
};

export default LoginForm;
