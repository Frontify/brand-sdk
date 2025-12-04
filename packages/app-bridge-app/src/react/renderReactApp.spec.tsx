/* (c) Copyright Frontify Ltd., all rights reserved. */

import { screen, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';

import { AppBridgePlatformApp } from '../AppBridgePlatformApp.ts';

import { renderReactApp } from './renderReactApp.ts';

vi.mock(import('../AppBridgePlatformApp.ts'));

const AppTest = () => {
    return <div data-test-id="test-id">This component got rendered</div>;
};

describe('renderAppReact', () => {
    beforeEach(() => {
        window.location.search = "?token='test'";
        document.body.innerHTML = '<div id="root"></div>';
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should call the dispatch method to openConnection', async () => {
        const dispatchMock = vi.fn();

        vi.mocked(AppBridgePlatformApp).mockImplementationOnce(function () {
            return {
                subscribe: vi.fn(),
                dispatch: dispatchMock,
            } as unknown as AppBridgePlatformApp;
        });

        renderReactApp({ app: AppTest, settings: {} });

        await waitFor(() => {
            expect(dispatchMock).toHaveBeenCalledWith({ name: 'openConnection' });
        });
    });

    it('should call the subscribe method and then render the test Component correctly when callback called', async () => {
        let callbackMock: () => void;
        let nameMock = '';

        vi.mocked(AppBridgePlatformApp).mockImplementationOnce(function () {
            return {
                subscribe: (name: string, callback: () => void) => {
                    callbackMock = callback;
                    nameMock = name;
                },
                dispatch: vi.fn(),
            } as unknown as AppBridgePlatformApp;
        });

        renderReactApp({ app: AppTest, settings: {} });

        await waitFor(() => {
            callbackMock();
            expect(nameMock).toBe('Context.connected');
        });

        await waitFor(() => {
            expect(screen.getAllByTestId('test-id')).toBeDefined();
        });
    });
});
