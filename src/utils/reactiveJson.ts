import Logger from "./logger";
import { writeFileSync, readFileSync } from "fs";

export const reactiveJson = <T>(path: string): T => {
    try {
        const jsonRaw = readFileSync(path, "utf8");
        const jsonParsed = JSON.parse(jsonRaw);

        return new Proxy(jsonParsed, {
            set: (obj, prop, value) => {
                obj[prop] = value;

                const jsonString = JSON.stringify(obj, null, "\t");

                writeFileSync(path, jsonString);

                return true;
            },
        });
    } catch (error) {
        if (error instanceof SyntaxError) {
            Logger.error(`An error occured while parsing the file.`);
        } else {
            Logger.error("An unknown error occured:", error);
        }

        throw new Error(error);
    }
};
