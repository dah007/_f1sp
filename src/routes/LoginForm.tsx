import Button from 'components/Button';
import LF from '../components/LoginForm';
import { Card } from 'components/ui/card';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { POD_BG } from '@/constants/constants';

const LoginForm = () => {
    const navigate = useNavigate();

    return (
        <Card className={cn('overflow-hidden p-4 h-[2/5] w-full', POD_BG, 'flex flex-col')}>
            <LF />

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
