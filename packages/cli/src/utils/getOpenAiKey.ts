/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Configuration } from './configuration.js';
import prompts from 'prompts';

export const getOpenAiKey = async (): Promise<string> => {
    const openAiKey = Configuration.get('openAiKey') as string | undefined;

    if (!openAiKey) {
        const { promptedOpenAiKey } = await prompts([
            {
                type: 'text',
                name: 'promptedOpenAiKey',
                message: 'Enter your OpenAI API key:',
                initial: '<your-key>',
            },
        ]);
        Configuration.set('openAiKey', promptedOpenAiKey);
        return promptedOpenAiKey;
    } else {
        return openAiKey;
    }
};
