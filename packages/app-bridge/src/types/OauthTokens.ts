/* (c) Copyright Frontify Ltd., all rights reserved. */

export type OauthTokens = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    name: string;
    token_type: 'Bearer';
};
