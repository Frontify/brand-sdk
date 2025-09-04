/* (c) Copyright Frontify Ltd., all rights reserved. */

import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BaseToolbarButton } from './BaseToolbarButton';

const BUTTON_ID = 'base-toolbar-button';

describe('BaseToolbarButton', () => {
    afterEach(() => {
        cleanup();
    });
    it('should call onClick', () => {
        const onClickStub = vi.fn();
        const { getByTestId } = render(<BaseToolbarButton onClick={onClickStub}>Button</BaseToolbarButton>);

        fireEvent.click(getByTestId(BUTTON_ID));

        expect(onClickStub).toHaveBeenCalledOnce();
    });

    it('should apply cursor styles', () => {
        const { getByTestId } = render(<BaseToolbarButton cursor="grab">Button</BaseToolbarButton>);

        expect(getByTestId(BUTTON_ID)).toHaveClass('!tw-cursor-grab');
    });

    it('should apply active styles', () => {
        const { getByTestId } = render(<BaseToolbarButton forceActiveStyle>Button</BaseToolbarButton>);

        expect(getByTestId(BUTTON_ID)).toHaveClass('tw-text-box-neutral-inverse-pressed');
    });

    it('should forward other attributes to button', () => {
        const BUTTON_TYPE = 'base';
        const { getByTestId } = render(<BaseToolbarButton data-button-type={BUTTON_TYPE}>Button</BaseToolbarButton>);

        expect(getByTestId(BUTTON_ID).dataset.buttonType).toEqual(BUTTON_TYPE);
    });
});
