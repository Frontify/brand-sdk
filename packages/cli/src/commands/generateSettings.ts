/* (c) Copyright Frontify Ltd., all rights reserved. */

import { askOpenAi } from '../utils/askOpenAi.js';
import { generatePrompt } from '../utils/getPrompt.js';
import { Logger } from '../utils/index.js';

export const generateSettings = async (
    description: string,
    openAiKey: string,
    githubAccessKey: string,
): Promise<void> => {
    Logger.info('Generating settings...');
    Logger.info(description);

    try {
        const prompt = await generatePrompt(description, githubAccessKey);
        const openAiResponse = await askOpenAi(prompt, openAiKey);

        Logger.info('Settings generated successfully!');
        Logger.info(openAiResponse ?? 'No response from Open AI');

        Logger.defaultInfo(`\n${Logger.spacer(11)}Happy hacking!`);
    } catch (error) {
        Logger.error('Error generating settings:', error as string);
    }
};
