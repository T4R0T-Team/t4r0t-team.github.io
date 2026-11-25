**File:** `dd3_hard.pcap`

## What I did

1. I looked at the unusual ICMP packets and the HTTP POST mentioned in the task.
2. The POST request had a cookie with a hex-looking value. I converted it and got the XOR key.
3. I sorted the five special ICMP packets by sequence number and joined their data pieces.
4. I used the key to XOR the data and read the flag.

## Evidence

![Output from checking dd3_hard.pcap](writeups/ukiddgj/img/oo-disgruntleddev-iii-1.webp)

## Flag

```flag
OO{1cmp_c0v3rt_ch4nn3l_xor_m4st3r}
```

> **Note:** Key from the cookie: d3adbeef42 (ASCII text).
