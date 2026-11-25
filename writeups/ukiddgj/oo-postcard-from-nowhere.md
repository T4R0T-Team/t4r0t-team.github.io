**File:** `holiday.jpg`

## What I did

1. I first looked at the JPG metadata because the picture itself did not show anything strange.
2. The EXIF ImageDescription field had a flag written in it.
3. I also checked the bytes after the end of the JPG and found one more flag-looking string.
4. I kept both findings in my notes.

## Evidence

![Output from checking holiday.jpg](writeups/ukiddgj/img/oo-postcard-from-nowhere-1.webp)

## Flag

```flag
oo{3x1f_n3v3r_f0rg3ts_73bce15b}
```

> **Note:** Another string after JPEG end: oo{m3t4d4t4_n3v3r_l13s_e6ecb391}
