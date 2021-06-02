import Logger from "../utils/logger";

export default class FileNotFoundError extends Error {
    constructor(path: string) {
        super();
        Logger.error(`The file at "${path}" have not been found.`);
    }
}
