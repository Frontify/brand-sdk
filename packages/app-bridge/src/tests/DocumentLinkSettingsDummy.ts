/* (c) Copyright Frontify Ltd., all rights reserved. */

import { DocumentLinkSettings } from '../types';
import { convertObjectCase } from '../utilities';
import { DocumentLinkSettingsApiDummy } from './DocumentLinkSettingsApiDummy';

export class DocumentLinkSettingsDummy {
    static withScreenId(screenId: number): DocumentLinkSettings {
        return convertObjectCase(DocumentLinkSettingsApiDummy.withScreenId(screenId), 'camel').linkSettings;
    }

    static withFileId(fileId: string): DocumentLinkSettings {
        return convertObjectCase(DocumentLinkSettingsApiDummy.withFileId(fileId), 'camel').linkSettings;
    }
}
