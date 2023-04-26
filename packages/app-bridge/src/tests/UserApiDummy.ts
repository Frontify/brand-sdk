/* (c) Copyright Frontify Ltd., all rights reserved. */

import { UserApi } from '../types';

export class UserApiDummy {
    static with(id: number): UserApi {
        return {
            id,
            name: 'Frontify Dummy User',
            email: 'test@frontify.test',
            created: '2020-01-01T00:00:00.000Z',
            image: {
                image: 'https://dummy.frontify.test/image.png',
                original: 'https://dummy.frontify.test/original_image.png',
                x: '10',
                y: '20',
                width: '30',
                height: '40',
            },
            organization: 'Frontify',
            role: 'user',
            timezone: 'UTC',
            language: 'en',
        };
    }
}
