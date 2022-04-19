import { getCurrentTime } from './date';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';

describe('Date utils', () => {
    beforeAll(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2021-01-20 12:00:01').getTime());
    });

    afterAll(() => {
        vi.useRealTimers();
    });

    describe('getCurrentTime', () => {
        test('should give the correct time as a string', () => {
            expect(getCurrentTime()).toEqual('12:00:01');
        });
    });
});
