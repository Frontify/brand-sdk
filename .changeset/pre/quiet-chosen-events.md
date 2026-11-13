---
"@frontify/app-bridge": minor
---

feat(AppBridgeBlockStub): let tests send `assetsChosen`, `templateChosen` and `linkChosen` themselves

`getAppBridgeBlockStub` has a new `emitChosenEventsOnSubscribe` option. It defaults to `true`, which keeps today's behaviour: subscribing to one of these events immediately calls the callback with a dummy selection. Set it to `false` to send the events when your test needs them, with the new `emitAppBridgeBlockStubEvent(appBridge, eventName, payload)`.

Events only reach callbacks that are still subscribed, because each subscription now gets its own unsubscribe function. The `unsubscribe` option is still called whenever a subscription ends.
