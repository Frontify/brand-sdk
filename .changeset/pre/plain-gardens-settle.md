---
"@frontify/app-bridge": major
---

chore: require Node 22 or newer

`engines.node` was still `>=18`. Node 18 and 20 have both reached end of life, so the package now declares `>=22`, matching `@frontify/frontify-cli`.

The README also gains a worked block example, a testing example, and a note on what moved between 3.x and 4.
