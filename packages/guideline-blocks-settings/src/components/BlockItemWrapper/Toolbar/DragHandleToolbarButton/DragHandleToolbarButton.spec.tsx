/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconAdobeCreativeCloud } from '@frontify/fondue';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DragPreviewContextProvider } from '../context/DragPreviewContext';

import { DragHandleToolbarButton } from './DragHandleToolbarButton';

const TOOLBAR_BUTTON_ID = 'block-item-wrapper-toolbar-btn';
const TOOLTIP_ID = 'fondue-tooltip-content';

const TOOLTIP_CONTENT = 'content';

/**
 * @vitest-environment happy-dom
 */

describe('DragHandleToolbarButton', () => {
    it('should show tooltip and activeStyles when item is in drag preview context', async () => {
        const { getByTestId } = render(
            <DragPreviewContextProvider isDragPreview>
                <DragHandleToolbarButton
                    tooltip={TOOLTIP_CONTENT}
                    icon={<IconAdobeCreativeCloud />}
                    draggableProps={{}}
                />
            </DragPreviewContextProvider>,
        );

        expect(getByTestId(TOOLTIP_ID)).not.toHaveClass('tw-opacity-0');
        expect(getByTestId(TOOLBAR_BUTTON_ID)).toHaveClass('tw-cursor-grabbing');
    });

    it('should show tooltip when item is focused', async () => {
        const { getByTestId } = render(
            <DragHandleToolbarButton tooltip={TOOLTIP_CONTENT} icon={<IconAdobeCreativeCloud />} draggableProps={{}} />,
        );

        expect(getByTestId(TOOLTIP_ID)).toHaveClass('tw-opacity-0');
        expect(getByTestId(TOOLTIP_ID)).toHaveTextContent(TOOLTIP_CONTENT);

        getByTestId(TOOLBAR_BUTTON_ID).focus();

        await waitFor(() => {
            expect(getByTestId(TOOLTIP_ID)).not.toHaveClass('tw-opacity-0');
        });
    });

    it('should forward draggableProps', async () => {
        const onDragStub = vi.fn();

        const { getByTestId } = render(
            <DragHandleToolbarButton
                tooltip={TOOLTIP_CONTENT}
                icon={<IconAdobeCreativeCloud />}
                draggableProps={{ onDrag: onDragStub }}
            />,
        );

        await fireEvent.drag(getByTestId(TOOLBAR_BUTTON_ID));

        expect(onDragStub).toHaveBeenCalledOnce();
    });

    it('should forward setActivatorNodeRef', async () => {
        const setActivatorNodeRefStub = vi.fn();

        render(
            <DragHandleToolbarButton
                tooltip={TOOLTIP_CONTENT}
                icon={<IconAdobeCreativeCloud />}
                draggableProps={{}}
                setActivatorNodeRef={setActivatorNodeRefStub}
            />,
        );

        expect(setActivatorNodeRefStub).toHaveBeenCalledOnce();
    });

    it('should display icon', async () => {
        const { getByTestId } = render(
            <DragHandleToolbarButton tooltip={TOOLTIP_CONTENT} icon={<IconAdobeCreativeCloud />} draggableProps={{}} />,
        );

        const icons = [...getByTestId(TOOLBAR_BUTTON_ID).getElementsByTagName('svg')];
        expect(icons).toHaveLength(1);
        expect(icons[0].outerHTML).toMatch('IconAdobeCreativeCloud');
    });
});
