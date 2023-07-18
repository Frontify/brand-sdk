/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { TextStyles } from '@frontify/fondue';
import { describe, expect, it } from 'vitest';
import { convertToRteValue } from './convertToRichTextValue';

describe('String converted to Richtext value', () => {
    it('should return rich text value with correct textStyle', () => {
        const text = 'with text';
        const result = convertToRteValue('p' as TextStyles, text);
        expect(result).toBe('[{"type":"p","children":[{"text":"with text","textStyle":"p"}]}]');
    });

    it('should return rich text value with correct textStyle', () => {
        const text = 'Heading 1';
        const result = convertToRteValue('heading1' as TextStyles, text);
        expect(result).toBe('[{"type":"heading1","children":[{"text":"Heading 1","textStyle":"heading1"}]}]');
    });

    it('should return rich text value with correct alignment', () => {
        const text = 'text';
        const result = convertToRteValue('p' as TextStyles, text, 'center');
        expect(result).toBe('[{"type":"p","children":[{"text":"text","textStyle":"p"}],"align":"center"}]');
    });

    it('should test if value is rich text value, it returns the rich text Value', () => {
        const text =
            '[{"type":"heading1","children":[{"text":"Hoi","bold":true,"underline":true}]},{"type":"heading1","children":[{"bold":true,"underline":true,"text":" "}]},{"type":"heading1","children":[{"text":"With Text"}]},{"type":"custom2","children":[{"text":""}]}]';
        const result = convertToRteValue('p' as TextStyles, text);
        expect(result).toBe(text);
    });
});
