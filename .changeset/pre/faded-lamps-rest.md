---
"@frontify/app-bridge": major
---

refactor(EmitterEvents): remove the `AppBridge:OpenNavigationManager` event

Nothing emits or listens to this event. Code that still references it can drop the reference, since the event never fires.
