// Complete Working Platformer Engine with Bulletproof Controls
(function() {
  /* --- 1. AUDIO SYNTH --- */
  let audioCtx = null;
  let soundMuted = false;

  window.playTone = function(type) {
    if (soundMuted) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'jump') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(190, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'sword') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'gem') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587, now);
        osc.frequency.setValueAtTime(880, now + 0.06);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(55, now + 0.2);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'win') {
        [523, 659, 784, 1046].forEach((f, idx) => {
          const o = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          o.type = 'triangle';
          o.connect(g);
          g.connect(audioCtx.destination);
          o.frequency.setValueAtTime(f, now + idx * 0.07);
          gain.gain.setValueAtTime(0.08, now + idx * 0.07);
          gain.gain.linearRampToValueAtTime(0.005, now + idx * 0.07 + 0.16);
          o.start(now + idx * 0.07);
          o.stop(now + idx * 0.07 + 0.16);
        });
      }
    } catch (e) {}
  };

  const soundBtn = document.getElementById('btn-sound');
  if (soundBtn) {
    soundBtn.addEventListener('click', (e) => {
      soundMuted = !soundMuted;
      e.target.textContent = soundMuted ? '🔇' : '🔊';
    });
  }

  /* --- 2. CANVAS & SIZING --- */
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const viewport = document.getElementById('viewport');

  const VIEW_H = 460;
  let VIEW_W = 800;
  let renderScale = 1;

  function resizeGameCanvas() {
    if (!viewport || !canvas) return;
    const rect = viewport.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    renderScale = (rect.height * dpr) / VIEW_H;
    VIEW_W = (rect.width * dpr) / renderScale;
    if (window.updateThreeCameraAspect) window.updateThreeCameraAspect();
  }
  window.addEventListener('resize', resizeGameCanvas);
  resizeGameCanvas();

  /* --- 3. CONTROLS (DIRECT TOUCH + POINTER + KEYBOARD) --- */
  const input = { left: false, right: false, jump: false };
  let jumpTriggered = false;
  let attackTriggered = false;

  // Keyboard
  window.addEventListener('keydown', (e) => {
    if (['ArrowLeft', 'KeyA'].includes(e.code)) input.left = true;
    if (['ArrowRight', 'KeyD'].includes(e.code)) input.right = true;
    if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
      if (!input.jump) jumpTriggered = true;
      input.jump = true;
      e.preventDefault();
    }
    if (['KeyX', 'KeyK', 'KeyF', 'Enter'].includes(e.code)) {
      attackTriggered = true;
    }
  });

  window.addEventListener('keyup', (e) => {
    if (['ArrowLeft', 'KeyA'].includes(e.code)) input.left = false;
    if (['ArrowRight', 'KeyD'].includes(e.code)) input.right = false;
    if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) input.jump = false;
  });

  // Touch & Pointer Binder
  function setupButton(id, onDown, onUp) {
    const el = document.getElementById(id);
    if (!el) return;

    const start = (e) => {
      e.preventDefault();
      e.stopPropagation();
      el.classList.add('active');
      onDown();
    };

    const stop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      el.classList.remove('active');
      if (onUp) onUp();
    };

    // Support both Touch Events (iOS Safari) and Pointer Events
    el.addEventListener('touchstart', start, { passive: false });
    el.addEventListener('touchend', stop, { passive: false });
    el.addEventListener('touchcancel', stop, { passive: false });

    el.addEventListener('pointerdown', start);
    el.addEventListener('pointerup', stop);
    el.addEventListener('pointercancel', stop);
    el.addEventListener('pointerleave', stop);
  }

  setupButton('btn-left', () => (input.left = true), () => (input.left = false));
  setupButton('btn-right', () => (input.right = true), () => (input.right = false));
  setupButton('btn-jump', () => {
    if (!input.jump) jumpTriggered = true;
    input.jump = true;
  }, () => (input.jump = false));
  setupButton('btn-attack', () => (attackTriggered = true));

  // Layout switcher
  const deck = document.querySelector('.touch-deck');
  const layoutBtn = document.getElementById('btn-layout');
  let currentLayout = 0;
  if (layoutBtn && deck) {
    layoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      currentLayout = (currentLayout + 1) % 3;
      deck.classList.remove('all-right', 'all-left');
      if (currentLayout === 1) {
        deck.classList.add('all-right');
        layoutBtn.textContent = '⇄ Right';
      } else if (currentLayout === 2) {
        deck.classList.add('all-left');
        layoutBtn.textContent = '⇄ Left';
      } else {
        layoutBtn.textContent = '⇄ Split';
      }
    });
  }

  /* --- 4. STAGES --- */
  const STAGES = [
    {
      name: "Stage 1: Castle Outskirts",
      bannerSub: "Malakor fled east with Princess Aurelia! Chase him down!",
      skyTop: "#0f172a", skyBot: "#1e3a5f",
      groundColor: "#15803d", topColor: "#4ade80",
      platforms: [
        { x: 0, y: 380, w: 460, h: 100 },
        { x: 220, y: 295, w: 120, h: 18 },
        { x: 400, y: 235, w: 120, h: 18 },
        { x: 520, y: 380, w: 420, h: 100 },
        { x: 660, y: 285, w: 130, h: 18 },
        { x: 1010, y: 330, w: 140, h: 18, vx: 1.8, minX: 980, maxX: 1200 },
        { x: 1360, y: 380, w: 520, h: 100 },
        { x: 1500, y: 280, w: 130, h: 18 }
      ],
      springs: [{ x: 880, y: 366, w: 34, h: 14 }],
      spikes: [{ x: 700, y: 366, w: 60, h: 14 }],
      gems: [
        { x: 280, y: 255 }, { x: 460, y: 195 },
        { x: 725, y: 245 }, { x: 1080, y: 280 },
        { x: 1565, y: 240 }
      ],
      enemies: [
        { x: 560, y: 348, w: 30, h: 32, minX: 530, maxX: 680, vx: 1.5 },
        { x: 1440, y: 348, w: 30, h: 32, minX: 1380, maxX: 1700, vx: 1.9 }
      ],
      portal: { x: 1780, y: 305, w: 46, h: 75 },
      hasBoss: false
    },
    {
      name: "Stage 2: Obsidian Cavern",
      bannerSub: "Cross the underground fortress to reach Malakor's Keep!",
      skyTop: "#1e1b4b", skyBot: "#4c1d95",
      groundColor: "#4338ca", topColor: "#818cf8",
      platforms: [
        { x: 0, y: 380, w: 340, h: 100 },
        { x: 390, y: 320, w: 120, h: 18, vy: 1.5, minY: 200, maxY: 350 },
        { x: 570, y: 245, w: 150, h: 18 },
        { x: 780, y: 360, w: 300, h: 100 },
        { x: 1140, y: 295, w: 135, h: 18, vx: 2.2, minX: 1120, maxX: 1360 },
        { x: 1500, y: 365, w: 480, h: 100 }
      ],
      springs: [{ x: 1020, y: 346, w: 34, h: 14 }],
      spikes: [
        { x: 860, y: 346, w: 60, h: 14 },
        { x: 1650, y: 351, w: 60, h: 14 }
      ],
      gems: [
        { x: 450, y: 185 }, { x: 645, y: 205 },
        { x: 960, y: 305 }, { x: 1220, y: 245 },
        { x: 1760, y: 310 }
      ],
      enemies: [
        { x: 590, y: 213, w: 30, h: 32, minX: 575, maxX: 690, vx: 1.5 },
        { x: 1540, y: 333, w: 30, h: 32, minX: 1510, maxX: 1630, vx: 1.8 }
      ],
      portal: { x: 1880, y: 290, w: 46, h: 75 },
      hasBoss: false
    },
    {
      name: "Stage 3: Malakor's Keep",
      bannerSub: "Defeat Dark Lord Malakor (3 Hits) to free Princess Aurelia!",
      skyTop: "#2a0a18", skyBot: "#450a0a",
      groundColor: "#7f1d1d", topColor: "#f87171",
      platforms: [
        { x: 0, y: 380, w: 1250, h: 100 },
        { x: 260, y: 285, w: 130, h: 18 },
        { x: 540, y: 245, w: 150, h: 18 },
        { x: 820, y: 285, w: 130, h: 18 }
      ],
      springs: [
        { x: 190, y: 366, w: 34, h: 14 },
        { x: 1000, y: 366, w: 34, h: 14 }
      ],
      spikes: [],
      gems: [
        { x: 325, y: 245 }, { x: 615, y: 205 }, { x: 885, y: 245 }
      ],
      enemies: [
        { x: 350, y: 348, w: 30, h: 32, minX: 250, maxX: 520, vx: 1.8 }
      ],
      portal: null,
      hasBoss: true,
      boss: {
        x: 780, y: 316, w: 48, h: 64,
        vx: -2.3, minX: 480, maxX: 960,
        hp: 3, maxHp: 3, hurtTimer: 0, jumpTimer: 90, vy: 0
      },
      princess: {
        x: 1120, y: 332, w: 30, h: 48, freed: false
      }
    }
  ];

  let stageIdx = 0;
  let stage = null;
  let score = 0;
  let camX = 0;
  let bannerTimer = 0;
  let victoryTimer = 0;
  let animTick = 0;
  let particles = [];

  const hero = {
    x: 60, y: 300, w: 38, h: 50,
    vx: 0, vy: 0,
    facing: 1,
    onGround: false,
    coyote: 0,
    jumps: 2,
    hp: 3,
    invuln: 0,
    slashTimer: 0
  };

  function loadStage(idx) {
    stageIdx = idx % STAGES.length;
    const raw = STAGES[stageIdx];
    stage = {
      name: raw.name,
      bannerSub: raw.bannerSub,
      skyTop: raw.skyTop,
      skyBot: raw.skyBot,
      groundColor: raw.groundColor,
      topColor: raw.topColor,
      platforms: raw.platforms.map(p => ({ ...p })),
      springs: raw.springs.map(s => ({ ...s, anim: 0 })),
      spikes: raw.spikes.map(s => ({ ...s })),
      gems: raw.gems.map(g => ({ ...g, taken: false, bob: Math.random() * 6 })),
      enemies: raw.enemies.map(e => ({ ...e, alive: true })),
      portal: raw.portal ? { ...raw.portal } : null,
      hasBoss: raw.hasBoss,
      boss: raw.boss ? { ...raw.boss } : null,
      princess: raw.princess ? { ...raw.princess } : null
    };
    hero.x = 60;
    hero.y = 300;
    hero.vx = 0;
    hero.vy = 0;
    hero.hp = 3;
    hero.invuln = 0;
    hero.slashTimer = 0;
    camX = 0;
    bannerTimer = 140;
    victoryTimer = 0;
    syncHUD();
  }

  function syncHUD() {
    const sEl = document.getElementById('ui-stage');
    const hEl = document.getElementById('ui-hearts');
    const scEl = document.getElementById('ui-score');
    if (sEl) sEl.textContent = `Stage ${stageIdx + 1}/3`;
    if (hEl) hEl.textContent = '❤️'.repeat(Math.max(0, hero.hp)) || '💔';
    if (scEl) scEl.textContent = score;
  }

  const resetBtn = document.getElementById('btn-reset');
  if (resetBtn) resetBtn.addEventListener('click', () => loadStage(stageIdx));

  function burst(x, y, color, count = 12) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 1 + Math.random() * 4;
      particles.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 1.5,
        life: 24 + Math.random() * 12,
        color,
        size: 3 + Math.random() * 3
      });
    }
  }

  function overlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function damageHero() {
    if (hero.invuln > 0) return;
    hero.hp--;
    hero.invuln = 65;
    hero.vy = -7.5;
    if (window.playTone) window.playTone('hit');
    burst(hero.x + hero.w / 2, hero.y + hero.h / 2, '#ef4444', 14);
    syncHUD();
    if (hero.hp <= 0) loadStage(stageIdx);
  }

  /* --- 5. PHYSICS LOOP --- */
  function updateGame() {
    animTick++;
    if (bannerTimer > 0) bannerTimer--;
    if (hero.invuln > 0) hero.invuln--;
    if (hero.slashTimer > 0) hero.slashTimer--;

    if (victoryTimer > 0) {
      victoryTimer--;
      if (victoryTimer === 1) {
        score += 1000;
        loadStage(0);
      }
    }

    if (attackTriggered) {
      hero.slashTimer = 14;
      if (window.playTone) window.playTone('sword');
      attackTriggered = false;
    }

    const swordBox = hero.slashTimer > 0 ? {
      x: hero.facing === 1 ? hero.x + hero.w : hero.x - 40,
      y: hero.y + 6,
      w: 40,
      h: 36
    } : null;

    // Moving platforms
    for (const p of stage.platforms) {
      if (p.vx) {
        p.x += p.vx;
        if (p.x < p.minX || p.x + p.w > p.maxX) p.vx *= -1;
      }
      if (p.vy) {
        p.y += p.vy;
        if (p.y < p.minY || p.y > p.maxY) p.vy *= -1;
      }
    }

    // Horizontal speed
    const accel = hero.onGround ? 0.65 : 0.45;
    const maxVx = 4.6;
    if (input.left) {
      hero.vx = Math.max(hero.vx - accel, -maxVx);
      hero.facing = -1;
    } else if (input.right) {
      hero.vx = Math.min(hero.vx + accel, maxVx);
      hero.facing = 1;
    } else {
      hero.vx *= hero.onGround ? 0.78 : 0.92;
      if (Math.abs(hero.vx) < 0.08) hero.vx = 0;
    }

    // Jump handling
    if (hero.onGround) {
      hero.coyote = 7;
      hero.jumps = 2;
    } else if (hero.coyote > 0) {
      hero.coyote--;
    }

    if (jumpTriggered) {
      if (hero.coyote > 0) {
        hero.vy = -10.6;
        hero.onGround = false;
        hero.coyote = 0;
        hero.jumps = 1;
        if (window.playTone) window.playTone('jump');
        burst(hero.x + hero.w / 2, hero.y + hero.h, '#cbd5e1', 6);
      } else if (hero.jumps > 0) {
        hero.vy = -9.6;
        hero.jumps--;
        if (window.playTone) window.playTone('jump');
        burst(hero.x + hero.w / 2, hero.y + hero.h, '#38bdf8', 8);
      }
      jumpTriggered = false;
    }

    if (!input.jump && hero.vy < -4) hero.vy *= 0.85;
    hero.vy = Math.min(hero.vy + 0.48, 12);

    // Apply X movement
    hero.x += hero.vx;
    if (hero.x < 0) { hero.x = 0; hero.vx = 0; }
    for (const p of stage.platforms) {
      if (overlap(hero, p)) {
        if (hero.vx > 0) hero.x = p.x - hero.w;
        else if (hero.vx < 0) hero.x = p.x + p.w;
        hero.vx = 0;
      }
    }

    // Apply Y movement
    const prevBot = hero.y + hero.h;
    hero.y += hero.vy;
    hero.onGround = false;
    for (const p of stage.platforms) {
      if (overlap(hero, p)) {
        if (hero.vy >= 0 && prevBot <= p.y + 15) {
          hero.y = p.y - hero.h;
          hero.vy = 0;
          hero.onGround = true;
          if (p.vx) hero.x += p.vx;
          if (p.vy) hero.y += p.vy;
        } else if (hero.vy < 0) {
          hero.y = p.y + p.h;
          hero.vy = 0;
        }
      }
    }

    if (hero.y > VIEW_H + 70) {
      loadStage(stageIdx);
      return;
    }

    // Springs
    for (const s of stage.springs) {
      if (s.anim > 0) s.anim--;
      if (overlap(hero, s)) {
        hero.vy = -14.2;
        hero.onGround = false;
        hero.jumps = 1;
        s.anim = 10;
        if (window.playTone) window.playTone('jump');
        burst(s.x + s.w / 2, s.y, '#f43f5e', 10);
      }
    }

    // Gems
    for (const g of stage.gems) {
      g.bob += 0.08;
      if (!g.taken && overlap(hero, { x: g.x - 10, y: g.y - 10, w: 20, h: 20 })) {
        g.taken = true;
        score += 100;
        if (window.playTone) window.playTone('gem');
        burst(g.x, g.y, '#38bdf8', 12);
        syncHUD();
      }
    }

    // Enemies
    for (const e of stage.enemies) {
      if (!e.alive) continue;
      e.x += e.vx;
      if (e.x < e.minX || e.x + e.w > e.maxX) e.vx *= -1;

      if (swordBox && overlap(swordBox, e)) {
        e.alive = false;
        score += 200;
        if (window.playTone) window.playTone('gem');
        burst(e.x + e.w / 2, e.y + e.h / 2, '#f97316', 15);
        syncHUD();
        continue;
      }

      if (overlap(hero, e)) {
        if (hero.vy > 0 && hero.y + hero.h - hero.vy <= e.y + 16) {
          e.alive = false;
          hero.vy = -9.2;
          score += 200;
          if (window.playTone) window.playTone('sword');
          burst(e.x + e.w / 2, e.y + e.h / 2, '#f97316', 15);
          syncHUD();
        } else {
          damageHero();
        }
      }
    }

    // Spikes
    for (const sp of stage.spikes) {
      if (overlap(hero, sp)) damageHero();
    }

    // Portal
    if (stage.portal && overlap(hero, stage.portal)) {
      if (window.playTone) window.playTone('win');
      score += 400;
      loadStage(stageIdx + 1);
      return;
    }

    // Boss Battle
    if (stage.hasBoss && stage.boss && stage.boss.hp > 0) {
      const b = stage.boss;
      if (b.hurtTimer > 0) b.hurtTimer--;
      b.x += b.vx;
      if (b.x < b.minX || b.x + b.w > b.maxX) b.vx *= -1;

      b.jumpTimer--;
      if (b.jumpTimer <= 0 && b.y >= 316) {
        b.vy = -10.5;
        b.jumpTimer = 85;
      }
      b.y += b.vy;
      b.vy += 0.42;
      if (b.y >= 316) {
        b.y = 316;
        b.vy = 0;
      }

      const hitBySword = swordBox && overlap(swordBox, b);
      const hitByStomp = overlap(hero, b) && hero.vy > 0 && hero.y + hero.h - hero.vy <= b.y + 18;

      if ((hitBySword || hitByStomp) && b.hurtTimer === 0) {
        b.hp--;
        b.hurtTimer = 40;
        hero.vy = -9.5;
        hero.vx = hero.x < b.x ? -5 : 5;
        if (window.playTone) window.playTone('sword');
        burst(b.x + b.w / 2, b.y + b.h / 2, '#a855f7', 22);
        if (b.hp <= 0) {
          if (window.playTone) window.playTone('win');
          score += 1000;
          stage.princess.freed = true;
          burst(stage.princess.x + 15, stage.princess.y + 20, '#facc15', 30);
          syncHUD();
        }
      } else if (overlap(hero, b) && b.hurtTimer === 0) {
        damageHero();
      }
    }

    // Princess
    if (stage.princess && stage.princess.freed && victoryTimer === 0) {
      if (overlap(hero, stage.princess)) {
        if (window.playTone) window.playTone('win');
        victoryTimer = 180;
        burst(stage.princess.x + 15, stage.princess.y, '#f472b6', 35);
      }
    }

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const pt = particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.vy += 0.15;
      pt.life--;
      if (pt.life <= 0) particles.splice(i, 1);
    }

    const targetCamX = Math.max(0, hero.x - VIEW_W * 0.36);
    camX += (targetCamX - camX) * 0.14;
  }

  /* --- 6. RENDER LOOP --- */
  function drawGame() {
    ctx.save();
    ctx.scale(renderScale, renderScale);
    ctx.imageSmoothingEnabled = false;

    const sky = ctx.createLinearGradient(0, 0, 0, VIEW_H);
    sky.addColorStop(0, stage.skyTop);
    sky.addColorStop(1, stage.skyBot);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
    for (let i = 0; i < 8; i++) {
      const mx = (i * 240) - ((camX * 0.2) % 240);
      ctx.beginPath();
      ctx.moveTo(mx - 100, VIEW_H);
      ctx.lineTo(mx + 20, 180 + (i % 2) * 40);
      ctx.lineTo(mx + 140, VIEW_H);
      ctx.fill();
    }

    ctx.save();
    ctx.translate(-Math.floor(camX), 0);

    for (const p of stage.platforms) {
      ctx.fillStyle = stage.groundColor;
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.w, p.h, 6);
      ctx.fill();
      ctx.fillStyle = stage.topColor;
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.w, 6, [6, 6, 0, 0]);
      ctx.fill();
    }

    for (const s of stage.springs) {
      ctx.fillStyle = "#f43f5e";
      ctx.beginPath();
      ctx.roundRect(s.x, s.y - (s.anim > 0 ? 4 : 0), s.w, s.h, 4);
      ctx.fill();
    }

    ctx.fillStyle = "#94a3b8";
    for (const sp of stage.spikes) {
      const count = Math.floor(sp.w / 15);
      for (let i = 0; i < count; i++) {
        const sx = sp.x + i * 15;
        ctx.beginPath();
        ctx.moveTo(sx, sp.y + sp.h);
        ctx.lineTo(sx + 7.5, sp.y);
        ctx.lineTo(sx + 15, sp.y + sp.h);
        ctx.fill();
      }
    }

    for (const g of stage.gems) {
      if (g.taken) continue;
      const gy = g.y + Math.sin(g.bob) * 4;
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.moveTo(g.x, gy - 10);
      ctx.lineTo(g.x + 9, gy);
      ctx.lineTo(g.x, gy + 10);
      ctx.lineTo(g.x - 9, gy);
      ctx.closePath();
      ctx.fill();
    }

    for (const e of stage.enemies) {
      if (!e.alive) continue;
      ctx.fillStyle = "#ea580c";
      ctx.beginPath();
      ctx.roundRect(e.x, e.y, e.w, e.h, 6);
      ctx.fill();
      ctx.fillStyle = "#fef08a";
      const ex = e.vx > 0 ? 5 : -2;
      ctx.fillRect(e.x + 6 + ex, e.y + 8, 5, 5);
      ctx.fillRect(e.x + 17 + ex, e.y + 8, 5, 5);
    }

    if (stage.portal) {
      const po = stage.portal;
      ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
      ctx.beginPath();
      ctx.roundRect(po.x - 4, po.y - 4, po.w + 8, po.h + 8, 22);
      ctx.fill();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(po.x, po.y, po.w, po.h, 18);
      ctx.stroke();
    }

    if (stage.hasBoss && stage.boss && stage.boss.hp > 0) {
      const b = stage.boss;
      if (b.hurtTimer % 4 < 2) {
        ctx.fillStyle = "#991b1b";
        ctx.fillRect(b.x - 6, b.y + 10, b.w + 12, b.h - 10);
        ctx.fillStyle = "#312e81";
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.w, b.h, 8);
        ctx.fill();
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.moveTo(b.x + 4, b.y);
        ctx.lineTo(b.x - 6, b.y - 16);
        ctx.lineTo(b.x + 16, b.y);
        ctx.moveTo(b.x + b.w - 4, b.y);
        ctx.lineTo(b.x + b.w + 6, b.y - 16);
        ctx.lineTo(b.x + b.w - 16, b.y);
        ctx.fill();
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(b.x + 10, b.y + 14, 8, 5);
        ctx.fillRect(b.x + 28, b.y + 14, 8, 5);
      }
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(b.x - 6, b.y - 28, 60, 8);
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(b.x - 5, b.y - 27, (58 * b.hp) / b.maxHp, 6);
    }

    if (stage.princess) {
      const pr = stage.princess;
      ctx.fillStyle = "#f472b6";
      ctx.beginPath();
      ctx.moveTo(pr.x + 15, pr.y + 14);
      ctx.lineTo(pr.x + 30, pr.y + pr.h);
      ctx.lineTo(pr.x, pr.y + pr.h);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#fde68a";
      ctx.fillRect(pr.x + 6, pr.y, 18, 16);
      ctx.fillStyle = "#facc15";
      ctx.fillRect(pr.x + 8, pr.y - 6, 14, 6);

      if (!pr.freed) {
        ctx.strokeStyle = "#a855f7";
        ctx.lineWidth = 3;
        ctx.strokeRect(pr.x - 8, pr.y - 12, pr.w + 16, pr.h + 12);
        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 11px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("HELP!", pr.x + 15, pr.y - 18);
      } else {
        ctx.fillStyle = "#fde047";
        ctx.font = "bold 12px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("MY HERO! ❤️", pr.x + 15, pr.y - 16);
      }
    }

    // Hero Sprite
    if (hero.invuln % 4 < 2) {
      let currentSprite = window.spriteCache ? window.spriteCache.idle : null;
      if (window.spriteCache) {
        if (!hero.onGround) {
          currentSprite = window.spriteCache.run1;
        } else if (Math.abs(hero.vx) > 0.3) {
          currentSprite = (Math.floor(animTick / 7) % 2 === 0) ? window.spriteCache.run1 : window.spriteCache.run2;
        }
      }

      if (currentSprite) {
        ctx.save();
        ctx.translate(hero.x + hero.w / 2, hero.y + hero.h / 2);
        if (hero.facing === -1) ctx.scale(-1, 1);
        ctx.drawImage(currentSprite, -hero.w / 2 - 3, -hero.h / 2 - 2, hero.w + 6, hero.h + 2);
        ctx.restore();
      } else {
        // Fallback placeholder rectangle if sprites haven't initialized
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(hero.x, hero.y, hero.w, hero.h);
      }

      if (hero.slashTimer > 0) {
        ctx.fillStyle = "#38bdf8";
        const sx = hero.facing === 1 ? hero.x + hero.w : hero.x - 38;
        ctx.beginPath();
        ctx.roundRect(sx, hero.y + 18, 38, 10, 4);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(sx + 4, hero.y + 21, 30, 4);
      }
    }

    for (const pt of particles) {
      ctx.fillStyle = pt.color;
      ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
    }

    ctx.restore();

    if (bannerTimer > 0) {
      ctx.fillStyle = "rgba(15, 23, 42, 0.82)";
      ctx.fillRect(0, VIEW_H / 2 - 42, VIEW_W, 84);
      ctx.fillStyle = "#fde047";
      ctx.font = "bold 20px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(stage.name, VIEW_W / 2, VIEW_H / 2 - 6);
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "13px system-ui, sans-serif";
      ctx.fillText(stage.bannerSub, VIEW_W / 2, VIEW_H / 2 + 18);
    }

    if (victoryTimer > 0) {
      ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
      ctx.fillRect(0, VIEW_H / 2 - 50, VIEW_W, 100);
      ctx.fillStyle = "#fde047";
      ctx.font = "bold 24px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🎉 PRINCESS AURELIA RESCUED! 🎉", VIEW_W / 2, VIEW_H / 2 - 6);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 15px system-ui, sans-serif";
      ctx.fillText("You defeated Lord Malakor and saved the Kingdom!", VIEW_W / 2, VIEW_H / 2 + 22);
    }

    ctx.restore();
  }

  function mainLoop() {
    updateGame();
    drawGame();
    requestAnimationFrame(mainLoop);
  }

  loadStage(0);
  requestAnimationFrame(mainLoop);
})();
