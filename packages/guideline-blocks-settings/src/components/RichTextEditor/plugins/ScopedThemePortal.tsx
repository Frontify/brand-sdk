/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type ComponentPropsWithoutRef,
    type CSSProperties,
    forwardRef,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
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
 *
 * The portaled element is rendered right away, in the same commit as the component, so callers
 * that position it in an effect on open (e.g. the link plugin's floating modal) find it attached.
 * The variables follow in a layout effect, which re-renders before the browser paints.
 */
export const ScopedThemePortal = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
    ({ children, style, ...props }, ref) => {
        const anchorRef = useRef<HTMLSpanElement>(null);
        const [themeVariables, setThemeVariables] = useState<CSSProperties>();

        useLayoutEffect(() => {
            if (anchorRef.current) {
                setThemeVariables(readScopedThemeVariables(anchorRef.current));
            }
        }, []);

        return (
            <>
                <span ref={anchorRef} style={{ display: 'none' }} />
                {createPortal(
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
