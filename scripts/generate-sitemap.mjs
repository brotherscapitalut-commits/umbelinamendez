import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSitemap() {
  const configPath = path.join(__dirname, '../src/seo/seo.config.ts');
  const content = fs.readFileSync(configPath, 'utf-8');
  
  // Extrair as rotas
  const routes = [];
  const regex = /"(\/[^"]*)"\s*:\s*\{|'(\/[^']*)'\s*:\s*\{|(\/[a-zA-Z0-9/-]+)\s*:\s*\{/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const route = match[1] || match[2] || match[3];
    if (route) {
      routes.push(route);
    }
  }
  
  // Garantir rotas base
  const expectedRoutes = [
    '/', '/tratamentos', '/agendamento', '/faq', '/blog',
    '/servicos/pos-operatorio', '/servicos/drenagem-linfatica',
    '/servicos/conexao-materna', '/servicos/laserterapia-ilib',
    '/servicos/beauty-tech-day', '/servicos/flacidez',
    '/servicos/metodo-reviva', '/servicos/reviva-face',
    '/blog/drenagem-linfatica-pos-operatorio-brasilia',
    '/blog/drenagem-linfatica-abdominoplastia-brasilia',
    '/blog/pos-operatorio-cirurgia-plastica-brasilia',
    '/blog/como-evitar-fibrose-pos-operatorio-lipoaspiracao',
    '/blog/taping-pos-operatorio-parto-brasilia'
  ];
  
  const allRoutes = [...new Set([...routes, ...expectedRoutes])];
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

  const sitemapPath = path.join(__dirname, '../dist/sitemap.xml');
  fs.writeFileSync(sitemapPath, xml);
  console.log(`✅ Sitemap gerado com sucesso em dist/sitemap.xml com ${allRoutes.length} rotas.`);
}

generateSitemap();
