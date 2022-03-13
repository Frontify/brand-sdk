import { getCurrentTime } from './date';

describe('Date utils', () => {
    beforeAll(() => {
        jest.useFakeTimers('modern');
        jest.setSystemTime(new Date('2021-01-20 12:00:01').getTime());
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    describe(getCurrentTime, () => {
        it('should give the correct time as a string', () => {
            expect(getCurrentTime()).toEqual('12:00:01');
        });
    });
});
