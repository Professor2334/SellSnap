const fs = require('fs');
const path = require('path');

const rootDirs = [
  path.join(__dirname, 'app'),
  path.join(__dirname, 'components')
];

// Mapping pixels to rem/clamp
const getReplacement = (pxStr) => {
  const px = parseInt(pxStr, 10);
  if (isNaN(px)) return null;

  // Headings
  if (px === 64) return 'clamp(3rem, 5vw, 4rem)';
  if (px === 48) return 'clamp(2.25rem, 4vw, 3rem)';
  if (px === 40) return 'clamp(2rem, 3.5vw, 2.5rem)';
  if (px === 32) return 'clamp(1.5rem, 3vw, 2rem)';
  if (px === 24) return 'clamp(1.25rem, 2.5vw, 1.5rem)';
  if (px === 22) return 'clamp(1.125rem, 2vw, 1.375rem)';
  if (px === 20) return 'clamp(1rem, 2vw, 1.25rem)';
  if (px === 18) return 'clamp(1rem, 1.5vw, 1.125rem)';

  // Body text
  return `${px / 16}rem`;
};

const processFile = (filePath) => {
  if (filePath.includes('components\\emails') || filePath.includes('components/emails')) {
    return;
  }
  
  const ext = path.extname(filePath);
  if (!['.tsx', '.ts', '.css'].includes(ext)) {
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace React inline styles: fontSize: '14px' or fontSize: "14px"
  content = content.replace(/fontSize:\s*(['"])([0-9]+)px\1/g, (match, quote, pxStr) => {
    const replacement = getReplacement(pxStr);
    if (replacement) {
      return `fontSize: ${quote}${replacement}${quote}`;
    }
    return match;
  });

  // Replace CSS: font-size: 14px; or font-size: 14px
  content = content.replace(/font-size:\s*([0-9]+)px/g, (match, pxStr) => {
    const replacement = getReplacement(pxStr);
    if (replacement) {
      return `font-size: ${replacement}`;
    }
    return match;
  });

  // Replace tailwind-like arbitrary values if they exist e.g. text-[14px], though rule says no tailwind. Just in case.
  content = content.replace(/text-\[([0-9]+)px\]/g, (match, pxStr) => {
    const replacement = getReplacement(pxStr);
    if (replacement) {
      // Just replacing with the value is tricky in classNames. Let's ignore this since Tailwind is banned.
      return match;
    }
    return match;
  });

  if (content !== originalContent) {
    console.log(`Updated: ${filePath}`);
    fs.writeFileSync(filePath, content, 'utf8');
  }
};

const walkSync = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkSync(filePath);
    } else {
      processFile(filePath);
    }
  }
};

rootDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    walkSync(dir);
  } else {
    console.warn(`Directory not found: ${dir}`);
  }
});
console.log('Typography conversion complete.');
