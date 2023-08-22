/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { CSSProperties } from 'react';
import escapeHtml from 'escape-html';
import { TElement } from '@udecode/plate';

import { LINK_PLUGIN } from '../../plugins/LinkPlugin/id';
import { TLinkElement } from '../../plugins/LinkPlugin/types';
import { reactCssPropsToCss } from '../utlis/reactCssPropsToCss';

export const linkNode = (
    node: TElement,
    children: string,
    defaultClassNames: string,
    styles: Record<string, CSSProperties & { hover?: CSSProperties }>,
) => {
    if (node.chosenLink) {
        const { chosenLink } = node as TLinkElement;
        return `<a dir="auto" class="${defaultClassNames}" style="${reactCssPropsToCss(styles[LINK_PLUGIN])}" target=${
            chosenLink?.openInNewTab ? '_blank' : '_self'
        } href="${escapeHtml(chosenLink?.searchResult?.link)}">${children}</a>`;
    }
    return `<a dir="auto" class="${defaultClassNames}" style="${reactCssPropsToCss(styles[LINK_PLUGIN])}" target="${
        node?.target ?? '_blank'
    }" href="${escapeHtml(node.url as string)}">${children}</a>`;
};
