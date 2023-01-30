/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Logger } from '../utils/logger.js';
import { Configuration } from '../utils/configuration.js';

export const logoutUser = (): void => {
    Configuration.delete('tokens');
    //TODO: Call API endpoint
    Logger.info('You are now logged out.');
};
