**File:** `rev_3.ll`

## What I did

1. I opened the .ll file and searched for the expected bytes used by the checker.
2. I found an array of 41 encrypted bytes and the function that changes the input.
3. I copied the operations into Python and worked backwards through XOR, rotations and bit swaps.
4. I tested the result by encrypting it again. All 41 bytes were the same as the expected array.

## Evidence

![Output from checking rev_3.ll](writeups/ukiddgj/img/oo-spinning-state-1.webp)

## Flag

```flag
OO{llvm_1s_a_c0re_c0mponent_0f_c0mpilers}
```

> **Note:** Verification: 41/41 bytes matched.
