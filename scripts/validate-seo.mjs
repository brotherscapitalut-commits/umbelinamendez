import fs from 'fs';
import path from 'path';

// We parse the ts file as a simple text parsing, or we could compile it.
// Since it's a simple object export, we can just use a regex.
// Wait, it's better to compile it or evaluate it.
// Using node to evaluate typescript is hard without ts-node.
// I'll parse it with regex for simplicity, or just read the lines.

const configContent = fs.readFileSync(path.join(process.cwd(), 'src/seo/seo.config.ts'), 'utf-8');

const titleRegex = /title:\s*["']([^"']+)["']/g;
const descRegex = /description:\s*["']([^"']+)["']/g;

let match;
let hasError = false;

while ((match = titleRegex.exec(configContent)) !== null) {
  const title = match[1];
  if (title.length > 65) {
    console.error(`❌ ERRO: Title muito longo (${title.length} chars > 65): "${title}"`);
    hasError = true;
  } else if (title.length < 50) {
    console.warn(`⚠️ AVISO: Title curto (${title.length} chars < 50): "${title}"`);
  }
}

while ((match = descRegex.exec(configContent)) !== null) {
  const desc = match[1];
  if (desc.length > 158) {
    console.error(`❌ ERRO: Description muito longa (${desc.length} chars > 158): "${desc}"`);
    hasError = true;
  } else if (desc.length < 140) {
    console.warn(`⚠️ AVISO: Description curta (${desc.length} chars < 140): "${desc}"`);
  }
}

if (hasError) {
  console.error('\n🚨 Validação de SEO falhou. Corrija os tamanhos de title/description no seo.config.ts.');
  process.exit(1);
} else {
  console.log('✅ Validação de SEO passou com sucesso!');
}
