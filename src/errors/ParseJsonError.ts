import Logger from "../utils/logger";

export default class ParseJsonError extends Error {
    constructor(path: string) {
        super();
        Logger.error(`The file at "${path}" could not be parsed.`);
    }
}
