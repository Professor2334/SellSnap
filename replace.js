const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf8');

const targetRegex = /\.landing-nav \{[\s\S]*?\.landing-nav--scrolled \.landing-nav-inner \{[\s\S]*?\}\r?\n\}/;

const replacement = `.landing-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  pointer-events: none; /* Let clicks pass through the wrapper */
}

.landing-nav-inner {
  pointer-events: auto; /* Re-enable clicks on the pill itself */
  max-width: 1280px;
  margin: 16px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: color-mix(in srgb, var(--color-surface) 60%, transparent);
  backdrop-filter: saturate(200%) blur(24px);
  -webkit-backdrop-filter: saturate(200%) blur(24px);
  border: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
  border-radius: var(--sys-radius-full);
  box-shadow: var(--sys-elevation-level2), inset 0 1px 2px color-mix(in srgb, var(--color-surface) 90%, transparent);
  transition: var(--sys-transition-base);
}

.landing-nav--scrolled .landing-nav-inner {
  background: color-mix(in srgb, var(--color-surface) 75%, transparent);
  backdrop-filter: saturate(200%) blur(32px);
  -webkit-backdrop-filter: saturate(200%) blur(32px);
  border: 1px solid color-mix(in srgb, var(--color-border) 80%, transparent);
  box-shadow: var(--sys-elevation-level3), inset 0 1px 2px var(--color-surface);
}

@media (min-width: 768px) {
  .landing-nav-inner { 
    margin: 16px 28px;
    padding: 14px 24px; 
  }
}

@media (min-width: 1024px) {
  .landing-nav-inner {
    margin: 20px auto;
    padding: 16px 32px;
  }
}`;

if (targetRegex.test(css)) {
  css = css.replace(targetRegex, replacement);
  // Also remove .landing-nav--scrolled {} block entirely
  css = css.replace(/\.landing-nav--scrolled \{[\s\S]*?box-shadow:[^\}]+\}/, '');
  fs.writeFileSync('app/globals.css', css);
  console.log('SUCCESS');
} else {
  console.log('FAILED TO MATCH');
}
