/* (c) Copyright Frontify Ltd., all rights reserved. */

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
