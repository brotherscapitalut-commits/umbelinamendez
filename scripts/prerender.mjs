import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getRoutes(port) {
  try {
    const res = await fetch(`http://localhost:${port}/sitemap.xml`);
    if (!res.ok) {
      throw new Error(`Failed to fetch sitemap: ${res.status}`);
    }
    const text = await res.text();
    
    // Save the dynamic sitemap to dist
    const distDir = path.join(__dirname, '../dist');
    await fs.mkdir(distDir, { recursive: true });
    await fs.writeFile(path.join(distDir, 'sitemap.xml'), text, 'utf-8');
    console.log('✅ Dynamic sitemap saved to dist/sitemap.xml');

    // Parse out all <loc> tags from the XML
    const routes = [];
    const regex = /<loc>(?:https?:\/\/[^/]+)?(\/[^<]*)<\/loc>/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      routes.push(match[1]);
    }
    return [...new Set(routes)];
  } catch (error) {
    console.error("Error fetching sitemap routes:", error);
    // Fallback if sitemap fails
    return [
      '/', '/tratamentos', '/agendamento', '/faq', '/blog',
      '/servicos/pos-operatorio', '/servicos/drenagem-linfatica',
      '/servicos/conexao-materna', '/servicos/laserterapia-ilib',
      '/servicos/beauty-tech-day', '/servicos/flacidez',
      '/servicos/metodo-reviva', '/servicos/reviva-face',
      '/blog/drenagem-linfatica-pos-operatorio-brasilia',
      '/blog/drenagem-linfatica-abdominoplastia-brasilia',
      '/blog/pos-operatorio-cirurgia-plastica-brasilia',
      '/blog/como-evitar-fibrose-pos-operatorio-lipoaspiracao',
      '/blog/taping-pos-operatorio-parto-brasilia',
      '/blog/lipedema-sintomas-tratamento-brasilia'
    ];
  }
}

async function startServer() {
  return new Promise((resolve) => {
    const port = 4185;
    const server = spawn('npx', ['vite', 'preview', '--port', port.toString(), '--strictPort'], {
      cwd: path.join(__dirname, '..'),
      shell: true
    });

    server.stderr.on('data', (data) => {
      console.error(`Preview Server: ${data}`);
    });

    // Wait 3 seconds for the server to start
    setTimeout(() => {
      resolve({ server, port });
    }, 3000);
  });
}

async function prerender() {
  let serverProcess;
  try {
    const { server, port } = await startServer();
    serverProcess = server;
    console.log(`Server started on port ${port}`);

    const routes = await getRoutes(port);
    console.log(`Pre-rendering ${routes.length} routes...`);

    const isVercelBuild = !!process.env.VERCEL;

    const browser = isVercelBuild
      ? await puppeteer.launch({
          args: chromium.args,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
        })
      : await puppeteer.launch({
          headless: true,
          channel: 'chrome',
        });
    const page = await browser.newPage();
    
    // Set viewport to a desktop size
    await page.setViewport({ width: 1280, height: 800 });

    const distDir = path.join(__dirname, '../dist');
    const outputs = {};

    for (const route of routes) {
      console.log(`Pre-rendering ${route} ...`);
      const url = `http://localhost:${port}${route}`;
      
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 800)));

      const html = await page.content();

      let filePath = '';
      if (route === '/') {
        filePath = path.join(distDir, 'index.html');
      } else {
        const routeDir = path.join(distDir, route.substring(1));
        await fs.mkdir(routeDir, { recursive: true });
        filePath = path.join(routeDir, 'index.html');
      }
      
      outputs[filePath] = html;
    }

    // Write all files at the end so the preview server keeps serving the original index.html as fallback
    for (const [filePath, html] of Object.entries(outputs)) {
      await fs.writeFile(filePath, html, 'utf-8');
    }

    await browser.close();
    console.log('Pre-rendering complete.');

  } catch (error) {
    console.error('Error during pre-rendering:', error);
    process.exit(1);
  } finally {
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

prerender();
