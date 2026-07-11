const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf8');

const targetRegex = /\/\* Mobile drawer \*\/[\s\S]*?\.landing-nav-mobile-drawer-actions \{[\s\S]*?\}/;

const replacement = `/* Mobile toggle animation */
.landing-nav-toggle-icon-wrapper {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.landing-nav-icon-menu,
.landing-nav-icon-close {
  position: absolute;
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.landing-nav-mobile-toggle .landing-nav-icon-close {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}
.landing-nav-mobile-toggle.open .landing-nav-icon-menu {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}
.landing-nav-mobile-toggle.open .landing-nav-icon-close {
  opacity: 1;
  transform: rotate(0) scale(1);
}

/* Mobile drawer */
.landing-nav-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: -1;
  animation: hero-fade-in 200ms ease-out forwards;
}

.landing-nav-mobile-drawer {
  position: absolute;
  top: calc(100% + 8px);
  left: 16px;
  right: 16px;
  width: auto;
  display: flex;
  flex-direction: column;
  padding: 32px 24px 24px;
  background: color-mix(in srgb, var(--color-surface) 60%, transparent);
  backdrop-filter: saturate(200%) blur(24px);
  -webkit-backdrop-filter: saturate(200%) blur(24px);
  border: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
  border-radius: 24px;
  box-shadow: var(--sys-elevation-level3), inset 0 1px 2px color-mix(in srgb, var(--color-surface) 90%, transparent);
  transform-origin: top;
  animation: mobile-drawer-enter 250ms ease-out forwards;
  pointer-events: auto;
}

@keyframes mobile-drawer-enter {
  from { opacity: 0; transform: scale(0.96) translateY(-8px); backdrop-filter: blur(0px); -webkit-backdrop-filter: blur(0px); }
  to { opacity: 1; transform: scale(1) translateY(0); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
}

.landing-nav-mobile-drawer .landing-nav-link {
  font-size: 1.125rem;
  font-weight: 600;
  padding: 12px 16px;
  margin-bottom: 4px;
  color: var(--color-ink);
  border-radius: 8px;
}

.landing-nav-mobile-drawer .landing-nav-link:hover {
  background-color: var(--color-surface);
}

.landing-nav-mobile-drawer-actions {
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  padding-top: 24px;
  border-top: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
}`;

if (targetRegex.test(css)) {
  css = css.replace(targetRegex, replacement);
  
  // also remove the old extra stuff just in case
  css = css.replace(/\.landing-nav-mobile-drawer-actions \.landing-nav-signin \{[\s\S]*?\}/, '');
  
  fs.writeFileSync('app/globals.css', css);
  console.log('SUCCESS');
} else {
  console.log('FAILED TO MATCH DRAWER');
}
