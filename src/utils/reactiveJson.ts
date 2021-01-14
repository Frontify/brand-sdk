import Logger from "./logger";
import { writeFile, readFileSync } from "fs";

export const ReactiveJson = (path: string): Record<string, unknown> => {
    try {
        const jsonRaw = readFileSync(path, "utf8");
        const jsonParsed = JSON.parse(jsonRaw);

        return new Proxy(jsonParsed, {
            set: (obj, prop, valeur) => {
                obj[prop] = valeur;

                const jsonString = JSON.stringify(obj, null, 2);

                writeFile(path, jsonString, function (err) {
                    if (err) return Logger.error(`An error occured while writing the file.`);
                });

                return true;
            },
        });
    } catch (error) {
        if (error instanceof SyntaxError) {
            Logger.error(`An error occured while parsing the file.`);
        } else {
            Logger.error("An unknown error occured:", error);
        }

        return {};
    }
};
