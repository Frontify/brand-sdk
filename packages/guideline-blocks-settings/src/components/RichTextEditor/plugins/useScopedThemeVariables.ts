/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type CSSProperties, useMemo, useState } from 'react';

import { BlockStyles } from './styles';

const THEME_VARIABLE_PATTERN = /var\((--f-theme-settings-[\w-]+)\)/g;

const collectThemeVariableNames = (): string[] => {
    const names = new Set<string>();
    const styles = Object.values(BlockStyles).flatMap((style) => [style, style.hover ?? {}]);

    for (const style of styles) {
        for (const value of Object.values(style)) {
            if (typeof value !== 'string') {
                continue;
            }
            for (const match of value.matchAll(THEME_VARIABLE_PATTERN)) {
                names.add(match[1]);
            }
        }
    }

    return [...names];
};

// Collected lazily: `styles.ts` and the plugins importing this hook depend on each other.
let themeVariableNames: string[] | undefined;

const readThemeVariables = (element: Element): CSSProperties => {
    themeVariableNames ??= collectThemeVariableNames();
    const computedStyle = getComputedStyle(element);
    const variables: Record<string, string> = {};

    for (const name of themeVariableNames) {
        const value = computedStyle.getPropertyValue(name).trim();
        if (value) {
            variables[name] = value;
        }
    }

    return variables;
};

/**
 * Floating modals are portaled to `document.body`, which detaches them from theme variables
 * scoped to an ancestor of the editor (e.g. a section's color scheme). Render `anchorRef` on a non-displayed
 * element inside the editor tree and spread `themeVariables` onto the portaled wrapper so the
 * modal resolves the same theme variables as the editor.
 */
export const useScopedThemeVariables = (
    isOpen: boolean,
): { anchorRef: (element: HTMLElement | null) => void; themeVariables: CSSProperties } => {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);

    const themeVariables = useMemo(() => {
        if (!isOpen || !anchor) {
            return {};
        }
        return readThemeVariables(anchor);
    }, [isOpen, anchor]);

    return { anchorRef: setAnchor, themeVariables };
};
