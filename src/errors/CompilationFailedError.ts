export default class CompilationFailedError extends Error {
    constructor(error: string) {
        super(error);
    }
}
