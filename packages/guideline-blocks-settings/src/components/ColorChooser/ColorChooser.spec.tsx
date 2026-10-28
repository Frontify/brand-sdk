/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ColorChooserColor, type openColorChooser } from '@frontify/app-bridge';
import { getAppBridgeBlockStub } from '@frontify/app-bridge/testing';
import { render, screen } from '@testing-library/react';
import sinon from 'sinon';
import { describe, expect, it, vi } from 'vitest';

import { ColorChooser } from './ColorChooser';

const COLOR_CHOOSER_TEST_ID = 'color-chooser';
const RED: ColorChooserColor = { red: 255, green: 0, blue: 0, alpha: 1 };

describe('ColorChooser', () => {
    it('should open the host color chooser in its element on mount', () => {
        const appBridge = getAppBridgeBlockStub();

        render(<ColorChooser appBridge={appBridge} color={RED} onColorSelect={vi.fn()} />);

        sinon.assert.calledOnce(appBridge.dispatch);
        const { name, payload } = appBridge.dispatch.firstCall.args[0] as ReturnType<typeof openColorChooser>;
        expect(name).toBe('openColorChooser');
        expect(payload.element).toBe(screen.getByTestId(COLOR_CHOOSER_TEST_ID));
        expect(payload.color).toEqual(RED);
    });

    it('should close the host color chooser of its element on unmount', () => {
        const appBridge = getAppBridgeBlockStub();

        const { unmount } = render(<ColorChooser appBridge={appBridge} onColorSelect={vi.fn()} />);
        const element = screen.getByTestId(COLOR_CHOOSER_TEST_ID);
        unmount();

        sinon.assert.calledWithExactly(appBridge.dispatch.lastCall, {
            name: 'closeColorChooser',
            payload: { element },
        });
    });

    it('should forward picked colors to the latest onColorSelect without reopening', () => {
        const appBridge = getAppBridgeBlockStub();
        const firstOnColorSelect = vi.fn();
        const latestOnColorSelect = vi.fn();

        const { rerender } = render(<ColorChooser appBridge={appBridge} onColorSelect={firstOnColorSelect} />);
        rerender(<ColorChooser appBridge={appBridge} onColorSelect={latestOnColorSelect} />);

        const { payload } = appBridge.dispatch.firstCall.args[0] as ReturnType<typeof openColorChooser>;
        payload.onColorSelect(RED);

        sinon.assert.calledOnce(appBridge.dispatch);
        expect(firstOnColorSelect).not.toHaveBeenCalled();
        expect(latestOnColorSelect).toHaveBeenCalledWith(RED);
    });
});
