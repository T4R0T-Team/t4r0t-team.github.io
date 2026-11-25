## Description

The incident ZIP had an unauthorized Python script, an encrypted vault, cloud-init output, a crontab and syslog entries. The task was to recover the operator's note without access to the live EC2 host.

## Reading the evidence

I started with `agent/vault.py`. It uses AES-256-CBC, but the key isn't stored anywhere. It's calculated from a fixed salt plus the EC2 instance ID, and the instance ID was sitting in `cloud-init-output.log`.

| Evidence | Finding |
|---|---|
| `cloud-init-output.log` | `i-0a1b2c3d4e5f67890` |
| `vault.py` | `SHA-256("s4lt_" + instance ID)` → AES key |
| `vault.bin` | First 16 bytes = IV, the rest = ciphertext |
| `crontab.txt` | Runs `/opt/agent/vault.py` every 5 minutes |

## Decrypting offline

```python
key = sha256(("s4lt_" + instance_id).encode()).digest()
iv = vault_blob[:16]
ciphertext = vault_blob[16:]
plaintext = AES_256_CBC_decrypt(ciphertext, key, iv)
# remove PKCS#7 padding, then parse JSON
```

With the instance ID, the decryption produced a JSON object with `config_version: 2`, `collected_region: ap-south-1`, and the operator note.

## Flag

```flag
InIt{imds_k3y3d_s3cr3t_v4ult}
```

## What I learned

A key can be missing from disk and still be predictable. If the material needed to rebuild it is sitting in the logs, encryption alone won't protect the vault.
