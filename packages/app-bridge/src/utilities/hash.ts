/* (c) Copyright Frontify Ltd., all rights reserved. */

export const generateRandomString = (length = 6): string => {
    return Math.random().toString(20).substr(2, length);
};
