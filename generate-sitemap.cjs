const fs = require('fs');
const path = require('path');

// The base URL of the project and today's date
const baseUrl = 'https://f1sp.app';
const today = new Date().toISOString().split('T')[0];

// Read all files in the routes folder
const routesDir = path.join(__dirname, 'src', 'routes');

// Sitemap headers
let sitemap = '';

// Scan all *Routes.js files in the folder using dynamic import
(async () => {
    const files = fs.readdirSync(routesDir);
    let tempSitemap = '';

    for (const file of files) {
        if (file.endsWith('.tsx')) {
            const baseName = path.basename(file, '.tsx'); // e.g., 'AccountNewRoute'

            if (baseName.toString().endsWith('Route')) {
                const filePath = path.join(routesDir, file);
                const stats = fs.statSync(filePath);
                const lastModified = stats.mtime.toISOString().split('T')[0]; // Format: YYYY-MM-DD
                console.log(`Processing file: ${file}`, lastModified);
                tempSitemap =
                    tempSitemap +
                    `
    <url>
      <loc>${baseUrl}/${baseName.replace('Route', '')}</loc>
      <lastmod>${lastModified}</lastmod>
    </url>\n`;
            }
        }
    }

    sitemap =
        `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${baseUrl}/</loc>
      <lastmod>${today}</lastmod>
    </url>` +
        tempSitemap +
        `
</urlset>`;

    // Create the sitemap.xml file
    fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap);

    console.log('sitemap.xml successfully created!');
})();
