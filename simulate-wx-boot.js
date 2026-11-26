// Simulate WeChat Mini Game runtime environment precisely
global.GameGlobal = global;
global.window = global;

// Mock wx API
global.wx = {
  createCanvas: () => {
    const canvas = {
      width: 375,
      height: 667,
      getContext: (type) => {
        if (type !== '2d') return null;
        return {
          save: () => {},
          restore: () => {},
          beginPath: () => {},
          closePath: () => {},
          moveTo: () => {},
          lineTo: () => {},
          arc: () => {},
          rect: () => {},
          fillRect: () => {},
          strokeRect: () => {},
          clearRect: () => {},
          fill: () => {},
          stroke: () => {},
          scale: () => {},
          translate: () => {},
          rotate: () => {},
          transform: () => {},
          setTransform: () => {},
          resetTransform: () => {},
          clip: () => {},
          createLinearGradient: () => ({ addColorStop: () => {} }),
          createRadialGradient: () => ({ addColorStop: () => {} }),
          createPattern: () => ({}),
          drawImage: () => {},
          getImageData: () => ({ data: [] }),
          putImageData: () => {},
          measureText: (t) => ({ width: (t || '').length * 10 }),
          fillText: () => {},
          strokeText: () => {},
          setLineDash: () => {},
          getLineDash: () => [],
          bezierCurveTo: () => {},
          quadraticCurveTo: () => {},
          // Note: WeChat Canvas 2D DOES NOT have ctx.ellipse or ctx.roundRect natively on some versions!
        };
      },
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 375, height: 667, right: 375, bottom: 667 })
    };
    return canvas;
  },
  getSystemInfoSync: () => ({
    windowWidth: 390,
    windowHeight: 844,
    screenWidth: 390,
    screenHeight: 844,
    pixelRatio: 3,
    statusBarHeight: 47,
    platform: 'ios',
    safeArea: { top: 47, bottom: 810, left: 0, right: 390, width: 390, height: 763 }
  }),
  getWindowInfo: () => ({
    windowWidth: 390,
    windowHeight: 844,
    screenWidth: 390,
    screenHeight: 844,
    pixelRatio: 3,
    statusBarHeight: 47,
    safeArea: { top: 47, bottom: 810, left: 0, right: 390, width: 390, height: 763 }
  }),
  getMenuButtonBoundingClientRect: () => ({
    top: 54,
    bottom: 86,
    left: 295,
    right: 382,
    width: 87,
    height: 32
  }),
  onTouchStart: () => {},
  onTouchMove: () => {},
  onTouchEnd: () => {},
  onTouchCancel: () => {},
  getStorageSync: (k) => null,
  setStorageSync: (k, v) => {},
  removeStorageSync: () => {},
  clearStorageSync: () => {},
  showModal: (opts) => {
    console.log('>>> wx.showModal called:', JSON.stringify(opts));
  },
  showToast: (opts) => {
    console.log('>>> wx.showToast called:', JSON.stringify(opts));
  },
  onError: (fn) => {
    global.__onError = fn;
  },
  createRewardedVideoAd: () => null,
  showShareMenu: () => {},
  onShareAppMessage: () => {},
  onShareTimeline: () => {},
  getPerformance: () => ({ now: () => Date.now() })
};

console.log('--- STARTING BOOT SIMULATION ---');
try {
  process.chdir('D:/Ai movies/pack-this-order/wx-minigame');
  require('D:/Ai movies/pack-this-order/wx-minigame/game.js');
  console.log('require(game.js) returned successfully!');
  console.log('win.__dshWxBootOk:', global.window.__dshWxBootOk);
} catch (err) {
  console.error('require(game.js) THREW EXCEPTION:', err);
}
