---
"@frontify/app-bridge": minor
---

feat(useAfterInsertion):
New hook to execute a callback after the block has been inserted, can be used to focus a specific element for faster editing. The callback is only executed when the third argument is true (default).

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
