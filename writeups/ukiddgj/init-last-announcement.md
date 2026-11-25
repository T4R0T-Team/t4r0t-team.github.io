## Description

An Indian Railways audio announcement sounded like it had been tampered with. The spoken part didn't reveal anything.

![The Last Announcement challenge card](writeups/ukiddgj/img/init-last-announcement.webp)

## Audio analysis

Instead of transcribing the announcement, I looked at the WAV in frequency space. A spectrogram showed the hidden message at high frequencies, around **7 to 20 kHz**, while the voice sits much lower.

```python
from scipy.io import wavfile
from scipy.signal import spectrogram
import matplotlib.pyplot as plt
import numpy as np

sample_rate, audio = wavfile.read("Train_Announcement.wav")
mono = audio.mean(axis=1) if audio.ndim == 2 else audio
freq, time, power = spectrogram(mono.astype(float), sample_rate,
                                nperseg=1024, noverlap=800)
mask = (freq >= 7000) & (freq <= 22000)
plt.pcolormesh(time, freq[mask], 10*np.log10(power[mask] + 1e-12),
               shading="auto", cmap="magma")
plt.ylim(7000, 22000)
plt.xlabel("Time (seconds)")
plt.ylabel("Frequency (Hz)")
plt.show()
```

![High-frequency spectrogram spelling out the flag](writeups/ukiddgj/img/init-last-announcement-spec.webp)

## Flag

```flag
InIt{h1d1ng_f1l3s_1n_4ud10}
```

Read straight off the spectrogram. I didn't record the platform accepting it.

## Takeaway

Messages can be written into frequency bands and stay invisible to normal listening.
