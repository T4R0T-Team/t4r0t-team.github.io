## Description

Photos from an abandoned camera came in an encrypted 7z with the password `camera-found`. The task was to find what was hidden in them.

![The Camera Lost & Found challenge card](writeups/ukiddgj/img/init-camera.webp)

## Investigation

The archive had 42 JPGs. The clue wasn't in the pixels: `IMG_38.jpg` had an unusual EXIF `ImageDescription`.

```bash
7z x -pcamera-found 2026-india-trip.7z
exiftool IMG_38.jpg
```

The description pointed to `https://ctf.pir4cy.com/exif-flag`, which showed a congrats message and this Base64:

```bash
printf '%s' 'SW5JdHtoMWQxbmdfMW5fbTN0YWQ0dDR9Cg==' | base64 -d
```

## Flag

```flag
InIt{h1d1ng_1n_m3tad4t4}
```

## Takeaway

EXIF metadata can carry links and messages you'd never see just opening the image.
