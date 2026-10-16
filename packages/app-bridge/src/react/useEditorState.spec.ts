/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { getAppBridgeBlockStub } from '../tests';

import { useEditorState } from './useEditorState';

const createHostEditorState = (initialEditorState: boolean) => {
    let editorState = initialEditorState;
    const subscribers = new Set<(nextEditorState: boolean) => void>();

    return {
        context: {
            get: () => editorState,
            subscribe: (callback: (nextEditorState: boolean) => void) => {
                subscribers.add(callback);
                return () => subscribers.delete(callback);
            },
        },
        set: (nextEditorState: boolean) => {
            editorState = nextEditorState;
            for (const subscriber of subscribers) {
                subscriber(nextEditorState);
            }
        },
        subscriberCount: () => subscribers.size,
    };
};

describe('useEditorState', () => {
    afterEach(() => {
        cleanup();
    });

    it('should read the editor state from the host context', () => {
        const appBridge = getAppBridgeBlockStub({ editorState: false });
        const host = createHostEditorState(true);
        appBridge.context.withArgs('isEditing').returns(host.context);

        const { result } = renderHook(() => useEditorState(appBridge));

        expect(result.current).toBe(true);
    });

    it('should update when the host publishes a new editor state', () => {
        const appBridge = getAppBridgeBlockStub();
        const host = createHostEditorState(false);
        appBridge.context.withArgs('isEditing').returns(host.context);

        const { result } = renderHook(() => useEditorState(appBridge));
        act(() => host.set(true));

        expect(result.current).toBe(true);
    });

    it('should unsubscribe from the host context on unmount', () => {
        const appBridge = getAppBridgeBlockStub();
        const host = createHostEditorState(false);
        appBridge.context.withArgs('isEditing').returns(host.context);

        const { unmount } = renderHook(() => useEditorState(appBridge));
        expect(host.subscriberCount()).toBe(1);
        unmount();

        expect(host.subscriberCount()).toBe(0);
    });

    it('should read the editor state of the block stub', () => {
        const appBridge = getAppBridgeBlockStub({ editorState: true });

        const { result } = renderHook(() => useEditorState(appBridge));

        expect(result.current).toBe(true);
    });
});
