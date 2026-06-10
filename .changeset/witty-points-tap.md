---
"@frontify/app-bridge-theme": minor
---

feat: add `hasVisiblePages()` to `DocumentNavigationItem`

Lets consumers detect navigation documents whose pages are all hidden from navigation, so they don't need to attempt fetching their children and/or can modify their UI accordingly if needed

```ts
navigationItems.filter((item) => item.hasVisiblePages());
```
