/* (c) Copyright Frontify Ltd., all rights reserved. */

import { hasRichTextValue } from './hasRichTextValue';

export const convertToRteValue = (textStyle = 'p', text = '', align?: 'center' | 'right' | 'left' | 'justify') =>
    hasRichTextValue(text) ? text : JSON.stringify([{ type: textStyle, children: [{ text, textStyle }], align }]);
