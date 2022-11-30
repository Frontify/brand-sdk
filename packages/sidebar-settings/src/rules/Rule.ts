/* (c) Copyright Frontify Ltd., all rights reserved. */

export type Rule<T> = {
    errorMessage: string;
    validate: (value: T) => boolean;
};
