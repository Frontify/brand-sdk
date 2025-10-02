---
"@frontify/app-bridge": minor
---

feat: add `trackEvent` command

Use the `trackEvent` command to log custom events within blocks.
The event accepts `TrackActions` and an optional payload.

If you need more actions, please reach out through the Frontify Friends Slack channel.

Example usage:

```typescript
appBridge.trackEvent("button:clicked", {
    buttonId: "path/to/button",
    label: "Click me",
});
```
