const fs = require('fs');
const path = require('path');

// Refactored: inject fs and path for testability
function generateSitemap({
    baseUrl = 'https://f1sp.app',
    today = new Date().toISOString().split('T')[0],
    routesDir = path.join(__dirname, 'src', 'routes'),
    publicDir = path.join(__dirname, 'public'),
    fsModule = fs,
    pathModule = path,
} = {}) {
    let sitemap = '';
    const files = fsModule.readdirSync(routesDir);
    let tempSitemap = '';

    for (const file of files) {
        if (file.endsWith('.tsx')) {
            const baseName = pathModule.basename(file, '.tsx');
            if (baseName.toString().endsWith('Route')) {
                const filePath = pathModule.join(routesDir, file);
                const stats = fsModule.statSync(filePath);
                const lastModified = stats.mtime.toISOString().split('T')[0];
                tempSitemap =
                    tempSitemap +
                    `\n    <url>\n      <loc>${baseUrl}/${baseName.replace(
                        'Route',
                        '',
                    )}</loc>\n      <lastmod>${lastModified}</lastmod>\n    </url>\n`;
            }
        }
    }

    sitemap =
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n    <url>\n      <loc>${baseUrl}/</loc>\n      <lastmod>${today}</lastmod>\n    </url>` +
        tempSitemap +
        `\n</urlset>`;

    fsModule.writeFileSync(pathModule.join(publicDir, 'sitemap.xml'), sitemap);
    return sitemap;
}

if (require.main === module) {
    (async () => {
        generateSitemap();
        console.log('sitemap.xml successfully created!');
    })();
}

module.exports = { generateSitemap };
