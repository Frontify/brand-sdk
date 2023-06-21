/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Logger } from '../utils/index.js';

export const generateSettings = (description: string): void => {
    Logger.info('Generating settings...');
    Logger.info(description);

    Logger.defaultInfo(`\n${Logger.spacer(11)}Happy hacking!`);
};
