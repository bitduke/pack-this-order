const automator = require('miniprogram-automator');

async function run() {
  console.log('Launching WeChat DevTools automation...');
  let miniProgram;
  try {
    miniProgram = await automator.launch({
      cliPath: 'D:\\微信web开发者工具\\cli.bat',
      projectPath: 'D:\\Ai movies\\pack-this-order\\wx-minigame',
    });
    console.log('DevTools connected successfully!');

    miniProgram.on('console', msg => {
      console.log(`[IDE Console ${msg.type}] ${msg.args ? JSON.stringify(msg.args) : ''}`);
    });

    miniProgram.on('exception', err => {
      console.error(`[IDE Exception] ${err.message}\n${err.stack}`);
    });

    await new Promise(r => setTimeout(r, 4000));

    const screenshotPath = 'C:/Users/1/.gemini/antigravity/brain/8d5d4718-460d-46aa-b565-c3889eb9a6c7/devtools-screenshot.png';
    await miniProgram.screenshot({ path: screenshotPath });
    console.log('Screenshot saved to:', screenshotPath);

    const state = await miniProgram.evaluate(() => {
      return {
        bootOk: typeof window !== 'undefined' ? window.__dshWxBootOk : null,
        gameState: typeof window !== 'undefined' && typeof window.__gameState === 'function' ? window.__gameState() : null,
        hasScreenCanvas: typeof window !== 'undefined' && !!window.__screenCanvas
      };
    });
    console.log('Evaluated state in Mini Program:', JSON.stringify(state, null, 2));

    await miniProgram.disconnect();
    console.log('Automator finished cleanly.');
  } catch (err) {
    console.error('Automator failed:', err);
    if (miniProgram) {
      try { await miniProgram.disconnect(); } catch (_) {}
    }
  }
}

run();
