/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it, vi } from 'vitest';
import { MessageQueue } from './MessageQueue';

describe('MessageBus', () => {
    it('should be instantiable', () => {
        const { port1 } = new MessageChannel();

        const messageBus = new MessageQueue(port1);
        expect(messageBus).toBeInstanceOf(MessageQueue);
    });

    it('should call postMessage from the MessageChannel on post', () => {
        const postMessageMock = vi.fn();

        class PortMock {
            postMessage = postMessageMock;
            onmessage = vi.fn();
            onmessageerror = vi.fn();
        }

        const messageBus = new MessageQueue(new PortMock() as unknown as MessagePort);
        messageBus.post({ operation: 'test' });
        expect(postMessageMock).toHaveBeenCalledTimes(1);
    });

    it('should return message from port2', async () => {
        const channel = new MessageChannel();

        const messageBus = new MessageQueue(channel.port1);

        const testResponse = { result: { data: { test: 'test' } } };
        channel.port2.postMessage(testResponse);

        const result = await messageBus.post({ operation: 'test' });
        expect(result).toEqual(testResponse);
    });

    it.fails('should trigger onmessage error on message sending error', async () => {
        const channel = new MessageChannel();
        const messageBus = new MessageQueue(channel.port1);

        channel.port1.postMessage = () => {
            throw new Error('Simulated message sending error');
        };

        await expect(() => messageBus.post({ operation: 'test' })).rejects.toThrowError();
    });
});
