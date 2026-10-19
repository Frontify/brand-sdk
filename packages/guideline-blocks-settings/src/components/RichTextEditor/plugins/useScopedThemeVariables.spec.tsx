/* (c) Copyright Frontify Ltd., all rights reserved. */

import { render, screen } from '@testing-library/react';
import { type ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useScopedThemeVariables } from './useScopedThemeVariables';

const PRIMARY_BACKGROUND = '--f-theme-settings-button-primary-background-color';
const SECONDARY_COLOR = '--f-theme-settings-button-secondary-color';
const SCOPED_PRIMARY_BACKGROUND = 'rgb(255, 0, 0)';

const FloatingComponent = ({ isOpen }: { isOpen: boolean }): ReactElement => {
    const { anchorRef, themeVariables } = useScopedThemeVariables(isOpen);

    return (
        <>
            <span ref={anchorRef} data-test-id="anchor" style={{ display: 'none' }} />
            {isOpen ? createPortal(<div data-test-id="portaled" style={themeVariables} />, document.body) : null}
        </>
    );
};

describe('useScopedThemeVariables', () => {
    beforeEach(() => {
        // jsdom does not inherit custom properties, so resolve what a browser would at the anchor.
        const getComputedStyle = window.getComputedStyle.bind(window);
        vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
            const computedStyle = getComputedStyle(element);
            if (element.getAttribute('data-test-id') !== 'anchor') {
                return computedStyle;
            }
            return {
                ...computedStyle,
                getPropertyValue: (name: string) => (name === PRIMARY_BACKGROUND ? SCOPED_PRIMARY_BACKGROUND : ''),
            };
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('copies the theme variables resolved at the anchor onto the portaled element', () => {
        render(<FloatingComponent isOpen />);

        expect(screen.getByTestId('portaled').style.getPropertyValue(PRIMARY_BACKGROUND)).toBe(
            SCOPED_PRIMARY_BACKGROUND,
        );
    });

    it('reads the theme variables once the modal opens', () => {
        const { rerender } = render(<FloatingComponent isOpen={false} />);

        rerender(<FloatingComponent isOpen />);

        expect(screen.getByTestId('portaled').style.getPropertyValue(PRIMARY_BACKGROUND)).toBe(
            SCOPED_PRIMARY_BACKGROUND,
        );
    });

    it('leaves out theme variables that are not set at the anchor', () => {
        render(<FloatingComponent isOpen />);

        expect(screen.getByTestId('portaled').style.getPropertyValue(SECONDARY_COLOR)).toBe('');
    });
});
