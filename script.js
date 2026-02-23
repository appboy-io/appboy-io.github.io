/* ============================================
   CYBERPUNK PORTFOLIO — JavaScript
   ============================================ */

// ── Grid Canvas Background ──────────────────
const canvas = document.getElementById('grid-canvas');
const ctx = canvas.getContext('2d');
let animationId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gridSize = 60;
  const time = Date.now() * 0.001;

  // Horizontal lines
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Vertical lines
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Animated scan line
  const scanY = (time * 50) % canvas.height;
  const gradient = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
  gradient.addColorStop(0, 'rgba(0, 240, 255, 0)');
  gradient.addColorStop(0.5, 'rgba(0, 240, 255, 0.06)');
  gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, scanY - 20, canvas.width, 40);

  // Floating particles
  for (let i = 0; i < 30; i++) {
    const px = (Math.sin(time * 0.3 + i * 2.5) * 0.5 + 0.5) * canvas.width;
    const py = (Math.cos(time * 0.2 + i * 1.8) * 0.5 + 0.5) * canvas.height;
    const size = Math.sin(time + i) * 1.5 + 2;
    const alpha = Math.sin(time * 0.5 + i) * 0.03 + 0.04;

    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fillStyle = i % 3 === 0
      ? `rgba(255, 0, 170, ${alpha})`
      : `rgba(0, 240, 255, ${alpha})`;
    ctx.fill();
  }

  animationId = requestAnimationFrame(drawGrid);
}

resizeCanvas();
drawGrid();
window.addEventListener('resize', resizeCanvas);

// ── Navbar Scroll Effect ─────────────────────
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
});

// ── Mobile Navigation Toggle ─────────────────
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  navToggle.classList.toggle('active');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    navToggle.classList.remove('active');
  });
});

// ── Section Reveal on Scroll ─────────────────
const sections = document.querySelectorAll('.section');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

sections.forEach(section => sectionObserver.observe(section));

// ── Stat Counter Animation ───────────────────
const stats = document.querySelectorAll('.stat-number');
let statsAnimated = false;

function animateStats() {
  if (statsAnimated) return;
  statsAnimated = true;

  stats.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      stat.textContent = Math.round(eased * target);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  });
}

const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateStats();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

// ── Smooth scroll for all anchor links ───────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── Active nav link highlighting ─────────────
const navAnchors = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, {
  threshold: 0.3,
  rootMargin: '-80px 0px -50% 0px'
});

document.querySelectorAll('section[id]').forEach(section => {
  navObserver.observe(section);
});
