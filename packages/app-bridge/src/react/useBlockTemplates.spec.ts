/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TemplateDummy, getAppBridgeBlockStub } from '../tests';
import { type Template } from '../types';

import { useBlockTemplates } from './useBlockTemplates';

const createHostTemplates = (initialTemplates?: Record<string, Template[]>) => {
    let templates = initialTemplates;
    const subscribers = new Set<(nextTemplates?: Record<string, Template[]>) => void>();

    return {
        context: {
            get: () => templates,
            subscribe: (callback: (nextTemplates?: Record<string, Template[]>) => void) => {
                subscribers.add(callback);
                return () => subscribers.delete(callback);
            },
        },
        set: (nextTemplates: Record<string, Template[]>) => {
            templates = nextTemplates;
            for (const subscriber of subscribers) {
                subscriber(nextTemplates);
            }
        },
        subscriberCount: () => subscribers.size,
    };
};

const templateIdsOf = (blockTemplates: Record<string, Template[]>, key: string) =>
    blockTemplates[key]?.map(({ id }) => id);

describe('useBlockTemplates hook', () => {
    afterEach(() => {
        cleanup();
    });

    it('should provide the block templates from the templates context', () => {
        const appBridge = getAppBridgeBlockStub({ blockTemplates: { key: [TemplateDummy.with(1)] } });

        const { result } = renderHook(() => useBlockTemplates(appBridge));

        expect(result.current.blockTemplates).toEqual({ key: [TemplateDummy.with(1)] });
    });

    it('should provide the same empty templates on every render when the host has no templates in the context', () => {
        const appBridge = getAppBridgeBlockStub();
        appBridge.context.withArgs('templates').returns(createHostTemplates().context);

        const { result, rerender } = renderHook(() => useBlockTemplates(appBridge));
        const initialBlockTemplates = result.current.blockTemplates;
        rerender();

        expect(initialBlockTemplates).toEqual({});
        expect(result.current.blockTemplates).toBe(initialBlockTemplates);
    });

    it('should re-render when the host updates the templates context', () => {
        const appBridge = getAppBridgeBlockStub();
        const host = createHostTemplates({ key: [TemplateDummy.with(1)] });
        appBridge.context.withArgs('templates').returns(host.context);

        const { result } = renderHook(() => useBlockTemplates(appBridge));
        act(() => host.set({ key: [TemplateDummy.with(2)] }));

        expect(result.current.blockTemplates).toEqual({ key: [TemplateDummy.with(2)] });
    });

    it('should unsubscribe from the templates context on unmount', () => {
        const appBridge = getAppBridgeBlockStub();
        const host = createHostTemplates({});
        appBridge.context.withArgs('templates').returns(host.context);

        const { unmount } = renderHook(() => useBlockTemplates(appBridge));
        expect(host.subscriberCount()).toBe(1);
        unmount();

        expect(host.subscriberCount()).toBe(0);
    });

    it('should add template ids to a key', async () => {
        const appBridge = getAppBridgeBlockStub({ blockTemplates: { key: [TemplateDummy.with(1)] } });
        const { result } = renderHook(() => useBlockTemplates(appBridge));

        await act(() => result.current.addTemplateIdsToKey('key', [2]));

        expect(appBridge.addTemplateIdsToBlockTemplateKey.calledOnceWithExactly('key', [2])).toBe(true);
        expect(templateIdsOf(result.current.blockTemplates, 'key')).toEqual([1, 2]);
    });

    it('should delete template ids from a key', async () => {
        const appBridge = getAppBridgeBlockStub({ blockTemplates: { key: [TemplateDummy.with(1)] } });
        const { result } = renderHook(() => useBlockTemplates(appBridge));

        await act(() => result.current.deleteTemplateIdsFromKey('key', [1]));

        expect(appBridge.deleteTemplateIdsFromBlockTemplateKey.calledOnceWithExactly('key', [1])).toBe(true);
        expect(result.current.blockTemplates).toEqual({ key: [] });
    });

    it('should replace the templates of a key in the given order', async () => {
        const appBridge = getAppBridgeBlockStub({
            blockTemplates: { key: [TemplateDummy.with(1), TemplateDummy.with(2)] },
        });
        const { result } = renderHook(() => useBlockTemplates(appBridge));

        await act(() => result.current.updateTemplateIdsFromKey('key', [2, 1]));

        expect(appBridge.deleteTemplateIdsFromBlockTemplateKey.calledOnceWithExactly('key', [1, 2])).toBe(true);
        expect(appBridge.addTemplateIdsToBlockTemplateKey.calledOnceWithExactly('key', [2, 1])).toBe(true);
        expect(templateIdsOf(result.current.blockTemplates, 'key')).toEqual([2, 1]);
    });

    it('should not delete templates when replacing a key that has none', async () => {
        const appBridge = getAppBridgeBlockStub({ blockTemplates: { key: [] } });
        const { result } = renderHook(() => useBlockTemplates(appBridge));

        await act(() => result.current.updateTemplateIdsFromKey('key', [2, 1]));

        expect(appBridge.deleteTemplateIdsFromBlockTemplateKey.called).toBe(false);
        expect(appBridge.addTemplateIdsToBlockTemplateKey.calledOnceWithExactly('key', [2, 1])).toBe(true);
        expect(templateIdsOf(result.current.blockTemplates, 'key')).toEqual([2, 1]);
    });

    it('should not load the templates itself', async () => {
        const appBridge = getAppBridgeBlockStub({ blockTemplates: { key: [TemplateDummy.with(1)] } });
        const { result } = renderHook(() => useBlockTemplates(appBridge));

        await act(() => result.current.addTemplateIdsToKey('key', [2]));
        await act(() => result.current.deleteTemplateIdsFromKey('key', [1]));
        await act(() => result.current.updateTemplateIdsFromKey('key', [3]));

        expect(appBridge.getBlockTemplates.called).toBe(false);
    });

    it('should re-render every hook on the same app bridge when one of them changes the templates', async () => {
        const appBridge = getAppBridgeBlockStub({ blockTemplates: { key: [TemplateDummy.with(1)] } });
        const { result: first } = renderHook(() => useBlockTemplates(appBridge));
        const { result: second } = renderHook(() => useBlockTemplates(appBridge));

        await act(() => first.current.addTemplateIdsToKey('key', [2]));

        expect(templateIdsOf(second.current.blockTemplates, 'key')).toEqual([1, 2]);
    });

    it('should keep the templates and set the error when replacing them fails', async () => {
        const errorMessage = 'Unsuccessful API call';
        const appBridge = getAppBridgeBlockStub({
            blockTemplates: { key: [TemplateDummy.with(1), TemplateDummy.with(2)] },
        });
        appBridge.deleteTemplateIdsFromBlockTemplateKey.rejects(new Error(errorMessage));
        const { result } = renderHook(() => useBlockTemplates(appBridge));

        await act(() => result.current.updateTemplateIdsFromKey('key', [2, 1]));

        expect(appBridge.addTemplateIdsToBlockTemplateKey.called).toBe(false);
        expect(templateIdsOf(result.current.blockTemplates, 'key')).toEqual([1, 2]);
        expect(result.current.error).toEqual(errorMessage);
    });

    it('should set the error when adding templates fails', async () => {
        const errorMessage = "Couldn't add templates";
        const appBridge = getAppBridgeBlockStub({ blockTemplates: { key: [TemplateDummy.with(1)] } });
        appBridge.addTemplateIdsToBlockTemplateKey.rejects(new Error(errorMessage));
        const { result } = renderHook(() => useBlockTemplates(appBridge));

        await act(() => result.current.addTemplateIdsToKey('key', [2]));

        expect(result.current.error).toEqual(errorMessage);
    });

    it('should set the error when deleting templates fails', async () => {
        const errorMessage = "Couldn't delete templates";
        const appBridge = getAppBridgeBlockStub({ blockTemplates: { key: [TemplateDummy.with(1)] } });
        appBridge.deleteTemplateIdsFromBlockTemplateKey.rejects(new Error(errorMessage));
        const { result } = renderHook(() => useBlockTemplates(appBridge));

        await act(() => result.current.deleteTemplateIdsFromKey('key', [1]));

        expect(result.current.error).toEqual(errorMessage);
    });

    it('should set the error when the host rejects with a string', async () => {
        const appBridge = getAppBridgeBlockStub({ blockTemplates: { key: [TemplateDummy.with(1)] } });
        appBridge.deleteTemplateIdsFromBlockTemplateKey.callsFake(
            vi.fn().mockRejectedValue("Couldn't delete templates"),
        );
        const { result } = renderHook(() => useBlockTemplates(appBridge));

        await act(() => result.current.deleteTemplateIdsFromKey('key', [1]));

        expect(result.current.error).toEqual("Couldn't delete templates");
    });

    it('should keep the same functions across re-renders', async () => {
        const appBridge = getAppBridgeBlockStub({ blockTemplates: { key: [TemplateDummy.with(1)] } });
        const { result, rerender } = renderHook(() => useBlockTemplates(appBridge));
        const { addTemplateIdsToKey, deleteTemplateIdsFromKey, updateTemplateIdsFromKey } = result.current;

        await act(() => result.current.addTemplateIdsToKey('key', [2]));
        rerender();

        expect(templateIdsOf(result.current.blockTemplates, 'key')).toEqual([1, 2]);
        expect(result.current.addTemplateIdsToKey).toBe(addTemplateIdsToKey);
        expect(result.current.deleteTemplateIdsFromKey).toBe(deleteTemplateIdsFromKey);
        expect(result.current.updateTemplateIdsFromKey).toBe(updateTemplateIdsFromKey);
    });

    it('should replace the latest templates when a function from an earlier render is called', async () => {
        const appBridge = getAppBridgeBlockStub({ blockTemplates: { key: [TemplateDummy.with(1)] } });
        const { result } = renderHook(() => useBlockTemplates(appBridge));
        const { updateTemplateIdsFromKey } = result.current;

        await act(() => result.current.addTemplateIdsToKey('key', [2]));
        await act(() => updateTemplateIdsFromKey('key', [3]));

        expect(appBridge.deleteTemplateIdsFromBlockTemplateKey.calledOnceWithExactly('key', [1, 2])).toBe(true);
    });
});
