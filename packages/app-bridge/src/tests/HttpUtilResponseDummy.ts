/* (c) Copyright Frontify Ltd., all rights reserved. */

import { HttpUtilResponse } from '../utilities';

export class HttpUtilResponseDummy {
    static successWith<T>(data: T): HttpUtilResponse<T> {
        return {
            result: {
                success: true,
                data,
            },
        };
    }

    static success(): HttpUtilResponse<undefined> {
        return {
            result: {
                success: true,
                data: undefined,
            },
        };
    }

    static failure(): HttpUtilResponse<undefined> {
        return {
            result: {
                success: false,
                data: undefined,
            },
        };
    }
}
