/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconAdobeCreativeCloud } from '@frontify/fondue';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DragPreviewContextProvider } from '../context/DragPreviewContext';

import { ToolbarButton } from './ToolbarButton';

const TOOLBAR_BUTTON_ID = 'block-item-wrapper-toolbar-btn';
const TOOLTIP_ID = 'fondue-tooltip-content';

const TOOLTIP_CONTENT = 'content';

/**
 * @vitest-environment happy-dom
 */

describe('ToolbarButton', () => {
    it('should disable tooltip when item is in drag preview context', async () => {
        const { getByTestId } = render(
            <DragPreviewContextProvider isDragPreview>
                <ToolbarButton onClick={vi.fn()} tooltip={TOOLTIP_CONTENT} icon={<IconAdobeCreativeCloud />} />
            </DragPreviewContextProvider>,
        );

        expect(getByTestId(TOOLTIP_ID)).toHaveClass('tw-opacity-0');

        getByTestId(TOOLTIP_ID).focus();

        await waitFor(() => {
            expect(getByTestId(TOOLTIP_ID)).toHaveClass('tw-opacity-0');
        });
    });

    it('should show tooltip when item is focused', async () => {
        const { getByTestId } = render(
            <ToolbarButton onClick={vi.fn()} tooltip={TOOLTIP_CONTENT} icon={<IconAdobeCreativeCloud />} />,
        );

        expect(getByTestId(TOOLTIP_ID)).toHaveClass('tw-opacity-0');
        expect(getByTestId(TOOLTIP_ID)).toHaveTextContent(TOOLTIP_CONTENT);

        getByTestId(TOOLTIP_ID).focus();

        await waitFor(() => {
            expect(getByTestId(TOOLTIP_ID)).not.toHaveClass('tw-opacity-0');
        });
    });

    it('should trigger onClick', async () => {
        const onClickStub = vi.fn();
        const { getByTestId } = render(
            <ToolbarButton onClick={onClickStub} tooltip={TOOLTIP_CONTENT} icon={<IconAdobeCreativeCloud />} />,
        );

        await fireEvent.click(getByTestId(TOOLBAR_BUTTON_ID));

        expect(onClickStub).toHaveBeenCalledOnce();
    });

    it('should display icon', async () => {
        const { getByTestId } = render(
            <ToolbarButton onClick={vi.fn()} tooltip={TOOLTIP_CONTENT} icon={<IconAdobeCreativeCloud />} />,
        );

        const icons = [...getByTestId(TOOLBAR_BUTTON_ID).getElementsByTagName('svg')];
        expect(icons).toHaveLength(1);
        expect(icons[0].outerHTML).toMatch('IconAdobeCreativeCloud');
    });
});
