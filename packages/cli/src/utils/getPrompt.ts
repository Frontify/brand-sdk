/* (c) Copyright Frontify Ltd., all rights reserved. */

import { generateFilePrompt } from './extractFiles.js';

export async function generatePrompt(description: string): Promise<string> {
    const basicPromptInfo =
        'Create a new setting based on the provided examples and the description of what should be included.'; //(and component)
    const owner = 'frontify';
    const repo = 'guideline-blocks';
    const settingsFiles = [
        'packages/callout-block/src/settings.ts',
        'packages/image-block/src/settings.ts',
        'packages/quote-block/src/settings.ts',
        'packages/text-block/src/settings.ts',
    ];
    const files = await generateFilePrompt(owner, repo, settingsFiles);

    return `${basicPromptInfo}\n\n${files}\n\n${description}`;
}
