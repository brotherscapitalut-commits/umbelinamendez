import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSitemap() {
  const configPath = path.join(__dirname, '../src/seo/seo.config.ts');
  const content = fs.readFileSync(configPath, 'utf-8');
  
  // Extrair as rotas estáticas
  const routes = [];
  const regex = /"(\/[^"]*)"\s*:\s*\{|'(\/[^']*)'\s*:\s*\{|(\/[a-zA-Z0-9/-]+)\s*:\s*\{/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const route = match[1] || match[2] || match[3];
    if (route) {
      routes.push(route);
    }
  }

  // Extrair rotas do blog
  const blogSeedPath = path.join(__dirname, '../src/data/blog-seed.ts');
  const blogContent = fs.readFileSync(blogSeedPath, 'utf-8');
  const blogRegex = /slug:\s*["']([^"']+)["']/g;
  let blogMatch;
  while ((blogMatch = blogRegex.exec(blogContent)) !== null) {
    routes.push(`/blog/${blogMatch[1]}`);
  }
  
  const allRoutes = [...new Set(routes)];
  const BASE_URL = 'https://www.umbelinamendez.com.br';
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  const today = new Date().toISOString().split('T')[0];

  for (const route of allRoutes) {
    const priority = route === '/' ? '1.0' : route.startsWith('/servicos') ? '0.9' : '0.8';
    xml += `  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>
`;
  }

  xml += `</urlset>`;

  const distDir = path.join(__dirname, '../dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const sitemapPath = path.join(distDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml);
  console.log(`✅ Sitemap gerado com sucesso em dist/sitemap.xml com ${allRoutes.length} rotas.`);
}

generateSitemap();
