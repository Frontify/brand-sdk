/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it, vi } from 'vitest';
import { MessageQueue } from './MessageQueue';

describe('messageQueue', () => {
    it('should be instantiable', () => {
        const { port1 } = new MessageChannel();

        const messageQueue = new MessageQueue(port1);
        expect(messageQueue).toBeInstanceOf(MessageQueue);
    });

    it('should call postMessage from the MessageChannel on post', () => {
        const postMessageMock = vi.fn();

        class PortMock {
            postMessage = postMessageMock;
            onmessage = vi.fn();
            onmessageerror = vi.fn();
        }

        const messageQueue = new MessageQueue(new PortMock() as unknown as MessagePort);
        messageQueue.post({ operation: 'test' });
        expect(postMessageMock).toHaveBeenCalledTimes(1);
    });

    it('should return message from port2', async () => {
        const channel = new MessageChannel();

        const messageQueue = new MessageQueue(channel.port1);

        const testResponse = { result: { data: { test: 'test' } } };
        channel.port2.postMessage(testResponse);

        const result = messageQueue.post({ operation: 'test' });
        expect(result).toEqual(testResponse);
    });

    it.fails('should trigger onmessage error on message sending error', async () => {
        const channel = new MessageChannel();
        const messageQueue = new MessageQueue(channel.port1);

        channel.port1.postMessage = () => {
            throw new Error('Simulated message sending error');
        };

        expect(() => messageQueue.post({ operation: 'test' })).rejects.toThrowError();
    });
});
