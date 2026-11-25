**File:** `the_onion.txt`

## What I did

1. I opened the text file and noticed it was just a very long encoded string.
2. I tried Base64 first. After that I got hex text, so I decoded the hex and Base64 again.
3. I kept removing the other layers with a Python script, including reverse text, Rail Fence, XOR and some encoding steps.
4. After the last Base64 decode, the flag came out as normal text.

## Evidence

![Output from checking the_onion.txt](writeups/ukiddgj/img/oo-the-onion-1.webp)

## Flag

```flag
OO{p33l_b4ck_th3_l4y3rs_0n10n_m4st3r}
```

> **Note:** The file needed 23 decoding steps. I wrote the first and last output in the evidence image.
