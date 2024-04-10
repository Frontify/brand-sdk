/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DocumentGroup } from '../types';
import { convertObjectCase } from '../utilities';

import { DocumentGroupApiDummy } from './DocumentGroupApiDummy';

export class DocumentGroupDummy {
    static with(id: number, numberOfDocuments = 0): DocumentGroup {
        return convertObjectCase(DocumentGroupApiDummy.with(id, numberOfDocuments), 'camel');
    }

    static withFields(fields: DocumentGroup): DocumentGroup {
        return {
            ...fields,
        };
    }
}
