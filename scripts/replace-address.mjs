import fs from 'fs';
import path from 'path';

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.html') || file.endsWith('.md')) {
             results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

walk('./src', function(err, results) {
  if (err) throw err;
  results.push(path.resolve('./index.html'));
  results.push(path.resolve('./README.md'));
  
  for (const file of results) {
    try {
      let content = fs.readFileSync(file, 'utf8');
      
      if (content.includes('SQN 513') || content.includes('70763-510')) {
        content = content.replace(/SQN 513[^,]+,\s*Edifício Bittar 1,\s*Sala 110\s*–\s*Asa Norte,\s*Brasília\s*-\s*DF(?:,\s*70763-510)?/gi, 'SEPN 513, Edifício Bittar I, Sala 110 — Asa Norte, Brasília - DF, 70768-900');
        content = content.replace(/SQN 513 Bloco A, Edifício Bittar 1, Sala 110/gi, 'SEPN 513, Edifício Bittar I, Sala 110');
        content = content.replace(/SQN 513 Bloco A, Sala 110 – Asa Norte, Brasília - DF/gi, 'SEPN 513, Edifício Bittar I, Sala 110 — Asa Norte, Brasília - DF');
        content = content.replace(/SQN 513 Bloco A, Sala 110 – Asa Norte, Brasília/gi, 'SEPN 513, Edifício Bittar I, Sala 110 — Asa Norte, Brasília');
        content = content.replace(/SQN 513 Bloco A Edifício Bittar 1 Asa Norte Brasília DF/gi, 'SEPN 513 Edifício Bittar I Asa Norte Brasília DF');
        content = content.replace(/Asa Norte \(SQN 513\)/g, 'Asa Norte (SEPN 513)');
        content = content.replace(/SQN 513/g, 'SEPN 513');
        content = content.replace(/70763-510/g, '70768-900');
        
        fs.writeFileSync(file, content);
        console.log('Updated', file);
      }
    } catch(e) {}
  }
});
