const fs = require('fs');
const file = 'app/globals.css';
let content = fs.readFileSync(file, 'utf8');

const replacement1 = `.dashboard-sidebar {
  background: linear-gradient(
    to bottom,
    var(--sys-primary-container-role),
    color-mix(in srgb, var(--sys-primary-container-role) 40%, var(--color-surface))
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

const replacement2 = `.sidebar-profile-card {
  background-color: var(--color-surface);
  border-radius: 14px;
  padding: 12px;
  transition: all 200ms ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}`;

content = content.replace(/\.sidebar-profile-card\s*\{\s*background-color:\s*var\(--sys-primary-container-role\);[\s\S]*?position:\s*relative;\s*\}/, replacement2);

fs.writeFileSync(file, content);
console.log('Updated background');
