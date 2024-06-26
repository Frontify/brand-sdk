/* (c) Copyright Frontify Ltd., all rights reserved. */

export const columnClassMap = {
    1: 'tw-columns-1',
    2: 'tw-columns-1 @sm:!tw-columns-2',
    3: 'tw-columns-1 @sm:!tw-columns-2 @md:!tw-columns-3',
    4: 'tw-columns-1 @sm:!tw-columns-2 @md:!tw-columns-4',
    5: 'tw-columns-1 @sm:!tw-columns-2 @md:!tw-columns-5',
};

export const getResponsiveColumnClasses = (columnCount?: number) => {
    if (!columnCount) {
        return '';
    }

    return columnClassMap[columnCount as keyof typeof columnClassMap] || columnClassMap[1];
};
