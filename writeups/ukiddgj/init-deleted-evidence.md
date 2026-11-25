## Description

A workstation was imaged after someone deleted files on it. The task: recover what was removed. `evidence.img` has an MBR partition table with one NTFS partition.

![The deleted evidence challenge card](writeups/ukiddgj/img/init-deleted-evidence.webp)

## Investigation and recovery

First, identify the image:

```bash
file evidence.img
```

It's a DOS/MBR partition table with an NTFS (`0x07`) partition starting at sector 2048. Deleting a file doesn't immediately overwrite its data, so I searched the image for the gzip signature `1f 8b 08` and recovered a compressed stream.

```python
import re, zlib, codecs

disk = open("evidence.img", "rb").read()
for match in re.finditer(b"\x1f\x8b\x08", disk):
    try:
        gz = zlib.decompressobj(wbits=31)
        data = gz.decompress(disk[match.start():match.start()+40000])
        if gz.eof:
            text = data.decode("utf-8")
            print("Offset:", match.start(), "Recovered:", text)
            print("ROT13:", codecs.decode(text, "rot_13"))
    except (zlib.error, UnicodeDecodeError):
        pass
```

The stream at offset `1142144` contained:

```text
VaVg{q3y3g3q_ohg_a0g_t0a3}
```

ROT13 gave the flag.

## Flag

```flag
InIt{d3l3t3d_but_n0t_g0n3}
```

## Takeaway

On NTFS, deleting leaves content sitting in unallocated space or filesystem remnants. Deleted isn't erased.
