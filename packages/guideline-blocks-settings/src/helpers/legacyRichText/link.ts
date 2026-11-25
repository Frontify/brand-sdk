/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type LinkAppearance, type LinkValue } from './types';

const LINK_VALUE_KEYS = ['href', 'openInNewTab', 'appearance'];
const NEW_TAB_TARGET = '_blank';
const SAME_TAB_TARGET = '_self';
const NEW_TAB_TARGETS = [NEW_TAB_TARGET, '_new'];
const MAX_HREF_LENGTH = 2048;
const ALLOWED_SCHEMES = ['http', 'https', 'mailto', 'tel'];
const CREDENTIAL_SCHEMES = ['http', 'https'];
const SCHEME_PATTERN = /^([^/?#:]*):/;
const NETWORK_PATH_PATTERN = /^[/\\]{2,}([^/\\?#]*)/;
const AUTHORITY_PATTERN = /^[^:]*:[/\\]*([^/\\?#]*)/;
const CREDENTIALS_SEPARATOR = '@';
const LAST_C0_CONTROL = 0x1f;
const FIRST_C1_CONTROL = 0x80;
const LAST_C1_CONTROL = 0x9f;

type ButtonLinkValue = Extract<LinkValue, { appearance: unknown }>;

/** What a link of the new format carries, in the shape both directions work with. */
export type LinkParts = { href: string; openInNewTab: boolean; appearance: LinkAppearance | undefined };

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

/** Writes the legacy `buttonStyle` of an appearance, or the value unchanged when the table has no entry for it. */
export const writeButtonStyle = (appearance: unknown): unknown => {
    for (const buttonStyle of Object.keys(APPEARANCE_BY_BUTTON_STYLE)) {
        if (isButtonStyle(buttonStyle) && APPEARANCE_BY_BUTTON_STYLE[buttonStyle] === appearance) {
            return buttonStyle;
        }
    }

    return appearance;
};

/** Builds the new format's link value; it stores `openInNewTab` only when set. */
export const createLinkValue = (parts: LinkParts): LinkValue => {
    const { href, openInNewTab, appearance } = parts;

    if (appearance === undefined) {
        const link: LinkValue = { href };
        if (openInNewTab) {
            link.openInNewTab = true;
        }

        return link;
    }

    const link: ButtonLinkValue = { href, appearance };
    if (openInNewTab) {
        link.openInNewTab = true;
    }

    return link;
};

/** Reads a legacy `target`: `_blank` and `_new` open a new tab, every other value and a missing one the same tab. */
export const readsAsNewTab = (target: unknown): boolean => {
    return typeof target === 'string' && NEW_TAB_TARGETS.includes(target);
};

/** Writes the legacy `target`, which the legacy editor always stores. */
export const writeTarget = (openInNewTab: boolean): string => {
    if (openInNewTab) {
        return NEW_TAB_TARGET;
    }

    return SAME_TAB_TARGET;
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

// URL.canParse is newer than the ES2021 target, so credentials are read from the authority; special schemes ignore the slashes.
const isCredentialFree = (authority: RegExpExecArray | null): boolean => {
    if (authority === null) {
        return true;
    }

    return !authority[1].includes(CREDENTIALS_SEPARATOR);
};

/** Accepts a non-empty relative reference or an http, https, mailto or tel link, without control characters or credentials. */
export const isSafeHref = (href: unknown): href is string => {
    if (typeof href !== 'string' || href === '' || href.length > MAX_HREF_LENGTH || hasControlCharacter(href)) {
        return false;
    }

    const scheme = readScheme(href);
    if (scheme === null) {
        // Browsers read two or more slashes of either kind as a network path, which can carry credentials too.
        return isCredentialFree(NETWORK_PATH_PATTERN.exec(href));
    }

    if (!ALLOWED_SCHEMES.includes(scheme)) {
        return false;
    }

    if (CREDENTIAL_SCHEMES.includes(scheme)) {
        return isCredentialFree(AUTHORITY_PATTERN.exec(href));
    }

    return true;
};

/** Reads a stored link value back into its parts, or returns null when it holds anything the new format does not declare. */
export const readLinkValue = (value: unknown): LinkParts | null => {
    if (typeof value !== 'object' || value === null) {
        return null;
    }

    if (Object.keys(value).some((key) => !LINK_VALUE_KEYS.includes(key))) {
        return null;
    }

    const href: unknown = Reflect.get(value, 'href');
    const openInNewTab: unknown = Reflect.get(value, 'openInNewTab');
    const appearance: unknown = Reflect.get(value, 'appearance');
    if (!isSafeHref(href) || (openInNewTab !== undefined && openInNewTab !== true)) {
        return null;
    }

    if (appearance === undefined) {
        return { href, openInNewTab: openInNewTab === true, appearance: undefined };
    }

    const buttonAppearance = readButtonAppearance(appearance);
    if (buttonAppearance === undefined) {
        return null;
    }

    return { href, openInNewTab: openInNewTab === true, appearance: buttonAppearance };
};

/** Reads `chosenLink.searchResult.link` of a legacy link, or undefined when the chosen link has none. */
export const readSearchResultLink = (chosenLink: object): unknown => {
    if (!('searchResult' in chosenLink)) {
        return undefined;
    }

    const { searchResult } = chosenLink;
    if (typeof searchResult !== 'object' || searchResult === null || !('link' in searchResult)) {
        return undefined;
    }

    return searchResult.link;
};
