/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ComponentPropsWithoutRef, type CSSProperties, forwardRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';

import { THEME_PREFIX } from '../constants';

/**
 * Collects the theme variables declared on the element itself or on one of its ancestors,
 * nearest declaration first, which is how the cascade resolves them for the element.
 */
const readScopedThemeVariables = (anchor: HTMLElement): CSSProperties => {
    const variables: Record<string, string> = {};

    for (let element = anchor as HTMLElement | null; element; element = element.parentElement) {
        const { style } = element;
        for (let index = 0; index < style.length; index++) {
            const name = style.item(index);
            if (name.startsWith(THEME_PREFIX) && !(name in variables)) {
                variables[name] = style.getPropertyValue(name);
            }
        }
    }

    return variables;
};

/**
 * Renders its children in a portal on `document.body`, carrying along the theme variables that a
 * scope around the editor declares (e.g. a section's color scheme). Without them the portaled
 * element would resolve the default scheme's variables, because it is no longer a descendant of
 * that scope. The variables are read when the portal mounts, so a portal that is mounted only
 * while it is visible picks up the current scope every time.
 */
export const ScopedThemePortal = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
    ({ children, style, ...props }, ref) => {
        const [themeVariables, setThemeVariables] = useState<CSSProperties>();

        const setAnchor = useCallback((anchor: HTMLElement | null) => {
            if (anchor) {
                setThemeVariables(readScopedThemeVariables(anchor));
            }
        }, []);

        return (
            <>
                <span ref={setAnchor} style={{ display: 'none' }} />
                {themeVariables &&
                    createPortal(
                        <div {...props} ref={ref} style={{ ...themeVariables, ...style }}>
                            {children}
                        </div>,
                        document.body,
                    )}
            </>
        );
    },
);

ScopedThemePortal.displayName = 'ScopedThemePortal';
