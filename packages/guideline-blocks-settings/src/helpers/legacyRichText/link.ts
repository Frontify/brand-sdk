/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type LinkAppearance } from './types';

const NEW_TAB_TARGETS = ['_blank', '_new'];
const MAX_HREF_LENGTH = 2048;
const ALLOWED_SCHEMES = ['http', 'https', 'mailto', 'tel'];
const CREDENTIAL_SCHEMES = ['http', 'https'];
const SCHEME_PATTERN = /^([^/?#:]*):/;
const LAST_C0_CONTROL = 0x1f;
const FIRST_C1_CONTROL = 0x80;
const LAST_C1_CONTROL = 0x9f;

const APPEARANCE_BY_BUTTON_STYLE: Record<LinkAppearance, LinkAppearance> = {
    primary: 'primary',
    secondary: 'secondary',
    tertiary: 'tertiary',
};

const isButtonStyle = (value: string): value is LinkAppearance => {
    return Object.keys(APPEARANCE_BY_BUTTON_STYLE).includes(value);
};

/** Reads a legacy `buttonStyle`, or undefined when it is not one of the three the new format has. */
export const readButtonAppearance = (value: unknown): LinkAppearance | undefined => {
    if (typeof value !== 'string' || !isButtonStyle(value)) {
        return undefined;
    }

    return APPEARANCE_BY_BUTTON_STYLE[value];
};

/** Reads a legacy `target`: `_blank` and `_new` open a new tab, every other value and a missing one the same tab. */
export const readsAsNewTab = (target: unknown): boolean => {
    return typeof target === 'string' && NEW_TAB_TARGETS.includes(target);
};

const hasControlCharacter = (href: string): boolean => {
    for (let index = 0; index < href.length; index++) {
        const code = href.charCodeAt(index);
        if (code <= LAST_C0_CONTROL || (code >= FIRST_C1_CONTROL && code <= LAST_C1_CONTROL)) {
            return true;
        }
    }

    return false;
};

const readScheme = (href: string): string | null => {
    const match = SCHEME_PATTERN.exec(href);
    if (match === null) {
        return null;
    }

    return match[1].toLowerCase();
};

const isCredentialFree = (href: string): boolean => {
    if (!URL.canParse(href)) {
        return false;
    }

    const { username, password } = new URL(href);
    return username === '' && password === '';
};

/** Accepts a non-empty relative reference or an http, https, mailto or tel link, without control characters or credentials. */
export const isSafeHref = (href: unknown): href is string => {
    if (typeof href !== 'string' || href === '' || href.length > MAX_HREF_LENGTH || hasControlCharacter(href)) {
        return false;
    }

    const scheme = readScheme(href);
    if (scheme === null) {
        return true;
    }

    if (!ALLOWED_SCHEMES.includes(scheme)) {
        return false;
    }

    if (CREDENTIAL_SCHEMES.includes(scheme)) {
        return isCredentialFree(href);
    }

    return true;
};
