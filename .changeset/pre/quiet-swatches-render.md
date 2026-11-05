---
"@frontify/guideline-blocks-settings": minor
---

feat: add `ColorChooser` component that renders the host color chooser in place, e.g. inside a block's flyout

```tsx
<Flyout.Content>
    <ColorChooser appBridge={appBridge} color={color} onColorSelect={setDraftColor} />
</Flyout.Content>
```

Requires `@frontify/app-bridge` `4.0.0-alpha.76` or newer, which adds the `openColorChooser`/`closeColorChooser` commands.
