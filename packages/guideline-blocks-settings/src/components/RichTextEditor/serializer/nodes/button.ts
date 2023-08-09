/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { CSSProperties } from 'react';
import { TElement } from '@udecode/plate';

import { reactCssPropsToCss } from '../utlis/reactCssPropsToCss';
import { BUTTON_PLUGIN } from '../../plugins';

export type ButtonStylesType = Record<string, Record<string, CSSProperties & { hover?: CSSProperties }>>;

export const buttonNode = (node: TElement, children: string, defaultClassNames: string, styles: ButtonStylesType) => {
    const buttonStyles = styles[BUTTON_PLUGIN];
    const buttonTypeString = (node.buttonStyle as string) ?? 'primary';
    const buttonType = `button${buttonTypeString.charAt(0).toUpperCase()}${buttonTypeString.slice(1)}`;
    const buttonStyle = buttonStyles[buttonType];

    const defaultStyles = reactCssPropsToCss(buttonStyle);

    return `<a href="${node.url}"
                target="${node.target ?? '_blank'}"
                dir="auto"
                style="${defaultStyles}"
                class="${defaultClassNames}"
                onmouseenter="this.setAttribute('style', '${defaultStyles} ${reactCssPropsToCss(buttonStyle?.hover)}');"
                onmouseleave="this.setAttribute('style', '${reactCssPropsToCss(buttonStyle)}');"
                >${children}</a>`;
};
