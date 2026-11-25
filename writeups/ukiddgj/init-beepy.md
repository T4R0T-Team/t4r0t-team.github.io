## Description

`audio.wav` was a run of short and long beeps, with the answer to be wrapped in `InIt{...}`.

![The Beepy challenge card](writeups/ukiddgj/img/init-beepy.webp)

## Investigation

The waveform had pulses of two lengths: about **0.06 s** for short ones and **0.18 s** for long ones. That's Morse code, short = dot, long = dash.

Converting the pulse timings gave:

```text
-... ...-- ...-- .--. -.-- ..--.- -- ----- .-. ... ...--
..--.- .---- ... ..--.- -.-. ----- ----- .-..
```

`..--.-` is an underscore in Morse, so it decodes to:

```text
B33PY_M0RS3_1S_C00L
```

## Flag

```flag
InIt{B33PY_M0RS3_1S_C00L}
```

## Takeaway

Audio stego doesn't always need fancy tools. The timing of the sounds alone can carry text.
