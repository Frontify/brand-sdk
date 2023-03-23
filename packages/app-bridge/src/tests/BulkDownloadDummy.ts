/* (c) Copyright Frontify Ltd., all rights reserved. */

import { BulkDownloadApi } from '../types';

export class BulkDownloadDummy {
    static with(): BulkDownloadApi {
        return {
            download_url: 'dummy-url',
            signature: 'dummy-signature',
        };
    }
}
