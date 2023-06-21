/* (c) Copyright Frontify Ltd., all rights reserved. */

import { askOpenAi } from '../utils/askOpenAi.js';
import { generatePrompt } from '../utils/getPrompt.js';
import { Logger } from '../utils/index.js';
import fs from 'fs';

export const generateSettings = async (
    description: string,
    openAiKey: string,
    githubAccessKey: string,
): Promise<void> => {
    Logger.info('Generating settings...');
    Logger.info(description);

    try {
        let n = 0;
        Logger.info(`
            (\\____/)
             (_oo_)
               (O)
             __||__    \\)
          []/______\\[] /
          / \\______/ \\/
         /    /__\\
        (\\   /____\\`);

        Logger.info('');
        Logger.info('I am generating the settings for you...');
        Logger.info('');

        const loadingIterval = setInterval(() => {
            const messages = [
                'Hmm this is taking longer than expected...',
                'I am still working on it...',
                'Just a few more seconds...',
                "Hold on tight, we're preparing something amazing!",
                'Loading awesomeness... Please wait!',
                'Just a moment while we work our magic...',
                "Sit back and relax, we're almost there!",
                'Processing your request... Thank you for your patience!',
                "Loading progress... Don't worry, we won't keep you waiting for long!",
                "Generating results... It's all coming together!",
                'Time for some behind-the-scenes action... Almost done!',
                'Working hard to bring you the best experience... Hold tight!',
            ];

            const randomIndex = Math.floor(Math.random() * messages.length);
            const randomMessage = messages[randomIndex];

            Logger.info(randomMessage);
            Logger.info('');
            n++;
        }, 1000);

        generatePrompt(description, githubAccessKey).then((prompt) => {
            askOpenAi(prompt, openAiKey).then((openAiResponse) => {
                clearInterval(loadingIterval);
                Logger.info('Settings generated successfully!');
                Logger.info(openAiResponse ?? 'No response from Open AI');
                const outputPath = '../newSettings.ts';
                openAiResponse && fs.writeFileSync(outputPath, openAiResponse);
            });
        });
    } catch (error) {
        Logger.error('Error generating settings:', error as string);
    }
};
