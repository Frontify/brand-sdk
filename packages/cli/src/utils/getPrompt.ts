/* (c) Copyright Frontify Ltd., all rights reserved. */

import { generateFilePrompt, listFolderContents } from './extractFiles.js';

export async function generatePrompt(description: string): Promise<string> {
    const basicPromptInfo =
        'Create a new `settings.ts` file based on the provided examples, types information, and description.'; //(and component)
    const owner = 'frontify';
    const repo = 'guideline-blocks';
    const settingsFiles = [
        'packages/callout-block/src/settings.ts',
        'packages/image-block/src/settings.ts',
        'packages/quote-block/src/settings.ts',
        'packages/text-block/src/settings.ts',
    ];

    const files = await generateFilePrompt(owner, repo, settingsFiles);
    const typesSettings = await generateFilePrompt(owner, 'brand-sdk', [
        'packages/packages/guideline-blocks-settings/src/index.ts',
    ]);
    const blocksUsedForSettings = await listFolderContents(owner, 'brand-sdk', 'packages/sidebar-settings/src/blocks');

    const prompts = [
        basicPromptInfo,
        files,
        'these are the explanations of the settings properties',
        typesSettings,
        'these are the blocks which are used in the settings',
        blocksUsedForSettings,
        'The new settings should have the following properties:',
        description,
        'Use the existing examples and types as references for the implementation.',
    ];
    return prompts.join('\n\n');
}
