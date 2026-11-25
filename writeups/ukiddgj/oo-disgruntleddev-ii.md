**File:** `dd2_medium.pcap`

## What I did

1. I looked at Marcus's DNS requests because the story said the traffic was hidden in DNS.
2. Two TXT requests to totallylegit.io looked longer than the normal requests.
3. I copied the long subdomain labels and joined them in the order 0 then 1.
4. I tried Base32 decoding and the flag appeared.

## Evidence

![Output from checking dd2_medium.pcap](writeups/ukiddgj/img/oo-disgruntleddev-ii-1.webp)

## Flag

```flag
OO{dns_tunn3l_l1k3_4_pr0}
```

> **Note:** The evidence shows the two suspicious DNS names.
