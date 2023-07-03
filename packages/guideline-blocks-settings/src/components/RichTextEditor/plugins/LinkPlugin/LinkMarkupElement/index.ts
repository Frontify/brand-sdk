/* (c) Copyright Frontify Ltd., all rights reserved. */

import { MarkupElement } from '@frontify/fondue';
import { ELEMENT_LINK } from '@udecode/plate';
import { LinkMarkupElementNode } from './LinkMarkupElementNode';

export class LinkMarkupElement extends MarkupElement {
    constructor(id = ELEMENT_LINK, node = LinkMarkupElementNode) {
        super(id, node);
    }
}
