/* (c) Copyright Frontify Ltd., all rights reserved. */

import { createWriteStream } from 'node:fs';

import archiver from 'archiver';

export const createZip = (path: string, pathOut: string, ignored: string[] = []): Promise<void> => {
    return new Promise((resolve, reject): void => {
        const archive = archiver('zip', { zlib: { level: 9 } });

        const stream = createWriteStream(pathOut);
        stream.on('close', () => resolve());

        archive
            .glob('**', {
                cwd: path,
                ignore: ignored,
            })
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            .on('error', (error) => reject(error))
            .pipe(stream);

        archive.finalize();
    });
};
