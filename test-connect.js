const automator = require('miniprogram-automator');

async function test() {
  console.log('Connecting to WeChat DevTools on ws://127.0.0.1:9420 ...');
  const miniProgram = await automator.connect({
    wsEndpoint: 'ws://127.0.0.1:9420'
  });
  console.log('Connected!');

  miniProgram.on('console', msg => {
    console.log(`[IDE Console ${msg.type}]`, msg.args ? JSON.stringify(msg.args) : '');
  });

  miniProgram.on('exception', err => {
    console.error(`[IDE Exception]`, err);
  });

  // Re-launch or reload the game
  console.log('Reloading mini program...');
  await miniProgram.reLaunch('/game');

  await new Promise(r => setTimeout(r, 4000));

  const systemInfo = await miniProgram.systemInfo();
  console.log('System Info:', JSON.stringify(systemInfo, null, 2));

  // Evaluate in MiniProgram context
  const evalResult = await miniProgram.evaluate(() => {
    return {
      windowExists: typeof window !== 'undefined',
      GameGlobalExists: typeof GameGlobal !== 'undefined',
      bootOk: typeof window !== 'undefined' ? window.__dshWxBootOk : null,
      keys: typeof GameGlobal !== 'undefined' ? Object.keys(GameGlobal).filter(k => !k.startsWith('__wx')) : []
    };
  });
  console.log('Eval Result:', evalResult);

  // Take screenshot of the simulator
  await miniProgram.screenshot({
    path: 'D:/Ai movies/pack-this-order/ide_simulator.png'
  });
  console.log('Screenshot saved to D:/Ai movies/pack-this-order/ide_simulator.png');

  await miniProgram.disconnect();
  console.log('Disconnected.');
}

test().catch(e => {
  console.error('Test error:', e);
  process.exit(1);
});
