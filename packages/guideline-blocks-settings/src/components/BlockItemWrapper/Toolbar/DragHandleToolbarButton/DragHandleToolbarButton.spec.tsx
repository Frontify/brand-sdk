/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconAdobeCreativeCloud } from '@frontify/fondue/icons';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DragPreviewContextProvider } from '../context/DragPreviewContext';

import { DragHandleToolbarButton } from './DragHandleToolbarButton';

const TOOLBAR_BUTTON_ID = 'block-item-wrapper-toolbar-btn';
const TOOLTIP_ID = 'fondue-tooltip-content';

const TOOLTIP_CONTENT = 'content';

vi.mock('@dnd-kit/core', () => ({
    useDndContext: vi.fn(() => ({ activatorEvent: null })),
}));

/**
 * @vitest-environment happy-dom
 */

describe('DragHandleToolbarButton', () => {
    it('should show tooltip and activeStyles when item is in keyboard drag preview context', async () => {
        const { useDndContext } = await import('@dnd-kit/core');
        vi.mocked(useDndContext).mockReturnValue({
            activatorEvent: new KeyboardEvent('keydown'),
        } as unknown as ReturnType<typeof useDndContext>);

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

    it('should not force tooltip open when item is in pointer drag preview context', async () => {
        const { useDndContext } = await import('@dnd-kit/core');
        vi.mocked(useDndContext).mockReturnValue({
            activatorEvent: new PointerEvent('pointerdown'),
        } as unknown as ReturnType<typeof useDndContext>);

        const { queryByTestId, getByTestId } = render(
            <DragPreviewContextProvider isDragPreview>
                <DragHandleToolbarButton
                    tooltip={TOOLTIP_CONTENT}
                    icon={<IconAdobeCreativeCloud />}
                    draggableProps={{}}
                />
            </DragPreviewContextProvider>,
        );

        expect(queryByTestId(TOOLTIP_ID)).not.toBeInTheDocument();
        expect(getByTestId(TOOLBAR_BUTTON_ID)).toHaveClass('tw-cursor-grabbing');
    });

    it('should show tooltip when item is focused', async () => {
        const { getByTestId } = render(
            <DragHandleToolbarButton tooltip={TOOLTIP_CONTENT} icon={<IconAdobeCreativeCloud />} draggableProps={{}} />,
        );

        getByTestId(TOOLBAR_BUTTON_ID).focus();

        await waitFor(() => {
            expect(getByTestId(TOOLTIP_ID)).toBeInTheDocument();
            expect(getByTestId(TOOLTIP_ID)).toHaveTextContent(TOOLTIP_CONTENT);
        });
    });

    it('should forward draggableProps', () => {
        const onDragStub = vi.fn();

        const { getByTestId } = render(
            <DragHandleToolbarButton
                tooltip={TOOLTIP_CONTENT}
                icon={<IconAdobeCreativeCloud />}
                draggableProps={{ onDrag: onDragStub }}
            />,
        );

        fireEvent.drag(getByTestId(TOOLBAR_BUTTON_ID));

        expect(onDragStub).toHaveBeenCalledOnce();
    });

    it('should forward setActivatorNodeRef', () => {
        const setActivatorNodeRefStub = vi.fn();

        render(
            <DragHandleToolbarButton
                tooltip={TOOLTIP_CONTENT}
                icon={<IconAdobeCreativeCloud />}
                draggableProps={{}}
                setActivatorNodeRef={setActivatorNodeRefStub}
            />,
        );

        expect(setActivatorNodeRefStub).toHaveBeenCalled();
    });
});
