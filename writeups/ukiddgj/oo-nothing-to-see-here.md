**File:** `nothing.png`

## What I did

1. I found a flag in the PNG comment first, but that one was not accepted.
2. I tried separating the image into bit planes to see if any writing was hidden there.
3. The first bit of the red channel showed clear text.
4. I used that text as the final flag instead of the comment.

## Evidence

![Output from checking nothing.png](writeups/ukiddgj/img/oo-nothing-to-see-here-1.webp)

![Red-channel bit-plane from the PNG](writeups/ukiddgj/img/oo-nothing-to-see-here-2.webp)

## Flag

```flag
oo{squ1nt_h4rd3r_3e40084c}
```

> **Note:** The PNG comment was a decoy.
