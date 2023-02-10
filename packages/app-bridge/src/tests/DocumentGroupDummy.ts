/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { DocumentGroup } from '../types';
import { convertObjectCase } from '../utilities';

import { DocumentGroupApiDummy } from './DocumentGroupApiDummy';

export class DocumentGroupDummy {
    static with(id: number, documents: number[]): DocumentGroup {
        return { ...convertObjectCase(DocumentGroupApiDummy.with(id), 'camel'), documents };
    }
}
