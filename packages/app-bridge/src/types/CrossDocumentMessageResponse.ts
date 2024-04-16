/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Topic } from './Topic';

export type CrossDocumentMessageResponse<T> = {
    success: boolean;
    topic: Topic;
    token: string;
    data?: T;
};
