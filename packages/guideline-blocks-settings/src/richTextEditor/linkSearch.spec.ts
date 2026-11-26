/* (c) Copyright Frontify Ltd., all rights reserved. */

import { getAppBridgeBlockStub } from '@frontify/app-bridge/testing';
import { describe, expect, it, vi } from 'vitest';

import { createLinkSearch } from './linkSearch';

const QUERY = 'brand';
const ABORT_REASON = new Error('replaced by a newer query');

describe('createLinkSearch', () => {
    it('should map the destinations to the label and href Fondue reads', async () => {
        const search = createLinkSearch(getAppBridgeBlockStub());

        const destinations = await search(QUERY, new AbortController().signal);

        expect(destinations).toStrictEqual([
            { id: '1', label: 'Brand Guidelines', href: 'https://example.com/document/1' },
            { id: '2', label: 'Brand Colors', href: 'https://example.com/document/1#/colors' },
        ]);
    });

    it('should reject with the abort reason without calling the host when the signal is already aborted', async () => {
        const appBridge = getAppBridgeBlockStub();
        const api = vi.spyOn(appBridge, 'api');
        const controller = new AbortController();
        controller.abort(ABORT_REASON);

        await expect(createLinkSearch(appBridge)(QUERY, controller.signal)).rejects.toBe(ABORT_REASON);
        expect(api).not.toHaveBeenCalled();
    });

    it('should reject with the abort reason when the signal aborts while the host call is in flight', async () => {
        const appBridge = getAppBridgeBlockStub();
        let finishHostCall = () => {};
        const hostCall = new Promise<void>((resolve) => {
            finishHostCall = resolve;
        });
        vi.spyOn(appBridge, 'api').mockImplementation(async () => {
            await hostCall;

            return [];
        });
        const controller = new AbortController();

        const result = createLinkSearch(appBridge)(QUERY, controller.signal);
        controller.abort(ABORT_REASON);
        finishHostCall();

        await expect(result).rejects.toBe(ABORT_REASON);
    });
});
