/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, it, vi, expect } from 'vitest';

import * as AppBridge from '../AppBridgePlatformApp.ts';
import {
    type AppBridgePlatformApp,
    type AssetActionContext,
    type AssetCreationContext,
} from '../AppBridgePlatformApp.ts';

import { appContext } from './appContext.ts';

describe('appContext', () => {
    it('should have type of AssetActionContext when adding AssetActionContext generic', () => {
        vi.spyOn(AppBridge, 'AppBridgePlatformApp').mockImplementation(
            () =>
                ({
                    context: () => ({
                        get: vi.fn().mockImplementation(() => ({ surface: 'assetAction', assetId: 'test-123' })),
                    }),
                }) as unknown as AppBridgePlatformApp,
        );

        const context = appContext();

        if (context.surface === 'assetAction') {
            expect(context.assetId).toBe('test-123');
        }

        const genericContext = appContext<AssetActionContext>();
        expect(genericContext.assetId).toBe('test-123');
    });
    it('should have type of AssetCreation when adding AssetCreationContext generic', () => {
        vi.spyOn(AppBridge, 'AppBridgePlatformApp').mockImplementationOnce(
            () =>
                ({
                    context: () => ({
                        get: vi.fn().mockImplementation(() => ({ brandId: 'test-123' })),
                    }),
                }) as unknown as AppBridgePlatformApp,
        );

        const context = appContext<AssetCreationContext>();

        expect(context.brandId).toBe('test-123');
    });
});
