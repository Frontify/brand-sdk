import Logger from "./logger";
import { promiseExec } from "./promiseExec";

export const cloneTo = async (gitUrl: string, folderName: string): Promise<void> => {
    await promiseExec(`git clone ${gitUrl} ${folderName}`).catch((error) => {
        Logger.error("Error while cloning the boilerplate:", error.message);
    });
};

export const initRepository = async (): Promise<void> => {
    await promiseExec(`git init && git add .`).catch((error) => {
        Logger.error("Error while initializing the repository:", error.message);
    });
};
