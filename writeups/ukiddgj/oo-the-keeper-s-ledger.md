**File:** `ledger.txt`

## What I did

1. The clue mentioned the ends of the lines, so I checked the spaces and tabs after each line.
2. I changed space to 0 and tab to 1, then put the bits into groups of eight.
3. I converted those groups into letters using ASCII and got the first flag.
4. I also found zero-width characters near the first sentence and decoded those in the same way.

## Evidence

![Output from checking ledger.txt](writeups/ukiddgj/img/oo-the-keeper-s-ledger-1.webp)

## Flag

```flag
oo{sp4c3s_4nd_t4bs_7bb5af}
```

> **Note:** Second hidden message: oo{z3r0_w1dth_wh1sp3rs_4dbc9799}
