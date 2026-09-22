(function () {
  if (typeof config === "undefined") return;

  const speed = new URLSearchParams(window.location.search).has("rapido") ? 0.22 : 1;
  const app = document.getElementById("app");
  const back = document.getElementById("back-layer");
  const petals = document.getElementById("petals");
  const petalsFront = document.getElementById("petals-front");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let current = 0;
  let lock = false;
  let timers = [];
  let toastTimer = 0;

  applyTheme(config.colorPrincipal);
  document.title = fill(config.titulo);

  buildAtmosphere();
  const stages = [
    buildIntro(),
    buildGarden(),
    buildQuiet(),
    buildMessage(),
    buildCard(),
    buildFinale(),
  ];
  stages.forEach((stage) => app.appendChild(stage));

  activate(stages[0]);
  runSequence(0);
  setupMusic();
  setupDust();

  function fill(value) {
    return String(value == null ? "" : value).split("{nombre}").join(config.nombre || "");
  }

  function customName() {
    const name = (config.nombre || "").trim();
    if (!name || name.toUpperCase() === "TU NOMBRE") return "";
    return name;
  }

  function later(fn, ms) {
    const id = window.setTimeout(fn, ms * speed);
    timers.push(id);
    return id;
  }

  function clearTimers() {
    timers.forEach((id) => window.clearTimeout(id));
    timers = [];
  }

  function el(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content != null) node.textContent = fill(content);
    return node;
  }

  function mount(html) {
    const holder = document.createElement("div");
    holder.innerHTML = html;
    return holder.firstElementChild;
  }

  function stageShell(className, mood) {
    const stage = document.createElement("section");
    stage.className = `stage ${className}`;
    if (mood) stage.dataset.mood = mood;
    stage.setAttribute("aria-hidden", "true");
    stage.setAttribute("inert", "");
    return stage;
  }

  function stack() {
    return el("div", "stack");
  }

  function copyBlock() {
    return el("div", "copy");
  }

  function makeButton(label, next, variant) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `btn ${variant} reveal`;

    if (variant === "btn-solid") {
      const icon = document.createElement("span");
      icon.className = "btn-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML =
        '<svg viewBox="0 0 24 24" width="16" height="16"><g fill="currentColor"><ellipse cx="12" cy="5.5" rx="2.4" ry="3.6"/><ellipse cx="12" cy="18.5" rx="2.4" ry="3.6"/><ellipse cx="5.5" cy="12" rx="3.6" ry="2.4"/><ellipse cx="18.5" cy="12" rx="3.6" ry="2.4"/></g><circle cx="12" cy="12" r="2.2" fill="#fff6d2"/></svg>';
      const labelNode = document.createElement("span");
      labelNode.textContent = fill(label);
      button.append(icon, labelNode);
    } else {
      button.textContent = fill(label);
    }

    button.addEventListener("click", () => {
      if (goTo(next)) button.disabled = true;
    });
    return button;
  }

  function halo() {
    const node = el("div", "halo");
    node.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 7; i += 1) node.appendChild(document.createElement("i"));
    return node;
  }

  function reveal(node, delay) {
    if (!node) return;
    later(() => node.classList.add("is-in"), delay);
  }

  function buildIntro() {
    const stage = stageShell("stage-intro");
    const column = stack();
    const copy = copyBlock();
    copy.append(
      el("h1", "title reveal", config.titulo),
      el("p", "subtitle reveal", config.subtitulo),
      makeButton(config.botones.abrir, 1, "btn-solid")
    );
    column.append(mount(Flowers.intro()), copy);
    stage.appendChild(column);
    return stage;
  }

  function buildGarden() {
    const stage = stageShell("stage-garden");
    const column = stack();
    const copy = copyBlock();
    copy.append(
      el("p", "line reveal", config.fechaLinea1),
      el("p", "line line-soft reveal", config.fechaLinea2),
      makeButton(config.botones.mas, 2, "btn-ghost")
    );
    column.append(mount(Flowers.garden()), copy);
    stage.appendChild(column);
    return stage;
  }

  function buildQuiet() {
    const stage = stageShell("stage-quiet", "is-quiet");
    const column = stack();
    const copy = copyBlock();
    copy.append(
      el("p", "line reveal", config.detalleLinea1),
      el("p", "body-text reveal", config.detalleLinea2),
      makeButton(config.botones.sigue, 3, "btn-ghost")
    );
    column.appendChild(copy);
    stage.appendChild(column);
    return stage;
  }

  function buildMessage() {
    const stage = stageShell("stage-message");
    const column = stack();
    const copy = copyBlock();
    const lines = config.mensajePrincipal || [];
    copy.append(halo(), el("span", "rule reveal"));
    lines.forEach((line, index) => {
      copy.appendChild(
        el(index === 0 ? "h2" : "p", index === 0 ? "headline reveal" : "body-text reveal", line)
      );
    });
    copy.appendChild(makeButton(config.botones.continuar, 4, "btn-quiet"));
    column.append(mount(Flowers.bouquet()), copy);
    stage.appendChild(column);
    return stage;
  }

  function buildCard() {
    const stage = stageShell("stage-card");
    const column = stack();
    const card = el("article", "card");
    const flower = el("div", "card-flower");
    flower.setAttribute("aria-hidden", "true");
    flower.innerHTML = Flowers.flower({ petals: 8 });
    card.append(
      flower,
      el("p", "whisper reveal", config.mensajePersonalIntro),
      highlighted(config.mensajePersonal, config.mensajePersonalDestacado),
      el("p", "body-text reveal", config.mensajePersonalCierre)
    );
    const name = customName();
    if (name) card.appendChild(el("p", "signature reveal", "Para ti, " + name));
    card.appendChild(makeButton(config.botones.sorpresa, 5, "btn-solid"));
    column.appendChild(card);
    stage.appendChild(column);
    return stage;
  }

  function buildFinale() {
    const stage = stageShell("stage-finale", "is-finale");
    const light = el("div", "finale-light");
    const field = el("div", "finale-field");
    const copy = el("div", "stack finale-copy");
    const name = customName();
    if (name) copy.appendChild(el("p", "for-name reveal", "Para ti, " + name));
    copy.append(
      el("p", "finale-kicker reveal", config.mensajeFinalIntro),
      el("h2", "finale-title reveal", config.mensajeFinalTitulo),
      el("p", "finale-end reveal", config.mensajeFinal)
    );
    stage.append(light, field, copy);
    return stage;
  }

  function highlighted(sentence, phrase) {
    const node = el("p", "personal reveal");
    const full = fill(sentence || "");
    const target = fill(phrase || "").trim();
    const index = target ? full.toLowerCase().indexOf(target.toLowerCase()) : -1;
    if (index < 0) {
      node.textContent = full;
      return node;
    }
    node.append(document.createTextNode(full.slice(0, index)));
    const mark = document.createElement("em");
    mark.className = "highlight";
    mark.textContent = full.slice(index, index + target.length);
    node.append(mark, document.createTextNode(full.slice(index + target.length)));
    return node;
  }

  function activate(stage) {
    stage.classList.add("is-active");
    stage.removeAttribute("aria-hidden");
    stage.removeAttribute("inert");
    document.body.classList.remove("is-quiet", "is-finale");
    if (stage.dataset.mood) document.body.classList.add(stage.dataset.mood);
  }

  function goTo(index) {
    if (lock || index === current || index < 0 || index >= stages.length) return false;
    lock = true;
    clearTimers();

    const previous = stages[current];
    const next = stages[index];
    current = index;

    previous.classList.remove("is-active");
    previous.classList.add("is-leaving");
    previous.setAttribute("aria-hidden", "true");
    previous.setAttribute("inert", "");

    next.classList.add("is-active");
    next.classList.remove("is-leaving");
    next.removeAttribute("aria-hidden");
    next.removeAttribute("inert");
    next.scrollTop = 0;
    const scroller = next.querySelector(".stack");
    if (scroller) scroller.scrollTop = 0;

    document.body.classList.remove("is-quiet", "is-finale");
    if (next.dataset.mood) document.body.classList.add(next.dataset.mood);

    window.setTimeout(() => {
      previous.classList.remove("is-leaving");
      lock = false;
    }, 760);

    runSequence(index);
    return true;
  }

  function runSequence(index) {
    const stage = stages[index];
    if (stage.dataset.played === "1") return;
    stage.dataset.played = "1";
    const lines = stage.querySelectorAll(".reveal");

    if (index === 0) {
      reveal(lines[0], 650);
      reveal(lines[1], 1350);
      reveal(lines[2], 1950);
      return;
    }

    if (index === 1) {
      reveal(lines[0], 2000);
      reveal(lines[1], 3700);
      reveal(lines[2], 5000);
      return;
    }

    if (index === 2) {
      reveal(lines[0], 1500);
      reveal(lines[1], 3300);
      reveal(lines[2], 4800);
      return;
    }

    if (index === 3) {
      const delays = [1100, 1500, 3000, 4700, 5900];
      lines.forEach((line, i) => reveal(line, delays[i] || 5900));
      const wait = Number(config.esperaAntesDeLaTarjeta);
      if (wait > 0) {
        later(() => {
          if (current === 3) goTo(4);
        }, 5900 + wait);
      }
      return;
    }

    if (index === 4) {
      const delays = [800, 3800, 5400];
      lines.forEach((line, i) => {
        if (i < delays.length) reveal(line, delays[i]);
      });
      const nameLine = stage.querySelector(".signature");
      const button = stage.querySelector(".btn");
      if (nameLine) reveal(nameLine, 6400);
      reveal(button, nameLine ? 7200 : 6500);
      return;
    }

    if (index === 5) {
      fillFinale(stage.querySelector(".finale-field"));
      const start = stage.querySelector(".for-name") ? 1700 : 2200;
      lines.forEach((line, i) => reveal(line, start + i * 1400));
    }
  }

  function fillFinale(field) {
    if (!field) return;
    const count = reduceMotion ? 10 : 22;
    for (let i = 0; i < count; i += 1) {
      const spot = flowerSpot(i);
      const wrap = document.createElement("div");
      wrap.className = "finale-flower";
      wrap.style.setProperty("--x", spot.x.toFixed(1) + "%");
      wrap.style.setProperty("--y", spot.y.toFixed(1) + "%");
      wrap.style.setProperty("--s", (0.55 + ((i * 37) % 50) / 100).toFixed(2));
      wrap.style.setProperty("--d", ((i % 8) * 0.28).toFixed(2) + "s");
      wrap.style.setProperty("--o", (0.82 + (i % 4) * 0.04).toFixed(2));
      wrap.style.setProperty("--rot", `${-18 + (i * 17) % 36}deg`);
      const sway = document.createElement("div");
      sway.className = "sway";
      sway.style.animationDelay = `${-(i % 5)}s`;
      sway.innerHTML = Flowers.flower({ petals: 8 + (i % 3), simple: true });
      wrap.appendChild(sway);
      field.appendChild(wrap);
    }
  }

  function flowerSpot(index) {
    const band = index % 3;
    const n = index + 1;
    if (band === 0) return { x: (n * 13) % 24, y: (n * 29) % 100 };
    if (band === 1) return { x: 76 + ((n * 11) % 24), y: (n * 23) % 100 };
    const y = n % 2 === 0 ? (n * 7) % 24 : 74 + ((n * 5) % 26);
    return { x: 18 + ((n * 19) % 64), y };
  }

  function buildAtmosphere() {
    const orbA = el("div", "orb orb-a");
    const orbB = el("div", "orb orb-b");
    const bloomA = el("div", "bg-bloom bg-bloom-a");
    const bloomB = el("div", "bg-bloom bg-bloom-b");
    bloomA.innerHTML = Flowers.flower({ petals: 10, simple: true });
    bloomB.innerHTML = Flowers.flower({ petals: 9, simple: true });
    back.append(orbA, orbB, bloomA, bloomB);

    for (let i = 0; i < 16; i += 1) petals.appendChild(makePetal(false, i));
    for (let i = 0; i < 10; i += 1) petalsFront.appendChild(makePetal(true, i + 20));
  }

  function makePetal(extra, index) {
    const petal = document.createElement("span");
    petal.className = extra ? "petal petal-extra" : "petal";
    petal.style.setProperty("--x", `${(index * 17 + 5) % 100}%`);
    petal.style.setProperty("--d", `${14 + (index % 6)}s`);
    petal.style.setProperty("--delay", `${-index * 1.15}s`);
    petal.style.setProperty("--drift", `${-36 + (index % 9) * 9}px`);
    petal.style.setProperty("--spin", `${160 + index * 28}deg`);
    petal.style.setProperty("--o", (0.5 + (index % 5) * 0.08).toFixed(2));
    petal.style.setProperty("--w", `${9 + (index % 4) * 2}px`);
    petal.style.setProperty("--h", `${13 + (index % 5) * 2}px`);
    return petal;
  }

  function setupDust() {
    if (reduceMotion) return;
    const canvas = document.getElementById("dust");
    const context = canvas.getContext("2d");
    if (!context) return;

    const color = getComputedStyle(document.documentElement).getPropertyValue("--center-mid").trim() || "#e8b12a";
    const dots = Array.from({ length: 24 }, () => spawnDust(true));
    let frameId = 0;
    let width = 0;
    let height = 0;

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function spawnDust(anywhere) {
      return {
        x: Math.random() * window.innerWidth,
        y: anywhere ? Math.random() * window.innerHeight : window.innerHeight + 8,
        r: 0.7 + Math.random() * 1.5,
        s: 0.12 + Math.random() * 0.28,
        a: 0.12 + Math.random() * 0.28,
        drift: (Math.random() - 0.5) * 0.22,
      };
    }

    function frame() {
      context.clearRect(0, 0, width, height);
      context.fillStyle = color;
      dots.forEach((dot) => {
        dot.y -= dot.s;
        dot.x += dot.drift;
        if (dot.y < -8) Object.assign(dot, spawnDust(false));
        context.globalAlpha = dot.a;
        context.beginPath();
        context.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        context.fill();
      });
      context.globalAlpha = 1;
      frameId = window.requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      } else if (!frameId) {
        frame();
      }
    });
    frame();
  }

  function setupMusic() {
    const button = document.getElementById("music-toggle");
    let audio = null;
    let playing = false;
    let fade = 0;
    let warned = false;

    function setPressed(on) {
      button.setAttribute("aria-pressed", on ? "true" : "false");
      button.setAttribute("aria-label", on ? "Pausar música" : "Activar música");
    }

    function stopFade() {
      window.clearInterval(fade);
      fade = 0;
    }

    function warn(message) {
      if (warned) return;
      warned = true;
      playing = false;
      setPressed(false);
      showToast(message);
    }

    button.addEventListener("click", () => {
      if (!config.musica) {
        showToast("Agrega el nombre de tu archivo de música en js/config.js.");
        return;
      }

      if (!audio) {
        audio = new Audio(config.musica);
        audio.loop = true;
        audio.preload = "none";
        audio.volume = 0;
        audio.addEventListener("error", () => {
          warn("No encontré la canción. Guarda tu archivo como music.mp3 en la misma carpeta que esta página.");
        });
      }

      if (playing) {
        playing = false;
        setPressed(false);
        stopFade();
        fade = window.setInterval(() => {
          audio.volume = Math.max(0, audio.volume - 0.08);
          if (audio.volume <= 0.02) {
            audio.pause();
            stopFade();
          }
        }, 70);
        return;
      }

      playing = true;
      setPressed(true);
      const pending = audio.play();
      if (!pending) return;
      pending
        .then(() => {
          stopFade();
          fade = window.setInterval(() => {
            if (!playing) return;
            audio.volume = Math.min(0.55, audio.volume + 0.05);
            if (audio.volume >= 0.55) stopFade();
          }, 80);
        })
        .catch(() => {
          warn("No pude reproducir la música. Revisa que music.mp3 esté junto a la página.");
        });
    });
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("is-on");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-on"), 4800);
  }

  function applyTheme(hex) {
    const source = normalizeHex(hex);
    const { h, s, l } = hexToHsl(source);
    const root = document.documentElement.style;
    root.setProperty("--accent", source);
    root.setProperty("--petal", hsl(h, Math.max(s, 58), 70));
    root.setProperty("--petal-deep", hsl(h, Math.max(s, 64), 50));
    root.setProperty("--petal-soft", hsl(h, 68, 84));
    root.setProperty("--center-light", hsl(h, 78, 92));
    root.setProperty("--center-mid", hsl(h, 80, Math.min(Math.max(l, 42), 54)));
    root.setProperty("--center-deep", hsl(h, 68, 34));
    root.setProperty("--seed", hsl(h, 52, 28));
    root.setProperty("--glow", hsl(h, 80, 72));
  }

  function hexToHsl(hex) {
    let value = hex.replace("#", "");
    if (value.length === 3) value = value.split("").map((char) => char + char).join("");
    const number = parseInt(value, 16);
    const red = ((number >> 16) & 255) / 255;
    const green = ((number >> 8) & 255) / 255;
    const blue = (number & 255) / 255;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const light = (max + min) / 2;
    const delta = max - min;
    let hue = 0;
    let sat = 0;
    if (delta !== 0) {
      sat = delta / (1 - Math.abs(2 * light - 1));
      if (max === red) hue = ((green - blue) / delta) % 6;
      else if (max === green) hue = (blue - red) / delta + 2;
      else hue = (red - green) / delta + 4;
      hue *= 60;
      if (hue < 0) hue += 360;
    }
    return { h: hue, s: sat * 100, l: light * 100 };
  }

  function hsl(h, s, l) {
    const sat = Math.max(0, Math.min(100, s));
    const light = Math.max(0, Math.min(100, l));
    return `hsl(${Math.round(h)}, ${Math.round(sat)}%, ${Math.round(light)}%)`;
  }

  function normalizeHex(hex) {
    let value = String(hex || "").trim();
    if (value && value.charAt(0) !== "#") value = "#" + value;
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) return value;
    return "#E2B33C";
  }
})();
