/* (c) Copyright Frontify Ltd., all rights reserved. */

import { withAppBridgeBlockStubs } from '@frontify/app-bridge';
import { IconAdobeCreativeCloud } from '@frontify/fondue/icons';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { BlockInjectButton } from './BlockInjectButton';

const BLOCK_INJECT_BUTTON_TEST_ID = 'block-inject-button';
const DROPDOWN_ITEM_TEST_ID = 'fondue-dropdown-subtrigger';

describe('Block Inject Button', () => {
    it('should render a simple block inject button', () => {
        const [BlockInjectButtonWithStubs] = withAppBridgeBlockStubs(BlockInjectButton, {});

        render(
            <BlockInjectButtonWithStubs
                label="label"
                icon={<IconAdobeCreativeCloud />}
                secondaryLabel="second label"
                withMenu={false}
            />,
        );

        const button = screen.getByTestId(BLOCK_INJECT_BUTTON_TEST_ID);
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('first:tw-rounded-tl', 'last:tw-rounded-br');
        expect(button).toHaveClass('first:tw-rounded-bl', 'last:tw-rounded-tr');
    });

    it('should render a block inject button with a menu for upload and asset', async () => {
        const onUploadClick = vi.fn();
        const onAssetChooseClick = vi.fn();
        const [BlockInjectButtonWithStubs] = withAppBridgeBlockStubs(BlockInjectButton, {});

        render(
            <BlockInjectButtonWithStubs
                label="label"
                secondaryLabel="second label"
                onAssetChooseClick={onAssetChooseClick}
                onUploadClick={onUploadClick}
            />,
        );

        await userEvent.click(screen.getByTestId(BLOCK_INJECT_BUTTON_TEST_ID));

        const uploadItems = await screen.findAllByTestId(DROPDOWN_ITEM_TEST_ID);
        expect(uploadItems).toHaveLength(2);
        expect(uploadItems[0]).toHaveTextContent('Upload asset');
        await userEvent.click(uploadItems[0]);
        expect(onUploadClick).toHaveBeenCalledTimes(1);

        await userEvent.click(screen.getByTestId(BLOCK_INJECT_BUTTON_TEST_ID));

        const browseItems = await screen.findAllByTestId(DROPDOWN_ITEM_TEST_ID);
        expect(browseItems[1]).toHaveTextContent('Browse asset');
        await userEvent.click(browseItems[1]);
        expect(onAssetChooseClick).toHaveBeenCalledTimes(1);
    });
});
