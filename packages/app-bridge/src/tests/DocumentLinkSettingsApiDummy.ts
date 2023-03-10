/* (c) Copyright Frontify Ltd., all rights reserved. */

import { DocumentLinkSettingsApi, FormLinkStateIconPosition, FormLinkStateType } from '../types';

export class DocumentLinkSettingsApiDummy {
    static withScreenId(screen_id: number): { link_settings: DocumentLinkSettingsApi } {
        return {
            link_settings: {
                new_tab: true,
                display: FormLinkStateType.textAndIcon,
                icon_position: FormLinkStateIconPosition.left,
                screen_id,
                icon_url: 'https://dev.frontify.test/api/file-icon/file-svg.svg',
                icon_file_name: 'My-pretty-link-icon.svg',
            },
        };
    }

    static withFileId(file_id: string): { link_settings: DocumentLinkSettingsApi } {
        return {
            link_settings: {
                new_tab: true,
                display: FormLinkStateType.textAndIcon,
                icon_position: FormLinkStateIconPosition.left,
                file_id,
                icon_url: 'https://dev.frontify.test/api/file-icon/file-svg.svg',
                icon_file_name: 'My-pretty-link-icon.svg',
            },
        };
    }
}
