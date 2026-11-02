# T4R0T Team Site

Static site for GitHub Pages. No build step.

## Structure

```
index.html                 home: hero, stats, links to every page
about.html                 who we are + team file
roster.html                lineup cards
record.html                match history
writeups.html              CTF writeups + research (live from the blog)
contact.html               Discord, Telegram, email
assets/css/style.css       styles (fonts are the 3 variables at the top)
assets/js/app.js           renders every page from the data below,
                           and injects the shared nav, footer and terminal
data/members.json          roster
data/achievements.json     match history
data/next-match.json       hero "next match" panel (null = hidden)
data/writeups-fallback.json  backup copy of blog posts
```

## Updating stuff

| Want to... | Edit |
|---|---|
| Add a member | `data/members.json`, copy one block |
| Add a CTF result | `data/achievements.json`, copy one block. Stats recalc themselves |
| Show the next match | replace `null` in `data/next-match.json` with the object below |
| Add a writeup | just post it on the Chirpy blog. The site reads it live |
| Hide a blog category | `hideCategories` in `CONFIG` at the top of `app.js` |
| Change email / Discord / Telegram | `CONFIG` at the top of `app.js` |
| Add or rename a page in the nav | `PAGES` in `app.js`, then make the `.html` file with a matching `data-page` |

next-match.json example:

```json
{
  "event": "iHack 2026",
  "stage": "Finals",
  "format": "ATTACK & DEFENSE",
  "dates": "17 – 18 NOV 2026",
  "start": "2026-11-17T09:00:00+08:00",
  "end": "2026-11-18T18:00:00+08:00",
  "qualified": "Qualified #5 in the online round"
}
```

## Writeups

Pulled from `https://amcaqt.github.io/assets/js/data/search.json`, which Chirpy rebuilds on every deploy.
GitHub Pages sends `Access-Control-Allow-Origin: *` on public sites, so this works from the org domain too. If it can't load, the site falls back to `data/writeups-fallback.json`.

Posts titled `Event Name YYYY: Challenge` group into an event pack once there are 3 or more.

## Run locally

`fetch()` doesn't work on `file://`, so serve it:

```
python -m http.server 8000
```

Then open http://localhost:8000. Locally the live index won't be found, so you'll see the fallback data.

## Easter egg

Press the backtick key. Try `help`, `stats`, `font f`.
