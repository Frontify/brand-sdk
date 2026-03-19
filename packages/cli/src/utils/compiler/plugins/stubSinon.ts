/* (c) Copyright Frontify Ltd., all rights reserved. */

export const stubSinon = () => ({
    name: 'stub-test-modules',
    enforce: 'pre',
    resolveId(id) {
        if (id === 'sinon') {
            return '\0stub:sinon';
        }
    },
    load(id) {
        if (id === '\0stub:sinon') {
            return `const noop = () => {};
export const spy = noop;
export const stub = noop;
export const mock = noop;
export const fake = noop;
export const match = {};
export const assert = {};
export const sandbox = {};
export const createSandbox = noop;
export const useFakeTimers = noop;
export const restore = noop;
export default { spy, stub, mock, fake, match, assert, sandbox, createSandbox, useFakeTimers, restore };`;
        }
    },
});
