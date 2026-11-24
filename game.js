(() => {
  'use strict';

  const canvas = document.getElementById('game');
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
    sandwich: { label: '三明治', w: 3, h: 1, shade: '#d2e0a3', edge: '#7a9052' }
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
    }
  ];
  const cues = {
    ready: '拖动餐品，或轻点选中后再点餐盒。',
    noRoom: '超出餐盒了，往里挪一格。',
    overlap: '这里已经有餐品了。',
    heat: '热汉堡和冰饮不能挨边。',
    cup: '冰饮只能放进画圆的杯位。',
    reserved: '这个位置留给冰饮。',
    lift: '从餐盒取出了这件餐品。'
  };

  let phase = 'title';
  let levelIndex = 0;
  let placed = new Map();
  let selected = null;
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

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const live = document.createElement('div');
  live.setAttribute('aria-live', 'polite');
  live.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;' +
    'padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);';
  canvas.setAttribute('aria-label', '这单怎么装？用触屏拖动餐品，或按数字键选餐品，方向键定位，回车摆放。');
  document.body.append(live);

  function currentLevel() { return levels[levelIndex]; }
  function box(x, y, w, h) { return { x, y, w, h }; }
  function inside(p, r) {
    return p.x >= r.x && p.x < r.x + r.w && p.y >= r.y && p.y < r.y + r.h;
  }
  function covers(key, position, x, y) {
    const item = items[key];
    return position && x >= position.x && x < position.x + item.w &&
      y >= position.y && y < position.y + item.h;
  }
  function coversSameCell(a, aPos, b, bPos) {
    return aPos.x < bPos.x + items[b].w && aPos.x + items[a].w > bPos.x &&
      aPos.y < bPos.y + items[b].h && aPos.y + items[a].h > bPos.y;
  }
  function touchesHot(burger, drink) {
    return [
      [drink.x - 1, drink.y], [drink.x + 1, drink.y],
      [drink.x, drink.y - 1], [drink.x, drink.y + 1]
    ].some(([x, y]) => covers('hero', burger, x, y));
  }
  function checkPlacement(key, position) {
    const level = currentLevel();
    const { x, y } = position;
    const item = items[key];
    const reserve = level.cup;
    if (x < 0 || y < 0 || x + item.w > level.size || y + item.h > level.size) return cues.noRoom;
    if (reserve && key === 'pickup' && (x !== reserve.x || y !== reserve.y)) return cues.cup;
    if (reserve && key !== 'pickup' && covers(key, position, reserve.x, reserve.y)) return cues.reserved;
    for (const [other, otherPos] of placed) {
      if (other !== key && coversSameCell(key, position, other, otherPos)) return cues.overlap;
    }
    const hot = key === 'hero' ? position : placed.get('hero');
    const cold = key === 'pickup' ? position : placed.get('pickup') || reserve;
    if (level.heat && hot && cold && touchesHot(hot, cold)) return cues.heat;
    return '';
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
    live.textContent = text;
  }
  function pick(key) {
    selected = key;
    say('已选' + items[key].label + '，点餐盒里的左上落点。');
    sound('select');
  }
  function put(key, position) {
    const error = checkPlacement(key, position);
    if (error) {
      say(error, 'error');
      sound('error');
      return;
    }
    placed.set(key, position);
    selected = null;
    lastPiece = key;
    placedAt = performance.now();
    if (placed.size === currentLevel().foods.length) {
      phase = levelIndex === levels.length - 1 ? 'won' : 'order-complete';
      completedAt = placedAt;
      autoplayAt = placedAt;
      say(phase === 'won' ? '三单全部装好！' : '打包成功！', 'success');
      sound('finish');
    } else {
      say(items[key].label + '已入盒。', 'success');
      sound('place');
    }
  }
  function remove(key) {
    if (!placed.delete(key)) return;
    selected = key;
    say(cues.lift);
    sound('select');
  }
  function start(index) {
    phase = 'playing';
    levelIndex = index;
    placed = new Map();
    held = null;
    selected = null;
    keyboardCell = null;
    lastPiece = null;
    autoplayAt = performance.now();
    say(cues.ready);
  }

  function geometry() {
    const extra = height - 720;
    const level = currentLevel();
    const board = box(boardX, 218 + extra * .30, boardSize, boardSize);
    const inner = box(board.x + 10, board.y + 10, board.w - 20, board.h - 20);
    const trayY = 572 + extra * .70;
    const tileWidth = level.foods.length === 5 ? 64 : level.foods.length === 4 ? 78 : 91;
    const gap = level.foods.length === 5 ? 5 : 8;
    const rowWidth = level.foods.length * tileWidth + (level.foods.length - 1) * gap;
    return {
      header: 26, receipt: box(26, 105 + extra * .13, 338, 89),
      board, inner, unit: inner.w / level.size,
      status: box(26, board.y + board.h + 18, 338, 33),
      foodLabelY: trayY - 14, trayY,
      tray: level.foods.map((key, i) => ({
        key, ...box((width - rowWidth) / 2 + i * (tileWidth + gap), trayY, tileWidth, 76)
      })),
      retry: box(26, trayY + 90, 92, 42),
      takeOut: box(262, trayY + 90, 102, 42),
      start: box(45, height - 135, 300, 60),
      mute: box(315, 16, 55, 44),
      modal: box(31, height / 2 - 108, 328, 220),
      advance: box(58, height / 2 + 38, 274, 53)
    };
  }
  function gridCell(point, g) {
    if (!inside(point, g.inner)) return null;
    return { x: Math.floor((point.x - g.inner.x) / g.unit), y: Math.floor((point.y - g.inner.y) / g.unit) };
  }
  function targetFor(point, g) {
    const cell = gridCell(point, g);
    return cell && held ? { x: cell.x - held.grabX, y: cell.y - held.grabY } : cell;
  }

  function round(x, y, w, h, radius, fill, stroke, lineWidth = 1) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
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
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
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
    ctx.setLineDash([4, 5]);
    path([[x1, y], [x2, y]], null, fill, 1);
    ctx.restore();
  }
  function button(r, title, fill = colors.red, edge = '#72291d') {
    round(r.x, r.y + 4, r.w, r.h, 13, edge);
    round(r.x, r.y, r.w, r.h, 13, fill);
    label(title, r.x + r.w / 2, r.y + r.h / 2, 19, colors.white, 750, 'center');
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
        const ring = new Path2D();
        ring.ellipse(x, y, 24 * sx, 17 * sx, -.30, 0, Math.PI * 2);
        ring.ellipse(x, y, 13 * sx, 8.5 * sx, -.30, 0, Math.PI * 2, true);
        ctx.fillStyle = '#dfa24b';
        ctx.fill(ring, 'evenodd');
        ctx.strokeStyle = '#8f5429';
        ctx.lineWidth = 2.2;
        ctx.stroke(ring);
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
    }
  };
  const sprites = {};
  for (const [key, paint] of Object.entries(renderArt)) {
    const art = document.createElement('canvas');
    art.width = art.height = 256;
    ctx = art.getContext('2d');
    ctx.scale(2.56, 2.56);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    paint();
    sprites[key] = art;
  }
  ctx = screen;
  function sprite(key, x, y, size) {
    ctx.drawImage(sprites[key], x - size / 2, y - size / 2, size, size);
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

  function drawTitle(g) {
    checker(33);
    label('这单怎么装？', width / 2, 118, 46, colors.red, 900, 'center');
    label('把餐品装进盒子，三单等你出餐。', width / 2, 161, 16, colors.subtle, 650, 'center');
    const center = 342 + (height - 720) * .40;
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
    button(g.start, '开始打包');
    label('支持拖动，也可以点选摆放', width / 2, g.start.y + 82, 14, colors.subtle, 550, 'center');
  }

  function drawHeader(g) {
    label('这单怎么装？', 26, g.header + 19, 24, colors.red, 850);
    round(g.mute.x, g.mute.y + 5, g.mute.w, 34, 10, colors.paper, '#d6b887', 1);
    label(muted ? '静音' : '音效开', g.mute.x + g.mute.w / 2, g.mute.y + 22, 13, colors.ink, 700, 'center');
    label('订单 ' + (levelIndex + 1) + ' / ' + levels.length, 26, 81, 14, colors.ink, 750);
    for (let i = 0; i < levels.length; i++) {
      const fill = i < levelIndex || phase === 'won' ? colors.green : i === levelIndex ? colors.tomato : '#d9bb88';
      round(200 + i * 57, 77, 50, 7, 3.5, fill);
    }
    const r = g.receipt;
    round(r.x + 2, r.y + 4, r.w, r.h, 11, '#d5ae77');
    round(r.x, r.y, r.w, r.h, 11, colors.paper);
    label(currentLevel().title, r.x + 15, r.y + 20, 19, colors.ink, 800);
    label('已装 ' + placed.size + '/' + currentLevel().foods.length, r.x + r.w - 15, r.y + 20, 14, colors.green, 700, 'right');
    rule(r.x + 15, r.x + r.w - 15, r.y + 38, '#c7a77b');
    currentLevel().instruction.forEach((line, i) => label(line, r.x + 15, r.y + 54 + i * 19, 15, colors.subtle, 650));
  }

  function drawFoodOnBoard(key, x, y, w, h, alpha = 1, emphasized = false) {
    const item = items[key];
    ctx.save();
    ctx.globalAlpha = alpha;
    round(x, y + 2.5, w, h, 10, item.edge);
    round(x, y, w, h, 10, item.shade, emphasized ? colors.red : item.edge, emphasized ? 2 : 1);
    round(x + 4, y + 4, w - 8, h - 8, 7, null, '#fff6d56e');
    const icon = Math.min(w * .78, h * .85, key === 'hero' ? 115 : 87);
    sprite(key, x + w / 2, y + h / 2, icon);
    ctx.restore();
  }
  function drawBoard(g, now) {
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
        const px = origin.x + x * unit;
        const py = origin.y + y * unit;
        round(px + 2, py + 2, unit - 4, unit - 4, 9, isCup ? colors.paleBlue : '#f5dfb3');
        if (isCup && !placed.has('pickup')) {
          const cx = px + unit / 2;
          const cy = py + unit / 2;
          ctx.save();
          ctx.setLineDash([3, 3]);
          ellipse(cx, cy, unit * .30, unit * .30, null, '#4a8c9e', 2);
          ctx.restore();
          label('杯位', cx, cy, 13, colors.blue, 750, 'center');
        } else if (!isCup) {
          ellipse(px + unit / 2, py + unit / 2, 1.4, 1.4, '#d7b589');
        }
      }
    }
    for (const [key, pos] of placed) {
      const item = items[key];
      const dragged = held?.active && held.key === key;
      const bounce = !reduceMotion.matches && key === lastPiece ? Math.max(0, 1 - (now - placedAt) / 180) : 0;
      drawFoodOnBoard(key, origin.x + pos.x * unit + 3, origin.y + pos.y * unit + 3 - Math.sin(bounce * Math.PI) * 3,
        item.w * unit - 6, item.h * unit - 7, dragged ? .25 : 1, selected === key && !dragged);
    }
    if (!held?.active && keyboardCell && phase === 'playing') {
      round(origin.x + keyboardCell.x * unit + 4, origin.y + keyboardCell.y * unit + 4, unit - 8, unit - 8, 8, null, colors.red, 2);
    }
    if (!held?.active) return;
    const drop = targetFor(held.point, g);
    if (!drop) return;
    const error = checkPlacement(held.key, drop);
    const item = items[held.key];
    ctx.save();
    round(origin.x, origin.y, origin.w, origin.h, 14);
    ctx.clip();
    const x = origin.x + drop.x * unit + 3;
    const y = origin.y + drop.y * unit + 3;
    const w = item.w * unit - 6;
    const h = item.h * unit - 6;
    if (!error) drawFoodOnBoard(held.key, x, y, w, h, .66);
    round(x, y, w, h, 9, error ? '#c5453337' : null, error ? colors.red : colors.green, 2.6);
    ctx.restore();
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
    label(level.cup ? '冰饮先找杯位' : '可随时调整摆放', width - 27, g.foodLabelY, 13, colors.subtle, 550, 'right');
    for (const card of g.tray) {
      const { x, y, w, h, key } = card;
      const item = items[key];
      const stowed = placed.has(key);
      const highlight = selected === key;
      const mid = x + w / 2;
      round(x, y + 3, w, h, 11, '#d7b584');
      round(x, y, w, h, 11, highlight ? '#fff6d5' : stowed ? '#f6ecd0' : colors.paper,
        highlight ? colors.red : '#cdb17f', highlight ? 2.5 : 1);
      sprite(key, mid, y + 23, 40);
      label(item.label, mid, y + 48, 14, colors.ink, 720, 'center');
      if (stowed) label('已装', mid, y + 64, 12, colors.green, 700, 'center');
      else drawShape(item, mid, y + 64);
    }
    label('重置本关', g.retry.x + 2, g.retry.y + 20, 14, colors.red, 700);
    if (selected && placed.has(selected)) {
      label('取出餐品', g.takeOut.x + g.takeOut.w - 2, g.takeOut.y + 20, 14, colors.red, 700, 'right');
    }
  }

  function drawFeedback(g) {
    const r = g.status;
    const drop = held?.active ? targetFor(held.point, g) : null;
    const error = drop ? checkPlacement(held.key, drop) : '';
    const current = held?.active ? {
      text: drop ? (error || '松手放在这里。') : '把餐品拖到盒子里。',
      tone: error ? 'error' : drop ? 'success' : ''
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
    label(final ? '三单全部装好！' : '打包成功！', width / 2, y + 66, 30, colors.red, 850, 'center');
    label(final ? '基础摆放 · 冷热分开 · 固定杯位' : '下一单 · ' + levels[levelIndex + 1].title,
      width / 2, y + 107, 15, colors.subtle, 650, 'center');
    button(g.advance, final ? '再玩一次' : '接下一单');
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
    if (phase === 'title') {
      drawTitle(g);
    } else {
      drawHeader(g);
      drawBoard(g, now);
      drawFeedback(g);
      drawTray(g);
      if (held?.active && !gridCell(held.point, g)) {
        sprite(held.key, held.point.x, held.point.y - 26, 63);
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
    if (phase === 'title') {
      if (inside(at, g.start) || inside(at, box(12, 180, 366, g.start.y - 180))) {
        start(0);
        sound('select');
      }
      return;
    }
    if (phase !== 'playing') {
      if (performance.now() - completedAt >= 160 && inside(at, g.advance)) advance();
      return;
    }
    if (inside(at, g.mute)) {
      muted = !muted;
      if (!muted) sound('select');
      return;
    }
    if (inside(at, g.retry)) {
      start(levelIndex);
      return;
    }
    if (inside(at, g.takeOut) && selected && placed.has(selected)) {
      remove(selected);
      return;
    }
    const food = g.tray.find(card => inside(at, card));
    if (food) {
      pick(food.key);
      return;
    }
    const cell = gridCell(at, g);
    if (!cell) return;
    interactWithCell(cell);
  }
  function interactWithCell(cell) {
    const piece = occupant(cell);
    if (piece && (!selected || selected === piece)) pick(piece);
    else if (selected) put(selected, cell);
    else say(currentLevel().hint);
  }
  function advance() {
    start(phase === 'won' ? 0 : levelIndex + 1);
    sound('select');
  }

  canvas.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0 || held) return;
    keyboardCell = null;
    const at = point(event);
    const g = geometry();
    const cell = gridCell(at, g);
    const card = g.tray.find(tile => inside(at, tile));
    const key = phase === 'playing' ? card?.key || occupant(cell) : null;
    const position = key && !card ? placed.get(key) : null;
    held = {
      id: event.pointerId, point: at, start: at, key, active: false,
      grabX: position ? cell.x - position.x : 0,
      grabY: position ? cell.y - position.y : 0
    };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', event => {
    if (!held || held.id !== event.pointerId) return;
    held.point = point(event);
    if (held.key && !held.active && Math.hypot(held.point.x - held.start.x, held.point.y - held.start.y) >= 7) {
      held.active = true;
      selected = held.key;
    }
  });
  canvas.addEventListener('pointerup', event => {
    if (!held || held.id !== event.pointerId) return;
    const at = point(event);
    const g = geometry();
    const drag = held;
    const drop = targetFor(at, g);
    held = null;
    if (drag.active) {
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
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (phase === 'title') start(0);
      else if (phase !== 'playing') advance();
      else if (keyboardCell) interactWithCell(keyboardCell);
      return;
    }
    if (phase !== 'playing') return;
    const level = currentLevel();
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
    } else if (event.key === 'Escape') {
      selected = null;
      say(cues.ready);
    }
  });

  function resize() {
    viewWidth = canvas.clientWidth || window.innerWidth;
    viewHeight = canvas.clientHeight || window.innerHeight;
    const safeStyle = getComputedStyle(live);
    const topInset = parseFloat(safeStyle.paddingTop) || 0;
    const bottomInset = parseFloat(safeStyle.paddingBottom) || 0;
    const availableHeight = Math.max(1, viewHeight - topInset - bottomInset);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    scale = Math.min(viewWidth / width, availableHeight / 720, 1.18);
    height = Math.min(860, availableHeight / scale);
    offsetX = (viewWidth - width * scale) / 2;
    offsetY = topInset + (availableHeight - height * scale) / 2;
    canvas.width = Math.round(viewWidth * dpr);
    canvas.height = Math.round(viewHeight * dpr);
  }

  window.__gameState = () => ({
    phase: phase === 'order-complete' ? 'playing' : phase,
    screen: phase, level: levelIndex + 1, placed: Object.fromEntries(placed), feedback: feedback.text,
    score: levelIndex + Number(phase === 'won'), hearts: 1, fps,
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
    const step = currentLevel().solution.find(([key]) => !placed.has(key));
    if (step) put(step[0], { x: step[1], y: step[2] });
  };

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(draw);
})();

