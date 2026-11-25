**File:** `backup.dd.gz`

## What I did

1. I extracted the GZIP backup and saw it was an NTFS disk image.
2. I checked the files inside and found flag.wav.
3. The WAV sounded strange, so I treated it like an SSTV image signal.
4. The picture decoded using Scottie S1 showed the flag.

## Evidence

![Output from checking backup.dd.gz](writeups/ukiddgj/img/oo-hidden-in-the-streams-1.webp)

![Picture recovered from the SSTV audio](writeups/ukiddgj/img/oo-hidden-in-the-streams-2.webp)

## Flag

```flag
OO{5S7V_F0R_TH3_W!N}
```

> **Note:** This is the audio-image flag, not the Alternate Data Stream flag.
