/* (c) Copyright Frontify Ltd., all rights reserved. */

import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';

export const getFileHash = (filePath: string): Promise<string> => {
    return new Promise((resolve) => {
        const hash = createHash('sha256');
        createReadStream(filePath)
            .on('data', (data) => hash.update(data))
            .on('end', () => resolve(hash.digest('hex')));
    });
};
