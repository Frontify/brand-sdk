/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it, vi } from 'vitest';

import { MessageBus } from './MessageBus';

describe('MessageBus', () => {
    it('should be instantiable', () => {
        const { port1 } = new MessageChannel();

        const messageBus = new MessageBus(port1);
        expect(messageBus).toBeInstanceOf(MessageBus);
    });

    it('should call postMessage from the MessageChannel on post', () => {
        const postMessageMock = vi.fn();

        class PortMock {
            postMessage = postMessageMock;
            onmessage = vi.fn();
            onmessageerror = vi.fn();
        }

        const messageBus = new MessageBus(new PortMock() as unknown as MessagePort);
        messageBus.post({ operation: 'test' });
        expect(postMessageMock).toHaveBeenCalledTimes(1);
    });

    it('should return message from port2', async () => {
        const channel = new MessageChannel();

        const messageBus = new MessageBus(channel.port1);

        const testResponse = 'test-message';
        channel.port2.onmessage = (event) => {
            const { token } = event.data;
            channel.port2.postMessage({ message: testResponse, token });
        };
        const result = await messageBus.post({ operation: 'test' });

        expect(result).toEqual(testResponse);
    });

    it('should trigger onmessage error on message sending error', async () => {
        const channel = new MessageChannel();
        const messageBus = new MessageBus(channel.port1);

        channel.port1.postMessage = () => {
            throw new Error('Simulated message sending error');
        };

        await expect(() => messageBus.post({ operation: 'test' })).rejects.toThrow();
    });

    it('should send a token with the channel', async () => {
        const channel = new MessageChannel();
        const messageBus = new MessageBus(channel.port1);

        channel.port2.onmessage = (event) => {
            expect(event.data.token).toBeDefined();
        };

        messageBus.post({ operation: 'test' });
    });

    it('should return a message with a token', async () => {
        const channel = new MessageChannel();
        const messageBus = new MessageBus(channel.port1);

        channel.port2.onmessage = (event) => {
            const { token } = event.data;
            channel.port2.postMessage({ message: 'test-message', token });
        };

        const response = await messageBus.post({ operation: 'test' });
        expect(response).toBe('test-message');
    });

    it('should handle multiple messages with their tokens and return correct message', async () => {
        const channel = new MessageChannel();
        const messageBus = new MessageBus(channel.port1);

        const message1 = 'test-message-1';
        const message2 = 'test-message-2';
        const message3 = 'test-message-3';

        channel.port2.onmessage = (event) => {
            const { token, message } = event.data;
            if (message.operation === 'message1') {
                setTimeout(() => {
                    channel.port2.postMessage({ message: message1, token });
                }, 1);
            } else if (message.operation === 'message2') {
                setTimeout(() => {
                    channel.port2.postMessage({ message: message2, token });
                }, 2);
            } else if (message.operation === 'message3') {
                channel.port2.postMessage({ message: message3, token });
            }
        };

        const response2 = await messageBus.post({ operation: 'message2' });
        const response1 = await messageBus.post({ operation: 'message1' });
        const response3 = await messageBus.post({ operation: 'message3' });

        const allPromises = await Promise.all([
            messageBus.post({ operation: 'message3' }),
            messageBus.post({ operation: 'message1' }),
            messageBus.post({ operation: 'message2' }),
        ]);

        expect(response1).toBe(message1);
        expect(response2).toBe(message2);
        expect(response3).toBe(message3);

        expect(allPromises.includes(message1)).toBe(true);
        expect(allPromises.includes(message2)).toBe(true);
        expect(allPromises.includes(message3)).toBe(true);
    });

    it('should recompose secure request response', async () => {
        const channel = new MessageChannel();
        const messageBus = new MessageBus(channel.port1);

        channel.port2.onmessage = (event) => {
            expect(event.data.token).toBeDefined();
            expect(event.data.message.parameter.name).toBe('executeSecureRequest');

            const { token } = event.data;
            channel.port2.postMessage({
                status: 200,
                statusText: 'OK',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'test-message' }),
                token,
            });
        };

        const result = (await messageBus.post({ parameter: { name: 'executeSecureRequest' } })) as Response;

        expect(result).toBeInstanceOf(Response);
        expect(result.status).toBe(200);
        expect(result.statusText).toBe('OK');
        expect(result.headers.get('Content-Type')).toBe('application/json');
        expect(await result.json()).toEqual({ message: 'test-message' });
    });
});
