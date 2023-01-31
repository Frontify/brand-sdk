/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, test, vi } from 'vitest';
import { Logger } from '../../src/utils/logger.js';

const someRandomText = 'It’s a trap!';

describe('Logger utils', () => {
    describe('Logger', () => {
        test('should call defaultInfo and log to the console', () => {
            console.log = vi.fn();
            Logger.defaultInfo(someRandomText);
            expect(console.log).toHaveBeenCalled();
        });

        test('should call info and log to the console', () => {
            console.log = vi.fn();
            Logger.info(someRandomText);
            expect(console.log).toHaveBeenCalled();
        });

        test('should call success and log to the console', () => {
            console.log = vi.fn();
            Logger.success(someRandomText);
            expect(console.log).toHaveBeenCalled();
        });

        test('should call error and log error to the console', () => {
            console.error = vi.fn();
            Logger.error(someRandomText);
            expect(console.error).toHaveBeenCalled();
        });

        test('should give a string with X spaces', () => {
            expect(Logger.spacer(5)).toEqual('     ');
            expect(Logger.spacer(3)).toEqual('   ');
            expect(Logger.spacer()).toEqual(' ');
        });
    });
});
