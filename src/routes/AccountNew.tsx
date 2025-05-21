import Button from '@/components/Button';
import PageContainer from '@/components/PageContainer';
import { useCreateUserMutation } from '@/features/userApi';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Define types for the API
export interface User {
    id: string;
    name: string;
    email: string;
}

// Define the create user request type
export interface CreateUserRequest {
    name: string;
    email: string;
    passcode: string;
}

const AccountNew: React.FC = (): JSX.Element => {
    const [name, setName] = useState('Demian');
    const [email, setEmail] = useState('dholmberg@gmail.com');
    const [passcode, setPasscode] = useState('123456');
    const [error, setError] = useState<string | null>(null);
    const [success,] = useState(false);

    const navigate = useNavigate();

    // Use the RTK Query mutation hook
    const [createUser, { isLoading }] = useCreateUserMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            console.log('hello?', name, email, passcode);
            // Call the mutation with the form data
            const result = await createUser({
                name,
                email,
                passcode,
            }).unwrap();

            console.log('User created:', result);

            // Reset form fields
            setName('');
            setEmail('');
            setPasscode('');

            localStorage.setItem('user', JSON.stringify(result));

            // Redirect after successful creation
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            console.error('Error creating account:', err);
        }
    };

    return (
        <PageContainer lastCrumb="Create Account" title="Create New Account" showTitle={true} showBreadcrumbs={true}>
            <p className="pb-4">
                <strong>NOTE!!!</strong> This isn&apos;t really secure at the moment. The only purpose this account will
                be used for is to track votes.
            </p>
            <p>You will never get email from the site, since I don&apos;t have an email service set up. :P</p>
            <div className="max-w-md mx-auto mt-8 p-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg shadow-md">
                {success ? (
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-green-600 dark:text-green-400">
                            Account Created Successfully!
                        </h2>
                        <p className="mt-2">Redirecting to home page...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded">
                                {error}
                            </div>
                        )}

                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="passcode" className="block text-sm font-medium mb-1">
                                Passcode
                            </label>
                            <input
                                id="passcode"
                                type="password"
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600"
                                required
                                minLength={6}
                            />
                            <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                                Choose a secure passcode with at least 6 characters
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center border border-zinc-800 dark:border-zinc-300"
                        >
                            {isLoading ? 'Creating...' : 'Create Account'}
                        </Button>
                    </form>
                )}
            </div>
        </PageContainer>
    );
};

export default AccountNew;
