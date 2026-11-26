const fs = require('fs');
const content = fs.readFileSync('D:/Ai movies/pack-this-order/game.js', 'utf8');

// 1. Check English in label() calls
const labelRegex = /label\(([^)]+)\)/g;
let m;
const englishStrings = [];
while ((m = labelRegex.exec(content)) !== null) {
  const arg = m[1].split(',')[0].trim();
  if (/[a-zA-Z]{3,}/.test(arg)) {
    englishStrings.push(arg);
  }
}
console.log('1. Labels with English words >= 3 chars:', englishStrings);

// 2. Check all buttons in geometry() that have x >= 280 and y <= 90 (capsule collision area)
// Capsule area in WeChat is roughly x: 290..390, y: 0..88 (in screen pixels).
console.log('2. Auditing button placements...');
