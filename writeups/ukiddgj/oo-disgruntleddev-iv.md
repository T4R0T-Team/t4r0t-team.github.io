**File:** `dd4_insane.pcap`

## What I did

1. There was no normal file transfer, so I checked the packet headers instead.
2. I found 16 DNS packets where the low bytes of the transaction IDs spelled a key.
3. I also found 44 ICMP packets with unusual IPv4 ID numbers.
4. I XORed the low bytes of the IPv4 IDs with the key, then Base64-decoded the result.

## Evidence

![Output from checking dd4_insane.pcap](writeups/ukiddgj/img/oo-disgruntleddev-iv-1.webp)

## Flag

```flag
OO{ph4nt0m_pr0t0c0l_m4st3r_cl4ss}
```

> **Note:** Key: Op3r4t10nPh4nt0m
