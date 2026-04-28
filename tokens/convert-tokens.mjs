import fs from 'fs';

const JSON_PATH = 'design-tokens.tokens.json';
const OUTPUT_PATH = 'tokens.css';

if (!fs.existsSync(JSON_PATH)) {
  console.error(`Error: ${JSON_PATH} not found.`);
  process.exit(1);
}

const tokens = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

let css = '/* Design Tokens - Generated */\n\n:root {\n';

// Helper to sanitize names: lowercase and replace spaces with hyphens
const sanitize = (name) => name.toLowerCase().trim().replace(/\s+/g, '-');

console.log('Processing primitive colors...');

// 1. Primitive Color Collections
if (tokens['primitive color collections']) {
  const collections = tokens['primitive color collections'];
  
  // Palettes
  if (collections['color palettes']) {
    css += '  /* Primitives - Palettes */\n';
    for (const [paletteName, colors] of Object.entries(collections['color palettes'])) {
      for (const [colorName, colorData] of Object.entries(colors)) {
        if (colorData.value) {
          css += `  --primitive-${sanitize(colorName)}: ${colorData.value};\n`;
        }
      }
    }
  }
  
  // Key Colors
  if (collections['key group color']) {
    css += '\n  /* Primitives - Key Colors */\n';
    for (const [keyName, keyData] of Object.entries(collections['key group color'])) {
      if (keyData.value) {
        css += `  --primitive-${sanitize(keyName)}: ${keyData.value};\n`;
      }
    }
  }
}

console.log('Processing system color roles...');

// 2. Color Roles (System Tokens)
if (tokens['color roles']) {
  css += '\n  /* System Tokens - Color Roles */\n';
  for (const [roleGroupName, roles] of Object.entries(tokens['color roles'])) {
    for (const [roleName, roleData] of Object.entries(roles)) {
      let value = roleData.value;
      
      // Resolve aliases: {path.to.token} -> var(--primitive-token)
      if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
        const path = value.slice(1, -1).split('.');
        const lastPart = path[path.length - 1];
        value = `var(--primitive-${sanitize(lastPart)})`;
      }
      
      css += `  --sys-${sanitize(roleName)}: ${value};\n`;
    }
  }
}

console.log('Processing system typography...');

// 3. Typography (System Tokens)
// We use the 'font' section for structured font styles
if (tokens['font']) {
  css += '\n  /* System Tokens - Typography */\n';
  for (const [category, styles] of Object.entries(tokens['font'])) {
    for (const [styleName, styleData] of Object.entries(styles)) {
      const baseName = `--sys-font-${sanitize(styleName)}`;
      const val = styleData.value;
      
      if (val) {
        css += `  ${baseName}-size: ${val.fontSize}px;\n`;
        css += `  ${baseName}-weight: ${val.fontWeight};\n`;
        css += `  ${baseName}-family: '${val.fontFamily}', sans-serif;\n`;
        css += `  ${baseName}-line-height: ${val.lineHeight}px;\n`;
        css += `  ${baseName}-letter-spacing: ${val.letterSpacing}px;\n`;
        // Combined shorthand for utility
        css += `  ${baseName}: ${val.fontWeight} ${val.fontSize}px/${val.lineHeight}px '${val.fontFamily}', sans-serif;\n`;
      }
    }
  }
}

css += '}\n';

fs.writeFileSync(OUTPUT_PATH, css);
console.log(`\nSuccessfully converted tokens to ${OUTPUT_PATH}`);
