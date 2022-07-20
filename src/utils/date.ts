/* (c) Copyright Frontify Ltd., all rights reserved. */

export const getCurrentTime = (): string => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
        now.getSeconds()
    ).padStart(2, '0')}`;
};
