/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { getProxyNetworkCall } from './GetProxyNetworkCall';

describe('GetProxyNetworkCall', () => {
    it('should return correct method name', () => {
        const TEST_ID = 'user-api';
        const proxyNetworkCall = getProxyNetworkCall({ id: TEST_ID, props: 'data' });
        expect(proxyNetworkCall.name).toBe('getProxyNetworkCall');
        expect(proxyNetworkCall.payload).toStrictEqual({
            id: TEST_ID,
            props: 'data',
        });
    });
});
