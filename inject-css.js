const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf8');

const insert = `/* Dashboard content wrapper */
.dashboard-content-wrapper {
  width: 100%;
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
}

@media (min-width: 1280px) {
  .dashboard-content-wrapper {
    padding: 40px 32px;
  }
}

/* Elevated page header card */
.dashboard-page-header {
  background-color: var(--sys-neutral-container-lowest);
  border-radius: 20px;
  padding: 24px 28px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

`;

css = css.replace('/* Dashboard specific */', insert + '/* Dashboard specific */');
fs.writeFileSync('app/globals.css', css);
console.log('done');
