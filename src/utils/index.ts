import { BASE_URL } from '@/constants/constants';

export interface ErrorObject {
    data: string | unknown;
    status: string;
}

/**
 * Builds an error object from the given error.
 *
 * @param error - The error to process. It can be of any type.
 * @returns An object containing the error status and data. If the error has a `status` property, it will be used as the error status. Otherwise, 'CUSTOM_ERROR' will be used. If the error has a `statusText` property, it will be used as the error data. Otherwise, the entire error object will be used as the error data.
 */
export const buildErrorObject = (error: unknown): ErrorObject => {
    const errorStatus = (error as { status?: string }).status;
    const errorStatusText = (error as { statusText?: string }).statusText;

    return { status: errorStatus || 'UNKNOWN_ERROR', data: errorStatusText || error };
};

/**
 * Removes duplicate objects from an array based on a specified key.
 *
 * @typeParam T - The type of objects in the array.
 * @param array - The array of objects to filter.
 * @param key - The key of the object to use for determining duplicates.
 * @returns A new array with duplicates removed, keeping only the first occurrence of each unique key value.
 */
export const removeDuplicates = <T extends Record<string, object>>(array: T[], key: keyof T): T[] => {
    const seen = new Set();
    return array.filter((item) => {
        const value = item[key];
        if (seen.has(value)) {
            return false;
        } else {
            seen.add(value);
            return true;
        }
    });
};

/**
 * Fetch's data from an endpoint attached to the F1SP
 * @param endPoint The api end point to hit
 * @returns An array of objects
 *
 * @deprecated This function is deprecated and will be removed in a future version. Use the `fetch` API directly instead.
 */
export const dbFetch = async (endPoint: string) => {
    return fetch(`${BASE_URL}${endPoint}`)
        .then((response) => {
            console.log('Full Response:', response);
            if (!response.ok) {
                console.log(2);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get('content-type');
            console.log(3);
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            }
            console.log(3.5);
            return response.body;
        })
        .then((data) => {
            console.log(4);
            if (!data) {
                throw new Error('No data returned from the API.');
            }
            return {
                data,
            };
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            return {
                error: {
                    status: error.status,
                    statusText: error.statusText,
                },
            };
        });

    // Uncomment the following code if you want to use the fetch API directly
    // const F1SP_BASE_DB_URL = '/data-api/rest/';
    // const response = await fetch(`${F1SP_BASE_DB_URL}${endPoint}`);

    // if (!response) {
    //     throw new Error('No response received from the API.');
    // }

    // if (!response.ok) {
    //     // If the response is not ok, return an error
    //     return {
    //         error: {
    //             status: response.status,
    //             statusText: response.statusText,
    //         },
    //     };
    // }

    // const data = await response.json();

    // if (!data) {
    //     throw new Error('No data returned from the API.');
    // }

    // return {
    //     data,
    // };
};
