/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Document, DocumentGroup } from '../types';

export const mergeSort = (
    arg1: Map<number, Document>,
    arg2: Map<number, DocumentGroup>,
    sortFn = (a: Document | DocumentGroup, b: Document | DocumentGroup) => (a.sort && b.sort ? a.sort - b.sort : 0),
): (Document | DocumentGroup)[] => {
    const sort = sortFn;

    return [...arg1.values(), ...arg2.values()].sort(sort);
};
