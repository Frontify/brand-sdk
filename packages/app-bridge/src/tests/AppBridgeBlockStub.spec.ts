/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it, vi } from 'vitest';

import { type AppBridgeBlock } from '../AppBridgeBlock';

import { emitAppBridgeBlockStubEvent, getAppBridgeBlockStub } from './AppBridgeBlockStub';
import { AssetDummy } from './AssetDummy';

describe('getAppBridgeBlockStub', () => {
    it('should call chosen event callbacks with a dummy selection on subscribe by default', () => {
        const appBridge = getAppBridgeBlockStub();
        const onAssetsChosen = vi.fn();
        const onTemplateChosen = vi.fn();
        const onLinkChosen = vi.fn();

        appBridge.subscribe('assetsChosen', onAssetsChosen);
        appBridge.subscribe('templateChosen', onTemplateChosen);
        appBridge.subscribe('linkChosen', onLinkChosen);

        expect(onAssetsChosen).toHaveBeenCalledWith({ assets: [expect.objectContaining({ id: 123 })] });
        expect(onTemplateChosen).toHaveBeenCalledWith({ template: expect.objectContaining({ id: 234 }) });
        expect(onLinkChosen).toHaveBeenCalledWith({ url: 'https://example.com' });
    });

    it('should not call chosen event callbacks on subscribe when emitChosenEventsOnSubscribe is false', () => {
        const appBridge = getAppBridgeBlockStub({ emitChosenEventsOnSubscribe: false });
        const onAssetsChosen = vi.fn();
        const onTemplateChosen = vi.fn();
        const onLinkChosen = vi.fn();

        appBridge.subscribe('assetsChosen', onAssetsChosen);
        appBridge.subscribe('templateChosen', onTemplateChosen);
        appBridge.subscribe('linkChosen', onLinkChosen);

        expect(onAssetsChosen).not.toHaveBeenCalled();
        expect(onTemplateChosen).not.toHaveBeenCalled();
        expect(onLinkChosen).not.toHaveBeenCalled();
    });

    it('should send an emitted event only to callbacks that are still subscribed to it', () => {
        const appBridge = getAppBridgeBlockStub({ emitChosenEventsOnSubscribe: false });
        const unsubscribedCallback = vi.fn();
        const subscribedCallback = vi.fn();
        const otherEventCallback = vi.fn();

        const unsubscribe = appBridge.subscribe('assetsChosen', unsubscribedCallback);
        appBridge.subscribe('assetsChosen', subscribedCallback);
        appBridge.subscribe('templateChosen', otherEventCallback);
        unsubscribe();

        emitAppBridgeBlockStubEvent(appBridge, 'assetsChosen', { assets: [AssetDummy.with(5)] });

        expect(unsubscribedCallback).not.toHaveBeenCalled();
        expect(subscribedCallback).toHaveBeenCalledWith({ assets: [expect.objectContaining({ id: 5 })] });
        expect(otherEventCallback).not.toHaveBeenCalled();
    });

    it('should still send an event to later subscribers when a callback unsubscribes while it is sent', () => {
        const appBridge = getAppBridgeBlockStub({ emitChosenEventsOnSubscribe: false });
        const laterCallback = vi.fn();

        const unsubscribe = appBridge.subscribe('assetsChosen', () => unsubscribe());
        appBridge.subscribe('assetsChosen', laterCallback);
        emitAppBridgeBlockStubEvent(appBridge, 'assetsChosen', { assets: [AssetDummy.with(5)] });

        expect(laterCallback).toHaveBeenCalledOnce();
    });

    it('should call the unsubscribe option when a subscription ends', () => {
        const unsubscribeSpy = vi.fn();
        const appBridge = getAppBridgeBlockStub({ unsubscribe: unsubscribeSpy, emitChosenEventsOnSubscribe: false });

        const unsubscribe = appBridge.subscribe('assetsChosen', vi.fn());
        unsubscribe();

        expect(unsubscribeSpy).toHaveBeenCalledOnce();
    });

    it('should answer the settings context from the blockSettings option', () => {
        const appBridge = getAppBridgeBlockStub({ blockSettings: { color: 'red' } });

        expect(appBridge.context('settings').get()).toEqual({ color: 'red' });
    });

    it('should merge updated block settings into the settings context and notify its subscribers', async () => {
        const blockSettings = { color: 'red', layout: { columns: 2, gap: 8 } };
        const appBridge = getAppBridgeBlockStub({ blockSettings });
        const onSettingsChanged = vi.fn();
        appBridge.context('settings').subscribe(onSettingsChanged);

        await appBridge.updateBlockSettings({ layout: { columns: 3 } });

        const expectedSettings = { color: 'red', layout: { columns: 3, gap: 8 } };
        expect(appBridge.context('settings').get()).toEqual(expectedSettings);
        expect(onSettingsChanged).toHaveBeenCalledWith(expectedSettings);
        expect(blockSettings).toEqual({ color: 'red', layout: { columns: 2, gap: 8 } });
    });

    it('should not notify a settings subscriber after it unsubscribes', async () => {
        const appBridge = getAppBridgeBlockStub();
        const onSettingsChanged = vi.fn();
        const unsubscribe = appBridge.context('settings').subscribe(onSettingsChanged);
        unsubscribe();

        await appBridge.updateBlockSettings({ color: 'blue' });

        expect(onSettingsChanged).not.toHaveBeenCalled();
    });

    it('should throw when emitting an event on an app bridge that is not a stub', () => {
        expect(() =>
            emitAppBridgeBlockStubEvent({} as AppBridgeBlock, 'assetsChosen', { assets: [AssetDummy.with(5)] }),
        ).toThrow();
    });
});
