/* (c) Copyright Frontify Ltd., all rights reserved. */

import fetch from 'node-fetch';
import { Base64 } from 'js-base64';

async function createPromptFile(
    owner: string,
    repo: string,
    filePath: string,
    githubAccessKey,
): Promise<string | undefined> {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    const headers = {
        Accept: 'application/vnd.github.v3+json',
        Authorization: githubAccessKey,
    };
    const response = await fetch(url, { headers });

    if (response.ok) {
        const content: any = await response.json();
        if ('content' in content) {
            // File content is base64 encoded, decode it
            const fileContent = Base64.decode(content.content);
            return fileContent;
        }
    } else if (response.status === 404) {
        return `File "${filePath}" not found in the repository.`;
    } else {
        return `Error retrieving file: ${response.statusText}`;
    }
}

export async function generateFilePrompt(
    owner: string,
    repo: string,
    files: string[],
    githubAccessKey: string,
): Promise<string> {
    const prompts: string[] = [];

    for (const file of files) {
        const fileContent = await createPromptFile(owner, repo, file, githubAccessKey);
        if (typeof fileContent === 'string') {
            prompts.push(fileContent);
        } else {
            console.error(fileContent);
        }
    }

    const prompt = prompts.join('\n\n');
    return prompt;
}
