import { Input } from './ui/input';

const LoginForm = () => {
    return (
        <>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input type="email" id="email" placeholder="Email" />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input type="password" id="pw" placeholder="Password" />
            </div>
        </>
    );
};

export default LoginForm;
