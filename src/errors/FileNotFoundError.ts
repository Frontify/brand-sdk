import Logger from "../utils/logger";

export default class FileNotFoundError extends Error {
    constructor(path: string) {
        super();
        Logger.error(`The file at "${path}" has not been found.`);
    }
}
