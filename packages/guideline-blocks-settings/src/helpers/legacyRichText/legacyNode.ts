/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type LegacyElement, type LegacyText } from './types';

export const isLegacyText = (value: unknown): value is LegacyText => {
    return typeof value === 'object' && value !== null && 'text' in value && typeof value.text === 'string';
};

export const isLegacyElement = (value: unknown): value is LegacyElement => {
    return (
        typeof value === 'object' &&
        value !== null &&
        'type' in value &&
        typeof value.type === 'string' &&
        'children' in value &&
        Array.isArray(value.children)
    );
};
