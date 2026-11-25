**File:** `backup.dd.gz`

## What I did

1. I used the same NTFS backup file from the first challenge.
2. I checked the NTFS file records and noticed extra named data streams.
3. There were five pieces named 0 to 4. I joined the small strings together.
4. After Base64 decoding, the hidden flag appeared.

## Evidence

![Output from checking backup.dd.gz](writeups/ukiddgj/img/oo-hidden-in-the-streams-2-1.webp)

## Flag

```flag
OO{H1Dd3n_!n_7h3_57r3@m5!1}
```

> **Note:** Both challenge uploads had the same backup image.
