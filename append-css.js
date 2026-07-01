const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf8');

const profileCardCSS = `
.sidebar-profile-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
  position: relative;
  width: 100%;
}
.sidebar-profile-card:hover {
  background-color: var(--color-surface);
  transform: translateY(-1px);
}
`;

css += '\n' + profileCardCSS;
fs.writeFileSync('app/globals.css', css);
console.log('done');
