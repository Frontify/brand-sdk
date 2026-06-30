/* (c) Copyright Frontify Ltd., all rights reserved. */

export type User = {
    id: number;
    name: string;
    email: string;
    image: {
        image: string;
        original: string;
        x: string;
        y: string;
        width: string;
        height: string;
    };
    created: string;
    role: string | null;
    language: string;
    timezone: string;
    organization: string;
};
