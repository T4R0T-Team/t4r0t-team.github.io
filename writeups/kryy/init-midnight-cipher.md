## Description

This challenge left a short ciphertext on an old forum and said the key was "the hour when everything goes quiet". My first guess for the keyword was `midnight`. The mix of letters and numbers pointed toward a classical cipher that only shifts letters.

## Solving with Vigenère

I treated the letters as Vigenère ciphertext with the key `midnight`. Numbers, underscores and braces stay unchanged, and the key position only moves forward when a letter is processed.

```text
Ciphertext: UvLg{d1m3u3k3_i4a_q0g_bn3_4uli3z}
Key:        midnight
Plaintext:  InIt{v1g3n3r3_w4s_n0t_th3_4nsw3r}
```

The funny part is the sentence inside the flag: it says Vigenère was not the answer, even though Vigenère with the given key is exactly how it decodes. I kept the recovered string instead of overthinking the joke.

## Flag

```flag
InIt{v1g3n3r3_w4s_n0t_th3_4nsw3r}
```

## What I learned

A short natural-language hint can be the whole key. I also learned to leave digits and separators untouched when testing classical letter-based ciphers.
