/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { hasRichTextValue } from './hasRichTextValue';

describe('Richtext has value', () => {
    // Check if richtext has value
    it('should return true if Richtext has value', () => {
        const text = '[{"type":"p","children":[{"text":"with text"}]}]';
        const result = hasRichTextValue(text);
        expect(result).toBeTruthy();
    });

    it('should return true if Richtext has value', () => {
        const text =
            '[{"type":"heading1","children":[{"text":"Hoi","bold":true,"underline":true}]},{"type":"heading1","children":[{"bold":true,"underline":true,"text":" "}]},{"type":"heading1","children":[{"text":"With Text"}]},{"type":"custom2","children":[{"text":""}]}]';
        const result = hasRichTextValue(text);
        expect(result).toBeTruthy();
    });

    it('should return true if value has a space it', () => {
        const text = '[{"type":"p","children":[{"text":" "}]}]';
        const result = hasRichTextValue(text);
        expect(result).toBeTruthy();
    });

    // Check if richtext has no value
    it('should return false if RTE is empty', () => {
        const text = '[{"type":"p","children":[{"text":""}]}]';
        const result = hasRichTextValue(text);
        expect(result).toBeFalsy();
    });

    it('should return false if RTE is empty 2.0', () => {
        const text = '[{"type":"heading1","children":[{"text":"","bold":true,"underline":true}]}]';
        const result = hasRichTextValue(text);
        expect(result).toBeFalsy();
    });

    it('should return false if value is an invalid json', () => {
        const text = 'abcd';
        const result = hasRichTextValue(text);
        expect(result).toBeFalsy();
    });

    it('should return false if RTE has only new lines', () => {
        const text =
            '[{"type":"quote","children":[{"text":""}]},{"type":"quote","children":[{"text":""}]},{"type":"quote","children":[{"text":""}]},{"type":"quote","children":[{"text":""}]},{"type":"quote","children":[{"text":""}]}]';
        const result = hasRichTextValue(text);
        expect(result).toBeFalsy();
    });

    it('should return false on empty value', () => {
        const text = '';
        const result = hasRichTextValue(text);
        expect(result).toBeFalsy();
    });

    it('should return false on undefined text value', () => {
        const result = hasRichTextValue(undefined);
        expect(result).toBeFalsy();
    });
});
