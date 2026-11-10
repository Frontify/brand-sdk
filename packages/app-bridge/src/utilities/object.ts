/* (c) Copyright Frontify Ltd., all rights reserved. */

import { camelCase, snakeCase, transform } from 'lodash-es';
import { type CamelCasedPropertiesDeep, type SnakeCasedPropertiesDeep } from 'type-fest';

const isObject = (item: unknown) => {
    return item && typeof item === 'object' && !Array.isArray(item);
};

// oxlint-disable-next-line typescript/no-explicit-any
export const mergeDeep = <T = Record<string, unknown>>(target: any, ...sources: any): T => {
    if (sources.length === 0) {
        return target;
    }

    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, { [key]: {} });
                }
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
};

/**
 *
 * @param obj object or array of objects
 * @param caseType camel or snake
 * @returns converted object or array of objects
 */
// oxlint-disable-next-line typescript/no-explicit-any
export const convertObjectCase = <Obj extends Record<string, any>, Case extends 'camel' | 'snake'>(
    obj: Obj,
    caseType: Case,
): Case extends 'camel' ? CamelCasedPropertiesDeep<Obj> : SnakeCasedPropertiesDeep<Obj> => {
    const caseFn = {
        camel: camelCase,
        snake: snakeCase,
    };

    // oxlint-disable-next-line typescript/no-explicit-any
    return transform(obj, (acc: any, value, key, target) => {
        const caseKey = Array.isArray(target) ? key : caseFn[caseType](key);

        acc[caseKey] = isObject(value) || Array.isArray(value) ? convertObjectCase(value, caseType) : value;
    });
};
