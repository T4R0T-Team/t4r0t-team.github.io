/* =========================================================
   T4R0T team site
   Data lives in /data. Writeups come live from the blog.
   ========================================================= */

const CONFIG = {
  blog: "https://amcaqt.github.io",
  searchIndex: "https://amcaqt.github.io/assets/js/data/search.json",  // Chirpy rebuilds it on every deploy; Pages sends CORS * so cross-domain is fine
  fallback: "data/writeups-fallback.json",       // used if the live index can't be reached
  hideCategories: [/^project$/i, /^tryhackme$/i],
  eventMin: 3,                                    // posts needed before an event gets its own pack
  email: { user: "amcaqt06", host: ["gmail", "com"] },  // swap when the team email is ready
  discord: "amca._.",
  telegram: "AmcaQt"
};

/* ---------- helpers ---------- */
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const pad = n => String(n).padStart(2, "0");
const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const fmtMonth = d => { if (!d) return null; const [y, m] = d.split("-"); return `${MONTHS[+m - 1]} ${y}`; };
const fmtDay = d => { const [y, m, day] = d.split("-"); return `${day} ${MONTHS[+m - 1]} ${y}`; };
const toList = v => Array.isArray(v) ? v : String(v || "").split(",").map(s => s.trim()).filter(Boolean);

async function getJSON(url) {
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

/* =========================================================
   ROSTER
   ========================================================= */
const SPECIALTY_LANE = [
  [/forensic/i, "for"], [/reverse|binary|pwn/i, "rev"], [/ai|data|machine/i, "ai"],
  [/osint|recon/i, "osint"], [/.*/, "web"]
];
const laneForSpecialty = s => SPECIALTY_LANE.find(([re]) => re.test(s))[1];
const initials = h => h.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();
const LINK_LABEL = { github: "GITHUB", ctftime: "CTFTIME", linkedin: "LINKEDIN", website: "WEB" };

function renderRoster(members) {
  $("rosterSub").innerHTML = `<span>${pad(members.length)} PLAYERS / ${pad(new Set(members.map(m => laneForSpecialty(m.specialty[0]))).size)} LANES</span><span>TVETMARA PETALING JAYA</span>`;
  $("lineup").innerHTML = members.map((m, i) => {
    const isLead = m.role === "Leader";
    const links = Object.entries(m.links || {}).filter(([, url]) => url);
    return `
    <article class="player gl${isLead ? " lead" : ""}">
      ${isLead ? '<div class="ribbon">CAPTAIN</div>' : ""}
      <div class="no"><span>NO.</span><b>${pad(i + 1)}</b></div>
      <div class="av">${m.avatar ? `<img src="${esc(m.avatar)}" alt="${esc(m.handle)}" loading="lazy">` : esc(initials(m.handle))}</div>
      <div class="name gt">${esc(m.handle)}</div>
      <div class="tags">${m.specialty.map(s => `<span class="lane ${laneForSpecialty(s)}">${esc(s)}</span>`).join("")}</div>
      <p class="tl">${esc(m.tagline)}</p>
      ${links.length ? `<div class="socials">${links.map(([k, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener">${LINK_LABEL[k] || k.toUpperCase()} ↗</a>`).join("")}</div>` : ""}
    </article>`;
  }).join("");
}

/* =========================================================
   RECORD
   ========================================================= */
const isSolo = a => a.type === "solo";
const tier = a => a.rank === 1 ? "gold" : (a.rank && a.rank <= 3 ? "pod" : "");
const rankText = a => a.rankLabel ?? `#${a.rank}`;

function renderRecord(list) {
  const sorted = [...list].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const teamRanked = sorted.filter(a => a.rank && !isSolo(a));
  const best = teamRanked.length ? "#" + Math.min(...teamRanked.map(a => a.rank)) : "—";

  $("recStats").innerHTML = [
    [pad(sorted.length), "EVENTS"],
    [best, "BEST TEAM FINISH"],
    [pad(teamRanked.filter(a => a.rank <= 3).length), "TEAM PODIUMS"],
    [pad(sorted.filter(a => isSolo(a) && a.rank && a.rank <= 3).length), "SOLO PODIUMS"]
  ].map(([v, l]) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`).join("");

  const meta = a => [fmtMonth(a.date), a.duration, a.teams ? `${a.teams} teams` : null].filter(Boolean).join("  ·  ");
  $("recFeat").innerHTML = sorted.filter(a => a.highlight).map((a, i) => `
    <article class="fcard gl ${tier(a)}">
      ${i === 0 ? '<div class="ribbon">LATEST</div>' : ""}
      <div class="top"><span>${esc(a.platform).toUpperCase()}</span>${isSolo(a) ? `<span class="solo-tag">SOLO · ${esc(a.player)}</span>` : ""}</div>
      <div class="rank gt">${a.rankLabel ? esc(a.rankLabel) : `<small>#</small>${a.rank}`}</div>
      <div class="ev">${esc(a.event)}</div>
      <div class="meta">${esc(meta(a)) || "&nbsp;"}</div>
    </article>`).join("");

  $("recList").innerHTML = sorted.map(a => {
    const sub = [isSolo(a) ? `solo · ${a.player}` : null, a.duration, a.teams ? `${a.teams} teams` : null].filter(Boolean).join(" · ");
    const name = a.link ? `<a href="${esc(a.link)}" target="_blank" rel="noopener">${esc(a.event)} ↗</a>` : esc(a.event);
    return `
    <div class="match">
      <div class="r ${a.rankLabel ? "txt" : tier(a)}">${esc(rankText(a))}</div>
      <div><div class="name">${name}</div><div class="small">${esc(sub) || "&nbsp;"}</div></div>
      <div class="plat">${esc(a.platform).toUpperCase()}</div>
      <div class="date">${fmtMonth(a.date) ?? "—"}</div>
    </div>`;
  }).join("");

  return { events: sorted.length, best };
}

/* =========================================================
   WRITEUPS (live from Chirpy)
   ========================================================= */
const RESEARCH = [["vuln", "Vulnerability Analysis", /vulnerability/i], ["threat", "Threat Analysis", /threat/i]];
const LANES = [
  ["rev", "rev", p => p.tags.some(t => /reverse|binary|apk/i.test(t))],
  ["for", "forensics", p => p.tags.some(t => /forensic|evtx|log/i.test(t))],
  ["osint", "osint", p => p.tags.some(t => /osint/i.test(t))],
  ["b2r", "boot2root", p => p.tags.some(t => /boot2root/i.test(t))],
  ["web", "web", p => p.tags.some(t => /web|lfi|rce|subdomain|sql/i.test(t))],
  ["misc", "mixed", () => true]
];
const EVENT_PREFIX = /^(.+?\s\d{4}|hackdev)\s*[:\-]\s*/i;

async function loadPosts() {
  let raw, live = true;
  try { raw = await getJSON(CONFIG.searchIndex); }
  catch { live = false; raw = await getJSON(CONFIG.fallback); }
  const posts = raw.map(p => ({
    title: String(p.title || "").trim(),
    url: new URL(p.url, CONFIG.blog).href,
    categories: toList(p.categories),
    tags: toList(p.tags),
    date: String(p.date || "").slice(0, 10),
    snippet: String(p.snippet || "").trim()
  }))
    .filter(p => p.title && p.date)
    .filter(p => !p.categories.some(c => CONFIG.hideCategories.some(re => re.test(c))))
    .sort((a, b) => b.date.localeCompare(a.date));
  return { posts, live };
}

function renderVault({ posts }) {
  const researchOf = p => RESEARCH.find(([, , re]) => p.categories.some(c => re.test(c)));
  const research = posts.filter(researchOf).map(p => ({ ...p, kind: researchOf(p) }));
  const ctf = posts.filter(p => !researchOf(p)).map(p => {
    const m = p.title.match(EVENT_PREFIX);
    return { ...p, lane: LANES.find(([, , t]) => t(p)), source: m ? m[1] : "Blog", short: p.title.replace(EVENT_PREFIX, "").replace(/\s+writeup$/i, "") };
  });

  const bySource = ctf.reduce((acc, w) => ((acc[w.source] ||= []).push(w), acc), {});
  const eventNames = Object.keys(bySource).filter(s => bySource[s].length >= CONFIG.eventMin);
  const isEvent = w => eventNames.includes(w.source);

  $("vaultSub").innerHTML = `<span>${pad(ctf.length)} CTF WRITEUPS</span><span>${pad(research.length)} RESEARCH</span>${posts[0] ? `<span>UPDATED ${fmtDay(posts[0].date)}</span>` : ""}`;
  $("ctfN").textContent = `${ctf.length} POSTS`;
  $("resN").textContent = `${research.length} POSTS`;

  $("resGrid").innerHTML = research.map((r, i) => `
    <a class="card gl${i === 0 ? " new" : ""}" href="${esc(r.url)}" target="_blank" rel="noopener">
      ${i === 0 ? '<div class="ribbon">NEW</div>' : ""}
      <div class="top"><span class="lane ${r.kind[0]}">${r.kind[1]}</span></div>
      <h4 class="gt">${esc(r.title)}</h4>
      ${r.snippet ? `<p class="snip">${esc(r.snippet)}</p>` : ""}
      <div class="bottom"><span class="date">${fmtDay(r.date)}</span><span class="go">READ →</span></div>
    </a>`).join("");

  const newest = ctf[0];
  const card = (w, inEvent = false) => `
    <a class="card gl${w === newest ? " new" : ""}" href="${esc(w.url)}" target="_blank" rel="noopener">
      ${w === newest ? '<div class="ribbon">NEW</div>' : ""}
      <div class="top"><span class="src">${inEvent ? fmtDay(w.date) : esc(w.source)}</span><span class="lane ${w.lane[0]}">${w.lane[1]}</span></div>
      <h4 class="gt">${esc(w.short)}</h4>
      <div class="bottom"><span class="date">${inEvent ? esc(w.tags.slice(0, 2).join(" · ")) : fmtDay(w.date)}</span><span class="go">READ →</span></div>
    </a>`;

  const eventBlock = (name, list) => {
    const all = bySource[name];
    const dates = all.map(w => w.date).sort();
    const [a, b] = [dates[0], dates.at(-1)].map(d => MONTHS[+d.split("-")[1] - 1]);
    const lanes = [...new Map(all.map(w => [w.lane[0], w.lane])).values()];
    const label = name.replace(/\s*\d{4}$/, ""), year = (name.match(/\d{4}$/) || [""])[0];
    return `
    <section class="event">
      <div class="ehead">
        <div><div class="ek">EVENT PACK // ${a === b ? a : `${a} – ${b}`} ${year}</div><h4>${esc(label)} <span>${year}</span></h4></div>
        <div class="es"><b>${pad(all.length)}</b><small>WRITEUPS</small></div>
        <div class="lanes">${lanes.map(l => `<span class="lane ${l[0]}">${l[1]}</span>`).join("")}</div>
      </div>
      <div class="grid">${list.map(w => card(w, true)).join("")}</div>
    </section>`;
  };

  const counts = ctf.reduce((acc, w) => (acc[w.lane[0]] = (acc[w.lane[0]] || 0) + 1, acc), {});
  $("filters").innerHTML = [["all", "all", ctf.length], ...LANES.map(([k, l]) => [k, l, counts[k] || 0]).filter(f => f[2])]
    .map(([k, l, n], i) => `<button class="${i ? "" : "on"}" data-f="${k}">${l}<span>${n}</span></button>`).join("");

  const render = filter => {
    const match = w => filter === "all" || w.lane[0] === filter;
    $("ctfGrid").innerHTML = ctf.filter(w => !isEvent(w) && match(w)).map(w => card(w)).join("");
    $("events").innerHTML = eventNames.map(n => [n, bySource[n].filter(match)]).filter(([, l]) => l.length).map(([n, l]) => eventBlock(n, l)).join("");
  };
  render("all");

  $("filters").addEventListener("click", e => {
    const btn = e.target.closest("button"); if (!btn) return;
    $("filters").querySelectorAll("button").forEach(x => x.classList.toggle("on", x === btn));
    render(btn.dataset.f);
  });

  return { total: posts.length };
}

function vaultFailed() {
  $("vaultSub").textContent = "";
  $("ctfGrid").outerHTML = `<div class="vault-error">COULDN'T LOAD THE VAULT. READ EVERYTHING ON <a href="${CONFIG.blog}" target="_blank" rel="noopener">THE BLOG ↗</a></div>`;
}

/* =========================================================
   HERO
   ========================================================= */
function renderHeroStats({ players, events, best, writeups }) {
  $("heroStats").innerHTML = [
    [pad(players), "PLAYERS"], [pad(events), "EVENTS PLAYED"], [best, "BEST TEAM FINISH"], [writeups == null ? "—" : pad(writeups), "WRITEUPS"]
  ].map(([v, l]) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`).join("");
}

let nextMatch = null;

/* Forgiving date reader for next-match.json.
   Accepts "2026-11-14T09:00:00+08:00", "2026-11-14 T 09:00", "2026-11-14 09:00", "2026-11-14".
   No timezone given = Malaysia time (+08:00). Returns NaN if it really can't tell. */
function parseMatchTime(value) {
  let s = String(value || "").trim().replace(/\s*T\s*/i, "T").replace(/^(\d{4}-\d{2}-\d{2})\s+(\d)/, "$1T$2");
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) s += "T00:00:00";
  if (/T\d{2}:\d{2}$/.test(s)) s += ":00";
  if (/T[\d:]+$/.test(s)) s += "+08:00";
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?([+-]\d{2}:\d{2}|Z)$/.test(s)) return NaN;
  return Date.parse(s);
}

function renderNext() {
  const box = $("next"), hero = box.parentElement;
  const hide = () => { box.hidden = true; hero.classList.add("solo"); return false; };
  if (!nextMatch) return hide();
  const now = Date.now(), start = parseMatchTime(nextMatch.start), end = parseMatchTime(nextMatch.end);
  if (isNaN(start) || isNaN(end)) {
    console.warn("next-match.json: can't read start/end. Use the format 2026-11-14T09:00:00+08:00");
    return hide();
  }
  if (now > end) return hide();
  const live = now >= start, ms = Math.max(0, start - now);
  const parts = [ms / 864e5, ms / 36e5 % 24, ms / 6e4 % 60, ms / 1e3 % 60].map(n => pad(Math.floor(n)));
  box.hidden = false; hero.classList.remove("solo");
  box.innerHTML = `
    <div class="lbl">${live ? "LIVE NOW" : "NEXT MATCH"}</div>
    <h2>${esc(nextMatch.event)} <span>${esc(nextMatch.stage)}</span></h2>
    <div class="fmt">${esc(nextMatch.format)}  ·  ${esc(nextMatch.dates)}</div>
    ${live ? "" : `<div class="cd">${parts.map((p, i) => `<div><b>${p}</b><small>${["DAYS", "HRS", "MIN", "SEC"][i]}</small></div>`).join("")}</div>`}
    ${nextMatch.qualified ? `<div class="qual">✦ ${esc(nextMatch.qualified)}</div>` : ""}`;
  return true;
}

/* =========================================================
   CONTACT
   ========================================================= */
const email = () => `${CONFIG.email.user}@${CONFIG.email.host.join(".")}`;

function renderContact() {
  const channels = [
    { key: "discord", label: "Discord", handle: CONFIG.discord, hint: "CLICK TO COPY", run: async (el, st) => {
        try { await navigator.clipboard.writeText(CONFIG.discord); st.textContent = "COPIED, ADD ME ON DISCORD"; }
        catch { st.textContent = "USERNAME: " + CONFIG.discord; }
        el.classList.add("copied");
        setTimeout(() => { st.textContent = "CLICK TO COPY"; el.classList.remove("copied"); }, 2200);
      } },
    { key: "telegram", label: "Telegram", handle: "@" + CONFIG.telegram, hint: "OPEN CHAT", run: () => window.open(`https://t.me/${CONFIG.telegram}`, "_blank", "noopener") },
    { key: "email", label: "Email", handle: null, hint: "SEND MAIL", run: el => {
        el.querySelector(".handle").textContent = email();
        location.href = `mailto:${email()}?subject=${encodeURIComponent("Hello T4R0T")}`;
      } }
  ];
  $("channels").innerHTML = channels.map((c, i) => `
    <button class="ch gl" data-i="${i}">
      <div class="k"><span>${pad(i + 1)}</span><b>${c.key.toUpperCase()}</b></div>
      <h3 class="gt">${c.label}</h3>
      <div class="handle">${c.handle ? esc(c.handle) : "reveal on click"}</div>
      <div class="act"><span>${c.hint}</span><span>→</span></div>
    </button>`).join("");
  $("channels").addEventListener("click", e => {
    const el = e.target.closest(".ch"); if (!el) return;
    channels[el.dataset.i].run(el, el.querySelector(".act span"));
  });
}

/* =========================================================
   SHARED CHROME (nav, footer, terminal)
   Written once here so every page stays in sync.
   ========================================================= */
const PAGES = [
  ["about", "about.html", "00", "ABOUT"],
  ["roster", "roster.html", "01", "ROSTER"],
  ["record", "record.html", "02", "RECORD"],
  ["writeups", "writeups.html", "03", "WRITEUPS"],
  ["contact", "contact.html", "04", "CONTACT"]
];

function buildChrome(page) {
  $("chrome-top").outerHTML = `
  <nav class="nav" id="nav">
    <a class="logo" href="index.html">T4R0T<span>_</span></a>
    <div class="links" id="links">
      ${PAGES.map(([key, href, no, label]) => `<a href="${href}"${key === page ? ' class="on" aria-current="page"' : ""}><b>${no}</b>${label}</a>`).join("")}
    </div>
    <a class="join cut" href="contact.html">JOIN</a>
    <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>
  </nav>`;

  $("chrome-bottom").outerHTML = `
  <footer>
    <div class="foot">
      <span class="logo">T4R0T<span>_</span></span>
      <span>© ${new Date().getFullYear()} T4R0T · BUILT BY AMCAQT</span>
      <span class="hint"><a href="flag.html">SUBMIT FLAG</a> · press <kbd>\`</kbd></span>
    </div>
  </footer>
  <div class="term" id="term" aria-hidden="true">
    <div class="term-body" id="out">T4R0T shell v2.0. type "help"<br></div>
    <div class="term-in">$ <input id="cmd" autocomplete="off" spellcheck="false" aria-label="terminal input"></div>
  </div>`;

  const nav = $("nav"), burger = $("burger");
  burger.addEventListener("click", () => burger.setAttribute("aria-expanded", nav.classList.toggle("open")));

  const big = $("big");
  if (big && !matchMedia("(prefers-reduced-motion: reduce)").matches)
    setInterval(() => { big.classList.remove("glitch"); void big.offsetWidth; big.classList.add("glitch"); }, 4500);
}

/* =========================================================
   HOME: PICK YOUR PATH
   ========================================================= */
function renderTiles(c) {
  const tiles = [
    ["about.html", "00 // ORIGIN", "2025", "About", "Who we are and why the name"],
    ["roster.html", "01 // ROSTER", pad(c.players), "Roster", "Four players, four lanes"],
    ["record.html", "02 // RECORD", pad(c.events), "Record", "Every CTF we've played"],
    ["writeups.html", "03 // VAULT", c.writeups == null ? "—" : pad(c.writeups), "Writeups", "CTF solves and research"],
    ["contact.html", "04 // COMMS", "03", "Contact", "Discord, Telegram, email"]
  ];
  $("tiles").innerHTML = tiles.map(([href, k, num, title, desc]) => `
    <a class="tile gl" href="${href}">
      <div class="k">${k}</div>
      <div class="num">${num}</div>
      <h2 class="gt">${title}</h2>
      <p>${desc}</p>
      <span class="go">ENTER →</span>
    </a>`).join("");
}

/* =========================================================
   FLAG CHECK
   Only the SHA-256 of the flag lives here, never the flag itself.
   ========================================================= */
const FLAG_HASH = "f332f3816397a31ca858f44cec6d68933babd2d5e0b74d97e49cf0c820083e01";
const SOLVED_KEY = "t4r0t-flag-solved";

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}
async function checkFlag(input) {
  if (!window.crypto?.subtle) throw new Error("no crypto");   // only missing on plain http
  return (await sha256(String(input).trim())) === FLAG_HASH;
}
const markSolved = () => { try { localStorage.setItem(SOLVED_KEY, new Date().toISOString()); } catch {} };
const solvedAt = () => { try { return localStorage.getItem(SOLVED_KEY); } catch { return null; } };

function initFlagPage() {
  const form = $("flagForm"), input = $("flagInput"), msg = $("flagMsg"), box = $("flagBox"), win = $("flagWin");
  let tries = 0;

  const showWin = when => {
    box.hidden = true; win.hidden = false;
    $("winTime").textContent = new Date(when).toLocaleString("en-MY", { dateStyle: "medium", timeStyle: "short" });
    win.classList.remove("boom"); void win.offsetWidth; win.classList.add("boom");
  };
  const prev = solvedAt();
  if (prev) showWin(prev);

  input.addEventListener("input", () => { msg.textContent = ""; msg.className = "flag-msg"; });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) { msg.textContent = "Type a flag first."; msg.className = "flag-msg bad"; return; }
    if (!/^T4R0T\{.+\}$/.test(value)) {
      msg.textContent = "That's not even flag-shaped. Format is T4R0T{...}";
      msg.className = "flag-msg bad"; shake(); return;
    }
    try {
      if (await checkFlag(value)) { markSolved(); showWin(new Date().toISOString()); return; }
    } catch {
      msg.textContent = "Your browser can't check flags here. Try the https site.";
      msg.className = "flag-msg bad"; return;
    }
    tries++;
    msg.textContent = tries < 3 ? "Nope. Not the flag." : `Nope. ${tries} tries in. Hint: every hacker starts with the source.`;
    msg.className = "flag-msg bad"; shake();
  });

  function shake() { box.classList.remove("shake"); void box.offsetWidth; box.classList.add("shake"); }
  $("flagAgain").addEventListener("click", () => {
    try { localStorage.removeItem(SOLVED_KEY); } catch {}
    win.hidden = true; box.hidden = false; input.value = ""; input.focus();
  });
}

/* =========================================================
   TERMINAL EASTER EGG
   ========================================================= */
const FONT_SETS = {
  e: { name: "poster HUD (default)", load: null },
  f: { name: "tall terminal", load: "family=Teko:wght@500;600" },
  g: { name: "full blend", load: "family=Rajdhani:wght@500;600" }
};
function setFont(key) {
  const set = FONT_SETS[key]; if (!set) return false;
  if (set.load && !document.querySelector(`link[data-font="${key}"]`)) {
    const l = document.createElement("link");
    l.rel = "stylesheet"; l.dataset.font = key;
    l.href = `https://fonts.googleapis.com/css2?${set.load}&display=swap`;
    document.head.appendChild(l);
  }
  if (key === "e") delete document.documentElement.dataset.font;
  else document.documentElement.dataset.font = key;
  try { localStorage.setItem("t4r0t-font", key); } catch {}
  return true;
}

function initTerminal(state) {
  try { const saved = localStorage.getItem("t4r0t-font"); if (saved) setFont(saved); } catch {}
  const term = $("term"), out = $("out"), cmd = $("cmd");
  const toggle = () => {
    const open = term.classList.toggle("open");
    term.setAttribute("aria-hidden", !open);
    if (open) cmd.focus();
  };
  document.addEventListener("keydown", e => {
    if (e.key !== "`") return;
    if (e.target !== cmd && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    e.preventDefault(); toggle();
  });
  document.querySelector(".hint").addEventListener("click", toggle);

  const cmds = {
    help: () => "whoami · ls members · cat motto · stats · next · font [e|f|g] · submit <flag> · clear · exit",
    whoami: () => "T4R0T, CTF team, TVETMARA Petaling Jaya, Malaysia. est. 2025",
    "ls members": () => state.members.map(m => m.handle).join("  "),
    "cat motto": () => "Hack To Learn, Not Learn to Hack",
    stats: () => `${state.events} events · best team finish ${state.best} · ${state.writeups ?? "?"} writeups`,
    next: () => nextMatch ? `${nextMatch.event} ${nextMatch.stage}, ${nextMatch.format}, ${nextMatch.dates}` : "no match locked in yet. stay tuned.",
    font: arg => {
      if (!arg) return Object.entries(FONT_SETS).map(([k, v]) => `${k}: ${v.name}`).join("  ·  ");
      return setFont(arg) ? `font set ${arg}: ${FONT_SETS[arg].name}` : `unknown font "${arg}". try e, f or g`;
    }
  };
  cmd.addEventListener("keydown", async e => {
    if (e.key !== "Enter") return;
    const input = cmd.value.trim(); cmd.value = "";
    if (!input) return;
    if (input === "clear") { out.innerHTML = ""; return; }
    if (input === "exit") { toggle(); return; }
    const [word, ...rest] = input.split(/\s+/);
    if (word === "submit") {
      const guess = rest.join(" ");
      let reply = "usage: submit T4R0T{...}";
      if (guess) {
        try { reply = await checkFlag(guess) ? (markSolved(), "FLAG ACCEPTED. you're one of us now. screenshot this, DM amca._. on Discord") : "nope. not the flag."; }
        catch { reply = "can't check flags on this connection, try the https site"; }
      }
      out.innerHTML += `<span class="c">$ submit ${esc(guess)}</span><br>${esc(reply)}<br>`;
      out.scrollTop = out.scrollHeight;
      return;
    }
    const fn = cmds[input] || (word === "font" ? () => cmds.font(rest[0]) : null);
    out.innerHTML += `<span class="c">$ ${esc(input)}</span><br>${esc(fn ? fn() : "command not found: " + input)}<br>`;
    out.scrollTop = out.scrollHeight;
  });
}

/* =========================================================
   BOOT
   Each page only renders what it has room for.
   ========================================================= */
(async function boot() {
  const page = document.body.dataset.page;
  buildChrome(page);
  if (page === "contact") renderContact();
  if (page === "flag") initFlagPage();

  const state = { members: [], events: 0, best: "—", writeups: null };
  const [members, achievements, next] = await Promise.all([
    getJSON("data/members.json").catch(() => []),
    getJSON("data/achievements.json").catch(() => []),
    page === "home" ? getJSON("data/next-match.json").catch(() => null) : null
  ]);
  state.members = members;

  const sorted = [...achievements];
  const teamRanked = sorted.filter(a => a.rank && a.type !== "solo");
  state.events = sorted.length;
  state.best = teamRanked.length ? "#" + Math.min(...teamRanked.map(a => a.rank)) : "—";

  if (page === "roster") renderRoster(members);
  if (page === "about") { const lead = members.find(m => m.role === "Leader"); if (lead) $("captain").textContent = lead.handle; }
  if (page === "record") renderRecord(achievements);
  initTerminal(state);

  if (page === "home") {
    nextMatch = next;
    if (renderNext()) setInterval(renderNext, 1000);
    const paint = () => {
      renderHeroStats({ players: members.length, ...state });
      renderTiles({ players: members.length, ...state });
    };
    paint();
    try { state.writeups = (await loadPosts()).posts.length; } catch {}
    paint();
  }

  if (page === "writeups") {
    try { state.writeups = renderVault(await loadPosts()).total; }
    catch (err) { console.warn("vault:", err); vaultFailed(); }
  }
})();
