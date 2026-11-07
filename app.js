/* Любовь — это… : облако открыток, блики, коты */
(() => {
  'use strict';

  // ---------- Истории (порядок полёта) ----------
  const STORIES = [
    { f: 'c04', ru: 'Шептать на ушко: «Хочу арбуз»', en: 'Whisper in your ear: “I want a watermelon.”' },
    { f: 'c01', ru: 'Пережёвывать за неё еду', en: 'chewing her food for her.' },
    { f: 'c25', ru: 'Играть с котами лазерной указкой', en: 'Play with cats with a laser pointer' },
    { f: 'c16', ru: 'Бегать под дождём', en: 'Running in the rain.' },
    { f: 'c08', ru: 'Танцевать у поезда, провожая её', en: 'Dancing by the train seeing her off.' },
    { f: 'c03', ru: 'Брать его фото на работу', en: 'bringing his picture to work' },
    { f: 'c22', ru: 'Учить её качаться', en: 'Teach her to swing' },
    { f: 'c10', ru: 'Объедаться чизкейками', en: 'Overeating with cheesecakes' },
    { f: 'c27', ru: 'Готовить завтрак и рисовать сердечки в кофе', en: '…cooking her breakfast and drawing hearts in her coffee' },
    { f: 'c00', ru: 'Тот самый портрет карандашом', en: 'Настоящий рисунок из скетчбука', photo: true },
    { f: 'c14', ru: 'Ехать, куда ведёт дорога', en: '– driving wherever the road takes you' },
    { f: 'c11', ru: 'Смущать её на эскалаторе', en: 'Embarrassing her on the escalator' },
    { f: 'c23', ru: 'Принимать душ', en: 'Take a shower.' },
    { f: 'c18', ru: 'Мороженое в парке и «Адреналин» из Фикс Прайса', en: 'There’s an ice cream parlor in the park with Adrenaline Rush energy drinks from Fix Price.' },
    { f: 'c07', ru: 'Делать друг другу массаж', en: 'Giving each other massages' },
    { f: 'c30', ru: 'Печь блинчики‑сердечки', en: 'making heart-shaped pancakes' },
    { f: 'c05', ru: 'Смотреть ужастики под одеялом', en: 'watch horror movies together under the covers' },
    { f: 'c33', ru: 'Носить его одежду', en: 'Wear his clothes' },
    { f: 'c12', ru: 'Демонстрировать ему свои способности', en: 'Demonstrate your abilities to him.' },
    { f: 'c26', ru: 'Делать смешные фотки', en: 'Making funny pictures' },
    { f: 'c19', ru: 'Есть хот‑доги в парке', en: 'There are hot dogs in the park.' },
    { f: 'c13', ru: 'Искать квартиру', en: 'searching for an apartment.' },
    { f: 'c09', ru: 'Пить очень много чая', en: 'drinking lots of tea.' },
    { f: 'c29', ru: 'Мечтать о путешествиях вдвоём', en: 'Dream of traveling together' },
    { f: 'c02', ru: 'Удивлять своими талантами', en: 'Surprise with your talents.' },
    { f: 'c34', ru: 'Вместе не любить арендодателя', en: 'hating the landlord' },
    { f: 'c21', ru: 'Смотреть мультики вместе', en: '–watching cartoons together' },
    { f: 'c06', ru: 'Готовить ей завтрак', en: '…cooking her breakfast' },
    { f: 'c15', ru: 'Гулять вдвоём по лесу', en: 'walking together in the woods.' },
    { f: 'c24', ru: 'Кормить её сырками и детским пюре', en: 'feeding her cottage cheese bars and baby food.' },
    { f: 'c28', ru: 'Фоткаться в лифте в стильных образах', en: 'Take photos in the elevator in stylish outfits' },
    { f: 'c17', ru: 'Рисовать друг друга', en: 'Draw each other' },
    { f: 'c31', ru: 'Та самая фотка на работе', en: 'Настоящее фото: «Перерыв 15 минут»', photo: true },
    { f: 'c32', ru: 'Приносить ей еду на работу', en: 'bringing her food at work' },
    { f: 'c20', ru: 'Просто держаться за руки', en: 'Love is…' },
    { f: 'c35', ru: 'Есть кокосовое мороженое', en: '…eating coconut ice cream' },
  ];
  const N = STORIES.length;
  const small = s => `cards/${s.f}s.webp`;
  const large = s => `cards/${s.f}.webp`;
  const origLine = s => s.photo ? s.en : `На открытке: «${s.en.replace(/^[–\-…\s]+/, '')}»`;

  const html = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a = -1, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const $ = (s, r = document) => r.querySelector(s);

  // ---------- Пружинки (Эмиль: мышь + пружина, а не мышь напрямую) ----------
  function spring(k = 170, d = 24, x = 0) { return { x, v: 0, t: x, k, d }; }
  function step(s, dt) { const f = s.k * (s.t - s.x) - s.d * s.v; s.v += f * dt; s.x += s.v * dt; }

  // ---------- Сердечки-хлопушки ----------
  const HEART = '<svg viewBox="0 0 32 30"><use href="#heart"/></svg>';
  function burst(x, y, n = 10, colors = ['#f6e9e7', '#e8d36a', '#ff8a96']) {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      const el = document.createElement('span');
      el.className = 'pop';
      el.innerHTML = HEART;
      const sz = 12 + Math.random() * 16;
      el.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;z-index:9999;pointer-events:none;fill:${colors[i % colors.length]}`;
      document.body.appendChild(el);
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
      const dist = 50 + Math.random() * 90;
      const dx = Math.cos(a) * dist, dy = Math.sin(a) * dist - 30;
      el.animate([
        { transform: 'translate(-50%,-50%) scale(0.6)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${0.9 + Math.random() * 0.5}) rotate(${(Math.random() - 0.5) * 50}deg)`, opacity: 0 }
      ], { duration: 800 + Math.random() * 500, easing: 'cubic-bezier(0.23,1,0.32,1)' }).onfinish = () => el.remove();
    }
  }
  function say(cat, ms = 1500) {
    cat.classList.add('talking');
    clearTimeout(cat._t);
    cat._t = setTimeout(() => cat.classList.remove('talking'), ms);
  }

  // ---------- Состояние указателя / наклона ----------
  let W = innerWidth, H = innerHeight;
  const ptr = { x: W / 2, y: H / 2 };            // экранные координаты света
  const tilt = { x: spring(60, 14), y: spring(60, 14) }; // -1..1, сглажено
  const light = { x: spring(140, 22, W / 2), y: spring(140, 22, H / 2) };
  let usingGyro = false;

  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    ptr.x = e.clientX; ptr.y = e.clientY;
    tilt.x.t = clamp((e.clientX / W) * 2 - 1);
    tilt.y.t = clamp((e.clientY / H) * 2 - 1);
  }, { passive: true });

  let baseBeta = null;
  function onOrient(e) {
    if (e.gamma == null) return;
    usingGyro = true;
    if (baseBeta == null) baseBeta = e.beta;
    baseBeta = lerp(baseBeta, e.beta, 0.004);   // медленно подстраиваемся под то, как держат телефон
    const gx = clamp(e.gamma / 22), gy = clamp((e.beta - baseBeta) / 18);
    tilt.x.t = gx; tilt.y.t = gy;
    ptr.x = W / 2 + gx * W * 0.55; ptr.y = H / 2 + gy * H * 0.45;
  }
  function enableGyro() {
    const DOE = window.DeviceOrientationEvent;
    if (!DOE) return;
    if (typeof DOE.requestPermission === 'function') {
      DOE.requestPermission().then(r => { if (r === 'granted') addEventListener('deviceorientation', onOrient); }).catch(() => {});
    } else addEventListener('deviceorientation', onOrient);
  }
  if (!finePointer) {
    if (typeof window.DeviceOrientationEvent?.requestPermission === 'function') {
      addEventListener('touchend', enableGyro, { once: true });   // iOS спрашивает разрешение только по жесту
    } else enableGyro();
  }

  // ---------- Облако ----------
  const cloud = $('#cloud'), stage = $('.stage'), world = $('#world');
  const intro = $('.intro'), hint = $('.hint'), bar = $('.bar');
  const fly = !reduce;
  if (fly) html.classList.add('fly');

  const P = 1000, SP = 290;
  const TRAVEL = (N - 1) * SP + 360 + 340;   // последняя открытка пролетает мимо ровно к концу сцены
  const cards = STORIES.map((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'card';
    b.setAttribute('aria-label', `Открыть открытку: ${s.ru}`);
    b.style.setProperty('--r', `${((i * 53) % 17) - 8}deg`);
    b.innerHTML = `<img src="${small(s)}" width="420" height="630" alt="" decoding="async"><div class="glare"><i></i></div>`;
    world.appendChild(b);
    const c = {
      el: b, g: b.querySelector('.glare i'), i,
      x: 0, y: 0, z: -(i * SP + 360),
      rz: ((i * 53) % 17) - 8, ry: ((i * 31) % 21) - 10,
      ph: i * 1.7, hov: spring(220, 22), lx: spring(90, 15), ly: spring(90, 15), hidden: false, op: -1
    };
    b.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') c.hov.t = 1; });
    b.addEventListener('pointerleave', () => { c.hov.t = 0; });
    b.addEventListener('click', () => openViewer(i, 'cloud'));
    if (!fly) {   // россыпь без полёта: блик по наведению
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        const gx = (e.clientX - r.left) / r.width - 0.5, gy = (e.clientY - r.top) / r.height - 0.5;
        c.g.style.transform = `translate(${gx * 50}%, ${gy * 50}%)`;
      });
    }
    return c;
  });

  let cw = 200;
  function layout() {
    W = innerWidth; H = innerHeight;
    cw = cards[0].el.offsetWidth || 200;
    const narrow = W < 640;
    const rx = W * (narrow ? 0.44 : 0.4), ry = H * (narrow ? 0.34 : 0.38);
    cards.forEach((c, i) => {
      // первые три стоят по краям, чтобы не закрывать заголовок
      const HERO = [[Math.PI * 0.98, 1.32], [-0.42, 1.36], [0.36, 1.4]];
      const a = i < 3 ? HERO[i][0] : i * 2.39996 + 0.9;
      const rr = i < 3 ? HERO[i][1] : 0.92 + ((i * 0.618034) % 1) * 0.42;
      c.x = Math.cos(a) * rx * rr;
      c.y = Math.sin(a) * ry * rr;
      if (narrow && i < 3) {   // на телефоне первые три висят полосой над заголовком
        const T = [[-0.3, -0.31], [0.31, -0.29], [0.02, -0.35]][i];
        const s = P / (P - c.z);
        c.x = (T[0] * W) / s; c.y = (T[1] * H) / s;
      }
    });
    if (fly) cloud.style.setProperty('--cloud-h', `${H + TRAVEL * 0.5}px`);
  }
  layout();
  let lastW = W, lastH = H;
  addEventListener('resize', () => {
    if (innerWidth !== lastW || Math.abs(innerHeight - lastH) > 140) { lastW = innerWidth; lastH = innerHeight; layout(); resizeHearts(); }
  });

  const cam = spring(110, 22);
  function cloudProgress() {
    const r = cloud.getBoundingClientRect();
    const span = r.height - H;
    return span > 0 ? clamp(-r.top / span, 0, 1) : 0;
  }

  // ---------- Сердечки на фоне ----------
  const cv = $('.hearts'), ctx = cv.getContext('2d');
  const heartPath = new Path2D('M16 28 C6 21 2 15 2 10 C2 6 5 3 9 3 C12 3 14.5 5 16 7.5 C17.5 5 20 3 23 3 C27 3 30 6 30 10 C30 15 26 21 16 28Z');
  const earsPath = new Path2D('M4.5 7 L4 -2 L11 3.6 Z M27.5 7 L28 -2 L21 3.6 Z');
  let hearts = [], DPR = 1;
  function resizeHearts() {
    DPR = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.round(stage.clientWidth * DPR); cv.height = Math.round(stage.clientHeight * DPR);
    const count = W < 640 ? 18 : 30;
    hearts = Array.from({ length: count }, (_, i) => {
      const d = 0.25 + Math.random() * 0.75;
      return {
        x: Math.random() * W, y: Math.random() * H, d,
        s: (0.35 + d * 0.65) * (W < 640 ? 0.75 : 1),
        sp: 6 + d * 16, ph: Math.random() * 6.28, rot: (Math.random() - 0.5) * 0.5,
        cat: i % 4 === 0, a: 0.1 + d * 0.22, warm: i % 5 === 1
      };
    });
  }
  resizeHearts();
  function drawHearts(dt, t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (const h of hearts) {
      if (!reduce) { h.y -= h.sp * dt; if (h.y < -40) { h.y = H + 40; h.x = Math.random() * W; } }
      const px = h.x + Math.sin(t * 0.5 + h.ph) * 14 * h.d - tilt.x.x * 34 * h.d;
      const py = h.y - tilt.y.x * 22 * h.d;
      ctx.setTransform(DPR * h.s, 0, 0, DPR * h.s, px * DPR, py * DPR);
      ctx.rotate(h.rot + Math.sin(t * 0.7 + h.ph) * 0.12);
      ctx.translate(-16, -15);
      ctx.globalAlpha = h.a;
      ctx.fillStyle = h.warm ? '#ff8a96' : '#f6e9e7';
      ctx.fill(heartPath);
      if (h.cat) ctx.fill(earsPath);
    }
    ctx.globalAlpha = 1;
  }

  // ---------- Ричи ----------
  const richie = $('.cat-richie');
  const pupils = $('.pupils', richie), rHead = $('.richie-head', richie);
  const eye = { x: spring(200, 20), y: spring(200, 20) };
  function blinkLoop() {
    richie.classList.add('blink');
    setTimeout(() => richie.classList.remove('blink'), 200);
    setTimeout(blinkLoop, 2400 + Math.random() * 4200);
  }
  if (!reduce) setTimeout(blinkLoop, 1800);
  richie.addEventListener('click', () => {
    const r = richie.getBoundingClientRect();
    burst(r.left + r.width * 0.5, r.top + r.height * 0.25, 12);
    say(richie);
    rHead.style.transform = 'rotate(-9deg)';
    setTimeout(() => { rHead.style.transform = ''; }, 900);
  });


  // ---------- Лазерная указка ----------
  // Курсор — точка лазера. Ричи охотится, Шуша и Васька просыпаются, когда точка рядом.
  const laser = { x: -100, y: -100, on: false, still: 0, lastMove: 0, el: null };
  if (finePointer) {
    const el = document.createElement('div');
    el.className = 'laser';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<i class="laser-halo"></i><i class="laser-dot"></i>';
    document.body.appendChild(el);
    laser.el = el;
    html.classList.add('laser-on');
    const place = () => { el.style.transform = `translate3d(${laser.x}px, ${laser.y}px, 0)`; };
    addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      if (Math.hypot(e.clientX - laser.x, e.clientY - laser.y) > 4) laser.lastMove = performance.now();
      laser.x = e.clientX; laser.y = e.clientY;
      if (!laser.on) { laser.on = true; el.classList.add('on'); }
      el.classList.toggle('over', !!e.target.closest?.('a, button, .card'));
      place();     // курсор не должен отставать: позиция ставится сразу, без пружины
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => { laser.on = false; el.classList.remove('on'); });
    addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') el.classList.add('down'); });
    addEventListener('pointerup', () => el.classList.remove('down'));
  }
  // пока открыт диалог, лазер прячется под его слой — возвращаем обычный курсор
  const setModal = on => html.classList.toggle('modal-open', on);

  // Охота Ричи
  const hunt = { state: 'idle', near: 0, cool: 0 };
  const rPurr = $('.purr', richie);
  function richieHunt(now, dt) {
    if (!laser.el || !laser.on || reduce || html.classList.contains('modal-open')) { richie.classList.remove('hunt'); return; }
    const r = richie.getBoundingClientRect();
    if (r.bottom < 0 || r.top > H || getComputedStyle(richie).opacity === '0') return;
    const cx = r.left + r.width * 0.5, cy = r.top + r.height * 0.45;
    const d = Math.hypot(laser.x - cx, laser.y - cy);
    const near = d < Math.max(260, r.width * 2.2);
    richie.classList.toggle('hunt', near);
    if (hunt.state !== 'idle') return;
    const still = now - laser.lastMove > 260;
    hunt.near = near && still && now > hunt.cool ? hunt.near + dt : 0;
    if (hunt.near > 0.55) pounce(cx, cy);
  }
  function pounce(cx, cy) {
    hunt.state = 'crouch';
    richie.classList.add('crouch');
    setTimeout(() => {
      richie.classList.remove('crouch');
      hunt.state = 'jump';
      let dx = laser.x - cx, dy = laser.y - cy;
      const L = Math.hypot(dx, dy), max = 190;
      if (L > max) { dx *= max / L; dy *= max / L; }
      const lift = 70 + Math.min(60, L * 0.25);
      const a = richie.animate([
        { transform: 'translate(0,0) rotate(0deg)' },
        { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - lift}px) rotate(${dx > 0 ? 10 : -10}deg)`, offset: 0.45 },
        { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(1.04, 0.92)`, offset: 0.7 },
        { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(1)`, offset: 0.8 },
        { transform: 'translate(0,0) rotate(0deg)' }
      ], { duration: 1500, easing: 'cubic-bezier(0.37,0,0.63,1)' });
      setTimeout(() => {
        burst(laser.x, laser.y, 10);
        rPurr.textContent = 'поймал!';
        say(richie, 1300);
      }, 1500 * 0.68);
      a.onfinish = () => {
        hunt.state = 'idle'; hunt.near = 0; hunt.cool = performance.now() + 2600;
        setTimeout(() => { rPurr.textContent = 'мррр'; }, 1400);
      };
    }, 650);
  }

  // Шуша и Васька приоткрывают глаза, если точка рядом
  function sleepersWatch() {
    if (!laser.el || !laser.on) return;
    document.querySelectorAll('.cat-shusha, .cat-vasya').forEach(cat => {
      if (cat._s && cat.classList.contains('talking')) return;   // уже разбудили кликом
      const r = cat.getBoundingClientRect();
      if (!r.width || r.bottom < 0 || r.top > H) return;
      const d = Math.hypot(laser.x - (r.left + r.width / 2), laser.y - (r.top + r.height / 2));
      cat.classList.toggle('awake', d < Math.max(170, r.width * 0.9));
    });
  }

  // ---------- Шуша ----------
  const shusha = $('.cat-shusha');
  shusha.addEventListener('click', () => {
    const r = shusha.getBoundingClientRect();
    shusha.classList.add('awake');
    burst(r.left + r.width * 0.28, r.top + r.height * 0.3, 10);
    say(shusha, 1800);
    clearTimeout(shusha._s);
    shusha._s = setTimeout(() => shusha.classList.remove('awake'), 2400);
  });

  // ---------- Конверт ----------
  // Конверт открывается, письмо выезжает и разворачивается для чтения
  const env = $('.envelope'), envPaper = $('.paper');
  const lv = $('#letter-view'), lvSheet = $('.lv-sheet');
  lvSheet.innerHTML = $('.paper-inner').innerHTML;   // текст письма живёт в одном месте — в конверте
  let lvOpen = false;
  function openLetter() {
    if (lvOpen) return;
    lvOpen = true;
    lv.classList.remove('ready', 'closing');
    lv.showModal(); setModal(true);
    $('.lv-body', lv).scrollTop = 0;
    if (!reduce) {
      const to = lvSheet.getBoundingClientRect(), from = envPaper.getBoundingClientRect();
      const s = from.width / to.width;
      const dx = from.left + from.width / 2 - (to.left + to.width / 2);
      const dy = from.top - to.top;     // совмещаем верхние края: лист «вытягивается» из конверта
      lvSheet.animate([
        { transform: `translate(${dx}px, ${dy}px) scale(${s})`, transformOrigin: '50% 0' },
        { transform: 'translate(0,0) scale(1) rotate(-0.6deg)', transformOrigin: '50% 0' }
      ], { duration: 620, easing: 'cubic-bezier(0.32,0.72,0,1)' });
    }
    requestAnimationFrame(() => lv.classList.add('ready'));
  }
  function closeLetter() {
    if (!lvOpen || lv.classList.contains('closing')) return;
    lv.classList.add('closing');
    const done = () => {
      lv.close(); setModal(false); lv.classList.remove('closing', 'ready'); lvOpen = false;
      lvSheet.getAnimations().forEach(a => a.cancel());
      env.setAttribute('aria-expanded', 'false');
      setTimeout(() => env.classList.remove('open'), reduce ? 0 : 120);
    };
    if (reduce) return done();
    const to = envPaper.getBoundingClientRect(), from = lvSheet.getBoundingClientRect();
    const visibleEnv = to.bottom > 0 && to.top < H;
    if (!visibleEnv) return done();
    const s = to.width / from.width;
    lvSheet.animate([
      { transform: 'translate(0,0) scale(1) rotate(-0.6deg)', transformOrigin: '50% 0' },
      { transform: `translate(${to.left + to.width / 2 - (from.left + from.width / 2)}px, ${to.top - from.top}px) scale(${s})`, transformOrigin: '50% 0', opacity: 0.6 }
    ], { duration: 340, easing: 'cubic-bezier(0.23,1,0.32,1)', fill: 'forwards' }).onfinish = done;
  }
  env.addEventListener('click', () => {
    clearTimeout(env._t);
    if (env.classList.contains('open')) { openLetter(); return; }
    env.setAttribute('aria-expanded', 'true');
    const r = $('.env-seal').getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 14);
    env.classList.add('open');
    env._t = setTimeout(openLetter, reduce ? 0 : 1050);
  });
  $('.lv-close').addEventListener('click', closeLetter);
  lv.addEventListener('cancel', e => { e.preventDefault(); closeLetter(); });
  lv.addEventListener('click', e => { if (e.target === $('.lv-body', lv) || e.target === $('.veil', lv)) closeLetter(); });

  // ---------- Васька ----------
  const VASYA = `
    <svg viewBox="0 0 300 160" aria-hidden="true"><g filter="url(#sketch)">
      <path class="vasya-tail" d="M244 112 C280 118 296 142 270 152" fill="none" stroke="#7a6655" stroke-width="13" stroke-linecap="round"/>
      <path d="M204 96 L266 80" stroke="#8f7a66" stroke-width="18" stroke-linecap="round"/>
      <path d="M200 114 L262 128" stroke="#8f7a66" stroke-width="18" stroke-linecap="round"/>
      <path d="M226 90 l2 -8 M244 86 l2 -9 M222 118 l2 8 M242 122 l2 9" stroke="#4f4034" stroke-width="3.5" stroke-linecap="round"/>
      <ellipse cx="270" cy="79" rx="11" ry="8" fill="#3b2a24"/><ellipse cx="266" cy="129" rx="11" ry="8" fill="#3b2a24"/>
      <g class="vasya-body">
        <path d="M72 102 C72 72 112 60 160 62 C210 64 238 82 238 104 C238 126 208 138 160 138 C112 138 72 130 72 102 Z" fill="#8f7a66" stroke="#3b2a24" stroke-width="2.5"/>
        <path d="M108 112 C130 94 192 94 218 108 C198 128 132 130 108 112 Z" fill="#c9ad91"/>
        <path d="M122 66 c5 10 5 18 0 26 M152 62 c5 10 5 18 0 26 M182 64 c5 10 5 18 0 24 M210 72 c4 8 4 14 0 20" fill="none" stroke="#4f4034" stroke-width="4.5" stroke-linecap="round"/>
      </g>
      <g class="vasya-paw">
        <path d="M86 90 C72 64 62 42 56 24" fill="none" stroke="#3b2a24" stroke-width="18" stroke-linecap="round"/>
        <path d="M86 90 C72 64 62 42 56 24" fill="none" stroke="#8f7a66" stroke-width="13" stroke-linecap="round"/>
        <path d="M70 58 l8 -3 M64 44 l8 -3" stroke="#4f4034" stroke-width="3.5" stroke-linecap="round"/>
        <ellipse cx="55" cy="21" rx="10" ry="8" fill="#3b2a24"/>
      </g>
      <path d="M98 106 C112 98 122 98 130 103" fill="none" stroke="#8f7a66" stroke-width="13" stroke-linecap="round"/>
      <g class="vasya-head">
        <path d="M26 82 L12 54 L42 70 Z" fill="#8f7a66" stroke="#3b2a24" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M70 68 L90 48 L90 84 Z" fill="#8f7a66" stroke="#3b2a24" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M27 72 L20 60 L35 68 Z M76 66 L86 56 L86 76 Z" fill="#d39aa0"/>
        <path d="M18 104 C18 80 34 66 54 66 C76 66 92 82 90 104 C88 126 72 138 54 138 C32 138 18 126 18 104 Z" fill="#8f7a66" stroke="#3b2a24" stroke-width="2.5"/>
        <path d="M44 72 l1 12 M54 70 l0 13 M64 72 l-1 12" stroke="#4f4034" stroke-width="3.5" stroke-linecap="round"/>
        <g class="vasya-squint"><path d="M32 102 q8 -5 15 0 M60 100 q8 -5 15 0" fill="none" stroke="#2a1d18" stroke-width="3" stroke-linecap="round"/></g>
        <g class="vasya-look"><ellipse cx="40" cy="101" rx="7.5" ry="8" fill="#c9c46a"/><ellipse cx="68" cy="99" rx="7.5" ry="8" fill="#c9c46a"/><ellipse cx="40" cy="101" rx="2.6" ry="6" fill="#1d1517"/><ellipse cx="68" cy="99" rx="2.6" ry="6" fill="#1d1517"/></g>
        <path d="M50 114 L60 114 L55 120 Z" fill="#c9737c"/>
        <path d="M55 120 q-5 6 -10 2 M55 120 q5 6 10 2" fill="none" stroke="#2a1d18" stroke-width="2" stroke-linecap="round"/>
        <path d="M36 118 L4 112 M36 124 L6 130 M74 116 L104 108 M74 122 L102 126" stroke="#2a1d18" stroke-opacity=".55" stroke-width="1.5" stroke-linecap="round"/>
      </g>
    </g></svg>
    <span class="cat-name">Васька</span>
    <span class="purr" aria-hidden="true">мрря, пузико</span>`;
  document.querySelectorAll('.vasya-slot').forEach(slot => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'cat cat-vasya';
    b.setAttribute('aria-label', 'Почесать Ваське пузико');
    b.innerHTML = VASYA;
    b.addEventListener('click', () => {
      const r = b.getBoundingClientRect();
      b.classList.add('awake');
      burst(r.left + r.width * 0.5, r.top + r.height * 0.45, 12);
      say(b, 1800);
      clearTimeout(b._s);
      b._s = setTimeout(() => b.classList.remove('awake'), 2200);
    });
    slot.appendChild(b);
  });

  // ---------- Список историй ----------
  const index = $('#index');
  const previewImgs = $('.preview-imgs'), previewCard = $('.preview-card'), previewCap = $('.preview-cap');
  const previewGlare = $('.preview .glare i');
  const rows = STORIES.map((s, i) => {
    const li = document.createElement('li');
    li.style.setProperty('--d', `${Math.min(i * 30, 900)}ms`);
    li.innerHTML = `<button type="button"><span class="thumb"><img src="${small(s)}" width="420" height="630" alt="" loading="lazy" decoding="async"></span><span class="t">${s.ru}</span></button>`;
    const b = li.firstElementChild;
    b.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hoverRow = i; aimEnter(i); } });
    b.addEventListener('pointerleave', () => { if (hoverRow === i) hoverRow = -1; });
    b.addEventListener('focus', () => showPreview(i));
    b.addEventListener('click', () => openViewer(i, 'index'));
    index.appendChild(li);
    return b;
  });
  // Превью помнит последнюю открытку и никогда не остаётся пустым:
  // показываем только самый свежий запрос, старые картинки убираем лишь после того, как новая проявилась.
  let previewI = -1, previewTok = 0, hoverRow = -1;
  function showPreview(i) {
    if (i === previewI) return;
    previewI = i;
    const tok = ++previewTok;
    rows.forEach((b, k) => b.classList.toggle('current', k === i));
    previewCap.textContent = origLine(STORIES[i]);
    const img = new Image();
    img.alt = '';
    img.src = small(STORIES[i]);           // маленькая уже в кэше — проявляется сразу
    previewImgs.appendChild(img);
    const show = () => {
      if (tok !== previewTok) { img.remove(); return; }
      requestAnimationFrame(() => {
        img.classList.add('on');
        [...previewImgs.children].forEach(n => { if (n !== img) { n.classList.remove('on'); setTimeout(() => n.remove(), 260); } });
        const big = new Image(); big.src = large(STORIES[i]);   // потом тихо подменяем на чёткую
        big.decode?.().then(() => { if (tok === previewTok) img.src = big.src; }, () => {});
      });
    };
    img.decode ? img.decode().then(show, show) : (img.onload = show);
  }

  // «Прицел» как в двухуровневых меню: пока курсор едет от строчки к открытке, проезжаемые строки выбор не перехватывают
  const previewBox = $('.preview');
  const trail = [];
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    trail.push({ x: e.clientX, y: e.clientY, t: performance.now() });
    if (trail.length > 8) trail.shift();
  }, { passive: true });
  function aimingAtPreview() {
    if (trail.length < 2 || getComputedStyle(previewBox).display === 'none') return false;
    const r = previewCard.getBoundingClientRect();
    const cur = trail[trail.length - 1];
    // начало текущего жеста: самая ранняя точка за последние 120 мс, иначе предыдущая (там курсор стоял перед рывком)
    const recent = trail.filter(p => p !== cur && cur.t - p.t < 120);
    const prev = recent.length ? recent[0] : trail[trail.length - 2];
    if (cur.x <= prev.x) return false;
    const top = { x: r.left, y: r.top - 120 }, bottom = { x: r.left, y: r.bottom + 120 };
    const slope = (a, b) => (b.y - a.y) / (b.x - a.x || 0.001);
    return slope(cur, top) < slope(prev, top) && slope(cur, bottom) > slope(prev, bottom);
  }
  let aimT = null;
  function aimEnter(i) {
    clearTimeout(aimT);
    if (!aimingAtPreview()) { showPreview(i); return; }
    aimT = setTimeout(() => { if (hoverRow === i) aimEnter(i); }, 200);  // задержался на строке — значит, выбрал её
  }
  const storiesGrid = $('.stories-grid');
  storiesGrid.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') index.classList.add('engaged'); });
  storiesGrid.addEventListener('pointerleave', () => index.classList.remove('engaged'));
  showPreview(0);
  const pv = { x: spring(140, 18), y: spring(140, 18) };
  $('.stories').addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const r = previewCard.getBoundingClientRect();
    pv.x.t = clamp((e.clientX - (r.left + r.width / 2)) / (W * 0.4));
    pv.y.t = clamp((e.clientY - (r.top + r.height / 2)) / (H * 0.5));
  });

  // ---------- Лапки ----------
  const paws = $('.paws');
  for (let i = 0; i < 10; i++) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 40 40');
    s.innerHTML = '<use href="#paw"/>';
    s.style.left = `${4 + i * 9.6}%`;
    s.style.top = `${i % 2 ? 6 : 40}px`;
    s.style.setProperty('--i', i);
    paws.appendChild(s);
  }

  // ---------- Появления ----------
  const io = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('section').forEach(sec => {
    sec.querySelectorAll('.reveal').forEach((el, k) => el.style.setProperty('--d', `${k * 80}ms`));
  });
  document.querySelectorAll('.reveal, .paws').forEach(el => io.observe(el));
  const ioList = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { index.classList.add('in'); ioList.disconnect(); } }, { threshold: 0 });
  ioList.observe(index);

  // ---------- Просмотр открытки ----------
  const dlg = $('#viewer'), vcard = $('.v-card'), vimg = $('.v-img'), vcap = $('.v-cap'), vorig = $('.v-orig');
  const vglare = $('.v-card .glare i');
  const vt = { x: spring(150, 16), y: spring(150, 16) };
  let cur = 0, mode = 'cloud', vOpen = false, animating = null;

  function setContent(i) {
    const s = STORIES[i];
    vimg.src = small(s);            // уже в кэше — мгновенно
    const big = new Image(); big.src = large(s);
    big.decode?.().then(() => { if (cur === i) vimg.src = big.src; }, () => {});
    vimg.alt = s.ru;
    vcap.textContent = s.ru;
    vorig.textContent = origLine(s);
  }
  function sourceEl(i) {
    if (mode === 'cloud') return cards[i].el;
    if (getComputedStyle($('.preview')).display !== 'none' && previewI === i) return previewCard;
    return rows[i].querySelector('.thumb').offsetParent ? rows[i].querySelector('.thumb') : rows[i];
  }
  function visible(el) {
    const r = el.getBoundingClientRect();
    return r.width > 8 && r.bottom > 0 && r.top < H && r.right > 0 && r.left < W && getComputedStyle(el).opacity !== '0';
  }
  function flipFrom(el, dur, easing, reverse) {
    const to = vcard.getBoundingClientRect(), from = el.getBoundingClientRect();
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    const s = from.width / to.width;
    const a = { transform: `translate(${dx}px, ${dy}px) scale(${s})` }, b = { transform: 'translate(0,0) scale(1)' };
    return vcard.animate(reverse ? [b, a] : [a, b], { duration: dur, easing, fill: reverse ? 'forwards' : 'none' });
  }
  function openViewer(i, from) {
    if (vOpen) return;
    cur = i; mode = from; vOpen = true;
    setContent(i);
    vt.x.x = vt.y.x = vt.x.v = vt.y.v = 0;
    vcard.style.transform = '';
    dlg.classList.remove('ready', 'closing');
    dlg.showModal(); setModal(true);
    const src = sourceEl(i);
    if (!reduce && src && visible(src)) {
      if (mode === 'cloud') cards[i].hidden = true;
      animating = flipFrom(src, 560, 'cubic-bezier(0.32,0.72,0,1)');
      animating.onfinish = () => { animating = null; };
    }
    requestAnimationFrame(() => dlg.classList.add('ready'));
  }
  function closeViewer() {
    if (!vOpen || dlg.classList.contains('closing')) return;
    dlg.classList.add('closing');
    const src = sourceEl(cur);
    const done = () => {
      dlg.close(); setModal(false); dlg.classList.remove('closing', 'ready');
      cards.forEach(c => { c.hidden = false; });
      vcard.getAnimations().forEach(a => a.cancel());
      vOpen = false;
    };
    if (animating) animating.cancel();
    if (reduce) return done();
    cards.forEach(c => { c.hidden = false; });
    if (src && visible(src)) {
      if (mode === 'cloud') cards[cur].hidden = true;
      vcard.style.transform = '';
      const a = flipFrom(src, 300, 'cubic-bezier(0.23,1,0.32,1)', true);
      a.onfinish = done;
    } else {
      vcard.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.96)' }], { duration: 200, easing: 'ease-out', fill: 'forwards' }).onfinish = done;
    }
  }
  function go(dir) {
    const next = (cur + dir + N) % N;
    if (reduce) { cur = next; setContent(cur); return; }
    vcard.getAnimations().forEach(a => a.cancel());
    const out = vcard.animate([{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: `translateX(${-dir * 28}px)` }], { duration: 120, easing: 'ease-in-out', fill: 'forwards' });
    out.onfinish = () => {
      cur = next; setContent(cur);
      vcard.animate([{ opacity: 0, transform: `translateX(${dir * 28}px)` }, { opacity: 1, transform: 'translateX(0)' }], { duration: 220, easing: 'cubic-bezier(0.23,1,0.32,1)' });
      out.cancel();
    };
  }
  $('.v-prev').addEventListener('click', () => go(-1));
  $('.v-next').addEventListener('click', () => go(1));
  $('.v-close').addEventListener('click', closeViewer);
  $('.veil').addEventListener('click', closeViewer);
  dlg.addEventListener('cancel', e => { e.preventDefault(); closeViewer(); });
  dlg.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); cur = (cur + 1) % N; setContent(cur); }   // с клавиатуры — без анимации
    if (e.key === 'ArrowLeft') { e.preventDefault(); cur = (cur - 1 + N) % N; setContent(cur); }
  });
  dlg.addEventListener('click', e => { if (e.target === $('.viewer-body')) closeViewer(); });
  // свайп
  let sw = null;
  vcard.addEventListener('pointerdown', e => { sw = { x: e.clientX, y: e.clientY, t: performance.now() }; });
  addEventListener('pointerup', e => {
    if (!sw || !vOpen) { sw = null; return; }
    const dx = e.clientX - sw.x, dy = e.clientY - sw.y, v = Math.abs(dx) / (performance.now() - sw.t);
    if (Math.abs(dx) > Math.abs(dy) && (Math.abs(dx) > 60 || v > 0.11) && Math.abs(dx) > 12) go(dx < 0 ? 1 : -1);
    sw = null;
  });
  dlg.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const r = vcard.getBoundingClientRect();
    vt.x.t = clamp((e.clientX - (r.left + r.width / 2)) / (r.width * 0.9));
    vt.y.t = clamp((e.clientY - (r.top + r.height / 2)) / (r.height * 0.9));
  });

  // ---------- Главный цикл ----------
  let stageOn = true, storiesOn = false;
  new IntersectionObserver(es => es.forEach(e => {
    if (e.target === stage || e.target === cloud) stageOn = e.isIntersecting;
    else storiesOn = e.isIntersecting;
  })).observe(cloud);
  new IntersectionObserver(es => es.forEach(e => { storiesOn = e.isIntersecting; })).observe($('.stories'));

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const t = now / 1000;
    if (!finePointer && !usingGyro && !reduce) {   // нет гироскопа: свет сам медленно гуляет по открыткам
      tilt.x.t = Math.sin(t * 0.35) * 0.7; tilt.y.t = Math.cos(t * 0.27) * 0.5;
      ptr.x = W / 2 + tilt.x.t * W * 0.55; ptr.y = H / 2 + tilt.y.t * H * 0.45;
    }
    step(tilt.x, dt); step(tilt.y, dt);
    light.x.t = ptr.x; light.y.t = ptr.y; step(light.x, dt); step(light.y, dt);

    if (stageOn && !vOpen) {
      drawHearts(dt, t);

      // Ричи следит глазами
      const rr = richie.getBoundingClientRect();
      const ex = rr.left + rr.width * 0.5, ey = rr.top + rr.height * 0.36;
      eye.x.t = clamp((light.x.x - ex) / (W * 0.4)) * 4.5;
      eye.y.t = clamp((light.y.x - ey) / (H * 0.5)) * 3.2;
      step(eye.x, dt); step(eye.y, dt);
      pupils.setAttribute('transform', `translate(${eye.x.x.toFixed(2)} ${eye.y.x.toFixed(2)})`);
      richieHunt(now, dt);

      if (fly) {
        const p = cloudProgress();
        cam.t = p * TRAVEL; step(cam, dt);
        const io = clamp(1 - p / 0.045, 0, 1);
        intro.style.opacity = io.toFixed(3);
        intro.style.transform = `scale(${(1 + (1 - io) * 0.5).toFixed(3)})`;
        intro.style.visibility = io < 0.01 ? 'hidden' : '';
        const ho = clamp(1 - p / 0.02, 0, 1);
        hint.style.opacity = (ho * 0.86).toFixed(3);
        bar.style.opacity = ho.toFixed(3);
        bar.style.visibility = ho < 0.01 ? 'hidden' : '';
        const fogFar = lerp(-1200, -2900, clamp(p / 0.04, 0, 1));
        for (const c of cards) {
          step(c.hov, dt);
          const ze = c.z + cam.x;
          let op = 1;
          if (ze > 380) op = clamp(1 - (ze - 380) / 300, 0, 1);
          else if (ze < fogFar + 900) op = clamp((ze - fogFar) / 900, 0, 1);
          if (c.hidden) op = 0;
          if (op <= 0.001) {
            if (c.op !== 0) { c.el.style.opacity = '0'; c.el.style.visibility = 'hidden'; c.op = 0; }
            continue;
          }
          if (c.op === 0) c.el.style.visibility = '';
          if (Math.abs(op - c.op) > 0.004) { c.el.style.opacity = op.toFixed(3); c.op = op; }
          const bob = Math.sin(t * 0.9 + c.ph) * 9;
          const h = c.hov.x;
          // где открытка на экране — и куда ей смотреть
          const s = P / Math.max(80, P - ze);
          const sx = W / 2 + c.x * s, sy = H / 2 + (c.y + bob) * s;
          c.lx.t = clamp((light.x.x - sx) / (W * 0.42));
          c.ly.t = clamp((light.y.x - sy) / (H * 0.42));
          step(c.lx, dt); step(c.ly, dt);
          const k = 1 + h * 0.5;   // наведённая тянется сильнее
          // открытка разворачивается лицом к курсору: её плоскость «смотрит» на точку
          c.el.style.transform =
            `translate3d(${c.x.toFixed(1)}px, ${(c.y + bob).toFixed(1)}px, ${(ze + h * 90).toFixed(1)}px) ` +
            `rotateZ(${(c.rz * (1 - h * 0.6)).toFixed(2)}deg) rotateY(${(c.ry * (1 - h) * 0.5 + c.lx.x * 24 * k).toFixed(2)}deg) rotateX(${(-c.ly.x * 18 * k).toFixed(2)}deg) scale(${(1 + h * 0.06).toFixed(3)})`;
          // блик: где свет относительно открытки
          const gx = clamp((light.x.x - sx) / (cw * s));
          const gy = clamp((light.y.x - sy) / (cw * 1.5 * s));
          c.g.style.transform = `translate(${(gx * 50).toFixed(1)}%, ${(gy * 50).toFixed(1)}%)`;
        }
      }
    }

    if (!vOpen && laser.on) sleepersWatch();

    if (storiesOn && !vOpen) {
      if (!finePointer) { pv.x.t = tilt.x.x; pv.y.t = tilt.y.x; }
      step(pv.x, dt); step(pv.y, dt);
      if (!reduce) previewCard.style.transform = `rotateY(${(pv.x.x * 10).toFixed(2)}deg) rotateX(${(-pv.y.x * 8).toFixed(2)}deg)`;
      previewGlare.style.transform = `translate(${(pv.x.x * 40).toFixed(1)}%, ${(pv.y.x * 40).toFixed(1)}%)`;
    }

    if (vOpen && !animating && !dlg.classList.contains('closing')) {
      if (!finePointer) { vt.x.t = tilt.x.x; vt.y.t = tilt.y.x; }
      step(vt.x, dt); step(vt.y, dt);
      if (!reduce) vcard.style.transform = `rotateY(${(vt.x.x * 12).toFixed(2)}deg) rotateX(${(-vt.y.x * 9).toFixed(2)}deg)`;
      vglare.style.transform = `translate(${(vt.x.x * 45).toFixed(1)}%, ${(vt.y.x * 45).toFixed(1)}%)`;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
