/* (c) Copyright Frontify Ltd., all rights reserved. */

type CopyFrame = { source: object; target: object };

// defineProperty keeps a source key such as `__proto__` an own property instead of reaching the prototype.
export const setOwn = (target: object, key: string, value: unknown): void => {
    Object.defineProperty(target, key, { value, enumerable: true, writable: true, configurable: true });
};

const createContainer = (source: object): object => {
    if (Array.isArray(source)) {
        return [];
    }

    return {};
};

/** Deep copy without recursion, so a hostile property value cannot exhaust the stack. */
export const copyValue = (value: unknown): unknown => {
    if (typeof value !== 'object' || value === null) {
        return value;
    }

    const root = createContainer(value);
    const pending: CopyFrame[] = [{ source: value, target: root }];

    while (pending.length > 0) {
        const frame = pending.pop();
        if (frame === undefined) {
            break;
        }

        for (const key of Object.keys(frame.source)) {
            const child: unknown = Reflect.get(frame.source, key);
            if (typeof child === 'object' && child !== null) {
                const copy = createContainer(child);
                setOwn(frame.target, key, copy);
                pending.push({ source: child, target: copy });
            } else {
                setOwn(frame.target, key, child);
            }
        }
    }

    return root;
};
