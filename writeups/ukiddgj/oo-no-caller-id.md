**File:** `No_Caller_ID.wav`

## What I did

1. I heard telephone keypad sounds, so I tried DTMF decoding.
2. Each short tone matched a keypad number. The long gaps separated groups.
3. The groups looked like decimal ASCII numbers such as 79 79 123.
4. I converted the numbers to text and got the flag.

## Evidence

![Output from checking No_Caller_ID.wav](writeups/ukiddgj/img/oo-no-caller-id-1.webp)

## Flag

```flag
OO{c4Ll_m3_mAyb3}
```

> **Note:** First three ASCII values: 79 = O, 79 = O, 123 = {.
