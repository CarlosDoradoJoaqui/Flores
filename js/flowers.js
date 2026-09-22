const Flowers = (() => {
  let uid = 0;
  let paletteCache = null;

  const PETAL =
    "M50 50C42.5 36 36.5 22 47.2 10.2C49.2 7.2 50.8 7.2 52.8 10.2C63.5 22 57.5 36 50 50Z";

  function read(name, fallback) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }

  function palette() {
    if (paletteCache) return paletteCache;
    paletteCache = {
      petal: read("--petal", "#f3c94e"),
      deep: read("--petal-deep", "#e0ae2c"),
      light: read("--center-light", "#fff3c9"),
      mid: read("--center-mid", "#e8b12a"),
      core: read("--center-deep", "#b88614"),
      seed: read("--seed", "#8d5e12"),
      leaf: read("--leaf", "#8ea07a"),
      leafDeep: read("--leaf-deep", "#6e825c"),
      accent: read("--accent", "#e2b33c"),
    };
    return paletteCache;
  }

  function ring(count, scale, fill, offset) {
    let out = "";
    for (let i = 0; i < count; i += 1) {
      const angle = (360 / count) * i + offset;
      const opacity = (0.9 + (i % 3) * 0.035).toFixed(3);
      out += `<g transform="rotate(${angle.toFixed(2)} 50 50)" opacity="${opacity}"><g transform="translate(50 50) scale(${scale}) translate(-50 -50)"><path d="${PETAL}" fill="${fill}"/></g></g>`;
    }
    return out;
  }

  function flower(options) {
    const petals = (options && options.petals) || 10;
    const simple = Boolean(options && options.simple);
    const color = palette();
    const id = `fl${(uid += 1)}`;
    const innerCount = Math.max(7, petals - 1);
    let seeds = "";

    if (!simple) {
      for (let i = 0; i < 7; i += 1) {
        const angle = (Math.PI * 2 * i) / 7 + 0.35;
        const x = (50 + Math.cos(angle) * 4.15).toFixed(2);
        const y = (50 + Math.sin(angle) * 4.15).toFixed(2);
        seeds += `<circle cx="${x}" cy="${y}" r="0.9" fill="${color.seed}" opacity="0.48"/>`;
      }
    }

    const layers = simple
      ? ring(petals, 1, color.petal, 0)
      : `<g opacity="0.42">${ring(petals, 1.07, color.deep, 8)}</g>${ring(petals, 1, color.petal, 0)}${ring(innerCount, 0.6, color.deep, 180 / innerCount)}`;

    return `<svg class="flower-svg" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id="${id}" cx="40%" cy="36%" r="68%">
          <stop offset="0%" stop-color="${color.light}"/>
          <stop offset="48%" stop-color="${color.mid}"/>
          <stop offset="100%" stop-color="${color.core}"/>
        </radialGradient>
      </defs>
      ${layers}
      <circle cx="50" cy="50" r="10.4" fill="url(#${id})"/>
      <circle cx="46.7" cy="46.5" r="2.15" fill="#fff8e6" opacity="0.72"/>
      ${seeds}
    </svg>`;
  }

  function sway(delay) {
    return `<div class="sway" style="animation-delay:${delay}">`;
  }

  function intro() {
    const items = [
      { x: 24, y: 62, s: 0.78, d: "0.18s", rot: -8, petals: 10, sway: "-1.2s" },
      { x: 50, y: 40, s: 1.08, d: "0.02s", rot: 1, petals: 11, sway: "-2.4s" },
      { x: 76, y: 64, s: 0.84, d: "0.32s", rot: 8, petals: 10, sway: "-0.6s" },
    ];

    const flowers = items
      .map(
        (item) => `<div class="floater" style="--x:${item.x}%; --y:${item.y}%; --s:${item.s}; --d:${item.d}; --rot:${item.rot}deg">
          ${sway(item.sway)}${flower({ petals: item.petals })}</div>
        </div>`
      )
      .join("");

    return `<div class="intro-flowers">${flowers}</div>`;
  }

  function garden() {
    const items = [
      { x: 14, s: 0.74, stem: 48, d: "0.08s", rot: -7, petals: 9, sway: "-1s" },
      { x: 32, s: 0.96, stem: 74, d: "0.32s", rot: 4, petals: 10, sway: "-2.1s" },
      { x: 50, s: 1.12, stem: 96, d: "0.56s", rot: -2, petals: 11, sway: "-0.4s" },
      { x: 68, s: 0.92, stem: 68, d: "0.8s", rot: 6, petals: 10, sway: "-1.7s" },
      { x: 86, s: 0.72, stem: 44, d: "1.02s", rot: -5, petals: 9, sway: "-2.8s" },
    ];

    const flowers = items
      .map(
        (item) => `<div class="bloom" style="--x:${item.x}%; --s:${item.s}; --stem:${item.stem}; --d:${item.d}; --rot:${item.rot}deg">
          ${sway(item.sway)}
            ${flower({ petals: item.petals })}
            <span class="mini-stem"></span>
          </div>
        </div>`
      )
      .join("");

    return `<div class="garden">${flowers}</div>`;
  }

  function bouquet() {
    const color = palette();
    const height = 130;
    const items = [
      { x: 50, y: 36, s: 1.14, d: "0.04s", rot: -2, petals: 11 },
      { x: 29, y: 50, s: 0.9, d: "0.14s", rot: -9, petals: 10 },
      { x: 72, y: 48, s: 0.94, d: "0.2s", rot: 8, petals: 10 },
      { x: 15, y: 68, s: 0.66, d: "0.3s", rot: -14, petals: 9 },
      { x: 85, y: 66, s: 0.7, d: "0.36s", rot: 13, petals: 9 },
      { x: 39, y: 72, s: 0.82, d: "0.26s", rot: 5, petals: 10 },
      { x: 63, y: 74, s: 0.86, d: "0.32s", rot: -6, petals: 11 },
      { x: 51, y: 88, s: 0.6, d: "0.44s", rot: 2, petals: 8 },
    ];

    const stems = items
      .map((item, index) => {
        const startY = item.y + 7;
        const path = `M${item.x} ${startY} C ${item.x} ${startY + 20}, ${50 + (item.x - 50) * 0.22} 100, 50 114`;
        let leaf = "";
        if (index % 2 === 1) {
          const px = item.x + (50 - item.x) * 0.42;
          const py = startY + (114 - startY) * 0.38;
          const dir = item.x < 50 ? -1 : 1;
          leaf = `<path d="M${px} ${py} C ${px + dir * 8} ${py - 5}, ${px + dir * 15} ${py - 1}, ${px + dir * 13} ${py + 5} C ${px + dir * 7} ${py + 4.2}, ${px + dir * 2} ${py + 1.5}, ${px} ${py} Z" fill="${color.leaf}" opacity="0.9"/>`;
        }
        return `<path d="${path}" fill="none" stroke="${color.leafDeep}" stroke-width="0.85" stroke-linecap="round"/>${leaf}`;
      })
      .join("");

    const wrap = `
      <ellipse cx="50" cy="120" rx="12" ry="2.1" fill="rgba(92,70,32,0.1)"/>
      <path d="M44 111 C47.2 106.5, 52.8 106.5, 56 111 C53.2 116.2, 46.8 116.2, 44 111 Z" fill="#f7f1e4" stroke="${color.accent}" stroke-width="0.45"/>
      <path d="M50 108.2 C48.6 111.4, 46.4 112.6, 44.2 112.2 C46.6 113.6, 48.4 113.4, 50 114.8 C51.6 113.4, 53.4 113.6, 55.8 112.2 C53.6 112.6, 51.4 111.4, 50 108.2 Z" fill="${color.accent}"/>
    `;

    const flowers = items
      .map((item) => {
        const top = ((item.y / height) * 100).toFixed(2);
        return `<div class="bouquet-flower" style="--x:${item.x}%; --y:${top}%; --s:${item.s}; --d:${item.d}; --rot:${item.rot}deg">
          <div class="sway" style="animation-delay:-${(item.x / 30).toFixed(2)}s">${flower({ petals: item.petals })}</div>
        </div>`;
      })
      .join("");

    return `<div class="bouquet">
      <svg class="bouquet-stems" viewBox="0 0 100 130" aria-hidden="true">${stems}${wrap}</svg>
      ${flowers}
    </div>`;
  }

  return { flower, intro, garden, bouquet };
})();
