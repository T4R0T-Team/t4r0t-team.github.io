## Description

A catalog search with an input filter watching what you type. Some record fields were private.

![The Super Blind challenge card](writeups/ukiddgj/img/init-super-blind.webp)

Target: `http://172.198.60.104:3004`

## Recon

Searching for `a` returned two records, `archive` and `weather`. A single quote caused a database-style error, while plain SQL keywords like `OR`, `AND` and `UNION` got *"That search was rejected by the input filter."*

The breakthrough was SQLite string concatenation with `||`. It got past the filter and changed the result. For the `archive` record, these acted as a true/false oracle:

```text
archive%'||iif(1,'','zzzz')||'   -> matching record
archive%'||iif(0,'','zzzz')||'   -> no match
```

`iif()` returns either an empty string or junk that breaks the match, depending on whether the condition is true.

## Blind extraction

Testing showed two accessible columns, `secret` and `description`. A condition with `instr(secret,'InIt{')` confirmed the `archive` record's `secret` held the flag.

![Console output from the oracle tests](writeups/ukiddgj/img/init-super-blind-console.webp)

Then I pulled it out character by character with `substr()` and `unicode()` inside `iif()`, using a binary search over printable ASCII to cut down the requests per character. The browser console printed:

```text
FLAG FOUND: InIt{bl1nd_sql_1nj3ct10n_g0brrrrr!@#}
```

## Flag

```flag
InIt{bl1nd_sql_1nj3ct10n_g0brrrrr!@#}
```

## Takeaway

A blacklist that only blocks familiar SQL words still lets dangerous expressions through. A true/false oracle can leak private fields without ever showing query results.
