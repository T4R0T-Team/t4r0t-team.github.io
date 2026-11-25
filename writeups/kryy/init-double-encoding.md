## Description

The admin claimed the message had been "double-encoded" for safety. The ciphertext ended with `==`, which is a classic Base64 clue, so I decoded that layer first and looked at the result before trying anything else.

## Decoding

```text
Input:  VmFWZ3tlMGdfZ3UzYV9vNjRfMWZfYTBnX2YzcGhlMWdsfQ==
Base64 -> VaVg{e0g_gu3a_o64_1f_a0g_f3phe1gl}
ROT13  -> InIt{r0t_th3n_b64_1s_n0t_s3cur1ty}
```

The first decode still looked scrambled, but the braces were in the right place. After ROT13 it became a readable flag. This wasn't two layers of encryption, just Base64 followed by a basic letter substitution.

## Repeat it with Python

```python
import base64, codecs
s = "VmFWZ3tlMGdfZ3UzYV9vNjRfMWZfYTBnX2YzcGhlMWdsfQ=="
print(codecs.decode(base64.b64decode(s).decode(), "rot_13"))
```

## Flag

```flag
InIt{r0t_th3n_b64_1s_n0t_s3cur1ty}
```

## What I learned

Encoding is not encryption. If a message can be reversed with two standard transforms, the extra layer doesn't make it secure.
