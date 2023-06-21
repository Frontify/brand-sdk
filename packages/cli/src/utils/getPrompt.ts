/* (c) Copyright Frontify Ltd., all rights reserved. */

import { generateFilePrompt } from './extractFiles.js';

export async function generatePrompt(description: string, githubAccessKey: string): Promise<string> {
    const basicPromptInfo =
        'I would like you to generate a settings code for me. I have a software that consists of different components called blocks, and each block can have its own settings. I will provide you with a few examples of how these settings can be structured, along with comments to help you understand their functionality. And i will also provide you with some type definitions for the settings. After that, I will provide you with a user description that outlines the desired settings. Your task will be to read and understand the user description, determine the required settings, and generate the code of a example setting based on the provided examples. Please only respond with a valid typescript content that contains the required settings.';
    const owner = 'frontify';
    const repo = 'guideline-blocks';
    const settingsFiles = [
        'packages/callout-block/src/settings.ts',
        'packages/image-block/src/settings.ts',
        'packages/quote-block/src/settings.ts',
        'packages/thumbnail-grid-block/src/settings.ts',
        'packages/audio-block/src/settings.ts',
        'packages/brand-positioning-block/src/settings.ts',
        'packages/compare-slider-block/src/settings.ts',
    ];

    const files = await generateFilePrompt(owner, repo, settingsFiles, githubAccessKey);

    // const typesSettings = await generateFilePrompt(
    //     owner,
    //     'brand-sdk',
    //     ['packages/guideline-blocks-settings/src/index.ts'],
    //     githubAccessKey,
    // );
    // const blocksUsedForSettings = await listFolderContents(
    //     owner,
    //     'brand-sdk',
    //     'packages/sidebar-settings/src/blocks',
    //     githubAccessKey,
    // );
    const prompts = [
        basicPromptInfo,
        'These are the example settings:',
        files,
        // 'These are the explanations of the settings properties',
        // typesSettings,
        // 'These are the blocks which are used in the settings',
        // blocksUsedForSettings,
        'The new settings should have the following properties:',
        description,
        'Use the existing examples and types as references for the implementation. Please only return code and look that you have the same strucure than the examples.',
    ];
    return prompts.join('\n\n');
}
