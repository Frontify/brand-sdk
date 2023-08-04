/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { CSSProperties } from 'react';

export const reactCssPropsToCss = (props?: CSSProperties): string => {
    if (!props) {
        return '';
    }

    return Object.keys(props)
        .reduce<string>((acc, key) => {
            const value = props[key as keyof CSSProperties];
            return value ? `${acc}${convertCamelCaseToKebabCase(key)}: ${value}; ` : acc;
        }, '')
        .trim()
        .replaceAll('"', "'");
};

const convertCamelCaseToKebabCase = (str: string): string => {
    return str.replaceAll(/([A-Z])/g, '-$1').toLowerCase();
};
