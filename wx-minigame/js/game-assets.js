/* Auto-generated WeChat WASubContext sandbox bridge — edit root game.js instead */
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
var requestAnimationFrame = function (cb) { return (__wxRoot.requestAnimationFrame || window.requestAnimationFrame).call(window, cb); };
var cancelAnimationFrame = function (id) { return (__wxRoot.cancelAnimationFrame || window.cancelAnimationFrame).call(window, id); };

window.GAME = Object.assign(window.GAME || {}, {
  "title": "这单怎么装？",
  "rules": {},
  "slots": {
    "hero": {
      "tile": false,
      "custom": false
    },
    "pickup": {
      "tile": false,
      "custom": false
    },
    "background": {
      "tile": true,
      "custom": false
    },
    "fries": {
      "tile": false,
      "custom": false
    },
    "rings": {
      "tile": false,
      "custom": false
    },
    "sandwich": {
      "tile": false,
      "custom": false
    }
  },
  "assets": {
    "hero": "images/hero.png",
    "pickup": "images/pickup.png",
    "background": "images/background.png",
    "fries": "images/fries.png",
    "rings": "images/rings.png",
    "sandwich": "images/sandwich.png"
  }
});
__wxRoot.GAME = window.GAME;
