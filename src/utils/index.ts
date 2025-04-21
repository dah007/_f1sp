const F1SP_BASE_DB_URL = '/data-api/rest/';

/**
 * Fetch's data from an endpoint attached to the F1SP
 * @param endPoint The api end point to hit
 * @returns An array of objects
 */
export const dbFetch = async (endPoint: string) => {
    return fetch(`${F1SP_BASE_DB_URL}${endPoint}`)
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
