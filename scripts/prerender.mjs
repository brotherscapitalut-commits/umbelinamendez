import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// We need to parse seo.config.ts to get the routes.
// To avoid ts-node in build step, we will extract routes using a simple regex since we know the format.
async function getRoutes() {
  const configPath = path.join(__dirname, '../src/seo/seo.config.ts');
  const content = await fs.readFile(configPath, 'utf-8');
  
  // Find all keys in the seoConfig object
  const routes = [];
  const regex = /"(\/[^"]*)"\s*:\s*\{|'(\/[^']*)'\s*:\s*\{|(\/[a-zA-Z0-9/-]+)\s*:\s*\{/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const route = match[1] || match[2] || match[3];
    if (route) {
      routes.push(route);
    }
  }
  
  // Also include any static routes we know if they are missed by regex
  const expectedRoutes = [
    '/', '/tratamentos', '/agendamento', '/faq', '/blog',
    '/servicos/pos-operatorio', '/servicos/drenagem-linfatica',
    '/servicos/conexao-materna', '/servicos/laserterapia-ilib',
    '/servicos/beauty-tech-day', '/servicos/flacidez',
    '/servicos/metodo-reviva', '/servicos/reviva-face'
  ];
  
  return [...new Set([...routes, ...expectedRoutes])];
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
  const routes = await getRoutes();
  console.log(`Pre-rendering ${routes.length} routes...`);

  let serverProcess;
  try {
    const { server, port } = await startServer();
    serverProcess = server;
    console.log(`Server started on port ${port}`);

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
