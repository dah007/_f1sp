import { beforeEach, describe, expect, it, vi } from 'vitest';
//@ts-ignore
import { generateSitemap } from '../../generate-sitemap.cjs';

describe('generateSitemap', () => {
    const baseUrl = 'https://f1sp.app';
    const today = '2025-06-12';
    const routesDir = '/mocked/routes';
    const publicDir = '/mocked/public';

    let fsMock: any;
    let pathMock: any;

    beforeEach(() => {
        fsMock = {
            readdirSync: vi.fn(),
            statSync: vi.fn(),
            writeFileSync: vi.fn(),
        };
        pathMock = {
            join: (...args: string[]) => args.join('/'),
            basename: (file: string, ext: string) => file.replace(ext, ''),
        };
    });

    it('should generate sitemap.xml with correct URLs and lastmod', () => {
        const files = ['HomeRoute.tsx', 'AccountNewRoute.tsx', 'NotARoute.txt'];
        const mtime = new Date('2025-06-10T12:00:00Z');
        fsMock.readdirSync.mockReturnValue(files);
        fsMock.statSync.mockReturnValue({ mtime });
        fsMock.writeFileSync.mockImplementation(() => {});

        const sitemap = generateSitemap({
            baseUrl,
            today,
            routesDir,
            publicDir,
            fsModule: fsMock,
            pathModule: pathMock,
        });

        expect(fsMock.writeFileSync).toHaveBeenCalled();
        const [filePath, writtenSitemap] = fsMock.writeFileSync.mock.calls[0];
        expect(filePath).toContain('public/sitemap.xml');
        expect(writtenSitemap).toContain('<loc>https://f1sp.app/Home</loc>');
        expect(writtenSitemap).toContain('<loc>https://f1sp.app/AccountNew</loc>');
        expect(writtenSitemap).toContain('<lastmod>2025-06-10</lastmod>');
        expect(writtenSitemap).toContain('<loc>https://f1sp.app/</loc>');
        expect(writtenSitemap).toContain(`<lastmod>${today}</lastmod>`);
        expect(writtenSitemap).not.toContain('NotARoute');
        expect(sitemap).toBe(writtenSitemap);
    });
});
