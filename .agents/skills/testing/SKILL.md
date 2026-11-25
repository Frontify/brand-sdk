---
name: testing
description: Writes Vitest specs for hooks, registries, helpers, settings, components and CLI commands in the Brand SDK packages. ALWAYS apply when adding or changing tests, covering new code, or fixing a failing spec — even if the user only says "add coverage", "test this" or "make sure it works" — and when adding or changing a stub or dummy in `packages/app-bridge/src/tests/`. Do not write specs directly — apply this skill first. Skip for writing the production code itself.
---

All packages test with Vitest in a happy-dom environment. Each kind of code has one pattern, shown below.

## Rules

1. Start every `test(...)` and `it(...)` description with `should` or `should not`: `it('should return the method name')`, never `it('returns the method name')`. Fix the names of existing tests in the file when you touch it.

2. Put the spec next to the code it tests as `<name>.spec.ts(x)`. Two packages differ: `packages/cli` and `packages/sidebar-settings` keep their specs in `tests/`, in the same folder structure as `src/`.

3. Import `describe`, `expect`, `it` or `test`, and `vi` from `vitest` in every spec. Follow the file you are in for `it` or `test`.

4. Test a hook with `renderHook` and the App Bridge stub, not with a hand-made mock of `AppBridgeBlock`. The stub keeps state and returns dummies, so the hook runs against realistic data.

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ColorPaletteDummy, getAppBridgeBlockStub } from '../tests';

import { useColors } from './useColors';

describe('useColors hook', () => {
    it('should get the colors of the palette', async () => {
        const appBridgeStub = getAppBridgeBlockStub();
        const { result } = renderHook(() => useColors(appBridgeStub, 427));

        await waitFor(() => expect(result.current.colorsByPaletteId).toEqual(ColorPaletteDummy.with(427).colors));
        expect(appBridgeStub.getColorPalettesWithColors.calledWith([427])).toBe(true);
    });
});
```

5. The stub methods are Sinon stubs. Assert on them with the Sinon API (`.called`, `.calledWith(...)`, `.callCount`), not with `toHaveBeenCalled`. Use `vi.fn()` for your own callbacks.

6. Configure the stub through the options of `getAppBridgeBlockStub({ blockSettings, blockAssets, editorState, … })`. Do not reassign its methods after creation. For a component that takes an `appBridge` prop, use `withAppBridgeBlockStubs(Component, options)`, which returns the wrapped component and the stub.

7. Build test data with the dummies in `packages/app-bridge/src/tests/` (`AssetDummy.with(1)`, `UserDummy.with(…)`), not with a literal repeated in every spec. Add a missing dummy there and export it from `tests/index.ts`.

8. Stubs and dummies are published as `@frontify/app-bridge/testing` and used by block authors. A change to them is a change to public API: apply the `public-api` skill before you remove or rename one, and add a changeset. Outside `packages/app-bridge`, import them the way the neighbouring specs do: on `dev` only `@frontify/app-bridge/testing` exports them, and a spec there asserts that the main entry does not.

9. Test a registry entry by calling its factory and asserting the name and the payload.

```typescript
describe('BrandChecker', () => {
    it('should return the command name and payload', () => {
        const payload = { tab: 'configuration' as const };
        const command = openBrandChecker(payload);

        expect(command.name).toBe('openBrandChecker');
        expect(command.payload).toStrictEqual(payload);
    });
});
```

10. Test helpers, rules and transformers as pure units, with a table of inputs and expected outputs when there are many cases. Assert the exact output, not that something was returned.

11. Test components with React Testing Library from the user's view: query by role, label or text, interact, and assert what is rendered and what the callbacks received. Do not assert internal state or snapshot large trees.

12. In `packages/cli`, mock a module with `vi.mock(path, async (importOriginal) => ({ ...(await importOriginal()), <name>: mock }))` and import the code under test with `await import(...)` after the mock. Keep the rest of the module real. Write files to a temporary directory and remove it in `afterEach`. Restore any `Configuration` value the test changes.

13. Cover the failure path too: the rejected promise, the invalid input, the missing asset.

14. Run the spec you wrote: `pnpm --filter <package> exec vitest run <path/to/file.spec.ts>`. If it imports a sibling package that fails to resolve, run `pnpm build:<directory>` for that package first.
