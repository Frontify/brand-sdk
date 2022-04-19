import { printLogo } from './logo';
import { describe, expect, test, vi } from 'vitest';

describe('Logo utils', () => {
    describe('printLogo', () => {
        test('should print the logo', () => {
            console.log = vi.fn();
            printLogo();
            expect(console.log).toHaveBeenCalled();
        });
    });
});
