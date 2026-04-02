/* (c) Copyright Frontify Ltd., all rights reserved. */

import { createWriteStream } from 'node:fs';

import archiver from 'archiver';

interface Archive {
    glob(pattern: string, options: { cwd: string; ignore: string[] }): Archive;
    on(event: string, callback: (error: Error) => void): Archive;
    pipe(destination: NodeJS.WritableStream): Archive;
    finalize(): Promise<void>;
}

export const createZip = (path: string, pathOut: string, ignored: string[] = []): Promise<void> => {
    return new Promise((resolve, reject): void => {
        const createArchive = archiver as unknown as (format: string, options: { zlib: { level: number } }) => Archive;
        const archive = createArchive('zip', { zlib: { level: 9 } });

        const stream = createWriteStream(pathOut);
        stream.on('close', () => resolve());

        archive
            .glob('**', {
                cwd: path,
                ignore: ignored,
            })
            .on('error', (error: Error) => reject(error))
            .pipe(stream);

        archive.finalize().catch((error: Error) => reject(error));
    });
};
