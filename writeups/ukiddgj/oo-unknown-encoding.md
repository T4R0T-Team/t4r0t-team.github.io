**File:** `flag.txt`

## What I did

1. The flag file had Chinese characters instead of English words.
2. The clue asked how the characters were typed, so I checked the Cangjie keyboard input codes.
3. I replaced each Chinese character with its keyboard code.
4. The codes formed chinese_changjie inside the braces.

## Evidence

![Output from checking flag.txt](writeups/ukiddgj/img/oo-unknown-encoding-1.webp)

## Flag

```flag
oo{chinese_changjie}
```

> **Note:** The underscore was already present in the file.
