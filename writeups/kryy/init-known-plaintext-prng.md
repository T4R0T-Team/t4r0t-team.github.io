## Description

We got `encrypt.py` and `flag.enc`. The script XORs the message in four-byte blocks. Each block uses a 32-bit key, and the key moves forward with a linear congruential generator (LCG).

## The mistake

The first four plaintext bytes aren't actually secret. Every flag starts with `InIt`, so XORing those four bytes with the first four ciphertext bytes gives the original key straight away. I recovered `0x9011A89E`. From there it's just repeating the LCG step and XORing each chunk.

```python
from pathlib import Path

data = Path("flag.enc").read_bytes()
key = int.from_bytes(data[:4], "big") ^ int.from_bytes(b"InIt", "big")
out = bytearray()
for i in range(0, len(data), 4):
    block = data[i:i+4]
    out += bytes(x ^ y for x, y in zip(block, key.to_bytes(4, "big")))
    key = (key * 1103515245 + 12345) & 0xffffffff
print(out.decode())
```

The ciphertext was 38 bytes, so the last block was shorter than four bytes. Using `zip()` handled that without adding padding to the output.

## Flag

```flag
InIt{kn0wn_pl41nt3xt_4tt4cks_4r3_c00l}
```

## What I learned

Predictable key updates are a problem when even one block of plaintext is known. A new key for every block sounds nice, but not when every next key can be calculated.
