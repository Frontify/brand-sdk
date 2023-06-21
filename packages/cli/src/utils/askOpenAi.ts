/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Configuration, OpenAIApi } from 'openai';

export const askOpenAi = async (prompt: string, apiKey: string) => {
    const configuration = new Configuration({
        apiKey,
    });
    const openai = new OpenAIApi(configuration);

    const chatCompletion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
    });

    return chatCompletion.data.choices[0].message?.content;
};
