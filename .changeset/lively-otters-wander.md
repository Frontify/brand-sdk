---
"@frontify/app-bridge-app": minor
---

feat(api): add `executeGraphQlWithErrors` and deprecate `executeGraphQl`

`executeGraphQl` resolves only the `data` field of the GraphQL response, so the top-level `errors` array is not accessible to the app. The new `executeGraphQlWithErrors` method resolves the full response envelope, including `errors`. `executeGraphQl` is now deprecated.

```ts
const response = await appBridge.api({
    name: 'executeGraphQlWithErrors',
    payload: {
        query: `query CurrentUser { currentUser { id email } }`,
    },
});

// response now includes both `data` and any top-level `errors`
const { data, errors } = response;
```
