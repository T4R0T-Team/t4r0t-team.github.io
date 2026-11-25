## Description

This challenge gave us a loan website and its source code in `handout.zip`. The local Dockerfile only had `InIt{}` as a placeholder, so the real flag had to come from the live instance.

![The CashNow site used for testing the solver](writeups/kryy/img/init-cashnow.webp)

## Enumeration and progress

I went through the Node.js routes and found two interesting areas: the avatar fetch feature could return part of a non-image response, and the document preview used a string-prefix check on paths. I wrote a Python solver instead of sending every request by hand.

```text
GET  /                                   -> HTTP 200
POST /api/register                       -> HTTP 200
POST /api/login                          -> HTTP 200
POST /profile/avatar  localhost          -> HTTP 400 (blocked)
POST /profile/avatar  via 307 redirect   -> upload_dir leaked
GET  /documents/preview  direct path     -> HTTP 403
```

A redirect through httpbin.co made the avatar endpoint fetch the internal config service, and the error response included the upload directory `/data/uploads/enc-4e0bb4f0cd00/`. That was a real breakthrough.

## Where it stopped

The next idea was to upload a crafted PNG and catch the temporary thumbnail ImageMagick generates. Uploads returned HTTP 200, but the preview requests never got an HTTP 200 before the thumbnail disappeared. I had a new solver version ready, but I don't have a confirmed result from it.

**Partial.** SSRF and config exposure demonstrated, but I didn't recover the live flag.

> **Full solve:** AmcaQt took CashNow all the way. Read [InIt CTF: CashNow Loan Portal](https://amcaqt.github.io/posts/init-ctf-cashnow-loan-portal/) for the rest of the chain.
