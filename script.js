/* ============================================================
   VIVI ZHANG · script.js
   — Particles, Butterflies, Bubble Nav, Scroll Reveal, Parallax,
     Scroll Progress, Top Nav, Active Section Tracking
   ============================================================ */

// ============================================================
// 1. CANVAS BUBBLE PARTICLES
// ============================================================
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

// Create soap-bubble-like particles
const BUBBLE_HUES = [140, 340, 195, 55, 270]; // green, pink, sky, yellow, lavender
const bubbles = Array.from({ length: 55 }, () => makeBubble());

function makeBubble() {
  const hue = BUBBLE_HUES[Math.floor(Math.random() * BUBBLE_HUES.length)];
  return {
    x:  Math.random() * window.innerWidth,
    y:  Math.random() * window.innerHeight,
    r:  3 + Math.random() * 8,
    vx: (Math.random() - 0.5) * 0.38,
    vy: -(0.22 + Math.random() * 0.42),
    hue,
    alpha: 0.1 + Math.random() * 0.22,
  };
}

function drawBubbles() {
  ctx.clearRect(0, 0, W, H);
  for (const b of bubbles) {
    // drift
    b.x += b.vx;
    b.y += b.vy + Math.sin(Date.now() * 0.0004 + b.x) * 0.12;

    // wrap
    if (b.y < -b.r * 2) { b.y = H + b.r;  b.x = Math.random() * W; }
    if (b.x < -b.r)      b.x = W + b.r;
    if (b.x >  W + b.r)  b.x = -b.r;

    // ring
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${b.hue}, 45%, 72%, ${b.alpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // gloss highlight
    ctx.beginPath();
    ctx.arc(b.x - b.r * 0.33, b.y - b.r * 0.32, b.r * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${b.alpha * 1.8})`;
    ctx.fill();
  }
  requestAnimationFrame(drawBubbles);
}
drawBubbles();


// ============================================================
// 2. BUTTERFLIES
// ============================================================
const BF_COLORS = ['#f0b8c4','#b8d4f0','#c5e0b0','#f9e0b8','#d8b8f0'];
let bfId = 0;

function makeBfSvg(c) {
  return `<svg viewBox="0 0 80 56" xmlns="http://www.w3.org/2000/svg">
    <g class="bfwing">
      <!-- left upper -->
      <path d="M40,28 C30,10 5,7 2,19 C-1,32 25,40 40,28Z" fill="${c}" opacity="0.88"/>
      <!-- left lower -->
      <path d="M40,28 C27,35 10,49 17,55 C24,61 40,44 40,28Z" fill="${c}" opacity="0.68"/>
      <!-- right upper -->
      <path d="M40,28 C50,10 75,7 78,19 C81,32 55,40 40,28Z" fill="${c}" opacity="0.88"/>
      <!-- right lower -->
      <path d="M40,28 C53,35 70,49 63,55 C56,61 40,44 40,28Z" fill="${c}" opacity="0.68"/>
    </g>
    <!-- body -->
    <ellipse cx="40" cy="29" rx="1.6" ry="9" fill="rgba(40,28,16,0.65)"/>
    <!-- antennae -->
    <line x1="38.5" y1="20" x2="33" y2="11" stroke="rgba(40,28,16,0.5)" stroke-width="0.8"/>
    <circle cx="33" cy="11" r="1" fill="rgba(40,28,16,0.5)"/>
    <line x1="41.5" y1="20" x2="47" y2="11" stroke="rgba(40,28,16,0.5)" stroke-width="0.8"/>
    <circle cx="47" cy="11" r="1" fill="rgba(40,28,16,0.5)"/>
  </svg>`;
}

function spawnButterfly() {
  const id    = `bf${bfId++}`;
  const color = BF_COLORS[Math.floor(Math.random() * BF_COLORS.length)];
  const size  = 26 + Math.random() * 30;          // px

  // path endpoints
  const sx = -40 + Math.random() * (window.innerWidth + 80);
  const sy = window.innerHeight * 0.08 + Math.random() * window.innerHeight * 0.75;
  const ex = sx + (Math.random() - 0.5) * 380;
  const ey = sy - 80 - Math.random() * 260;
  // mid-point with sine sway
  const mx = (sx + ex) / 2 + (Math.random() - 0.5) * 120;
  const my = (sy + ey) / 2 + (Math.random() - 0.5) * 60;
  const dur    = 9000 + Math.random() * 11000;   // ms
  const delay  = Math.random() * 2500;

  // Inject unique keyframe + wing-flap override
  const styleTag = document.createElement('style');
  const animName = `path_${id}`;
  styleTag.textContent = `
    @keyframes ${animName} {
      0%   { transform: translate(${sx}px,${sy}px) rotate(-8deg); opacity:0; }
      7%   { opacity: 0.9; }
      50%  { transform: translate(${mx}px,${my}px) rotate(5deg); opacity:0.9; }
      93%  { opacity: 0.9; }
      100% { transform: translate(${ex}px,${ey}px) rotate(${-12+Math.random()*24}deg); opacity:0; }
    }
    #${id} { animation: ${animName} ${dur}ms ease-in-out ${delay}ms forwards; position:absolute; left:0; top:0; width:${size}px; height:${size*0.72}px; pointer-events:none; }
    #${id} .bfwing { animation: bfwing 0.19s ease-in-out infinite alternate; transform-origin: 40px 28px; }
    @keyframes bfwing { 0%{transform:scaleY(1)} 100%{transform:scaleY(0.28)} }
  `;
  document.head.appendChild(styleTag);

  const el = document.createElement('div');
  el.id = id;
  el.innerHTML = makeBfSvg(color);
  document.getElementById('butterflies').appendChild(el);

  // cleanup
  setTimeout(() => {
    el.remove();
    styleTag.remove();
  }, dur + delay + 200);
}

// Seed initial butterflies then keep spawning
setTimeout(() => {
  for (let i = 0; i < 5; i++) setTimeout(spawnButterfly, i * 700);
  setInterval(spawnButterfly, 1800);
}, 200);


// ============================================================
// 3. BUBBLE NAV — click to scroll
// ============================================================
document.querySelectorAll('.nav-bubble').forEach(btn => {
  btn.addEventListener('click', function (e) {
    // Ripple effect
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = this.getBoundingClientRect();
    const sz = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      width:${sz}px; height:${sz}px;
      left:${e.clientX - rect.left - sz / 2}px;
      top:${e.clientY  - rect.top  - sz / 2}px;
    `;
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());

    // Smooth scroll
    const targetEl = document.getElementById(this.dataset.target);
    if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
  });
});


// ============================================================
// 4. SCROLL REVEAL
// ============================================================
const revealTargets = document.querySelectorAll(
  '.stat-card, .award-card, .tl-card, .edu-card, .hobby-card, .featured-card'
);

revealTargets.forEach((el, i) => {
  el.classList.add('reveal-item');
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
});

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealTargets.forEach(el => revealObs.observe(el));


// ============================================================
// 5. HERO BG PARALLAX + SCROLL PROGRESS + TOP NAV REVEAL
// ============================================================
const heroBgImg = document.querySelector('.hero-bg-img');
const scrollProgress = document.getElementById('scroll-progress');
const topNav = document.getElementById('top-nav');

window.addEventListener('scroll', () => {
  const sy = window.scrollY;

  // Parallax
  if (heroBgImg && sy < window.innerHeight * 1.2) {
    heroBgImg.style.transform = `scale(1.08) translateY(${sy * 0.22}px)`;
  }

  // Scroll progress
  if (scrollProgress) {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct  = docH > 0 ? (sy / docH) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }

  // Top nav reveal
  if (topNav) {
    if (sy > window.innerHeight * 0.8) {
      topNav.classList.add('visible');
    } else {
      topNav.classList.remove('visible');
    }
  }
}, { passive: true });


// ============================================================
// 6. ACTIVE NAV TRACKING (bubble nav + top nav pills)
// ============================================================
const sections = [
  { id: 'achievements', label: 'achievements' },
  { id: 'experience',   label: 'experience'   },
  { id: 'education',    label: 'education'    },
  { id: 'contact',      label: 'contact'      },
];

const bubbleMap = {};
document.querySelectorAll('.nav-bubble[data-target]').forEach(btn => {
  bubbleMap[btn.dataset.target] = btn;
});

const pillMap = {};
document.querySelectorAll('.top-nav-pill').forEach(pill => {
  const href = pill.getAttribute('href');
  if (href && href.startsWith('#')) pillMap[href.slice(1)] = pill;
});

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.id;
    if (entry.isIntersecting) {
      // Active bubble
      Object.values(bubbleMap).forEach(b => b.classList.remove('active'));
      if (bubbleMap[id]) bubbleMap[id].classList.add('active');
      // Active top nav pill
      Object.values(pillMap).forEach(p => p.classList.remove('active'));
      if (pillMap[id]) pillMap[id].classList.add('active');
    } else {
      // Clear stale active state when section leaves viewport
      if (bubbleMap[id]) bubbleMap[id].classList.remove('active');
      if (pillMap[id])   pillMap[id].classList.remove('active');
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => {
  const el = document.getElementById(s.id);
  if (el) sectionObs.observe(el);
});


// ============================================================
// 7. POLAROID STACK — throw-card cycling
// ============================================================
(function () {
  const stack = document.getElementById('polaroid-stack');
  if (!stack) return;

  const cards = Array.from(stack.querySelectorAll('.polaroid'));
  const n     = cards.length;
  const SLOTS = ['polaroid--active', 'polaroid--behind-1', 'polaroid--behind-2'];

  // queue[0] = index of the front card
  let queue = cards.map((_, i) => i);
  let busy  = false;

  function applyClasses(skipIdx = -1) {
    queue.forEach((cardIdx, slot) => {
      if (cardIdx === skipIdx) return;
      cards[cardIdx].className =
        'polaroid' + (slot < SLOTS.length ? ' ' + SLOTS[slot] : '');
    });
  }

  function next() {
    if (busy) return;
    busy = true;

    const exitIdx = queue[0];

    // Fly the front card out
    cards[exitIdx].classList.add('polaroid--exit');

    // Rotate queue: [0,1,2] → [1,2,0]
    queue = [...queue.slice(1), queue[0]];

    // Smoothly transition the remaining cards to their new positions
    applyClasses(exitIdx);

    // After exit animation, snap the thrown card to behind-2 (invisible under stack)
    setTimeout(() => {
      const card = cards[exitIdx];
      card.style.transition = 'none';
      const slot = queue.indexOf(exitIdx);
      card.className = 'polaroid' + (slot < SLOTS.length ? ' ' + SLOTS[slot] : '');
      requestAnimationFrame(() => requestAnimationFrame(() => {
        card.style.transition = '';
        busy = false;
      }));
    }, 440);
  }

  function prev() {
    if (busy) return;
    busy = true;
    // Pull last card to front: [0,1,2] → [2,0,1]
    queue = [queue[n - 1], ...queue.slice(0, n - 1)];
    applyClasses();
    setTimeout(() => { busy = false; }, 520);
  }

  applyClasses();

  // Click anywhere on stack (not on nav) → next
  stack.addEventListener('click', (e) => {
    if (e.target.closest('.polaroid-nav')) return;
    next();
  });

  stack.querySelector('.pol-prev').addEventListener('click', (e) => {
    e.stopPropagation();
    prev();
  });
  stack.querySelector('.pol-next').addEventListener('click', (e) => {
    e.stopPropagation();
    next();
  });
})();


// ============================================================
// 8. ENVELOPE INTRO
// ============================================================
(function () {
  const intro = document.getElementById('env-intro');
  const env   = document.getElementById('envelope');
  const flap  = document.getElementById('env-flap');
  const seal  = document.getElementById('wax-seal');
  if (!intro || !seal) return;

  // Lock scroll while intro is visible
  document.body.style.overflow = 'hidden';

  seal.addEventListener('click', function () {
    if (seal.classList.contains('breaking')) return;

    // 1. Crack the seal
    seal.classList.add('breaking');

    // 2. Flap lifts open
    setTimeout(() => { flap.classList.add('open'); }, 320);

    // 3. Envelope floats away upward
    setTimeout(() => { env.classList.add('is-exiting'); }, 760);

    // 4. Overlay fades to transparent
    setTimeout(() => {
      intro.style.opacity = '0';
      intro.style.pointerEvents = 'none';
    }, 1060);

    // 5. Remove overlay + restore scroll
    setTimeout(() => {
      intro.remove();
      document.body.style.overflow = '';
    }, 2000);
  });
})();
