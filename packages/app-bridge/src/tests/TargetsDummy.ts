/* (c) Copyright Frontify Ltd., all rights reserved. */

// import { Targets } from '../types';
import { convertObjectCase } from '../utilities';

import { DocumentPageTargetsApiDummy, DocumentTargetsApiDummy } from './TargetsApiDummy';

export class DocumentTargetsDummy {
    static with(id: number) {
        return convertObjectCase(DocumentTargetsApiDummy.with(id).targets, 'camel');
    }
}

export class DocumentPageTargetsDummy {
    static with(id: number) {
        return convertObjectCase(DocumentPageTargetsApiDummy.with(id), 'camel');
    }
}
