// Hero: "editor" oko logotipa (obrezivanje, rotacija, pomicanje, slojevi, boje)
// i lotos koji se odbija po ekranu kao stari DVD logo

const hero = document.querySelector(".hero");
const editor = hero.querySelector(".editor");
const canvas = editor.querySelector(".editor__canvas");
const content = editor.querySelector(".editor__content");
const panel = editor.querySelector("#editor-panel");
const settingsBtn = editor.querySelector('[data-tool="settings"]');

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const state = { x: 0, y: 0, rot: 0, crop: { t: 0, r: 0, b: 0, l: 0 } };

function render() {
  const style = canvas.style;
  style.setProperty("--x", `${state.x}px`);
  style.setProperty("--y", `${state.y}px`);
  style.setProperty("--rot", `${state.rot}deg`);
  style.setProperty("--ct", `${state.crop.t}px`);
  style.setProperty("--cr", `${state.crop.r}px`);
  style.setProperty("--cb", `${state.crop.b}px`);
  style.setProperty("--cl", `${state.crop.l}px`);
}

// Promjena s glatkom animacijom (za klik na rotaciju i reset)
function animate(change) {
  canvas.classList.add("is-animating");
  change();
  render();
  setTimeout(() => canvas.classList.remove("is-animating"), 450);
}

// Povlačenje mišem ili prstom. move(event, dx, dy, ctx), end(event, moved, ctx)
function onDrag(target, { start, move, end }) {
  target.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    target.setPointerCapture(event.pointerId);

    const ctx = start ? start(event) : {};
    const startX = event.clientX;
    const startY = event.clientY;
    let moved = false;

    const onMove = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      if (moved) move(e, dx, dy, ctx);
    };
    const onUp = (e) => {
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerup", onUp);
      target.removeEventListener("pointercancel", onUp);
      if (end) end(e, moved, ctx);
    };

    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerup", onUp);
    target.addEventListener("pointercancel", onUp);
  });
}

// --- pomicanje cijelog logotipa ---
onDrag(content, {
  start: () => ({ x: state.x, y: state.y }),
  move: (e, dx, dy, s) => {
    state.x = clamp(s.x + dx, -hero.clientWidth / 2, hero.clientWidth / 2);
    state.y = clamp(s.y + dy, -300, 300);
    render();
  },
});

// --- obrezivanje povlačenjem kutova ---
const MIN_SIZE = 60;

editor.querySelectorAll(".editor__handle").forEach((handle) => {
  const corner = handle.dataset.corner; // nw, ne, sw, se

  onDrag(handle, {
    start: () => {
      handle.classList.add("is-dragging");
      return { ...state.crop, w: content.offsetWidth, h: content.offsetHeight };
    },
    move: (e, dx, dy, s) => {
      // pomak prebacimo u koordinate zarotiranog logotipa
      const angle = (-state.rot * Math.PI) / 180;
      const lx = dx * Math.cos(angle) - dy * Math.sin(angle);
      const ly = dx * Math.sin(angle) + dy * Math.cos(angle);
      const crop = state.crop;

      if (corner.includes("n")) crop.t = clamp(s.t + ly, 0, s.h - s.b - MIN_SIZE);
      if (corner.includes("s")) crop.b = clamp(s.b - ly, 0, s.h - s.t - MIN_SIZE);
      if (corner.includes("w")) crop.l = clamp(s.l + lx, 0, s.w - s.r - MIN_SIZE);
      if (corner.includes("e")) crop.r = clamp(s.r - lx, 0, s.w - s.l - MIN_SIZE);
      render();
    },
    end: () => handle.classList.remove("is-dragging"),
  });
});

// --- rotacija: povuci za slobodno okretanje (Shift = koraci od 15°), klik = +15° ---
const rotateBtn = editor.querySelector(".editor__rotate");

function angleTo(event) {
  const rect = canvas.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  return (Math.atan2(event.clientY - cy, event.clientX - cx) * 180) / Math.PI;
}

function rotateBy(degrees) {
  animate(() => (state.rot += degrees));
}

onDrag(rotateBtn, {
  start: (e) => ({ rot: state.rot, startAngle: angleTo(e) }),
  move: (e, dx, dy, s) => {
    let rot = s.rot + angleTo(e) - s.startAngle;
    if (e.shiftKey) rot = Math.round(rot / 15) * 15;
    state.rot = rot;
    render();
  },
  end: (e, moved) => {
    if (!moved) rotateBy(15);
  },
});

// tipkovnica (Enter/Space), pointer klikovi su već obrađeni gore
rotateBtn.addEventListener("click", (e) => {
  if (e.detail === 0) rotateBy(15);
});

// --- reset ---
function resetEditor() {
  animate(() => {
    state.x = 0;
    state.y = 0;
    state.rot = Math.round(state.rot / 360) * 360; // bez vrtnje u krug
    state.crop = { t: 0, r: 0, b: 0, l: 0 };
  });
  resetLayers();
}

content.addEventListener("dblclick", resetEditor);
panel.querySelector("[data-reset]").addEventListener("click", resetEditor);

// --- alati ---
editor.querySelector('[data-tool="crop"]').addEventListener("click", (e) => {
  const cropping = editor.classList.toggle("editor--cropping");
  e.currentTarget.setAttribute("aria-pressed", cropping);
});

// paneli (slojevi, postavke), otvoren je najviše jedan
const tools = editor.querySelector(".editor__tools");
const layersBtn = editor.querySelector('[data-tool="layers"]');
const layersPanel = editor.querySelector("#layers-panel");
const panels = [
  { btn: layersBtn, panel: layersPanel },
  { btn: settingsBtn, panel },
];

function togglePanel(targetBtn) {
  panels.forEach((p) => {
    const open = p.btn === targetBtn && p.panel.hidden;
    p.panel.hidden = !open;
    p.btn.setAttribute("aria-expanded", open);
  });
}

panels.forEach((p) => p.btn.addEventListener("click", () => togglePanel(p.btn)));
document.addEventListener("click", (e) => {
  if (!e.composedPath().includes(tools)) togglePanel(null);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") togglePanel(null);
});

// boja logotipa + naglasna boja cijele stranice
const swatches = panel.querySelectorAll(".swatch");
swatches.forEach((swatch) => {
  swatch.addEventListener("click", () => {
    swatches.forEach((other) => other.setAttribute("aria-pressed", other === swatch));
    hero.style.setProperty("--logo-color", swatch.dataset.color);
    document.documentElement.style.setProperty("--accent", swatch.dataset.accent || swatch.dataset.color);
  });
});

// ===== Lotos koji se odbija od rubova (DVD logo) =====
const lotus = hero.querySelector(".lotus--bounce");
const lotusToggle = panel.querySelector("[data-lotus-toggle]");

let position = null;
const velocity = { x: 60, y: 45 }; // px u sekundi
let lastTime = 0;
let running = false;
let heroVisible = true;

function step(time) {
  if (!running) return;
  const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
  lastTime = time;

  const w = lotus.offsetWidth;
  const h = lotus.offsetHeight;
  if (!position) position = { x: -w * 0.3, y: -h * 0.15 };

  // lotos smije malo izaći iz ekrana, kao na dizajnu
  const minX = -w * 0.35;
  const maxX = hero.clientWidth - w * 0.65;
  const minY = -h * 0.2;
  const maxY = hero.clientHeight - h * 0.8;

  position.x += velocity.x * dt;
  position.y += velocity.y * dt;

  if (position.x < minX || position.x > maxX) {
    velocity.x *= -1;
    position.x = clamp(position.x, minX, maxX);
  }
  if (position.y < minY || position.y > maxY) {
    velocity.y *= -1;
    position.y = clamp(position.y, minY, maxY);
  }

  lotus.style.transform = `translate(${position.x}px, ${position.y}px) rotate(${(time / 100) % 360}deg)`;
  requestAnimationFrame(step);
}

function updateLotus() {
  const shouldRun = lotusToggle.checked && heroVisible && !document.hidden;
  if (shouldRun === running) return;
  running = shouldRun;
  lastTime = 0;
  if (running) requestAnimationFrame(step);
}

if (matchMedia("(prefers-reduced-motion: reduce)").matches) lotusToggle.checked = false;

new IntersectionObserver(([entry]) => {
  heroVisible = entry.isIntersecting;
  updateLotus();
}).observe(hero);
document.addEventListener("visibilitychange", updateLotus);
lotusToggle.addEventListener("change", updateLotus);

// ===== Slojevi: sakrij/prikaži, redoslijed, miješanje lotosa =====
// Tekstualni slojevi se slažu redom kojim su u listi.
// Lotos iznad logotipa u listi = lotos ispred logotipa.
const layerList = layersPanel.querySelector("[data-layers]");
const blendSelect = layersPanel.querySelector("[data-blend]");

const LAYERS = {
  natpis: { naziv: "Natpis", node: content.querySelector(".hero__kicker") },
  logo: { naziv: "BDD logotip", node: content.querySelector(".hero__logo") },
  godina: { naziv: "Godina", node: content.querySelector(".hero__year") },
  tema: { naziv: "Tema", node: content.querySelector(".hero__tema") },
  lotus: { naziv: "Lotos", node: lotus },
};
const DEFAULT_ORDER = ["natpis", "logo", "godina", "tema", "lotus"];

let layerOrder = [...DEFAULT_ORDER];
const hiddenLayers = new Set();
const layerRows = {};

function moveLayer(id, step) {
  const from = layerOrder.indexOf(id);
  const to = from + step;
  if (to < 0 || to >= layerOrder.length) return;
  [layerOrder[from], layerOrder[to]] = [layerOrder[to], layerOrder[from]];
  applyLayers();
}

function toggleLayer(id) {
  if (hiddenLayers.has(id)) hiddenLayers.delete(id);
  else hiddenLayers.add(id);
  applyLayers();
}

function applyLayers() {
  const textOrder = layerOrder.filter((id) => id !== "lotus");

  layerOrder.forEach((id, index) => {
    const { row, eye, up, down } = layerRows[id];
    const layer = LAYERS[id];
    const hidden = hiddenLayers.has(id);

    layerList.append(row);
    up.disabled = index === 0;
    down.disabled = index === layerOrder.length - 1;
    row.classList.toggle("layer--hidden", hidden);
    eye.firstChild.style.maskImage = `url(./img/icons/${hidden ? "eye-off" : "eye"}.svg)`;

    layer.node.classList.toggle("is-layer-hidden", hidden);
    if (id !== "lotus") layer.node.style.order = textOrder.indexOf(id);
  });

  hero.classList.toggle("hero--lotus-front", layerOrder.indexOf("lotus") < layerOrder.indexOf("logo"));
}

function resetLayers() {
  layerOrder = [...DEFAULT_ORDER];
  hiddenLayers.clear();
  blendSelect.value = "normal";
  lotus.style.mixBlendMode = "";
  applyLayers();
}

Object.entries(LAYERS).forEach(([id, layer]) => {
  const { el, icon } = BDD;
  const button = (label, iconName) =>
    el("button", { class: "layer__btn", type: "button", "aria-label": `${label}: ${layer.naziv}`, title: label }, icon(iconName));

  const eye = button("Sakrij ili prikaži", "eye");
  const up = button("Gore", "chevron-up");
  const down = button("Dolje", "chevron-down");
  const row = el("li", { class: "layer" }, [eye, el("span", { class: "layer__name", text: layer.naziv }), up, down]);

  eye.addEventListener("click", () => toggleLayer(id));
  up.addEventListener("click", () => moveLayer(id, -1));
  down.addEventListener("click", () => moveLayer(id, 1));
  // prelazak mišem preko reda označi sloj na stranici
  row.addEventListener("pointerenter", () => layer.node.classList.add("is-highlighted"));
  row.addEventListener("pointerleave", () => layer.node.classList.remove("is-highlighted"));

  layerRows[id] = { row, eye, up, down };
});

blendSelect.addEventListener("change", () => {
  lotus.style.mixBlendMode = blendSelect.value;
});

applyLayers();
