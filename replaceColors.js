const fs = require('fs');
const path = require('path');

const targetDirs = [
  'C:/laragon/www/umkm-frontend-main/src/pages',
  'C:/laragon/www/umkm-frontend-main/src/components/chat'
];

const colorMap = {
  '#f4f8f5': 'var(--color-bg)',
  '#ffffff': 'var(--color-bg-card)',
  '#006633': 'var(--color-primary)',
  '#339933': 'var(--color-secondary)',
  '#2c3e34': 'var(--color-text-primary)',
  '#1a2a22': 'var(--color-text-primary)',
  '#6a7c72': 'var(--color-text-muted)',
  '#557060': 'var(--color-text-secondary)',
  '#7a9485': 'var(--color-text-muted)',
  '#eef5f1': 'var(--color-primary-bg)',
  '#d64545': 'var(--color-danger)',
  '#eb5b5b': 'var(--color-danger)',
  '#e1ece7': 'var(--color-border-light)',
  '#fbfcfa': 'var(--color-bg)'
};

function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(file));
      } else {
        if (file.endsWith('.module.css')) results.push(file);
      }
    });
  } catch (err) {
    console.error(err);
  }
  return results;
}

let allFiles = [];
targetDirs.forEach(d => {
  allFiles = allFiles.concat(walk(d));
});

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  for (const [hex, variable] of Object.entries(colorMap)) {
    const regex = new RegExp(hex, 'gi');
    content = content.replace(regex, variable);
  }
  
  content = content.replace(/rgba\(0,\s*102,\s*51/g, 'rgba(0,102,51');
  content = content.replace(/rgba\(0,102,51,\s*0\.15\)/g, 'var(--shadow-md)');
  content = content.replace(/rgba\(0,102,51,\s*0\.05\)/g, 'var(--color-border)');
  content = content.replace(/rgba\(0,102,51,\s*0\.1[^\)]*\)/g, 'var(--color-border)');
  content = content.replace(/rgba\(0,102,51,\s*0\.0[^\)]*\)/g, 'var(--color-border-light)');
  content = content.replace(/rgba\(51,\s*153,\s*51/g, 'rgba(51,153,51');
  content = content.replace(/rgba\(51,153,51,\s*0\.2[^\)]*\)/g, 'var(--color-border)');
  content = content.replace(/rgba\(51,153,51,\s*0\.1[^\)]*\)/g, 'var(--color-primary-bg)');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
});
