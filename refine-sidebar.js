const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf8');

// 1. Sidebar shell
css = css.replace(
  `/* Sidebar */\r\n.dashboard-sidebar {\r\n  background-color: var(--sys-neutral-container-lowest);\r\n  display: flex;\r\n  flex-direction: column;\r\n  flex-shrink: 0;\r\n  width: 260px;\r\n  border-right: none;\r\n  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.03);\r\n  position: relative;\r\n}`,
  `/* Sidebar */\n.dashboard-sidebar {\n  background-color: var(--sys-neutral-container-lowest);\n  display: flex;\n  flex-direction: column;\n  flex-shrink: 0;\n  width: 260px;\n  border-right: none;\n  box-shadow: 4px 0 32px rgba(0, 0, 0, 0.04), 1px 0 0 rgba(0, 0, 0, 0.03);\n  position: relative;\n  z-index: 10;\n}`
);

// 2. Sidebar nav link
css = css.replace(
  `/* Sidebar nav */\r\n.sidebar-link {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 12px;\r\n  padding: 12px 16px;\r\n  border-radius: 8px;\r\n  font: var(--sys-font-label-large);\r\n  color: var(--sys-on-neutral-color-role);\r\n  transition: all 0.2s ease;\r\n  font-weight: 500;\r\n  font-size: 14px;\r\n  background: transparent;\r\n  border: none;\r\n  cursor: pointer;\r\n  outline: none;\r\n}\r\n\r\n.sidebar-link:hover {\r\n  background-color: var(--primitive-primary95);\r\n  color: var(--color-brand);\r\n  transform: none;\r\n}\r\n\r\n.sidebar-link.active {\r\n  background-color: var(--color-brand);\r\n  color: var(--sys-on-primary-color-role);\r\n  font-weight: 600;\r\n}`,
  `/* Sidebar nav */\n.sidebar-link {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 0 14px;\n  min-height: 48px;\n  border-radius: 14px;\n  font-size: 14px;\n  font-weight: 500;\n  font-family: inherit;\n  color: var(--sys-on-neutral-color-role);\n  transition: background-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;\n  background: transparent;\n  border: none;\n  cursor: pointer;\n  outline: none;\n  text-decoration: none;\n  width: 100%;\n  box-sizing: border-box;\n}\n\n.sidebar-link:hover {\n  background-color: var(--primitive-neutral98);\n  color: var(--color-ink);\n}\n\n.sidebar-link.active {\n  background-color: var(--color-brand);\n  color: var(--sys-on-primary-color-role);\n  font-weight: 600;\n  box-shadow: 0 4px 12px rgba(0, 60, 230, 0.22), 0 1px 3px rgba(0, 60, 230, 0.14);\n}`
);

// 3. Sidebar link icon
css = css.replace(
  `.sidebar-link .icon {\r\n  font-size: 20px;\r\n  line-height: 1;\r\n}`,
  `.sidebar-link .icon {\n  width: 20px;\n  height: 20px;\n  flex-shrink: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}`
);

fs.writeFileSync('app/globals.css', css);
console.log('done');
