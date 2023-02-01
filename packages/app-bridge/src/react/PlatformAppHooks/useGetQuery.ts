/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useContext } from 'react';
import { PlatformAppProperties } from '../../types/PlatformApp';
import { PlatformAppContext } from '../PlatformApp';

/**
 * Returns a function to fetch
 * Data with handled Auth
 */
export const useGetQuery = (): ((query: string) => Promise<unknown>) => {
    // Here we would need to be sure that the token is available and valid
    const { token } = useContext<PlatformAppProperties>(PlatformAppContext);

    if (!token) {
        console.warn('No Authentication token available!');
    }

    return async (query: string) => {
        try {
            // Here lets use React Query instead of fetch
            const res = await fetch(getGraphQlEndpoint(token!.bearerToken.domain), {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token?.bearerToken.accessToken}`,
                },
                body: JSON.stringify({ query }),
            });

            return await res.json();
        } catch (error) {
            // What should be the error here?
            console.warn(error);
        }
    };
};

const getGraphQlEndpoint = (domain: string) => `https://${domain}/graphql`;
