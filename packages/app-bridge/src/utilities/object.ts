/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { CamelCasedPropertiesDeep, SnakeCasedPropertiesDeep } from 'type-fest';

import transform from 'lodash-es/transform';
import snakeCase from 'lodash-es/snakeCase';
import camelCase from 'lodash-es/camelCase';

export const compareObjects = (obj1: unknown, obj2: unknown) => {
    if (!obj1 || !obj2 || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return false;
    }

    const obj1Keys = Object.keys(obj1) as (keyof typeof obj1)[];
    const obj2Keys = Object.keys(obj2) as (keyof typeof obj2)[];

    if (obj1Keys.length !== obj2Keys.length) {
        return false;
    }

    for (const key of obj1Keys) {
        if (
            (typeof obj1[key] === 'object' && !compareObjects(obj1[key], obj2[key])) ||
            (typeof obj1[key] !== 'object' && obj1[key] !== obj2[key])
        ) {
            return false;
        }
    }

    return true;
};

export const isObject = (item: unknown) => {
    return item && typeof item === 'object' && !Array.isArray(item);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertObjectCase = <Obj extends Record<string, any>, Case extends 'camel' | 'snake'>(
    obj: Obj,
    caseType: Case,
): Case extends 'camel' ? CamelCasedPropertiesDeep<Obj> : SnakeCasedPropertiesDeep<Obj> => {
    const caseFn = {
        camel: camelCase,
        snake: snakeCase,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return transform(obj, (acc: any, value, key, target) => {
        const caseKey = Array.isArray(target) ? key : caseFn[caseType](key);

        acc[caseKey] = isObject(value) || Array.isArray(value) ? convertObjectCase(value, caseType) : value;
    });
};
