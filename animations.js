// =====================================================
// 10 Canvas animations for the AI tech footage library
// Each anim implements:
//   class { constructor(canvas, opts); render(t); dispose(); resize(); }
// All anims are deterministic (seeded) and render to a transparent
// black background so they stack cleanly inside dark cards.
// =====================================================

// ---- Seeded PRNG --------------------------------------------------------
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Base class -------------------------------------------------------------
class BaseAnim {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.opts = opts;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.rng = mulberry32((opts.seed ?? 1) * 9301 + 49297);
    this.w = 0; this.h = 0;
    this.resize();
    this.init?.();
  }
  resize() {
    const r = this.canvas.getBoundingClientRect();
    const w = Math.max(1, Math.floor(r.width * this.dpr));
    const h = Math.max(1, Math.floor(r.height * this.dpr));
    if (w === this.canvas.width && h === this.canvas.height) return;
    this.canvas.width = w; this.canvas.height = h;
    this.w = w; this.h = h;
    this.onResize?.();
  }
  clear(fade = 1) {
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.fillStyle = fade < 1 ? `rgba(5, 6, 9, ${fade})` : "#050609";
    this.ctx.fillRect(0, 0, this.w, this.h);
  }
  dispose() {}
}

// ============================================================
// 1) Particle Network
// ============================================================
class ParticleNetwork extends BaseAnim {
  init() {
    const count = this.opts.count ?? 80;
    this.color = this.opts.color ?? "#6ee7ff";
    this.particles = Array.from({ length: count }, () => ({
      x: this.rng() * this.w, y: this.rng() * this.h,
      vx: (this.rng() - 0.5) * 0.4 * this.dpr,
      vy: (this.rng() - 0.5) * 0.4 * this.dpr,
      r: (this.rng() * 1.2 + 0.6) * this.dpr,
    }));
  }
  onResize() {
    if (!this.particles) return;
    this.particles.forEach(p => {
      if (p.x > this.w) p.x = this.w * this.rng();
      if (p.y > this.h) p.y = this.h * this.rng();
    });
  }
  render() {
    this.clear();
    const ctx = this.ctx;
    const c = this.color;
    const linkDist = 120 * this.dpr;
    // update
    for (const p of this.particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > this.w) p.vx *= -1;
      if (p.y < 0 || p.y > this.h) p.vy *= -1;
    }
    // links
    ctx.lineWidth = 1 * this.dpr;
    for (let i = 0; i < this.particles.length; i++) {
      const a = this.particles[i];
      for (let j = i + 1; j < this.particles.length; j++) {
        const b = this.particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < linkDist * linkDist) {
          const alpha = (1 - Math.sqrt(d2) / linkDist) * 0.5;
          ctx.strokeStyle = hexA(c, alpha);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    // nodes
    for (const p of this.particles) {
      ctx.fillStyle = c;
      ctx.shadowColor = c;
      ctx.shadowBlur = 10 * this.dpr;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }
}

// ============================================================
// 2) Matrix Rain
// ============================================================
class MatrixRain extends BaseAnim {
  init() {
    this.color = this.opts.color ?? "#5eead4";
    this.fontSize = 14 * this.dpr;
    this.chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEF{}<>/\\=+*".split("");
    this.cols = 0; this.drops = [];
    this.setupCols();
  }
  setupCols() {
    this.cols = Math.floor(this.w / this.fontSize);
    this.drops = Array.from({ length: this.cols }, () => this.rng() * -50);
    this.speeds = Array.from({ length: this.cols }, () => 0.3 + this.rng() * 0.7);
  }
  onResize() { this.setupCols(); }
  render() {
    const ctx = this.ctx;
    ctx.fillStyle = "rgba(5, 6, 9, 0.12)";
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.font = `${this.fontSize}px "JetBrains Mono", monospace`;
    ctx.textBaseline = "top";
    for (let i = 0; i < this.cols; i++) {
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;
      const ch = this.chars[Math.floor(this.rng() * this.chars.length)];
      // head bright
      ctx.fillStyle = "#e7fff8";
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8 * this.dpr;
      ctx.fillText(ch, x, y);
      ctx.shadowBlur = 0;
      // trail
      ctx.fillStyle = hexA(this.color, 0.7);
      ctx.fillText(this.chars[Math.floor(this.rng() * this.chars.length)], x, y - this.fontSize);
      ctx.fillStyle = hexA(this.color, 0.35);
      ctx.fillText(this.chars[Math.floor(this.rng() * this.chars.length)], x, y - this.fontSize * 2);
      this.drops[i] += this.speeds[i];
      if (y > this.h && this.rng() > 0.975) this.drops[i] = this.rng() * -20;
    }
  }
}

// ============================================================
// 3) Grid Perspective Pulse
// ============================================================
class GridPulse extends BaseAnim {
  init() {
    this.color = this.opts.color ?? "#6ee7ff";
    this.t = 0;
  }
  render() {
    this.clear();
    const ctx = this.ctx;
    const w = this.w, h = this.h;
    this.t += 0.008;
    const t = this.t;
    const horizon = h * 0.5;
    const cx = w / 2;
    const rows = 22;
    const cols = 22;
    ctx.lineWidth = 1 * this.dpr;
    // floor grid
    for (let i = 0; i < rows; i++) {
      const k = ((i / rows) + t * 0.4) % 1;
      const z = k;            // 0 near horizon, 1 close
      const y = horizon + Math.pow(z, 2.4) * (h - horizon);
      const wid = Math.pow(z, 1.2) * w * 1.4;
      const alpha = Math.min(1, z * 2) * 0.55;
      ctx.strokeStyle = hexA(this.color, alpha);
      ctx.beginPath();
      ctx.moveTo(cx - wid / 2, y);
      ctx.lineTo(cx + wid / 2, y);
      ctx.stroke();
    }
    // radial lines
    for (let i = 0; i <= cols; i++) {
      const u = (i / cols - 0.5);
      const xFar = cx + u * w * 0.16;
      const xNear = cx + u * w * 1.6;
      const grad = ctx.createLinearGradient(xFar, horizon, xNear, h);
      grad.addColorStop(0, hexA(this.color, 0));
      grad.addColorStop(1, hexA(this.color, 0.45));
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(xFar, horizon);
      ctx.lineTo(xNear, h);
      ctx.stroke();
    }
    // pulse wave
    const pulseZ = (t * 0.6) % 1;
    const py = horizon + Math.pow(pulseZ, 2.4) * (h - horizon);
    const pwid = Math.pow(pulseZ, 1.2) * w * 1.4;
    ctx.strokeStyle = hexA("#ffffff", 0.9);
    ctx.lineWidth = 2 * this.dpr;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 20 * this.dpr;
    ctx.beginPath();
    ctx.moveTo(cx - pwid / 2, py);
    ctx.lineTo(cx + pwid / 2, py);
    ctx.stroke();
    ctx.shadowBlur = 0;
    // horizon glow
    const hg = ctx.createLinearGradient(0, horizon - 60 * this.dpr, 0, horizon + 60 * this.dpr);
    hg.addColorStop(0, hexA(this.color, 0));
    hg.addColorStop(0.5, hexA(this.color, 0.25));
    hg.addColorStop(1, hexA(this.color, 0));
    ctx.fillStyle = hg;
    ctx.fillRect(0, horizon - 60 * this.dpr, w, 120 * this.dpr);
  }
}

// ============================================================
// 4) Waveform / Spectrum
// ============================================================
class Waveform extends BaseAnim {
  init() {
    this.color = this.opts.color ?? "#b794ff";
    this.color2 = this.opts.color2 ?? "#6ee7ff";
    this.t = 0;
    this.bars = 64;
    this.phases = Array.from({ length: this.bars }, () => this.rng() * Math.PI * 2);
  }
  render() {
    this.clear();
    const ctx = this.ctx;
    const w = this.w, h = this.h;
    this.t += 0.025;
    const t = this.t;
    const cy = h / 2;
    const bw = w / this.bars;
    // bars (spectrum)
    for (let i = 0; i < this.bars; i++) {
      const phase = this.phases[i];
      const x = i * bw;
      const v = (Math.sin(t * 1.4 + phase) * 0.5 + 0.5)
              * (Math.sin(t * 0.7 + phase * 0.7) * 0.5 + 0.5);
      const barH = v * h * 0.7 + 6 * this.dpr;
      const grad = ctx.createLinearGradient(0, cy - barH / 2, 0, cy + barH / 2);
      const mix = i / this.bars;
      const col = mix < 0.5 ? this.color2 : this.color;
      grad.addColorStop(0, hexA(col, 0.85));
      grad.addColorStop(0.5, hexA("#ffffff", 0.9));
      grad.addColorStop(1, hexA(col, 0.85));
      ctx.fillStyle = grad;
      ctx.fillRect(x + 1 * this.dpr, cy - barH / 2, bw - 2 * this.dpr, barH);
    }
    // overlay wave
    ctx.strokeStyle = hexA("#ffffff", 0.4);
    ctx.lineWidth = 1.5 * this.dpr;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 2 * this.dpr) {
      const u = x / w;
      const y = cy + Math.sin(u * 12 + t * 2) * h * 0.18 * Math.sin(u * Math.PI);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    // center axis
    ctx.strokeStyle = hexA(this.color2, 0.2);
    ctx.lineWidth = 1 * this.dpr;
    ctx.beginPath();
    ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
  }
}

// ============================================================
// 5) Neural Network (layered nodes)
// ============================================================
class NeuralNet extends BaseAnim {
  init() {
    this.color = this.opts.color ?? "#6ee7ff";
    this.color2 = this.opts.color2 ?? "#b794ff";
    this.t = 0;
    this.build();
  }
  onResize() { this.build(); }
  build() {
    const layers = [4, 7, 7, 5, 3];
    const padX = this.w * 0.12;
    const padY = this.h * 0.12;
    const innerW = this.w - padX * 2;
    const innerH = this.h - padY * 2;
    this.nodes = layers.map((n, li) => {
      const x = padX + (innerW / (layers.length - 1)) * li;
      return Array.from({ length: n }, (_, i) => ({
        x, y: padY + innerH * ((i + 0.5) / n),
        r: 3 * this.dpr + this.rng() * 1.5 * this.dpr,
        pulse: this.rng() * Math.PI * 2,
      }));
    });
    // edges
    this.edges = [];
    for (let li = 0; li < this.nodes.length - 1; li++) {
      const A = this.nodes[li], B = this.nodes[li + 1];
      for (const a of A) for (const b of B) {
        this.edges.push({ a, b, weight: this.rng(), phase: this.rng() * Math.PI * 2 });
      }
    }
  }
  render() {
    this.clear();
    const ctx = this.ctx;
    this.t += 0.018;
    const t = this.t;
    // edges
    for (const e of this.edges) {
      const flow = (Math.sin(t * 1.2 + e.phase) * 0.5 + 0.5);
      const alpha = 0.05 + flow * 0.35 * e.weight;
      ctx.strokeStyle = hexA(this.color, alpha);
      ctx.lineWidth = (0.6 + flow * 1.2) * this.dpr;
      ctx.beginPath();
      ctx.moveTo(e.a.x, e.a.y); ctx.lineTo(e.b.x, e.b.y); ctx.stroke();
      // signal travelling
      if (flow > 0.7 && e.weight > 0.4) {
        const k = (Math.sin(t * 1.2 + e.phase) * 0.5 + 0.5);
        const sx = e.a.x + (e.b.x - e.a.x) * k;
        const sy = e.a.y + (e.b.y - e.a.y) * k;
        ctx.fillStyle = "#fff";
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10 * this.dpr;
        ctx.beginPath(); ctx.arc(sx, sy, 1.5 * this.dpr, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
    // nodes
    for (const layer of this.nodes) {
      for (const n of layer) {
        const fire = Math.sin(t * 1.5 + n.pulse) * 0.5 + 0.5;
        ctx.shadowColor = fire > 0.7 ? this.color2 : this.color;
        ctx.shadowBlur = (6 + fire * 14) * this.dpr;
        ctx.fillStyle = fire > 0.7 ? "#fff" : hexA(this.color, 0.85);
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r + fire * 1.5 * this.dpr, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.shadowBlur = 0;
  }
}

// ============================================================
// 6) Circuit Board
// ============================================================
class CircuitBoard extends BaseAnim {
  init() {
    this.color = this.opts.color ?? "#5eead4";
    this.t = 0;
    this.buildTraces();
  }
  onResize() { this.buildTraces(); }
  buildTraces() {
    const cell = 28 * this.dpr;
    const cols = Math.ceil(this.w / cell);
    const rows = Math.ceil(this.h / cell);
    this.cell = cell;
    this.cols = cols; this.rows = rows;
    // build orthogonal trace paths
    this.traces = [];
    const numTraces = 14;
    for (let n = 0; n < numTraces; n++) {
      const path = [];
      let x = Math.floor(this.rng() * cols);
      let y = Math.floor(this.rng() * rows);
      path.push({ x, y });
      const steps = 6 + Math.floor(this.rng() * 8);
      let dir = Math.floor(this.rng() * 4); // 0=R 1=D 2=L 3=U
      for (let i = 0; i < steps; i++) {
        const len = 1 + Math.floor(this.rng() * 4);
        for (let s = 0; s < len; s++) {
          if (dir === 0) x++; else if (dir === 1) y++;
          else if (dir === 2) x--; else y--;
          x = Math.max(0, Math.min(cols - 1, x));
          y = Math.max(0, Math.min(rows - 1, y));
          path.push({ x, y });
        }
        // turn
        dir = (dir + (this.rng() > 0.5 ? 1 : 3)) % 4;
      }
      this.traces.push({ path, offset: this.rng() * 100, speed: 0.4 + this.rng() * 0.8 });
    }
  }
  render() {
    this.clear();
    const ctx = this.ctx;
    this.t += 1;
    // background lattice dots
    ctx.fillStyle = hexA(this.color, 0.08);
    for (let i = 0; i <= this.cols; i++) {
      for (let j = 0; j <= this.rows; j++) {
        ctx.fillRect(i * this.cell - 0.5 * this.dpr, j * this.cell - 0.5 * this.dpr, 1 * this.dpr, 1 * this.dpr);
      }
    }
    // traces base
    ctx.lineWidth = 1.2 * this.dpr;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const tr of this.traces) {
      ctx.strokeStyle = hexA(this.color, 0.25);
      ctx.beginPath();
      tr.path.forEach((p, i) => {
        const x = p.x * this.cell, y = p.y * this.cell;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
      // pads
      ctx.fillStyle = hexA(this.color, 0.5);
      const head = tr.path[0], tail = tr.path[tr.path.length - 1];
      ctx.beginPath(); ctx.arc(head.x * this.cell, head.y * this.cell, 2.5 * this.dpr, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(tail.x * this.cell, tail.y * this.cell, 2.5 * this.dpr, 0, Math.PI * 2); ctx.fill();
    }
    // travelling current
    for (const tr of this.traces) {
      const len = tr.path.length;
      const pos = ((this.t * tr.speed + tr.offset) % (len * 10)) / 10;
      const idx = Math.floor(pos);
      const frac = pos - idx;
      if (idx >= len - 1) continue;
      const a = tr.path[idx], b = tr.path[idx + 1];
      const x = (a.x + (b.x - a.x) * frac) * this.cell;
      const y = (a.y + (b.y - a.y) * frac) * this.cell;
      ctx.fillStyle = "#fff";
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 14 * this.dpr;
      ctx.beginPath(); ctx.arc(x, y, 2.5 * this.dpr, 0, Math.PI * 2); ctx.fill();
      // trail
      for (let k = 1; k <= 6; k++) {
        const tpos = pos - k * 0.5;
        if (tpos < 0) break;
        const ti = Math.floor(tpos), tf = tpos - ti;
        if (ti >= len - 1) continue;
        const ta = tr.path[ti], tb = tr.path[ti + 1];
        const tx = (ta.x + (tb.x - ta.x) * tf) * this.cell;
        const ty = (ta.y + (tb.y - ta.y) * tf) * this.cell;
        ctx.fillStyle = hexA(this.color, (1 - k / 6) * 0.5);
        ctx.beginPath(); ctx.arc(tx, ty, 1.5 * this.dpr, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0;
    }
  }
}

// ============================================================
// 7) Plasma Flow (flowing curves)
// ============================================================
class PlasmaFlow extends BaseAnim {
  init() {
    this.t = 0;
    this.color = this.opts.color ?? "#b794ff";
    this.color2 = this.opts.color2 ?? "#6ee7ff";
  }
  render() {
    // motion blur trail
    const ctx = this.ctx;
    ctx.fillStyle = "rgba(5, 6, 9, 0.12)";
    ctx.fillRect(0, 0, this.w, this.h);
    this.t += 0.006;
    const t = this.t;
    const lines = 60;
    ctx.lineWidth = 1.2 * this.dpr;
    for (let i = 0; i < lines; i++) {
      const k = i / lines;
      const yOffset = (k - 0.5) * this.h * 0.9;
      const col = blend(this.color, this.color2, k);
      ctx.strokeStyle = hexA(col, 0.35);
      ctx.beginPath();
      for (let x = 0; x <= this.w; x += 6 * this.dpr) {
        const u = x / this.w;
        const y = this.h / 2 + yOffset
                + Math.sin(u * 6 + t * 2 + k * 6) * this.h * 0.08
                + Math.sin(u * 3 - t * 1.4 + k * 3) * this.h * 0.06
                + Math.cos(u * 9 + t * 0.7 + k * 9) * this.h * 0.04;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
}

// ============================================================
// 8) Orbital Star Map
// ============================================================
class OrbitalMap extends BaseAnim {
  init() {
    this.color = this.opts.color ?? "#6ee7ff";
    this.t = 0;
    this.stars = Array.from({ length: 80 }, () => ({
      x: this.rng(), y: this.rng(),
      r: this.rng() * 1.2 + 0.3,
      tw: this.rng() * Math.PI * 2,
    }));
    this.orbits = [
      { r: 0.18, speed: 0.5, planets: 1, tilt: 0.4 },
      { r: 0.30, speed: -0.35, planets: 2, tilt: 0.5 },
      { r: 0.42, speed: 0.22, planets: 1, tilt: 0.6 },
      { r: 0.54, speed: -0.16, planets: 3, tilt: 0.55 },
    ];
  }
  render() {
    this.clear();
    const ctx = this.ctx;
    const cx = this.w / 2, cy = this.h / 2;
    this.t += 0.01;
    const t = this.t;
    // stars
    for (const s of this.stars) {
      const a = 0.3 + (Math.sin(t * 2 + s.tw) * 0.5 + 0.5) * 0.6;
      ctx.fillStyle = hexA("#ffffff", a);
      ctx.fillRect(s.x * this.w, s.y * this.h, s.r * this.dpr, s.r * this.dpr);
    }
    // orbits (ellipses)
    const baseR = Math.min(this.w, this.h);
    for (const o of this.orbits) {
      const rx = o.r * baseR;
      const ry = rx * o.tilt;
      ctx.strokeStyle = hexA(this.color, 0.22);
      ctx.lineWidth = 1 * this.dpr;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      // planets
      for (let i = 0; i < o.planets; i++) {
        const a = t * o.speed + (i / o.planets) * Math.PI * 2;
        const x = cx + Math.cos(a) * rx;
        const y = cy + Math.sin(a) * ry;
        ctx.fillStyle = "#fff";
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12 * this.dpr;
        ctx.beginPath(); ctx.arc(x, y, 2.6 * this.dpr, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
    // core
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30 * this.dpr);
    coreGrad.addColorStop(0, hexA("#ffffff", 0.9));
    coreGrad.addColorStop(0.4, hexA(this.color, 0.55));
    coreGrad.addColorStop(1, hexA(this.color, 0));
    ctx.fillStyle = coreGrad;
    ctx.fillRect(cx - 40 * this.dpr, cy - 40 * this.dpr, 80 * this.dpr, 80 * this.dpr);
    // crosshair
    ctx.strokeStyle = hexA(this.color, 0.4);
    ctx.lineWidth = 1 * this.dpr;
    const cr = 24 * this.dpr;
    ctx.beginPath();
    ctx.moveTo(cx - cr, cy); ctx.lineTo(cx - cr * 0.4, cy);
    ctx.moveTo(cx + cr * 0.4, cy); ctx.lineTo(cx + cr, cy);
    ctx.moveTo(cx, cy - cr); ctx.lineTo(cx, cy - cr * 0.4);
    ctx.moveTo(cx, cy + cr * 0.4); ctx.lineTo(cx, cy + cr);
    ctx.stroke();
  }
}

// ============================================================
// 9) Glitch / Scanlines
// ============================================================
class GlitchScan extends BaseAnim {
  init() {
    this.color = this.opts.color ?? "#6ee7ff";
    this.color2 = this.opts.color2 ?? "#ff5577";
    this.t = 0;
    this.scanY = 0;
    this.makeGlitchBands();
  }
  makeGlitchBands() {
    this.bands = Array.from({ length: 6 }, () => ({
      y: this.rng() * this.h,
      h: 3 * this.dpr + this.rng() * 20 * this.dpr,
      offset: (this.rng() - 0.5) * 30 * this.dpr,
      next: this.rng() * 60,
      life: 0,
    }));
  }
  render() {
    this.clear();
    const ctx = this.ctx;
    this.t += 1;
    // baseline noise grid columns
    const colW = 36 * this.dpr;
    for (let x = 0; x < this.w; x += colW) {
      const alpha = 0.04 + Math.sin(this.t * 0.04 + x * 0.01) * 0.04 + 0.06;
      ctx.fillStyle = hexA(this.color, alpha);
      const colH = (Math.sin(this.t * 0.03 + x * 0.02) * 0.5 + 0.5) * this.h * 0.6 + this.h * 0.2;
      ctx.fillRect(x + 4 * this.dpr, this.h - colH, colW - 8 * this.dpr, colH);
    }
    // horizontal scanlines
    for (let y = 0; y < this.h; y += 3 * this.dpr) {
      ctx.fillStyle = hexA("#000000", 0.25);
      ctx.fillRect(0, y, this.w, 1 * this.dpr);
    }
    // sweeping scan
    this.scanY = (this.scanY + 4 * this.dpr) % (this.h + 40 * this.dpr);
    const sg = ctx.createLinearGradient(0, this.scanY - 40 * this.dpr, 0, this.scanY + 40 * this.dpr);
    sg.addColorStop(0, hexA(this.color, 0));
    sg.addColorStop(0.5, hexA(this.color, 0.25));
    sg.addColorStop(1, hexA(this.color, 0));
    ctx.fillStyle = sg;
    ctx.fillRect(0, this.scanY - 40 * this.dpr, this.w, 80 * this.dpr);
    ctx.fillStyle = hexA("#ffffff", 0.5);
    ctx.fillRect(0, this.scanY, this.w, 1 * this.dpr);
    // glitch bands
    for (const b of this.bands) {
      b.life++;
      if (b.life > b.next) {
        b.y = this.rng() * this.h;
        b.h = 3 * this.dpr + this.rng() * 18 * this.dpr;
        b.offset = (this.rng() - 0.5) * 40 * this.dpr;
        b.next = 30 + this.rng() * 120;
        b.life = 0;
      }
      // chroma split rectangles
      ctx.fillStyle = hexA(this.color2, 0.35);
      ctx.fillRect(b.offset, b.y, this.w, b.h);
      ctx.fillStyle = hexA(this.color, 0.35);
      ctx.fillRect(-b.offset, b.y, this.w, b.h);
    }
    // text glitch tag
    ctx.font = `${10 * this.dpr}px "JetBrains Mono", monospace`;
    ctx.fillStyle = hexA(this.color, 0.4);
    ctx.fillText("SIG_LOSS // " + Math.floor(this.t).toString(16).toUpperCase(), 12 * this.dpr, 16 * this.dpr);
  }
}

// ============================================================
// 10) Holographic Radial Scan
// ============================================================
class HoloScan extends BaseAnim {
  init() {
    this.color = this.opts.color ?? "#6ee7ff";
    this.color2 = this.opts.color2 ?? "#b794ff";
    this.t = 0;
    this.targets = Array.from({ length: 7 }, () => ({
      r: this.rng() * 0.4 + 0.05,
      a: this.rng() * Math.PI * 2,
      phase: this.rng() * Math.PI * 2,
    }));
  }
  render() {
    this.clear();
    const ctx = this.ctx;
    const cx = this.w / 2, cy = this.h / 2;
    this.t += 0.02;
    const t = this.t;
    const R = Math.min(this.w, this.h) * 0.45;
    // background radial
    const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    rg.addColorStop(0, hexA(this.color, 0.07));
    rg.addColorStop(1, hexA(this.color, 0));
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, this.w, this.h);
    // rings
    ctx.lineWidth = 1 * this.dpr;
    for (let i = 1; i <= 5; i++) {
      ctx.strokeStyle = hexA(this.color, 0.18);
      ctx.beginPath(); ctx.arc(cx, cy, (R / 5) * i, 0, Math.PI * 2); ctx.stroke();
    }
    // spokes
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      ctx.strokeStyle = hexA(this.color, 0.12);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      ctx.stroke();
    }
    // sweep
    const sweepA = t % (Math.PI * 2);
    const grad = ctx.createConicGradient(sweepA - Math.PI / 2, cx, cy);
    grad.addColorStop(0, hexA(this.color, 0));
    grad.addColorStop(0.05, hexA(this.color, 0.5));
    grad.addColorStop(0.1, hexA(this.color, 0));
    grad.addColorStop(1, hexA(this.color, 0));
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.restore();
    // sweep line
    ctx.strokeStyle = hexA("#ffffff", 0.9);
    ctx.lineWidth = 1.5 * this.dpr;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 12 * this.dpr;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(sweepA) * R, cy + Math.sin(sweepA) * R);
    ctx.stroke();
    ctx.shadowBlur = 0;
    // targets — light up when swept
    for (const tgt of this.targets) {
      const x = cx + Math.cos(tgt.a) * R * tgt.r;
      const y = cy + Math.sin(tgt.a) * R * tgt.r;
      const delta = ((tgt.a - sweepA) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      const lit = delta < 0.4 ? 1 - delta / 0.4 : Math.max(0, 1 - delta * 0.2);
      const size = (1.5 + lit * 3) * this.dpr;
      ctx.fillStyle = lit > 0.3 ? "#fff" : hexA(this.color2, 0.7);
      ctx.shadowColor = this.color2;
      ctx.shadowBlur = (4 + lit * 14) * this.dpr;
      ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill();
      // brackets when lit
      if (lit > 0.4) {
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1 * this.dpr;
        const b = 6 * this.dpr;
        ctx.beginPath();
        ctx.moveTo(x - b, y - b * 0.5); ctx.lineTo(x - b, y - b); ctx.lineTo(x - b * 0.5, y - b);
        ctx.moveTo(x + b, y - b * 0.5); ctx.lineTo(x + b, y - b); ctx.lineTo(x + b * 0.5, y - b);
        ctx.moveTo(x - b, y + b * 0.5); ctx.lineTo(x - b, y + b); ctx.lineTo(x - b * 0.5, y + b);
        ctx.moveTo(x + b, y + b * 0.5); ctx.lineTo(x + b, y + b); ctx.lineTo(x + b * 0.5, y + b);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    }
    // center
    ctx.fillStyle = "#fff";
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 14 * this.dpr;
    ctx.beginPath(); ctx.arc(cx, cy, 2.5 * this.dpr, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// ============================================================
// 11) Isometric Grid (blueprint perspective)
// ============================================================
class IsoGrid extends BaseAnim {
  init() {
    this.color = this.opts.color ?? "#6ee7ff";
    this.color2 = this.opts.color2 ?? "#b794ff";
    this.t = 0;
  }
  render() {
    this.clear();
    const ctx = this.ctx;
    const w = this.w, h = this.h;
    this.t += 0.008;
    const t = this.t;
    const step = 36 * this.dpr;
    const ang = Math.PI / 6; // 30°
    const cx = w / 2, cy = h * 0.58;
    const dx = Math.cos(ang) * step;
    const dy = Math.sin(ang) * step;
    const range = Math.ceil(Math.max(w, h) / step) + 4;

    // depth wash (top fades to dark)
    const wash = ctx.createLinearGradient(0, 0, 0, h);
    wash.addColorStop(0, hexA(this.color, 0));
    wash.addColorStop(1, hexA(this.color, 0.04));
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, w, h);

    // scroll offset (parallax)
    const offX = (t * 30 * this.dpr) % (dx * 2);

    ctx.lineWidth = 1 * this.dpr;
    // axis A — right-down (\)
    for (let i = -range; i < range; i++) {
      const k = (i / range);
      const alpha = 0.18 + (1 - Math.abs(k)) * 0.18;
      ctx.strokeStyle = hexA(this.color, alpha);
      const x0 = cx + i * dx - offX, y0 = cy + i * dy;
      ctx.beginPath();
      ctx.moveTo(x0 - dx * range, y0 + dy * range);
      ctx.lineTo(x0 + dx * range, y0 - dy * range);
      ctx.stroke();
    }
    // axis B — right-up (/)
    for (let i = -range; i < range; i++) {
      const k = (i / range);
      const alpha = 0.18 + (1 - Math.abs(k)) * 0.18;
      ctx.strokeStyle = hexA(this.color, alpha);
      const x0 = cx + i * dx - offX, y0 = cy - i * dy;
      ctx.beginPath();
      ctx.moveTo(x0 - dx * range, y0 - dy * range);
      ctx.lineTo(x0 + dx * range, y0 + dy * range);
      ctx.stroke();
    }
    // vertical axis
    for (let i = -range; i < range; i++) {
      ctx.strokeStyle = hexA(this.color, 0.10);
      const x = cx + i * dx * 2 - offX;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // floating iso cube intersections (highlight nodes)
    const nodes = 16;
    for (let i = 0; i < nodes; i++) {
      const seed = i * 13.37;
      const ix = ((Math.sin(seed) * 0.5 + 0.5) * 2 - 1) * range * 0.7;
      const iy = ((Math.cos(seed * 1.7) * 0.5 + 0.5) * 2 - 1) * range * 0.7;
      const x = cx + ix * dx;
      const y = cy + iy * dy;
      const pulse = (Math.sin(t * 2 + i) * 0.5 + 0.5);
      const a = 0.2 + pulse * 0.8;
      ctx.fillStyle = pulse > 0.7 ? "#fff" : hexA(this.color, a);
      ctx.shadowColor = this.color;
      ctx.shadowBlur = (4 + pulse * 16) * this.dpr;
      ctx.beginPath();
      ctx.arc(x, y, (1.4 + pulse * 1.4) * this.dpr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // sweeping highlight beam (right→left)
    const beamX = ((1 - ((t * 0.3) % 1)) * (w + 200 * this.dpr)) - 100 * this.dpr;
    const beamG = ctx.createLinearGradient(beamX - 80 * this.dpr, 0, beamX + 80 * this.dpr, 0);
    beamG.addColorStop(0, hexA(this.color2, 0));
    beamG.addColorStop(0.5, hexA(this.color2, 0.22));
    beamG.addColorStop(1, hexA(this.color2, 0));
    ctx.fillStyle = beamG;
    ctx.fillRect(beamX - 80 * this.dpr, 0, 160 * this.dpr, h);
  }
}

// ============================================================
// 12) Hex Grid Pulse
// ============================================================
class HexGrid extends BaseAnim {
  init() {
    this.color = this.opts.color ?? "#6ee7ff";
    this.color2 = this.opts.color2 ?? "#b794ff";
    this.t = 0;
    this.build();
  }
  onResize() { this.build(); }
  build() {
    const size = 26 * this.dpr;          // hex "radius"
    const hStep = size * Math.sqrt(3);   // horizontal step (flat-top)
    const vStep = size * 1.5;            // vertical step
    this.size = size;
    this.cols = Math.ceil(this.w / hStep) + 2;
    this.rows = Math.ceil(this.h / vStep) + 2;
    this.cells = [];
    for (let row = -1; row < this.rows; row++) {
      for (let col = -1; col < this.cols; col++) {
        const x = col * hStep + (row % 2 ? hStep / 2 : 0);
        const y = row * vStep;
        const cx = this.w / 2, cy = this.h / 2;
        const dist = Math.hypot(x - cx, y - cy) / Math.hypot(this.w, this.h);
        this.cells.push({ x, y, dist, phase: this.rng() * Math.PI * 2 });
      }
    }
  }
  hex(ctx, x, y, r, fill, stroke) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 6 + i * Math.PI / 3;
      const px = x + Math.cos(a) * r;
      const py = y + Math.sin(a) * r;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
  }
  render() {
    this.clear();
    const ctx = this.ctx;
    this.t += 0.02;
    const t = this.t;
    ctx.lineWidth = 1 * this.dpr;
    // outline pass
    for (const c of this.cells) {
      ctx.strokeStyle = hexA(this.color, 0.10);
      this.hex(ctx, c.x, c.y, this.size, null, hexA(this.color, 0.14));
    }
    // pulsing rings expanding from center
    const ring = (t * 0.3) % 1;
    const ring2 = ((t * 0.3) + 0.5) % 1;
    for (const c of this.cells) {
      // ring 1
      const inBand1 = Math.abs(c.dist - ring) < 0.07;
      const inBand2 = Math.abs(c.dist - ring2) < 0.07;
      const local = Math.sin(t * 1.5 + c.phase) * 0.5 + 0.5;
      let alpha = 0.05 + local * 0.10;
      let glow = false;
      if (inBand1) { alpha += (0.07 - Math.abs(c.dist - ring)) * 6; glow = true; }
      if (inBand2) { alpha += (0.07 - Math.abs(c.dist - ring2)) * 4; glow = true; }
      if (alpha > 0.1) {
        const col = inBand2 && !inBand1 ? this.color2 : this.color;
        this.hex(ctx, c.x, c.y, this.size * 0.88, hexA(col, Math.min(0.85, alpha)));
        if (glow && alpha > 0.45) {
          ctx.shadowColor = col;
          ctx.shadowBlur = 14 * this.dpr;
          this.hex(ctx, c.x, c.y, this.size * 0.55, "#fff");
          ctx.shadowBlur = 0;
        }
      }
    }
  }
}

// ============================================================
// 13) Warped Grid (sine displacement)
// ============================================================
class WarpedGrid extends BaseAnim {
  init() {
    this.color = this.opts.color ?? "#6ee7ff";
    this.color2 = this.opts.color2 ?? "#b794ff";
    this.t = 0;
  }
  render() {
    this.clear();
    const ctx = this.ctx;
    const w = this.w, h = this.h;
    this.t += 0.012;
    const t = this.t;
    const step = 36 * this.dpr;
    const amp = 18 * this.dpr;
    // horizontal lines (displaced vertically)
    ctx.lineWidth = 1 * this.dpr;
    for (let yi = 0; yi <= h; yi += step) {
      const ny = yi / h;
      ctx.strokeStyle = hexA(this.color, 0.18 + Math.sin(t * 0.7 + ny * 4) * 0.12 + 0.18);
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4 * this.dpr) {
        const nx = x / w;
        const dy =
            Math.sin(nx * 4 + t * 1.5 + ny * 3) * amp
          + Math.sin(nx * 8 - t * 0.8) * amp * 0.4;
        const y = yi + dy;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    // vertical lines (displaced horizontally)
    for (let xi = 0; xi <= w; xi += step) {
      const nx = xi / w;
      ctx.strokeStyle = hexA(this.color2, 0.10 + Math.sin(t * 0.5 + nx * 5) * 0.08 + 0.10);
      ctx.beginPath();
      for (let y = 0; y <= h; y += 4 * this.dpr) {
        const ny = y / h;
        const dx =
            Math.sin(ny * 5 - t * 1.2 + nx * 4) * amp * 0.7
          + Math.cos(ny * 9 + t * 0.6) * amp * 0.3;
        const x = xi + dx;
        y === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    // intersection highlights — sample a few "nodes" on the warped grid
    for (let yi = step; yi < h; yi += step * 2) {
      for (let xi = step; xi < w; xi += step * 2) {
        const nx = xi / w, ny = yi / h;
        const dy =
            Math.sin(nx * 4 + t * 1.5 + ny * 3) * amp
          + Math.sin(nx * 8 - t * 0.8) * amp * 0.4;
        const dx =
            Math.sin(ny * 5 - t * 1.2 + nx * 4) * amp * 0.7
          + Math.cos(ny * 9 + t * 0.6) * amp * 0.3;
        const x = xi + dx, y = yi + dy;
        const flash = Math.sin(t * 2 + xi * 0.01 + yi * 0.013);
        if (flash > 0.7) {
          ctx.fillStyle = "#fff";
          ctx.shadowColor = this.color;
          ctx.shadowBlur = 12 * this.dpr;
          ctx.beginPath();
          ctx.arc(x, y, 1.6 * this.dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.shadowBlur = 0;
  }
}

// ============================================================
// 14) Voxel Field — grid cells lighting up like a depth map
// ============================================================
class VoxelGrid extends BaseAnim {
  init() {
    this.color = this.opts.color ?? "#6ee7ff";
    this.color2 = this.opts.color2 ?? "#b794ff";
    this.t = 0;
    this.build();
  }
  onResize() { this.build(); }
  build() {
    this.cell = 22 * this.dpr;
    this.cols = Math.ceil(this.w / this.cell);
    this.rows = Math.ceil(this.h / this.cell);
    this.field = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.field.push({ r, c, seed: this.rng() * 100 });
      }
    }
  }
  render() {
    this.clear();
    const ctx = this.ctx;
    this.t += 0.018;
    const t = this.t;
    const cs = this.cell;
    // base grid
    ctx.strokeStyle = hexA(this.color, 0.06);
    ctx.lineWidth = 1 * this.dpr;
    for (let i = 0; i <= this.cols; i++) {
      ctx.beginPath(); ctx.moveTo(i * cs, 0); ctx.lineTo(i * cs, this.h); ctx.stroke();
    }
    for (let j = 0; j <= this.rows; j++) {
      ctx.beginPath(); ctx.moveTo(0, j * cs); ctx.lineTo(this.w, j * cs); ctx.stroke();
    }
    // depth field — noise-driven intensity per cell
    for (const f of this.field) {
      const x = f.c * cs, y = f.r * cs;
      const n =
          Math.sin(f.c * 0.4 + t * 1.2 + f.seed * 0.1) * 0.5
        + Math.cos(f.r * 0.35 - t * 0.9 + f.seed * 0.07) * 0.5;
      const v = (n + 1) * 0.5; // 0..1
      if (v < 0.55) continue;
      const intensity = (v - 0.55) / 0.45;
      // filled cell
      const col = intensity > 0.75 ? this.color2 : this.color;
      ctx.fillStyle = hexA(col, 0.08 + intensity * 0.55);
      ctx.fillRect(x + 1 * this.dpr, y + 1 * this.dpr, cs - 2 * this.dpr, cs - 2 * this.dpr);
      // bright core when very intense
      if (intensity > 0.8) {
        ctx.fillStyle = hexA("#ffffff", (intensity - 0.8) * 4);
        const inset = cs * 0.32;
        ctx.fillRect(x + inset, y + inset, cs - inset * 2, cs - inset * 2);
      }
    }
    // travelling vertical scan column
    const scanX = ((t * 0.35) % 1) * this.w;
    const scg = ctx.createLinearGradient(scanX - 40 * this.dpr, 0, scanX + 40 * this.dpr, 0);
    scg.addColorStop(0, hexA(this.color2, 0));
    scg.addColorStop(0.5, hexA(this.color2, 0.18));
    scg.addColorStop(1, hexA(this.color2, 0));
    ctx.fillStyle = scg;
    ctx.fillRect(scanX - 40 * this.dpr, 0, 80 * this.dpr, this.h);
    ctx.fillStyle = hexA("#fff", 0.4);
    ctx.fillRect(scanX, 0, 1 * this.dpr, this.h);
    // corner reticle
    ctx.strokeStyle = hexA(this.color, 0.5);
    ctx.lineWidth = 1 * this.dpr;
    const k = 14 * this.dpr;
    [[8,8],[this.w-8,8],[8,this.h-8],[this.w-8,this.h-8]].forEach(([px, py], i) => {
      const sx = i % 2 ? -1 : 1, sy = i < 2 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(px, py + sy * k); ctx.lineTo(px, py); ctx.lineTo(px + sx * k, py);
      ctx.stroke();
    });
  }
}

// ===== Utilities =====================================================
function hexA(hex, a) {
  // accepts #rrggbb
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
function blend(hexA_, hexB, t) {
  const A = [parseInt(hexA_.slice(1,3),16), parseInt(hexA_.slice(3,5),16), parseInt(hexA_.slice(5,7),16)];
  const B = [parseInt(hexB.slice(1,3),16), parseInt(hexB.slice(3,5),16), parseInt(hexB.slice(5,7),16)];
  const m = A.map((v,i)=>Math.round(v + (B[i]-v)*t));
  return "#" + m.map(v=>v.toString(16).padStart(2,"0")).join("");
}

// ===== Registry ======================================================
window.ANIM_REGISTRY = {
  particles:   ParticleNetwork,
  matrix:      MatrixRain,
  grid:        GridPulse,
  waveform:    Waveform,
  neural:      NeuralNet,
  circuit:     CircuitBoard,
  plasma:      PlasmaFlow,
  orbital:     OrbitalMap,
  glitch:      GlitchScan,
  holo:        HoloScan,
  iso:         IsoGrid,
  hex:         HexGrid,
  warp:        WarpedGrid,
  voxel:       VoxelGrid,
};
