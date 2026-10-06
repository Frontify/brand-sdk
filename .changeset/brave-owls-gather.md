---
"@frontify/frontify-cli": minor
---

feat: add the `external` surfaces category with an `assetChooser` surface to the platform app manifest schema

Its `title` is now validated like other surface titles (2 to 28 characters).

```json
{
    "surfaces": {
        "external": {
            "assetChooser": {
                "title": "My App"
            }
        }
    }
}
```
