const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf8');

const regex = /@keyframes hc-float \{[\s\S]*?\/\* ── Left column ── \*\//;

const replacement = `@keyframes hc-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}
@keyframes hc-breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}
@keyframes hc-slide-up {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes hc-fade-in-right {
  0% { opacity: 0; transform: translateX(20px); }
  100% { opacity: 1; transform: translateX(0); }
}

.hero-v2 {
  padding: 88px 0 80px;
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
}
@media (min-width: 768px) {
  .hero-v2 { padding: 196px 0 96px; }
}

.hero-v2-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 56px;
  align-items: center;
}
@media (min-width: 768px) {
  .hero-v2-container { padding: 0 28px; }
}
@media (min-width: 1024px) {
  .hero-v2-container {
    padding: 0 38px;
    grid-template-columns: 47fr 53fr;
    gap: 48px;
  }
}

/* ── Left column ── */`;

if (regex.test(css)) {
  css = css.replace(regex, replacement);
  fs.writeFileSync('app/globals.css', css);
  console.log('SUCCESS');
} else {
  console.log('FAILED');
}
