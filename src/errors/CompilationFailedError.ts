import Logger from "../utils/logger";

export default class CompilationFailedError extends Error {
    constructor(error: string) {
        super(error);
        Logger.error(`The compilation failed: ${error}`);
    }
}
