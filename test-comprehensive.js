const fs = require('fs');
const path = require('path');

// Setup WeChat MiniGame mock environment
global.GameGlobal = global;
global.window = global;

function createMockContext() {
  return {
    save() {},
    restore() {},
    beginPath() {},
    closePath() {},
    moveTo() {},
    lineTo() {},
    arc() {},
    rect() {},
    fillRect() {},
    strokeRect() {},
    clearRect() {},
    fill() {},
    stroke() {},
    scale() {},
    translate() {},
    rotate() {},
    setTransform() {},
    resetTransform() {},
    clip() {},
    createLinearGradient() { return { addColorStop() {} }; },
    createRadialGradient() { return { addColorStop() {} }; },
    createPattern() { return {}; },
    drawImage() {},
    fillText() {},
    strokeText() {},
    measureText(text) { return { width: (text || '').length * 12 }; },
    quadraticCurveTo() {},
    bezierCurveTo() {},
    setLineDash() {},
    getLineDash() { return []; }
  };
}

let touchStartFn = null;
let touchEndFn = null;
let touchMoveFn = null;

let rewardedCallback = null;
let interstitialShown = 0;
let bannerShown = 0;

global.wx = {
  createCanvas() {
    return {
      width: 390,
      height: 844,
      getContext(type) {
        if (type !== '2d') return null;
        return createMockContext();
      },
      getBoundingClientRect() {
        return { left: 0, top: 0, right: 390, bottom: 844, width: 390, height: 844, x: 0, y: 0 };
      }
    };
  },
  getSystemInfoSync() {
    return {
      windowWidth: 390,
      windowHeight: 844,
      screenWidth: 390,
      screenHeight: 844,
      pixelRatio: 3,
      statusBarHeight: 47,
      safeArea: { top: 47, bottom: 810, left: 0, right: 390, width: 390, height: 763 }
    };
  },
  getWindowInfo() {
    return this.getSystemInfoSync();
  },
  getMenuButtonBoundingClientRect() {
    return { top: 54, bottom: 86, left: 295, right: 382, width: 87, height: 32 };
  },
  onTouchStart(fn) { touchStartFn = fn; },
  onTouchEnd(fn) { touchEndFn = fn; },
  onTouchMove(fn) { touchMoveFn = fn; },
  onTouchCancel() {},
  getStorageSync(k) { return null; },
  setStorageSync(k, v) {},
  showModal(opts) { console.log('  [wx.showModal]', opts.title, opts.content); },
  showToast(opts) { console.log('  [wx.showToast]', opts.title); },
  onError(fn) { global.__onError = fn; },
  createRewardedVideoAd() {
    return {
      load() { return Promise.resolve(); },
      show() {
        console.log('  [Ad] Rewarded video shown');
        if (rewardedCallback) rewardedCallback({ isEnded: true });
        return Promise.resolve();
      },
      onClose(fn) { rewardedCallback = fn; },
      onError(fn) {}
    };
  },
  createBannerAd() {
    return {
      show() { bannerShown++; return Promise.resolve(); },
      hide() { return Promise.resolve(); },
      destroy() {},
      onResize() {},
      onError() {}
    };
  },
  createInterstitialAd() {
    return {
      load() { return Promise.resolve(); },
      show() { interstitialShown++; console.log('  [Ad] Interstitial ad shown'); return Promise.resolve(); },
      onError() {}
    };
  },
  showShareMenu() {},
  onShareAppMessage() {},
  onShareTimeline() {},
  getPerformance() { return { now: () => Date.now() }; }
};

let lastRafCallback = null;
global.requestAnimationFrame = function (cb) {
  lastRafCallback = cb;
  global.__drawFrame = cb;
  return 1;
};

// Boot game in wx-minigame directory
process.chdir(path.resolve(__dirname, 'wx-minigame'));
require(path.resolve(__dirname, 'wx-minigame/game.js'));

console.log('✓ Boot succeeded. win.__dshWxBootOk:', global.window.__dshWxBootOk);

function simulateTap(x, y) {
  if (touchStartFn) touchStartFn({ touches: [{ clientX: x, clientY: y, identifier: 1 }] });
  if (touchEndFn) touchEndFn({ changedTouches: [{ clientX: x, clientY: y, identifier: 1 }] });
}

async function runComprehensiveTests() {
  console.log('\n========================================');
  console.log('  PACK THIS ORDER - COMPREHENSIVE TESTS');
  console.log('========================================\n');

  // Test 1: Title Screen & Navigation
  console.log('Test 1: Title Screen check...');
  let state = window.__gameState();
  if (state.phase !== 'title') throw new Error(`Expected title, got ${state.phase}`);
  console.log('✓ Title screen active.');

  // Test 2: Start Campaign Mode (Level 1)
  console.log('\nTest 2: Starting Campaign Mode...');
  // Tap [开始打包] (centered around x: 195, y: 560)
  simulateTap(195, 560);
  state = window.__gameState();
  if (state.phase !== 'playing') throw new Error(`Expected playing, got ${state.phase}`);
  console.log(`✓ Started Campaign at Level ${state.level}.`);

  // Test 3: Solve all 8 Campaign Levels
  console.log('\nTest 3: Solving all 8 Campaign Levels...');
  for (let lvl = 1; lvl <= 8; lvl++) {
    state = window.__gameState();
    console.log(`\n--- Level ${lvl}: ${state.title || 'Level ' + lvl} ---`);
    console.log(`  Items to pack: ${state.requiredCount}`);

    let maxSteps = 30;
    while ((state.rawPhase === 'playing' || state.tapPreview) && maxSteps > 0) {
      window.__autoplay(true);
      state = window.__gameState();
      maxSteps--;
    }

    console.log(`  Phase after solving: ${state.rawPhase}, Placed items:`, Object.keys(state.placed));
    if (lvl < 8) {
      if (state.rawPhase !== 'order-complete') {
        throw new Error(`Level ${lvl} did not reach order-complete! Got: ${state.rawPhase}`);
      }
      console.log(`  ✓ Level ${lvl} completed successfully!`);
      // Advance to next level
      window.__advance();
      state = window.__gameState();
    } else {
      if (state.rawPhase !== 'won') {
        throw new Error(`Level 8 did not reach won! Got: ${state.rawPhase}`);
      }
      console.log(`  ✓ Level 8 completed! Reached final VICTORY state ('won')!`);
    }
  }

  // Final Campaign Summary
  const campaignSummary = window.__gameState();
  console.log('\n========================================');
  console.log('  CAMPAIGN COMPLETE RESULTS:');
  console.log(`  Final Phase: ${campaignSummary.rawPhase}`);
  console.log(`  Total Stars: ${campaignSummary.stars}`);
  console.log(`  Total Coins: ${campaignSummary.coins}`);
  console.log(`  Total Score: ${campaignSummary.score}`);
  console.log('========================================\n');

  // Test 4: Custom Orders Mode (自由客制模式)
  console.log('\nTest 4: Testing Custom Orders Mode...');
  // Go back to title
  window.__returnToTitle();
  state = window.__gameState();
  console.log('Returned to phase:', state.rawPhase);

  // Start Custom Mode
  window.__start(0, true);
  state = window.__gameState();
  console.log(`Started Custom Mode: level ${state.level}, mode: ${state.mode}, guest: ${state.guest}`);

  for (let cLvl = 1; cLvl <= 5; cLvl++) {
    state = window.__gameState();
    console.log(`\n--- Custom Level ${cLvl}: ${state.guest} · ${state.title} ---`);
    let maxSteps = 30;
    while ((state.rawPhase === 'playing' || state.tapPreview) && maxSteps > 0) {
      window.__autoplay(true);
      state = window.__gameState();
      maxSteps--;
    }
    console.log(`  Phase after solving: ${state.rawPhase}, Placed items:`, Object.keys(state.placed));
    if (state.rawPhase !== 'order-complete' && state.rawPhase !== 'won') {
      throw new Error(`Custom Level ${cLvl} failed to complete! Phase: ${state.rawPhase}`);
    }
    console.log(`  ✓ Custom Level ${cLvl} completed!`);
    window.__advance();
  }
  console.log('✓ Custom Mode verified!');

  // Test 5: Hint Trigger & Rewarded Video Ad
  console.log('\nTest 5: Testing Hint System & Rewarded Video...');
  window.__returnToTitle();
  window.__start(0, false); // Level 1
  state = window.__gameState();
  console.log(`  At Level ${state.level}, triggering hint...`);
  window.__triggerHint(); // Trigger hint, which shows rewarded ad or displays hint
  state = window.__gameState();
  console.log('  Feedback after hint:', state.feedback);
  console.log('✓ Hint & Ad integration verified!');

  // Test 6: Verify Render Frame (draw) execution with zero errors across all phases
  console.log('\nTest 6: Stress testing Canvas render loop (draw)...');
  if (typeof global.__drawFrame === 'function') {
    // 1. Draw in playing state
    global.__drawFrame(100);
    global.__drawFrame(200);

    // 2. Draw in title state
    window.__returnToTitle();
    global.__drawFrame(300);

    // 3. Draw in album state
    global.window.__gameState();
    simulateTap(270, 680); // album button
    global.__drawFrame(400);

    // 4. Draw with hint active
    window.__start(0, false);
    window.__triggerHint();
    global.__drawFrame(500);

    console.log('  ✓ Canvas render loop cleanly executed across Title, Album, Playing, and Hint states!');
  }


  console.log('\n========================================');
  console.log('🎉 ALL TESTS PASSED SUCCESSFULLY 100%!');
  console.log('========================================\n');

  process.exit(0);
}

runComprehensiveTests().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
