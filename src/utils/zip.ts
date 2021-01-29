import archiver from "archiver";
import { createWriteStream } from "fs";

export const createZip = (path: string, pathOut: string, ignored: string[] = []): Promise<void> => {
    return new Promise((resolve, reject): void => {
        const archive = archiver("zip", { zlib: { level: 9 } });

        const stream = createWriteStream(pathOut);
        stream.on("close", () => resolve());

        archive
            .glob("**", {
                cwd: path,
                ignore: ignored,
            })
            .on("error", (error) => reject(error))
            .pipe(stream);

        archive.finalize();
    });
};
