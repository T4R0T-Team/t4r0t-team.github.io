## Description

An EC2 instance was running an unauthorized scheduled script at `/opt/agent/vault.py`. Its config was encrypted, and the key was derived from the instance's identity instead of saved on disk.

![The ec2-dropper challenge card](writeups/ukiddgj/img/init-ec2-dropper.webp)

## Investigation

`incident_ec2/agent/vault.py` showed how the key is built:

```python
SALT = "s4lt_"
key = hashlib.sha256((SALT + instance_id).encode()).digest()
```

It uses AES-CBC. The first 16 bytes of `vault.bin` are the IV, the rest is ciphertext. The instance ID was in `artifacts/cloud-init-output.log`:

```text
instance-id: i-0a1b2c3d4e5f67890
region: ap-south-1
```

## Decryption

With PyCryptodome (`pip install pycryptodome`):

```python
import hashlib, zipfile
from Crypto.Cipher import AES

with zipfile.ZipFile("incident_ec2.zip") as z:
    data = z.read("incident_ec2/agent/vault.bin")

instance_id = "i-0a1b2c3d4e5f67890"
key = hashlib.sha256(("s4lt_" + instance_id).encode()).digest()
plain = AES.new(key, AES.MODE_CBC, data[:16]).decrypt(data[16:])
plain = plain[:-plain[-1]]  # PKCS#7 padding
print(plain.decode())
```

The decrypted JSON:

```json
{
  "config_version": 2,
  "collected_region": "ap-south-1",
  "operator_note": "InIt{imds_k3y3d_s3cr3t_v4ult}"
}
```

## Flag

```flag
InIt{imds_k3y3d_s3cr3t_v4ult}
```

## Takeaway

Keys derived from predictable instance metadata can be rebuilt by anyone who can read the logs that expose it.
