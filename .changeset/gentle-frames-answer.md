---
"@frontify/app-bridge-app": patch
---

fix: send the connection handshake to the embedding window instead of the top window

Apps now connect when the platform hosting them is itself embedded in an iframe, such as the asset chooser inside another page. The handshake also no longer reaches the top-level page.
