const fs = require('fs');
const file = 'app/globals.css';
let content = fs.readFileSync(file, 'utf8');

const replacement1 = `.dashboard-sidebar {
  background-color: var(--color-surface);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 260px;
  border-right: 1px solid color-mix(in srgb, var(--color-surface) 95%, black);
  position: relative;
}`;

content = content.replace(/\.dashboard-sidebar\s*\{\s*background-color:\s*rgba\(242,\s*242,\s*242,\s*0\.9\);\s*display:\s*flex;\s*flex-direction:\s*column;\s*flex-shrink:\s*0;\s*\}/g, replacement1);

const replacement2 = `.sidebar-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  height: 48px;
  border-radius: 14px;
  font: var(--sys-font-label-large);
  color: var(--sys-on-neutral-variant-role);
  transition: all 200ms ease;
  font-weight: 500;
  font-size: 15px;
  background: transparent;
  border: none;
  cursor: pointer;
  outline: none;
}
.sidebar-link svg {
  color: var(--sys-on-neutral-variant-role);
  opacity: 0.8;
  transition: all 200ms ease;
}

.sidebar-link:hover {
  background-color: var(--sys-primary-container-role);
  color: var(--sys-on-primary-container-role);
  transform: none;
}
.sidebar-link:hover svg {
  color: var(--color-brand);
  opacity: 1;
}

.sidebar-link.active {
  background-color: var(--color-brand);
  color: var(--sys-on-primary-color-role);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: all 250ms ease;
}
.sidebar-link.active svg {
  color: var(--sys-on-primary-color-role);
  opacity: 1;
}
/* Active indicator fixed to the far left of the sidebar container */
.sidebar-link.active::before {
  content: '';
  position: absolute;
  left: -16px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background-color: var(--color-brand);
  border-radius: 0 4px 4px 0;
}

/* Profile Card */
.sidebar-profile-card {
  background-color: var(--sys-primary-container-role);
  border-radius: 14px;
  padding: 12px;
  transition: all 200ms ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}
.sidebar-profile-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}`;

content = content.replace(/\.sidebar-link\s*\{[\s\S]*?\.sidebar-link\.active\s*\{[\s\S]*?\}/g, replacement2);

fs.writeFileSync(file, content);
console.log("Updated globals.css");
