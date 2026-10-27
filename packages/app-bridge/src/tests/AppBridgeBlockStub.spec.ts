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

    it('should call the unsubscribe option when a subscription ends', () => {
        const unsubscribeSpy = vi.fn();
        const appBridge = getAppBridgeBlockStub({ unsubscribe: unsubscribeSpy, emitChosenEventsOnSubscribe: false });

        const unsubscribe = appBridge.subscribe('assetsChosen', vi.fn());
        unsubscribe();

        expect(unsubscribeSpy).toHaveBeenCalledOnce();
    });

    it('should throw when emitting an event on an app bridge that is not a stub', () => {
        expect(() =>
            emitAppBridgeBlockStubEvent({} as AppBridgeBlock, 'assetsChosen', { assets: [AssetDummy.with(5)] }),
        ).toThrow();
    });
});
