import { Configuration, OpenAIApi } from 'openai';

export const askOpenAi = async (prompt: string, apiKey: string) => {
    const configuration = new Configuration({
        apiKey,
    });
    const openai = new OpenAIApi(configuration);

    const chatCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt,
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: false,
        stop: ['{}'],
    });

    return chatCompletion.data.choices[0].text;
};
