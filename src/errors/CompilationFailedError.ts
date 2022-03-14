export default class CompilationFailedError extends Error {
    readonly name = 'CompilationFailedError';
    constructor(error: string) {
        super(error);
    }
}
