// =====================================================
// Site logic — grid, hover-play, sidebar preview, recording
// =====================================================

const TEMPLATES = [
  {
    id: "particles",
    code: "TPL-001",
    nameZh: "粒子网络",
    nameEn: "Particle Network",
    category: "粒子",
    color: "#6ee7ff",
    color2: "#6ee7ff",
    span: "s-wide",
    desc: "节点漂浮、近距连线，营造数据节点协作的氛围；适合作为产品开场、智能体调度场景的衬底。",
    duration: 12,
    fmt: "MP4 · H.264",
    tag: "Cyan",
  },
  {
    id: "matrix",
    code: "TPL-002",
    nameZh: "矩阵雨",
    nameEn: "Matrix Rain",
    category: "数据流",
    color: "#5eead4",
    color2: "#5eead4",
    span: "s-tall",
    desc: "字符流自上而下下落，经典 cyber 视觉，适合 AI 训练、加密、信息流的桥段。",
    duration: 10,
    fmt: "MP4 · H.264",
    tag: "Teal",
  },
  {
    id: "grid",
    code: "TPL-003",
    nameZh: "网格脉冲",
    nameEn: "Grid Pulse",
    category: "网格",
    color: "#6ee7ff",
    color2: "#6ee7ff",
    span: "s-tall",
    desc: "透视网格无限延伸，叠加白色脉冲波；展望未来、引导视线穿越的万能转场。",
    duration: 8,
    fmt: "MP4 · H.264",
    tag: "Cyan",
  },
  {
    id: "neural",
    code: "TPL-004",
    nameZh: "神经网络",
    nameEn: "Neural Network",
    category: "粒子",
    color: "#6ee7ff",
    color2: "#b794ff",
    span: "s-md",
    desc: "多层节点逐层激活，信号沿权重连边流动；可视化模型推理、机器学习训练过程。",
    duration: 12,
    fmt: "MP4 · H.264",
    tag: "Cyan",
  },
  {
    id: "circuit",
    code: "TPL-005",
    nameZh: "电路板纹路",
    nameEn: "Circuit Board",
    category: "网格",
    color: "#5eead4",
    color2: "#5eead4",
    span: "s-md",
    desc: "正交走线 + 焊点，明亮电流沿轨迹脉冲；硬件、芯片、边缘计算主题首选。",
    duration: 10,
    fmt: "MP4 · H.264",
    tag: "Teal",
  },
  {
    id: "waveform",
    code: "TPL-006",
    nameZh: "波形可视化",
    nameEn: "Spectrum Waveform",
    category: "波形",
    color: "#b794ff",
    color2: "#6ee7ff",
    span: "s-md-w",
    desc: "实时频谱柱 + 叠加波线，紫青配色；语音 AI、TTS、音频生成产品适用。",
    duration: 9,
    fmt: "MP4 · H.264",
    tag: "Violet",
  },
  {
    id: "plasma",
    code: "TPL-007",
    nameZh: "等离子流体",
    nameEn: "Plasma Flow",
    category: "流体",
    color: "#b794ff",
    color2: "#6ee7ff",
    span: "s-md-w",
    desc: "柔和的丝绸状曲线流动，紫青渐变；适合品牌篇尾、情感化叙事。",
    duration: 14,
    fmt: "MP4 · H.264",
    tag: "Gradient",
  },
  {
    id: "orbital",
    code: "TPL-008",
    nameZh: "轨道星图",
    nameEn: "Orbital Star Map",
    category: "粒子",
    color: "#6ee7ff",
    color2: "#6ee7ff",
    span: "s-sm",
    desc: "中心核 + 多层椭圆轨道，行星运转；表达系统、生态、行星级算力。",
    duration: 11,
    fmt: "MP4 · H.264",
    tag: "Cyan",
  },
  {
    id: "glitch",
    code: "TPL-009",
    nameZh: "故障扫描",
    nameEn: "Glitch Scan",
    category: "故障",
    color: "#6ee7ff",
    color2: "#ff5577",
    span: "s-sm",
    desc: "扫描线、色差错位、信号丢失文本；安全攻防、对抗样本、Hacker 风格。",
    duration: 8,
    fmt: "MP4 · H.264",
    tag: "RGB",
  },
  {
    id: "holo",
    code: "TPL-010",
    nameZh: "全息雷达",
    nameEn: "Holographic Radar",
    category: "网格",
    color: "#6ee7ff",
    color2: "#b794ff",
    span: "s-md-w",
    desc: "环形雷达扫掠 + 目标锁定动效；态势感知、自动驾驶、目标识别叙事。",
    duration: 10,
    fmt: "MP4 · H.264",
    tag: "Cyan",
  },
  {
    id: "iso",
    code: "TPL-011",
    nameZh: "等距网格",
    nameEn: "Isometric Grid",
    category: "网格",
    color: "#6ee7ff",
    color2: "#b794ff",
    span: "s-md",
    desc: "30° 蓝图风等距网格，光束横扫 + 节点点亮；架构图、技术大纲、BIM 风格首屏。",
    duration: 10,
    fmt: "MP4 · H.264",
    tag: "Blueprint",
  },
  {
    id: "hex",
    code: "TPL-012",
    nameZh: "蜂窝网格",
    nameEn: "Hex Grid Pulse",
    category: "网格",
    color: "#5eead4",
    color2: "#6ee7ff",
    span: "s-tall",
    desc: "六边形蜂窝矩阵，环形脉冲由中心向外扩散；区块链、分布式集群、模块化算力。",
    duration: 9,
    fmt: "MP4 · H.264",
    tag: "Teal",
  },
  {
    id: "warp",
    code: "TPL-013",
    nameZh: "数字波纹",
    nameEn: "Warped Grid",
    category: "网格",
    color: "#b794ff",
    color2: "#6ee7ff",
    span: "s-wide",
    desc: "网格沿正弦扭曲，像数据被空间引力弯折；时空、生成式、低代码平台的氛围背景。",
    duration: 12,
    fmt: "MP4 · H.264",
    tag: "Violet",
  },
  {
    id: "voxel",
    code: "TPL-014",
    nameZh: "体素方阵",
    nameEn: "Voxel Field",
    category: "网格",
    color: "#6ee7ff",
    color2: "#b794ff",
    span: "s-sm",
    desc: "网格单元按噪声场点亮，竖向光柱扫描；存储阵列、像素深度图、数字孪生。",
    duration: 10,
    fmt: "MP4 · H.264",
    tag: "Cyan",
  },
  {
    id: "finegrid",
    code: "TPL-015",
    nameZh: "细网格上移",
    nameEn: "Fine Grid Scroll",
    category: "极简",
    color: "#6ee7ff",
    color2: "#6ee7ff",
    span: "s-wide",
    desc: "极细网格线缓慢向上滚动，深色底 + 微光交点；极简科技感衬底，适合人物讲解、产品介绍、演示文稿背景。",
    duration: 15,
    fmt: "MP4 · H.264",
    tag: "Minimal",
  },
];

// Approximate filesize from duration + total pixels
function approxSize(duration, dims) {
  // ~rough: assume bitrate scales with pixels; 1080p@60 ≈ 12Mbps; 4K ≈ 35Mbps
  const px = dims.w * dims.h;
  const bitrate = Math.max(4, (px / (1920 * 1080)) * 12); // Mbps
  const mb = (duration * bitrate) / 8;
  return mb < 1000 ? `${mb.toFixed(1)} MB` : `${(mb/1000).toFixed(2)} GB`;
}

// ============================================================
// Render grid
// ============================================================
const grid = document.getElementById("grid");

function renderGrid(filter = "all", query = "") {
  grid.innerHTML = "";
  const filtered = TEMPLATES.filter(t => {
    if (filter !== "all" && t.category !== filter) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!t.nameZh.includes(query) && !t.nameEn.toLowerCase().includes(q) && !t.id.includes(q)) return false;
    }
    return true;
  });
  filtered.forEach((t, idx) => {
    const card = document.createElement("article");
    card.className = `card ${t.span}`;
    card.dataset.id = t.id;
    const downloads = (1200 + (t.id.charCodeAt(0) * 137) % 8800).toLocaleString();
    card.innerHTML = `
      <div class="card-inner">
        <canvas class="card-canvas"></canvas>
        <div class="card-overlay"></div>
        <div class="card-top">
          <div class="card-code">${t.code}</div>
          <div class="card-tag-stack">
            <span class="card-tag t-yellow">4K · ${(t.duration|0).toString().padStart(2,"0")}s</span>
            <span class="card-tag"><span class="sw" style="background:${t.color}"></span>${t.tag}</span>
          </div>
        </div>
        <div class="play-indicator"><span class="dot"></span>PLAYING</div>
        <div class="hover-hint">
          <div class="ring">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>
      <div class="card-actions">
        <button class="icon-btn" data-act="preview" title="预览 / Preview">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button class="icon-btn" data-act="download" title="下载 / Download">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </button>
      </div>
      <div class="card-bottom">
        <div class="card-title">${t.nameZh}<span class="en">${t.nameEn}</span></div>
        <div class="card-meta">
          <span>3840 × 2160 · 4K</span>
          <span><span class="dl-count">↓ ${downloads}</span> · ${approxSize(t.duration, {w: 3840, h: 2160})}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
  initCards();
}

// ============================================================
// Canvas controllers — keep an instance per card + sidebar
// ============================================================
const activeInstances = new Map(); // canvas -> anim instance
let rafId;

function ensureAnim(canvas, tpl) {
  if (activeInstances.has(canvas)) return activeInstances.get(canvas);
  const Cls = window.ANIM_REGISTRY[tpl.id];
  if (!Cls) return null;
  const inst = new Cls(canvas, { seed: tpl.id.length + 7, color: tpl.color, color2: tpl.color2 });
  activeInstances.set(canvas, inst);
  return inst;
}

function disposeAnim(canvas) {
  const inst = activeInstances.get(canvas);
  if (inst) { inst.dispose(); activeInstances.delete(canvas); }
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Render one "poster" frame for an idle card (so it's not just black)
function paintPoster(canvas, tpl) {
  const Cls = window.ANIM_REGISTRY[tpl.id];
  if (!Cls) return;
  const inst = new Cls(canvas, { seed: tpl.id.length + 7, color: tpl.color, color2: tpl.color2 });
  // step a few frames so we get a settled look
  for (let i = 0; i < 60; i++) inst.render();
  // we throw away inst — no animation loop while idle
}

const playingCards = new Set();

function initCards() {
  const cards = grid.querySelectorAll(".card");
  cards.forEach(card => {
    const tpl = TEMPLATES.find(t => t.id === card.dataset.id);
    const canvas = card.querySelector(".card-canvas");
    // initial poster
    requestAnimationFrame(() => {
      const inst = ensureAnim(canvas, tpl);
      if (inst) { inst.resize(); for (let i = 0; i < 80; i++) inst.render(); }
      // After poster, mark this canvas as paused (we'll resume on hover)
      // We keep the instance around so resumption is instant.
    });
    card.addEventListener("mouseenter", () => {
      ensureAnim(canvas, tpl);
      playingCards.add(card);
      card.classList.add("is-playing");
    });
    card.addEventListener("mouseleave", () => {
      playingCards.delete(card);
      card.classList.remove("is-playing");
    });
    card.addEventListener("click", (e) => {
      const act = e.target.closest("[data-act]");
      if (act?.dataset.act === "download") {
        openSidebar(tpl, { autoRecord: true });
        return;
      }
      openSidebar(tpl);
    });
  });
}

function tick() {
  playingCards.forEach(card => {
    const canvas = card.querySelector(".card-canvas");
    const inst = activeInstances.get(canvas);
    if (inst) { inst.resize(); inst.render(); }
  });
  // sidebar preview
  if (SB.playing && SB.inst) {
    SB.inst.resize();
    SB.inst.render();
    updateTimecode();
  }
  rafId = requestAnimationFrame(tick);
}
rafId = requestAnimationFrame(tick);

// ============================================================
// Sidebar preview
// ============================================================
const SB = {
  open: false,
  tpl: null,
  inst: null,
  canvas: document.getElementById("sb-canvas"),
  preview: document.querySelector(".sb-preview"),
  playing: false,
  startTs: 0,
  ratio: "16:9",       // 16:9 / 9:16 / 1:1 / 4:3 / 3:4 / 21:9
  resTier: "hd",       // sd / hd / 4k
  durationSec: 10,
  recorder: null,
  recordingChunks: [],
};

const RES_TIER_SHORT = { sd: 720, hd: 1080, "4k": 2160 };

function computeDims(ratio, tier) {
  const [a, b] = ratio.split(":").map(Number);
  const short = RES_TIER_SHORT[tier];
  if (a >= b) return { w: Math.round(short * a / b), h: short };
  return { w: short, h: Math.round(short * b / a) };
}

function applyPreviewRatio() {
  const [a, b] = SB.ratio.split(":");
  SB.preview.style.setProperty("--preview-ratio", `${a}/${b}`);
}

function openSidebar(tpl, { autoRecord = false } = {}) {
  SB.tpl = tpl;
  SB.durationSec = tpl.duration;
  SB.ratio = "16:9";
  SB.resTier = "hd";
  document.getElementById("sb-tmpl-id").textContent = tpl.code;
  document.getElementById("sb-title").innerHTML = `${tpl.nameZh}<span class="en">${tpl.nameEn}</span>`;
  document.getElementById("sb-desc").textContent = tpl.desc;
  document.getElementById("sb-spec-dur").textContent = tpl.duration + ".00 s";
  document.getElementById("sb-spec-fmt").textContent = tpl.fmt;
  document.getElementById("sb-spec-fps").textContent = "60 fps";
  document.getElementById("sb-spec-codec").textContent = "WebM · VP9";

  // reset duration buttons
  document.querySelectorAll('[data-group="sb-dur"]').forEach(b => {
    b.setAttribute("aria-pressed", +b.dataset.val === tpl.duration ? "true" : "false");
  });
  setActiveOption("sb-ratio", SB.ratio);
  setActiveOption("sb-res", SB.resTier);
  applyPreviewRatio();
  updateSpecsForSelection();

  // init preview anim
  if (SB.inst) { SB.inst.dispose(); SB.inst = null; }
  const Cls = window.ANIM_REGISTRY[tpl.id];
  if (Cls) {
    SB.inst = new Cls(SB.canvas, { seed: tpl.id.length + 7, color: tpl.color, color2: tpl.color2 });
    SB.inst.resize();
  }
  SB.startTs = performance.now();
  SB.playing = true;

  // related grid
  const related = document.getElementById("sb-related");
  related.innerHTML = "";
  const others = TEMPLATES.filter(t => t.id !== tpl.id).slice(0, 6);
  others.forEach(o => {
    const div = document.createElement("div");
    div.className = "related-item";
    div.innerHTML = `<canvas></canvas><div class="lbl">${o.code} · ${o.nameZh}</div>`;
    related.appendChild(div);
    const c = div.querySelector("canvas");
    requestAnimationFrame(() => {
      const cls = window.ANIM_REGISTRY[o.id];
      if (cls) {
        const inst = new cls(c, { seed: o.id.length + 7, color: o.color, color2: o.color2 });
        inst.resize();
        for (let i = 0; i < 50; i++) inst.render();
      }
    });
    div.addEventListener("click", () => openSidebar(o));
  });

  // mark active in grid
  document.querySelectorAll(".card").forEach(c => c.classList.toggle("active", c.dataset.id === tpl.id));

  // open
  document.getElementById("sidebar").classList.add("open");
  document.getElementById("sidebar-scrim").classList.add("open");
  SB.open = true;

  if (autoRecord) setTimeout(() => startRecording(), 400);
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebar-scrim").classList.remove("open");
  SB.open = false;
  SB.playing = false;
  document.querySelectorAll(".card.active").forEach(c => c.classList.remove("active"));
}

function updateTimecode() {
  const tc = document.getElementById("sb-timecode");
  if (!tc) return;
  const sec = ((performance.now() - SB.startTs) / 1000) % SB.durationSec;
  const f = Math.floor((sec % 1) * 60);
  tc.textContent = `${String(Math.floor(sec)).padStart(2,"0")}:${String(f).padStart(2,"0")} / ${String(SB.durationSec).padStart(2,"0")}:00`;
}

document.getElementById("sb-close").addEventListener("click", closeSidebar);
document.getElementById("sidebar-scrim").addEventListener("click", closeSidebar);
document.addEventListener("keydown", e => { if (e.key === "Escape" && SB.open) closeSidebar(); });

// Option pickers (ratio / resolution / duration)
function setActiveOption(group, val) {
  document.querySelectorAll(`[data-group="${group}"]`).forEach(b => {
    b.setAttribute("aria-pressed", b.dataset.val === val);
  });
  if (group === "sb-ratio") {
    SB.ratio = val;
    applyPreviewRatio();
    // canvas dims change → reinit anim so it relays out
    if (SB.tpl) {
      requestAnimationFrame(() => {
        if (SB.inst) { SB.inst.dispose(); }
        const Cls = window.ANIM_REGISTRY[SB.tpl.id];
        SB.inst = new Cls(SB.canvas, { seed: SB.tpl.id.length + 7, color: SB.tpl.color, color2: SB.tpl.color2 });
        SB.inst.resize();
        SB.startTs = performance.now();
      });
    }
  } else if (group === "sb-res") {
    SB.resTier = val;
  } else if (group === "sb-dur") {
    SB.durationSec = +val;
    document.getElementById("sb-spec-dur").textContent = val + ".00 s";
    SB.startTs = performance.now();
  }
  updateSpecsForSelection();
}

function updateSpecsForSelection() {
  const dims = computeDims(SB.ratio, SB.resTier);
  const tierLabel = { sd: "720p", hd: "1080p", "4k": "4K UHD" }[SB.resTier];
  document.getElementById("sb-spec-res").textContent = `${dims.w} × ${dims.h}`;
  document.getElementById("sb-spec-size").textContent = approxSize(SB.durationSec, dims);
  const fmt = document.getElementById("sb-spec-fmt");
  if (fmt) fmt.textContent = `MP4 · ${SB.ratio} · ${tierLabel}`;
}

document.querySelectorAll("[data-group]").forEach(b => {
  b.addEventListener("click", () => setActiveOption(b.dataset.group, b.dataset.val));
});

// ============================================================
// Recording — capture the preview canvas as WebM
// ============================================================
function startRecording() {
  if (SB.recorder) return;
  const btn = document.getElementById("sb-download");
  btn.classList.add("recording");
  const hint = document.getElementById("sb-dl-hint");
  const prog = document.getElementById("sb-dl-progress");
  const progBar = document.getElementById("sb-dl-progress-bar");
  prog.classList.add("show");
  hint.classList.add("show");
  hint.textContent = "正在生成视频 · Encoding...";
  btn.querySelector(".lbl").textContent = "录制中…";

  // capture canvas stream at 60fps
  const stream = SB.canvas.captureStream(60);
  const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : "video/webm";
  SB.recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 });
  SB.recordingChunks = [];
  SB.recorder.ondataavailable = e => e.data.size && SB.recordingChunks.push(e.data);
  SB.recorder.onstop = () => {
    const blob = new Blob(SB.recordingChunks, { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${SB.tpl.code}_${SB.tpl.nameEn.replace(/\s+/g,"_")}_${SB.resolution}.webm`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    btn.classList.remove("recording");
    btn.querySelector(".lbl").textContent = "下载 MP4 · Download";
    prog.classList.remove("show");
    hint.textContent = "已生成 · 注：浏览器导出为 WebM（可在剪辑软件直接导入或转 MP4）";
    progBar.style.width = "0%";
    showToast("下载完成");
    SB.recorder = null;
  };
  SB.recorder.start();

  // duration with progress
  const start = performance.now();
  const total = SB.durationSec * 1000;
  function poll() {
    if (!SB.recorder) return;
    const elapsed = performance.now() - start;
    const pct = Math.min(100, (elapsed / total) * 100);
    progBar.style.width = pct + "%";
    if (elapsed >= total) {
      SB.recorder.stop();
    } else {
      requestAnimationFrame(poll);
    }
  }
  poll();
}

document.getElementById("sb-download").addEventListener("click", startRecording);
document.getElementById("sb-copylink").addEventListener("click", () => {
  navigator.clipboard?.writeText(location.href + "#" + SB.tpl.id).catch(()=>{});
  showToast("链接已复制");
});

// ============================================================
// Toast
// ============================================================
function showToast(msg) {
  const t = document.getElementById("toast");
  t.querySelector(".msg").textContent = msg;
  t.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove("show"), 2400);
}

// ============================================================
// Filter chips / search / sort
// ============================================================
const CATEGORIES = ["all", "粒子", "数据流", "网格", "波形", "流体", "故障", "极简"];
const chipBar = document.getElementById("chips");
CATEGORIES.forEach((c, i) => {
  const btn = document.createElement("button");
  btn.className = "chip";
  btn.setAttribute("aria-pressed", i === 0);
  btn.dataset.cat = c;
  const labels = {
    "all": "全部 ALL",
    "粒子": "粒子 Particles",
    "数据流": "数据流 Data Flow",
    "网格": "网格 Grid",
    "波形": "波形 Waveform",
    "流体": "流体 Plasma",
    "故障": "故障 Glitch",
    "极简": "极简 Minimal",
  };
  btn.textContent = labels[c];
  chipBar.appendChild(btn);
  btn.addEventListener("click", () => {
    chipBar.querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", x === btn));
    renderGrid(c, document.getElementById("search").value);
  });
});

document.getElementById("search").addEventListener("input", e => {
  const active = chipBar.querySelector(".chip[aria-pressed='true']")?.dataset.cat || "all";
  renderGrid(active, e.target.value);
});

// ============================================================
// Tweaks panel
// ============================================================
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#6ee7ff",
  "density": 1.0,
  "speed": 1.0,
  "showMeta": true,
  "view": "masonry"
}/*EDITMODE-END*/;

const tweaks = { ...TWEAK_DEFAULTS };

const TWEAK_COLORS = [
  { v: "#6ee7ff", label: "Cyan" },
  { v: "#b794ff", label: "Violet" },
  { v: "#5eead4", label: "Teal" },
  { v: "#f59e0b", label: "Amber" },
];

window.addEventListener("message", e => {
  if (e.data?.type === "__activate_edit_mode") showTweaks(true);
  if (e.data?.type === "__deactivate_edit_mode") showTweaks(false);
});

function buildTweaks() {
  const panel = document.getElementById("tweaks");
  panel.innerHTML = `
    <div class="tw-head">
      <h4>Tweaks</h4>
      <button class="sb-close" id="tw-close" title="关闭">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <div class="tw-body">
      <div class="tw-row">
        <label>强调色 · Accent</label>
        <div class="tw-swatches">
          ${TWEAK_COLORS.map(c => `<button class="tw-swatch" data-color="${c.v}" style="background:${c.v}" title="${c.label}"></button>`).join("")}
        </div>
      </div>
      <div class="tw-row">
        <label>动效速度 · Speed <span class="mono" id="tw-speed-val">1.0×</span></label>
        <input type="range" class="tw-slider" id="tw-speed" min="0.3" max="2.5" step="0.1" value="${tweaks.speed}">
      </div>
      <div class="tw-row">
        <label>粒子密度 · Density <span class="mono" id="tw-density-val">100%</span></label>
        <input type="range" class="tw-slider" id="tw-density" min="0.4" max="2.0" step="0.1" value="${tweaks.density}">
      </div>
      <div class="tw-row">
        <label>显示元数据</label>
        <div class="tw-toggle">
          <button data-meta="true" aria-pressed="${tweaks.showMeta}">ON</button>
          <button data-meta="false" aria-pressed="${!tweaks.showMeta}">OFF</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById("tw-close").addEventListener("click", () => {
    showTweaks(false);
    window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
  });
  panel.querySelectorAll("[data-color]").forEach(b => {
    b.setAttribute("aria-pressed", b.dataset.color === tweaks.accent);
    b.addEventListener("click", () => {
      tweaks.accent = b.dataset.color;
      panel.querySelectorAll("[data-color]").forEach(x => x.setAttribute("aria-pressed", x.dataset.color === tweaks.accent));
      applyTweaks();
      persistTweaks();
    });
  });
  document.getElementById("tw-speed").addEventListener("input", e => {
    tweaks.speed = +e.target.value;
    document.getElementById("tw-speed-val").textContent = tweaks.speed.toFixed(1) + "×";
    applyTweaks();
    persistTweaks();
  });
  document.getElementById("tw-density").addEventListener("input", e => {
    tweaks.density = +e.target.value;
    document.getElementById("tw-density-val").textContent = Math.round(tweaks.density * 100) + "%";
    persistTweaks();
  });
  panel.querySelectorAll("[data-meta]").forEach(b => {
    b.addEventListener("click", () => {
      tweaks.showMeta = b.dataset.meta === "true";
      panel.querySelectorAll("[data-meta]").forEach(x => x.setAttribute("aria-pressed", x.dataset.meta === String(tweaks.showMeta)));
      applyTweaks();
      persistTweaks();
    });
  });
}

function showTweaks(on) {
  const panel = document.getElementById("tweaks");
  panel.classList.toggle("show", on);
}

function persistTweaks() {
  window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { ...tweaks } }, "*");
}

function applyTweaks() {
  document.documentElement.style.setProperty("--accent", tweaks.accent);
  // recolor animations: rebuild instances with new accent
  // for simplicity, dispose all and let hover re-init naturally; also re-poster
  document.body.classList.toggle("hide-meta", !tweaks.showMeta);
  // recolor each instance
  activeInstances.forEach((inst, canvas) => {
    if (inst.color) inst.color = tweaks.accent;
  });
  if (SB.inst) SB.inst.color = tweaks.accent;
}
const metaStyle = document.createElement("style");
metaStyle.textContent = `body.hide-meta .card-meta, body.hide-meta .card-tags { opacity: 0; }`;
document.head.appendChild(metaStyle);

buildTweaks();

// Announce tweaks support to host AFTER message handler is wired up.
window.parent.postMessage({ type: "__edit_mode_available" }, "*");

// ============================================================
// Initial render
// ============================================================
renderGrid();

// Resize observer so canvases stay sharp
const ro = new ResizeObserver(() => {
  // for all canvas-based instances, request resize on next tick
  activeInstances.forEach((inst, canvas) => inst.resize());
  if (SB.inst) SB.inst.resize();
});
ro.observe(document.body);
