/* (c) Copyright Frontify Ltd., all rights reserved. */

/**
 * As container queries lack a selector like @max-sm, as a workaround
 * the class is disabled by default and reenabled on bigger container sizes
 */
const columnBreakDisablingClassUnderMd =
    '[&_.tw-break-after-column]:tw-break-after-auto [&_.tw-break-inside-avoid-column]:tw-break-inside-auto [&_.tw-break-after-column.tw-pb-5]:tw-pb-0 @md:[&_.tw-break-after-column.tw-pb-5]:!tw-pb-5 @md:[&_.tw-break-after-column]:!tw-break-after-column @md:[&_.tw-break-inside-avoid-column]:!tw-break-inside-avoid-column';

const columnBreakDisablingClassUnderSm =
    '[&_.tw-break-after-column]:tw-break-after-auto [&_.tw-break-inside-avoid-column]:tw-break-inside-auto [&_.tw-break-after-column.tw-pb-5]:tw-pb-0 @sm:[&_.tw-break-after-column.tw-pb-5]:!tw-pb-5 @sm:[&_.tw-break-after-column]:!tw-break-after-column @sm:[&_.tw-break-inside-avoid-column]:!tw-break-inside-avoid-column';

export const columnClassMap = {
    1: 'tw-columns-1',
    2: `tw-columns-1 @sm:!tw-columns-2 ${columnBreakDisablingClassUnderSm}`,
    3: `tw-columns-1 @md:!tw-columns-3 ${columnBreakDisablingClassUnderMd}`,
    4: `tw-columns-1 @md:!tw-columns-4 ${columnBreakDisablingClassUnderMd}`,
    5: `tw-columns-1 @md:!tw-columns-5 ${columnBreakDisablingClassUnderMd}`,
};

export const getResponsiveColumnClasses = (columnCount?: number) => {
    if (!columnCount) {
        return '';
    }

    return columnClassMap[columnCount as keyof typeof columnClassMap] || columnClassMap[1];
};
