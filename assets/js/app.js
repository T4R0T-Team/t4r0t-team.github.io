/* =========================================================
   T4R0T team site
   Data lives in /data. Writeups come live from the blog.
   ========================================================= */

const CONFIG = {
  blog: "https://amcaqt.github.io",
  searchIndex: "https://amcaqt.github.io/assets/js/data/search.json",  // Chirpy rebuilds it on every deploy; Pages sends CORS * so cross-domain is fine
  fallback: "data/writeups-fallback.json",       // used if the live index can't be reached
  blogAuthor: "AmcaQt",                           // everything on the Chirpy blog is credited to this handle
  memberWriteups: "data/writeups.json",           // team members' writeups, read on writeup.html
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
  [/osint|recon/i, "osint"], [/crypt/i, "crypto"], [/.*/, "web"]
];
const laneForSpecialty = s => SPECIALTY_LANE.find(([re]) => re.test(s))[1];
const isCreatorRole = m => /creator/i.test(m.role || "");
const playerCount = members => members.filter(m => !isCreatorRole(m)).length;
const initials = h => h.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();
const LINK_LABEL = { github: "GITHUB", ctftime: "CTFTIME", linkedin: "LINKEDIN", website: "WEB" };

function renderRoster(members, writeupCounts = {}) {
  const creators = members.length - playerCount(members);
  const lanes = new Set(members.map(m => laneForSpecialty(m.specialty[0]))).size;
  const counts = [`${pad(playerCount(members))} PLAYERS`, creators ? `${pad(creators)} CREATOR${creators > 1 ? "S" : ""}` : null, `${pad(lanes)} LANES`].filter(Boolean).join(" / ");
  $("rosterSub").innerHTML = `<span>${counts}</span><span>TVETMARA PETALING JAYA</span>`;
  $("lineup").innerHTML = members.map((m, i) => {
    const isLead = m.role === "Leader";
    const isCreator = isCreatorRole(m);
    const links = Object.entries(m.links || {}).filter(([, url]) => url);
    return `
    <article class="player gl${isLead ? " lead" : ""}${isCreator ? " creator" : ""}">
      ${isLead ? '<div class="ribbon">CAPTAIN</div>' : isCreator ? '<div class="ribbon">CREATOR</div>' : ""}
      <div class="no"><span>NO.</span><b>${pad(i + 1)}</b></div>
      <div class="av">${m.avatar ? `<img src="${esc(m.avatar)}" alt="${esc(m.handle)}" loading="lazy">` : esc(initials(m.handle))}</div>
      <div class="name gt">${esc(m.handle)}</div>
      <div class="tags">${m.specialty.map(s => `<span class="lane ${laneForSpecialty(s)}">${esc(s)}</span>`).join("")}</div>
      ${m.tagline ? `<p class="tl">${esc(m.tagline)}</p>` : ""}
      ${writeupCounts[m.handle] ? `<a class="wcount" href="writeups.html?author=${encodeURIComponent(m.handle)}">${pad(writeupCounts[m.handle])} WRITEUP${writeupCounts[m.handle] > 1 ? "S" : ""} →</a>` : ""}
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
   WRITEUPS
   Two sources, merged into one list:
   1. AmcaQt's Chirpy blog (live search index)
   2. Member writeups in data/writeups.json, read on writeup.html
   ========================================================= */
const RESEARCH = [["vuln", "Vulnerability Analysis", /vulnerability/i], ["threat", "Threat Analysis", /threat/i]];
const LANES = [
  ["rev", "rev", p => p.tags.some(t => /reverse|binary|apk/i.test(t))],
  ["for", "forensics", p => p.tags.some(t => /forensic|evtx|log/i.test(t))],
  ["osint", "osint", p => p.tags.some(t => /osint/i.test(t))],
  ["b2r", "boot2root", p => p.tags.some(t => /boot2root/i.test(t))],
  ["web", "web", p => p.tags.some(t => /web|lfi|rce|subdomain|sql/i.test(t))],
  ["crypto", "crypto", p => p.tags.some(t => /crypt|rsa|cipher|aes|xor|rot13|base64/i.test(t))],
  ["misc", "mixed", () => true]
];
/* "Liga CTF 2026: X", "InIt CTF: X", "HackDev - X", "I-Hack CTF 2026: X" -> event name before the separator */
const EVENT_PREFIX = /^(.*?(?:ctf|hack)[^:]*?)\s*[:\-–]\s+/i;
const STATUS_LABEL = { partial: "PARTIAL", unsolved: "UNSOLVED" };
const laneOf = p => LANES.find(([, , t]) => t(p));
const eventOf = p => { const m = p.title.match(EVENT_PREFIX); return m ? m[1].trim() : null; };
const shortTitle = p => p.title.replace(EVENT_PREFIX, "").replace(/\s+writeup$/i, "");

async function loadPosts() {
  const [blog, members] = await Promise.all([
    getJSON(CONFIG.searchIndex).catch(() => getJSON(CONFIG.fallback)).catch(() => []),
    getJSON(CONFIG.memberWriteups).catch(() => [])
  ]);
  const fromBlog = blog.map(p => ({
    title: String(p.title || "").trim(),
    url: new URL(p.url, CONFIG.blog).href,
    external: true,
    author: CONFIG.blogAuthor,
    categories: toList(p.categories),
    tags: toList(p.tags),
    date: String(p.date || "").slice(0, 10),
    snippet: String(p.snippet || "").trim()
  }));
  const fromMembers = members.map(w => ({
    title: String(w.title || "").trim(),
    url: `writeup.html?id=${encodeURIComponent(w.id)}`,
    external: false,
    author: w.author,
    categories: toList(w.categories),
    tags: toList(w.tags),
    date: String(w.date || "").slice(0, 10),
    snippet: String(w.summary || "").trim(),
    status: w.status
  }));
  const posts = [...fromBlog, ...fromMembers]
    .filter(p => p.title && p.date)
    .filter(p => !p.categories.some(c => CONFIG.hideCategories.some(re => re.test(c))))
    .sort((a, b) => b.date.localeCompare(a.date));
  if (!posts.length) throw new Error("no posts");
  return { posts };
}

/* member colours from members.json; anything that isn't a plain hex colour is ignored */
let AUTHOR_COLORS = {};
const setAuthorColors = members => {
  AUTHOR_COLORS = Object.fromEntries(members.filter(m => /^#[0-9a-f]{3,8}$/i.test(m.color || "")).map(m => [m.handle, m.color]));
};
const who = name => `<b class="who" style="--who:${AUTHOR_COLORS[name] || "var(--ink)"}">${esc(name)}</b>`;

const linkAttrs = p => p.external ? ' target="_blank" rel="noopener"' : "";
const statusChip = p => STATUS_LABEL[p.status] ? `<span class="status ${p.status}">${STATUS_LABEL[p.status]}</span>` : "";

function renderVault({ posts }) {
  const researchOf = p => RESEARCH.find(([, , re]) => p.categories.some(c => re.test(c)));
  const research = posts.filter(researchOf).map(p => ({ ...p, kind: researchOf(p) }));
  const ctf = posts.filter(p => !researchOf(p)).map(p => ({ ...p, lane: laneOf(p), source: eventOf(p) || "Blog", short: shortTitle(p) }));

  const bySource = ctf.reduce((acc, w) => ((acc[w.source] ||= []).push(w), acc), {});
  const eventNames = Object.keys(bySource).filter(s => s !== "Blog" && bySource[s].length >= CONFIG.eventMin)
    .sort((x, y) => bySource[y][0].date.localeCompare(bySource[x][0].date));
  const isEvent = w => eventNames.includes(w.source);
  const authors = [...new Set(posts.map(p => p.author))];

  $("vaultSub").innerHTML = `<span>${pad(ctf.length)} CTF WRITEUPS</span><span>${pad(research.length)} RESEARCH</span><span>${pad(authors.length)} AUTHORS</span>${posts[0] ? `<span>UPDATED ${fmtDay(posts[0].date)}</span>` : ""}`;
  $("ctfN").textContent = `${ctf.length} POSTS`;
  $("resN").textContent = `${research.length} POSTS`;

  $("resGrid").innerHTML = research.map((r, i) => `
    <a class="card gl${i === 0 ? " new" : ""}" href="${esc(r.url)}"${linkAttrs(r)}>
      ${i === 0 ? '<div class="ribbon">NEW</div>' : ""}
      <div class="top"><span class="lane ${r.kind[0]}">${r.kind[1]}</span></div>
      <h4 class="gt">${esc(r.title)}</h4>
      ${r.snippet ? `<p class="snip">${esc(r.snippet)}</p>` : ""}
      <div class="by">BY ${who(r.author)}</div>
      <div class="bottom"><span class="date">${fmtDay(r.date)}</span><span class="go">READ →</span></div>
    </a>`).join("");

  const newest = ctf[0];
  const card = (w, inEvent = false) => `
    <a class="card gl${w === newest ? " new" : ""}" href="${esc(w.url)}"${linkAttrs(w)}>
      ${w === newest ? '<div class="ribbon">NEW</div>' : ""}
      <div class="top"><span class="src">${inEvent ? fmtDay(w.date) : esc(w.source)}</span><span class="lane ${w.lane[0]}">${w.lane[1]}</span></div>
      <h4 class="gt">${esc(w.short)}</h4>
      <div class="by">BY ${who(w.author)}${statusChip(w)}</div>
      <div class="bottom"><span class="date">${inEvent ? esc(w.tags.slice(0, 2).join(" · ")) : fmtDay(w.date)}</span><span class="go">READ →</span></div>
    </a>`;

  const eventBlock = (name, list) => {
    const all = bySource[name];
    const dates = all.map(w => w.date).sort();
    const [a, b] = [dates[0], dates.at(-1)].map(d => MONTHS[+d.split("-")[1] - 1]);
    const lanes = [...new Map(all.map(w => [w.lane[0], w.lane])).values()];
    const year = (name.match(/\d{4}$/) || [dates.at(-1).slice(0, 4)])[0];
    const label = name.replace(/\s*\d{4}$/, "");
    const crew = [...new Set(all.map(w => w.author))];
    return `
    <section class="event">
      <div class="ehead">
        <div><div class="ek">EVENT PACK // ${a === b ? a : `${a} – ${b}`} ${year}</div><h4>${esc(label)} <span>${year}</span></h4></div>
        <div class="es"><b>${pad(all.length)}</b><small>WRITEUPS</small></div>
        <div class="lanes">${lanes.map(l => `<span class="lane ${l[0]}">${l[1]}</span>`).join("")}${crew.length > 1 ? `<span class="crew">BY ${crew.map(who).join(" + ")}</span>` : ""}</div>
      </div>
      <div class="grid">${list.map(w => card(w, true)).join("")}</div>
    </section>`;
  };

  const state = { lane: "all", author: new URLSearchParams(location.search).get("author") || "all" };
  if (state.author !== "all" && !authors.includes(state.author)) state.author = "all";

  const laneCounts = ctf.reduce((acc, w) => (acc[w.lane[0]] = (acc[w.lane[0]] || 0) + 1, acc), {});
  const authorCounts = posts.reduce((acc, w) => (acc[w.author] = (acc[w.author] || 0) + 1, acc), {});
  $("filters").innerHTML = `
    <div class="frow" data-kind="lane">${[["all", "all", ctf.length], ...LANES.map(([k, l]) => [k, l, laneCounts[k] || 0]).filter(f => f[2])]
      .map(([k, l, n]) => `<button class="${k === state.lane ? "on" : ""}" data-f="${k}">${l}<span>${n}</span></button>`).join("")}</div>
    ${authors.length > 1 ? `<div class="frow" data-kind="author"><em>BY</em>${[["all", "everyone", posts.length], ...authors.map(a => [a, a, authorCounts[a]])]
      .map(([k, l, n]) => `<button class="${k === state.author ? "on" : ""}" data-f="${esc(k)}"${AUTHOR_COLORS[k] ? ` style="--who:${AUTHOR_COLORS[k]}"` : ""}>${esc(l)}<span>${n}</span></button>`).join("")}</div>` : ""}`;

  const render = () => {
    const match = w => (state.lane === "all" || w.lane?.[0] === state.lane) && (state.author === "all" || w.author === state.author);
    const byAuthor = w => state.author === "all" || w.author === state.author;
    $("ctfGrid").innerHTML = ctf.filter(w => !isEvent(w) && match(w)).map(w => card(w)).join("");
    $("events").innerHTML = eventNames.map(n => [n, bySource[n].filter(match)]).filter(([, l]) => l.length).map(([n, l]) => eventBlock(n, l)).join("");
    $("resGrid").querySelectorAll(".card").forEach((el, i) => { el.hidden = !byAuthor(research[i]); });
    const any = $("ctfGrid").children.length || $("events").children.length;
    $("events").insertAdjacentHTML("beforeend", any ? "" : `<div class="vault-error">NOTHING HERE FOR THAT FILTER YET.</div>`);
  };
  render();

  $("filters").addEventListener("click", e => {
    const btn = e.target.closest("button"); if (!btn) return;
    const row = btn.parentElement;
    row.querySelectorAll("button").forEach(x => x.classList.toggle("on", x === btn));
    state[row.dataset.kind] = btn.dataset.f;
    if (row.dataset.kind === "author") {
      const u = new URL(location.href);
      state.author === "all" ? u.searchParams.delete("author") : u.searchParams.set("author", state.author);
      history.replaceState(null, "", u);
    }
    render();
  });

  return { total: posts.length, byAuthor: authorCounts };
}

function vaultFailed() {
  $("vaultSub").textContent = "";
  $("ctfGrid").outerHTML = `<div class="vault-error">COULDN'T LOAD THE VAULT. READ EVERYTHING ON <a href="${CONFIG.blog}" target="_blank" rel="noopener">THE BLOG ↗</a></div>`;
}

/* =========================================================
   WRITEUP READER (writeup.html?id=...)
   Markdown -> HTML with marked, then cleaned by DOMPurify.
   ```flag blocks become flag boxes, images become captioned figures.
   ========================================================= */
async function renderWriteupPage() {
  const box = $("wu");
  const fail = msg => { box.innerHTML = `<a class="back" href="writeups.html">← THE VAULT</a><div class="vault-error" style="margin-top:28px">${msg}</div>`; };
  const id = new URLSearchParams(location.search).get("id");
  const list = await getJSON(CONFIG.memberWriteups).catch(() => []);
  const w = list.find(x => x.id === id);
  if (!w) return fail("WRITEUP NOT FOUND. MAYBE IT MOVED?");
  if (!window.marked || !window.DOMPurify) return fail("READER FAILED TO LOAD. TRY A REFRESH.");

  let md;
  try {
    const res = await fetch(w.file, { cache: "no-cache" });
    if (!res.ok) throw new Error(res.status);
    md = await res.text();
  } catch { return fail("COULDN'T LOAD THIS WRITEUP."); }

  const post = { title: w.title, tags: toList(w.tags), categories: [] };
  const lane = laneOf(post), event = eventOf(post), title = shortTitle(post);
  document.title = `${title} | T4R0T`;

  const toc = [];
  const slug = t => t.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const renderer = new marked.Renderer();
  renderer.heading = (text, level) => {
    const idv = slug(text);
    if (level === 2) toc.push([idv, text.replace(/<[^>]+>/g, "")]);
    return `<h${level} id="${idv}">${text}</h${level}>`;
  };
  renderer.code = (code, lang) => {
    if ((lang || "").trim() === "flag")
      return `<div class="flagbox"><span>FLAG</span><code>${esc(code.trim())}</code></div>`;
    return `<div class="codebox"><div class="codehd"><span>${esc(lang || "text")}</span><button type="button" class="copy">COPY</button></div><pre><code>${esc(code)}</code></pre></div>`;
  };
  renderer.image = (href, ttl, text) => `<figure><img src="${esc(href)}" alt="${esc(text)}" loading="lazy">${text ? `<figcaption>${esc(text)}</figcaption>` : ""}</figure>`;

  const html = DOMPurify.sanitize(marked.parse(md, { renderer, gfm: true }), { ADD_ATTR: ["target"] });
  const idx = list.filter(x => eventOf({ title: x.title }) === event).findIndex(x => x.id === w.id);
  const next = event ? list.filter(x => eventOf({ title: x.title }) === event)[idx + 1] : null;

  box.innerHTML = `
    <a class="back" href="writeups.html">← THE VAULT</a>
    <header class="wu-head">
      <div class="drop">${esc((event || "WRITEUP").toUpperCase())} // ${fmtDay(w.date)}</div>
      <h1 class="wu-title">${esc(title)}</h1>
      ${w.summary ? `<p class="lede">${esc(w.summary)}</p>` : ""}
      <div class="wu-meta">
        <a class="by-link" href="writeups.html?author=${encodeURIComponent(w.author)}" style="--who:${AUTHOR_COLORS[w.author] || "var(--cyan)"}">BY ${esc(w.author)}</a>
        ${lane ? `<span class="lane ${lane[0]}">${lane[1]}</span>` : ""}
        ${statusChip(w)}
        ${toList(w.tags).filter(t => !lane || t.toLowerCase() !== lane[1]).map(t => `<span class="chip">${esc(t)}</span>`).join("")}
        ${w.pdf ? `<a class="pdf-link" href="${esc(w.pdf)}" target="_blank" rel="noopener">ORIGINAL PDF ↗</a>` : ""}
      </div>
    </header>
    <div class="wu-body">
      <div class="prose" id="prose">${html}</div>
      ${toc.length > 2 ? `<aside class="toc"><div class="hd">// ON THIS PAGE</div>${toc.map(([i, t]) => `<a href="#${i}">${esc(t)}</a>`).join("")}</aside>` : ""}
    </div>
    <footer class="wu-foot">
      <a class="btn sec cut" href="writeups.html?author=${encodeURIComponent(w.author)}">MORE BY ${esc(w.author.toUpperCase())}</a>
      ${next ? `<a class="btn pri cut" href="writeup.html?id=${encodeURIComponent(next.id)}">NEXT: ${esc(shortTitle({ title: next.title }).toUpperCase())} →</a>` : ""}
    </footer>`;

  box.querySelectorAll('.prose a[href^="http"]').forEach(a => { a.target = "_blank"; a.rel = "noopener"; });
  box.querySelectorAll(".copy").forEach(b => b.addEventListener("click", async () => {
    const code = b.closest(".codebox").querySelector("code").textContent;
    try { await navigator.clipboard.writeText(code); b.textContent = "COPIED"; }
    catch { b.textContent = "SELECT + COPY"; }
    setTimeout(() => { b.textContent = "COPY"; }, 1600);
  }));
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

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}
async function checkFlag(input) {
  if (!window.crypto?.subtle) throw new Error("no crypto");   // only missing on plain http
  return (await sha256(String(input).trim())) === FLAG_HASH;
}

/* Roasts for people who stop halfway. Also stored as hashes so they don't spoil the steps. */
const HALFWAY = {
  "56e5d9af1fa75021472852bd7fe0cbfa378c2056410c7bfcbd1bb16e82b937c2": "Bro you didn't even decode it 💀",
  "74bf5453321b4b33c474ce2b6e752349f418220da6e008b907e8cf62904c32a3": "Nah bro this you think this is readable ?"
};
async function halfwayRoast(input) {
  try { return HALFWAY[await sha256(String(input).trim())] || null; } catch { return null; }
}

function initFlagPage() {
  const form = $("flagForm"), input = $("flagInput"), msg = $("flagMsg"), box = $("flagBox"), win = $("flagWin");
  let tries = 0;

  const showWin = when => {
    box.hidden = true; win.hidden = false;
    $("winTime").textContent = new Date(when).toLocaleString("en-MY", { dateStyle: "medium", timeStyle: "short" });
    win.classList.remove("boom"); void win.offsetWidth; win.classList.add("boom");
  };
  input.addEventListener("input", () => { msg.textContent = ""; msg.className = "flag-msg"; });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) { msg.textContent = "Type a flag first."; msg.className = "flag-msg bad"; return; }
    const roast = await halfwayRoast(value);
    if (roast) { msg.textContent = roast; msg.className = "flag-msg close"; shake(); return; }
    if (!/^T4R0T\{.+\}$/.test(value)) {
      msg.textContent = "That's not even flag-shaped. Format is T4R0T{...}";
      msg.className = "flag-msg bad"; shake(); return;
    }
    try {
      if (await checkFlag(value)) { showWin(new Date().toISOString()); return; }
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
    "ls members": () => state.members.map(m => m.handle + (m.role === "Leader" ? " [captain]" : isCreatorRole(m) ? " [creator]" : "")).join("  "),
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
        const roast = await halfwayRoast(guess);
        if (roast) reply = roast;
        else try { reply = await checkFlag(guess) ? ("FLAG ACCEPTED. you're one of us now. screenshot this, DM amca._. on Discord") : "nope. not the flag."; }
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
  setAuthorColors(members);

  const sorted = [...achievements];
  const teamRanked = sorted.filter(a => a.rank && a.type !== "solo");
  state.events = sorted.length;
  state.best = teamRanked.length ? "#" + Math.min(...teamRanked.map(a => a.rank)) : "—";

  if (page === "roster") {
    renderRoster(members);
    loadPosts().then(({ posts }) => {
      const counts = posts.reduce((acc, p) => (acc[p.author] = (acc[p.author] || 0) + 1, acc), {});
      renderRoster(members, counts);
    }).catch(() => {});
  }
  if (page === "writeup") renderWriteupPage();
  if (page === "about") { const lead = members.find(m => m.role === "Leader"); if (lead) $("captain").textContent = lead.handle; }
  if (page === "record") renderRecord(achievements);
  initTerminal(state);

  if (page === "home") {
    nextMatch = next;
    if (renderNext()) setInterval(renderNext, 1000);
    const paint = () => {
      renderHeroStats({ players: playerCount(members), ...state });
      renderTiles({ players: playerCount(members), ...state });
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