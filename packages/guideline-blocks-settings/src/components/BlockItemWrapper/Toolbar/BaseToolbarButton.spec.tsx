/* (c) Copyright Frontify Ltd., all rights reserved. */

import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BaseToolbarButton } from './BaseToolbarButton';

const BUTTON_ID = 'base-toolbar-button';

describe('BaseToolbarButton', () => {
    it('should call onClick', async () => {
        const onClickStub = vi.fn();
        const { getByTestId } = render(<BaseToolbarButton onClick={onClickStub}>Button</BaseToolbarButton>);

        await fireEvent.click(getByTestId(BUTTON_ID));

        expect(onClickStub).toHaveBeenCalledOnce();
    });

    it('should apply cursor styles', async () => {
        const { getByTestId } = render(<BaseToolbarButton cursor="grab">Button</BaseToolbarButton>);

        expect(getByTestId(BUTTON_ID)).toHaveClass('!tw-cursor-grab');
    });

    it('should apply active styles', async () => {
        const { getByTestId } = render(<BaseToolbarButton forceActiveStyle>Button</BaseToolbarButton>);

        expect(getByTestId(BUTTON_ID)).toHaveClass('tw-text-box-neutral-inverse-pressed');
    });

    it('should forward other attributes to button', async () => {
        const BUTTON_TYPE = 'base';
        const { getByTestId } = render(<BaseToolbarButton data-button-type={BUTTON_TYPE}>Button</BaseToolbarButton>);

        expect(getByTestId(BUTTON_ID).dataset.buttonType).toEqual(BUTTON_TYPE);
    });
});
