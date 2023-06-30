/* (c) Copyright Frontify Ltd., all rights reserved. */

import ReactDOM from 'react-dom';
import { TElement, TMentionElement } from '@udecode/plate';
import { MappedMentionableItems, MentionMarkupElementNode } from '@frontify/fondue';

type MentionHtmlNodeProps = { mentionable?: MappedMentionableItems };

export const mentionHtmlNode = (node: TElement, { mentionable }: MentionHtmlNodeProps = {}) => {
    if (!mentionable) {
        return '';
    }

    const div = document.createElement('div');
    ReactDOM.render(MentionMarkupElementNode(mentionable)({ element: node as TMentionElement }), div);
    return div.innerHTML;
};
