/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Configuration } from '../utils/configuration';
import { Logger } from '../utils/logger';

export const logoutUser = (): void => {
    Configuration.delete('tokens');
    // TODO: Call API endpoint
    Logger.info('You are now logged out.');
};
