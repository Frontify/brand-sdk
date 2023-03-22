/* (c) Copyright Frontify Ltd., all rights reserved. */

import { BulkDownload } from '../types';

export class BulkDownloadApiDummy {
    static with(): BulkDownload {
        return {
            download_url: 'dummy-url',
            signature: 'dummy-signature',
        };
    }
}
