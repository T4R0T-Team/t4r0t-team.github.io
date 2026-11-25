## Description

This one went back to the same GitHub account, but the `for_patrick` file had ten clues. The line "I never liked even company" suggested taking positions 1, 3, 5, 7 and 9, so I worked through those in order.

| Position | How I got it | Answer |
|---|---|---|
| 1 | MD5 lookup | `smiley` |
| 3 | Morris worm year | `1988` |
| 5 | SHA-256 lookup | `teacup` |
| 7 | RDP default TCP port | `3389` |
| 9 | NTLM hash lookup | `lisbon` |

## Where I got stuck

The last 32-character hash looked like MD5, so I tried John the Ripper with `Raw-MD5` and the rockyou wordlist. It ran for ages without finding anything.

![John the Ripper still running, without cracking the last hash as Raw-MD5](writeups/kryy/img/init-john.webp)

CrackStation finally identified it as **NTLM** and returned `lisbon`.

![CrackStation matched the same hash as NTLM: lisbon](writeups/kryy/img/init-crackstation.webp)

## Flag check

Putting the pieces together without spaces gave `InIt{smiley1988teacup3389lisbon}`, but the platform rejected it. The GitHub clue said the correct flag's SHA-256 should start with `aa999a60`, and that's where it got strange:

| Candidate | SHA-256 first 8 |
|---|---|
| `InIt{...}` no separators | `713bfb41` |
| `init{...}` no separators | `aa999a60` |
| `InIt{...}` with underscores | `a0a23f8e` |

The lowercase `init` version matched the hash hint, but it was also rejected when I submitted it. The underscore version, `InIt{smiley_1988_teacup_3389_lisbon}`, didn't match the published hash.

![One of the submitted candidates came back Incorrect](writeups/kryy/img/init-incorrect.webp)

**Unsolved.** I found all five pieces, but I can't claim a working flag for this one.
