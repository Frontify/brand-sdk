/* (c) Copyright Frontify Ltd., all rights reserved. */

import { readFileSync } from 'node:fs';
import { findPackageJSON } from 'node:module';

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { getAppBridgeVersion } from '../../src/utils/getPackageVersion';

const rootPath = '/project';

vi.mock('node:fs', () => {
    return {
        readFileSync: vi.fn(),
    };
});

vi.mock('node:module', () => {
    return {
        findPackageJSON: vi.fn(),
    };
});

describe('AppBridgeVersion utils', () => {
    beforeEach(() => {
        vi.mocked(readFileSync).mockReset();
        vi.mocked(findPackageJSON).mockReset();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('getAppBridgeVersion', () => {
        test('should return the installed version from node_modules', () => {
            vi.mocked(findPackageJSON).mockReturnValue('/project/node_modules/@frontify/app-bridge/package.json');
            vi.mocked(readFileSync).mockReturnValueOnce('{"name": "@frontify/app-bridge", "version": "3.5.2"}');

            expect(getAppBridgeVersion(rootPath)).toEqual('3.5.2');
            expect(findPackageJSON).toHaveBeenCalledWith('@frontify/app-bridge', '/project/package.json');
        });

        test('should return the installed pre-release version from node_modules', () => {
            vi.mocked(findPackageJSON).mockReturnValue('/project/node_modules/@frontify/app-bridge/package.json');
            vi.mocked(readFileSync).mockReturnValueOnce('{"name": "@frontify/app-bridge", "version": "3.0.0-beta.99"}');

            expect(getAppBridgeVersion(rootPath)).toEqual('3.0.0-beta.99');
        });

        test('should fall back to dependencies in package.json when module cannot be resolved', () => {
            vi.mocked(findPackageJSON).mockReturnValue(undefined);
            vi.mocked(readFileSync).mockReturnValueOnce('{"dependencies": {"@frontify/app-bridge": "^3.0.0"}}');

            expect(getAppBridgeVersion(rootPath)).toEqual('^3.0.0');
        });

        test('should fall back to devDependencies in package.json when not in dependencies', () => {
            vi.mocked(findPackageJSON).mockReturnValue(undefined);
            vi.mocked(readFileSync).mockReturnValueOnce('{"devDependencies": {"@frontify/app-bridge": "^3.0.0"}}');

            expect(getAppBridgeVersion(rootPath)).toEqual('^3.0.0');
        });

        test('should fall back to peerDependencies in package.json when not in dependencies or devDependencies', () => {
            vi.mocked(findPackageJSON).mockReturnValue(undefined);
            vi.mocked(readFileSync).mockReturnValueOnce('{"peerDependencies": {"@frontify/app-bridge": ">=3.0.0"}}');

            expect(getAppBridgeVersion(rootPath)).toEqual('>=3.0.0');
        });

        test('should return undefined when both resolution and fallback fail', () => {
            vi.mocked(findPackageJSON).mockReturnValue(undefined);
            vi.mocked(readFileSync).mockImplementation(() => {
                throw new Error('ENOENT');
            });

            expect(getAppBridgeVersion(rootPath)).toBeUndefined();
        });
    });
});
