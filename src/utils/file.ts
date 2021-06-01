import { readdirSync, rmdirSync } from "fs";

export const isDirectoryEmpty = (folderPath: string): boolean => {
    try {
        return readdirSync(folderPath).length === 0;
    } catch {
        return true;
    }
};

export const deleteDirectory = (folderPath: string): boolean => {
    try {
        rmdirSync(folderPath, { recursive: true });
        return true;
    } catch {
        return false;
    }
};
