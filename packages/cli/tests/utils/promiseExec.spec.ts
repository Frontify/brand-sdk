/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, test } from 'vitest';

import { promiseExec } from '../../src/utils/promiseExec';

describe('exec with Promise wrapper', () => {
    describe('promiseExec', () => {
        test('should execute and return stdout', async () => {
            const result = await promiseExec('echo some-echo');
            expect(result).toEqual('some-echo\n');
        });

        test('should reject if an error occur', async () => {
            await expect(promiseExec('some-random-command-that-doesnt-exist')).rejects.toThrowError();
        });
    });
});
