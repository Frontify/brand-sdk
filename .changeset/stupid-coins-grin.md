---
"@frontify/app-bridge": minor
---

feat(useAfterInsertion): A new hook to execute a callback after a block has been inserted, can be used to focus a specific element for faster editing. The callback is only executed when the third argument is true (default). This hook is only usable with instances of AppBridgeBlock.

```jsx
const ExampleBlock = ({ appBridge }: BlockProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [data, setData] = useState(null);
  const hasData = data !== null;

  useEffect(() => {
    getAsyncData().then((data) => setData(data));
  }, []);

  useAfterInsertion(appBridge, () => buttonRef.current?.focus(), hasData);

  return hasData ?
    <button ref={buttonRef} onClick={() => console.log("Creating new item...")}>Create New Item</button> :
    <div>Loading...</div>;
};
```
