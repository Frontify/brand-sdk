/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconAdobeCreativeCloud } from '@frontify/fondue';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { MultiFlyoutContextProvider } from '../context/MultiFlyoutContext';

import { ToolbarFlyoutMenu } from './ToolbarFlyoutMenu';

const MENU_ITEM_ID = 'menu-item';

const TEST_FLYOUT_ID = 'test';

describe('ToolbarFlyoutMenu', () => {
    it('should display menu items', async () => {
        const setOpenFlyoutIdsStub = vi.fn();

        const { getAllByTestId } = render(
            <MultiFlyoutContextProvider openFlyoutIds={[TEST_FLYOUT_ID]} setOpenFlyoutIds={setOpenFlyoutIdsStub}>
                <ToolbarFlyoutMenu
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

    it('should close flyout onClick', async () => {
        const setOpenFlyoutIdsStub = vi.fn();
        const onClickStub = vi.fn();

        const { getByTestId } = render(
            <MultiFlyoutContextProvider openFlyoutIds={[TEST_FLYOUT_ID]} setOpenFlyoutIds={setOpenFlyoutIdsStub}>
                <ToolbarFlyoutMenu
                    items={[
                        [
                            {
                                title: 'item-1',
                                onClick: onClickStub,
                                icon: <IconAdobeCreativeCloud />,
                            },
                        ],
                    ]}
                    flyoutId={TEST_FLYOUT_ID}
                />
            </MultiFlyoutContextProvider>,
        );

        expect(getByTestId(MENU_ITEM_ID)).toBeVisible();

        await fireEvent.click(getByTestId(MENU_ITEM_ID));

        expect(onClickStub).toHaveBeenCalledOnce();
        expect(setOpenFlyoutIdsStub).toHaveBeenCalledOnce();
    });
});
