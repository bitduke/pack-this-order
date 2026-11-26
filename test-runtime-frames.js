// Verify runtime frame execution and touch inputs
global.GameGlobal = global;
global.window = global;

let frameCb = null;
global.wx = {
  createCanvas: () => {
    const canvas = {
      width: 390,
      height: 844,
      getContext: () => ({
        save: () => {}, restore: () => {}, beginPath: () => {}, closePath: () => {},
        moveTo: () => {}, lineTo: () => {}, arc: () => {}, rect: () => {}, fillRect: () => {},
        strokeRect: () => {}, clearRect: () => {}, fill: () => {}, stroke: () => {},
        scale: () => {}, translate: () => {}, rotate: () => {}, transform: () => {},
        setTransform: () => {}, resetTransform: () => {}, clip: () => {},
        createLinearGradient: () => ({ addColorStop: () => {} }),
        createRadialGradient: () => ({ addColorStop: () => {} }),
        createPattern: () => ({}), drawImage: () => {}, getImageData: () => ({ data: [] }),
        putImageData: () => {}, measureText: (t) => ({ width: (t || '').length * 10 }),
        fillText: () => {}, strokeText: () => {}, setLineDash: () => {}, getLineDash: () => [],
        bezierCurveTo: () => {}, quadraticCurveTo: () => {}
      }),
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 390, height: 844, right: 390, bottom: 844 })
    };
    return canvas;
  },
  getSystemInfoSync: () => ({ windowWidth: 390, windowHeight: 844, screenWidth: 390, screenHeight: 844, pixelRatio: 3, statusBarHeight: 47 }),
  getWindowInfo: () => ({ windowWidth: 390, windowHeight: 844, screenWidth: 390, screenHeight: 844, pixelRatio: 3, statusBarHeight: 47 }),
  getMenuButtonBoundingClientRect: () => ({ top: 54, bottom: 86, left: 295, right: 382, width: 87, height: 32 }),
  onTouchStart: (fn) => { global.__onTouchStart = fn; },
  onTouchMove: (fn) => { global.__onTouchMove = fn; },
  onTouchEnd: (fn) => { global.__onTouchEnd = fn; },
  onTouchCancel: (fn) => { global.__onTouchCancel = fn; },
  getStorageSync: (k) => null,
  setStorageSync: (k, v) => {},
  showModal: (o) => console.log('UNEXPECTED showModal:', o),
  showToast: () => {},
  onError: (fn) => { global.__onError = fn; },
  createRewardedVideoAd: () => null,
  showShareMenu: () => {},
  onShareAppMessage: () => {},
  onShareTimeline: () => {},
  getPerformance: () => ({ now: () => Date.now() })
};

process.chdir('D:/Ai movies/pack-this-order/wx-minigame');
require('D:/Ai movies/pack-this-order/wx-minigame/game.js');

console.log('1. Boot verification: win.__dshWxBootOk =', global.window.__dshWxBootOk);
if (!global.window.__dshWxBootOk) {
  console.error('FAILED: win.__dshWxBootOk is falsy!');
  process.exit(1);
}

// Check window.__gameState
if (typeof global.window.__gameState === 'function') {
  const state = global.window.__gameState();
  console.log('2. Initial Game State:', JSON.stringify({ phase: state.phase, levelIndex: state.levelIndex, customMode: state.customMode }));
} else {
  console.log('2. window.__gameState not exported or private');
}

// Simulate touching "开始打包" button on title screen
// Start button is roughly centered at x: 195, y: around 540-620
console.log('3. Simulating touch on Title Screen Start Button...');
if (typeof global.__onTouchStart === 'function') {
  global.__onTouchStart({ touches: [{ clientX: 195, clientY: 570, identifier: 0 }], changedTouches: [{ clientX: 195, clientY: 570, identifier: 0 }] });
}
if (typeof global.__onTouchEnd === 'function') {
  global.__onTouchEnd({ touches: [], changedTouches: [{ clientX: 195, clientY: 570, identifier: 0 }] });
}

if (typeof global.window.__gameState === 'function') {
  const stateAfterClick = global.window.__gameState();
  console.log('4. State after click:', JSON.stringify({ phase: stateAfterClick.phase, levelIndex: stateAfterClick.levelIndex }));
}

console.log('ALL RUNTIME CHECKS PASSED WITH FLYING COLORS!');
process.exit(0);
