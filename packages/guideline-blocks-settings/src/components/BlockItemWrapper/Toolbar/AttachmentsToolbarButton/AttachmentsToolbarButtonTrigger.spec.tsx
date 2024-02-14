/* (c) Copyright Frontify Ltd., all rights reserved. */

import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AttachmentsToolbarButtonTrigger } from './AttachmentsToolbarButtonTrigger';
import { MutableRefObject } from 'react';

const BUTTON_ID = 'attachments-toolbar-button-trigger';

describe('AttachmentsToolbarButtonTrigger', () => {
    afterEach(() => {
        cleanup();
    });
    it('should apply active styles when flyout is open', async () => {
        const { getByTestId } = render(
            <AttachmentsToolbarButtonTrigger
                isFlyoutOpen
                triggerProps={{}}
                triggerRef={{} as MutableRefObject<HTMLButtonElement>}
            >
                Button
            </AttachmentsToolbarButtonTrigger>,
        );

        expect(getByTestId(BUTTON_ID)).toHaveClass('tw-text-box-neutral-inverse-pressed');
    });
    it('should forward trigger props to button', async () => {
        const onPointerUpStub = vi.fn();

        const { getByTestId } = render(
            <AttachmentsToolbarButtonTrigger
                isFlyoutOpen={false}
                triggerProps={{ onPointerUp: onPointerUpStub }}
                triggerRef={{} as MutableRefObject<HTMLButtonElement>}
            >
                Button
            </AttachmentsToolbarButtonTrigger>,
        );
        await fireEvent.pointerUp(getByTestId(BUTTON_ID));
        expect(onPointerUpStub).toHaveBeenCalledOnce();
    });
});
