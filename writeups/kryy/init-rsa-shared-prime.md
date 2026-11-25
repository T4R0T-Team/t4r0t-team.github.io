## Description

Two servers had separate 2048-bit RSA public keys, plus one captured ciphertext. The hint said their custom prime generator wasn't random enough, so I suspected both moduli shared a prime.

## Checking the keys

Instead of trying to factor a full 2048-bit modulus, I took the greatest common divisor of the two public moduli. The result was a non-trivial 1024-bit prime, which let me recover the factors of `n1` and calculate the private exponent.

```python
from math import gcd

# n1, n2, c1 are the long integers from the challenge
p = gcd(n1, n2)          # shared 1024-bit prime
q = n1 // p
phi = (p - 1) * (q - 1)
d = pow(65537, -1, phi)
m = pow(c1, d, n1)
print(m.to_bytes((m.bit_length() + 7) // 8, "big").decode())
```

That printed the full flag. No brute forcing needed, and the 2048-bit key size didn't help at all once the two keys had a factor in common.

## Flag

```flag
InIt{n3v3r_r3us3_pr1m3s_1n_rs4}
```

## What I learned

The hard part of RSA is generating good primes, not just picking big numbers. If two moduli share a prime, GCD breaks both of them instantly.
