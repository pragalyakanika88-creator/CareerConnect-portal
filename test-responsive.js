const fs = require('fs');
const path = require('path');

console.log("=== RUNNING RESPONSIVE DESIGN VERIFICATION TESTS ===");

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Check index.html viewport and elements
console.log("\n[Test 1: HTML Viewport & Mobile Elements]");
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

assert(
  htmlContent.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0">'),
  "Viewport meta tag with width=device-width and initial-scale=1.0 is present"
);

assert(
  htmlContent.includes('id="hamburger-btn"') && htmlContent.includes('aria-label="Toggle navigation menu"'),
  "Accessible hamburger button with id 'hamburger-btn' and aria-label is present in navbar"
);

assert(
  htmlContent.includes('id="nav-wrapper"') && htmlContent.includes('class="nav-wrapper"'),
  "Nav wrapper container with id 'nav-wrapper' is present"
);

assert(
  htmlContent.includes('id="nav-backdrop"'),
  "Nav backdrop overlay element is present"
);

// 2. Check CSS Media Queries
console.log("\n[Test 2: CSS Responsive Breakpoints & Rules]");
const cssContent = fs.readFileSync(path.join(__dirname, 'css', 'styles.css'), 'utf8');

assert(
  cssContent.includes('@media (min-width: 1024px)'),
  "Desktop/Laptop breakpoint (@media min-width: 1024px) defined"
);

assert(
  cssContent.includes('@media (min-width: 768px) and (max-width: 1023px)'),
  "Tablet breakpoint (@media min-width: 768px and max-width: 1023px) defined"
);

assert(
  cssContent.includes('@media (max-width: 767px)'),
  "Mobile breakpoint (@media max-width: 767px) defined"
);

assert(
  cssContent.includes('@media (max-width: 380px)'),
  "Small mobile breakpoint (@media max-width: 380px) defined"
);

assert(
  cssContent.includes('.hamburger-btn') && cssContent.includes('.hamburger-line'),
  "Hamburger button and animated lines styled in CSS"
);

assert(
  cssContent.includes('.comparison-scroll-wrapper') && cssContent.includes('.comparison-scroll-hint'),
  "Comparison table horizontal scroll wrapper and hint styled"
);

assert(
  cssContent.includes('overflow-x: hidden'),
  "Body overflow-x hidden set to prevent horizontal scrolling"
);

// 3. Check App.js navigation helpers
console.log("\n[Test 3: App.js Mobile Navigation Helpers]");
const appContent = fs.readFileSync(path.join(__dirname, 'js', 'app.js'), 'utf8');

assert(
  appContent.includes('toggleMobileNav') && appContent.includes('openMobileNav') && appContent.includes('closeMobileNav'),
  "App.js includes toggleMobileNav, openMobileNav, and closeMobileNav functions"
);

assert(
  appContent.includes('closeMobileNav()') && appContent.includes('function navigateTo'),
  "App.navigateTo automatically closes mobile navigation drawer"
);

assert(
  appContent.includes('Escape') && appContent.includes('closeMobileNav'),
  "Pressing Escape closes mobile navigation drawer"
);

// 4. Check Offline Integrity (No external URLs or CDNs)
console.log("\n[Test 4: Strict Offline Integrity]");
const forbiddenPatterns = ['http://', 'https://', 'googleapis', 'cdnjs', 'unpkg.com', 'cdn.jsdelivr'];
let foundForbidden = false;

[
  'index.html',
  'css/styles.css',
  'js/app.js',
  'js/comparison.js',
  'js/report.js',
  'js/storage.js',
  'js/recommendation-engine.js',
  'js/assistant.js'
].forEach(relPath => {
  const content = fs.readFileSync(path.join(__dirname, relPath), 'utf8');
  forbiddenPatterns.forEach(pattern => {
    if (content.includes(pattern)) {
      foundForbidden = true;
      console.error(`  Forbidden pattern '${pattern}' found in ${relPath}`);
    }
  });
});

assert(!foundForbidden, "Zero external network or CDN links detected across all project files");

console.log(`\n=== RESPONSIVE TEST SUMMARY: ${passed} of ${total} tests passed! ===\n`);
