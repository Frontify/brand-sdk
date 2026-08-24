/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconMagnifier } from '@frontify/fondue/icons';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { BlockItemWrapper } from './BlockItemWrapper';

const BLOCK_ITEM_WRAPPER_TEST_ID = 'block-item-wrapper';
const TOOLBAR_TEST_ID = 'block-item-wrapper-toolbar';
const FLYOUT_TEST_ID = 'block-item-wrapper-toolbar-flyout';
const MENU_ITEM_TEST_ID = 'menu-item';
const TOOLBAR_BUTTON_TEST_ID = 'block-item-wrapper-toolbar-btn';
const CHILD_TEST_ID = 'block-item-wrapper-child';

const OUTLINE_CLASSES = ['tw-outline', 'tw-outline-1', 'tw-outline-container-highlight-on-highlight-container'];

describe('Block Item Wrapper', () => {
    it('should render the wrapper and the children', () => {
        render(
            <BlockItemWrapper toolbarItems={[]}>
                <div data-test-id={CHILD_TEST_ID} className="tw-w-8 tw-h-8" />
            </BlockItemWrapper>,
        );

        expect(screen.getByTestId(BLOCK_ITEM_WRAPPER_TEST_ID)).toBeInTheDocument();
        expect(screen.getByTestId(CHILD_TEST_ID)).toBeInTheDocument();
    });

    it('should render the outline class', () => {
        render(
            <BlockItemWrapper toolbarItems={[]}>
                <div data-test-id={CHILD_TEST_ID} className="tw-w-8 tw-h-8" />
            </BlockItemWrapper>,
        );

        expect(screen.getByTestId(BLOCK_ITEM_WRAPPER_TEST_ID)).toHaveClass('hover:tw-outline');
    });

    it('should not render the wrapper if the hide prop is set', () => {
        render(
            <BlockItemWrapper toolbarItems={[]} shouldHideWrapper>
                <div data-test-id={CHILD_TEST_ID} className="tw-w-8 tw-h-8" />
            </BlockItemWrapper>,
        );

        expect(screen.queryByTestId(BLOCK_ITEM_WRAPPER_TEST_ID)).not.toBeInTheDocument();
    });

    it('should render the right amount of toolbar items', () => {
        render(
            <BlockItemWrapper
                toolbarItems={[
                    { type: 'button', icon: <IconMagnifier />, onClick: vi.fn(), tooltip: 'Test tooltip' },
                    { type: 'button', icon: <IconMagnifier />, onClick: vi.fn(), tooltip: 'Test tooltip' },
                ]}
            >
                <div data-test-id={CHILD_TEST_ID} className="tw-w-8 tw-h-8" />
            </BlockItemWrapper>,
        );

        expect(screen.getAllByTestId(TOOLBAR_BUTTON_TEST_ID)).toHaveLength(2);
    });

    it('should render the flyout button with the right amount of menu items', async () => {
        render(
            <BlockItemWrapper
                toolbarItems={[
                    { type: 'button', icon: <IconMagnifier />, onClick: vi.fn(), tooltip: 'Test tooltip' },
                    { type: 'button', icon: <IconMagnifier />, onClick: vi.fn(), tooltip: 'Test tooltip' },
                    {
                        type: 'menu',
                        items: [
                            [
                                {
                                    icon: <IconMagnifier />,
                                    onClick: vi.fn(),
                                    title: 'Test title',
                                },
                            ],
                            [
                                {
                                    icon: <IconMagnifier />,
                                    onClick: vi.fn(),
                                    title: 'Test title',
                                },
                                {
                                    icon: <IconMagnifier />,
                                    onClick: vi.fn(),
                                    title: 'Test title',
                                },
                            ],
                        ],
                    },
                ]}
            >
                <div data-test-id={CHILD_TEST_ID} className="tw-mt-8 tw-w-8 tw-h-8" />
            </BlockItemWrapper>,
        );

        expect(screen.getByTestId(FLYOUT_TEST_ID)).toBeInTheDocument();

        await userEvent.click(screen.getByTestId(FLYOUT_TEST_ID));

        expect(await screen.findAllByTestId(MENU_ITEM_TEST_ID)).toHaveLength(3);
    });

    it('should render the outline and the toolbar if it should be shown', () => {
        render(
            <BlockItemWrapper
                toolbarItems={[
                    { type: 'button', icon: <IconMagnifier />, onClick: vi.fn(), tooltip: 'Test tooltip' },
                    { type: 'button', icon: <IconMagnifier />, onClick: vi.fn(), tooltip: 'Test tooltip' },
                ]}
                shouldBeShown
            >
                <div data-test-id={CHILD_TEST_ID} className="tw-w-8 tw-h-8" />
            </BlockItemWrapper>,
        );

        expect(screen.getByTestId(CHILD_TEST_ID)).toBeInTheDocument();
        expect(screen.getByTestId(BLOCK_ITEM_WRAPPER_TEST_ID)).toHaveClass(...OUTLINE_CLASSES);
        expect(screen.getByTestId(TOOLBAR_TEST_ID).parentElement).toHaveClass('tw-opacity-100');
    });

    it('should not render the outline and should keep the toolbar hidden by default', () => {
        render(
            <BlockItemWrapper
                toolbarItems={[
                    { type: 'button', icon: <IconMagnifier />, onClick: vi.fn(), tooltip: 'Test tooltip' },
                    { type: 'button', icon: <IconMagnifier />, onClick: vi.fn(), tooltip: 'Test tooltip' },
                ]}
            >
                <div data-test-id={CHILD_TEST_ID} className="tw-w-8 tw-h-8" />
            </BlockItemWrapper>,
        );

        expect(screen.getByTestId(BLOCK_ITEM_WRAPPER_TEST_ID)).not.toHaveClass(...OUTLINE_CLASSES);
        expect(screen.getByTestId(TOOLBAR_TEST_ID).parentElement).toHaveClass('tw-opacity-0');
    });
});
