import { useEffect, useState } from 'react';

export const useImageExists = (src: string | undefined) => {
    const [exists, setExists] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!src) {
            setExists(false);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const img = new Image();

        img.onload = () => {
            setExists(true);
            setIsLoading(false);
        };

        img.onerror = () => {
            setExists(false);
            setIsLoading(false);
        };

        img.src = src;

        // Cleanup function
        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src]);

    return { exists, isLoading };
};
