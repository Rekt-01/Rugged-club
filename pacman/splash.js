// Retro Pixel-Art Sprite Intro Scene (USA Hero, Princess in Cage, Zombie Boss)
(function() {
  const splashEl = document.getElementById('splash-screen');
  const container = document.getElementById('three-container');
  window.splashActive = true;

  // Automatically update Splash Screen labels to match the Zombie theme
  const badge = document.querySelector('.badge');
  if (badge) badge.textContent = '8-BIT PIXEL ARCADE EDITION';

  const tags = document.querySelectorAll('.char-tag');
  if (tags.length >= 3) {
    tags[0].innerHTML = '😎 USA Guy (Hero)';
    tags[1].innerHTML = '👑 Princess Aurelia';
    tags[2].innerHTML = '🧟‍♂️ Zombie Boss';
  }

  const storyText = document.querySelector('.story-text');
  if (storyText) {
    storyText.innerHTML = '<strong>THE MISSION:</strong> The mutant <strong>Zombie Boss</strong> has kidnapped <strong>Princess Aurelia</strong> and locked her inside a dungeon cage! Run, double-jump, and slash through the zombie horde across 3 stages to rescue her!';
  }

  // Create crisp Pixel Canvas inside the splash container
  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  canvas.style.imageRendering = 'pixelated';
  container.innerHTML = '';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let tick = 0;

  // Pixel Stars
  const stars = Array.from({ length: 45 }, () => ({
    x: Math.random() * 360,
    y: Math.random() * 140,
    s: Math.random() > 0.5 ? 2 : 1,
    blink: Math.random() * 100
  }));

  function resizeSplash() {
    canvas.width = 360;
    canvas.height = 240;
  }
  window.updateThreeCameraAspect = resizeSplash;
  window.addEventListener('resize', resizeSplash);
  resizeSplash();

  function drawPixelSpeechBubble(x, y, text, bgColor, textColor) {
    ctx.font = 'bold 9px monospace';
    const w = ctx.measureText(text).width + 12;
    const h = 16;
    const bx = Math.round(x - w / 2);
    const by = Math.round(y - h);

    // Pixel border
    ctx.fillStyle = '#000000';
    ctx.fillRect(bx - 2, by - 2, w + 4, h + 4);
    ctx.fillStyle = bgColor;
    ctx.fillRect(bx, by, w, h);

    // Pointer triangle
    ctx.fillStyle = '#000000';
    ctx.fillRect(x - 3, by + h, 6, 4);
    ctx.fillStyle = bgColor;
    ctx.fillRect(x - 2, by + h, 4, 3);

    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.fillText(text, x, by + 11);
  }

  function animatePixelSplash() {
    if (!window.splashActive) return;
    requestAnimationFrame(animatePixelSplash);
    tick++;

    ctx.imageSmoothingEnabled = false;

    // 1. Retro Night Sky Background
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#090d16');
    grad.addColorStop(0.6, '#1e1b4b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Twinkling Pixel Stars & Full Moon
    for (const st of stars) {
      const alpha = 0.4 + Math.sin((tick + st.blink) * 0.08) * 0.4;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(st.x, st.y, st.s, st.s);
    }

    // Pixel Moon
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(290, 24, 28, 28);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(296, 30, 6, 6);
    ctx.fillRect(306, 40, 8, 6);

    // 3. Stone Dungeon Floor
    const floorY = 162;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, floorY, canvas.width, canvas.height - floorY);
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, floorY, canvas.width, 4);

    // Pixel Stone Bricks
    ctx.fillStyle = '#0f172a';
    for (let x = 0; x < canvas.width; x += 24) {
      ctx.fillRect(x, floorY + 4, 2, 16);
      ctx.fillRect(x + 12, floorY + 20, 2, 16);
    }
    ctx.fillRect(0, floorY + 20, canvas.width, 2);

    const sprites = window.spriteCache || {};

    // 4. DRAW USA CAP HERO (LEFT)
    const heroX = 48;
    const heroY = floorY - 62;
    const heroPose = (Math.floor(tick / 10) % 2 === 0) ? sprites.run1 : sprites.run2;
    if (heroPose) {
      ctx.drawImage(heroPose, heroX, heroY, 48, 62);
    }

    // Animated Glowing Pixel Sword in Hero's Hand
    const slashOffset = Math.sin(tick * 0.15) * 4;
    ctx.fillStyle = '#facc15';
    ctx.fillRect(heroX + 42, heroY + 34 + slashOffset, 6, 4);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(heroX + 48, heroY + 32 + slashOffset, 22, 8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(heroX + 50, heroY + 34 + slashOffset, 18, 4);

    drawPixelSpeechBubble(heroX + 24, heroY - 6, "HOLD ON PRINCESS!", "#38bdf8", "#090d16");

    // 5. DRAW PRINCESS IN HANGING CAGE (CENTER)
    const cageSwing = Math.sin(tick * 0.06) * 4;
    const prinX = Math.round(156 + cageSwing);
    const prinY = Math.round(floorY - 70 + Math.sin(tick * 0.08) * 3);

    // Ceiling Chain
    ctx.fillStyle = '#64748b';
    for (let cy = 0; cy < prinY - 8; cy += 6) {
      ctx.fillRect(prinX + 22, cy, 4, 4);
    }

    // Draw Princess Sprite
    if (sprites.princess) {
      ctx.drawImage(sprites.princess, prinX, prinY, 48, 62);
    }

    // Glowing Iron Cage Bars Around Princess
    ctx.fillStyle = '#334155';
    ctx.fillRect(prinX - 6, prinY - 6, 60, 5);
    ctx.fillRect(prinX - 6, prinY + 60, 60, 5);

    ctx.fillStyle = '#94a3b8';
    for (let bx = prinX - 4; bx <= prinX + 50; bx += 10) {
      ctx.fillRect(bx, prinY - 2, 3, 62);
    }

    drawPixelSpeechBubble(prinX + 24, prinY - 10, "HELP ME!", "#f472b6", "#ffffff");

    // 6. DRAW ZOMBIE BOSS (RIGHT)
    const zomWalk = Math.sin(tick * 0.09) * 6;
    const zomX = Math.round(256 + zomWalk);
    const zomY = floorY - 68 + (Math.floor(tick / 12) % 2) * 2;

    if (sprites.zombie) {
      ctx.save();
      // Flip zombie to face left toward the Princess and Hero
      ctx.translate(zomX + 52, zomY);
      ctx.scale(-1, 1);
      ctx.drawImage(sprites.zombie, 0, 0, 52, 68);
      ctx.restore();
    }

    drawPixelSpeechBubble(zomX + 26, zomY - 6, "BRAINS... SHE'S MINE!", "#65a30d", "#ffffff");
  }

  requestAnimationFrame(animatePixelSplash);

  function closeSplash(e) {
    if (e && e.cancelable) e.preventDefault();
    window.splashActive = false;
    splashEl.classList.add('hidden');
    if (window.playTone) window.playTone('win');
  }

  const startBtn = document.getElementById('btn-start-game');
  if (startBtn) {
    startBtn.addEventListener('click', closeSplash);
    startBtn.addEventListener('touchend', closeSplash, { passive: false });
  }

  const storyBtn = document.getElementById('btn-story');
  if (storyBtn) {
    storyBtn.textContent = 'Intro';
    storyBtn.addEventListener('click', () => {
      window.splashActive = true;
      splashEl.classList.remove('hidden');
      requestAnimationFrame(animatePixelSplash);
    });
  }
})();
