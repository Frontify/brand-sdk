/* (c) Copyright Frontify Ltd., all rights reserved. */

export type PlatformAppMethods = {
    currentUser: [{ name: 'currentUser' }, { id: string; name?: string | null; email: string; avatar: string }];
};
