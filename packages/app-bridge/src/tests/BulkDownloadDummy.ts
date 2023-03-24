/* (c) Copyright Frontify Ltd., all rights reserved. */

import { BulkDownload } from '../types';

export class BulkDownloadDummy {
    static default(): BulkDownload {
        return {
            downloadUrl: 'dummy-url',
            signature: 'dummy-signature',
        };
    }
}
