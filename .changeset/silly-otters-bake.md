---
"@frontify/guideline-blocks-settings": patch
---

fix(Link): keep root-relative urls untouched

Root-relative urls entered in the link and button flyouts — such as `/hub/167` — were treated as invalid and turned into a broken absolute url like `https:///hub/167`. Any path starting with `/` is now accepted and stored as-is, so links keep working across multiple domains and sites. Previously only `/document/…` and `/r/…` were preserved. (Originally fixed in 3.0.5.)
