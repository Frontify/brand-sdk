/* (c) Copyright Frontify Ltd., all rights reserved. */

import { SettingBlock, createFooter } from '..';
import { Security } from './types';
import { getSecurityGlobalControlId } from './securityDownloadable';

/**
 * Returns segment controls for global security settings.
 *
 * @param {string} id custom id for the setting block
 *
 * @returns {SettingBlock} Returns
 */

export const getSecurityGlobalControlSetting = (id?: string): SettingBlock[] => {
    const securityId = getSecurityGlobalControlId(id);
    return [
        {
            id: securityId,
            type: 'segmentedControls',
            defaultValue: Security.Global,
            choices: [
                {
                    value: Security.Global,
                    label: 'Global Settings',
                },
                {
                    value: Security.Custom,
                    label: 'Custom',
                },
            ],
        },
        {
            id: 'globalSettingsInfo',
            type: 'notification',
            footer: createFooter({
                label: 'Change global settings [here].',
                replace: { here: { event: 'general-settings.open' } },
            }),
        },
    ];
};
