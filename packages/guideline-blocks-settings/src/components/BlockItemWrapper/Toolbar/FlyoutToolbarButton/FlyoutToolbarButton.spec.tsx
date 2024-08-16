/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconAdobeCreativeCloud } from '@frontify/fondue';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DragPreviewContextProvider } from '../context/DragPreviewContext';
import { MultiFlyoutContextProvider } from '../context/MultiFlyoutContext';

import { FlyoutToolbarButton } from './FlyoutToolbarButton';

const BUTTON_ID = 'block-item-wrapper-toolbar-flyout';
const TOOLTIP_ID = 'fondue-tooltip-content';

const TEST_FLYOUT_ID = 'test';
const TEST_TOOLTIP = 'tooltip';

/**
 * @vitest-environment happy-dom
 */
describe('FlyoutToolbarButton', () => {
    it('should log error if not inside a flyout provider when opening', async () => {
        vi.spyOn(console, 'error');
        const { getByTestId } = render(
            <FlyoutToolbarButton
                flyoutId={TEST_FLYOUT_ID}
                icon={<IconAdobeCreativeCloud />}
                tooltip={TEST_TOOLTIP}
                content="screen"
            />,
        );

        await fireEvent.click(getByTestId(BUTTON_ID));

        expect(console.error).toBeCalled();
    });

    it('should use flyoutId in flyout context', async () => {
        const setOpenFlyoutIdsStub = vi.fn();

        const { getByTestId } = render(
            <MultiFlyoutContextProvider openFlyoutIds={[]} setOpenFlyoutIds={setOpenFlyoutIdsStub}>
                <FlyoutToolbarButton
                    flyoutId={TEST_FLYOUT_ID}
                    icon={<IconAdobeCreativeCloud />}
                    tooltip={TEST_TOOLTIP}
                    content="children"
                />
            </MultiFlyoutContextProvider>,
        );

        await fireEvent.click(getByTestId(BUTTON_ID));

        expect(setOpenFlyoutIdsStub).toHaveBeenCalled();
        const dispatchedStateResult = setOpenFlyoutIdsStub.mock.lastCall[0]([]);
        expect(dispatchedStateResult).toEqual([TEST_FLYOUT_ID]);
    });

    it('should display content', () => {
        const setOpenFlyoutIdsStub = vi.fn();

        const { getByTestId } = render(
            <MultiFlyoutContextProvider openFlyoutIds={[TEST_FLYOUT_ID]} setOpenFlyoutIds={setOpenFlyoutIdsStub}>
                <FlyoutToolbarButton
                    flyoutId={TEST_FLYOUT_ID}
                    icon={<IconAdobeCreativeCloud />}
                    tooltip={TEST_TOOLTIP}
                    flyoutFooter={<div data-test-id="footer">Footer</div>}
                    flyoutHeader={<div data-test-id="header">Header</div>}
                    content={<div data-test-id="content">Content</div>}
                />
            </MultiFlyoutContextProvider>,
        );

        expect(getByTestId('content')).toBeVisible();
        expect(getByTestId('header')).toBeVisible();
        expect(getByTestId('footer')).toBeVisible();
    });

    it('should show tooltip content', async () => {
        const setOpenFlyoutIdsStub = vi.fn();

        const { getByTestId } = render(
            <MultiFlyoutContextProvider openFlyoutIds={[]} setOpenFlyoutIds={setOpenFlyoutIdsStub}>
                <FlyoutToolbarButton
                    flyoutId={TEST_FLYOUT_ID}
                    icon={<IconAdobeCreativeCloud />}
                    tooltip={TEST_TOOLTIP}
                    content="children"
                />
            </MultiFlyoutContextProvider>,
        );

        getByTestId(BUTTON_ID).focus();

        await waitFor(() => expect(getByTestId(TOOLTIP_ID)).toBeInTheDocument());
    });

    it('should use supplied icon', () => {
        const setOpenFlyoutIdsStub = vi.fn();

        const { getByTestId } = render(
            <MultiFlyoutContextProvider openFlyoutIds={[]} setOpenFlyoutIds={setOpenFlyoutIdsStub}>
                <FlyoutToolbarButton
                    flyoutId={TEST_FLYOUT_ID}
                    icon={<IconAdobeCreativeCloud />}
                    tooltip={TEST_TOOLTIP}
                    content="content"
                />
            </MultiFlyoutContextProvider>,
        );

        const icons = [...getByTestId(BUTTON_ID).getElementsByTagName('svg')];
        expect(icons).toHaveLength(1);
        expect(icons[0].outerHTML).toMatch('IconAdobeCreativeCloud');
    });

    it('should disable tooltip and flyout when content is inside drag preview', async () => {
        const { getByTestId, queryByTestId } = render(
            <MultiFlyoutContextProvider openFlyoutIds={[TEST_FLYOUT_ID]} setOpenFlyoutIds={vi.fn()}>
                <DragPreviewContextProvider isDragPreview>
                    <FlyoutToolbarButton
                        flyoutId={TEST_FLYOUT_ID}
                        icon={<IconAdobeCreativeCloud />}
                        tooltip={TEST_TOOLTIP}
                        content={<div data-test-id="content">Content</div>}
                    />
                </DragPreviewContextProvider>
            </MultiFlyoutContextProvider>,
        );

        getByTestId(BUTTON_ID).focus();

        await waitFor(() => expect(queryByTestId(TOOLTIP_ID)).toBeNull());
    });
});
