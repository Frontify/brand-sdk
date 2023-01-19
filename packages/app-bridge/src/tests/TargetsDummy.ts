/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Targets } from '../types';
import { convertObjectCase } from '../utilities';
import { SingleTargetApiDummy } from './TargetsApiDummy';

export class TargetsDummy {
    static with(): Targets {
        const singleTargetApis = [
            SingleTargetApiDummy.target(1),
            SingleTargetApiDummy.target(2),
            SingleTargetApiDummy.target(3),
        ];

        return [...convertObjectCase(singleTargetApis, 'camel')];
    }
}
