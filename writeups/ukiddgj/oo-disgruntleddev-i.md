**File:** `dd1_easy.pcap`

## What I did

1. I filtered the traffic from the workstation IP 192.168.1.47.
2. I noticed it connected to an outside IP using FTP.
3. I checked the FTP commands and found STOR, which means a file was being uploaded.
4. I followed the data stream and found the flag in the stolen Project Falcon text.

## Evidence

![Output from checking dd1_easy.pcap](writeups/ukiddgj/img/oo-disgruntleddev-i-1.webp)

## Flag

```flag
OO{ftp_1s_n3v3r_s4f3}
```

> **Note:** Useful filter: ip.src == 192.168.1.47 && ftp
