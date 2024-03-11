---
"@frontify/app-bridge": patch
---

fix(useBlockSettings): `setBlockSettings` has been wrapped in a `useCallback` so it can be safely used as a dependency in react hooks. The following code will no longer cause unexpected rerenders.

```jsx
const Component = () => {
    const [blockSettings, setBlockSettings] = useBlockSettings(appBridge);

    useEffect(() => {
        setBlockSettings({ ...blockSettings });
    }, [setBlockSettings]);
};
```
