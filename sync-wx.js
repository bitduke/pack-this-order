const fs = require('fs');

const gameJs = fs.readFileSync('D:/Ai movies/pack-this-order/game.js', 'utf8');

// 1. Sync to wx-minigame/js/core-game.js
const bridgeHeader = `/* Auto-generated WeChat WASubContext sandbox bridge — edit root game.js instead */
var __wxRoot = (typeof GameGlobal !== "undefined") ? GameGlobal : ((typeof globalThis !== "undefined") ? globalThis : this);
var window = __wxRoot.window || __wxRoot;
var self = __wxRoot.self || window;
var document = __wxRoot.document;
var navigator = __wxRoot.navigator;
var performance = __wxRoot.performance;
var localStorage = __wxRoot.__wxStorage;
try { if (!localStorage) localStorage = __wxRoot.localStorage; } catch (_e) {}
var Image = __wxRoot.Image;
var AudioContext = __wxRoot.AudioContext || window.AudioContext;
var webkitAudioContext = __wxRoot.webkitAudioContext || window.webkitAudioContext || AudioContext;
var HTMLCanvasElement = __wxRoot.HTMLCanvasElement;
var FinalizationRegistry = __wxRoot.FinalizationRegistry;
var CustomEvent = __wxRoot.CustomEvent;
var Path2D = __wxRoot.Path2D || window.Path2D;
var requestAnimationFrame = function (cb) { return (__wxRoot.requestAnimationFrame || window.requestAnimationFrame).call(window, cb); };
var cancelAnimationFrame = function (id) { return (__wxRoot.cancelAnimationFrame || window.cancelAnimationFrame).call(window, id); };
`;

fs.writeFileSync('D:/Ai movies/pack-this-order/wx-minigame/js/core-game.js', bridgeHeader + gameJs, 'utf8');
console.log('1. wx-minigame/js/core-game.js synced successfully!');

// 2. Sync to dist/index.html
const html = fs.readFileSync('D:/Ai movies/pack-this-order/dist/index.html', 'utf8');
const scriptTag = '<script>(() => {';
const splitIdx = html.indexOf(scriptTag);
if (splitIdx === -1) {
  console.error('Could not find script tag in dist/index.html');
} else {
  const headPart = html.slice(0, splitIdx + '<script>'.length);
  const newHtml = headPart + gameJs + '\n\n</script>\n</body></html>\n';
  fs.writeFileSync('D:/Ai movies/pack-this-order/dist/index.html', newHtml, 'utf8');
  console.log('2. dist/index.html synced successfully!');
}
