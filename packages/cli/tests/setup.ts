/* (c) Copyright Frontify Ltd., all rights reserved. */

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, vi } from 'vitest';

import type ConfModule from 'conf';

// `Configuration` persists to one file in the user's config directory. Spec files run in parallel, so without
// this they would overwrite each other's values (and the developer's real CLI login). Give each spec file its own store.
const configurationDirectory = mkdtempSync(join(tmpdir(), 'frontify-cli-configuration-'));

vi.mock('conf', async (importOriginal) => {
    const { default: Conf } = await importOriginal<{ default: typeof ConfModule }>();

    return {
        default: class extends Conf {
            constructor(options: ConstructorParameters<typeof ConfModule>[0]) {
                super({ ...options, cwd: configurationDirectory });
            }
        },
    };
});

afterAll(() => {
    rmSync(configurationDirectory, { recursive: true, force: true });
});
