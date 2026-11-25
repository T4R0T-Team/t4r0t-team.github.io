**File:** `broken_memories.png`

## What I did

1. The image would not open, so I checked the first bytes of the file.
2. The PNG signature was wrong. I changed it back to the normal PNG header.
3. The image size in IHDR also looked wrong. I changed it from 1 x 1 to 600 x 200 and fixed the CRC.
4. After the repair, the picture opened and the flag was written on it.

## Evidence

![Output from checking broken_memories.png](writeups/ukiddgj/img/oo-broken-memories-1.webp)

![Image after PNG header repair](writeups/ukiddgj/img/oo-broken-memories-2.webp)

## Flag

```flag
OO{f1x_th3_h34d3r_n00b}
```
