/* (c) Copyright Frontify Ltd., all rights reserved. */

export type GetCurrentUserPayload = void;

export type GetCurrentUserResponse = {
    id: string;
    name?: string | null;
    avatar?: string | null;
    email: string;
};

export const getCurrentUser = (payload: GetCurrentUserPayload) => ({ name: 'getCurrentUser', payload });
