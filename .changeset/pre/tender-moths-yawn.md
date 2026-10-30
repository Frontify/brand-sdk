---
"@frontify/app-bridge": major
---

chore(deps): make `sinon` an optional peer dependency

npm and pnpm no longer install `sinon` alongside `@frontify/app-bridge`, and Yarn no longer warns when it's missing. Only `@frontify/app-bridge/testing` needs it.

If you import from `@frontify/app-bridge/testing`, add `sinon` to your own dev dependencies:

```sh
npm install --save-dev sinon
```
