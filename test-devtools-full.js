const automator = require('./node_modules/miniprogram-automator');
const path = require('path');

async function main() {
  console.log('--- 1. Launching WeChat DevTools ---');
  let miniProgram;
  try {
    miniProgram = await automator.launch({
      cliPath: 'D:\\微信web开发者工具\\cli.bat',
      projectPath: path.resolve(__dirname, 'wx-minigame'),
      timeout: 60000
    });
  } catch (e) {
    console.error('Launch failed:', e.message);
    process.exit(1);
  }

  console.log('--- 2. Connected to DevTools ---');
  miniProgram.on('console', msg => console.log('[Console]', msg.type(), msg.text()));
  miniProgram.on('exception', err => console.error('[Exception]', err));

  // Wait for game to initialize
  await new Promise(r => setTimeout(r, 4000));

  console.log('--- 3. Taking Title Screenshot ---');
  await miniProgram.screenshot({ path: path.resolve(__dirname, 'devtools-title.png') });
  console.log('Saved devtools-title.png');

  // Check state
  const titleState = await miniProgram.evaluate(() => {
    return {
      gameState: typeof window.__gameState === 'function' ? window.__gameState() : null,
      dshBootOk: window.__dshWxBootOk,
      hasCanvas: Boolean(window.canvas),
      cw: window.canvas ? window.canvas.width : 0,
      ch: window.canvas ? window.canvas.height : 0
    };
  });
  console.log('Title State:', JSON.stringify(titleState, null, 2));

  // Tap "开始打包" button on title screen
  // Title screen has "开始打包" button at geometry().start: box(45, height - 198, 300, 48)
  console.log('--- 4. Tapping [开始打包] ---');
  await miniProgram.evaluate(() => {
    // Trigger touch on start button
    const sys = wx.getSystemInfoSync();
    const touchX = Math.round(sys.windowWidth / 2);
    const touchY = Math.round(sys.windowHeight * 0.72);
    // Dispatch touch event
    if (typeof window.__dispatchTouch === 'function') {
      window.__dispatchTouch('start', touchX, touchY);
      window.__dispatchTouch('end', touchX, touchY);
    }
  });

  await new Promise(r => setTimeout(r, 2000));

  console.log('--- 5. Taking Level 1 Screenshot ---');
  await miniProgram.screenshot({ path: path.resolve(__dirname, 'devtools-level1.png') });
  console.log('Saved devtools-level1.png');

  const playState = await miniProgram.evaluate(() => {
    return typeof window.__gameState === 'function' ? window.__gameState() : null;
  });
  console.log('Play State:', JSON.stringify(playState, null, 2));

  await miniProgram.close();
  console.log('--- 6. Test Finished Cleanly ---');
}

main().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
