/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { getAppBridgeThemeStub } from '../tests';

import { useNavigationManager } from './useNavigationManager';

describe('useNavigationManager hook', () => {
    let useNavigationManagerStub: ReturnType<typeof useNavigationManager>;

    beforeAll(() => {
        const appBridgeStub = getAppBridgeThemeStub();
        const { result } = renderHook(() => useNavigationManager(appBridgeStub));

        useNavigationManagerStub = result.current;
    });

    it('should call openNavigationManager', () => {
        const spy = vi.spyOn(useNavigationManagerStub, 'openNavigationManager').mockImplementation(() => undefined);

        useNavigationManagerStub.openNavigationManager();

        expect(spy).toBeCalled();
    });
});
