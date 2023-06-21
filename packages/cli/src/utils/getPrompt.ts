/* (c) Copyright Frontify Ltd., all rights reserved. */

import { generateFilePrompt, listFolderContents } from './extractFiles.js';

export async function generatePrompt(description: string): Promise<string> {
    const basicPromptInfo =
        'I would like you to generate a settings file for me. I have a software that consists of different components called blocks, and each block can have its own settings defined in a settings file. I will provide you with a few examples of how these setting files can be structured, along with comments to help you understand their functionality. And i will also provide you with some typedefinitions for the settings. After that, I will provide you with a user description that outlines the desired settings. Your task will be to read and understand the user description, determine the required settings, and generate the file based on the provided examples. Please only respond with a valid typescript file that contains the required settings.';
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
        'these are the example settings files:',
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
