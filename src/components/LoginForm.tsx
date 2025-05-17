import { VoteValueProps } from '@/types/vote';
import React, { useState } from 'react';
import { Input } from './ui/input';

type LoginFormProps = {
    userId?: number;
    email?: string;
    passcode?: string;
    setVoteValues?: (values: Partial<VoteValueProps>) => void;
    // voteValues?: any;
    onLoginSuccess?: (user: { id: number; email: string; passcode: string }) => void;
};

const LoginForm = ({
    userId,
    email,
    passcode,
    // setVoteValues = () => {},
    // voteValues,
    onLoginSuccess,
}: LoginFormProps) => {
    const [localEmail, setLocalEmail] = useState(email || '');
    const [localPasscode, setLocalPasscode] = useState(passcode || '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // TODO: Replace with your real login logic/API call
        if (localEmail && localPasscode) {
            // Simulate login success
            onLoginSuccess?.({ id: 1, email: localEmail, passcode: localPasscode });

            localStorage.setItem('user', JSON.stringify({ id: 1, email: localEmail, passcode: localPasscode }));

            setSuccess('Login successful');
            setTimeout(() => {
                setSuccess('');
                location.href = '/vote/';
            }, 2000);
        } else {
            setError('Please enter email and passcode');
        }
    };

    return (
        <form onSubmit={handleLogin} className="mb-4">
            {userId && <>User ID: {userId}</>}
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={localEmail}
                    onChange={(e) => setLocalEmail(e.target.value)}
                />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input
                    type="password"
                    id="pw"
                    placeholder="Passcode"
                    value={localPasscode}
                    onChange={(e) => setLocalPasscode(e.target.value)}
                />
            </div>
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-500">{success}</div>}
            <button type="submit" className="mt-2 w-full bg-blue-500 text-white py-2 rounded">
                Log In
            </button>
        </form>
    );
};

export default LoginForm;
