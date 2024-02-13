/* (c) Copyright Frontify Ltd., all rights reserved. */

import { ELEMENT_LINK } from '@udecode/plate-link';
import { MarkupElement } from '@frontify/fondue';

import { LinkMarkupElementNode, TLinkElement } from './LinkMarkupElementNode';
import { PlateRenderElementProps } from '@udecode/plate-core';

export class LinkMarkupElement extends MarkupElement {
    constructor(
        id = ELEMENT_LINK,
        node: (props: PlateRenderElementProps & { element: TLinkElement }) => JSX.Element = LinkMarkupElementNode,
    ) {
        super(id, node);
    }
}
