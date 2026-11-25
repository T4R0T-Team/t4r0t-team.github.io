**File:** `tapped.mp3`

## What I did

1. I listened to the audio. It had a voice and a lot of electronic beeps.
2. I checked the spectrogram and the beep section looked like a data signal.
3. I used a GGWave decoder on the beeps. The returned bytes started with 1F 8B, a GZIP header.
4. After decompressing that data, I got the flag.

## Evidence

![Output from checking tapped.mp3](writeups/ukiddgj/img/oo-transmission-received-1.webp)

![Spectrogram of the audio data beeps](writeups/ukiddgj/img/oo-transmission-received-2.webp)

## Flag

```flag
OO{n01S3_p0Llut1on}
```
