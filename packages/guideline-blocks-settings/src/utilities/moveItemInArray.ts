/* (c) Copyright Frontify Ltd., all rights reserved. */

/**
 * Moves an item from the 'from' position to the 'to' position and updates the array
 *
 * @param {Array} array Array of items
 * @param {Number} from Initial index of the item
 * @param {Number} to New index of the item
 * @returns {Array} New array with the item moved to the new position
 */
export const moveItemInArray = <T>(array: T[], from: number, to: number): T[] => {
    const newArray = [...array];
    const toIndex = to < 0 ? newArray.length + to : to;

    if (toIndex >= 0 && toIndex < newArray.length) {
        const slice = newArray.splice(from, 1)[0];
        newArray.splice(toIndex, 0, slice);
    }

    return newArray;
};
