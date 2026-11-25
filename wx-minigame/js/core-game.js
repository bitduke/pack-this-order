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
var Path2D = __wxRoot.Path2D || window.Path2D;
var requestAnimationFrame = function (cb) { return (__wxRoot.requestAnimationFrame || window.requestAnimationFrame).call(window, cb); };
var cancelAnimationFrame = function (id) { return (__wxRoot.cancelAnimationFrame || window.cancelAnimationFrame).call(window, id); };
(() => {
  'use strict';

  const canvas = (typeof document !== 'undefined' && document.getElementById && document.getElementById('game')) || (typeof window !== 'undefined' && window.__canvas) || (typeof wx !== 'undefined' && wx.createCanvas ? wx.createCanvas() : null);
  const screen = canvas.getContext('2d');
  let ctx = screen;
  const width = 390;
  const boardSize = 278;
  const boardX = (width - boardSize) / 2;
  const font = '"PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif';
  const colors = {
    ink: '#37291f', subtle: '#725644', red: '#a52b21', tomato: '#cf4935',
    cream: '#fff4d9', paper: '#fff9e9', tan: '#efe0ba', kraft: '#9e6941',
    green: '#325d42', mint: '#dbe9cc', blue: '#1b6280', paleBlue: '#d8eef0',
    dark: '#352820', white: '#fffdf3'
  };
  const items = {
    hero:     { label: '热汉堡', w: 2, h: 2, shade: '#f6c47d', edge: '#be733c' },
    pickup:   { label: '冰饮',   w: 1, h: 1, shade: '#b8e1e8', edge: '#5794a3' },
    fries:    { label: '薯条',   w: 1, h: 2, shade: '#f9cd70', edge: '#ad7633' },
    rings:    { label: '洋葱圈', w: 2, h: 1, shade: '#f1d9a8', edge: '#a87c4c' },
    sandwich: { label: '三明治', w: 3, h: 1, shade: '#d2e0a3', edge: '#7a9052' },
    sauce:    { label: '蘸酱',   w: 1, h: 1, shade: '#edb8a2', edge: '#b35743' },
    soup:     { label: '热汤',   w: 1, h: 1, shade: '#eac688', edge: '#aa7540' }
  };
  const levels = [
    {
      title: '基础摆放', size: 3, foods: ['hero', 'fries', 'rings'],
      instruction: ['把三样餐品放进盒子。', '形状不能重叠。'],
      hint: '试试先从占地最大的餐品开始。',
      solution: [['hero', 0, 0], ['fries', 2, 0], ['rings', 0, 2]]
    },
    {
      title: '冷热分开', size: 3, heat: true, foods: ['hero', 'pickup', 'fries', 'rings'],
      instruction: ['热汉堡和冰饮不能上下左右挨着。', '对角接触可以。'],
      hint: '给热汉堡和冰饮留一点距离。',
      solution: [['hero', 0, 0], ['pickup', 2, 2], ['fries', 2, 0], ['rings', 0, 2]]
    },
    {
      title: '固定杯位', size: 4, heat: true, cup: { x: 1, y: 1 },
      foods: ['hero', 'pickup', 'fries', 'rings', 'sandwich'],
      instruction: ['冰饮只能放进圆形杯位。', '热汉堡与冰饮仍然不能挨边。'],
      hint: '先找到圆形杯位，再安排热汉堡。',
      solution: [['pickup', 1, 1], ['hero', 2, 2], ['fries', 0, 1], ['rings', 0, 3], ['sandwich', 0, 0]]
    },
    {
      title: '旋转装盒', size: 4, rotate: true, foods: ['hero', 'fries', 'rings', 'sandwich'],
      dividers: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
      instruction: ['选中长条餐品，点「旋转」横竖换。', '深色隔板占了位置，餐品要绕开。'],
      hint: '两侧有窄格，试试把三明治竖过来。',
      solution: [['sandwich', 3, 0, true], ['hero', 0, 2], ['fries', 0, 0], ['rings', 2, 2, true]]
    },
    {
      title: '成套出餐', size: 4, rotate: true, heat: true, cup: { x: 3, y: 0 }, sauceSides: ['fries'],
      foods: ['hero', 'pickup', 'fries', 'sauce', 'sandwich'],
      instruction: ['薯条和蘸酱要上下或左右挨着。', '冰饮进杯位，冷热仍要分开。'],
      hint: '先给薯条留一格放蘸酱的位置。',
      solution: [['pickup', 3, 0], ['hero', 0, 0], ['sandwich', 0, 2], ['fries', 2, 1, true], ['sauce', 2, 0]]
    },
    {
      title: '隔板套餐', size: 4, rotate: true, heat: true, cup: { x: 3, y: 3 }, sauceSides: ['fries'],
      foods: ['hero', 'pickup', 'fries', 'sauce', 'sandwich'],
      dividers: [{ x: 1, y: 2 }, { x: 1, y: 3 }],
      instruction: ['旋转长条餐品，绕开深色隔板。', '冰饮归杯位，不能挨着热汉堡。', '薯条和蘸酱要贴边。'],
      hint: '隔板旁边留着一条窄道，看看能放什么。',
      solution: [['pickup', 3, 3], ['hero', 0, 0], ['sandwich', 2, 1, true], ['fries', 2, 0, true], ['sauce', 3, 1]]
    },
    {
      title: '一格余量', size: 4, rotate: true, heat: true, cup: { x: 1, y: 2 }, sauceSides: ['fries'],
      foods: ['hero', 'pickup', 'fries', 'sauce', 'sandwich'],
      dividers: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 3 }],
      instruction: ['旋转餐品绕开隔板，最后只空一格。', '冰饮归杯位，不能挨着热汉堡。', '薯条和蘸酱要贴边。'],
      hint: '杯位在中间。先给热汉堡和长条三明治找位置。',
      solution: [['pickup', 1, 2], ['hero', 2, 0], ['sandwich', 0, 1, true], ['fries', 2, 2, true], ['sauce', 2, 3]]
    },
    {
      title: '双拼满盒', size: 4, rotate: true, heat: true, cup: { x: 0, y: 0 }, sauceSides: ['fries', 'rings'],
      foods: ['hero', 'pickup', 'fries', 'rings', 'sauce', 'sandwich'],
      dividers: [{ x: 2, y: 0 }, { x: 3, y: 0 }, { x: 2, y: 1 }],
      instruction: ['旋转餐品绕开隔板，填满可用格。', '冰饮归杯位，不能挨着热汉堡。', '薯条和洋葱圈都要与蘸酱贴边。'],
      hint: '找一格能同时挨着薯条和洋葱圈的位置。',
      solution: [['pickup', 0, 0], ['hero', 1, 2], ['sandwich', 3, 1, true], ['fries', 1, 0], ['rings', 0, 2, true], ['sauce', 0, 1]]
    }
  ];
  const customOrders = [
    {
      guest: '小林', title: '薯条配酱', cup: { x: 3, y: 0 }, sauceSides: ['fries'],
      foods: ['hero', 'sandwich', 'pickup', 'fries', 'sauce'],
      dividers: [{ x: 0, y: 2 }, { x: 0, y: 3 }],
      instruction: ['热汉堡、三明治二选一，其余都要装。', '冰饮归杯位，别挨着热汉堡。', '薯条和蘸酱贴边，方便蘸着吃。'],
      hint: '摆薯条时，给蘸酱留一个相邻格。',
      solution: [['pickup', 3, 0], ['hero', 0, 0], ['fries', 2, 0], ['sauce', 3, 1]]
    },
    {
      guest: '阿岚', title: '分开装', cup: { x: 0, y: 1 }, sauceSides: ['fries'], sauceApart: ['rings'],
      dividers: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
      instruction: ['主食二选一，冰饮进杯位。', '热汉堡别挨冰饮，薯条要贴蘸酱。', '洋葱圈吃原味，不能贴蘸酱。'],
      hint: '蘸酱要靠着薯条，但洋葱圈贴在另一处。',
      solution: [['pickup', 0, 1], ['hero', 2, 0], ['fries', 0, 3, true], ['rings', 2, 3], ['sauce', 0, 2]]
    },
    {
      guest: '阿远', title: '双拼蘸酱', cup: { x: 1, y: 3 }, sauceSides: ['fries', 'rings'],
      dividers: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 2 }],
      instruction: ['热汉堡、三明治二选一，其余都要装。', '冰饮归杯位，别挨着热汉堡。', '薯条、洋葱圈都要贴同一份蘸酱。'],
      hint: '找一个格子，两份小食都能伸到这格旁边。',
      solution: [['pickup', 1, 3], ['hero', 2, 0], ['fries', 3, 2], ['rings', 1, 2], ['sauce', 2, 3]]
    },
    {
      guest: '唐姐', title: '两边蘸', cup: { x: 3, y: 2 }, sauceSides: ['fries', 'rings'], sauceOpposite: true,
      dividers: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
      instruction: ['主食二选一，冰饮进杯位。', '热汉堡别挨冰饮，蘸酱放在中间。', '薯条、蘸酱、洋葱圈要排成直线。'],
      hint: '把两份小食放在酱盒的左和右，或上和下。',
      solution: [['pickup', 3, 2], ['hero', 0, 2], ['fries', 2, 1, true], ['rings', 2, 3], ['sauce', 2, 2]]
    },
    {
      guest: '周叔', title: '主食靠右', cup: { x: 2, y: 3 }, mainRight: true,
      sauceSides: ['fries'], sauceApart: ['rings'],
      dividers: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 2 }, { x: 3, y: 2 }],
      instruction: ['主食二选一，只放在餐盒右半边。', '薯条贴酱，洋葱圈和酱分开。', '冰饮归杯位，别挨着热汉堡。'],
      hint: '右边只有两列，试试把三明治转成竖放。',
      solution: [['pickup', 2, 3], ['hero', 2, 0], ['fries', 1, 2], ['rings', 0, 0], ['sauce', 2, 2]]
    },
    {
      guest: '小夏', title: '三样共蘸', cup: { x: 1, y: 0 }, sauceSides: ['fries', 'rings'], mainDips: true,
      dividers: [{ x: 3, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 3 }],
      instruction: ['主食二选一，冰饮进杯位。', '主食、薯条、洋葱圈都要贴蘸酱。', '热汉堡和冰饮分开。'],
      hint: '给蘸酱找一个至少有三条空边的位置。',
      solution: [['pickup', 1, 0], ['hero', 0, 2], ['fries', 0, 0], ['rings', 2, 0, true], ['sauce', 1, 1]]
    },
    {
      guest: '陈姐', title: '定位蘸酱', cup: { x: 2, y: 3 }, sauceSlot: { x: 2, y: 2 },
      sauceSides: ['fries', 'rings'], mainDips: true,
      sauceEdges: { fries: { x: -1, y: 0, label: '左边' }, rings: { x: 1, y: 0, label: '右边' } },
      dividers: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }],
      instruction: ['冰饮归杯位，别挨着热汉堡。', '主食二选一并贴酱，蘸酱归酱位。', '薯条贴酱左边，洋葱圈贴酱右边。'],
      hint: '杯位在酱下边，留出上边给主食。',
      solution: [['pickup', 2, 3], ['hero', 2, 0], ['fries', 1, 1], ['rings', 3, 2, true], ['sauce', 2, 2]]
    },
    {
      guest: '许姐', title: '热汤加餐', cup: { x: 2, y: 3 }, sauceSides: ['fries'],
      foods: ['hero', 'sandwich', 'pickup', 'fries', 'sauce', 'soup'],
      dividers: [{ x: 2, y: 0 }, { x: 3, y: 0 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 2 }],
      instruction: ['主食二选一，冰饮归杯位。', '热汤和热汉堡都不能挨冰饮。', '薯条要贴蘸酱。'],
      hint: '热汤只有一格，找个不挨着冰饮的位置。',
      solution: [['pickup', 2, 3], ['hero', 0, 0], ['fries', 0, 2], ['soup', 1, 2], ['sauce', 1, 3]]
    },
    {
      guest: '阿澈', title: '汤跟主食', cup: { x: 2, y: 3 }, mainSides: ['soup'],
      sauceSides: ['fries'], sauceApart: ['soup'], foods: ['hero', 'sandwich', 'pickup', 'fries', 'sauce', 'soup'],
      dividers: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
      instruction: ['主食二选一，热汤要贴主食。', '冰饮归杯位，别挨着热食。', '薯条贴蘸酱，热汤和蘸酱分开。'],
      hint: '给主食留一条边放汤，再把薯条和酱配对。',
      solution: [['pickup', 2, 3], ['hero', 2, 0], ['fries', 0, 1], ['soup', 3, 2], ['sauce', 0, 3]]
    },
    {
      guest: '敏姐', title: '临时加汤', cup: { x: 1, y: 0 }, sauceSlot: { x: 1, y: 3 },
      mainSides: ['soup'], lateFoods: { soup: { after: 3 } }, sauceSides: ['fries'], sauceApart: ['soup'],
      foods: ['hero', 'sandwich', 'pickup', 'fries', 'sauce', 'soup'],
      dividers: [{ x: 2, y: 0 }, { x: 3, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }],
      instruction: ['先装 3 件，热汤出锅后要贴主食。', '主食二选一，冰饮归杯位、远离热食。', '酱进酱位贴薯条，与热汤分开。'],
      hint: '先给主食边上留个汤位，热汤出锅后再装。',
      solution: [['pickup', 1, 0], ['hero', 2, 2], ['fries', 0, 2], ['soup', 3, 1], ['sauce', 1, 3]]
    },
    {
      guest: '邵姨', title: '留边等汤', cup: { x: 0, y: 0 },
      mainSides: ['soup', 'fries'], lateFoods: { soup: { after: 2 } },
      sauceSides: ['fries'], sauceApart: ['soup'], foods: ['hero', 'sandwich', 'pickup', 'fries', 'sauce', 'soup'],
      dividers: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
      instruction: ['先装 2 件，热汤再出锅。', '主食二选一，薯条和热汤都贴主食。', '冰饮归杯位，别挨热食。', '薯条贴酱，热汤和酱分开。'],
      hint: '薯条要同时贴住主食和蘸酱，热汤也要挨住主食。',
      solution: [['pickup', 0, 0], ['hero', 2, 1], ['fries', 1, 3, true], ['soup', 3, 0], ['sauce', 0, 3]]
    },
    {
      guest: '孟叔', title: '先汤后酱', cup: { x: 0, y: 3 },
      mainSides: ['soup', 'fries'], lateFoods: { soup: { after: 2 }, sauce: { after: 3, requires: 'soup' } },
      sauceSides: ['fries'], sauceApart: ['soup'], foods: ['hero', 'sandwich', 'pickup', 'fries', 'sauce', 'soup'],
      dividers: [{ x: 3, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }],
      instruction: ['先装 2 件上汤，汤入盒才上酱。', '主食二选一，薯条和热汤都贴主食。', '冰饮归杯位，别挨热食。', '薯条贴酱，热汤和酱分开。'],
      hint: '别把薯条旁边塞满，汤入盒后还要放酱。',
      solution: [['pickup', 0, 3], ['hero', 1, 0], ['fries', 0, 0], ['soup', 3, 0], ['sauce', 0, 2]]
    },
    {
      guest: '罗姐', title: '双加餐定位', cup: { x: 1, y: 0 }, sauceSlot: { x: 2, y: 1 },
      mainSides: ['soup', 'fries'], lateFoods: { soup: { after: 3 }, sauce: { after: 4, requires: 'soup' } },
      sauceSides: ['fries'], sauceApart: ['soup'], sauceEdges: { fries: { x: -1, y: 0, label: '左边' } },
      foods: ['hero', 'sandwich', 'pickup', 'fries', 'sauce', 'soup'],
      dividers: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }],
      instruction: ['先装 3 件上汤，汤入盒才上酱。', '主食二选一，薯条和热汤都贴主食。', '冰饮归杯位，别挨热食。', '酱进酱位，薯条贴酱左边，汤酱分开。'],
      hint: '先看好酱位左边的格子，再给主食和热汤腾位置。',
      solution: [['pickup', 1, 0], ['hero', 2, 2], ['fries', 1, 1], ['soup', 1, 3], ['sauce', 2, 1]]
    },
    {
      guest: '阿梅', title: '圈圈加点', cup: { x: 3, y: 0 }, lateFoods: { rings: { after: 2 } },
      foodPairs: [['rings', 'fries']], sauceSides: ['fries'],
      dividers: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
      instruction: ['先装 2 件，洋葱圈再到。', '洋葱圈贴薯条，薯条也要贴蘸酱。', '主食二选一，冰饮进杯位并避开汉堡。'],
      hint: '给薯条留两处相邻位置，一处放酱，一处放洋葱圈。',
      solution: [['pickup', 3, 0], ['hero', 0, 0], ['fries', 3, 2], ['rings', 1, 3], ['sauce', 3, 1]]
    },
    {
      guest: '阿泽', title: '冰饮后到', cup: { x: 3, y: 1 },
      lateFoods: { pickup: { after: 3, requires: 'soup' } },
      mainSides: ['soup'], sauceSides: ['fries'], sauceApart: ['soup'],
      foods: ['hero', 'sandwich', 'pickup', 'fries', 'sauce', 'soup'],
      dividers: [{ x: 2, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 0, y: 3 }],
      instruction: ['装满 3 件且热汤入盒，冰饮才到。', '主食二选一，热汤贴主食，薯条贴酱。', '杯位留给冰饮，冷热和汤酱都分开。'],
      hint: '冰饮还没到，但它的杯位旁边已经不能摆热食。',
      solution: [['hero', 0, 0], ['fries', 3, 2], ['soup', 2, 0], ['pickup', 3, 1], ['sauce', 2, 3]]
    },
    {
      guest: '倩姐', title: '两边加点', cup: { x: 0, y: 2 }, sauceSlot: { x: 2, y: 1 },
      lateFoods: { fries: { after: 3 }, rings: { after: 4, requires: 'fries' } },
      sauceSides: ['fries', 'rings'], mainSides: ['rings'],
      sauceEdges: { fries: { x: -1, y: 0, label: '左边' }, rings: { x: 1, y: 0, label: '右边' } },
      dividers: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }],
      instruction: ['装 3 件上薯条，薯条入盒上洋葱圈。', '酱归酱位，薯条贴左边，洋葱圈贴右边。', '主食二选一，洋葱圈也要贴主食。', '冰饮进杯位，别挨着热汉堡。'],
      hint: '先留好酱位两侧，洋葱圈到后还要够得着主食。',
      solution: [['pickup', 0, 2], ['hero', 2, 2], ['sauce', 2, 1], ['fries', 1, 1], ['rings', 3, 0, true]]
    }
  ].map(order => ({
    size: 4, rotate: true, heat: true, mainChoices: ['hero', 'sandwich'],
    foods: ['hero', 'sandwich', 'pickup', 'fries', 'rings', 'sauce'],
    ...order
  }));
  const cues = {
    ready: '拖动餐品，或点选餐品试摆。',
    noRoom: '超出餐盒了，往里挪一格。',
    overlap: '这里已经有餐品了。',
    heat: '热汉堡和冰饮不能挨边。',
    soupHeat: '热汤和冰饮不能挨边。',
    cup: '冰饮只能放进画圆的杯位。',
    reserved: '这个位置留给冰饮。',
    lift: '从餐盒取出了这件餐品。',
    divider: '这里有隔板，餐品需要绕开。',
    main: '主食二选一，要换就先取出已装主食。',
    mainRight: '主食的所有占格都要在右半边。',
    sauceSlot: '蘸酱只能放进标出的酱位。',
    reservedSauce: '这个位置留给蘸酱。'
  };
  const finishText = '全部订单已装好！';
  const edgeSteps = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  const customerStories = {
    '小林': { role: '大学生', quote: '“薯条趁热蘸番茄酱，复习周全靠这口了！”' },
    '阿岚': { role: '插画师', quote: '“我的洋葱圈要保持酥脆，千万别沾到酱汁哦～”' },
    '阿远': { role: '程序员', quote: '“一份蘸酱同时蘸薯条和洋葱圈，效率拉满！”' },
    '唐姐': { role: '花店店主', quote: '“两边各一份小食排成线，整整齐齐看着舒心。”' },
    '周叔': { role: '出租司机', quote: '“主食靠右放拿得顺手，吃完继续跑下一趟车！”' },
    '小夏': { role: '高中生', quote: '“主食、薯条、洋葱圈都能蘸到酱，绝妙大满贯！”' },
    '陈姐': { role: '会计主管', quote: '“蘸酱正中定位，左边薯条右边圈，分毫不差。”' },
    '许姐': { role: '社区医生', quote: '“冬天加碗热腾腾的汤，暖身又贴心，离冰饮远点。”' },
    '阿澈': { role: '骑行达人', quote: '“刚出锅的热汤一定要贴着主食，保温更持久！”' },
    '敏姐': { role: '烘焙师', quote: '“等汤熬够火候再入盒，慢慢装，不急在一时。”' },
    '邵姨': { role: '退休教师', quote: '“给热汤留好挨着主食的边，摆得扎实不撒漏。”' },
    '孟叔': { role: '象棋教练', quote: '“先走汤再落酱，步步为营，这盘打包漂亮！”' },
    '罗姐': { role: '咖啡店长', quote: '“双加餐分先后，酱位和贴边方向也要严谨。”' },
    '阿梅': { role: '舞蹈老师', quote: '“后到的洋葱圈要挨着薯条，双重酥脆出击！”' },
    '阿泽': { role: '网球教练', quote: '“运动完来份热食，冰饮最后送到，清凉收尾。”' },
    '倩姐': { role: '建筑设计师', quote: '“左右护法小食到位，对称与平衡的打包美学。”' }
  };

  const STORAGE_KEY = 'pack_this_order_v2';
  function getStorageItem(key) {
    try {
      if (typeof wx !== 'undefined' && wx.getStorageSync) return wx.getStorageSync(key);
      if (typeof localStorage !== 'undefined') return localStorage.getItem(key);
    } catch (_) {}
    return null;
  }
  function setStorageItem(key, val) {
    try {
      if (typeof wx !== 'undefined' && wx.setStorageSync) { wx.setStorageSync(key, val); return; }
      if (typeof localStorage !== 'undefined') { localStorage.setItem(key, val); return; }
    } catch (_) {}
  }
  function loadSave() {
    const raw = getStorageItem(STORAGE_KEY);
    if (raw) {
      try {
        const d = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (d && typeof d === 'object') return d;
      } catch (_) {}
    }
    return { stars: {}, coins: 0, dailyDate: '', streak: 0 };
  }
  const saveState = loadSave();
  function saveGame() {
    setStorageItem(STORAGE_KEY, JSON.stringify(saveState));
  }
  function getTotalStars() {
    return Object.values(saveState.stars || {}).reduce((a, b) => a + (Number(b) || 0), 0);
  }
  function getTotalCoins() {
    return Number(saveState.coins) || 0;
  }

  let phase = 'title';
  let levelIndex = 0;
  let customMode = false;
  let isDailyMode = false;
  let albumIndex = 0;
  let wrongAttempts = 0;
  let lastEarnedStars = 1;
  let lastTipEarned = 15;
  let activeHint = null;
  let claimedTriple = false;
  let clearedCountSinceAd = 0;
  const rewardMultiplier = (typeof window !== 'undefined' && window.GAME?.wxConfig?.rewardMultiplier) || 3;
  const servedMains = customOrders.map(() => new Set());
  let arrivedFoods = new Set();
  let placed = new Map();
  let rotations = new Set();
  let selected = null;
  let tapPreview = null;
  let held = null;
  let keyboardCell = null;
  let feedback = { text: cues.ready, tone: '' };
  let completedAt = 0;
  let placedAt = 0;
  let lastPiece = null;
  let autoplayAt = 0;
  let frameTime = 0;
  let fps = 0;
  let audio;
  let muted = false;
  let height = 720;
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let dpr = 1;
  let viewWidth = 390;
  let viewHeight = 720;

  const reduceMotion = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  const live = typeof document !== 'undefined' && typeof document.createElement === 'function' ? document.createElement('div') : null;
  if (live) {
    if (live.setAttribute) live.setAttribute('aria-live', 'polite');
    if (live.style) live.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;' +
      'padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);';
    if (document.body) {
      if (typeof document.body.append === 'function') document.body.append(live);
      else if (typeof document.body.appendChild === 'function') document.body.appendChild(live);
    }
  }
  if (canvas && canvas.setAttribute) canvas.setAttribute('aria-label', '这单怎么装？首页回车开打，按 2 试自选套餐。游戏中可用数字选餐品、方向键移动、回车确认，按 R 旋转长条餐品。');

  function currentOrders() { return customMode ? customOrders : levels; }
  function currentLevel() { return currentOrders()[levelIndex]; }
  function requiredFoodCount() {
    const level = currentLevel();
    return level.mainChoices ? level.foods.length - level.mainChoices.length + 1 : level.foods.length;
  }
  function packedMain() {
    return currentLevel().mainChoices?.find(key => placed.has(key));
  }
  function isWaitingForFood(key) {
    return Boolean(currentLevel().lateFoods?.[key]) && !arrivedFoods.has(key);
  }
  function waitingForFoodMessage(key) {
    const { after, requires } = currentLevel().lateFoods[key];
    if (requires && !placed.has(requires)) return '先把' + items[requires].label + '装盒，' + items[key].label + '再到。';
    const arrival = key === 'soup' ? '热汤再出锅。' : items[key].label + '再到。';
    return '先装好 ' + after + ' 件餐品，' + arrival;
  }
  function releaseLateFoods() {
    let feedback = '';
    for (const [key, rule] of Object.entries(currentLevel().lateFoods || {})) {
      if (arrivedFoods.has(key) || placed.size < rule.after || (rule.requires && !placed.has(rule.requires))) continue;
      arrivedFoods.add(key);
      feedback = key === 'soup' ? '热汤出锅了，可以装盒。' : items[key].label + '到了，可以装盒。';
    }
    return feedback;
  }
  function box(x, y, w, h) { return { x, y, w, h }; }
  function inside(p, r) {
    return p.x >= r.x && p.x < r.x + r.w && p.y >= r.y && p.y < r.y + r.h;
  }
  function dimensions(key, rotated) {
    const { w, h } = items[key];
    return rotated ? { w: h, h: w } : { w, h };
  }
  function draftPosition(key, x, y) {
    return rotations.has(key) ? { x, y, rotated: true } : { x, y };
  }
  function canRotate(key) {
    return currentLevel().rotate === true && key && items[key].w !== items[key].h;
  }
  function covers(key, position, x, y) {
    if (!position) return false;
    const item = dimensions(key, position.rotated);
    return x >= position.x && x < position.x + item.w &&
      y >= position.y && y < position.y + item.h;
  }
  function coversSameCell(a, aPos, b, bPos) {
    const aSize = dimensions(a, aPos.rotated);
    const bSize = dimensions(b, bPos.rotated);
    return aPos.x < bPos.x + bSize.w && aPos.x + aSize.w > bPos.x &&
      aPos.y < bPos.y + bSize.h && aPos.y + aSize.h > bPos.y;
  }
  function touchesCell(key, position, cell) {
    return edgeSteps.some(([dx, dy]) => covers(key, position, cell.x + dx, cell.y + dy));
  }
  function foodsShareEdge(a, aPos, b, bPos) {
    const aSize = dimensions(a, aPos.rotated);
    const bSize = dimensions(b, bPos.rotated);
    const aRight = aPos.x + aSize.w;
    const bRight = bPos.x + bSize.w;
    const aBottom = aPos.y + aSize.h;
    const bBottom = bPos.y + bSize.h;
    const sharesColumn = aPos.x < bRight && bPos.x < aRight;
    const sharesRow = aPos.y < bBottom && bPos.y < aBottom;
    return (sharesColumn && (aBottom === bPos.y || bBottom === aPos.y)) ||
      (sharesRow && (aRight === bPos.x || bRight === aPos.x));
  }
  function checkSaucePlacement(level, key, position) {
    const sides = level.sauceSides;
    const apart = level.sauceApart || [];
    const isDippingMain = level.mainDips && level.mainChoices.includes(key);
    if (!sides || (key !== 'sauce' && !sides.includes(key) && !apart.includes(key) && !isDippingMain)) return '';
    const locationOf = target => target === key ? position : placed.get(target);
    const sauce = locationOf('sauce');
    if (!sauce) return '';
    for (const sideKey of sides) {
      const side = locationOf(sideKey);
      if (!side) continue;
      const edge = level.sauceEdges?.[sideKey];
      const touches = edge
        ? covers(sideKey, side, sauce.x + edge.x, sauce.y + edge.y)
        : touchesCell(sideKey, side, sauce);
      if (!touches) {
        return items[sideKey].label + (edge ? '要贴蘸酱的' + edge.label + '。' : '和蘸酱要上下或左右挨着。');
      }
    }
    for (const sideKey of apart) {
      const side = locationOf(sideKey);
      if (side && touchesCell(sideKey, side, sauce)) return items[sideKey].label + '要和蘸酱分开。';
    }
    if (level.sauceOpposite) {
      const [firstKey, secondKey] = sides;
      const first = locationOf(firstKey);
      const second = locationOf(secondKey);
      const across = first && second && edgeSteps.some(([dx, dy]) =>
        covers(firstKey, first, sauce.x + dx, sauce.y + dy) &&
        covers(secondKey, second, sauce.x - dx, sauce.y - dy)
      );
      if (first && second && !across) return '蘸酱要夹在两份小食之间，排成直线。';
    }
    if (level.mainDips) {
      const mainKey = isDippingMain ? key : packedMain();
      const main = locationOf(mainKey);
      if (main && !touchesCell(mainKey, main, sauce)) return items[mainKey].label + '也要贴蘸酱。';
    }
    return '';
  }
  function checkPlacement(key, position) {
    const level = currentLevel();
    if (isWaitingForFood(key)) return waitingForFoodMessage(key);
    const main = packedMain();
    const isMain = level.mainChoices?.includes(key);
    if (main && key !== main && isMain) return cues.main;
    const { x, y } = position;
    const item = dimensions(key, position.rotated);
    const reserve = level.cup;
    const sauceSlot = level.sauceSlot;
    if (x < 0 || y < 0 || x + item.w > level.size || y + item.h > level.size) return cues.noRoom;
    if (level.mainRight && isMain && x < Math.ceil(level.size / 2)) return cues.mainRight;
    if (reserve && key === 'pickup' && (x !== reserve.x || y !== reserve.y)) return cues.cup;
    if (reserve && key !== 'pickup' && covers(key, position, reserve.x, reserve.y)) return cues.reserved;
    if (sauceSlot && key === 'sauce' && (x !== sauceSlot.x || y !== sauceSlot.y)) return cues.sauceSlot;
    if (sauceSlot && key !== 'sauce' && covers(key, position, sauceSlot.x, sauceSlot.y)) return cues.reservedSauce;
    if (level.dividers?.some(cell => covers(key, position, cell.x, cell.y))) return cues.divider;
    for (const [other, otherPos] of placed) {
      if (other !== key && coversSameCell(key, position, other, otherPos)) return cues.overlap;
    }
    const hot = key === 'hero' ? position : placed.get('hero');
    const cold = key === 'pickup' ? position : placed.get('pickup') || reserve;
    const soup = key === 'soup' ? position : placed.get('soup');
    if (level.heat && cold) {
      if (hot && touchesCell('hero', hot, cold)) return cues.heat;
      if (soup && touchesCell('soup', soup, cold)) return cues.soupHeat;
    }
    if (level.mainSides && (isMain || level.mainSides.includes(key))) {
      const mainKey = isMain ? key : main;
      const mainPosition = isMain ? position : placed.get(mainKey);
      if (mainPosition) {
        for (const sideKey of level.mainSides) {
          const side = sideKey === key ? position : placed.get(sideKey);
          if (side && !foodsShareEdge(mainKey, mainPosition, sideKey, side)) {
            return items[sideKey].label + '要和主食上下或左右挨着。';
          }
        }
      }
    }
    for (const [firstKey, secondKey] of level.foodPairs || []) {
      if (key !== firstKey && key !== secondKey) continue;
      const first = key === firstKey ? position : placed.get(firstKey);
      const second = key === secondKey ? position : placed.get(secondKey);
      if (first && second && !foodsShareEdge(firstKey, first, secondKey, second)) {
        return items[firstKey].label + '要和' + items[secondKey].label + '上下或左右挨着。';
      }
    }
    return checkSaucePlacement(level, key, position);
  }
  function occupant(cell) {
    if (!cell) return null;
    for (const [key, pos] of placed) {
      if (covers(key, pos, cell.x, cell.y)) return key;
    }
    return null;
  }
  function say(text, tone = '') {
    feedback = { text, tone };
    if (live) live.textContent = text;
  }
  function isMultiCell(key) { return items[key].w * items[key].h > 1; }

  function clearSelection() {
    const position = placed.get(selected);
    if (position?.rotated) rotations.add(selected);
    else if (position) rotations.delete(selected);
    selected = null;
    tapPreview = null;
  }
  function pick(key) {
    if (isWaitingForFood(key)) {
      clearSelection();
      say(waitingForFoodMessage(key));
      return;
    }
    if (key !== selected) clearSelection();
    selected = key;
    tapPreview = null;
    say('已选' + items[key].label + (isMultiCell(key) ? '。点想覆盖的一格，先看预览。' : '。点餐盒里要放的位置。'));
    sound('select');
  }
  function recordCompletion() {
    const levelKey = (customMode ? 'c_' : 'l_') + levelIndex;
    let stars = 1;
    if (wrongAttempts === 0) stars = 2;
    if (customMode) {
      if (servedMains[levelIndex].size >= (currentLevel().mainChoices?.length || 2)) stars = 3;
    } else {
      if (wrongAttempts === 0) stars = 3;
    }
    lastEarnedStars = stars;
    const oldStars = saveState.stars[levelKey] || 0;
    let tip = 15;
    if (stars > oldStars) {
      tip += (stars - oldStars) * 20;
      saveState.stars[levelKey] = stars;
    }
    saveState.coins = (saveState.coins || 0) + tip;
    lastTipEarned = tip;
    if (isDailyMode) {
      const todayStr = new Date().toISOString().slice(0, 10);
      if (saveState.dailyDate !== todayStr) {
        saveState.dailyDate = todayStr;
        saveState.streak = (saveState.streak || 0) + 1;
        saveState.coins = (saveState.coins || 0) + 50;
        lastTipEarned += 50;
      }
    }
    saveGame();
  }

  function put(key, position) {
    const error = checkPlacement(key, position);
    if (error) {
      wrongAttempts++;
      say(error, 'error');
      sound('error');
      if (typeof window !== 'undefined' && window.GAME?.vibrateShort) window.GAME.vibrateShort('heavy');
      return;
    }
    placed.set(key, position);
    if (activeHint && activeHint.key === key) activeHint = null;
    if (typeof window !== 'undefined' && window.GAME?.vibrateShort) window.GAME.vibrateShort('medium');
    const arrivalMessage = releaseLateFoods();
    clearSelection();
    lastPiece = key;
    placedAt = performance.now();
    if (placed.size === requiredFoodCount()) {
      phase = levelIndex === currentOrders().length - 1 ? 'won' : 'order-complete';
      completedAt = placedAt;
      autoplayAt = placedAt;
      if (customMode) {
        const main = packedMain();
        servedMains[levelIndex].add(main);
        say(currentLevel().guest + '的' + items[main].label + '餐出餐成功！', 'success');
      } else {
        say(phase === 'won' ? finishText : '打包成功！', 'success');
      }
      recordCompletion();
      sound('finish');
    } else {
      say(arrivalMessage || items[key].label + '已入盒。', 'success');
      sound('place');
    }
  }
  function remove(key) {
    if (!placed.delete(key)) return;
    selected = key;
    tapPreview = null;
    say(cues.lift);
    sound('select');
    if (typeof window !== 'undefined' && window.GAME?.vibrateShort) window.GAME.vibrateShort('light');
  }
  function start(index, isCustom = customMode) {
    phase = 'playing';
    levelIndex = index;
    customMode = isCustom;
    wrongAttempts = 0;
    arrivedFoods = new Set();
    placed = new Map();
    rotations = new Set();
    held = null;
    selected = null;
    tapPreview = null;
    keyboardCell = null;
    lastPiece = null;
    activeHint = null;
    claimedTriple = false;
    autoplayAt = performance.now();
    say(cues.ready);
    if (typeof window !== 'undefined' && window.GAME?.hideBannerAd) {
      window.GAME.hideBannerAd();
    }
  }
  function returnToTitle() {
    phase = 'title';
    isDailyMode = false;
    held = null;
    placed.clear();
    rotations.clear();
    clearSelection();
    keyboardCell = null;
    activeHint = null;
    claimedTriple = false;
    say('开始打包，或试试自选套餐。');
    if (typeof window !== 'undefined' && window.GAME?.showBannerAd) {
      window.GAME.showBannerAd();
    }
  }

  function geometry() {
    const extra = height - 720;
    const level = currentLevel();
    const board = box(boardX, 210 + extra * .30, boardSize, boardSize);
    const inner = box(board.x + 10, board.y + 10, board.w - 20, board.h - 20);
    const trayY = 574 + extra * .70;
    const actionY = board.y + board.h + 18;
    const foodCount = level.foods.length;
    const tileWidth = [91, 78, 64, 55][foodCount - 3];
    const gap = foodCount === 6 ? 4 : foodCount === 5 ? 5 : 8;
    const rowWidth = foodCount * tileWidth + (foodCount - 1) * gap;
    const longReceipt = level.instruction.length > 2;
    const compactReceipt = level.instruction.length > 3;
    const receiptY = compactReceipt ? 94 : longReceipt ? 98 : 105;
    const receiptHeight = compactReceipt ? 108 : longReceipt ? 104 : 89;
    return {
      header: 26, receipt: box(26, receiptY + extra * .13, 338, receiptHeight),
      board, inner, unit: inner.w / level.size,
      status: box(26, actionY, 338, 39),
      alternate: box(26, actionY, 156, 44),
      confirm: box(208, actionY, 156, 44),
      foodLabelY: trayY - 14, trayY,
      tray: level.foods.map((key, i) => ({
        key, ...box((width - rowWidth) / 2 + i * (tileWidth + gap), trayY, tileWidth, 76)
      })),
      retry: box(20, trayY + 90, 78, 42),
      rotate: box(105, trayY + 88, 88, 44),
      takeOut: box(200, trayY + 90, 78, 42),
      hintBtn: box(285, trayY + 88, 85, 44),
      start: box(45, height - 198, 300, 48),
      customStart: box(45, height - 142, 300, 46),
      dailyStart: box(45, height - 88, 145, 42),
      albumBtn: box(200, height - 88, 145, 42),
      home: box(175, 62, 95, 28),
      mute: box(196, 31, 72, 28),
      modal: box(31, height / 2 - (customMode ? 155 : 135), 328, customMode ? 315 : 270),
      tripleClaim: box(55, height / 2 + (customMode ? 32 : 36), 280, 46),
      advance: box(55, height / 2 + (customMode ? 84 : 88), 280, 42),
      customNext: box(55, height / 2 + 84, 280, 42),
      customRetry: box(55, height / 2 + 132, 134, 38),
      customHome: box(201, height / 2 + 132, 134, 38),
      albumPrev: box(45, height - 105, 78, 42),
      albumPlay: box(133, height - 105, 124, 42),
      albumNext: box(267, height - 105, 78, 42),
      albumBack: box(135, height - 54, 120, 38)
    };
  }
  function gridCell(point, g) {
    if (!inside(point, g.inner)) return null;
    return { x: Math.floor((point.x - g.inner.x) / g.unit), y: Math.floor((point.y - g.inner.y) / g.unit) };
  }
  function itemCenter(key, position, g) {
    const { w, h } = dimensions(key, position.rotated);
    return {
      x: g.inner.x + (position.x + w / 2) * g.unit,
      y: g.inner.y + (position.y + h / 2) * g.unit
    };
  }
  function cellCenter(cell, g) {
    return { x: g.inner.x + (cell.x + .5) * g.unit, y: g.inner.y + (cell.y + .5) * g.unit };
  }
  function dragTarget(point, g, drag) {
    if (!inside(point, g.board)) return null;
    const size = currentLevel().size;
    const { w, h } = dimensions(drag.key, rotations.has(drag.key));
    const x = Math.min(size - w, Math.max(0, Math.round((point.x - g.inner.x) / g.unit - drag.grabX)));
    const y = Math.min(size - h, Math.max(0, Math.round((point.y - g.inner.y) / g.unit - drag.grabY)));
    return draftPosition(drag.key, x, y);
  }
  function makeTapPreview(key, cell, point, g) {
    const size = currentLevel().size;
    const { w, h } = dimensions(key, rotations.has(key));
    const choices = [];
    for (let y = Math.max(0, cell.y - h + 1); y <= Math.min(cell.y, size - h); y++) {
      for (let x = Math.max(0, cell.x - w + 1); x <= Math.min(cell.x, size - w); x++) {
        const position = draftPosition(key, x, y);
        const center = itemCenter(key, position, g);
        choices.push({
          position,
          distance: (center.x - point.x) ** 2 + (center.y - point.y) ** 2,
          error: checkPlacement(key, position)
        });
      }
    }
    choices.sort((a, b) => a.distance - b.distance);
    const available = choices.filter(choice => !choice.error);
    tapPreview = { key, cell, choices: available.length ? available : [choices[0]], index: 0 };
    announcePreview();
  }
  function announcePreview() {
    const { key, index, choices } = tapPreview;
    const { position, error } = choices[index];
    if (error) {
      say(error, 'error');
      return;
    }
    const { w, h } = items[key];
    say(items[key].label + '预览占 ' + w * h + ' 格，从第 ' + (position.y + 1) + ' 行第 ' + (position.x + 1) + ' 格起。' +
      (choices.length > 1 ? '可以换个位置，或确认放下。' : '确认后放入餐盒。'));
  }
  function getPlacementPreview(g) {
    if (held?.active) {
      const position = dragTarget(held.point, g, held);
      return position && { key: held.key, position, error: checkPlacement(held.key, position), mode: 'drag' };
    }
    if (!tapPreview) return null;
    const { key, choices, index } = tapPreview;
    const { position, error } = choices[index];
    return { key, position, error, mode: 'tap', alternatives: choices.length };
  }
  function confirmPreview() {
    const { key, choices, index } = tapPreview;
    const { position, error } = choices[index];
    if (!error) put(key, position);
  }
  function rotateSelected(g) {
    if (!canRotate(selected)) {
      say('先选一件长条餐品，再旋转。');
      return;
    }
    const position = placed.get(selected);
    const cell = tapPreview?.cell || (position && gridCell(itemCenter(selected, position, g), g));
    if (!rotations.delete(selected)) rotations.add(selected);
    if (cell) {
      makeTapPreview(selected, cell, cellCenter(cell, g), g);
    } else {
      const { w, h } = dimensions(selected, rotations.has(selected));
      say(items[selected].label + '已转为' + (w > h ? '横放' : '竖放') + '，点餐盒试摆。');
    }
    sound('select');
  }

  function setDash(dash) {
    if (typeof ctx.setLineDash === 'function') {
      try { ctx.setLineDash(dash); } catch (_e) {}
    }
  }

  function round(x, y, w, h, radius, fill, stroke, lineWidth = 1) {
    const r = Math.max(0, Math.min(Number(radius) || 0, Math.abs(w) / 2, Math.abs(h) / 2));
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
  }
  function path(points, fill, stroke, lineWidth = 1) {
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    for (const point of points.slice(1)) ctx.lineTo(...point);
    if (fill) { ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
  }
  function ellipse(x, y, rx, ry, fill, stroke, lineWidth = 1) {
    ctx.beginPath();
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(rx, ry);
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.restore();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
  }
  function label(content, x, y, size, color = colors.ink, weight = 600, align = 'left') {
    ctx.font = weight + ' ' + size + 'px ' + font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillText(content, x, y);
  }
  function rule(x1, x2, y, fill) {
    ctx.save();
    setDash([4, 5]);
    path([[x1, y], [x2, y]], null, fill, 1);
    ctx.restore();
  }
  function button(r, title, fill = colors.red, edge = '#72291d') {
    round(r.x, r.y + 4, r.w, r.h, 13, edge);
    round(r.x, r.y, r.w, r.h, 13, fill);
    label(title, r.x + r.w / 2, r.y + r.h / 2, 19, colors.white, 750, 'center');
  }
  function secondaryButton(r, title) {
    round(r.x, r.y, r.w, r.h, 12, colors.paper, '#bf9c66', 1.5);
    label(title, r.x + r.w / 2, r.y + r.h / 2, 15, colors.red, 750, 'center');
  }

  const renderArt = {
    hero() {
      ellipse(49, 78, 37, 6, '#3d27162e');
      round(14, 61, 72, 15, 8, '#e69e4e', '#71371c', 2.7);
      round(10, 54, 80, 16, 8, '#884222', '#623217', 2.5);
      path([[11, 53], [29, 48], [44, 53], [53, 61], [64, 53], [88, 50], [87, 57], [13, 59]], '#ffcc48', '#ac6722', 1.4);
      path([[10, 50], [21, 45], [32, 49], [44, 44], [55, 50], [67, 46], [81, 48], [90, 47], [88, 54], [11, 55]], '#77934b', '#426032', 2);
      round(13, 44, 74, 7, 4, '#e4583a', '#a82f22', 1.4);
      ctx.beginPath();
      ctx.moveTo(10, 44);
      ctx.bezierCurveTo(11, 25, 28, 14, 49, 14);
      ctx.bezierCurveTo(72, 14, 87, 25, 90, 45);
      ctx.quadraticCurveTo(52, 51, 10, 44);
      const bun = ctx.createLinearGradient(0, 14, 0, 50);
      bun.addColorStop(0, '#ffd187');
      bun.addColorStop(1, '#e89b48');
      ctx.fillStyle = bun;
      ctx.fill();
      ctx.strokeStyle = '#71371c';
      ctx.lineWidth = 2.7;
      ctx.stroke();
      for (const [x, y] of [[27, 32], [41, 25], [54, 34], [68, 26], [74, 37]]) {
        ellipse(x, y, 2.7, 1.35, '#fff3c5');
      }
    },
    pickup() {
      ellipse(49, 90, 26, 5, '#3d27162e');
      path([[51, 41], [53, 14], [65, 6]], null, '#934837', 7);
      path([[51, 40], [53, 14], [65, 6]], null, '#f5866b', 4);
      path([[24, 31], [76, 31], [67, 84], [33, 84]], '#6bbed4', '#325a66', 2.7);
      path([[29, 61], [71, 61], [67, 79], [33, 79]], '#c5e9ef');
      round(21, 25, 58, 12, 5, '#edf9f1', '#325a66', 2.5);
      ellipse(50, 53, 12, 11, '#eff8ec');
      path([[50, 46], [50, 59]], null, '#49869c', 2);
      path([[44, 49], [56, 56]], null, '#49869c', 2);
      path([[44, 56], [56, 49]], null, '#49869c', 2);
      path([[32, 41], [35, 55]], null, '#e4f8fb', 2.5);
    },
    fries() {
      ellipse(50, 87, 27, 5, '#3d27162e');
      for (const [x, y, w, h, angle] of [
        [25, 19, 10, 47, -.21], [40, 11, 10, 51, -.10],
        [53, 8, 10, 49, .11], [64, 19, 10, 46, .23], [76, 29, 8, 33, .29]
      ]) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        round(-w / 2, 0, w, h, 2, '#fbd462', '#af7532', 2);
        path([[-1, 5], [-1, h - 6]], null, '#fff2a7', 1.5);
        ctx.restore();
      }
      path([[22, 44], [36, 49], [65, 49], [79, 44], [70, 82], [31, 82]], '#c74332', '#7b3024', 2.6);
      path([[36, 51], [42, 80], [58, 80], [65, 51]], '#e46543');
      ellipse(50, 65, 9, 7, '#ffdf85');
    },
    rings() {
      ellipse(50, 77, 36, 7, '#3d271629');
      for (const [x, y, sx] of [[33, 56, 1], [64, 53, 1], [52, 42, .92]]) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-.30);
        ctx.beginPath();
        ctx.save();
        ctx.scale(24 * sx, 17 * sx);
        ctx.arc(0, 0, 1, 0, Math.PI * 2, false);
        ctx.restore();
        ctx.save();
        ctx.scale(13 * sx, 8.5 * sx);
        ctx.arc(0, 0, 1, 0, Math.PI * 2, true);
        ctx.restore();
        ctx.fillStyle = '#dfa24b';
        ctx.fill('evenodd');
        ctx.strokeStyle = '#8f5429';
        ctx.lineWidth = 2.2;
        ctx.stroke();
        ctx.restore();
        for (const [dx, dy] of [[-15, 1], [-9, -10], [6, -12], [16, 1], [1, 12]]) {
          ellipse(x + dx * sx, y + dy * sx, 1.4, 1.15, '#ffe8a6');
        }
      }
    },
    sandwich() {
      ellipse(52, 79, 37, 7, '#3d27162e');
      path([[12, 68], [54, 25], [88, 62], [85, 74], [15, 78]], '#e4a458', '#79401f', 2.6);
      path([[13, 64], [55, 25], [88, 58], [83, 67], [72, 64], [60, 70], [48, 66], [34, 72], [22, 68], [14, 71]], '#7c9b51', '#4d6435', 1.5);
      path([[14, 60], [53, 21], [89, 55], [84, 61], [14, 66]], '#df6547', '#9e3e2a', 1.3);
      path([[13, 57], [50, 15], [88, 53], [83, 58], [16, 63]], '#f4cb82', '#79401f', 2.6);
      path([[21, 55], [50, 23], [78, 52], [24, 57]], '#ffe1a1');
      for (const [x, y] of [[39, 46], [50, 35], [56, 48], [66, 48]]) ellipse(x, y, 1.4, 1.15, '#d69e53');
    },
    sauce() {
      ellipse(50, 78, 30, 6, '#3d27162e');
      path([[17, 43], [83, 43], [75, 72], [25, 72]], '#f1c291', '#793e2d', 2.5);
      ellipse(50, 43, 36, 20, '#fff3d1', '#793e2d', 2.7);
      ellipse(50, 42, 29, 14, '#c94834', '#a73327', 1.4);
      ctx.beginPath();
      ctx.moveTo(31, 44);
      ctx.bezierCurveTo(37, 34, 56, 35, 61, 42);
      ctx.quadraticCurveTo(61, 49, 47, 49);
      ctx.strokeStyle = '#ff9870';
      ctx.lineWidth = 2.3;
      ctx.stroke();
    },
    soup() {
      ellipse(50, 81, 33, 6, '#3d27162e');
      path([[15, 50], [85, 50], [72, 76], [28, 76]], '#efe5cc', '#684b32', 2.7);
      path([[24, 65], [76, 65], [70, 76], [30, 76]], '#93b49b', '#684b32', 1.4);
      ellipse(50, 49, 36, 17, '#fff5dc', '#684b32', 2.5);
      ellipse(50, 49, 29, 11, '#e1a34f', '#b7793e', 1.7);
      ellipse(40, 47, 3, 2, '#758b49');
      ellipse(59, 52, 3, 2, '#758b49');
      for (const x of [43, 57]) {
        ctx.beginPath();
        ctx.moveTo(x, 35);
        ctx.bezierCurveTo(x + 9, 25, x - 9, 24, x, 13);
        ctx.strokeStyle = '#9d744d';
        ctx.lineWidth = 2.4;
        ctx.stroke();
      }
    }
  };
  const sprites = {};
  for (const [key, paint] of Object.entries(renderArt)) {
    try {
      const art = document.createElement('canvas');
      art.width = art.height = 256;
      ctx = art.getContext('2d');
      ctx.scale(2.56, 2.56);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      paint();
      sprites[key] = art;
    } catch (_e) {
      sprites[key] = null;
    }
  }
  ctx = screen;

  function sprite(key, x, y, size, rotated = false) {
    if (renderArt[key]) {
      ctx.save();
      ctx.translate(x, y);
      if (rotated) ctx.rotate(Math.PI / 2);
      const s = size / 100;
      ctx.scale(s, s);
      ctx.translate(-50, -50);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      renderArt[key]();
      ctx.restore();
      return;
    }
    if (sprites[key]) {
      if (!rotated) {
        ctx.drawImage(sprites[key], x - size / 2, y - size / 2, size, size);
      } else {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(sprites[key], -size / 2, -size / 2, size, size);
        ctx.restore();
      }
    }
  }

  function checker(y) {
    const step = 13;
    for (let col = 0; col < Math.ceil(width / step); col++) {
      ctx.fillStyle = col % 2 ? '#f5ce88' : '#c44a36';
      ctx.fillRect(col * step, y, step, step);
      ctx.fillStyle = col % 2 ? '#c44a36' : '#f5ce88';
      ctx.fillRect(col * step, y + step, step, step);
    }
  }
  function background() {
    ctx.fillStyle = colors.cream;
    ctx.fillRect(0, 0, width, height);
    for (let x = 8; x < width; x += 19) {
      path([[x, 0], [x, height]], null, '#d4a87323', 1);
    }
    ctx.fillStyle = colors.red;
    ctx.fillRect(0, 0, width, 5);
    ctx.fillStyle = '#ddab71';
    ctx.fillRect(0, height - 5, width, 5);
  }

  function drawStar(cx, cy, spikes, outerRadius, innerRadius, fill, stroke) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;
      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.4; ctx.stroke(); }
    ctx.restore();
  }

  function drawTitle(g) {
    checker(33);
    const topPillY = 16;
    const totalStars = getTotalStars();
    const totalCoins = getTotalCoins();
    round(20, topPillY, 110, 26, 13, '#ffffff45', '#b48752', 1);
    label('⭐ 星数: ' + totalStars, 75, topPillY + 13, 12, colors.ink, 750, 'center');
    round(138, topPillY, 110, 26, 13, '#ffffff45', '#b48752', 1);
    label('💰 小费: ' + totalCoins, 193, topPillY + 13, 12, colors.ink, 750, 'center');

    label('这单怎么装？', width / 2, 105, 44, colors.red, 900, 'center');
    label(levels.length + ' 关闯关 · ' + customOrders.length + ' 位常客 · 每日特惠', width / 2, 145, 15, colors.subtle, 650, 'center');
    const center = 315 + (height - 720) * .35;
    ctx.save();
    ctx.translate(width / 2, center);
    ctx.rotate(-.08);
    ellipse(7, 125, 144, 19, '#7d4c3026');
    path([[-135, 19], [-112, -107], [112, -107], [135, 19]], '#d69554', colors.ink, 3);
    path([[-122, 10], [-103, -93], [103, -93], [122, 10]], '#ffdea4', '#946034', 2);
    rule(-91, 91, -78, '#b57d48');
    label('今日外卖', 0, -55, 19, colors.red, 800, 'center');
    path([[-135, 20], [135, 20], [151, 92], [-151, 92]], '#ecb97b', colors.ink, 3);
    path([[-135, 26], [135, 26], [139, 79], [-139, 79]], '#a57550', '#8b5635', 2);
    path([[-151, 89], [151, 89], [137, 121], [-138, 121]], '#d69c61', colors.ink, 3);
    path([[-137, 100], [-23, 100]], null, '#edbb81', 2);
    path([[23, 100], [137, 100]], null, '#edbb81', 2);
    round(-17, 90, 34, 20, 4, '#a46a43');
    sprite('hero', -56, 32, 144);
    sprite('fries', 31, 31, 91);
    sprite('pickup', 92, 23, 99);
    ctx.restore();

    button(g.start, '开始打包 (闯关模式)');
    secondaryButton(g.customStart, '自选套餐 · ' + customOrders.length + ' 位客人');

    const todayStr = new Date().toISOString().slice(0, 10);
    const isDailyDone = saveState.dailyDate === todayStr;
    round(g.dailyStart.x, g.dailyStart.y, g.dailyStart.w, g.dailyStart.h, 10, isDailyDone ? '#e2d3b5' : colors.tomato, '#b48752', 1.5);
    label(isDailyDone ? '今日已打卡 √' : '今日特惠 ⭐+50', g.dailyStart.x + g.dailyStart.w / 2, g.dailyStart.y + 22, 13, isDailyDone ? colors.subtle : '#ffffff', 800, 'center');

    round(g.albumBtn.x, g.albumBtn.y, g.albumBtn.w, g.albumBtn.h, 10, colors.paper, '#b48752', 1.5);
    label('常客好评 📖', g.albumBtn.x + g.albumBtn.w / 2, g.albumBtn.y + 22, 13, colors.ink, 800, 'center');

    label('支持拖动，也可以点选摆放', width / 2, height - 20, 13, colors.subtle, 550, 'center');
  }

  function drawHeader(g) {
    label('这单怎么装？', 26, g.header + 19, 22, colors.red, 850);
    round(130, g.mute.y, 58, g.mute.h, 13, '#ffffff55', '#d6b887', 1);
    label('💰' + (saveState.coins || 0), 159, g.mute.y + 14, 12, colors.ink, 750, 'center');
    round(g.mute.x, g.mute.y, g.mute.w, g.mute.h, 13, colors.paper, '#d6b887', 1);
    label(muted ? '🔇 静音' : '🔈 声音', g.mute.x + g.mute.w / 2, g.mute.y + 14, 12, colors.ink, 750, 'center');
    if (customMode) {
      label((isDailyMode ? '⭐ 今日特惠 ' : '客单 ') + (levelIndex + 1) + ' / ' + customOrders.length, 26, 78, 14, isDailyMode ? colors.tomato : colors.ink, 750);
      secondaryButton(g.home, '回到首页');
    } else {
      label('订单 ' + (levelIndex + 1) + ' / ' + levels.length, 26, 78, 14, colors.ink, 750);
      const step = 145 / levels.length;
      for (let i = 0; i < levels.length; i++) {
        const fill = i < levelIndex || phase === 'won' ? colors.green : i === levelIndex ? colors.tomato : '#d9bb88';
        round(112 + i * step, 74, step - 5, 7, 3.5, fill);
      }
    }
    const r = g.receipt;
    round(r.x + 2, r.y + 4, r.w, r.h, 11, '#d5ae77');
    round(r.x, r.y, r.w, r.h, 11, colors.paper);
    const level = currentLevel();
    label(customMode ? level.guest + ' · ' + level.title : level.title, r.x + 15, r.y + 20, 19, colors.ink, 800);
    label('已装 ' + placed.size + '/' + requiredFoodCount(), r.x + r.w - 15, r.y + 20, 14, colors.green, 700, 'right');
    const lines = level.instruction;
    const compact = lines.length > 3;
    rule(r.x + 15, r.x + r.w - 15, r.y + (compact ? 34 : 38), '#c7a77b');
    const lineStep = compact ? 16 : lines.length > 2 ? 17 : 19;
    const firstLine = r.y + (compact ? 46 : 54);
    lines.forEach((line, i) => label(line, r.x + 15, firstLine + i * lineStep, compact ? 14 : 15, colors.subtle, 650));
  }

  function drawFoodOnBoard(key, x, y, w, h, { alpha = 1, emphasized = false, rotated = false } = {}) {
    const item = items[key];
    ctx.save();
    ctx.globalAlpha = alpha;
    round(x, y + 2.5, w, h, 10, item.edge);
    round(x, y, w, h, 10, item.shade, emphasized ? colors.red : item.edge, emphasized ? 2 : 1);
    round(x + 4, y + 4, w - 8, h - 8, 7, null, '#fff6d56e');
    const icon = Math.min(w * .78, h * .85, key === 'hero' ? 115 : 87);
    sprite(key, x + w / 2, y + h / 2, icon, rotated);
    ctx.restore();
  }
  function drawBoard(g, now, preview) {
    const r = g.board;
    const level = currentLevel();
    round(r.x - 5, r.y + 6, r.w + 10, r.h + 4, 22, '#b3875a');
    round(r.x - 5, r.y - 3, r.w + 10, r.h + 5, 22, '#eac38c', colors.kraft, 2);
    round(r.x + 5, r.y + 5, r.w - 10, r.h - 10, 15, '#ab7b55');
    const origin = g.inner;
    const unit = g.unit;
    for (let y = 0; y < level.size; y++) {
      for (let x = 0; x < level.size; x++) {
        const isCup = level.cup && x === level.cup.x && y === level.cup.y;
        const isSauceSlot = level.sauceSlot && x === level.sauceSlot.x && y === level.sauceSlot.y;
        const px = origin.x + x * unit;
        const py = origin.y + y * unit;
        if (level.dividers?.some(cell => cell.x === x && cell.y === y)) {
          round(px + 2, py + 2, unit - 4, unit - 4, 9, '#8b5e45', '#664333');
          path([[px + 16, py + unit - 16], [px + unit - 16, py + 16]], null, '#b88768', 1.5);
          path([[px + 13, py + unit - 26], [px + unit - 26, py + 13]], null, '#b88768', 1.5);
          path([[px + 26, py + unit - 13], [px + unit - 13, py + 26]], null, '#b88768', 1.5);
          continue;
        }
        const base = level.mainRight && x >= Math.ceil(level.size / 2) ? '#ecd097' : '#f5dfb3';
        round(px + 2, py + 2, unit - 4, unit - 4, 9, isCup ? colors.paleBlue : isSauceSlot ? '#f6cabb' : base);
        const reservedFor = isCup ? 'pickup' : isSauceSlot ? 'sauce' : null;
        if (reservedFor && !placed.has(reservedFor)) {
          const cx = px + unit / 2;
          const cy = py + unit / 2;
          ctx.save();
          setDash([3, 3]);
          ellipse(cx, cy, unit * .30, unit * .30, null, isCup ? '#4a8c9e' : '#b7594d', 2);
          ctx.restore();
          label(isCup ? '杯位' : '酱位', cx, cy, 13, isCup ? colors.blue : colors.red, 750, 'center');
        } else if (!reservedFor) {
          ellipse(px + unit / 2, py + unit / 2, 1.4, 1.4, '#d7b589');
        }
      }
    }
    if (level.mainRight) {
      const boundary = origin.x + Math.ceil(level.size / 2) * unit;
      ctx.save();
      setDash([5, 5]);
      path([[boundary, origin.y + 4], [boundary, origin.y + origin.h - 4]], null, '#f8e8bb', 2.5);
      ctx.restore();
    }
    for (const [key, pos] of placed) {
      const item = dimensions(key, pos.rotated);
      const dragged = held?.active && held.key === key;
      const bounce = !reduceMotion.matches && key === lastPiece ? Math.max(0, 1 - (now - placedAt) / 180) : 0;
      drawFoodOnBoard(key, origin.x + pos.x * unit + 3, origin.y + pos.y * unit + 3 - Math.sin(bounce * Math.PI) * 3,
        item.w * unit - 6, item.h * unit - 7,
        { alpha: dragged ? .25 : 1, emphasized: selected === key && !dragged, rotated: pos.rotated });
    }
    if (!preview && !held?.active && keyboardCell && phase === 'playing') {
      round(origin.x + keyboardCell.x * unit + 4, origin.y + keyboardCell.y * unit + 4, unit - 8, unit - 8, 8, null, colors.red, 2);
    }
    if (activeHint && activeHint.expires > now && !placed.has(activeHint.key)) {
      const { key, x, y, rotated } = activeHint;
      const { w, h } = dimensions(key, rotated);
      const px = origin.x + x * unit;
      const py = origin.y + y * unit;
      const bw = w * unit;
      const bh = h * unit;
      const pulse = 0.5 + 0.35 * Math.sin(now / 160);
      ctx.save();
      setDash([5, 4]);
      round(px + 3, py + 3, bw - 6, bh - 6, 12, 'rgba(245, 158, 11, ' + (pulse * 0.25) + ')', 'rgba(217, 119, 6, ' + pulse + ')', 3);
      label('💡 放这里', px + bw / 2, py + bh / 2, Math.min(15, unit * 0.35), '#78350f', 800, 'center');
      ctx.restore();
    }
    if (!preview) return;
    const { key, position, error } = preview;
    const { w, h } = dimensions(key, position.rotated);
    const x = origin.x + position.x * unit;
    const y = origin.y + position.y * unit;
    drawFoodOnBoard(key, x + 3, y + 3, w * unit - 6, h * unit - 7, { alpha: .68, rotated: position.rotated });
    for (let row = 0; row < h; row++) {
      for (let column = 0; column < w; column++) {
        round(x + column * unit + 3, y + row * unit + 3, unit - 6, unit - 6, 8,
          error ? '#b8353147' : '#79ad5947', error ? colors.red : colors.green, 2.5);
      }
    }
  }

  function drawShape(item, x, y) {
    const side = 5;
    const gap = 1.4;
    const w = item.w * (side + gap) - gap;
    const h = item.h * (side + gap) - gap;
    for (let row = 0; row < item.h; row++) {
      for (let col = 0; col < item.w; col++) {
        round(x - w / 2 + col * (side + gap), y - h / 2 + row * (side + gap), side, side, 1.2, item.edge);
      }
    }
  }
  function drawTray(g) {
    label('备餐台', 27, g.foodLabelY, 14, colors.subtle, 770);
    const level = currentLevel();
    const nextLateFood = Object.keys(level.lateFoods || {}).find(isWaitingForFood);
    const sides = level.sauceSides || [];
    const main = packedMain();
    const mainSides = level.mainSides || [];
    const foodPairs = level.foodPairs || [];
    const pairRules = [...sides, ...(level.sauceApart || [])];
    const pairTarget = pairRules.length + Number(Boolean(level.sauceOpposite)) +
      Number(Boolean(level.mainDips)) + mainSides.length + foodPairs.length;
    let pairCount = 0;
    if (placed.has('sauce')) {
      pairCount = pairRules.filter(key => placed.has(key)).length;
      if (level.sauceOpposite && sides.every(key => placed.has(key))) pairCount++;
      if (level.mainDips && main) pairCount++;
    }
    if (main) pairCount += mainSides.filter(key => placed.has(key)).length;
    pairCount += foodPairs.filter(([first, second]) => placed.has(first) && placed.has(second)).length;
    const paired = pairTarget > 0 && pairCount === pairTarget;
    let trayHint = level.cup ? '冰饮先找杯位' : '可随时调整摆放';
    if (sides.length === 1) trayHint = paired ? '薯条和蘸酱已贴边' : '薯条和蘸酱要贴边';
    if (sides.length > 1) trayHint = '蘸酱搭配 ' + pairCount + '/' + sides.length;
    if (level.mainChoices) trayHint = '主食 ' + Number(Boolean(main)) + '/1  ·  搭配 ' + pairCount + '/' + pairTarget;
    if (nextLateFood) {
      const { after, requires } = level.lateFoods[nextLateFood];
      trayHint = requires && !placed.has(requires)
        ? '先装' + items[requires].label + '，' + items[nextLateFood].label + '再到'
        : '已装餐品 ' + placed.size + '/' + after + '，' + items[nextLateFood].label + '再到';
    }
    const trayReady = !nextLateFood && paired && (!level.mainChoices || main);
    label(trayHint, width - 27, g.foodLabelY, 13, trayReady ? colors.green : colors.subtle, 650, 'right');
    for (const card of g.tray) {
      const { x, y, w, h, key } = card;
      const item = items[key];
      const stowed = placed.has(key);
      const waiting = isWaitingForFood(key);
      const highlight = selected === key;
      const rotated = rotations.has(key);
      const pendingRotation = highlight && stowed && rotated !== Boolean(placed.get(key).rotated);
      const mid = x + w / 2;
      round(x, y + 3, w, h, 11, '#d7b584');
      round(x, y, w, h, 11, highlight ? '#fff6d5' : stowed || waiting ? '#f6ecd0' : colors.paper,
        highlight ? colors.red : '#cdb17f', highlight ? 2.5 : 1);
      if (waiting) {
        ctx.save();
        ctx.globalAlpha = .5;
        sprite(key, mid, y + 23, 40);
        ctx.restore();
      } else {
        sprite(key, mid, y + 23, 40, rotated);
      }
      label(item.label, mid, y + 48, 14, colors.ink, 720, 'center');
      if (waiting) label(key === 'soup' ? '待出锅' : '待上桌', mid, y + 64, 12, colors.subtle, 700, 'center');
      else if (stowed && !pendingRotation) label('已装', mid, y + 64, 12, colors.green, 700, 'center');
      else if (main && main !== key && level.mainChoices.includes(key)) label('备选', mid, y + 64, 12, colors.subtle, 700, 'center');
      else drawShape({ ...dimensions(key, rotated), edge: item.edge }, mid, y + 64);
      if (activeHint && activeHint.expires > now && activeHint.key === key) {
        round(x - 2, y - 2, w + 4, h + 4, 13, null, '#f59e0b', 2.5);
        label('💡', mid, y - 6, 13, '#f59e0b', 800, 'center');
      }
    }
    round(g.retry.x, g.retry.y, g.retry.w, 36, 10, colors.paper, '#c4a675', 1);
    label('重放', g.retry.x + g.retry.w / 2, g.retry.y + 19, 13, colors.red, 750, 'center');

    const canRotateItem = level.rotate && canRotate(selected);
    round(g.rotate.x, g.rotate.y, g.rotate.w, 36, 10, canRotateItem ? colors.paper : '#f0dfbe', canRotateItem ? colors.red : '#c4a675', 1);
    label('旋转', g.rotate.x + g.rotate.w / 2, g.rotate.y + 19, 13, canRotateItem ? colors.red : colors.subtle, 750, 'center');

    const canTakeOut = selected && placed.has(selected);
    round(g.takeOut.x, g.takeOut.y, g.takeOut.w, 36, 10, canTakeOut ? colors.paper : '#f0dfbe', canTakeOut ? colors.red : '#c4a675', 1);
    label('取出', g.takeOut.x + g.takeOut.w / 2, g.takeOut.y + 19, 13, canTakeOut ? colors.red : colors.subtle, 750, 'center');

    round(g.hintBtn.x, g.hintBtn.y + 3, g.hintBtn.w, 36, 10, '#9c6614');
    round(g.hintBtn.x, g.hintBtn.y, g.hintBtn.w, 36, 10, '#f59e0b');
    label('💡 提示', g.hintBtn.x + g.hintBtn.w / 2, g.hintBtn.y + 19, 13, '#451a03', 800, 'center');
  }

  function drawFeedback(g, preview) {
    const r = g.status;
    if (preview?.mode === 'tap' && !preview.error) {
      if (preview.alternatives > 1) {
        const a = g.alternate;
        round(a.x, a.y, a.w, 38, 10, colors.paper, '#bb9b6d');
        label('换个位置', a.x + a.w / 2, a.y + 19, 16, colors.ink, 750, 'center');
      } else {
        const { w, h } = items[preview.key];
        label('将占用 ' + w * h + ' 格', g.alternate.x + g.alternate.w / 2, r.y + 19, 15, colors.green, 750, 'center');
      }
      button({ ...g.confirm, h: 38 }, '放这里', colors.green, '#244632');
      return;
    }
    const current = held?.active ? {
      text: preview ? (preview.error || '松手放在这里。') : '把餐品拖到盒子里。',
      tone: preview?.error ? 'error' : preview ? 'success' : ''
    } : feedback;
    const fill = current.tone === 'error' ? '#f7d9c8' : current.tone === 'success' ? colors.mint : colors.tan;
    const ink = current.tone === 'error' ? colors.red : current.tone === 'success' ? colors.green : colors.subtle;
    round(r.x, r.y, r.w, r.h, 9, fill);
    label(current.text, width / 2, r.y + r.h / 2, 14, ink, 700, 'center');
  }

  function drawComplete(g, now) {
    if (now - completedAt < 160 && !reduceMotion.matches) return;
    const final = phase === 'won';
    ctx.fillStyle = '#3c251a72';
    ctx.fillRect(0, 0, width, height);
    const { x, y, w, h } = g.modal;
    round(x, y + 6, w, h, 19, '#6a3826');
    round(x, y, w, h, 19, colors.paper, '#b48752', 2);
    round(x + 16, y + 16, w - 32, 6, 3, colors.tomato);

    // 3 Golden Stars
    const starY = y + 46;
    for (let s = 0; s < 3; s++) {
      const starX = width / 2 + (s - 1) * 36;
      drawStar(starX, starY, 5, 14, 7, s < lastEarnedStars ? '#f59e0b' : '#e2d4bc', '#b48752');
    }

    const tipBonus = (lastTipEarned || 15) * rewardMultiplier;

    if (customMode) {
      const level = currentLevel();
      const story = customerStories[level.guest] || { quote: '打包得真好！' };
      label(final ? customOrders.length + ' 位客人都出餐了！' : level.guest + ' 这单装好了！',
        width / 2, y + 74, 22, colors.red, 850, 'center');
      label(story.quote, width / 2, y + 96, 12, colors.ink, 650, 'center');
      label('基础小费 +' + lastTipEarned + ' 💰 · 累计: ' + (saveState.coins || 0) + ' · 主食: ' + servedMains[levelIndex].size + '/' + level.mainChoices.length,
        width / 2, y + 116, 12, colors.green, 700, 'center');

      button(g.tripleClaim, '🎬 3倍小费出餐 (+' + tipBonus + ' 💰)', '#e28821', '#8f4f0e');
      secondaryButton(g.customNext, final ? '再接一轮' : '普通出餐 (下一单)');
      secondaryButton(g.customRetry, '重做本单');
      round(g.customHome.x, g.customHome.y, g.customHome.w, g.customHome.h, 12, colors.paper, '#bf9c66', 1.5);
      label('回到首页', g.customHome.x + g.customHome.w / 2, g.customHome.y + g.customHome.h / 2,
        14, colors.red, 750, 'center');
      return;
    }
    label(final ? finishText : '打包成功！', width / 2, y + 74, 24, colors.red, 850, 'center');
    label('基础小费 +' + lastTipEarned + ' 💰 · 累计小费: ' + (saveState.coins || 0),
      width / 2, y + 98, 13, colors.green, 700, 'center');
    label(final ? '已完成全部 ' + levels.length + ' 关闯关' : '下一关 · ' + levels[levelIndex + 1].title,
      width / 2, y + 118, 12, colors.subtle, 650, 'center');
    button(g.tripleClaim, '🎬 3倍小费出餐 (+' + tipBonus + ' 💰)', '#e28821', '#8f4f0e');
    secondaryButton(g.advance, final ? '普通再玩一次' : '普通出餐 (下一关)');
  }

  function drawAlbum(g) {
    checker(33);
    label('常客好评图鉴', width / 2, 72, 26, colors.red, 850, 'center');
    const orderCount = customOrders.length;
    label('已服务 ' + Object.keys(saveState.stars || {}).filter(k => k.startsWith('c_')).length + ' / ' + orderCount + ' 位客人', width / 2, 98, 14, colors.subtle, 600, 'center');

    const card = customOrders[albumIndex];
    const story = customerStories[card.guest] || { role: '常客', quote: '“出餐速度很快，打包得真整齐！”' };
    const levelKey = 'c_' + albumIndex;
    const earnedStars = saveState.stars?.[levelKey] || 0;
    const served = servedMains[albumIndex] || new Set();

    const cx = 35;
    const cy = 118;
    const cw = width - 70;
    const ch = height - 240;
    round(cx + 3, cy + 5, cw, ch, 16, '#c49b6e');
    round(cx, cy, cw, ch, 16, colors.paper, '#b48752', 2);

    label(card.guest, width / 2, cy + 32, 24, colors.ink, 850, 'center');
    round(width / 2 - 45, cy + 44, 90, 20, 10, colors.tan);
    label(story.role, width / 2, cy + 58, 12, colors.subtle, 700, 'center');

    const previewFood = card.foods[0] === 'hero' ? 'hero' : 'sandwich';
    sprite(previewFood, width / 2, cy + 120, 88);

    for (let s = 0; s < 3; s++) {
      const starX = width / 2 + (s - 1) * 32;
      const starY = cy + 178;
      drawStar(starX, starY, 5, 12, 6, s < earnedStars ? '#f59e0b' : '#e2d4bc', '#b48752');
    }
    label(earnedStars > 0 ? '已获 ' + earnedStars + ' 星评价' : '未曾接单', width / 2, cy + 200, 13, colors.subtle, 600, 'center');

    round(cx + 18, cy + 215, cw - 36, 62, 8, colors.cream, '#dbc39f', 1);
    label(story.quote, width / 2, cy + 248, 13, colors.ink, 650, 'center');

    const hasBurger = served.has('hero');
    const hasSandwich = served.has('sandwich');
    label('汉堡套餐: ' + (hasBurger ? '已达标 √' : '待尝试') + '    三明治: ' + (hasSandwich ? '已达标 √' : '待尝试'),
      width / 2, cy + ch - 18, 12, colors.subtle, 600, 'center');

    secondaryButton(g.albumPrev, '◀ 上位');
    button(g.albumPlay, '去接这单');
    secondaryButton(g.albumNext, '下位 ▶');
    label('返回首页', g.albumBack.x + g.albumBack.w / 2, g.albumBack.y + 18, 14, colors.red, 750, 'center');
  }

  function draw(now) {
    if (frameTime) fps = Math.round(1000 / Math.max(1, now - frameTime));
    frameTime = now;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = colors.dark;
    ctx.fillRect(0, 0, viewWidth, viewHeight);
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.clip();
    background();
    const g = geometry();
    if (phase === 'album') {
      drawAlbum(g);
    } else if (phase === 'title') {
      drawTitle(g);
    } else {
      const preview = getPlacementPreview(g);
      drawHeader(g);
      drawBoard(g, now, preview);
      drawFeedback(g, preview);
      drawTray(g);
      if (held?.active && !preview) {
        sprite(held.key, held.point.x, held.point.y - 26, 63, rotations.has(held.key));
      }
      if (phase !== 'playing') drawComplete(g, now);
    }
    ctx.restore();
    requestAnimationFrame(draw);
  }

  function sound(kind) {
    if (muted || !navigator.userActivation?.hasBeenActive) return;
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return;
    try {
      audio ??= new Context();
      if (audio.state === 'suspended') audio.resume().catch(() => {});
      const notes = { select: [530], place: [560, 730], error: [250], finish: [520, 660, 790] }[kind];
      notes.forEach((frequency, i) => {
        const startAt = audio.currentTime + i * .065;
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, startAt);
        gain.gain.setValueAtTime(.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(.068, startAt + .013);
        gain.gain.exponentialRampToValueAtTime(.0001, startAt + .10);
        osc.connect(gain).connect(audio.destination);
        osc.start(startAt);
        osc.stop(startAt + .11);
      });
    } catch {
      // Touch interaction continues on browsers that restrict synthesis.
    }
  }

  function point(event) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - r.left - offsetX) / scale,
      y: (event.clientY - r.top - offsetY) / scale
    };
  }
  function click(at, g) {
    if (phase === 'album') {
      if (inside(at, g.albumPrev)) {
        albumIndex = (albumIndex - 1 + customOrders.length) % customOrders.length;
        sound('select');
      } else if (inside(at, g.albumNext)) {
        albumIndex = (albumIndex + 1) % customOrders.length;
        sound('select');
      } else if (inside(at, g.albumPlay)) {
        start(albumIndex, true);
        sound('select');
      } else if (inside(at, g.albumBack)) {
        returnToTitle();
        sound('select');
      }
      return;
    }
    if (phase === 'title') {
      if (inside(at, g.customStart)) start(0, true);
      else if (inside(at, g.start) || inside(at, box(12, 170, 366, g.start.y - 170))) start(0, false);
      else if (inside(at, g.dailyStart)) {
        isDailyMode = true;
        const dayIdx = Math.floor(Date.now() / 86400000) % customOrders.length;
        start(dayIdx, true);
      } else if (inside(at, g.albumBtn)) {
        phase = 'album';
        albumIndex = 0;
      } else return;
      sound('select');
      return;
    }
    if (phase !== 'playing') {
      if (performance.now() - completedAt < 160) return;
      if (customMode && inside(at, g.customHome)) returnToTitle();
      else if (customMode && inside(at, g.customRetry)) start(levelIndex);
      else if (inside(at, g.tripleClaim)) claimTripleReward();
      else if (inside(at, customMode ? g.customNext : g.advance)) advance();
      return;
    }
    if (customMode && inside(at, g.home)) {
      returnToTitle();
      return;
    }
    if (inside(at, g.mute)) {
      muted = !muted;
      if (!muted) sound('select');
      return;
    }
    if (inside(at, g.hintBtn)) {
      triggerHint();
      return;
    }
    if (inside(at, g.retry)) {
      start(levelIndex);
      return;
    }
    if (currentLevel().rotate && inside(at, g.rotate)) {
      rotateSelected(g);
      return;
    }
    if (inside(at, g.takeOut) && selected && placed.has(selected)) {
      remove(selected);
      return;
    }
    if (tapPreview && !tapPreview.choices[tapPreview.index].error) {
      if (inside(at, g.confirm)) {
        confirmPreview();
        return;
      }
      if (tapPreview.choices.length > 1 && inside(at, g.alternate)) {
        tapPreview.index = (tapPreview.index + 1) % tapPreview.choices.length;
        announcePreview();
        return;
      }
    }
    const food = g.tray.find(card => inside(at, card));
    if (food) {
      pick(food.key);
      return;
    }
    const cell = gridCell(at, g);
    if (!cell) return;
    interactWithCell(cell, at, g);
  }
  function interactWithCell(cell, at, g) {
    if (selected) {
      if (isMultiCell(selected)) makeTapPreview(selected, cell, at, g);
      else put(selected, cell);
      return;
    }
    const piece = occupant(cell);
    if (piece) pick(piece);
    else say(currentLevel().hint);
  }
  function advance() {
    clearedCountSinceAd++;
    if (clearedCountSinceAd >= 2) {
      if (typeof window !== 'undefined' && window.GAME && typeof window.GAME.showInterstitialAd === 'function') {
        window.GAME.showInterstitialAd();
      }
      clearedCountSinceAd = 0;
    }
    start(phase === 'won' ? 0 : levelIndex + 1);
    sound('select');
  }

  function triggerHint() {
    if (phase !== 'playing') return;
    const level = currentLevel();
    if (activeHint && activeHint.expires > performance.now()) {
      say('提示：请将' + items[activeHint.key].label + '放入闪烁的格子里。');
      return;
    }
    const doShowHint = () => {
      const solution = level.solution || [];
      let target = null;
      for (const step of solution) {
        const [k, x, y, rot] = step;
        const currPos = placed.get(k);
        const currRot = rotations.has(k);
        if (!currPos || currPos.x !== x || currPos.y !== y || (rot && !currRot)) {
          target = { key: k, x, y, rotated: !!rot };
          break;
        }
      }
      if (!target && solution.length > 0) {
        target = { key: solution[0][0], x: solution[0][1], y: solution[0][2], rotated: !!solution[0][3] };
      }
      if (target) {
        activeHint = { ...target, expires: performance.now() + 10000 };
        if (target.rotated) rotations.add(target.key);
        else rotations.delete(target.key);
        selected = target.key;
        sound('select');
        if (typeof window !== 'undefined' && window.GAME?.vibrateShort) {
          window.GAME.vibrateShort('medium');
        }
        say('💡 提示：将 ' + items[target.key].label + ' 放入第 ' + (target.y + 1) + ' 行第 ' + (target.x + 1) + ' 格。');
      } else {
        say('💡 仔细观察小票要求，相信你能独立完成！');
      }
    };

    if (typeof window !== 'undefined' && window.GAME && typeof window.GAME.watchRewardedAd === 'function') {
      window.GAME.watchRewardedAd('hint', doShowHint);
    } else {
      doShowHint();
    }
  }

  function claimTripleReward() {
    if (claimedTriple) {
      advance();
      return;
    }
    const doTriple = () => {
      claimedTriple = true;
      const base = lastTipEarned || 15;
      const bonus = base * (rewardMultiplier - 1);
      saveState.coins = (saveState.coins || 0) + bonus;
      lastTipEarned += bonus;
      saveGame();
      sound('select');
      if (typeof window !== 'undefined' && window.GAME?.vibrateShort) {
        window.GAME.vibrateShort('heavy');
      }
      if (typeof wx !== 'undefined' && wx.showToast) {
        try { wx.showToast({ title: '💰 3倍小费 +' + (base + bonus) + ' 到账！', icon: 'success', duration: 1500 }); } catch (_e) {}
      }
      setTimeout(advance, 500);
    };

    if (typeof window !== 'undefined' && window.GAME && typeof window.GAME.watchRewardedAd === 'function') {
      window.GAME.watchRewardedAd('tripleReward', doTriple);
    } else {
      doTriple();
    }
  }

  canvas.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0 || held) return;
    keyboardCell = null;
    const at = point(event);
    const g = geometry();
    const cell = gridCell(at, g);
    const card = g.tray.find(tile => inside(at, tile));
    const offered = phase === 'playing' ? card?.key || occupant(cell) : null;
    const waiting = offered && isWaitingForFood(offered) ? offered : null;
    const key = waiting ? null : offered;
    const position = key && !card ? placed.get(key) : null;
    const rotated = rotations.has(key);
    const matchesShape = position && Boolean(position.rotated) === rotated;
    const size = key ? dimensions(key, rotated) : { w: 0, h: 0 };
    held = {
      id: event.pointerId, point: at, start: at, key, waiting, active: false,
      grabX: matchesShape ? (at.x - g.inner.x) / g.unit - position.x : size.w / 2,
      grabY: matchesShape ? (at.y - g.inner.y) / g.unit - position.y : size.h / 2
    };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', event => {
    if (!held || held.id !== event.pointerId) return;
    held.point = point(event);
    if (held.key && !held.active && Math.hypot(held.point.x - held.start.x, held.point.y - held.start.y) >= 7) {
      held.active = true;
      pick(held.key);
    }
  });
  canvas.addEventListener('pointerup', event => {
    if (!held || held.id !== event.pointerId) return;
    const at = point(event);
    const g = geometry();
    const drag = held;
    held = null;
    if (drag.waiting) {
      pick(drag.waiting);
    } else if (drag.active) {
      const drop = dragTarget(at, g, drag);
      if (drop) put(drag.key, drop);
      else if (at.y >= g.foodLabelY && at.y <= g.trayY + 76 && placed.has(drag.key)) remove(drag.key);
      else say('没放进餐盒，再摆一次。');
    } else {
      click(at, g);
    }
  });
  function cancelPointer(event) {
    if (held?.id === event.pointerId) held = null;
  }
  canvas.addEventListener('pointercancel', cancelPointer);
  canvas.addEventListener('lostpointercapture', cancelPointer);
  window.addEventListener('blur', () => { held = null; });
  window.addEventListener('keydown', event => {
    if (phase === 'album') {
      if (event.key === 'Escape') returnToTitle();
      else if (event.key === 'ArrowLeft') {
        albumIndex = (albumIndex - 1 + customOrders.length) % customOrders.length;
      } else if (event.key === 'ArrowRight') {
        albumIndex = (albumIndex + 1) % customOrders.length;
      } else if (event.key === 'Enter') {
        start(albumIndex, true);
      }
      return;
    }
    if (phase === 'title' && event.key === '2') {
      start(0, true);
      return;
    }
    if (phase === 'title' && event.key === '3') {
      isDailyMode = true;
      const dayIdx = Math.floor(Date.now() / 86400000) % customOrders.length;
      start(dayIdx, true);
      return;
    }
    if (phase === 'title' && event.key === '4') {
      phase = 'album';
      albumIndex = 0;
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (phase === 'title') start(0, false);
      else if (phase !== 'playing') advance();
      else if (tapPreview) confirmPreview();
      else if (keyboardCell) {
        const g = geometry();
        interactWithCell(keyboardCell, cellCenter(keyboardCell, g), g);
      }
      return;
    }
    if (phase !== 'playing') return;
    const level = currentLevel();
    if (level.rotate && event.key.toLowerCase() === 'r' && !event.repeat) {
      rotateSelected(geometry());
      return;
    }
    const index = Number(event.key) - 1;
    if (Number.isInteger(index) && index >= 0 && index < level.foods.length) {
      keyboardCell ??= { x: 0, y: 0 };
      pick(level.foods[index]);
      return;
    }
    const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (directions[event.key]) {
      event.preventDefault();
      keyboardCell ??= { x: 0, y: 0 };
      const [dx, dy] = directions[event.key];
      keyboardCell.x = Math.min(level.size - 1, Math.max(0, keyboardCell.x + dx));
      keyboardCell.y = Math.min(level.size - 1, Math.max(0, keyboardCell.y + dy));
      if (selected && isMultiCell(selected)) {
        const g = geometry();
        makeTapPreview(selected, keyboardCell, cellCenter(keyboardCell, g), g);
      }
    } else if (event.key === 'Escape') {
      clearSelection();
      say(cues.ready);
    }
  });

  function resize() {
    viewWidth = (canvas && canvas.clientWidth) || (typeof window !== 'undefined' ? window.innerWidth : 390) || 390;
    viewHeight = (canvas && canvas.clientHeight) || (typeof window !== 'undefined' ? window.innerHeight : 720) || 720;
    const safeStyle = (live && typeof getComputedStyle === 'function') ? getComputedStyle(live) : null;
    const rawSafe = (typeof window !== 'undefined' && window.GAME && window.GAME.safeArea) || null;
    let wxTopInset = 0;
    let wxBottomInset = 0;
    if (rawSafe) {
      wxTopInset = Number(rawSafe.top) || 0;
      if (typeof rawSafe.bottom === 'number' && rawSafe.bottom > 0) {
        wxBottomInset = rawSafe.bottom >= viewHeight ? 0 : Math.max(0, viewHeight - rawSafe.bottom);
      }
    }
    const topInset = (safeStyle && parseFloat(safeStyle.paddingTop)) || wxTopInset || 0;
    const bottomInset = (safeStyle && parseFloat(safeStyle.paddingBottom)) || wxBottomInset || 0;
    const availableHeight = Math.max(300, viewHeight - topInset - bottomInset);
    dpr = Math.min(2, (typeof window !== 'undefined' && window.devicePixelRatio) || 1);
    scale = Math.min(viewWidth / width, availableHeight / 720, 1.18);
    height = Math.min(860, availableHeight / scale);
    offsetX = (viewWidth - width * scale) / 2;
    offsetY = topInset + (availableHeight - height * scale) / 2;
    if (canvas) {
      canvas.width = Math.round(viewWidth * dpr);
      canvas.height = Math.round(viewHeight * dpr);
    }
  }

  window.__gameState = () => ({
    phase: phase === 'order-complete' ? 'playing' : phase,
    screen: phase, level: levelIndex + 1, placed: Object.fromEntries(placed), feedback: feedback.text,
    mode: customMode ? 'custom' : 'campaign', main: packedMain() || null,
    guest: customMode ? currentLevel().guest : null, servedMains: customMode ? [...servedMains[levelIndex]] : [],
    soupWaiting: isWaitingForFood('soup'), sauceWaiting: isWaitingForFood('sauce'),
    waitingFoods: Object.keys(currentLevel().lateFoods || {}).filter(isWaitingForFood),
    preview: getPlacementPreview(geometry()), rotations: [...rotations],
    score: levelIndex + Number(phase === 'won'), hearts: 1, fps,
    stars: getTotalStars(), coins: getTotalCoins(), streak: saveState.streak || 0,
    hero: { x: width / 2, y: height / 2 }, pickups: [], enemies: [], world: { w: width, h: height }
  });
  window.__renderSlots = () => Object.fromEntries(
    Object.entries(sprites).map(([key, art]) => [key, art.toDataURL('image/png')])
  );
  window.__autoplay = () => {
    const now = performance.now();
    if (now - autoplayAt < 580 || phase === 'title' || phase === 'won') return;
    autoplayAt = now;
    if (phase === 'order-complete') {
      advance();
      return;
    }
    if (tapPreview) {
      confirmPreview();
      return;
    }
    const step = currentLevel().solution.find(([key]) => !placed.has(key));
    if (!step) return;
    const [key, x, y, rotated] = step;
    const g = geometry();
    pick(key);
    if (canRotate(key) && Boolean(rotated) !== rotations.has(key)) rotateSelected(g);
    const at = itemCenter(key, draftPosition(key, x, y), g);
    interactWithCell(gridCell(at, g), at, g);
  };

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(draw);
})();

