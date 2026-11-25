## Description

The challenge gave a damaged-looking Indian Railways ticket archive and a route: Delhi → Mumbai → Chennai → Kolkata. The files weren't necessarily what their extensions said.

![The Troll's Ticket challenge card](writeups/ukiddgj/img/init-trolls-ticket.webp)

## Investigation

The outer archive had an oddly named `IRCTC_Tatkal_Hack.pdf`, a wordlist and a README. Checking the file type showed the "PDF" was actually an archive. The route gave the order to work through the nested files.

| Stage | Password or clue |
|---|---|
| Outer disguised archive | `railwaystationroyaljourney` |
| Delhi | `cholebhature` |
| Mumbai | `vada_pav` |
| Chennai | `mylapore` |
| Kolkata, final PDF | `peacock` |

I followed the layered archives, and the files hidden inside images, until I reached the encrypted final ticket. The Kolkata stage had an archive embedded in a picture, and the recovered PDF opened with `peacock`.

Useful commands for this kind of challenge:

```bash
file IRCTC_Tatkal_Hack.pdf
7z l IRCTC_Tatkal_Hack.pdf
7z x IRCTC_Tatkal_Hack.pdf
binwalk delhi.jpg
```

These show the approach. I didn't keep the full output for every layer, so I'm not going to fake it.

## Recovered ticket

![The recovered Golden Diamond Tour ticket with the flag](writeups/ukiddgj/img/init-trolls-ticket-pdf.webp)

## Flag

```flag
InIt{j0urney_4cr0ss_1ndia}
```

## Takeaway

Always check real file signatures, not file extensions. One file can be hiding a completely different format.
