import Logger from "../utils/logger";

export default class CommandExecutionError extends Error {
    constructor(error: string) {
        super();
        Logger.error(`The command execution failed: ${error}`);
    }
}
