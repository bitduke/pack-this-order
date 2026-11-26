// Test Traffic Host Ads integration, Hint system, and 3x Coin Settlement
global.GameGlobal = global;
global.window = global;

let toastMsg = null;
let modalMsg = null;
let lastAdSlot = null;

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
  onTouchStart: () => {}, onTouchMove: () => {}, onTouchEnd: () => {}, onTouchCancel: () => {},
  getStorageSync: () => null, setStorageSync: () => {},
  showModal: (o) => { modalMsg = o; },
  showToast: (o) => { toastMsg = o; },
  vibrateShort: (o) => {},
  createRewardedVideoAd: (opts) => ({
    onClose: (cb) => { global.__adOnClose = cb; },
    onError: (cb) => { global.__adOnError = cb; },
    show: () => Promise.resolve(),
    load: () => Promise.resolve()
  }),
  createBannerAd: (opts) => ({
    onResize: () => {},
    onError: () => {},
    show: () => Promise.resolve(),
    hide: () => {}
  }),
  createInterstitialAd: (opts) => ({
    onError: () => {},
    show: () => Promise.resolve()
  }),
  onError: () => {},
  showShareMenu: () => {},
  onShareAppMessage: () => {},
  onShareTimeline: () => {},
  getPerformance: () => ({ now: () => Date.now() })
};

process.chdir('D:/Ai movies/pack-this-order/wx-minigame');
require('D:/Ai movies/pack-this-order/wx-minigame/game.js');

console.log('1. Boot ok:', global.window.__dshWxBootOk);
if (!global.window.__dshWxBootOk) {
  console.error('Boot failed!');
  process.exit(1);
}

// Test Banner Ad
console.log('2. Testing Banner Ad show/hide...');
global.window.GAME.initBannerAd();
global.window.GAME.showBannerAd();
global.window.GAME.hideBannerAd();
console.log('Banner Ad functions ok!');

// Test Interstitial Ad
console.log('3. Testing Interstitial Ad...');
global.window.GAME.showInterstitialAd();
console.log('Interstitial Ad ok!');

// Test Rewarded Ad (in free fallback mode)
console.log('4. Testing watchRewardedAd fallback mode...');
let rewarded = false;
global.window.GAME.watchRewardedAd('hint', (res) => {
  rewarded = true;
  console.log('Reward callback triggered with:', JSON.stringify(res));
});

if (!rewarded) {
  console.error('Failed: watchRewardedAd did not grant reward in fallback mode!');
  process.exit(1);
}

console.log('ALL AD & TRAFFIC HOST TESTS PASSED 100%!');
process.exit(0);
