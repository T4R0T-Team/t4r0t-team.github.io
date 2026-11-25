**File:** `chall.txt`

## What I did

1. I copied the long text from the speech bubble of the cow and removed the spaces/newlines.
2. I decoded it with Base64. The output was still unreadable.
3. The hint mentioned XOR and a hex key. I tried DEADBEEF because the cow did not survive.
4. The XOR result was zlib data. After decompressing it, the flag came out.

## Evidence

![Output from checking chall.txt](writeups/ukiddgj/img/oo-triple-trouble-1.webp)

## Flag

```flag
oo{Y0u_7r1ck3d_7h3_7r1pl3_7r0ubl3!!!}
```

> **Note:** Order: Base64 -> XOR hex DEADBEEF -> zlib.
