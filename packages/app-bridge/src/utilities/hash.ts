/* (c) Copyright Frontify Ltd., all rights reserved. */

export const generateRandomString = (length = 6): string => {
    const typedArray = new Uint8Array(1);
    const randomValue = window.crypto.getRandomValues(typedArray)[0];
    const randomFloat = randomValue / Math.pow(2, 8);
    return randomFloat.toString(20).substring(2, length);
};
