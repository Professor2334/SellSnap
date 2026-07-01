const fs = require('fs');

let css = fs.readFileSync('app/globals.css', 'utf8');

css = css.replace(
  /\.card-stat\s*\{[\s\S]*?opacity:\s*0\.9;\r?\n\}/g,
  '.card-stat {\n  background-color: var(--sys-neutral-container-lowest);\n  border: none;\n  border-radius: 12px;\n  padding: 20px 22px 45px;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);\n}'
);

css = css.replace(
  /\.card-container\s*\{[\s\S]*?border-radius:\s*12px;\r?\n\}/g,
  '.card-container {\n  background-color: var(--sys-neutral-container-lowest);\n  border: none;\n  border-radius: 12px;\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);\n}'
);

css = css.replace(
  /\.stat-card\s*\{[\s\S]*?opacity:\s*0\.9;\r?\n\}/g,
  '.stat-card {\n  background-color: var(--sys-neutral-container-lowest);\n  border: none;\n  border-radius: 11px;\n  padding: 20px;\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);\n}'
);

css = css.replace(
  /\.dashboard-sidebar\s*\{[\s\S]*?position:\s*relative;\r?\n\}/g,
  '.dashboard-sidebar {\n  background-color: var(--sys-neutral-container-lowest);\n  display: flex;\n  flex-direction: column;\n  flex-shrink: 0;\n  width: 260px;\n  border-right: none;\n  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.03);\n  position: relative;\n}'
);

fs.writeFileSync('app/globals.css', css);
console.log('done');
