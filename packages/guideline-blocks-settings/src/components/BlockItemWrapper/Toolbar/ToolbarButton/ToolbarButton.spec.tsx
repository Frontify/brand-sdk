/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconAdobeCreativeCloud } from '@frontify/fondue/icons';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DragPreviewContextProvider } from '../context/DragPreviewContext';

import { ToolbarButton } from './ToolbarButton';

const TOOLBAR_BUTTON_ID = 'block-item-wrapper-toolbar-btn';
const TOOLTIP_CONTENT = 'fondue-tooltip-content';

/**
 * @vitest-environment happy-dom
 */

describe('ToolbarButton', () => {
    it('should disable tooltip when item is in drag preview context', () => {
        const { queryByTestId } = render(
            <DragPreviewContextProvider isDragPreview>
                <ToolbarButton onClick={vi.fn()} icon={<IconAdobeCreativeCloud size="16" />} />
            </DragPreviewContextProvider>,
        );

        expect(queryByTestId(TOOLTIP_CONTENT)).toBeNull();
    });

    it('should show tooltip when item is focused', async () => {
        const { getByTestId } = render(<ToolbarButton onClick={vi.fn()} icon={<IconAdobeCreativeCloud size="16" />} />);

        fireEvent.focus(getByTestId(TOOLBAR_BUTTON_ID));

        await waitFor(() => {
            expect(getByTestId(TOOLTIP_CONTENT)).toBeInTheDocument();
        });
    });

    it('should trigger onClick', () => {
        const onClickStub = vi.fn();
        const { getByTestId } = render(
            <ToolbarButton onClick={onClickStub} icon={<IconAdobeCreativeCloud size="16" />} />,
        );

        fireEvent.click(getByTestId(TOOLBAR_BUTTON_ID));

        expect(onClickStub).toHaveBeenCalledOnce();
    });

    it('should display icon', () => {
        const { getByTestId } = render(<ToolbarButton onClick={vi.fn()} icon={<IconAdobeCreativeCloud size="16" />} />);

        const icons = [...getByTestId(TOOLBAR_BUTTON_ID).getElementsByTagName('svg')];
        expect(icons).toHaveLength(1);
        expect(icons[0].outerHTML).toMatch('IconAdobeCreativeCloud');
    });
});
