/* (c) Copyright Frontify Ltd., all rights reserved. */

import { getOpenAiKey } from '../utils/getOpenAiKey.js';
import { Logger } from '../utils/index.js';

export const generateSettings = async (description: string): Promise<void> => {
    Logger.info('Generating settings...');
    Logger.info(description);

    const key = await getOpenAiKey();

    Logger.info(`Your Open AI Key is: ${key}`);

    Logger.defaultInfo(`\n${Logger.spacer(11)}Happy hacking!`);
};
