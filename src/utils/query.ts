import { REST_URL } from '@/constants/constants';
import { fetchBaseQuery, retry } from '@reduxjs/toolkit/query';

let TIMEOUT = 15000; // 15 seconds timeout

if (sessionStorage.getItem('firstLoadComplete') === null) {
    TIMEOUT = 20000; // 20 seconds timeout
    sessionStorage.setItem('firstLoadComplete', 'true');
}

// Create a custom base query with0 retry logic
export const baseQueryWithRetry = retry(
    fetchBaseQuery({
        baseUrl: REST_URL,
        timeout: TIMEOUT,
    }),
    {
        maxRetries: 5,
    },
);

export const handleErrorLoading = async ({
    error,
    loading,
    cb,
}: {
    error: boolean;
    loading: boolean;
    cb?: (loading: boolean, error: boolean) => void;
}) => {
    if (error) {
        console.error('Error:', error);
        await cb!(true, false);
        return true;
    }
    if (loading) {
        console.log('Loading...');
        await cb!(false, true);
        return true;
    }
    await cb!(false, false);
    return false;
};
// };
