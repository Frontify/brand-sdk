/* (c) Copyright Frontify Ltd., all rights reserved. */

export type User = {
    data: {
        currentUser: {
            id: string;
            email: string;
            avatar: string;
            name: string;
        };
    };
};
