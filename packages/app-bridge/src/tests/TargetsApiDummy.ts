/* (c) Copyright Frontify Ltd., all rights reserved. */

import { DocumentPageTargetsApi, DocumentTargetsApi, SingleTargetApi } from '../types';

export class SingleTargetApiDummy {
    static target(value: number): SingleTargetApi {
        return {
            checked: false,
            disabled: false,
            indeterminate: false,
            label: String(value),
            target: {
                account_id: 1,
                asset_ids: [],
                created: '2022-06-10T12:35:52.000+00:00',
                creator: 1,
                description: 'Target description',
                group_ids: [],
                id: value,
                modified: null,
                modifier: null,
                name: `Target ${value}`,
                sort: 1,
                total_groups: null,
                total_links: null,
                total_users: null,
                user_ids: [],
            },
            value,
        };
    }
}

export class DocumentTargetsApiDummy {
    static with(id: number): DocumentTargetsApi {
        return {
            appearance: {},
            background_file_id: null,
            background_url: null,
            heading: null,
            id,
            link_type: null,
            link_url: null,
            logo_file_id: null,
            logo_url: null,
            mode: null,
            portal_title: 'Portal title',
            subheading: null,
            success: true,
            targets: {
                disabled: [],
                has_selected_targets: true,
                targets: [
                    SingleTargetApiDummy.target(1),
                    SingleTargetApiDummy.target(2),
                    SingleTargetApiDummy.target(3),
                ],
            },
            title: 'Test document',
        };
    }
}

export class DocumentPageTargetsApiDummy {
    static with(id: number): DocumentPageTargetsApi {
        return {
            default: false,
            disabled: [],
            has_selected_targets: true,
            id,
            success: true,
            targets: [SingleTargetApiDummy.target(1), SingleTargetApiDummy.target(2), SingleTargetApiDummy.target(3)],
        };
    }
}
