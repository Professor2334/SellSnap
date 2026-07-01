const fs = require('fs');
const file = 'app/globals.css';
let content = fs.readFileSync(file, 'utf8');

const replacement1 = `.dashboard-sidebar {
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, var(--sys-primary-container-role) 50%, var(--color-surface)),
    color-mix(in srgb, var(--sys-primary-container-role) 20%, var(--color-surface))
  );
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 260px;
  border-right: none;
  box-shadow: 2px 0 16px rgba(0, 0, 0, 0.03);
  position: relative;
}`;

content = content.replace(/\.dashboard-sidebar\s*\{[\s\S]*?position:\s*relative;\s*\}/, replacement1);

fs.writeFileSync(file, content);
console.log('Updated background opacity');
