import { promiseExec } from './promiseExec';

describe('exec with Promise wrapper', () => {
    describe(promiseExec, () => {
        it('should execute and return stdout', async () => {
            const result = await promiseExec('echo some-echo');
            expect(result).toEqual('some-echo\n');
        });

        it('should reject if an error occur', async () => {
            await expect(promiseExec('some-random-command-that-doesnt-exist')).rejects.toThrowError();
        });
    });
});
