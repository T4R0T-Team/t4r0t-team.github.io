## Description

The evidence was a TAR.GZ of data pulled from an Android app called Secure Notes. One note was locked in the app.

![The Locked Notes challenge card](writeups/ukiddgj/img/init-locked-notes.webp)

## Investigation

I unpacked the archive and found the app database:

```bash
tar -xzf securenotes_data.tar.gz
sqlite3 com.larkfield.securenotes/databases/notes.db
```

The `notes` table had a locked entry titled **Recovery Code** with `_id = 4` and `is_locked = 1`. Its `body` wasn't plain text, it started with the gzip magic bytes `1f 8b`.

This pulls it straight out of the archive:

```python
import tarfile, sqlite3, gzip, tempfile, pathlib

with tarfile.open("securenotes_data.tar.gz", "r:gz") as tar:
    data = tar.extractfile(
        "com.larkfield.securenotes/databases/notes.db"
    ).read()

with tempfile.TemporaryDirectory() as folder:
    dbfile = pathlib.Path(folder) / "notes.db"
    dbfile.write_bytes(data)
    connection = sqlite3.connect(dbfile)
    body = connection.execute(
        "SELECT body FROM notes WHERE _id = 4"
    ).fetchone()[0]
    print(gzip.decompress(body).decode())
```

## Flag

```flag
InIt{s3cur3_n0t3s_n0t_s0_s3cur3}
```

## Takeaway

A lock in the app's UI doesn't mean the data is encrypted at rest. Opening the SQLite database shows what's really stored.
