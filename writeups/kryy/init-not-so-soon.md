## Description

The challenge described a new social media account posting repeated "not so soon" messages. I opened the profile `@not_so_soon_`. The bio said "At the right place", and there were three posts: a chair, a clock, and a nearly black image.

![The three-post profile](writeups/kryy/img/init-not-so-soon.webp)

## A hidden fragment

The dark image had text that was almost invisible until I pushed the contrast and brightness. The fragment was:

```text
but_f0und_1t}
```

The closing brace makes it look like the end of a flag, but the start was still missing. I didn't save the other captions, the post order, or any other hidden text, so I stopped here rather than guess the missing part.

**Partial.** Only the ending fragment recovered, no complete flag.

## What I learned

For social media OSINT, save every caption and every slide before trying to assemble the flag. One screenshot of the profile isn't enough for a multi-part challenge.
