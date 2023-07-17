/* (c) Copyright Frontify Ltd., all rights reserved. */

import sinon from 'sinon';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, cleanup, renderHook } from '@testing-library/react';

import { getAppBridgeBlockStub } from '../tests';
import { AppBridgeBlock } from '../AppBridgeBlock';
import { useTemplateChooser } from './useTemplateChooser';

describe('useReadyForPrint hook', () => {
    let appBridgeStub: sinon.SinonStubbedInstance<AppBridgeBlock>;

    beforeEach(() => {
        appBridgeStub = getAppBridgeBlockStub();
    });

    afterEach(() => {
        sinon.restore();
        cleanup();
    });

    it('should dispatch openTemplateChooser and subscribe to callback', () => {
        const { result } = renderHook(() => useTemplateChooser(appBridgeStub));
        const callbackSpy = sinon.spy();

        act(() => {
            result.current.openTemplateChooser(callbackSpy);
        });

        expect(appBridgeStub.dispatch.calledOnce).toBe(true);
        expect(
            appBridgeStub.dispatch.calledWith({
                commandName: 'openTemplateChooser',
            }),
        ).toBe(true);

        expect(appBridgeStub.subscribe.calledOnce).toBe(true);
        expect(appBridgeStub.subscribe.calledWith('templateChosen', callbackSpy)).toBe(true);
    });

    it('should dispatch closeTemplateChooser', () => {
        const { result } = renderHook(() => useTemplateChooser(appBridgeStub));

        act(() => {
            result.current.closeTemplateChooser();
        });

        expect(appBridgeStub.dispatch.calledOnce).toBe(true);
        expect(
            appBridgeStub.dispatch.calledWith({
                commandName: 'closeTemplateChooser',
            }),
        ).toBe(true);
    });
});
