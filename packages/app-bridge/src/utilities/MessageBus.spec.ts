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

        const testResponse = { result: { data: { test: 'test' } } };
        channel.port2.postMessage(testResponse);

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
            console.log(event);
            expect(event.data.token).toBeDefined();
        };

        messageBus.post({ operation: 'test' });
    });
});
