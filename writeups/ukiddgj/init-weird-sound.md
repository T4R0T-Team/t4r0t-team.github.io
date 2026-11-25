## Description

The prompt straight up suggested a spectrum analyzer, with the answer wrapped in `InIt{...}`.

![The Weird Sound challenge card](writeups/ukiddgj/img/init-weird-sound.webp)

## Investigation

I generated a spectrogram and looked at the high-frequency patterns. The characters spelled something like **"W0ah Y0u S33 M3!"**. The tricky part was telling the uppercase `S` apart from the digit `5` in `S33`.

![Spectrogram showing the flag text](writeups/ukiddgj/img/init-weird-sound-spec.webp)

My first few tries failed because I'd misread a glyph or two. Going back to the spectrogram and comparing the shapes carefully fixed it.

## Flag

```flag
InIt{W0ah_Y0u_S33_M3!}
```

Confirmed accepted by the platform ✅

## Takeaway

When a flag is drawn visually, capitals and look-alike characters matter. Re-check the source instead of guessing variations.
