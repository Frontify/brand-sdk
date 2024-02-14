/* (c) Copyright Frontify Ltd., all rights reserved. */

import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { IconAdobeCreativeCloud } from '@frontify/fondue';
import { MenuToolbarButton } from '.';
import { MutliFlyoutContextProvider } from '../context/MultiFlyoutContext';

const BUTTON_ID = 'block-item-wrapper-toolbar-flyout';
const MENU_ITEM_ID = 'menu-item';
const TOOLTIP_ID = 'toolbar-button-tooltip';

const TEST_FLYOUT_ID = 'test';
const TEST_TOOLTIP = 'tooltip';
/**
 * @vitest-environment happy-dom
 */

describe('MenuToolbarButton', () => {
    it('should log error if not inside a flyout provider when opening', async () => {
        vi.spyOn(console, 'error');
        const { getByTestId } = render(<MenuToolbarButton items={[]} />);

        await fireEvent.click(getByTestId(BUTTON_ID));

        expect(console.error).toBeCalled();
    });

    it('should use flyout Id in flyout context', async () => {
        const setOpenFlyoutIdsStub = vi.fn();

        const { getByTestId } = render(
            <MutliFlyoutContextProvider openFlyoutIds={[]} setOpenFlyoutIds={setOpenFlyoutIdsStub}>
                <MenuToolbarButton items={[]} flyoutId={TEST_FLYOUT_ID} />
            </MutliFlyoutContextProvider>,
        );

        await fireEvent.click(getByTestId(BUTTON_ID));

        expect(setOpenFlyoutIdsStub).toHaveBeenCalled();
        const dispatchedStateResult = setOpenFlyoutIdsStub.mock.lastCall[0]([]);
        expect(dispatchedStateResult).toEqual([TEST_FLYOUT_ID]);
    });

    it('should display menu items', async () => {
        const setOpenFlyoutIdsStub = vi.fn();

        const { getAllByTestId } = render(
            <MutliFlyoutContextProvider openFlyoutIds={[TEST_FLYOUT_ID]} setOpenFlyoutIds={setOpenFlyoutIdsStub}>
                <MenuToolbarButton
                    items={[
                        [{ title: 'item-1', onClick: vi.fn(), icon: <IconAdobeCreativeCloud /> }],
                        [{ title: 'item-2', onClick: vi.fn(), icon: <IconAdobeCreativeCloud /> }],
                    ]}
                    flyoutId={TEST_FLYOUT_ID}
                />
            </MutliFlyoutContextProvider>,
        );

        expect(getAllByTestId(MENU_ITEM_ID)).toHaveLength(2);
    });

    it('should show tooltip content', async () => {
        const setOpenFlyoutIdsStub = vi.fn();

        const { getByTestId } = render(
            <MutliFlyoutContextProvider openFlyoutIds={[]} setOpenFlyoutIds={setOpenFlyoutIdsStub}>
                <MenuToolbarButton items={[]} tooltip={TEST_TOOLTIP} flyoutId={TEST_FLYOUT_ID} />
            </MutliFlyoutContextProvider>,
        );

        getByTestId(BUTTON_ID).focus();

        await waitFor(() => expect(getByTestId(TOOLTIP_ID)).not.toHaveClass('tw-opacity-0'));
        expect(getByTestId(TOOLTIP_ID)).toHaveTextContent(TEST_TOOLTIP);
    });
});
