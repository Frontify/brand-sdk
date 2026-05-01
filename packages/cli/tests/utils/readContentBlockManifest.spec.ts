/* (c) Copyright Frontify Ltd., all rights reserved. */

import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { Logger } from '../../src/utils/logger';
import { readContentBlockManifest } from '../../src/utils/readContentBlockManifest';

describe('readContentBlockManifest', () => {
    let tempDir = '';
    let loggerErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        if (tempDir) {
            rmSync(tempDir, { recursive: true, force: true });
        }
        vi.clearAllMocks();

        tempDir = join(tmpdir(), `cli-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        mkdirSync(tempDir, { recursive: true });
        loggerErrorSpy = vi.spyOn(Logger, 'error').mockImplementation(() => undefined);
    });

    test('should return the parsed manifest when manifest.json is valid', () => {
        const manifest = { appId: 'abc123', appType: 'content-block' as const };
        writeFileSync(join(tempDir, 'manifest.json'), JSON.stringify(manifest));

        expect(readContentBlockManifest(tempDir)).toEqual(manifest);
        expect(loggerErrorSpy).not.toHaveBeenCalled();
    });

    test('should return undefined and log a warning when manifest.json does not exist', () => {
        expect(readContentBlockManifest(tempDir)).toBeUndefined();
        expect(loggerErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('could not read manifest.json'),
            expect.any(String),
        );
    });

    test('should return undefined and log a warning when manifest.json is not valid JSON', () => {
        writeFileSync(join(tempDir, 'manifest.json'), '{ invalid json');

        expect(readContentBlockManifest(tempDir)).toBeUndefined();
        expect(loggerErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('could not read manifest.json'),
            expect.any(String),
        );
    });
});
