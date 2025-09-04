/* (c) Copyright Frontify Ltd., all rights reserved. */

import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AttachmentsToolbarButtonTrigger } from './AttachmentsToolbarButtonTrigger';

const BUTTON_ID = 'attachments-toolbar-button-trigger';

describe('AttachmentsToolbarButtonTrigger', () => {
    afterEach(() => {
        cleanup();
    });

    it('should apply active styles when flyout is open', () => {
        const { getByTestId } = render(
            <AttachmentsToolbarButtonTrigger isFlyoutOpen>Button</AttachmentsToolbarButtonTrigger>,
        );

        expect(getByTestId(BUTTON_ID)).toHaveClass('tw-text-box-neutral-inverse-pressed');
    });
    it('should forward trigger props to button', () => {
        const onPointerUpStub = vi.fn();

        const forwardedProps = {
            onPointerUp: onPointerUpStub,
        };

        const { getByTestId } = render(
            <AttachmentsToolbarButtonTrigger isFlyoutOpen={false} {...forwardedProps}>
                Button
            </AttachmentsToolbarButtonTrigger>,
        );
        fireEvent.pointerUp(getByTestId(BUTTON_ID));

        expect(onPointerUpStub).toHaveBeenCalledOnce();
    });
});
