## Description

The challenge only gave a username, `rEdJ0Hn203`, and one unusual line: this person never stops "pushing" his work out. That sounded like a GitHub hint, so I started there.

## Enumeration

I searched the username and opened the GitHub repository. I checked the repo files and followed the trail to a Medium article. The page was written like a long letter to Patrick, and it had several strings that looked like flags, so grabbing the first one would have been a mistake.

The part that stood out was the tea recipe near the end. In the ingredient list, the line about a teacup of water had a properly formatted flag. It matched the clues much better than the obvious decoys earlier in the article.

Source: Red John's Medium article, *The Man Who Drank Tea and Forgot to Be Angry*.

## Flag

```flag
InIt{th3_truth_w4s_1n_th3_w4t3r}
```

Found in the article. I didn't record the platform submission for this one.

## What I learned

In OSINT challenges, finding the right account is only the start. Reading the whole page matters, especially when the author plants fake flags on purpose.
