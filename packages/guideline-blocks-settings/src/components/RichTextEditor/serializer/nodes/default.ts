/* (c) Copyright Frontify Ltd., all rights reserved. */

import { TElement } from '@udecode/plate';
import { CSSProperties } from 'react';
import { TextStyles } from '../../plugins';
import { reactCssPropsToCss } from '../utlis/reactCssPropsToCss';
import { merge } from '@frontify/fondue';

export const defaultNode = (node: TElement, children: string, styles: CSSProperties, defaultClassNames: string) => {
    const defaultStyles = reactCssPropsToCss(styles);

    if (node.type === TextStyles.heading1) {
        return `<h1 class="${merge([defaultClassNames, 'a-h1'])}">${getStyledChild(children, defaultStyles)}</h1>`;
    }
    if (node.type === TextStyles.heading2) {
        return `<h2 class="${defaultClassNames}">${getStyledChild(children, defaultStyles)}</h2>`;
    }
    if (node.type === TextStyles.heading3) {
        return `<h3 class="${defaultClassNames}">${getStyledChild(children, defaultStyles)}</h3>`;
    }
    if (node.type === TextStyles.heading4) {
        return `<h4 class="${defaultClassNames}">${getStyledChild(children, defaultStyles)}</h4>`;
    }
    if (node.type === TextStyles.custom1) {
        return `<p class="${merge([defaultClassNames, 'a-custom1'])}">${getStyledChild(children, defaultStyles)}</p>`;
    }
    if (node.type === TextStyles.custom2) {
        return `<p class="${merge([defaultClassNames, 'a-custom2'])}">${getStyledChild(children, defaultStyles)}</p>`;
    }
    if (node.type === TextStyles.custom3) {
        return `<p class="${merge([defaultClassNames, 'a-custom3'])}">${getStyledChild(children, defaultStyles)}</p>`;
    }
    if (node.type === TextStyles.quote) {
        return `<p class="${merge([defaultClassNames, 'a-quote'])}">${getStyledChild(children, defaultStyles)}</p>`;
    }
    if (node.type === TextStyles.imageTitle) {
        return `<p class="${merge([defaultClassNames, 'a-image-title'])}">${getStyledChild(
            children,
            defaultStyles
        )}</p>`;
    }
    if (node.type === TextStyles.imageCaption) {
        return `<p class="${merge([defaultClassNames, 'a-image-caption'])}">${getStyledChild(
            children,
            defaultStyles
        )}</p>`;
    }

    return `<p class="${defaultClassNames}">${getStyledChild(children, defaultStyles)}</p>`;
};

const getStyledChild = (children: string, styles: string) => `<span style="${styles}">${children}</span>`;
