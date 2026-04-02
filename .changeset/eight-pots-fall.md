---
"@frontify/frontify-cli": minor
---

feat: add `publish` command for publishing apps to the Frontify Marketplace

Publish your app directly from the CLI using `frontify-cli publish`.

### Usage

```bash
# Publish with release notes (required)
frontify-cli publish --release-notes="Initial release"

# Publish with community availability (default: PRIVATE)
frontify-cli publish --release-notes="Bug fixes" --availability=COMMUNITY

# Publish using explicit credentials instead of stored login
frontify-cli publish --release-notes="New feature" --token=<access-token> --instance=<instance-url>
```
