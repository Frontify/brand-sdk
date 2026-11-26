---
name: app-bridge-registry
description: Adds or changes an App Bridge API method, command or event in `packages/app-bridge/src/registries/`. ALWAYS apply when a block needs something new from the host — a new `appBridge.api(...)` method, a new `appBridge.dispatch(...)` command such as opening a chooser or dialog, or a new event to `subscribe` to — and when changing the payload or response of an existing one, or exposing an existing registry entry to blocks. Do not edit a registry file directly — apply this skill first. Skip for hooks that only use existing registry entries, and for removing an entry (use `public-api`).
---

A block talks to the host through three typed registries: `ApiMethodRegistry` (request and response), `CommandRegistry` (ask the host to do something) and `EventRegistry` (the host tells the block). A registry entry is only a contract. Nothing happens until the host implements the handler, so every new entry needs a matching change in the Frontify web app.

## Rules

1. Name the entry with an allowed verb. The registry types reject any other name at compile time (`registries/verbs/Verbs.ts`):
    - API method: starts with `get`, `create`, `update`, `delete`, `add`, `remove` or `set` (`getCurrentUser`).
    - Command: starts with a verb such as `open`, `close` or `download` (`openSearchDialog`).
    - Event: ends with `Chosen` (`assetsChosen`).

    Read `Verbs.ts` on your branch for the full lists, since the command verbs differ between `main` and `app-bridge-v3`. Adding a verb is a design decision: ask before you do it.

2. Add an API method in four places:
    - `registries/api/<PascalName>.ts` with the payload type, the response type and the factory.

    ```typescript
    export type GetCurrentUserPayload = void;

    export type GetCurrentUserResponse = {
        id: string;
        email: string;
    };

    export const getCurrentUser = (payload: GetCurrentUserPayload) => ({ name: 'getCurrentUser', payload });
    ```

    - A key in `ApiMethodRegistry` (`registries/api/ApiMethodRegistry.ts`) with `{ payload; response }`.
    - An export in `registries/api/index.ts`.
    - `registries/api/<PascalName>.spec.ts` that asserts the name and the payload (see the `testing` skill).

3. Add a command in three places:
    - A key in `CommandRegistry` (`registries/commands/CommandRegistry.ts`) with the payload type, or `void`.
    - `registries/commands/<PascalName>.ts` with the factory, typed by the registry. Put the `open` and `close` pair in one file.

    ```typescript
    export const openSearchDialog = (): DispatchHandlerParameter<'openSearchDialog', CommandRegistry> => ({
        name: 'openSearchDialog',
    });
    ```

    - An export in `registries/commands/index.ts`.

4. Add an event as a key in `EventRegistry` (`registries/events/EventRegistry.ts`) with the shape of the data the subscriber receives.

5. Expose the entry to blocks. `AppBridgeBlock` only accepts the keys picked in `BlockApiMethod`, `BlockCommand` and `BlockEvent` (`src/AppBridgeBlock.ts`). Add the new key to the matching `Pick`, otherwise `appBridge.api(...)`, `dispatch(...)` or `subscribe(...)` will not accept it.

6. Keep payloads and responses serializable and self-contained: plain objects, no functions or class instances. Put shared domain types in `src/types/` and reuse them.

7. Update the test stub in `src/tests/AppBridgeBlockStub.ts` so block authors can test against the new entry: add a `case` with a realistic response to the `api` stub, which throws `Method is not stubbed` for unknown names. `dispatch` resolves for every command and needs no change. For an event the block subscribes to, check that the `subscribe` stub can deliver it.

8. Add a hook in `src/react/` only when blocks need state around the entry (open and close handling, a subscription). Export it from `react/index.ts` and test it with `renderHook` and the stub.

9. Add a `CODEOWNERS` line for every new file under `packages/app-bridge`.

10. A changed payload or response of an existing entry is a breaking change for blocks and for the host. Apply the `public-api` skill first.

11. Finish with a `minor` changeset that shows the call (use the `create-changeset` skill), and say in the pull request that the host handler has to exist before blocks can use the entry.
