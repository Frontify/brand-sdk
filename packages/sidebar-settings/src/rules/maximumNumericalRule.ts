/* (c) Copyright Frontify Ltd., all rights reserved. */

export const maximumNumericalRule = (max: number) => ({
    errorMessage: `Value must be smaller than or equal to ${max}`,
    validate: (value: string) => Boolean(value) && !Number.isNaN(Number(value)) && Number(value) <= max,
});
