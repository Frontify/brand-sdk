/* (c) Copyright Frontify Ltd., all rights reserved. */

const MAX_DOCUMENT_BYTES = 5 * 1024 * 1024;
export const MAX_NODES = 50_000;
export const MAX_DEPTH = 64;
export const MAX_TEXT_LENGTH = 1_000_000;
/** How many value nodes one conversion may copy, which bounds the size of its output however the input is split. */
export const MAX_COPIED_VALUES = 1_000_000;
/** The deepest list or check list nesting `toLegacyRichText` follows before it gives up. */
export const MAX_BLOCK_NESTING_DEPTH = 128;

const ONE_BYTE_LIMIT = 0x80;
const TWO_BYTE_LIMIT = 0x800;
const HIGH_SURROGATE_START = 0xd800;
const HIGH_SURROGATE_END = 0xdbff;
const LOW_SURROGATE_START = 0xdc00;
const LOW_SURROGATE_END = 0xdfff;

const isLowSurrogate = (code: number): boolean => {
    return code >= LOW_SURROGATE_START && code <= LOW_SURROGATE_END;
};

/** Counts UTF-8 bytes in one pass and stops at the first byte over the document limit. */
export const exceedsDocumentBytes = (value: string): boolean => {
    let bytes = 0;

    for (let index = 0; index < value.length; index++) {
        const code = value.charCodeAt(index);

        if (code < ONE_BYTE_LIMIT) {
            bytes += 1;
        } else if (code < TWO_BYTE_LIMIT) {
            bytes += 2;
        } else if (
            code >= HIGH_SURROGATE_START &&
            code <= HIGH_SURROGATE_END &&
            isLowSurrogate(value.charCodeAt(index + 1))
        ) {
            bytes += 4;
            index += 1;
        } else {
            bytes += 3;
        }

        if (bytes > MAX_DOCUMENT_BYTES) {
            return true;
        }
    }

    return false;
};
