/**
 * WeChat Mini Game Operations & Traffic Host (流量主) Monetization Config
 * Generated for《这单怎么装？》
 *
 * 流量主变现配置说明：
 * 1. 微信公众平台 (mp.weixin.qq.com) -> 流量主 -> 广告管理；
 * 2. 创建激励视频、Banner 与插屏广告位后，将对应的 adunit-xxxxxxxxxxxxxxxx 填入下方 adUnitIds 中；
 * 3. 达到 1000 UV 前 (审核与冷启动期)，保持 noAdFallbackMode: 'free'；
 *    所有激励视频按钮会自动触发“首发限免已发放”，确保微信官方提审 100% 顺畅通过，绝无死锁或报错。
 */
module.exports = {
  adUnitIds: {
    // 激励视频广告位 ID (核心变现：💡 提示、🎬 3倍小费出餐)
    rewardedVideo: "",
    // Banner 横幅广告位 ID (底部常驻展示)
    banner: "",
    // 插屏广告位 ID (过关间隔展示)
    interstitial: "",
    // 细分别名 (可选，留空则默认回退到 rewardedVideo)
    hint: "",
    tripleReward: ""
  },
  // 未配广告位或未开通流量主时的兜底策略: 'free' = 免广告直接发放 (官方审核友好)
  noAdFallbackMode: 'free',
  // 插屏广告触发冷却时间 (毫秒，微信规范建议 >= 60000ms，默认 90 秒)
  interstitialCooldownMs: 90000,
  // 出餐结算小费倍率
  rewardMultiplier: 3,
  // 微信分享配置
  shareTitle: "快来玩《这单怎么装？》，看你能拿多少分！",
  shareImageUrl: "images/share-cover.jpg",
  showBootSplash: true
};
