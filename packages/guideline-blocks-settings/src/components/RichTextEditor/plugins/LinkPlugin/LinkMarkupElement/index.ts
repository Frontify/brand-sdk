/* (c) Copyright Frontify Ltd., all rights reserved. */

import { ELEMENT_LINK, MarkupElement, type PlateRenderElementProps } from '@frontify/fondue/rte';

import { LinkMarkupElementNode, type TLinkElement } from './LinkMarkupElementNode';

export class LinkMarkupElement extends MarkupElement {
    constructor(
        id = ELEMENT_LINK,
        node: (props: PlateRenderElementProps & { element: TLinkElement }) => JSX.Element = LinkMarkupElementNode,
    ) {
        super(id, node);
    }
}
