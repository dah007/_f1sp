// export function generateSitemap(options?: any): string;
export function generateSitemap(options: {
    baseUrl: string;
    today: string;
    routesDir: string;
    publicDir: string;
    fsModule?: typeof import('fs');
    pathModule?: typeof import('path');
}): string;
