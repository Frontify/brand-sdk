/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconAdobeCreativeCloud } from '@frontify/fondue';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { MultiFlyoutContextProvider } from '../context/MultiFlyoutContext';

import { MenuToolbarButton } from '.';

const BUTTON_ID = 'block-item-wrapper-toolbar-flyout';
const MENU_ITEM_ID = 'menu-item';

const TEST_FLYOUT_ID = 'test';

describe('MenuToolbarButton', () => {
    it('should log error if not inside a flyout provider when opening', () => {
        vi.spyOn(console, 'error');
        const { getByTestId } = render(<MenuToolbarButton items={[]} />);

        fireEvent.click(getByTestId(BUTTON_ID));

        expect(console.error).toBeCalled();
    });

    it('should use flyout Id in flyout context', () => {
        const setOpenFlyoutIdsStub = vi.fn();

        const { getByTestId } = render(
            <MultiFlyoutContextProvider openFlyoutIds={[]} setOpenFlyoutIds={setOpenFlyoutIdsStub}>
                <MenuToolbarButton items={[]} flyoutId={TEST_FLYOUT_ID} />
            </MultiFlyoutContextProvider>,
        );

        fireEvent.click(getByTestId(BUTTON_ID));

        expect(setOpenFlyoutIdsStub).toHaveBeenCalled();
        const dispatchedStateResult = setOpenFlyoutIdsStub.mock.lastCall?.[0]([]);
        expect(dispatchedStateResult).toEqual([TEST_FLYOUT_ID]);
    });

    it('should display menu items', () => {
        const setOpenFlyoutIdsStub = vi.fn();

        const { getAllByTestId } = render(
            <MultiFlyoutContextProvider openFlyoutIds={[TEST_FLYOUT_ID]} setOpenFlyoutIds={setOpenFlyoutIdsStub}>
                <MenuToolbarButton
                    items={[
                        [{ title: 'item-1', onClick: vi.fn(), icon: <IconAdobeCreativeCloud /> }],
                        [{ title: 'item-2', onClick: vi.fn(), icon: <IconAdobeCreativeCloud /> }],
                    ]}
                    flyoutId={TEST_FLYOUT_ID}
                />
            </MultiFlyoutContextProvider>,
        );

        expect(getAllByTestId(MENU_ITEM_ID)).toHaveLength(2);
    });
});
