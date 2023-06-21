/* (c) Copyright Frontify Ltd., all rights reserved. */

import { askOpenAi } from '../utils/askOpenAi.js';
import { getOpenAiKey } from '../utils/getOpenAiKey.js';
import { generatePrompt } from '../utils/getPrompt.js';
import { Logger } from '../utils/index.js';

export const generateSettings = async (description: string): Promise<void> => {
    Logger.info('Generating settings...');
    Logger.info(description);

    try {
        const key = await getOpenAiKey();
        const prompt = await generatePrompt(description);
        const openAiResponse = await askOpenAi(prompt, key);

        Logger.info('Settings generated successfully!');
        Logger.info(openAiResponse ?? 'No response from Open AI');

        Logger.defaultInfo(`\n${Logger.spacer(11)}Happy hacking!`);
    } catch (error) {
        Logger.error('Error generating settings:', error as string);
    }
};
